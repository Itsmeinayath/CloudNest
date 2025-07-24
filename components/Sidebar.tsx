"use client";

import { File, Star, Trash2 } from 'lucide-react';
import FileUploadForm from './FileUploadForm'; // We'll place the form here

export type TabValue = 'files' | 'starred' | 'trash';

type SidebarProps = {
  activeTab: TabValue;
  onTabChange: (tab: TabValue) => void;
  userId: string;
  currentFolderId: string | null;
  onUploadSuccess: () => void;
};

const NavItem = ({ isActive, onClick, children }: { isActive: boolean; onClick: () => void; children: React.ReactNode; }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
      isActive
        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
    }`}
  >
    {children}
  </button>
);

export default function Sidebar({ activeTab, onTabChange, userId, currentFolderId, onUploadSuccess }: SidebarProps) {
  return (
    <aside className="w-full lg:w-64 xl:w-72 flex-shrink-0 space-y-6">
      {/* File Upload Section */}
      <div className="p-4 bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Upload File</h2>
        <FileUploadForm 
          userId={userId} 
          currentFolder={currentFolderId} 
          onUploadSuccess={onUploadSuccess} 
        />
      </div>

      {/* Navigation Section */}
      <nav className="space-y-1">
        <NavItem isActive={activeTab === 'files'} onClick={() => onTabChange('files')}>
          <File className="w-5 h-5" />
          My Files
        </NavItem>
        <NavItem isActive={activeTab === 'starred'} onClick={() => onTabChange('starred')}>
          <Star className="w-5 h-5" />
          Starred
        </NavItem>
        <NavItem isActive={activeTab === 'trash'} onClick={() => onTabChange('trash')}>
          <Trash2 className="w-5 h-5" />
          Trash
        </NavItem>
      </nav>
    </aside>
  );
}
