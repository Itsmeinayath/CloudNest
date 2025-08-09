import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { imagekit } from '@/lib/imagekit'; // Your configured server-side ImageKit client

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

    // Upload image to ImageKit (no transformation here)
    const uploadResponse = await imagekit.upload({
      file: base64Image,
      fileName: fileName,
    });

    // Create transformed URL using ImageKit's URL endpoint
    const transformedUrl = imagekit.url({
      src: uploadResponse.url,
      transformation: [
        {
          height: 200,
          width: 200,
          quality: 80,
          crop: 'at_max',
        },
      ],
    });

    // Send both original and transformed URLs to frontend
    return NextResponse.json({
      originalUrl: uploadResponse.url,
      transformedUrl,
      fileId: uploadResponse.fileId,
    });

  } catch (error) {
    console.error('[UPLOAD_GENERATED_IMAGE_ROUTE]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
