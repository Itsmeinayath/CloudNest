"use client";

import { File, Folder, Image as ImageIcon, Music, Video, FileText, Archive } from 'lucide-react';
import type { File as FileType } from '@/lib/db/schema';

/**
 * This component's only job is to return the correct icon for a given file type.
 * The gallery view (image thumbnails) is handled by the FileList component.
 */
export default function FileIcon({ file }: { file: FileType }) {
  const iconProps = {
    className: "w-12 h-12 text-gray-500 dark:text-gray-400",
    strokeWidth: 1,
  };

  if (file.isFolder) {
    return <Folder {...iconProps} className="text-blue-500 dark:text-blue-400 fill-current opacity-20" />;
  }

  const mimeType = file.mimeType || '';

  if (mimeType.startsWith('video/')) return <Video {...iconProps} className="text-red-500 dark:text-red-400" />;
  if (mimeType.startsWith('audio/')) return <Music {...iconProps} className="text-green-500 dark:text-green-400" />;
  if (mimeType === 'application/pdf') return <FileText {...iconProps} className="text-orange-500 dark:text-orange-400" />;
  if (mimeType.startsWith('application/zip') || mimeType.startsWith('application/x-rar-compressed')) {
    return <Archive {...iconProps} className="text-yellow-500 dark:text-yellow-400" />;
  }
  if (mimeType.startsWith('text/')) return <FileText {...iconProps} />;
  
  // Default icon for unknown or non-visual file types
  return <File {...iconProps} />;
}
