"use client";

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@clerk/nextjs';
import type { File } from '@/lib/db/schema';
import type { TabValue } from '@/components/Sidebar';

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

  // --- ACTION HANDLERS (Now with correct optimistic updates) ---
  const handleStarFile = async (fileToStar: File) => {
    const originalFiles = [...files];
    const newFiles = files.map(f => f.id === fileToStar.id ? { ...f, isStarred: !f.isStarred } : f);
    setFiles(activeTab === 'starred' ? newFiles.filter(f => f.isStarred) : newFiles);
    try {
      await fetch(`/api/files/${fileToStar.id}/star`, { method: 'PATCH' });
    } catch { setFiles(originalFiles); }
  };

  const handleDeleteFile = async (fileToDelete: File) => {
    const originalFiles = [...files];
    setFiles(files.filter(f => f.id !== fileToDelete.id));
    try {
      await fetch(`/api/files/${fileToDelete.id}/delete`, { method: 'DELETE' });
    } catch { setFiles(originalFiles); }
  };

  const handleRestoreFile = async (fileToRestore: File) => {
    const originalFiles = [...files];
    setFiles(files.filter(f => f.id !== fileToRestore.id));
    try {
      await fetch(`/api/files/${fileToRestore.id}/trash`, { method: 'PATCH' });
    } catch { setFiles(originalFiles); }
  };

  const handleDeleteForever = async (fileToDelete: File) => {
    const originalFiles = [...files];
    setFiles(files.filter(f => f.id !== fileToDelete.id));
    try {
      await fetch(`/api/files/${fileToDelete.id}/trash`, { method: 'DELETE' });
    } catch { setFiles(originalFiles); }
  };
  
  // Other handlers remain the same...
  const handleTabChange = (tab: TabValue) => {
    setActiveTab(tab);
    setSearchQuery(null);
    setCurrentFolderId(null);
    setFolderPath([{ id: null, name: 'My Files' }]);
  };
  const handleSearch = (query: string) => setSearchQuery(query);
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
  const handleEmptyTrash = async () => {
    const originalFiles = [...files];
    setFiles([]);
    try {
      await fetch('/api/files/empty-trash', { method: 'DELETE' });
    } catch { setFiles(originalFiles); }
  };
  const handleRestoreAll = async () => {
    const originalFiles = [...files];
    setFiles([]);
    try {
      await fetch('/api/files/restore-all', { method: 'PATCH' });
    } catch { setFiles(originalFiles); }
  };

  return {
    files, isLoading: !isLoaded || isLoading, error, activeTab, folderPath, searchQuery,
    handleTabChange, handleSearch, handleClearSearch, handleFolderClick, handleBreadcrumbNavigate,
    handleStarFile, handleDeleteFile, handleRestoreFile, handleDeleteForever, handleEmptyTrash, handleRestoreAll,
    refetch: fetchData,
  };
}
