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
