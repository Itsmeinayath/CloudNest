"use client";

import { Trash, Undo } from 'lucide-react';

type TrashHeaderProps = {
  onEmptyTrash: () => void;
  onRestoreAll: () => void;
};

export default function TrashHeader({ onEmptyTrash, onRestoreAll }: TrashHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 mb-6 bg-[#12141a] border border-[rgba(255,255,255,0.06)] rounded-xl">
      <div>
        <h2 className="font-semibold text-[#f0f0f3]">Items in Trash</h2>
        <p className="text-sm text-[#5c6070]">
          Files in the trash will be permanently deleted after 30 days.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onRestoreAll}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-400 bg-[rgba(99,102,241,0.1)] hover:bg-[rgba(99,102,241,0.15)] rounded-lg transition-colors"
        >
          <Undo className="w-4 h-4" />
          Restore All
        </button>
        <button
          onClick={onEmptyTrash}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-rose-600 hover:bg-rose-500 rounded-lg transition-colors shadow-md shadow-rose-600/20"
        >
          <Trash className="w-4 h-4" />
          Empty Trash
        </button>
      </div>
    </div>
  );
}
