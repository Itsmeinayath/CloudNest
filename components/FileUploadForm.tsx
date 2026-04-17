"use client";

import { useState, useRef } from 'react';
import { IKContext, IKUpload } from 'imagekitio-react';
import { UploadCloud, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';

interface FileUploadFormProps {
  currentFolder: string | null;
  onUploadSuccess: () => void;
}

const authenticator = async () => {
  try {
    const response = await fetch('/api/imagekit-auth');
    if (!response.ok) throw new Error("Authentication failed");
    return await response.json();
  } catch (error) {
    console.error("Auth request failed:", error);
    throw error;
  }
};

export default function FileUploadForm({ currentFolder, onUploadSuccess }: FileUploadFormProps) {
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const fileMimeTypeRef = useRef<string | null>(null);

  const handleFileChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    if (evt.target.files && evt.target.files[0]) {
      fileMimeTypeRef.current = evt.target.files[0].type;
    }
  };

  const handleUploadStart = () => {
    setStatus('uploading');
    setError(null);
  };

  const handleError = (err: unknown) => {
    setStatus('error');
    setError('Upload failed. Please try again.');
    console.error("ImageKit Upload Error:", err);
  };

  const handleSuccess = async (res: any) => {
    try {
      const dbResponse = await fetch('/api/files', {
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
        }),
      });

      if (!dbResponse.ok) {
        throw new Error("Failed to save file metadata.");
      }
      
      setStatus('success');
      setTimeout(() => {
        onUploadSuccess();
        setStatus('idle');
      }, 1500);

    } catch (dbError) {
      console.error("DB save error:", dbError);
      setError("File uploaded but failed to save.");
      setStatus('error');
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
          className="relative flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.15)] rounded-xl cursor-pointer transition-colors bg-[#0e1015]"
        >
          {status === 'idle' && <UploadCloud className="w-8 h-8 text-[#5c6070]" />}
          {status === 'uploading' && <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />}
          {status === 'success' && <CheckCircle className="w-8 h-8 text-emerald-400" />}
          {status === 'error' && <AlertTriangle className="w-8 h-8 text-rose-400" />}
          <p className="mt-2 text-xs text-[#5c6070]">{error || (status === 'idle' ? 'Drop files here or click to upload' : status)}</p>
          
          <IKUpload
            id="file-upload"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={status === 'uploading'}
            onChange={handleFileChange}
            onUploadStart={handleUploadStart}
            onSuccess={handleSuccess}
            onError={handleError}
          />
        </label>
      </div>
    </IKContext>
  );
}
