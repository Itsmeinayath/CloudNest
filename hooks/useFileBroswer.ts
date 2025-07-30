"use client";

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@clerk/nextjs';
import type { File } from '@/lib/db/schema';
import type { TabValue } from '@/components/Sidebar';

// A custom hook to encapsulate all file browser logic
export function useFileBrowser() {
  const { isLoaded } = useAuth();
  
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [activeTab, setActiveTab] = useState<TabValue>('files');
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [folderPath, setFolderPath] = useState<(File | { id: null; name: 'My Files' })[]>([{ id: null, name: 'My Files' }]);
  const [searchQuery, setSearchQuery] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      let url = '/api/files';
      const params = new URLSearchParams();

      if (searchQuery) {
        url = '/api/files/search';
        params.set('q', searchQuery);
      } else {
        params.set('filter', activeTab);
        if (activeTab === 'files' && currentFolderId) {
          params.set('parentId', currentFolderId);
        }
      }

      const response = await fetch(`${url}?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch data.');
      
      const data = await response.json();
      setFiles(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, currentFolderId, searchQuery]);

  useEffect(() => {
    if (isLoaded) fetchData();
  }, [isLoaded, fetchData]);

  // Abstracted optimistic update handler
  const optimisticUpdate = async (updateFn: (currentFiles: File[]) => File[], apiCall: () => Promise<any>, successMessage: string) => {
    const originalFiles = [...files];
    setFiles(currentFiles => updateFn(currentFiles));
    try {
      await apiCall();
      console.log(successMessage);
    } catch (error) {
      console.error("Action failed:", error);
      setFiles(originalFiles);
    }
  };

  // --- Event Handlers ---
  const handleTabChange = (tab: TabValue) => {
    setActiveTab(tab);
    setSearchQuery(null);
    setCurrentFolderId(null);
    setFolderPath([{ id: null, name: 'My Files' }]);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setActiveTab('files');
  };

  const handleClearSearch = () => setSearchQuery(null);

  const handleFolderClick = (folder: File) => {
    if (searchQuery) setSearchQuery(null);
    setFolderPath(prev => [...prev, folder]);
    setCurrentFolderId(folder.id);
  };

  const handleBreadcrumbNavigate = (folderId: string | null) => {
    const folderIndex = folderPath.findIndex(f => f.id === folderId);
    if (folderIndex !== -1) setFolderPath(folderPath.slice(0, folderIndex + 1));
    setCurrentFolderId(folderId);
  };

  // --- Action Handlers now use the optimisticUpdate helper ---
  const handleStarFile = (file: File) => optimisticUpdate(
    (currentFiles) => currentFiles.map(f => f.id === file.id ? { ...f, isStarred: !f.isStarred } : f).filter(f => activeTab === 'starred' ? f.isStarred : true),
    () => fetch(`/api/files/${file.id}/star`, { method: 'PATCH' }),
    'File starred!'
  );

  const handleDeleteFile = (file: File) => optimisticUpdate(
    (currentFiles) => currentFiles.filter(f => f.id !== file.id),
    () => fetch(`/api/files/${file.id}/delete`, { method: 'DELETE' }),
    'File moved to trash.'
  );

  const handleRestoreFile = (file: File) => optimisticUpdate(
    (currentFiles) => currentFiles.filter(f => f.id !== file.id),
    () => fetch(`/api/files/${file.id}/trash`, { method: 'PATCH' }),
    'File restored.'
  );

  const handleDeleteForever = (file: File) => optimisticUpdate(
    (currentFiles) => currentFiles.filter(f => f.id !== file.id),
    () => fetch(`/api/files/${file.id}/trash`, { method: 'DELETE' }),
    'File deleted forever.'
  );

  const handleEmptyTrash = () => optimisticUpdate(
    () => [],
    () => fetch('/api/files/empty-trash', { method: 'DELETE' }),
    'Trash emptied.'
  );

  const handleRestoreAll = () => optimisticUpdate(
    () => [],
    () => fetch('/api/files/restore-all', { method: 'PATCH' }),
    'All files restored.'
  );

  // Return all the state and handlers needed by the UI
  return {
    files,
    isLoading: !isLoaded || isLoading,
    error,
    activeTab,
    folderPath,
    searchQuery,
    handleTabChange,
    handleSearch,
    handleClearSearch,
    handleFolderClick,
    handleBreadcrumbNavigate,
    handleStarFile,
    handleDeleteFile,
    handleRestoreFile,
    handleDeleteForever,
    handleEmptyTrash,
    handleRestoreAll,
    refetch: fetchData,
  };
}
