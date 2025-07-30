import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { files } from '@/lib/db/schema';
import { and, eq } from 'drizzle-orm';

/**
 * API route to restore all files from the trash for the authenticated user.
 */
export async function PATCH(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Update all files that belong to the user and are in the trash.
    // Set isTrash to false and clear the trashedAt timestamp.
    await db
      .update(files)
      .set({
        isTrash: false,
        trashedAt: null,
      })
      .where(and(eq(files.userId, userId), eq(files.isTrash, true)));

    return NextResponse.json({ success: true, message: "All files restored." });

  } catch (error) {
    console.error('[RESTORE_ALL_ROUTE]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
