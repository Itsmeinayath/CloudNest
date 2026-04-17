// 📊 MAIN DASHBOARD CONTENT COMPONENT
// This is the core component that manages file browsing, search, and navigation in CloudNest

"use client";

// 🧰 REACT & HOOKS IMPORTS
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";
import type { File } from "@/lib/db/schema";
import type { TabValue } from "./Sidebar";

// 🎨 COMPONENT IMPORTS
import Sidebar from "./Sidebar";
import FileList from "./FileList";
import FileLoadingState from "./FileLoadingState";
import FileEmptyState from "./FileEmptyState";
import FolderNavigation from "./FolderNavigation";
import SearchBar from "./SearchBar";
import TrashHeader from "./TrashHeader";
import FileDetailsModal from "./FileDetailsModal";
import { AnimatePresence } from "framer-motion";

// 📋 COMPONENT PROPS TYPE DEFINITION
interface DashboardContentProps {
  userId: string;
  userName: string;
}

// 🏗️ MAIN DASHBOARD COMPONENT
export default function DashboardContent({
  userId,
  userName,
}: DashboardContentProps) {
  // 🔐 AUTHENTICATION STATE
  const { isLoaded } = useAuth();

  // 📁 FILE & DATA STATE
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🎯 NAVIGATION & UI STATE
  const [activeTab, setActiveTab] = useState<TabValue>("files");
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  
  // 🗂️ FOLDER BREADCRUMB PATH STATE
  const [folderPath, setFolderPath] = useState<
    (File | { id: null; name: "My Files" })[]
  >([{ id: null, name: "My Files" }]);
  
  // 🔍 SEARCH STATE
  const [searchQuery, setSearchQuery] = useState<string | null>(null);
  
  // 📄 MODAL STATE
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // 📡 DATA FETCHING FUNCTION
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
      if (!response.ok) {
        throw new Error("Failed to fetch data.");
      }

      const data = await response.json();
      setFiles(data);

    } catch (err: unknown) {
      console.error("Error fetching files:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred while fetching files.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, currentFolderId, searchQuery]);

  // 🔄 EFFECT: FETCH DATA WHEN AUTHENTICATION LOADS
  useEffect(() => {
    if (isLoaded) {
      fetchData();
    }
  }, [isLoaded, fetchData]);

  // 🎯 TAB CHANGE HANDLER
  const handleTabChange = (tab: TabValue) => {
    setActiveTab(tab);
    setSearchQuery(null);
    setCurrentFolderId(null);
    setFolderPath([{ id: null, name: "My Files" }]);
  };

  // 🔍 SEARCH HANDLERS
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setActiveTab("files");
  };

  const handleClearSearch = () => setSearchQuery(null);

  // 📁 FOLDER NAVIGATION HANDLERS
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

  // 🤖 AI IMAGE GENERATION HANDLER
  const handleGenerateImageClick = () => {
    console.log("Generate image clicked");
  };

  // ✅ SPECIFIC FILE ACTION HANDLERS
  const handleStarFile = async (file: File) => {
    try {
      const response = await fetch(`/api/files/${file.id}/star`, {
        method: "PATCH",
      });
      if (response.ok) {
        fetchData();
      } else {
        throw new Error("Failed to update star status");
      }
    } catch (error: unknown) {
      console.error("Error starring file:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to update file star status";
      setError(errorMessage);
    }
  };

  const handleDeleteFile = async (file: File) => {
    try {
      const response = await fetch(`/api/files/${file.id}/delete`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchData();
      } else {
        throw new Error("Failed to delete file");
      }
    } catch (error: unknown) {
      console.error("Error deleting file:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to delete file";
      setError(errorMessage);
    }
  };

  const handleRestoreFile = async (file: File) => {
    try {
      const response = await fetch(`/api/files/${file.id}/trash`, {
        method: "PATCH",
      });
      if (response.ok) {
        fetchData();
      } else {
        throw new Error("Failed to restore file");
      }
    } catch (error: unknown) {
      console.error("Error restoring file:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to restore file";
      setError(errorMessage);
    }
  };

  const handleDeleteForever = async (file: File) => {
    try {
      const response = await fetch(`/api/files/${file.id}/trash`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchData();
      } else {
        throw new Error("Failed to permanently delete file");
      }
    } catch (error: unknown) {
      console.error("Error permanently deleting file:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to permanently delete file";
      setError(errorMessage);
    }
  };

  const handleEmptyTrash = async () => {
    try {
      const response = await fetch("/api/files/empty-trash", {
        method: "DELETE",
      });
      if (response.ok) {
        fetchData();
      } else {
        throw new Error("Failed to empty trash");
      }
    } catch (error: unknown) {
      console.error("Error emptying trash:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to empty trash";
      setError(errorMessage);
    }
  };

  const handleRestoreAll = async () => {
    try {
      const response = await fetch("/api/files/restore-all", {
        method: "PATCH",
      });
      if (response.ok) {
        fetchData();
      } else {
        throw new Error("Failed to restore all files");
      }
    } catch (error: unknown) {
      console.error("Error restoring all files:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to restore all files";
      setError(errorMessage);
    }
  };

  // 🎨 CONTENT RENDERING LOGIC
  const renderContent = () => {
    if (!isLoaded || isLoading) {
      return <FileLoadingState />;
    }

    if (error) {
      return (
        <div className="text-center text-rose-400 p-8">
          <p className="mb-4">Error: {error}</p>
          <button
            onClick={fetchData}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors"
          >
            Try Again
          </button>
        </div>
      );
    }

    if (files.length === 0) {
      return <FileEmptyState isSearch={!!searchQuery} />;
    }

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
      {/* 📱 MAIN DASHBOARD LAYOUT */}
      <div className="flex flex-col lg:flex-row gap-8 py-8 pt-20 min-h-screen max-w-[1600px] mx-auto">
        {/* 🎯 LEFT SIDEBAR */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          userId={userId}
          currentFolderId={currentFolderId}
          onUploadSuccess={fetchData}
          onGenerateImageClick={handleGenerateImageClick}
        />

        {/* 📊 MAIN CONTENT AREA */}
        <div className="flex-1">
          {/* 🏷️ HEADER SECTION */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-8 mt-2 lg:mt-0 pb-6 border-b border-[rgba(255,255,255,0.06)]">
            <h1 className="text-2xl font-semibold text-white tracking-tight flex items-center gap-3">
              {searchQuery ? (
                `Search Results for "${searchQuery}"`
              ) : activeTab === 'starred' ? (
                `Starred Files`
              ) : activeTab === 'trash' ? (
                `Trash`
              ) : (
                `Workspace`
              )}
            </h1>

            {/* 🔍 SEARCH BAR */}
            <div className="w-full sm:w-auto sm:max-w-xs">
              <SearchBar
                onSearch={handleSearch}
                onClear={handleClearSearch}
                isSearching={isLoading}
              />
            </div>
          </div>

          {/* 🗂️ FOLDER NAVIGATION (Only in files tab, not in search) */}
          {activeTab === "files" && !searchQuery && (
            <FolderNavigation 
              path={folderPath} 
              onNavigate={handleBreadcrumbNavigate} 
            />
          )}
          
          {/* 🗑️ TRASH ACTIONS (Only in trash tab) */}
          {activeTab === "trash" && (
            <TrashHeader 
              onEmptyTrash={handleEmptyTrash}
              onRestoreAll={handleRestoreAll}
            />
          )}

          {/* 📁 MAIN CONTENT AREA */}
          <div className="mt-2 min-h-[500px]">
            <AnimatePresence mode="wait">
              {renderContent()}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* 📄 FILE DETAILS MODAL */}
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