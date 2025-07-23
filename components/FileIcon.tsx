import { File, Folder, Image as ImageIcon, Music, Video, FileText, Archive, ShieldQuestion } from 'lucide-react';
import type { File as FileType } from '@/lib/db/schema'; // Import your File type

/**
 * A component that displays an appropriate icon based on the file's type.
 * @param file - The file object from your database.
 */
export default function FileIcon({ file }: { file: FileType }) {
  const iconProps = {
    className: "w-12 h-12 sm:w-16 sm:h-16 text-gray-500 dark:text-gray-400",
    strokeWidth: 1,
  };

  if (file.isFolder) {
    return <Folder {...iconProps} className="text-blue-500 dark:text-blue-400" />;
  }

  const mimeType = file.mimeType || '';

  if (mimeType.startsWith('image/')) {
    return <ImageIcon {...iconProps} className="text-purple-500 dark:text-purple-400" />;
  }
  if (mimeType.startsWith('video/')) {
    return <Video {...iconProps} className="text-red-500 dark:text-red-400" />;
  }
  if (mimeType.startsWith('audio/')) {
    return <Music {...iconProps} className="text-green-500 dark:text-green-400" />;
  }
  if (mimeType === 'application/pdf') {
    return <FileText {...iconProps} className="text-orange-500 dark:text-orange-400" />;
  }
  if (mimeType.startsWith('application/zip') || mimeType.startsWith('application/x-rar-compressed')) {
    return <Archive {...iconProps} className="text-yellow-500 dark:text-yellow-400" />;
  }
  if (mimeType.startsWith('text/')) {
    return <FileText {...iconProps} />;
  }

  // Default icon for unknown file types
  return <File {...iconProps} />;
}
