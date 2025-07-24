"use client";

import { File, Star, Trash2 } from 'lucide-react';

// Define the possible tab values
export type TabValue = 'files' | 'starred' | 'trash';

type FileTabsProps = {
  activeTab: TabValue;
  onTabChange: (tab: TabValue) => void;
};

// A single, reusable tab button component
const TabButton = ({
  isActive,
  onClick,
  children,
}: {
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
      isActive
        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
    }`}
  >
    {children}
  </button>
);

export default function FileTabs({ activeTab, onTabChange }: FileTabsProps) {
  return (
    <div className="flex items-center p-1 space-x-1 bg-gray-100/50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
      <TabButton
        isActive={activeTab === 'files'}
        onClick={() => onTabChange('files')}
      >
        <File className="w-4 h-4" />
        My Files
      </TabButton>
      <TabButton
        isActive={activeTab === 'starred'}
        onClick={() => onTabChange('starred')}
      >
        <Star className="w-4 h-4" />
        Starred
      </TabButton>
      <TabButton
        isActive={activeTab === 'trash'}
        onClick={() => onTabChange('trash')}
      >
        <Trash2 className="w-4 h-4" />
        Trash
      </TabButton>
    </div>
  );
}
