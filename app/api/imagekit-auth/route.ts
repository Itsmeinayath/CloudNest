// 🔐 IMAGEKIT AUTHENTICATION API ROUTE
// This generates secure authentication parameters for frontend ImageKit uploads

// 🧰 IMPORT NECESSARY TOOLS
import { auth } from "@clerk/nextjs/server";      // Clerk authentication - verify user identity
import { NextResponse } from "next/server";      // Next.js API response helper
import ImageKit from "imagekit";                 // ImageKit SDK for server-side operations

// 🏭 IMAGEKIT CLIENT SETUP
// Initialize ImageKit with your account credentials (like connecting to your cloud storage)
const imagekit = new ImageKit({
    // 🔑 PUBLIC KEY - Safe to expose in frontend (identifies your ImageKit account)
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "",     // ⚠️ FIXED: Correct env var name
    
    // 🔒 PRIVATE KEY - Must stay secret on server (gives full account access)
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
    
    // 🌐 URL ENDPOINT - Your ImageKit CDN URL (where files will be served from)
    urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "",  // ⚠️ FIXED: Correct env var name
})

// 📡 API ROUTE HANDLER - Responds to GET requests to /api/imagekit-auth
export async function GET() {
    try {
        // 🔐 STEP 1: VERIFY USER AUTHENTICATION
        // Make sure only logged-in users can get upload permissions
        const { userId } = await auth()
        if (!userId) {
            // User is not authenticated - deny access
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // 🎫 STEP 2: GENERATE AUTHENTICATION PARAMETERS
        // Create secure, time-limited upload credentials for the frontend
        const authParams = imagekit.getAuthenticationParameters()
        
        // What getAuthenticationParameters() returns:
        // {
        //   token: "unique-secure-token",           // One-time upload token
        //   expire: 1234567890,                     // Expiration timestamp (usually 1 hour)
        //   signature: "hashed-signature"           // Security signature to prevent tampering
        // }
        
        // 📤 STEP 3: SEND AUTHENTICATION DATA TO FRONTEND
        // Frontend will use these params to securely upload files to ImageKit
        return NextResponse.json(authParams);
        
    } catch (error) {
        // 🚨 ERROR HANDLING
        // Log the error for debugging and send user-friendly response
        console.error("Error in GET /imagekit-auth:", error);
        return NextResponse.json(
            { error: "Failed to generate authentication parameters" }, 
            { status: 500 }
        );
    }
}

// 🎯 HOW THIS API WORKS IN YOUR APP:
// 
// 1. 📱 FRONTEND UPLOAD FLOW:
//    User selects file → Frontend calls this API → Gets auth params → Uploads to ImageKit
//
// 2. 🔄 AUTHENTICATION DANCE:
//    Frontend: "I want to upload a file"
//    This API: "Are you logged in?" → "Yes" → "Here are your upload credentials"
//    Frontend: Uses credentials to upload directly to ImageKit
//
// 3. 🛡️ SECURITY BENEFITS:
//    - No private keys exposed to frontend
//    - Time-limited upload permissions
//    - User must be authenticated to get upload rights
//    - Each upload token can only be used once