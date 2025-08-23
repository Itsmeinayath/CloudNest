"use client";

import { useState, useEffect, useCallback } from "react"; // Removed unused 'useMemo'
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
import { AnimatePresence } from "framer-motion"; // Removed unused 'motion'

export default function DashboardContent() {
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
  
  const handleFileAction = () => {
    fetchData();
  };

  const renderContent = () => {
    if (!isLoaded || isLoading) return <FileLoadingState />;
    if (error) return <div className="text-center text-red-500 p-8">Error: {error}</div>;
    if (files.length === 0) return <FileEmptyState isSearch={!!searchQuery} />;
    return (
      <FileList
        files={files}
        onStar={handleFileAction}
        onDelete={handleFileAction}
        onFolderClick={handleFolderClick}
        onRestore={handleFileAction}
        onDeleteForever={handleFileAction}
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
          onGenerateImageClick={() => setIsImageModalOpen(true)}
        />
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {searchQuery ? `Search Results for "${searchQuery}"` : 
               activeTab === 'starred' ? 'Starred' : 
               activeTab === 'trash' ? 'Trash' : 
               'My Files'}
            </h1>
            <div className="w-full sm:w-auto sm:max-w-xs">
              <SearchBar
                onSearch={handleSearch}
                onClear={handleClearSearch}
              />
            </div>
          </div>

          {activeTab === "files" && !searchQuery && (
            <FolderNavigation path={folderPath} onNavigate={handleBreadcrumbNavigate} />
          )}
          
          {activeTab === "trash" && <TrashHeader onEmptyTrash={handleFileAction} onRestoreAll={handleFileAction} />}

          <div className="mt-4 p-4 bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
            <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
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
    </>
  );
}
