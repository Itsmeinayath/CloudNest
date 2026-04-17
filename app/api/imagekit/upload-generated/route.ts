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

    // Check if thumbnailUrl is missing and try to generate one manually
    let finalResponse = imageKitResponse;
    if (!imageKitResponse.thumbnailUrl) {
      console.log('[UPLOAD_GENERATED_IMAGE] No thumbnail URL, attempting to generate one manually...');
      
      // Generate a thumbnail URL using ImageKit's URL-based transformations
      // This creates a thumbnail by appending transformation parameters to the main image URL
      const baseUrl = imageKitResponse.url;
      const thumbnailUrl = baseUrl.replace(/(\.[^.]+)$/, '') + '?tr=w-150,h-150,c-at_max,f-auto';
      
      finalResponse = {
        ...imageKitResponse,
        thumbnailUrl: thumbnailUrl
      };
      
      console.log('[UPLOAD_GENERATED_IMAGE] Generated manual thumbnail URL:', thumbnailUrl);
    }

    // Send the successful response from ImageKit back to the frontend
    return NextResponse.json(finalResponse);

  } catch (error) {
    console.error('[UPLOAD_GENERATED_IMAGE_ROUTE] Detailed error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
