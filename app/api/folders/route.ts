// 📁 FOLDER CREATION API ROUTE
// This creates new folders in your CloudNest file system

// 🧰 IMPORT NECESSARY TOOLS
import { db } from "@/lib/db";                            // Database connection - your data storage
import { files } from "@/lib/db/schema";                  // Database table schema for files and folders
import { auth } from "@clerk/nextjs/server";              // Clerk authentication - verify user identity
import { error } from "console";                          // ❌ UNUSED IMPORT - can be removed

import { eq, and } from "drizzle-orm"                     // Drizzle ORM query operators for SQL conditions
import { NextRequest, NextResponse } from "next/server";  // Next.js API route types
import { v4 as uuidv4 } from "uuid"                       // UUID generator for unique folder IDs

// 📝 MAIN API HANDLER FUNCTION
// This runs when someone POSTs to /api/folders (to create a new folder)
export async function POST(request: NextRequest) {
    try {
        // 🔐 STEP 1: VERIFY USER AUTHENTICATION
        // Make sure only logged-in users can create folders
        const { userId } = await auth()
        if (!userId) {
            // User is not logged in - reject the request
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // 📦 STEP 2: PARSE THE REQUEST DATA
        // Extract folder creation information from the frontend request
        const body = await request.json()
        const { name, userId: bodyUserId, parentId = null } = body;
        
        // 📋 EXPECTED REQUEST BODY FORMAT:
        // {
        //   "name": "My New Folder",        // Name for the new folder
        //   "userId": "user_123456",        // User creating the folder
        //   "parentId": "folder_abc123"     // Parent folder ID (optional, null = root level)
        // }

        // 🛡️ STEP 3: SECURITY CHECK - VERIFY USER OWNERSHIP
        // Make sure the user can only create folders for themselves
        if (bodyUserId !== userId) {
            // Someone is trying to create folders for another user - BLOCK IT!
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // ✅ STEP 4: VALIDATE FOLDER NAME
        // Make sure we have a valid, non-empty folder name
        if (!name || typeof name !== "string" || name.trim() === "") {
            // Invalid folder name - can't create folder without proper name
            return NextResponse.json(
                { error: "Folder name is required" },
                { status: 400 } // 400 = Bad Request (client error)
            );
        }

        // 🔍 STEP 5: VALIDATE PARENT FOLDER (if specified)
        // If user wants to create folder inside another folder, verify that parent exists
        if (parentId) {
            // 🔎 QUERY: Find the parent folder in database
            const [parentFolder] = await db
                .select()
                .from(files)
                .where(
                    and(
                        eq(files.id, parentId),           // Must match the specified parent ID
                        eq(files.userId, userId),         // Must belong to the current user
                        eq(files.isFolder, true)          // Must actually be a folder (not a file)
                    )
                )
            
            // 🚨 PARENT VALIDATION: Check if parent folder exists and is valid
            if (!parentFolder) {
                // Parent folder doesn't exist, or user doesn't own it, or it's not a folder
                return NextResponse.json({ error: "Parent folder not found" }, { status: 404 });
            }
        }

        // 🏗️ STEP 6: PREPARE FOLDER DATA FOR DATABASE
        // Create the folder record that will be saved to database
        const folderData = {
            // 🆔 UNIQUE IDENTIFIER
            id: uuidv4(),                                           // Generate unique folder ID
            
            // 📄 BASIC FOLDER INFORMATION
            name: name.trim(),                                      // Clean folder name (remove extra spaces)
            path: `/folders/${userId}/${uuidv4()}`,                 // ⚠️ FIXED: Template literal syntax
            size: 0,                                               // Folders start with 0 size
            type: "folder",                                        // Mark as folder type
            
            // 🔗 URLS (Not needed for folders)
            fileUrl: "",                                           // Folders don't have file URLs
            thumbnailUrl: "",                                      // Folders don't need thumbnails
            
            // 👤 USER & ORGANIZATION INFO
            userId,                                                // Owner of the folder
            parentId,                                              // Parent folder (null = root level)
            
            // 🏷️ FOLDER STATUS FLAGS
            isFolder: true,                                        // This IS a folder
            isStarred: false,                                      // Not starred by default
            isTrash: false,                                        // Not in trash by default
        }

        // 💾 STEP 7: SAVE FOLDER TO DATABASE
        // Insert the folder record into our database and get the created record back
        const [newFolder] = await db.insert(files).values(folderData).returning();

        // 🎉 STEP 8: SUCCESS RESPONSE
        // Send back the created folder data with success message
        return NextResponse.json({
            success: true,
            message: "Folder created successfully",
            folder: newFolder
        })

    } catch (error) {
        // 🚨 ERROR HANDLING - Complete this section!
        // If anything goes wrong during the process, log it and send error response
        console.error("Error creating folder:", error);            // ✅ ADDED: Error logging
        return NextResponse.json(                                  // ✅ ADDED: Error response
            { error: "Failed to create folder" },
            { status: 500 } // 500 = Internal Server Error
        );
    }
}

// 🎯 HOW THIS API WORKS IN YOUR APP:
//
// 1. 👤 User clicks "New Folder" in your file manager
// 2. 📝 Frontend shows folder name input dialog
// 3. 📡 Frontend calls POST /api/folders with folder name and parent
// 4. 🔐 This API verifies user and validates data
// 5. 📁 API creates folder record in database
// 6. 🎉 Frontend receives new folder data and updates UI