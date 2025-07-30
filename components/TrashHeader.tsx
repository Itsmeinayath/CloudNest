"use client";

import { Trash, Undo } from 'lucide-react';

type TrashHeaderProps = {
  onEmptyTrash: () => void;
  onRestoreAll: () => void; // New prop for the restore all action
};

export default function TrashHeader({ onEmptyTrash, onRestoreAll }: TrashHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 mb-6 bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg">
      <div>
        <h2 className="font-semibold text-gray-800 dark:text-gray-200">Items in Trash</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Files in the trash will be permanently deleted after 30 days.
        </p>
      </div>
      <div className="flex items-center gap-2">
        {/* New "Restore All" button */}
        <button
          onClick={onRestoreAll}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:hover:bg-blue-900 rounded-lg transition-colors"
        >
          <Undo className="w-4 h-4" />
          Restore All
        </button>
        <button
          onClick={onEmptyTrash}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
        >
          <Trash className="w-4 h-4" />
          Empty Trash
        </button>
      </div>
    </div>
  );
}
