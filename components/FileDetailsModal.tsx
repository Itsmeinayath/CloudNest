"use client";

import type { File as FileType } from '@/lib/db/schema';
import { X, Calendar, FileText, Bot, ArrowDownToLine } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type FileDetailsModalProps = {
  file: FileType | null;
  onClose: () => void;
};

export default function FileDetailsModal({ file, onClose }: FileDetailsModalProps) {
  if (!file) return null;

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative bg-[#1a1d25] border border-[rgba(255,255,255,0.08)] rounded-2xl shadow-2xl shadow-black/50 w-full max-w-sm"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-5 border-b border-[rgba(255,255,255,0.06)]">
            <h3 className="text-lg font-semibold text-white">File Details</h3>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#22252f] transition-colors">
              <X className="w-4 h-4 text-[#8b8fa3]" />
            </button>
          </div>
          <div className="p-6 space-y-4">
            {file.thumbnailUrl && (
              <img src={file.thumbnailUrl} alt={file.name} className="w-full h-40 object-cover rounded-xl mb-4 border border-[rgba(255,255,255,0.06)]" />
            )}
            <div>
              <h4 className="font-bold text-base text-white break-words">{file.name}</h4>
            </div>
            <div className="text-sm text-[#8b8fa3] space-y-3 border-t border-[rgba(255,255,255,0.06)] pt-4">
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4 text-[#5c6070]" />
                <span>Type: {file.mimeType || 'Folder'}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <ArrowDownToLine className="w-4 h-4 text-[#5c6070]" />
                <span>Size: {formatFileSize(file.size)}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-[#5c6070]" />
                <span>Created: {new Date(file.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            {file.description && (
              <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Bot className="w-4 h-4 text-indigo-400" />
                  <h5 className="font-semibold text-indigo-300 text-sm">AI Description</h5>
                </div>
                <p className="text-sm text-indigo-200/70">{file.description}</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
