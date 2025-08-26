"use client";

import { File, Folder, Music, Video, FileText, Archive } from 'lucide-react';
import type { File as FileType } from '@/lib/db/schema';

/**
 * This component's only job is to return the correct icon for a given file type.
 * The gallery view (image thumbnails) is handled by the FileList component.
 */
export default function FileIcon({ file }: { file: FileType }) {
  const iconProps = {
    className: "w-4 h-4 lg:w-5 lg:h-5 flex-shrink-0",
    strokeWidth: 1.5,
  };

  if (file.isFolder) {
    return <Folder {...iconProps} className="w-4 h-4 lg:w-5 lg:h-5 text-blue-400 flex-shrink-0" />;
  }

  const mimeType = file.mimeType || '';

  if (mimeType.startsWith('image/')) return <File {...iconProps} className="w-4 h-4 lg:w-5 lg:h-5 text-green-400 flex-shrink-0" />;
  if (mimeType.startsWith('video/')) return <Video {...iconProps} className="w-4 h-4 lg:w-5 lg:h-5 text-red-400 flex-shrink-0" />;
  if (mimeType.startsWith('audio/')) return <Music {...iconProps} className="w-4 h-4 lg:w-5 lg:h-5 text-green-400 flex-shrink-0" />;
  if (mimeType === 'application/pdf') return <FileText {...iconProps} className="w-4 h-4 lg:w-5 lg:h-5 text-red-400 flex-shrink-0" />;
  if (mimeType.startsWith('application/zip') || mimeType.startsWith('application/x-rar-compressed')) {
    return <Archive {...iconProps} className="w-4 h-4 lg:w-5 lg:h-5 text-yellow-400 flex-shrink-0" />;
  }
  if (mimeType.startsWith('text/')) return <FileText {...iconProps} className="w-4 h-4 lg:w-5 lg:h-5 text-blue-400 flex-shrink-0" />;
  
  // Default icon for unknown file types
  return <File {...iconProps} className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400 flex-shrink-0" />;
}
