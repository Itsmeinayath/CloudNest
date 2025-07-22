import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { files } from '@/lib/db/schema';
import { and, eq } from 'drizzle-orm';

/**
 * API route to move a file to the trash (soft delete).
 * This is handled by a DELETE request to /api/files/[fileId]/delete
 * It updates the file's `isTrash` status and sets the `trashedAt` timestamp.
 */
export async function DELETE(
  req: Request,
  { params }: { params: { fileId: string } }
) {
  try {
    // 1. Authenticate the user
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // 2. Get the fileId from the URL
    const { fileId } = params;
    if (!fileId) {
      return new NextResponse('File ID is required', { status: 400 });
    }

    // 3. Verify the file exists and belongs to the user before proceeding
    const [file] = await db
      .select()
      .from(files)
      .where(and(eq(files.id, fileId), eq(files.userId, userId)));

    // 4. If no file is found, return a 404
    if (!file) {
      return new NextResponse('File not found', { status: 404 });
    }

    // 5. Perform the "soft delete" by updating the trash status and timestamp
    await db
      .update(files)
      .set({ 
        isTrash: true,
        trashedAt: new Date(), // Set the time it was moved to trash
      })
      .where(and(eq(files.id, fileId), eq(files.userId, userId)));

    // 6. Return a success response
    return new NextResponse('File moved to trash', { status: 200 });
    
  } catch (error) {
    console.error('[FILE_DELETE_ROUTE]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
