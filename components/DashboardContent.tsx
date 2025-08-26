"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";
import type { File } from "@/lib/db/schema";
import type { TabValue } from "./Sidebar";

// Import all necessary components
import Sidebar from "./Sidebar";
import FileList from "./FileList";
import FileLoadingState from "./FileLoadingState";
import FileEmptyState from "./FileEmptyState";
import FolderNavigation from "./FolderNavigation";
import SearchBar from "./SearchBar";
import TrashHeader from "./TrashHeader";
import FileDetailsModal from "./FileDetailsModal";
import GenerateImageModal from "./GenerateImageModal";
import { AnimatePresence } from "framer-motion";

interface DashboardContentProps {
  userId: string;
}

export default function DashboardContent({
  userId: _userId, // Prefix with underscore to indicate intentionally unused
}: DashboardContentProps) {
  const { isLoaded } = useAuth();

  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<TabValue>("files");
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [folderPath, setFolderPath] = useState<
    (File | { id: null; name: "My Files" })[]
  >([{ id: null, name: "My Files" }]);
  const [searchQuery, setSearchQuery] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isGenerateImageModalOpen, setIsGenerateImageModalOpen] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      let url = "/api/files";
      const params = new URLSearchParams();

      if (searchQuery) {
        url = "/api/files/search";
        params.set("q", searchQuery);
      } else {
        params.set("filter", activeTab);
        if (activeTab === "files" && currentFolderId) {
          params.set("parentId", currentFolderId);
        }
      }

      const response = await fetch(`${url}?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch data.");

      const data = await response.json();
      setFiles(data);
    } catch (err: unknown) { // Changed 'any' to 'unknown'
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, currentFolderId, searchQuery]);

  useEffect(() => {
    if (isLoaded) fetchData();
  }, [isLoaded, fetchData]);

  // --- Handlers ---
  const handleTabChange = (tab: TabValue) => {
    setActiveTab(tab);
    setSearchQuery(null);
    setCurrentFolderId(null);
    setFolderPath([{ id: null, name: "My Files" }]);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setActiveTab("files");
  };

  const handleClearSearch = () => setSearchQuery(null);

  const handleFolderClick = (folder: File) => {
    if (searchQuery) setSearchQuery(null);
    setFolderPath((prev) => [...prev, folder]);
    setCurrentFolderId(folder.id);
  };

  const handleBreadcrumbNavigate = (folderId: string | null) => {
    const folderIndex = folderPath.findIndex((f) => f.id === folderId);
    if (folderIndex !== -1) {
      setFolderPath(folderPath.slice(0, folderIndex + 1));
    }
    setCurrentFolderId(folderId);
  };
  
  const handleEmptyTrash = async () => {
    try {
      const response = await fetch('/api/files/empty-trash', { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Failed to empty trash');
      }
      fetchData();
    } catch (error) {
      console.error('Error emptying trash:', error);
      setError('Failed to empty trash');
    }
  };

  const handleRestoreAll = async () => {
    try {
      const response = await fetch('/api/files/restore-all', { method: 'PATCH' });
      if (!response.ok) {
        throw new Error('Failed to restore all files');
      }
      fetchData();
    } catch (error) {
      console.error('Error restoring all files:', error);
      setError('Failed to restore all files');
    }
  };

  const handleDeleteFile = async (file: File) => {
    try {
      const response = await fetch(`/api/files/${file.id}/delete`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Failed to move file to trash');
      }
      fetchData();
    } catch (error) {
      console.error('Error moving file to trash:', error);
      setError('Failed to move file to trash');
    }
  };

  const handleRestoreFile = async (file: File) => {
    try {
      const response = await fetch(`/api/files/${file.id}/trash`, { method: 'PATCH' });
      if (!response.ok) {
        throw new Error('Failed to restore file');
      }
      fetchData();
    } catch (error) {
      console.error('Error restoring file:', error);
      setError('Failed to restore file');
    }
  };

  const handleDeleteForever = async (file: File) => {
    try {
      const response = await fetch(`/api/files/${file.id}/trash`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Failed to permanently delete file');
      }
      fetchData();
    } catch (error) {
      console.error('Error permanently deleting file:', error);
      setError('Failed to permanently delete file');
    }
  };

  const handleStarFile = async (file: File) => {
    try {
      const response = await fetch(`/api/files/${file.id}/star`, {
        method: 'PATCH',
      });
      
      if (!response.ok) {
        throw new Error('Failed to star/unstar file');
      }
      
      // Refresh the data to reflect the change
      fetchData();
    } catch (error) {
      console.error('Error starring file:', error);
      // Optionally show a toast notification here
    }
  };

  const renderContent = () => {
    if (!isLoaded || isLoading) return <FileLoadingState />;
    if (error) return <div className="text-center text-red-500 p-8">Error: {error}</div>;
    if (files.length === 0) return <FileEmptyState isSearch={!!searchQuery} />;
    return (
      <FileList
        files={files}
        onStar={handleStarFile}
        onDelete={handleDeleteFile}
        onFolderClick={handleFolderClick}
        onRestore={handleRestoreFile}
        onDeleteForever={handleDeleteForever}
        onViewDetails={setSelectedFile}
      />
    );
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-8 py-8">
        <Sidebar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          currentFolderId={currentFolderId}
          onUploadSuccess={fetchData}
          onGenerateImageClick={() => setIsGenerateImageModalOpen(true)}
        />
        <div className="flex-1">
          {/* Modern Header Section */}
          <div className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 rounded-t-2xl border border-gray-700/50 border-b-0 p-4 lg:p-6 backdrop-blur-sm">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-white mb-2">
                  {searchQuery ? `Search Results for "${searchQuery}"` : 
                   activeTab === 'starred' ? 'Starred' : 
                   activeTab === 'trash' ? 'Trash' : 
                   'My Files'}
                </h1>
                <p className="text-gray-400 text-sm lg:text-base">
                  {activeTab === 'starred' ? 'Your starred files and folders' :
                   activeTab === 'trash' ? 'Deleted files and folders' :
                   'Manage and organize your cloud storage'}
                </p>
              </div>
              <div className="w-full lg:w-auto lg:max-w-xs">
                <SearchBar
                  onSearch={handleSearch}
                  onClear={handleClearSearch}
                />
              </div>
            </div>
          </div>

          {/* Navigation and Controls */}
          <div className="bg-gray-800/40 border border-gray-700/50 border-t-0 backdrop-blur-sm">
            {activeTab === "files" && !searchQuery && (
              <div className="px-4 lg:px-6 py-3 border-b border-gray-700/30">
                <FolderNavigation path={folderPath} onNavigate={handleBreadcrumbNavigate} />
              </div>
            )}
            
            {activeTab === "trash" && (
              <div className="px-4 lg:px-6 py-3 border-b border-gray-700/30">
                <TrashHeader onEmptyTrash={handleEmptyTrash} onRestoreAll={handleRestoreAll} />
              </div>
            )}

            {/* Content Area */}
            <div className="p-4 lg:p-6 rounded-b-2xl">
              <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedFile && (
          <FileDetailsModal 
            file={selectedFile} 
            onClose={() => setSelectedFile(null)} 
          />
        )}
      </AnimatePresence>

      <GenerateImageModal
        isOpen={isGenerateImageModalOpen}
        onClose={() => setIsGenerateImageModalOpen(false)}
        onSuccess={() => {
          fetchData();
          setIsGenerateImageModalOpen(false);
        }}
        currentFolderId={currentFolderId}
      />
    </>
  );
}
