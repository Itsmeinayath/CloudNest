"use client";

import { useState, useCallback, useEffect } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Tabs, Tab } from "@heroui/tabs";
import { FileUp, FileText, User } from "lucide-react";
import { useSearchParams } from "next/navigation";

// Import your components
import FileUploadForm from "@/components/FileUploadForm";
import FileList from "@/components/FileList";
import UserProfile from "./UserProfile";
import FolderNavigation from "./FolderNavigation"; // The component from the Canvas
import FileLoadingState from "./FileLoadingState";
import FileEmptyState from "./FileEmptyState";

// Import your types
import type { File as FileType } from "@/lib/db/schema";

interface DashboardContentProps {
  userId: string;
  userName: string;
}

export default function DashboardContent({ userId, userName }: DashboardContentProps) {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");

  // --- STATE MANAGEMENT ---
  const [activeTab, setActiveTab] = useState<string>("files");
  
  // State for the file browser itself
  const [files, setFiles] = useState<FileType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [folderPath, setFolderPath] = useState<(FileType | { id: null; name: 'My Files' })[]>([{ id: null, name: 'My Files' }]);

  // --- DATA FETCHING ---
  const getFiles = useCallback(async (folderId: string | null) => {
    setIsLoading(true);
    try {
      const url = folderId ? `/api/files?parentId=${folderId}` : '/api/files';
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch files.');
      const data = await response.json();
      setFiles(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    getFiles(currentFolderId);
  }, [currentFolderId, getFiles]);

  // --- EVENT HANDLERS ---
  const handleFileUploadSuccess = () => {
    // Refetch files in the current folder after an upload
    getFiles(currentFolderId);
  };

  const handleFolderClick = (folder: FileType) => {
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
  
  // Handlers for starring and deleting files
  const handleStarFile = async (fileToStar: FileType) => {
      await fetch(`/api/files/${fileToStar.id}/star`, { method: 'PATCH' });
      setFiles(files.map(f => f.id === fileToStar.id ? { ...f, isStarred: !f.isStarred } : f));
  };

  const handleDeleteFile = async (fileToDelete: FileType) => {
      await fetch(`/api/files/${fileToDelete.id}/delete`, { method: 'DELETE' });
      setFiles(files.filter(f => f.id !== fileToDelete.id));
  };


  useEffect(() => {
    setActiveTab(tabParam === "profile" ? "profile" : "files");
  }, [tabParam]);

  return (
    <>
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-default-900">
          Hi, <span className="text-primary">{userName?.split(" ")[0] || "there"}</span>!
        </h2>
        <p className="text-default-600 mt-2 text-lg">Your files are waiting for you.</p>
      </div>

      <Tabs
        aria-label="Dashboard Tabs"
        color="primary"
        variant="underlined"
        selectedKey={activeTab}
        onSelectionChange={(key) => setActiveTab(key as string)}
      >
        <Tab key="files" title={ <div className="flex items-center gap-3"><FileText className="h-5 w-5" /><span>My Files</span></div> }>
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Card className="border border-default-200 bg-default-50 shadow-sm">
                <CardHeader className="flex gap-3"><FileUp className="h-5 w-5 text-primary" /><h2 className="text-xl font-semibold">Upload</h2></CardHeader>
                <CardBody>
                  <FileUploadForm userId={userId} onUploadSuccess={handleFileUploadSuccess} currentFolder={currentFolderId} />
                </CardBody>
              </Card>
            </div>
            <div className="lg:col-span-2">
              <Card className="border border-default-200 bg-default-50 shadow-sm">
                <CardHeader>
                  <FolderNavigation path={folderPath} onNavigate={handleBreadcrumbNavigate} />
                </CardHeader>
                <CardBody>
                  {isLoading ? <FileLoadingState /> : 
                   files.length === 0 ? <FileEmptyState /> :
                   <FileList 
                      files={files} 
                      onFolderChange={handleFolderClick} 
                      onStar={handleStarFile}
                      onDelete={handleDeleteFile}
                    />
                  }
                </CardBody>
              </Card>
            </div>
          </div>
        </Tab>
        <Tab key="profile" title={ <div className="flex items-center gap-3"><User className="h-5 w-5" /><span>Profile</span></div> }>
          <div className="mt-8"><UserProfile /></div>
        </Tab>
      </Tabs>
    </>
  );
}
