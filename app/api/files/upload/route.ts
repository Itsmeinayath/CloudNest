// 📤 DIRECT FILE UPLOAD API ROUTE  
// This handles file uploads directly to ImageKit and saves metadata to database

// 🧰 IMPORT NECESSARY TOOLS
import { db } from "@/lib/db";                            // Database connection - your data storage
import { files } from "@/lib/db/schema";                  // Database table schema for files and folders
import { auth } from "@clerk/nextjs/server";              // Clerk authentication - verify user identity
import { and, eq } from "drizzle-orm"                     // Drizzle ORM query operators for SQL conditions
import ImageKit from "imagekit";                          // ImageKit SDK for server-side operations
import { NextRequest, NextResponse } from "next/server";  // Next.js API route types
import { v4 as uuidv4 } from "uuid";                      // UUID generator for unique file names

// 🏭 IMAGEKIT CLIENT SETUP
// Initialize ImageKit with your account credentials (like connecting to your cloud storage)
const imagekit = new ImageKit({
    // 🔑 PUBLIC KEY - Safe to expose in frontend (identifies your ImageKit account)
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "",
    
    // 🔒 PRIVATE KEY - Must stay secret on server (gives full account access)
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
    
    // 🌐 URL ENDPOINT - Your ImageKit CDN URL (where files will be served from)
    urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "",
})

// 📝 MAIN API HANDLER FUNCTION
// This runs when someone POSTs to /api/files/upload (direct file upload)
export async function POST(request: NextRequest) {
    try {
        // 🔐 STEP 1: VERIFY USER AUTHENTICATION
        // Make sure only logged-in users can upload files
        const { userId } = await auth();
        if (!userId) {
            // User is not logged in - reject the request
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // 📦 STEP 2: PARSE FORM DATA FROM REQUEST
        // Extract file and metadata from the multipart form data
        const formData = await request.formData();
        const file = formData.get("file") as File;              // The actual file being uploaded
        const formUserId = formData.get("UserId") as string;    // User ID from form (should match auth)
        const parentId = formData.get("parentId") as string || null; // Parent folder ID (optional)
        
        // 📋 EXPECTED FORM DATA:
        // - file: The actual file (File object)
        // - UserId: User ID (should match authenticated user)
        // - parentId: Parent folder ID (optional, null = root level)

        // 🛡️ STEP 3: SECURITY CHECK - VERIFY USER OWNERSHIP
        // Make sure the user can only upload files for themselves
        if (formUserId !== userId) {
            // Someone is trying to upload files for another user - BLOCK IT!
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // ✅ STEP 4: VALIDATE FILE PRESENCE
        // Make sure a file was actually provided in the request
        if (!file) {
            // No file was uploaded - can't proceed
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        // 🔍 STEP 5: VALIDATE PARENT FOLDER (ONLY if specified)
        // If user wants to upload to a specific folder, verify that folder exists
        if (parentId) {
            // 🔎 QUERY: Find the parent folder in database
            const [parentFolder] = await db.select()
                .from(files)
                .where(
                    and(
                        eq(files.id, parentId),           // Must match the specified parent ID
                        eq(files.userId, userId),         // Must belong to the current user
                        eq(files.isFolder, true)          // Must actually be a folder (not a file)
                    )
                );
            
            // 🚨 PARENT VALIDATION: Check if parent folder exists and is valid
            if (!parentFolder) {
                // Parent folder doesn't exist, or user doesn't own it, or it's not a folder
                return NextResponse.json({ error: "Parent folder not found" }, { status: 404 });
            }
        }
        // ✅ 🔧 FIX #1: REMOVED the line that blocked root uploads!
        // OLD BUGGY CODE (REMOVED):
        // if (!parentId) {
        //     return NextResponse.json({ error: "Parent folder not found" }, { status: 404 });
        // }

        // 🔄 STEP 6: CONVERT FILE TO BUFFER
        // Convert the file to a buffer for ImageKit upload
        const buffer = await file.arrayBuffer()        // Get raw file data
        const fileBuffer = Buffer.from(buffer)         // Convert to Node.js Buffer

        // 📁 STEP 7: DETERMINE UPLOAD PATH
        // Create folder structure based on user and parent folder
        const folderPath = parentId 
            ? `/cloudnest/${userId}/folder/${parentId}`  // Inside specific folder
            : `/cloudnest/${userId}`;                    // Root level

        // 📂 STEP 8: EXTRACT AND VALIDATE FILE EXTENSION
        // Get file extension for validation
        const originalFileName = file.name;
        const fileExtension = originalFileName.split(".").pop()?.toLowerCase() || "";

        // 🛡️ STEP 9: SECURITY - VALIDATE ALLOWED FILE TYPES
        // Only allow safe file types to prevent malicious uploads
        const allowedExtensions = ["pdf", "jpg", "jpeg", "png", "gif", "mp4", "mov"];
        if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
            // File type not allowed - reject upload
            return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
        }

        // 🎲 STEP 10: GENERATE UNIQUE FILE NAME
        // Create unique filename to prevent conflicts
        const uniqueFileName = `${uuidv4()}.${fileExtension}`;  // 🔧 FIX #2: Use extension, not full name!
        
        // 🔧 FIX #2 EXPLANATION:
        // OLD BUGGY CODE: `${uuidv4()}.${file.name}` → "abc-123-uuid.my-photo.jpg"
        // NEW FIXED CODE: `${uuidv4()}.${fileExtension}` → "abc-123-uuid.jpg"

        // 📤 STEP 11: UPLOAD TO IMAGEKIT
        // Send file to ImageKit cloud storage
        const uploadResponse = await imagekit.upload({
            file: fileBuffer,                          // The file buffer
            fileName: uniqueFileName,                  // Unique name to prevent conflicts
            folder: folderPath,                        // Folder path in ImageKit
            useUniqueFileName: false,                  // We're already making names unique
        })

        // 🏗️ STEP 12: PREPARE FILE DATA FOR DATABASE
        // Create the file record that will be saved to database
        const fileData = {
            name: originalFileName,                    // Keep original name for display
            path: uploadResponse.filePath,             // ImageKit file path
            size: file.size,                          // File size in bytes
            type: file.type,                          // MIME type
            fileUrl: uploadResponse.url,              // Direct access URL
            thumbnailUrl: uploadResponse.thumbnailUrl || null, // Thumbnail URL (if available)
            userId: userId,                           // File owner
            parentId: parentId,                       // Parent folder (null = root)
            isFolder: false,                          // This is a file, not folder
            isStarred: false,                         // Not starred by default
            isTrash: false,                           // 🔧 FIX #3: Changed from "isTrashed" to "isTrash" (match schema)
            // 🔧 FIX #4: REMOVED createdAt - schema handles this automatically with defaultNow()
        }

        // 💾 STEP 13: SAVE TO DATABASE
        // Insert file record into database and get the created record
        const [newfile] = await db.insert(files).values(fileData).returning();
        
        // 🎉 STEP 14: SUCCESS RESPONSE
        // Send back the created file data
        return NextResponse.json(newfile, { status: 201 }); // 🔧 FIX #5: Added 201 status for created resource

    } catch (error) {
        // 🚨 ERROR HANDLING
        // Log error for debugging and send user-friendly response
        console.error("File upload error:", error);           // 🔧 FIX #6: Added error logging for debugging
        return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
    }
}

// 🎯 HOW THIS API WORKS:
//
// 1. 📤 DIRECT UPLOAD FLOW:
//    User selects file → Frontend sends to this API → API uploads to ImageKit → Saves metadata to DB
//
// 2. 🏠 ROOT LEVEL UPLOADS:
//    parentId = null → Upload to `/cloudnest/userId/` → Saved with parentId = null
//
// 3. 📁 FOLDER UPLOADS:
//    parentId = "folder_123" → Validate folder exists → Upload to `/cloudnest/userId/folder/folder_123/`
//
// 4. 🛡️ SECURITY FEATURES:
//    - User authentication required
//    - File type validation (only safe extensions)
//    - Parent folder ownership verification
//    - User can only upload to their own account