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
      // THE FIX: Request both TEXT and IMAGE modalities as required by the model.
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

    const imagePart = result.candidates?.[0]?.content?.parts?.find((part: any) => part.inlineData);
    const imageBase64 = imagePart?.inlineData?.data;

    if (!imageBase64) {
      console.error("No image data found in Gemini response:", result);
      return new NextResponse('No image data received from API', { status: 500 });
    }

    return NextResponse.json({ imageBase64 });

  // 🔧 FIX: Replace 'any' with proper type
} catch (error: unknown) {  // Changed from: } catch (error: any) {
  console.error("Error generating image:", error);
  const errorMessage = error instanceof Error ? error.message : "Unknown error";
  return NextResponse.json({ error: errorMessage }, { status: 500 });
}
}
