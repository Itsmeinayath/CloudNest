// 🧰 IMPORT CLERK AUTHENTICATION TOOLS
// These are the security guards for your app
import { 
  clerkMiddleware,     // Main authentication middleware - checks every request
  createRouteMatcher,  // Helper to define which routes are public vs protected
  auth                // Function to get current user information
} from '@clerk/nextjs/server'

// 🌐 DEFINE PUBLIC ROUTES (No Authentication Required)
// Think of these as the "lobby" of your building - anyone can enter
const isPublicRoute = createRouteMatcher([
    "/",                    // Home page - anyone can visit
    "/sign-in(.*)",        // Sign-in page and any sub-routes (/sign-in/forgot-password, etc.)
    "/sign-up(.*)"         // Sign-up page and any sub-routes (/sign-up/verify-email, etc.)
])

// 🛡️ MAIN SECURITY GUARD FUNCTION
// This runs on EVERY request to your app before any page loads
export default clerkMiddleware(async(auth, request) => {
    
    // 👤 GET CURRENT USER INFORMATION
    // Like checking someone's ID card at the door
    const user = auth()                    // Get authentication object
    const userId = (await user).userId     // Extract the user's unique ID
    const url = new URL(request.url)       // Get the URL they're trying to visit

    // 🚪 REDIRECT LOGIC: If user is logged in but visiting public pages
    // "Hey, you're already signed in! Let's send you to your dashboard instead"
    if (userId && isPublicRoute(request) && url.pathname !== "/") {
        // Conditions explained:
        // userId = User is authenticated (logged in)
        // isPublicRoute(request) = They're visiting a public page (sign-in/sign-up)
        // url.pathname !== "/" = But NOT the home page (home page is okay to visit when logged in)
        
        // Redirect them to dashboard since they're already authenticated
        return Response.redirect(new URL("/dashboard", request.url))
    }

    // 🔐 PROTECTION LOGIC: Protect all non-public routes
    // "You need to be logged in to enter this area"
    if (!isPublicRoute(request)) {
        // If they're trying to visit a protected route (like /dashboard, /settings, etc.)
        // Make sure they're authenticated first
        await auth.protect()  // This will redirect to sign-in if not authenticated
    }
    
    // ✅ If we get here, either:
    // 1. User is visiting a public route (allowed)
    // 2. User is authenticated and visiting a protected route (allowed)
    // 3. User was redirected appropriately
})

// ⚙️ CONFIGURATION: Tell Next.js when to run this middleware
export const config = {
  matcher: [
    // 🎯 INCLUDE: Run middleware on these patterns
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Translation: "Run on all routes EXCEPT Next.js internals (_next) and static files (images, CSS, etc.)"
    
    // 🔌 ALWAYS RUN: On API routes
    '/(api|trpc)(.*)',
    // Translation: "Always check authentication on API calls and tRPC routes"
  ],
}