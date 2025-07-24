import { NextResponse, NextRequest } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { files, NewFile } from '@/lib/db/schema';
import { and, eq, isNull } from 'drizzle-orm';

// --- GET Function (no changes here) ---
export async function GET(req: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    const parentId = req.nextUrl.searchParams.get("parentId");
    const conditions = [eq(files.userId, userId), eq(files.isTrash, false)];
    if (parentId) {
      conditions.push(eq(files.parentId, parentId));
    } else {
      conditions.push(isNull(files.parentId));
    }
    const userFiles = await db.select().from(files).where(and(...conditions));
    return NextResponse.json(userFiles);
  } catch (error) {
    console.error('[GET_FILES_ROUTE]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// --- POST Function (updated to accept description) ---
export async function POST(req: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    // Destructure the new 'description' field from the body
    const { name, fileUrl, thumbnailUrl, size, type, mimeType, imageKitFileId, parentId, description } = body;

    const newFile: NewFile = {
      name,
      userId,
      fileUrl,
      thumbnailUrl,
      size,
      type,
      mimeType,
      imageKitFileId,
      parentId: parentId || null,
      description: description || null, // Add the description here
      isFolder: false,
      isStarred: false,
      isTrash: false,
    };

    const [insertedFile] = await db.insert(files).values(newFile).returning();
    return NextResponse.json(insertedFile, { status: 201 });
  } catch (error) {
    console.error('[POST_FILES_ROUTE]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
