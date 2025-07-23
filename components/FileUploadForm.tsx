"use client";

import { useState } from 'react';
import { IKContext, IKUpload } from 'imagekit-javascript/react';
import { UploadCloud, File, CheckCircle, AlertTriangle } from 'lucide-react';

// Define the props the component will accept
interface FileUploadFormProps {
  userId: string;
  currentFolder: string | null;
  onUploadSuccess: () => void;
}

// This is the function that the IKContext will call to get auth credentials.
const authenticator = async () => {
    const response = await fetch('/api/imagekit-auth');
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Request failed with status ${response.status}: ${errorText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Authentication request failed:", error);
    throw new Error("Failed to authenticate with ImageKit.");
  }
};

export default function FileUploadForm({ userId, currentFolder, onUploadSuccess }: FileUploadFormProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleUploadStart = () => {
    setIsUploading(true);
    setError(null);
    setSuccess(false);
    setProgress(0);
  };

 Concept const handleUploadProgress = (progress: any) => {
    setProgress(progress.percent);
  };

  const handleError = (err: any) => {
    setIsUploading(false);
    setError('Upload failed. Please try again.');
    console.error("ImageKit Upload Error:", err);
  };

  const handleSuccess = async (res: any) => {
    // This function is called by ImageKit after a successful upload.
    // 'res' contains all the metadata about the uploaded file.
    setIsUploading(false);
    setSuccess(true);

    // Now, we save this metadata to our own database.
    try {
      await fetch('/api/files', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: res.name,
          fileUrl: res.url,
          thumbnailUrl: res.thumbnailUrl,
          size: res.size,
          type: "file", // You can enhance this later
          mimeType: res.mimeType,
          imageKitFileId: res.fileId,
          parentId: currentFolder,
          // The userId is handled securely on the backend from the session.
        }),
      });
      
      // Tell the parent component (DashboardContent) that we're done,
      // so it can refresh the file list.
      onUploadSuccess();
    } catch (dbError) {
      console.error("Failed to save file metadata:", dbError);
      setError("File uploaded but failed to save. Please contact support.");
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
          className="relative flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          {isUploading ? (
            <div className="text-center">
              <p className="text-sm text-gray-700 dark:text-gray-300">Uploading...</p>
              <div className="w-32 bg-gray-200 rounded-full h-2.5 dark:bg-gray-600 mt-2">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{Math.round(progress)}%</p>
            </div>
          ) : success ? (
            <div className="text-center text-green-500">
              <CheckCircle className="w-10 h-10 mx-auto" />
              <p className="mt-2 font-semibold">Upload Complete!</p>
            </div>
          ) : error ? (
             <div className="text-center text-red-500">
              <AlertTriangle className="w-10 h-10 mx-auto" />
              <p className="mt-2 font-semibold">{error}</p>
            </div>
          ) : (
            <div className="text-center text-gray-500 dark:text-gray-400">
              <UploadCloud className="w-10 h-10 mx-auto" />
              <p className="mt-2 text-sm"><span className="font-semibold">Click to upload</span> or drag and drop</p>
              <p className="text-xs">Any file type, up to 100MB</p>
            </div>
          )}
          <IKUpload
            id="file-upload"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onUploadStart={handleUploadStart}
            onUploadProgress={handleUploadProgress}
            onSuccess={handleSuccess}
            onError={handleError}
            validateFile={(file: File) => file.size < 100 * 1024 * 1024} // 100MB limit
          />
        </label>
      </div>
    </IKContext>
  );
}
