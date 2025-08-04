"use client";

import { useState, useRef } from 'react';
import { IKContext, IKUpload } from 'imagekitio-react';
import { UploadCloud, CheckCircle, AlertTriangle, Sparkles } from 'lucide-react';

interface FileUploadFormProps {
  userId: string;
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

export default function FileUploadForm({ userId, currentFolder, onUploadSuccess }: FileUploadFormProps) {
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

  const handleUploadProgress = (progressEvent: any) => {
    setProgress(progressEvent.loaded / progressEvent.total * 100);
  };

  const handleError = (err: any) => {
    setStatus('error');
    setError('Upload failed. Please try again.');
    console.error("ImageKit Upload Error:", err);
  };

  const handleSuccess = async (res: any) => {
    let caption = null;
    if (fileMimeTypeRef.current && fileMimeTypeRef.current.startsWith('image/')) {
        setStatus('generating');
        try {
            const captionResponse = await fetch('/api/gemini/generate-caption', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ imageUrl: res.url }),
            });
            if (!captionResponse.ok) {
                // THE FIX: Read the text from the response to get our debug message.
                const errorText = await captionResponse.text();
                throw new Error(errorText);
            }
            const data = await captionResponse.json();
            caption = data.caption;
        } catch (captionError: any) {
            console.error("Caption generation failed:", captionError);
            // Display the specific error message from our debug API.
            setError(captionError.message);
            setStatus('error'); // Show the error state
            // We stop here because we are debugging.
            return; 
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
          description: caption,
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

  const renderStatus = (): React.ReactNode => {
    // Example status rendering logic (replace with your actual logic)
    switch (status) {
      case 'uploading':
        return (
          <div className="flex flex-col items-center">
            <UploadCloud className="w-8 h-8 text-blue-500 mb-2" />
            <span>Uploading... {progress.toFixed(0)}%</span>
          </div>
        );
      case 'generating':
        return (
          <div className="flex flex-col items-center">
            <Sparkles className="w-8 h-8 text-purple-500 mb-2" />
            <span>Generating caption...</span>
          </div>
        );
      case 'success':
        return (
          <div className="flex flex-col items-center">
            <CheckCircle className="w-8 h-8 text-green-500 mb-2" />
            <span>Upload successful!</span>
          </div>
        );
      case 'error':
        return (
          <div className="flex flex-col items-center">
            <AlertTriangle className="w-8 h-8 text-red-500 mb-2" />
            <span>{error || "An error occurred."}</span>
          </div>
        );
      default:
        return (
          <div className="flex flex-col items-center">
            <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
            <span>Click or drag file to upload</span>
          </div>
        );
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
