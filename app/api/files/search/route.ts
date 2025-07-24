import { NextResponse, NextRequest } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { files } from '@/lib/db/schema';
import { and, eq, or, ilike, isNotNull } from 'drizzle-orm';

/**
 * API route to search for files based on a query.
 * It searches both the file name and the AI-generated description.
 */
export async function GET(req: NextRequest) {
  try {
    // 1. Authenticate the user.
    const { userId } =await  auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // 2. Get the search query from the URL parameters.
    const query = req.nextUrl.searchParams.get("q");
    if (!query) {
      return new NextResponse('Search query is required', { status: 400 });
    }

    // 3. Perform the database search.
    const searchResults = await db
      .select()
      .from(files)
      .where(
        and(
          eq(files.userId, userId),
          eq(files.isTrash, false),
          // Search condition:
          // EITHER the file's name contains the query
          // OR the file's description is not null AND contains the query.
          or(
            ilike(files.name, `%${query}%`),
            and(
                isNotNull(files.description),
                ilike(files.description, `%${query}%`)
            )
          )
        )
      );

    // 4. Return the search results.
    return NextResponse.json(searchResults);

  } catch (error) {
    console.error('[SEARCH_FILES_ROUTE]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
