// 📂 FILE RETRIEVAL API ROUTE
// This fetches files and folders from your CloudNest database

// 🧰 IMPORT NECESSARY TOOLS
import { db } from "@/lib/db";                            // Database connection - your data storage
import { files } from "@/lib/db/schema";                  // Database table schema for files and folders
import { auth } from "@clerk/nextjs/server";              // Clerk authentication - verify user identity
import { eq, and, isNull } from "drizzle-orm";            // Drizzle ORM query operators for SQL conditions
import { NextRequest, NextResponse } from "next/server";  // Next.js API route types

// 📝 MAIN API HANDLER FUNCTION
// This runs when someone makes a GET request to /api/files (to fetch files/folders)
export async function GET(request: NextRequest) {
    try {
        // 🔐 STEP 1: VERIFY USER AUTHENTICATION
        // Make sure only logged-in users can access files
        const { userId } = await auth();
        if (!userId) {
            // User is not logged in - reject the request
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // 📦 STEP 2: PARSE URL PARAMETERS
        // Extract query parameters from the URL (?userId=123&parentId=abc)
        const searchParams = request.nextUrl.searchParams
        const queryUserId = searchParams.get("userId");     // Which user's files to fetch
        const parentId = searchParams.get("parentId");      // Which folder to look inside (optional)
        
        // 📋 EXPECTED URL FORMATS:
        // GET /api/files?userId=user_123                           // Get root level files
        // GET /api/files?userId=user_123&parentId=folder_abc       // Get files inside specific folder

        // 🛡️ STEP 3: SECURITY CHECK - VERIFY USER OWNERSHIP
        // Make sure users can only access their own files
        if (!queryUserId || queryUserId !== userId) {
            // Someone is trying to access another user's files - BLOCK IT!
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // 🔍 STEP 4: FETCH FILES FROM DATABASE
        // Query the database based on whether we're looking in a specific folder or root level
        let userFiles;

        if (parentId) {
            // 📁 SCENARIO A: FETCHING FILES FROM A SPECIFIC FOLDER
            // User clicked on a folder and wants to see what's inside it
            userFiles = await db
                .select()                                   // Get all columns
                .from(files)                                // From the files table
                .where(
                    and(                                    // Multiple conditions (AND logic)
                        eq(files.userId, userId),           // 1. Must belong to current user
                        eq(files.parentId, parentId)        // 2. Must be inside the specified folder
                    )
                )
            
            // 🔍 SQL EQUIVALENT:
            // SELECT * FROM files 
            // WHERE user_id = 'current_user' AND parent_id = 'specific_folder'
        }
        else {
            // 🏠 SCENARIO B: FETCHING ROOT LEVEL FILES
            // User is viewing the main file browser (no folder selected)
            userFiles = await db
                .select()                                   // Get all columns
                .from(files)                                // From the files table
                .where(
                    and(                                    // Multiple conditions (AND logic)
                        eq(files.userId, userId),           // 1. Must belong to current user
                        isNull(files.parentId)              // 2. Must be at root level (no parent folder)
                    )
                )
            
            // 🔍 SQL EQUIVALENT:
            // SELECT * FROM files 
            // WHERE user_id = 'current_user' AND parent_id IS NULL
        }

        // 🎉 STEP 5: SUCCESS RESPONSE
        // Send back the found files/folders to the frontend
        return NextResponse.json(userFiles);
        
        // 📋 RESPONSE FORMAT:
        // [
        //   {
        //     "id": "file_123",
        //     "name": "my-photo.jpg",
        //     "type": "image/jpeg",
        //     "size": 1024000,
        //     "fileUrl": "https://ik.imagekit.io/...",
        //     "isFolder": false,
        //     "isStarred": false,
        //     "createdAt": "2023-12-01T10:30:00Z",
        //     // ... other file properties
        //   },
        //   {
        //     "id": "folder_456",
        //     "name": "Documents",
        //     "isFolder": true,
        //     // ... other folder properties
        //   }
        // ]

    } catch (error) {
        // 🚨 ERROR HANDLING
        // If anything goes wrong during the database query, log it and send error response
        console.error("Error fetching files:", error);      // ✅ ADDED: Helpful for debugging
        return NextResponse.json(
            { error: "Error while fetching files" }, 
            { status: 500 }                                // 500 = Internal Server Error
        );
    }
}

// 🎯 HOW THIS API WORKS IN YOUR APP:
//
// 1. 🏠 ROOT LEVEL BROWSING:
//    User opens file manager → Frontend calls GET /api/files?userId=123
//    → API returns all root level files and folders
//
// 2. 📁 FOLDER NAVIGATION:
//    User clicks on "Documents" folder → Frontend calls GET /api/files?userId=123&parentId=docs_folder_id
//    → API returns all files inside Documents folder
//
// 3. 🔄 BREADCRUMB NAVIGATION:
//    User clicks "Back" or breadcrumb → Frontend calls appropriate API based on navigation level