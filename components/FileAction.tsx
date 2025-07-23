"use client";

import { useState } from 'react';
import type { File as FileType } from '@/lib/db/schema';
import { MoreVertical, Star, Trash2, Download } from 'lucide-react';

// Define the types for the props we'll receive.
// We expect the file object, and functions to handle starring and deleting.
type FileActionProps = {
  file: FileType;
  onStar: (file: FileType) => void;
  onDelete: (file: FileType) => void;
};

export default function FileAction({ file, onStar, onDelete }: FileActionProps) {
  // 'useState' hook to manage the dropdown's visibility.
  // It's initially closed (false).
  const [isOpen, setIsOpen] = useState(false);

  const handleDownload = () => {
    if (file.fileUrl) {
      // Creates a temporary link to trigger the browser's download functionality.
      const link = document.createElement('a');
      link.href = file.fileUrl;
      link.download = file.name; // This sets the name of the downloaded file.
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    // The parent div needs 'relative' for the 'absolute' dropdown to be positioned correctly.
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
      >
        <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-300" />
      </button>

      {/* Conditional Rendering: The dropdown menu is only rendered if 'isOpen' is true. */}
      {isOpen && (
        <div
          className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10"
          // This allows us to close the menu if the user's mouse leaves the area.
          onMouseLeave={() => setIsOpen(false)}
        >
          <ul className="py-1">
            <li
              onClick={() => { onStar(file); setIsOpen(false); }}
              className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
            >
              <Star className={`w-4 h-4 mr-3 ${file.isStarred ? 'text-yellow-500 fill-current' : ''}`} />
              {file.isStarred ? 'Unstar' : 'Star'}
            </li>
            {!file.isFolder && (
              <li
                onClick={handleDownload}
                className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
              >
                <Download className="w-4 h-4 mr-3" />
                Download
              </li>
            )}
            <li
              onClick={() => { onDelete(file); setIsOpen(false); }}
              className="flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/50 cursor-pointer"
            >
              <Trash2 className="w-4 h-4 mr-3" />
              Delete
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
