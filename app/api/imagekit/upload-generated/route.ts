import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { imagekit } from '@/lib/imagekit'; // Use our shared server-side client

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
      // Force thumbnail generation for all image types
      tags: ['ai-generated', 'thumbnail-required']
    });

    // Log the response to help debug thumbnail issues
    console.log('[UPLOAD_GENERATED_IMAGE] ImageKit response:', {
      fileId: imageKitResponse.fileId,
      name: imageKitResponse.name,
      url: imageKitResponse.url,
      thumbnailUrl: imageKitResponse.thumbnailUrl,
      size: imageKitResponse.size,
      fileType: imageKitResponse.fileType
    });

    // Send the successful response from ImageKit back to the frontend
    return NextResponse.json(imageKitResponse);

  } catch (error) {
    console.error('[UPLOAD_GENERATED_IMAGE_ROUTE] Detailed error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
