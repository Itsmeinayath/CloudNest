import { NextResponse, NextRequest } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { files, NewFile } from '@/lib/db/schema';
import { and, eq, isNull } from 'drizzle-orm';

// GET function remains the same...
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const parentId = req.nextUrl.searchParams.get("parentId");
    const filter = req.nextUrl.searchParams.get("filter");

    const conditions = [eq(files.userId, userId)];

    if (filter === 'trash') {
      conditions.push(eq(files.isTrash, true));
    } else if (filter === 'starred') {
      conditions.push(eq(files.isTrash, false), eq(files.isStarred, true));
    } else {
      conditions.push(eq(files.isTrash, false));
      if (parentId) {
        conditions.push(eq(files.parentId, parentId));
      } else {
        conditions.push(isNull(files.parentId));
      }
    }

    const userFiles = await db.select().from(files).where(and(...conditions));
    return NextResponse.json(userFiles);
    
  } catch (error) {
    console.error("DETAILED ERROR in GET /api/files:", error);
    return new NextResponse('Internal ServerError', { status: 500 });
  }
}

/**
 * POST function now correctly handles the mimeType.
 */
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    
    // THE FIX: Use const for destructured variables and let for name
    const { parentId, isFolder, fileUrl, thumbnailUrl, size, type, mimeType, imageKitFileId, description } = body;
    let { name } = body;

    // If the name is missing (especially for AI generated images), create a fallback name.
    if (!name && description) {
      name = description.substring(0, 30).replace(/\s/g, '_') + '.png';
    } else if (!name) {
      name = `file_${Date.now()}`; // A generic fallback if all else fails
    }

    let newRecord: NewFile;

    if (isFolder) {
      newRecord = {
        name,
        userId,
        isFolder: true,
        parentId: parentId || null,
        path: name,
        size: 0,
        type: 'folder',
        isShared: false,
        isStarred: false,
        isTrash: false,
        fileUrl: null,
        thumbnailUrl: null,
        mimeType: null,
        imageKitFileId: null,
        description: null,
      };
    } else {
      newRecord = {
        name,
        userId,
        path: name,
        fileUrl,
        thumbnailUrl,
        size,
        type,
        mimeType,
        imageKitFileId,
        parentId: parentId || null,
        description: description || null,
        isFolder: false,
        isStarred: false,
        isTrash: false,
        isShared: false,
      };
    }

    const [insertedRecord] = await db.insert(files).values(newRecord).returning();
    return NextResponse.json(insertedRecord, { status: 201 });
  } catch (error) {
    console.error("DETAILED ERROR in POST /api/files:", error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
