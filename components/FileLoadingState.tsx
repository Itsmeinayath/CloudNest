"use client";

import { ImageIcon } from 'lucide-react';

// A "skeleton" loading component to provide a better user experience.
export default function FileLoadingState() {
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
