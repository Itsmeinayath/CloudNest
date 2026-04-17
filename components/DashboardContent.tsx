// Main Dashboard Content Component

"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";
import type { File } from "@/lib/db/schema";
import type { TabValue } from "./Sidebar";

import Sidebar from "./Sidebar";
import FileList from "./FileList";
import FileLoadingState from "./FileLoadingState";
import FileEmptyState from "./FileEmptyState";
import FolderNavigation from "./FolderNavigation";
import SearchBar from "./SearchBar";
import TrashHeader from "./TrashHeader";
import FileDetailsModal from "./FileDetailsModal";
import { AnimatePresence } from "framer-motion";

interface DashboardContentProps {
  userId: string;
  userName: string;
}

export default function DashboardContent({ userId, userName }: DashboardContentProps) {
  const { isLoaded } = useAuth();
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabValue>("files");
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [folderPath, setFolderPath] = useState<(File | { id: null; name: "My Files" })[]>([{ id: null, name: "My Files" }]);
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
        if (activeTab === "files" && currentFolderId) params.set("parentId", currentFolderId);
      }
      const response = await fetch(`${url}?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch data.");
      const data = await response.json();
      setFiles(data);
    } catch (err: unknown) {
      console.error("Error fetching files:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, currentFolderId, searchQuery]);

  useEffect(() => { if (isLoaded) fetchData(); }, [isLoaded, fetchData]);

  const handleTabChange = (tab: TabValue) => { setActiveTab(tab); setSearchQuery(null); setCurrentFolderId(null); setFolderPath([{ id: null, name: "My Files" }]); };
  const handleSearch = (query: string) => { setSearchQuery(query); setActiveTab("files"); };
  const handleClearSearch = () => setSearchQuery(null);
  const handleFolderClick = (folder: File) => { if (searchQuery) setSearchQuery(null); setFolderPath((prev) => [...prev, folder]); setCurrentFolderId(folder.id); };
  const handleBreadcrumbNavigate = (folderId: string | null) => { const i = folderPath.findIndex((f) => f.id === folderId); if (i !== -1) setFolderPath(folderPath.slice(0, i + 1)); setCurrentFolderId(folderId); };
  const handleGenerateImageClick = () => {};

  const handleStarFile = async (file: File) => { try { const r = await fetch(`/api/files/${file.id}/star`, { method: "PATCH" }); if (r.ok) fetchData(); else throw new Error("Failed"); } catch (e: unknown) { setError(e instanceof Error ? e.message : "Failed"); } };
  const handleDeleteFile = async (file: File) => { try { const r = await fetch(`/api/files/${file.id}/delete`, { method: "DELETE" }); if (r.ok) fetchData(); else throw new Error("Failed"); } catch (e: unknown) { setError(e instanceof Error ? e.message : "Failed"); } };
  const handleRestoreFile = async (file: File) => { try { const r = await fetch(`/api/files/${file.id}/trash`, { method: "PATCH" }); if (r.ok) fetchData(); else throw new Error("Failed"); } catch (e: unknown) { setError(e instanceof Error ? e.message : "Failed"); } };
  const handleDeleteForever = async (file: File) => { try { const r = await fetch(`/api/files/${file.id}/trash`, { method: "DELETE" }); if (r.ok) fetchData(); else throw new Error("Failed"); } catch (e: unknown) { setError(e instanceof Error ? e.message : "Failed"); } };
  const handleEmptyTrash = async () => { try { const r = await fetch("/api/files/empty-trash", { method: "DELETE" }); if (r.ok) fetchData(); else throw new Error("Failed"); } catch (e: unknown) { setError(e instanceof Error ? e.message : "Failed"); } };
  const handleRestoreAll = async () => { try { const r = await fetch("/api/files/restore-all", { method: "PATCH" }); if (r.ok) fetchData(); else throw new Error("Failed"); } catch (e: unknown) { setError(e instanceof Error ? e.message : "Failed"); } };

  const renderContent = () => {
    if (!isLoaded || isLoading) return <FileLoadingState />;
    if (error) return (
      <div className="text-center text-rose-400 p-8">
        <p className="mb-4">Error: {error}</p>
        <button onClick={fetchData} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors">Try Again</button>
      </div>
    );
    if (files.length === 0) return <FileEmptyState isSearch={!!searchQuery} />;
    return <FileList files={files} onStar={handleStarFile} onDelete={handleDeleteFile} onFolderClick={handleFolderClick} onRestore={handleRestoreFile} onDeleteForever={handleDeleteForever} onViewDetails={setSelectedFile} />;
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-8 py-8 pt-20 min-h-screen max-w-[1600px] mx-auto">
        <Sidebar activeTab={activeTab} onTabChange={handleTabChange} userId={userId} currentFolderId={currentFolderId} onUploadSuccess={fetchData} onGenerateImageClick={handleGenerateImageClick} />

        <div className="flex-1">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-8 mt-2 lg:mt-0 pb-6 border-b border-[rgba(255,255,255,0.06)]">
            <h1 className="text-2xl font-semibold text-white tracking-tight">
              {searchQuery ? `Search Results for "${searchQuery}"` : activeTab === 'starred' ? 'Starred Files' : activeTab === 'trash' ? 'Trash' : 'Workspace'}
            </h1>
            <div className="w-full sm:w-auto sm:max-w-xs">
              <SearchBar onSearch={handleSearch} onClear={handleClearSearch} />
            </div>
          </div>

          {activeTab === "files" && !searchQuery && <FolderNavigation path={folderPath} onNavigate={handleBreadcrumbNavigate} />}
          {activeTab === "trash" && <TrashHeader onEmptyTrash={handleEmptyTrash} onRestoreAll={handleRestoreAll} />}

          <div className="mt-2 min-h-[500px]">
            <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedFile && <FileDetailsModal file={selectedFile} onClose={() => setSelectedFile(null)} />}
      </AnimatePresence>
    </>
  );
}
