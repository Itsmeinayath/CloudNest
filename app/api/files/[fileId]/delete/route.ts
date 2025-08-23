import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { files } from '@/lib/db/schema';
import { and, eq, inArray } from 'drizzle-orm';

// A recursive function to find all descendant IDs of a folder
async function getAllDescendantIds(folderId: string, userId: string): Promise<string[]> {
  const idsToDelete: string[] = [folderId];
  const queue: string[] = [folderId];

  while (queue.length > 0) {
    const currentFolderId = queue.shift()!;
    
    const children = await db
      .select({ id: files.id, isFolder: files.isFolder })
      .from(files)
      .where(and(eq(files.userId, userId), eq(files.parentId, currentFolderId)));

    for (const child of children) {
      idsToDelete.push(child.id);
      if (child.isFolder) {
        queue.push(child.id);
      }
    }
  }
  return idsToDelete;
}


export async function DELETE(
  req: Request,
  props: { params: Promise<{ fileId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { fileId } = await props.params;
    if (!fileId) {
      return new NextResponse('File ID is required', { status: 400 });
    }

    // First, find the item to be deleted to check if it's a folder
    const [itemToDelete] = await db
      .select()
      .from(files)
      .where(and(eq(files.id, fileId), eq(files.userId, userId)));

    if (!itemToDelete) {
      return new NextResponse('File not found', { status: 404 });
    }

    let allIdsToTrash: string[] = [];

    if (itemToDelete.isFolder) {
      // If it's a folder, find all its descendants
      allIdsToTrash = await getAllDescendantIds(fileId, userId);
    } else {
      // If it's just a file, we only trash that one item
      allIdsToTrash = [fileId];
    }
    
    if (allIdsToTrash.length > 0) {
        // Perform the "soft delete" by archiving all identified files and folders
        await db
        .update(files)
        .set({ 
            isTrash: true,
            trashedAt: new Date(),
        })
        .where(and(
            eq(files.userId, userId),
            inArray(files.id, allIdsToTrash)
        ));
    }

    return new NextResponse('Item(s) moved to trash', { status: 200 });
    
  } catch (error) {
    console.error('[FILE_DELETE_ROUTE]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
