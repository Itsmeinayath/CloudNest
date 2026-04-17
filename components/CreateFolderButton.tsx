"use client";

import { useState } from 'react';
import { FolderPlus, X, Loader2 } from 'lucide-react';

type CreateFolderButtonProps = {
  parentId: string | null;
  onSuccess: () => void;
};

export default function CreateFolderButton({ parentId, onSuccess }: CreateFolderButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [folderName, setFolderName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!folderName.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/files', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: folderName,
          parentId: parentId,
          isFolder: true,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create folder.');
      }

      setIsOpen(false);
      setFolderName('');
      onSuccess();

    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors shadow-md shadow-indigo-600/20"
      >
        <FolderPlus className="w-4 h-4" />
        Create Folder
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative bg-[#1a1d25] border border-[rgba(255,255,255,0.08)] rounded-2xl shadow-2xl shadow-black/50 w-full max-w-md">
            <div className="flex items-center justify-between p-5 border-b border-[rgba(255,255,255,0.06)]">
              <h3 className="text-lg font-semibold text-white">Create New Folder</h3>
              <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-lg hover:bg-[#22252f] transition-colors">
                <X className="w-4 h-4 text-[#8b8fa3]" />
              </button>
            </div>
            <form onSubmit={handleCreateFolder}>
              <div className="p-5">
                <label htmlFor="folderName" className="text-sm font-medium text-[#8b8fa3] mb-2 block">
                  Folder Name
                </label>
                <input
                  id="folderName"
                  type="text"
                  value={folderName}
                  onChange={(e) => setFolderName(e.target.value)}
                  placeholder="e.g., Project Assets"
                  className="w-full bg-[#12141a] border border-[rgba(255,255,255,0.08)] rounded-lg px-3 py-2.5 text-[#f0f0f3] placeholder-[#5c6070] focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 transition-all"
                  autoFocus
                  required
                />
                {error && <p className="text-rose-400 text-sm mt-2">{error}</p>}
              </div>
              <div className="flex justify-end p-5 border-t border-[rgba(255,255,255,0.06)]">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors disabled:opacity-50 shadow-md shadow-indigo-600/20"
                >
                  {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isLoading ? 'Creating...' : 'Create Folder'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
