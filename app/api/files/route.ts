import { NextResponse, NextRequest } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { files, NewFile } from '@/lib/db/schema';
import { and, eq, isNull } from 'drizzle-orm';

/**
 * API route to get files for the authenticated user.
 */
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
    // MODIFIED FOR DEBUGGING: This will print the full error to your server console.
    console.error("DETAILED ERROR in GET /api/files:", error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

/**
 * POST function to create a new file record.
 */
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { name, fileUrl, thumbnailUrl, size, type, mimeType, imageKitFileId, parentId, description } = body;

    const newFile: NewFile = {
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

    const [insertedFile] = await db.insert(files).values(newFile).returning();
    return NextResponse.json(insertedFile, { status: 201 });
  } catch (error) {
    // MODIFIED FOR DEBUGGING: This will print the full error to your server console.
    console.error("DETAILED ERROR in POST /api/files:", error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
