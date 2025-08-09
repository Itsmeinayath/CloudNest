import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { imageUrl } = await req.json();
    if (!imageUrl) {
      return new NextResponse('Image URL is required', { status: 400 });
    }
    
    // 1. Fetch the image data from the URL
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
        return new NextResponse('Failed to fetch image data', { status: 500 });
    }
    const imageBuffer = await imageResponse.arrayBuffer();
    const base64ImageData = Buffer.from(imageBuffer).toString('base64');

    // 2. Prepare the payload for the Gemini API
    const payload = {
      contents: [
        {
          parts: [
            { text: "Generate a concise, one-sentence caption for this image. Describe the main subject and setting. Be descriptive but not overly long." },
            {
              inlineData: {
                mimeType: imageResponse.headers.get('content-type') || 'image/jpeg',
                data: base64ImageData,
              },
            },
          ],
        },
      ],
    };

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return new NextResponse('Gemini API key is not configured', { status: 500 });
    }

    // 3. Use the correct model and API endpoint
    const modelName = "gemini-1.5-flash-latest";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

    // 4. Call the Gemini API
    const geminiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!geminiResponse.ok) {
        const errorText = await geminiResponse.text();
        console.error("Gemini API Error:", errorText);
        return new NextResponse('Failed to get response from Gemini API', { status: 500 });
    }

    const result = await geminiResponse.json();
    
    // 5. Extract and return the caption
    const caption = result.candidates?.[0]?.content?.parts?.[0]?.text || "No caption generated.";

    return NextResponse.json({ caption });

  } catch (error) {
    console.error('[GEMINI_CAPTION_ROUTE]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
