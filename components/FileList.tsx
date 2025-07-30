"use client";

import type { File as FileType } from "@/lib/db/schema";
import FileIcon from "./FileIcon";
import FileAction from "./FileAction";
import { Star } from "lucide-react";

interface FileListProps {
  files: FileType[];
  onFolderClick: (folder: FileType) => void;
  onStar: (file: FileType) => void;
  onDelete: (file: FileType) => void;
  onRestore: (file: FileType) => void;
  onDeleteForever: (file: FileType) => void;
}

export default function FileList({ files, onFolderClick, ...actionProps }: FileListProps) {
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {files.map((file) => {
        const isImage = file.mimeType?.startsWith('image/');
        
        return (
          <div
            key={file.id}
            className="group relative bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm cursor-pointer transition-all duration-200 hover:shadow-md hover:border-blue-500 dark:hover:border-blue-500"
            onDoubleClick={() => {
              if (file.isFolder) onFolderClick(file);
            }}
          >
            {/* Action menu is always on top */}
            <div className="absolute top-2 right-2 z-20">
              <FileAction file={file} {...actionProps} />
            </div>

            {/* Star icon is also on top, but below the action menu */}
            {file.isStarred && (
              <div className="absolute top-2 left-2 z-10 p-1 bg-white/80 dark:bg-gray-900/80 rounded-full shadow">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
              </div>
            )}

            {/* Main content: either image or icon */}
            <div className="h-32 w-full flex items-center justify-center">
              {isImage && (file.thumbnailUrl || file.fileUrl) ? (
                <img
                  src={file.thumbnailUrl || file.fileUrl!}
                  alt={`Preview of ${file.name}`}
                  className="w-full h-full object-cover rounded-t-lg"
                />
              ) : (
                <FileIcon file={file} />
              )}
            </div>

            {/* File name and size section */}
            <div className="p-3 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                {file.name}
              </p>
              {!file.isFolder && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {formatFileSize(file.size)}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
