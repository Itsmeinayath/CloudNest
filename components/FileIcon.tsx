import { File, Folder, Image as ImageIcon, Music, Video, FileText, Archive, Star } from 'lucide-react';
import type { File as FileType } from '@/lib/db/schema';

/**
 * A component that displays an appropriate icon or an image thumbnail,
 * with a visual indicator for starred items.
 * @param file - The file object from your database.
 */
export default function FileIcon({ file }: { file: FileType }) {
  // --- DEBUGGING STEP ---
  console.log("FileIcon received:", file);

  // The main container is now 'relative' to position the star icon.
  return (
    <div className="relative">
      {/* --- GALLERY VIEW LOGIC --- */}
      {file.mimeType?.startsWith('image/') && (file.thumbnailUrl || file.fileUrl) ? (
        <img
          // Use the thumbnail if it exists, otherwise fall back to the main file URL.
          src={file.thumbnailUrl || file.fileUrl!}
          alt={`Thumbnail for ${file.name}`}
          className="w-16 h-16 object-cover rounded-md"
          onError={(e) => (e.currentTarget.style.display = 'none')} // Hide if image fails to load
        />
      ) : (
        // --- ICON LOGIC ---
        (() => {
          const iconProps = {
            className: "w-16 h-16 text-gray-500 dark:text-gray-400",
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

          return <File {...iconProps} />;
        })()
      )}

      {/* --- STARRED INDICATOR --- */}
      {/* If the file is starred, display a small star icon in the top-left corner. */}
      {file.isStarred && (
        <div className="absolute -top-1 -left-1 bg-white dark:bg-gray-800 p-0.5 rounded-full">
          <Star className="w-4 h-4 text-yellow-500 fill-current" />
        </div>
      )}
    </div>
  );
}
