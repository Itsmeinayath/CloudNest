"use client";
import Image from 'next/image';
import { useState } from 'react';
import { X, Sparkles, Loader2, Save, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';

type GenerateImageModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void; // To refresh the file list after saving
  currentFolderId: string | null;
};

export default function GenerateImageModal({ isOpen, onClose, onSuccess, currentFolderId }: GenerateImageModalProps) {
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const response = await fetch('/api/gemini/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate image. Please try a different prompt.');
      }

      const data = await response.json();
      setGeneratedImage(`data:image/png;base64,${data.imageBase64}`);

    } catch (err: unknown) {
      setError('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveToCloudNest = async () => {
    if (!generatedImage) return;
    
    setIsSaving(true);
    setError(null);

    try {
      // Step 1: Upload the generated base64 image to ImageKit via our secure backend
      const uploadResponse = await fetch('/api/imagekit/upload-generated', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
              base64Image: generatedImage,
              fileName: `${prompt.substring(0, 20).replace(/\s/g, '_')}_${Date.now()}.png`,
          }),
      });

      if (!uploadResponse.ok) {
          throw new Error('Failed to upload the generated image.');
      }

      const imageKitData = await uploadResponse.json();

      // Step 2: Save the new file's metadata to our database
      await fetch('/api/files', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: imageKitData.name,
          fileUrl: imageKitData.url,
          thumbnailUrl: imageKitData.thumbnailUrl,
          size: imageKitData.size,
          type: "file",
          mimeType: imageKitData.mimeType,
          imageKitFileId: imageKitData.fileId,
          parentId: currentFolderId,
          description: `AI-generated image based on the prompt: "${prompt}"`,
        }),
      });
      
      // Step 3: Close the modal and refresh the file list
      onClose();
      onSuccess();

    } catch (err: any) {
        setError(err.message || "Failed to save the image.");
    } finally {
        setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg flex flex-col max-h-[90vh]"
      >
        <div className="flex-shrink-0 flex items-center justify-between p-4 border-b dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            AI Image Generation
          </h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
        
        <div className="p-6 flex-1 overflow-y-auto">
          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label htmlFor="prompt" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Describe the image you want to create
              </label>
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., A majestic lion wearing a crown, photorealistic style"
                className="w-full h-24 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || isSaving}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors disabled:bg-purple-400 dark:disabled:bg-purple-800"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
              {isLoading ? 'Generating...' : 'Generate Image'}
            </button>
          </form>

          {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}

          <div className="mt-6">
            {isLoading && (
              <div className="w-full h-64 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center animate-pulse">
                <ImageIcon className="w-12 h-12 text-gray-400 dark:text-gray-500" />
              </div>
            )}
            {generatedImage && (
              <div className="space-y-4">
                <img src={generatedImage} alt="AI generated image" className="w-full object-contain rounded-lg border dark:border-gray-700 mx-auto" />
                <button
                  onClick={handleSaveToCloudNest}
                  disabled={isSaving}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:bg-blue-400"
                >
                  {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  {isSaving ? 'Saving...' : 'Save to CloudNest'}
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
