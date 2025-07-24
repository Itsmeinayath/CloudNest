"use client";

import { useState, useEffect, useCallback } from 'react';
import type { File } from '@/lib/db/schema';
import FileList from './FileList';
import FileLoadingState from './FileLoadingState';
import FileEmptyState from './FileEmptyState';
import FolderNavigation from './FolderNavigation';
import SearchBar from './SearchBar';
import FileUploadForm from './FileUploadForm';
import { FileUp } from 'lucide-react';

interface DashboardContentProps {
  userId: string;
  userName: string;
}

export default function DashboardContent({ userId, userName }: DashboardContentProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [folderPath, setFolderPath] = useState<(File | { id: null; name: 'My Files' })[]>([{ id: null, name: 'My Files' }]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string | null>(null);

  const getFiles = useCallback(async (folderId: string | null) => {
    setIsLoading(true);
    setError(null);
    try {
      const url = folderId ? `/api/files?parentId=${folderId}` : '/api/files';
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch files.');
      const data = await response.json();
      setFiles(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!searchQuery) {
      getFiles(currentFolderId);
    }
  }, [currentFolderId, searchQuery, getFiles]);

  const handleSearch = async (query: string) => {
    if (!query) return;
    setIsSearching(true);
    setSearchQuery(query);
    setError(null);
    try {
      const response = await fetch(`/api/files/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Search failed.');
      const data = await response.json();
      setFiles(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSearching(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery(null);
  };

  const handleFolderClick = (folder: File) => {
    setFolderPath([...folderPath, folder]);
    setCurrentFolderId(folder.id);
  };

  const handleBreadcrumbNavigate = (folderId: string | null) => {
    const folderIndex = folderPath.findIndex(f => f.id === folderId);
    if (folderIndex !== -1) {
      setFolderPath(folderPath.slice(0, folderIndex + 1));
    }
    setCurrentFolderId(folderId);
  };

  const handleStarFile = async (fileToStar: File) => {
    await fetch(`/api/files/${fileToStar.id}/star`, { method: 'PATCH' });
    setFiles(files.map(f => f.id === fileToStar.id ? { ...f, isStarred: !f.isStarred } : f));
  };

  const handleDeleteFile = async (fileToDelete: File) => {
    await fetch(`/api/files/${fileToDelete.id}/delete`, { method: 'DELETE' });
    setFiles(files.filter(f => f.id !== fileToDelete.id));
  };
  
  const handleUploadSuccess = () => {
    getFiles(currentFolderId);
  };

  const renderFileBrowserContent = () => {
    if (isLoading || isSearching) return <FileLoadingState />;
    if (error) return <div className="text-center text-red-500 p-8">Error: {error}</div>;
    if (files.length === 0) return <FileEmptyState isSearch={!!searchQuery} />;
    return (
      <FileList 
        files={files} 
        onStar={handleStarFile} 
        onDelete={handleDeleteFile}
        onFolderClick={handleFolderClick}
      />
    );
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {userName?.split(" ")[0] || "there"}!
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Here are your files.</p>
        </div>
        <div className="w-full md:w-auto">
          <SearchBar onSearch={handleSearch} onClear={handleClearSearch} isSearching={isSearching} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          {/* Replaced Card with a styled div */}
          <div className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 shadow-sm rounded-lg">
            {/* Replaced CardHeader with a styled div */}
            <div className="flex gap-3 p-4 border-b dark:border-gray-700">
              <FileUp className="h-5 w-5 text-blue-500" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Upload New File</h2>
            </div>
            {/* Replaced CardBody with a styled div */}
            <div className="p-4">
              <FileUploadForm 
                userId={userId} 
                onUploadSuccess={handleUploadSuccess} 
                currentFolder={currentFolderId} 
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
           {/* Replaced Card with a styled div */}
           <div className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 shadow-sm rounded-lg">
            {/* Replaced CardHeader with a styled div */}
            <div className="p-4 border-b dark:border-gray-700">
              {!searchQuery ? (
                <FolderNavigation path={folderPath} onNavigate={handleBreadcrumbNavigate} />
              ) : (
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Search Results for "{searchQuery}"
                </h2>
              )}
            </div>
            {/* Replaced CardBody with a styled div */}
            <div className="p-4">
              {renderFileBrowserContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
