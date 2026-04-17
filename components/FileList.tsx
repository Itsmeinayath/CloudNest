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
  onViewDetails: (file: FileType) => void;
}

export default function FileList({ 
  files, 
  onFolderClick, 
  onStar, 
  onDelete,
  onRestore,
  onDeleteForever,
  onViewDetails
}: FileListProps) {

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
            className="group relative bg-[#12141a] border border-[rgba(255,255,255,0.06)] rounded-xl cursor-pointer hover:border-[rgba(255,255,255,0.12)] hover:bg-[#1a1d25] transition-all duration-200 overflow-hidden flex flex-col"
            onDoubleClick={() => {
              if (file.isFolder) onFolderClick(file);
            }}
          >
            <div className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
              <FileAction 
                file={file} 
                onStar={onStar} 
                onDelete={onDelete}
                onRestore={onRestore}
                onDeleteForever={onDeleteForever}
                onViewDetails={onViewDetails}
              />
            </div>

            {file.isStarred && (
              <div className="absolute top-2.5 left-2.5 z-10 p-1.5 bg-[#12141a]/80 backdrop-blur-sm rounded-full border border-[rgba(255,255,255,0.08)]">
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              </div>
            )}

            <div className="h-36 w-full flex items-center justify-center relative z-10 p-4">
              {isImage && (file.thumbnailUrl || file.fileUrl) ? (
                <div className="w-full h-full rounded-lg overflow-hidden border border-[rgba(255,255,255,0.06)]">
                  <img
                    src={file.thumbnailUrl || file.fileUrl!}
                    alt={`Preview of ${file.name}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="transform group-hover:scale-105 transition-transform duration-300">
                  <FileIcon file={file} />
                </div>
              )}
            </div>

            <div className="p-3.5 border-t border-[rgba(255,255,255,0.04)] mt-auto">
              <p className="text-sm font-medium text-[#e0e0e5] truncate group-hover:text-white transition-colors">
                {file.name}
              </p>
              {!file.isFolder && (
                <p className="text-xs text-[#5c6070] mt-1">
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
