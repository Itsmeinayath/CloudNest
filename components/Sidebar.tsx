"use client";

import { File, Star, Trash2, Sparkles } from 'lucide-react';
import FileUploadForm from './FileUploadForm';
import CreateFolderButton from './CreateFolderButton';

export type TabValue = 'files' | 'starred' | 'trash';

type SidebarProps = {
  activeTab: TabValue;
  onTabChange: (tab: TabValue) => void;
  currentFolderId: string | null;
  onUploadSuccess: () => void;
  onGenerateImageClick: () => void; // New prop to open the modal
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

export default function Sidebar({ activeTab, onTabChange, currentFolderId, onUploadSuccess, onGenerateImageClick }: SidebarProps) {
  return (
    <aside className="w-full lg:w-64 xl:w-72 flex-shrink-0 space-y-6">
      {/* Actions Section */}
      <div className="p-4 bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Upload File</h2>
          <FileUploadForm 
            currentFolder={currentFolderId} 
            onUploadSuccess={onUploadSuccess} 
          />
        </div>
        <div className="space-y-2">
          {activeTab === 'files' && (
            <CreateFolderButton 
              parentId={currentFolderId}
              onSuccess={onUploadSuccess}
            />
          )}
          {/* The new "Generate Image" button */}
          <button
            onClick={onGenerateImageClick}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
          >
            <Sparkles className="w-5 h-5" />
            Generate Image
          </button>
        </div>
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
