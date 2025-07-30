import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { imagekit } from "@/lib/imagekit"; // Use our shared, server-side client

export async function GET() {
  try {
    // 1. Authenticate the user
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Generate secure, time-limited upload credentials
    const authParams = imagekit.getAuthenticationParameters();
    
    // 3. Send the credentials to the frontend
    return NextResponse.json(authParams);
    
  } catch (error) {
    console.error("Error in GET /imagekit-auth:", error);
    return NextResponse.json(
      { error: "Failed to generate authentication parameters" }, 
      { status: 500 }
    );
  }
}
