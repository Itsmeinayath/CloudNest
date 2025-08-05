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
      // You can add folder paths or tags here if you wish
    });

    // Send the successful response from ImageKit back to the frontend
    return NextResponse.json(imageKitResponse);

  } catch (error) {
    console.error('[UPLOAD_GENERATED_IMAGE_ROUTE]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
