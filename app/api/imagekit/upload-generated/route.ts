import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { imagekit, generateThumbnailUrl } from '@/lib/imagekit'; // Import our shared client and thumbnail helper

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { base64Image, fileName } = await req.json();
    if (!base64Image || !fileName) {
      return new NextResponse('Image data and file name are required', { status: 400 });
    }

    // Use the server-side ImageKit SDK to securely upload the base64 string
    const imageKitResponse = await imagekit.upload({
      file: base64Image,
      fileName: fileName,
      folder: `/cloudnest/${userId}/ai-generated`, // Organize AI-generated images in a specific folder
      useUniqueFileName: false, // Use the provided fileName as-is since it's already unique
      isPrivateFile: false, // Make sure images are publicly accessible for thumbnails
      // Note: ImageKit should automatically generate thumbnailUrl for images, but we'll ensure it exists
    });

    // Ensure thumbnail URL exists - if ImageKit didn't generate one, create it manually
    if (!imageKitResponse.thumbnailUrl && imageKitResponse.url) {
      // Generate thumbnail using transformations for AI-generated images (PNG format)
      const generatedThumbnail = generateThumbnailUrl(imageKitResponse.url, 'image/png');
      if (generatedThumbnail) {
        imageKitResponse.thumbnailUrl = generatedThumbnail;
      }
    }

    // Return the response with proper thumbnail URL
    return NextResponse.json(imageKitResponse);

  } catch (error) {
    console.error('[UPLOAD_GENERATED_IMAGE_ROUTE]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
