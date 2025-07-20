import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm"
import ImageKit from "imagekit";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";


// Initialize ImageKit with your account credentials (like connecting to your cloud storage)
const imagekit = new ImageKit({
    // 🔑 PUBLIC KEY - Safe to expose in frontend (identifies your ImageKit account)
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "",     // ⚠️ FIXED: Correct env var name

    // 🔒 PRIVATE KEY - Must stay secret on server (gives full account access)
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",

    // 🌐 URL ENDPOINT - Your ImageKit CDN URL (where files will be served from)
    urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "",  // ⚠️ FIXED: Correct env var name
})

export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            // User is not logged in - reject the request
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        //Parse the form data from the request
        // This is where the file upload happens
        // The form data should include the file and any additional metadata like userId or parentId
        const formData = await request.formData();
        const file = formData.get("file") as File;
        const formUserId = formData.get("UserId") as string;
        const ParentId = formData.get("parentId") as string || null;


    } catch (error) {

    }
}


