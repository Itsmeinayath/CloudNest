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

    // Validate that the URL looks like an image URL
    if (!imageUrl.startsWith('http://') && !imageUrl.startsWith('https://')) {
      return new NextResponse('Invalid image URL format', { status: 400 });
    }
    
    // 1. Fetch the image data from the URL
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
        return new NextResponse(`Failed to fetch image data: ${imageResponse.status}`, { status: 500 });
    }
    
    const contentType = imageResponse.headers.get('content-type');
    if (!contentType || !contentType.startsWith('image/')) {
        return new NextResponse('URL does not point to a valid image', { status: 400 });
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
                mimeType: contentType,
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

    // 3. Use the correct model and API endpoint with fallback
    const models = ["gemini-1.5-pro", "gemini-1.5-flash", "gemini-pro-vision"];
    let geminiResponse;
    let modelUsed;
    
    for (const modelName of models) {
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
        
        // 4. Call the Gemini API
        geminiResponse = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        
        if (geminiResponse.ok) {
            modelUsed = modelName;
            console.log(`Successfully connected using model: ${modelName}`);
            break;
        } else {
            const errorText = await geminiResponse.text();
            console.warn(`Model ${modelName} failed:`, {
                status: geminiResponse.status,
                statusText: geminiResponse.statusText,
                error: errorText
            });
        }
    }

    if (!geminiResponse.ok) {
        const errorText = await geminiResponse.text();
        console.error("All Gemini models failed:", {
            status: geminiResponse.status,
            statusText: geminiResponse.statusText,
            error: errorText,
            modelsAttempted: models
        });
        return new NextResponse(`Failed to get response from Gemini API: ${geminiResponse.status} ${geminiResponse.statusText}`, { status: 500 });
    }

    const result = await geminiResponse.json();
    
    // Debug logging for response structure
    console.log("Gemini API Response structure:", {
        modelUsed,
        hasCandidates: !!result.candidates,
        candidatesLength: result.candidates?.length,
        firstCandidate: result.candidates?.[0] ? {
            hasContent: !!result.candidates[0].content,
            partsLength: result.candidates[0].content?.parts?.length
        } : null
    });
    
    // 5. Extract and return the caption
    const caption = result.candidates?.[0]?.content?.parts?.[0]?.text || "No caption generated.";
    
    if (caption === "No caption generated.") {
        console.warn("No caption generated. Full response:", JSON.stringify(result, null, 2));
    }

    return NextResponse.json({ caption });

  } catch (error) {
    console.error('[GEMINI_CAPTION_ROUTE]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
