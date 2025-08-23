import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { prompt } = await req.json();
    if (!prompt) {
      return new NextResponse('Prompt is required', { status: 400 });
    }

    const payload = {
      contents: [{
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        responseModalities: ['TEXT', 'IMAGE']
      },
    };

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return new NextResponse('Gemini API key not configured', { status: 500 });
    }

    const modelName = "gemini-2.0-flash-preview-image-generation";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini Image Generation API Error:", errorText);
      return new NextResponse('Failed to generate image', { status: 500 });
    }

    const result = await response.json();

    const imagePart = result.candidates?.[0]?.content?.parts?.find((part: { inlineData?: { data: string } }) => part.inlineData);
    const imageBase64 = imagePart?.inlineData?.data;

    if (!imageBase64) {
      console.error("No image data found in Gemini response:", result);
      return new NextResponse('No image data received from API', { status: 500 });
    }

    return NextResponse.json({ imageBase64 });

  } catch (error) {
    console.error('[GENERATE_IMAGE_ROUTE]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
