"use client";

import React from 'react';
import { IKContext } from 'imagekitio-react';

interface FileUploadFormProps {
  // 'userId' was unused, so it has been removed.
  currentFolder: string | null;
  onUploadSuccess: () => void;
}

const authenticator = async () => {
  try {
    const response = await fetch('/api/imagekit-auth');
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Authentication request failed: ${errorText}`);
    }
    const data = await response.json();
    if (!data.signature || !data.expire || !data.token) {
      throw new Error("Invalid authentication response from server.");
    }
    return data;
  } catch (error) {
    console.error("Authentication request failed:", error);
    throw new Error("Failed to authenticate with ImageKit.");
  }
};

export default function FileUploadForm({ currentFolder, onUploadSuccess }: FileUploadFormProps) {
  // Suppress unused variables warning - these parameters are required by the interface
  void currentFolder;
  void onUploadSuccess;

  return (
    <IKContext
      publicKey={process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY}
      urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}
      authenticator={authenticator}
    >
      {/* ... JSX remains the same ... */}
    </IKContext>
  );
}
