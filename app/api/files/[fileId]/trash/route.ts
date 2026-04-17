import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { imagekit } from "@/lib/imagekit";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
export async function PATCH(
    req: Request,
    props: { params: Promise<{ fileId: string }> }
) {
    try {
        //1. authenticate user
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        //2.get the fileId from the url
        const { fileId } = await props.params;
        if (!fileId) {
            return NextResponse.json({ error: "File ID is required" }, { status: 400 });
        }

        //3. check if the file exists. belongs to the user and is in the trash
        const [file] = await db
            .select()
            .from(files)
            .where(
                and(
                    eq(files.id, fileId),
                    eq(files.userId, userId),
                    eq(files.isTrash, true) // Check if the file is already in the trash
                )
            )
        if (!file) {
            return NextResponse.json({ error: "File not found in trash" }, { status: 404 });
        }

        await db
            .update(files)
            .set({
                isTrash: false,
                trashedAt: null,
            })
            .where(
                and(
                    eq(files.id, fileId),
                    eq(files.userId, userId)
                )
            );
        // 6. return a success response
        return NextResponse.json({ message: "File restored successfully" }, { status: 200 });

    } catch (error) {
        console.error("Error restoring file:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// permenantly delete file

export async function DELETE(
    req: Request,
    props: { params: Promise<{ fileId: string }> }
)
{
    try {
            // 1
            const {userId} =  await auth();
            if(!userId) {
                return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
            }

            // 2. get the fileId from the url
            const {fileId} = await props.params;
            if(!fileId) {
                return NextResponse.json({ error: "File ID is required" }, { status: 400 });
            }

            // 3. check if the file exists, belongs to the user and is in the trash
            const [file] =  await db
            .select()
            .from(files)
            .where(
                and(
                    eq(files.id, fileId),
                    eq(files.userId, userId),
                    eq(files.isTrash, true) // Ensure the file is in the trash
                )
            )

            if(!file) {
                return NextResponse.json({ error: "File not found in trash" }, { status: 404 });
            }

            // 4. Permanently delete the file from the ImageKit storage
            if(file.imageKitFileId) {
                await imagekit.deleteFile(file.imageKitFileId);                
            }

            await db
            .delete(files)
            .where(
                and(
                    eq(files.id, fileId),
                    eq(files.userId, userId)
                )
            );

            // 5. Return a success response
            return NextResponse.json({ message: "File permanently deleted successfully" }, { status: 200 });

        
    } catch (error) {
        console.error("[File permanet delete route]", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
        
    }
}