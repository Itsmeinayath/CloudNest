"use client";

import { useState, useRef } from 'react';
import { IKContext, IKUpload } from 'imagekitio-react';
import { UploadCloud, CheckCircle, AlertTriangle, Sparkles } from 'lucide-react';

interface FileUploadFormProps {
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
  const [status, setStatus] = useState<'idle' | 'uploading' | 'generating' | 'success' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileMimeTypeRef = useRef<string | null>(null);

  const handleFileChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    if (evt.target.files && evt.target.files[0]) {
      const file = evt.target.files[0];
      fileMimeTypeRef.current = file.type;
    }
  };

  const handleUploadStart = () => {
    setStatus('uploading');
    setError(null);
    setProgress(0);
  };

  const handleUploadProgress = (evt: ProgressEvent) => {
     if (evt.lengthComputable) {
      const percent = (evt.loaded / evt.total) * 100;
      setProgress(percent);
    }
  };

  const handleError = (err: unknown) => {
    setStatus('error');
    setError('Upload failed. Please try again.');
    console.error("ImageKit Upload Error:", err);
  };

  const handleSuccess = async (res: Record<string, any>) => {
    setStatus('generating');
    let caption = null;

    // THE FIX: Re-added the AI caption generation logic
    if (fileMimeTypeRef.current && fileMimeTypeRef.current.startsWith('image/')) {
      try {
        const captionResponse = await fetch('/api/gemini/generate-caption', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageUrl: res.url }),
        });
        if (!captionResponse.ok) {
          throw new Error('Failed to generate AI caption.');
        }
        const data = await captionResponse.json();
        caption = data.caption;
      } catch (captionError) {
        console.error("Caption generation failed:", captionError);
        // Don't block the upload, just proceed without a caption
        setError("AI caption failed, but file was saved.");
      }
    }

    try {
      await fetch('/api/files', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: res.name,
          fileUrl: res.url,
          thumbnailUrl: res.thumbnailUrl,
          size: res.size,
          type: "file",
          mimeType: fileMimeTypeRef.current,
          imageKitFileId: res.fileId,
          parentId: currentFolder,
          description: caption, // Send the caption to the backend
        }),
      });
      
      setStatus('success');
      setTimeout(() => {
        onUploadSuccess();
        setStatus('idle');
      }, 1500);

    } catch (dbError) {
      console.error("Failed to save file metadata:", dbError);
      setError("File uploaded but failed to save.");
      setStatus('error');
    }
  };

  const renderStatus = () => {
    switch (status) {
        case 'uploading':
          return <div className="text-center">Uploading... {Math.round(progress)}%</div>;
        case 'generating':
          return <div className="text-center text-purple-500 animate-pulse"><Sparkles className="w-10 h-10 mx-auto" /><p className="mt-2 font-semibold">Generating Caption...</p></div>;
        case 'success':
          return <div className="text-center text-green-500"><CheckCircle className="w-10 h-10 mx-auto" /><p className="mt-2 font-semibold">Success!</p></div>;
        case 'error':
          return <div className="text-center text-red-500"><AlertTriangle className="w-10 h-10 mx-auto" /><p className="mt-2 font-semibold">{error}</p></div>;
        default:
          return <div className="text-center text-gray-500 dark:text-gray-400"><UploadCloud className="w-10 h-10 mx-auto" /><p className="mt-2 text-sm"><span className="font-semibold">Click to upload</span> or drag and drop</p></div>;
      }
  };

  return (
    <IKContext
      publicKey={process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY}
      urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}
      authenticator={authenticator}
    >
      <div className="flex flex-col items-center justify-center w-full">
        <label
          htmlFor="file-upload"
          className="relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer"
        >
          {renderStatus()}
          <IKUpload
            id="file-upload"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={status !== 'idle' && status !== 'error'}
            onChange={handleFileChange}
            onUploadStart={handleUploadStart}
            onUploadProgress={handleUploadProgress}
            onSuccess={handleSuccess}
            onError={handleError}
          />
        </label>
      </div>
    </IKContext>
  );
}
