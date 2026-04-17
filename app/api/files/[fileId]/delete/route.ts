import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { files } from '@/lib/db/schema';
import { and, eq, inArray } from 'drizzle-orm';

// A recursive function to find all descendant IDs of a folder
async function getAllDescendantIds(folderId: string, userId: string): Promise<string[]> {
  // CORRECTED: Changed 'let' to 'const' as these are not reassigned.
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
  { params }: { params: { fileId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { fileId } = params;
    if (!fileId) {
      return new NextResponse('File ID is required', { status: 400 });
    }

    const [itemToDelete] = await db
      .select()
      .from(files)
      .where(and(eq(files.id, fileId), eq(files.userId, userId)));

    if (!itemToDelete) {
      return new NextResponse('File not found', { status: 404 });
    }

    let allIdsToTrash: string[] = [];

    if (itemToDelete.isFolder) {
      allIdsToTrash = await getAllDescendantIds(fileId, userId);
    } else {
      allIdsToTrash = [fileId];
    }
    
    if (allIdsToTrash.length > 0) {
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
