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
      <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg"
        >
          <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">File Details</h3>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
          <div className="p-6 space-y-4">
            {file.thumbnailUrl && (
              <img src={file.thumbnailUrl} alt={file.name} className="w-full h-48 object-cover rounded-md mb-4 border dark:border-gray-700" />
            )}
            <div>
              <h4 className="font-bold text-lg text-gray-800 dark:text-gray-200 break-words">{file.name}</h4>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2 border-t dark:border-gray-700 pt-4">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span>Type: {file.mimeType || 'Folder'}</span>
              </div>
              <div className="flex items-center gap-2">
                <ArrowDownToLine className="w-4 h-4" />
                <span>Size: {formatFileSize(file.size)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Created: {new Date(file.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            {file.description && (
              <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Bot className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <h5 className="font-semibold text-blue-800 dark:text-blue-300">AI Generated Description</h5>
                </div>
                <p className="text-sm text-blue-700 dark:text-blue-200">{file.description}</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
