"use client";

import { useState, useRef } from 'react';
import { IKContext, IKUpload } from 'imagekitio-react';
import { UploadCloud, CheckCircle, AlertTriangle, Sparkles } from 'lucide-react';

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

  const handleUploadProgress = (progressEvent: { loaded: number; total: number; percent: number }) => {
    setProgress(progressEvent.percent);
  };

  const handleError = (err: unknown) => { // Changed 'any' to 'unknown'
    setStatus('error');
    setError('Upload failed. Please try again.');
    console.error("ImageKit Upload Error:", err);
  };

  const handleSuccess = async (res: Record<string, unknown>) => { // Changed 'any' to a more specific object type
    let caption = null;
    if (fileMimeTypeRef.current && fileMimeTypeRef.current.startsWith('image/')) {
        setStatus('generating');
        try {
            const captionResponse = await fetch('/api/gemini/generate-caption', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ imageUrl: res.url }),
            });
            if (!captionResponse.ok) throw new Error('Failed to generate AI caption.');
            const data = await captionResponse.json();
            caption = data.caption;
        } catch (captionError) {
            console.error("Caption generation failed:", captionError);
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

  const renderStatus = () => {
    switch (status) {
      case 'uploading':
        return (
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm">Uploading... {progress}%</span>
          </div>
        );
      case 'generating':
        return (
          <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span className="text-sm">Generating AI caption...</span>
          </div>
        );
      case 'success':
        return (
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm">Upload successful!</span>
          </div>
        );
      case 'error':
        return (
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm">{error}</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <IKContext
      publicKey={process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY}
      urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}
      authenticator={authenticator}
    >
      <div className="space-y-4">
        <div className="relative">
          <IKUpload
            fileName="uploaded-file"
            folder={currentFolder ? `/users/${currentFolder}` : '/users/root'}
            onUploadStart={handleUploadStart}
            onUploadProgress={handleUploadProgress}
            onSuccess={handleSuccess}
            onError={handleError}
            onChange={handleFileChange}
            style={{
              display: 'none'
            }}
            id="file-upload"
          />
          <label 
            htmlFor="file-upload"
            className="block w-full p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors cursor-pointer"
          >
            <UploadCloud className="w-8 h-8 mx-auto mb-2 text-gray-400 dark:text-gray-500" />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              Support for all file types
            </p>
          </label>
        </div>
        
        {status !== 'idle' && (
          <div className="mt-4">
            {renderStatus()}
          </div>
        )}
      </div>
    </IKContext>
  );
}
