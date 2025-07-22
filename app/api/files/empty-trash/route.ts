import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { files } from '@/lib/db/schema';
import { and, eq, inArray } from 'drizzle-orm';
import { imagekit } from '@/lib/imagekit';

/**
 * API route to empty the user's trash.
 * This permanently deletes all files marked as `isTrash: true`.
 */
export async function DELETE(req: Request) {
  try {
    // 1. Authenticate the user
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Find all trashed files for the current user
    const trashedFiles = await db
      .select({
        id: files.id,
        imageKitFileId: files.imageKitFileId,
      })
      .from(files)
      .where(and(eq(files.userId, userId), eq(files.isTrash, true)));

    // 3. If there's nothing in the trash, we're done.
    if (trashedFiles.length === 0) {
      return NextResponse.json({ message: 'Trash is already empty.' });
    }

    // 4. Extract the ImageKit file IDs for bulk deletion
    const imageKitFileIds = trashedFiles
      .map((file) => file.imageKitFileId)
      .filter((id): id is string => id !== null && id !== undefined);

    // 5. Delete the files from ImageKit storage in bulk (using the correct method name)
    if (imageKitFileIds.length > 0) {
      // CORRECTED: The method is bulkDeleteFiles
      await imagekit.bulkDeleteFiles(imageKitFileIds);
    }

    // 6. Extract the database IDs for bulk deletion
    const dbFileIds = trashedFiles.map((file) => file.id);

    // 7. Delete the file records from the database in bulk
    if (dbFileIds.length > 0) {
      await db
        .delete(files)
        .where(
          and(
            eq(files.userId, userId),
            inArray(files.id, dbFileIds)
          )
        );
    }

    // 8. Return a success response
    return NextResponse.json({ success: true, message: "Trash emptied successfully." });

  } catch (error) {
    console.error('[EMPTY_TRASH_DELETE]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
