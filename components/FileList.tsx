"use client";

import type { File as FileType } from "@/lib/db/schema";
import FileIcon from "./FileIcon";
import FileAction from "./FileAction";
import { Star } from "lucide-react";

// This interface defines all the functions the component needs from its parent.
interface FileListProps {
  files: FileType[];
  onFolderClick: (folder: FileType) => void;
  onStar: (file: FileType) => void;
  onDelete: (file: FileType) => void;
  onRestore: (file: FileType) => void;
  onDeleteForever: (file: FileType) => void;
  onViewDetails: (file: FileType) => void; // Add the missing prop here
}

export default function FileList({ 
  files, 
  onFolderClick, 
  onStar, 
  onDelete,
  onRestore,
  onDeleteForever,
  onViewDetails // Destructure the new prop
}: FileListProps) {

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  return (
    <div className="space-y-2">
      {files.map((file) => {
        return (
          <div
            key={file.id}
            className="flex items-center gap-3 lg:gap-4 p-2 lg:p-3 rounded-lg hover:bg-gray-700/30 transition-colors group cursor-pointer"
            onDoubleClick={() => {
              if (file.isFolder) onFolderClick(file);
            }}
          >
            <div className="flex-shrink-0">
              <FileIcon file={file} />
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium truncate text-sm lg:text-base">
                {file.name}
              </p>
              {!file.isFolder && (
                <p className="text-gray-400 text-xs lg:text-sm">
                  {formatFileSize(file.size)}
                </p>
              )}
            </div>

            <div className="flex items-center gap-1 lg:gap-2">
              {file.isStarred && (
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
              )}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <FileAction 
                  file={file} 
                  onStar={onStar} 
                  onDelete={onDelete}
                  onRestore={onRestore}
                  onDeleteForever={onDeleteForever}
                  onViewDetails={onViewDetails}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
