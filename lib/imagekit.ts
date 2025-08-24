import ImageKit from "imagekit";

// This is the central, server-side ImageKit client for your entire application.
// By creating it here, you only have to initialize it once.
// All other server-side files will import this `imagekit` instance.

export const imagekit = new ImageKit({
  // The '!' tells TypeScript that we are sure these environment variables will exist.
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
});

/**
 * Generate a thumbnail URL for different file types using ImageKit transformations
 * @param fileUrl - The original file URL from ImageKit
 * @param mimeType - The MIME type of the file
 * @returns A thumbnail URL or null if not supported
 */
export function generateThumbnailUrl(fileUrl: string, mimeType: string): string | null {
  if (!fileUrl) return null;

  // For images, ImageKit should automatically provide thumbnails, but if not, create one
  if (mimeType?.startsWith('image/')) {
    // Generate a small thumbnail using transformations
    const url = new URL(fileUrl);
    // Add transformation parameters: width=200, height=200, crop mode=maintain aspect ratio
    url.searchParams.set('tr', 'w-200,h-200,c-at_max');
    return url.toString();
  }

  // For PDF files, generate thumbnail from first page
  if (mimeType === 'application/pdf') {
    const url = new URL(fileUrl);
    // Transform PDF: page 1, convert to JPG, resize to 200x200
    url.searchParams.set('tr', 'pg-1,f-jpg,w-200,h-200,c-at_max');
    return url.toString();
  }

  // For video files, generate thumbnail from first frame
  if (mimeType?.startsWith('video/')) {
    const url = new URL(fileUrl);
    // Transform video: first frame, convert to JPG, resize to 200x200
    url.searchParams.set('tr', 'so-0,f-jpg,w-200,h-200,c-at_max');
    return url.toString();
  }

  // For other file types, no thumbnail can be generated
  return null;
}
