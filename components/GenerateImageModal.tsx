"use client";

import { useState } from 'react';
import { X, Sparkles, Loader2, Save, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';

type GenerateImageModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
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
      if (!response.ok) throw new Error('Failed to generate image.');
      const data = await response.json();
      setGeneratedImage(`data:image/png;base64,${data.imageBase64}`);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveToCloudNest = async () => {
    if (!generatedImage) return;
    setIsSaving(true);
    setError(null);
    try {
      const uploadResponse = await fetch('/api/imagekit/upload-generated', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          base64Image: generatedImage,
          fileName: `${prompt.substring(0, 20).replace(/\s/g, '_')}_${Date.now()}.png`,
        }),
      });
      if (!uploadResponse.ok) throw new Error('Failed to upload.');
      const imageKitData = await uploadResponse.json();
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
          description: `AI-generated image: "${prompt}"`,
        }),
      });
      onClose();
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Failed to save.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative bg-[#1a1d25] border border-[rgba(255,255,255,0.08)] rounded-2xl shadow-2xl shadow-black/50 w-full max-w-lg"
      >
        <div className="flex items-center justify-between p-5 border-b border-[rgba(255,255,255,0.06)]">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-violet-400" />
            AI Image Generation
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#22252f] transition-colors">
            <X className="w-4 h-4 text-[#8b8fa3]" />
          </button>
        </div>
        <div className="p-6">
          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label htmlFor="prompt" className="text-sm font-medium text-[#8b8fa3] mb-2 block">
                Describe the image you want to create
              </label>
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., A majestic lion wearing a crown"
                className="w-full h-24 bg-[#12141a] border border-[rgba(255,255,255,0.08)] rounded-lg px-3 py-2.5 text-[#f0f0f3] placeholder-[#5c6070] focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500/50 transition-all resize-none"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || isSaving}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-violet-600 hover:bg-violet-500 rounded-lg transition-colors disabled:opacity-50 shadow-md shadow-violet-600/20"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {isLoading ? 'Generating...' : 'Generate Image'}
            </button>
          </form>
          {error && <p className="text-rose-400 text-sm mt-4 text-center">{error}</p>}
          <div className="mt-6">
            {isLoading && (
              <div className="w-full h-64 bg-[#12141a] border border-[rgba(255,255,255,0.06)] rounded-xl flex items-center justify-center animate-pulse">
                <ImageIcon className="w-10 h-10 text-[#22252f]" />
              </div>
            )}
            {generatedImage && (
              <div className="space-y-4">
                <img src={generatedImage} alt="AI generated" className="w-full rounded-xl border border-[rgba(255,255,255,0.06)]" />
                <button
                  onClick={handleSaveToCloudNest}
                  disabled={isSaving}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors disabled:opacity-50 shadow-md shadow-indigo-600/20"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
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
