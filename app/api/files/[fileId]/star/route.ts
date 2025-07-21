// ⭐ FILE STAR/FAVORITE TOGGLE API ROUTE
// This toggles the "starred" (favorite) status of files in your CloudNest

// 🧰 IMPORT NECESSARY TOOLS
import { NextRequest, NextResponse } from "next/server"; // Next.js API route types
import { auth } from "@clerk/nextjs/server";             // Clerk authentication - verify user identity
import { db } from "@/lib/db";                           // Database connection - your data storage
import { files } from "@/lib/db/schema";                 // Database table schema for files and folders
import { eq, and } from "drizzle-orm";                   // Drizzle ORM query operators for SQL conditions

// 📝 MAIN API HANDLER FUNCTION
// This runs when someone makes a PATCH request to /api/files/[fileId]/star
export async function PATCH(
  request: NextRequest,                                  // ✅ CORRECT: Incoming request object
  props: { params: Promise<{ fileId: string }> }        // URL parameters (fileId from the path)
) {
  try {
    // 🔐 STEP 1: VERIFY USER AUTHENTICATION
    // Make sure only logged-in users can star/unstar files
    const { userId } = await auth();
    if (!userId) {
      // User is not logged in - reject the request
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 📦 STEP 2: EXTRACT FILE ID FROM URL PARAMETERS
    // Get the fileId from the URL path /api/files/[fileId]/star
    const { fileId } = await props.params;

    if (!fileId) {
      // No file ID provided in URL - invalid request
      return NextResponse.json(
        { error: "File ID is required" },
        { status: 400 }
      );
    }

    // 🔍 STEP 3: FIND THE FILE AND VERIFY OWNERSHIP
    // Query database to get the current file and verify user owns it
    const [file] = await db
      .select()                                         // Get all file columns
      .from(files)                                      // From the files table
      .where(and(                                       // Multiple conditions (AND logic)
        eq(files.id, fileId),                          // 1. Must match the specified file ID
        eq(files.userId, userId)                       // 2. Must belong to the current user (SECURITY!)
      ));

    // 🚨 STEP 4: VALIDATE FILE EXISTS AND USER OWNS IT
    if (!file) {
      // File doesn't exist OR user doesn't own it - deny access
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // 🎯 STEP 5: TOGGLE THE STAR STATUS
    // Switch between starred (true) and not starred (false)
    const updatedFiles = await db
      .update(files)
      .set({ isStarred: !file.isStarred })              // Toggle the isStarred boolean
      .where(eq(files.id, fileId))                     // Only update the specified file
      .returning();                                     // Return the updated file record

    // 📤 STEP 6: RETURN THE UPDATED FILE DATA
    // Send back the updated file information as JSON response
    return NextResponse.json(updatedFiles[0], { status: 200 });
  } catch (error) {
    // 🔥 ERROR HANDLING
    // Log the error for debugging
    console.error("Error toggling star status:", error);

    // Respond with a generic error message
    return NextResponse.json(
      { error: "Failed to toggle star status" },
      { status: 500 }
    );
  }
}