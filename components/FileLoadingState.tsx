"use client";

import { ImageIcon } from 'lucide-react';

interface FileLoadingStateProps {
  viewMode: 'grid' | 'list';
}

// A "skeleton" loading component to provide a better user experience.
export default function FileLoadingState({ viewMode }: FileLoadingStateProps) {
  if (viewMode === 'list') {
    // List view loading skeleton
    return (
      <div className="space-y-3 animate-pulse">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center gap-4 p-3 bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg"
          >
            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center flex-shrink-0">
              <ImageIcon className="w-5 h-5 text-gray-300 dark:text-gray-600" />
            </div>
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-3 w-1/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Grid view loading skeleton (default)
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 animate-pulse">
      {/* Create an array of 12 items to map over for the skeleton */}
      {Array.from({ length: 12 }).map((_, index) => (
        <div
          key={index}
          className="relative flex flex-col items-center p-4 bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl"
        >
          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center">
            <ImageIcon className="w-8 h-8 text-gray-300 dark:text-gray-600" />
          </div>
          <div className="mt-3 h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
          <div className="mt-1 h-3 w-1/2 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
        </div>
      ))}
    </div>
  );
}
