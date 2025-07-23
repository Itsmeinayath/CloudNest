import { NextResponse, NextRequest } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { files } from '@/lib/db/schema';
import { and, eq, isNull } from 'drizzle-orm';

/**
 * API route to get files for the authenticated user,
 * supporting fetching from the root or a specific folder.
 */
export async function GET(req: NextRequest) {
  try {
    // 1. Authenticate the user. This is the source of truth.
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // 2. Get the parentId from the URL, if it exists.
    const parentId = req.nextUrl.searchParams.get("parentId");

    // 3. Build the database query conditions.
    // We ALWAYS filter by the authenticated userId for security.
    const conditions = [
        eq(files.userId, userId),
        eq(files.isTrash, false)
    ];

    // If a parentId is provided, add it to the query.
    // Otherwise, query for root files (where parentId is null).
    if (parentId) {
        conditions.push(eq(files.parentId, parentId));
    } else {
        conditions.push(isNull(files.parentId));
    }

    // 4. Fetch the files from the database with the combined conditions.
    const userFiles = await db
      .select()
      .from(files)
      .where(and(...conditions));

    // 5. Return the files as a JSON response.
    return NextResponse.json(userFiles);

  } catch (error) {
    console.error('[GET_FILES_ROUTE]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
