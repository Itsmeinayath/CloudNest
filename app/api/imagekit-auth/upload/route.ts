import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { user } from "@heroui/theme";
import { NextRequest, NextResponse } from "next/server";
import { th } from "zod/v4/locales";

export async function Post(request: NextRequest) {
    try {
        const { userId } = await auth()
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        //Parse request body

        const body = await request.json()
        const {imagekit,userId:bodyUserId} = body

        if(bodyUserId !== userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if(!imagekit || !imagekit.url){
            return NextResponse.json({ error: "Invalid file upload data" }, { status: 401 });
        }

        const fileData = {
            name: imagekit.name || "Untitled",
            path:imagekit.filePath || "/cloudnest/${userId}/${imagekit.name}",
            size:imagekit.size || 0,
            type: imagekit.fileType || "image/jpeg",
            fileUrl:imagekit.url,
            thumbnailUrl: imagekit.thumbnailUrl || null,
            userId: userId,
            parentId: imagekit.parentId || null,
            isFolder: false,
            isStarred: false,
            isTrashed: false,
        }

        // Insert file data into the database
        const [newFile] = await db.insert(files).values(fileData).returning();
        return NextResponse.json(newFile, { status: 201 });
        

    } catch (error) {
        return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });

    }
}