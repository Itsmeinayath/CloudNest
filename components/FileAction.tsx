"use client";

import { useState, useEffect, useRef } from 'react';
import type { File as FileType } from '@/lib/db/schema';
import { MoreVertical, Star, Trash2, Download } from 'lucide-react';
import FileActionButton from './FileActionButton'; // Import the new button component

type FileActionProps = {
  file: FileType;
  onStar: (file: FileType) => void;
  onDelete: (file: FileType) => void;
};

export default function FileAction({ file, onStar, onDelete }: FileActionProps) {
  const [isOpen, setIsOpen] = useState(false);
  // useRef is used to get a direct reference to the dropdown menu DOM element.
  const menuRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    if (file.fileUrl) {
      const link = document.createElement('a');
      link.href = file.fileUrl;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // This 'useEffect' hook adds an event listener to the whole document.
  // It checks for clicks, and if a click happens outside the menu, it closes it.
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    // Add the listener when the component mounts.
    document.addEventListener("mousedown", handleClickOutside);
    // Clean up the listener when the component unmounts to prevent memory leaks.
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  return (
    // We attach the 'menuRef' to our main div here.
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
      >
        <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-300" />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
          <ul className="py-1">
            {/* Now we use our reusable FileActionButton component for each action. */}
            <FileActionButton onClick={() => { onStar(file); setIsOpen(false); }}>
              <Star className={`w-4 h-4 mr-3 ${file.isStarred ? 'text-yellow-500 fill-current' : ''}`} />
              {file.isStarred ? 'Unstar' : 'Star'}
            </FileActionButton>
            
            {!file.isFolder && (
              <FileActionButton onClick={handleDownload}>
                <Download className="w-4 h-4 mr-3" />
                Download
              </FileActionButton>
            )}

            <FileActionButton 
              onClick={() => { onDelete(file); setIsOpen(false); }}
              className="!text-red-600 dark:!text-red-500 hover:!bg-red-50 dark:hover:!bg-red-900/50"
            >
              <Trash2 className="w-4 h-4 mr-3" />
              Delete
            </FileActionButton>
          </ul>
        </div>
      )}
    </div>
  );
}
