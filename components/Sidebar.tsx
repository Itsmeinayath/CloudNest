// 🎯 SIDEBAR COMPONENT WITH AI IMAGE GENERATION
// This sidebar provides navigation, file upload, folder creation, and AI image generation

"use client";

// 🧰 IMPORTS
import { useState, useEffect } from 'react';
import { File, Star, Trash2, Sparkles, HardDrive, AlertTriangle } from 'lucide-react';
import FileUploadForm from './FileUploadForm';
import CreateFolderButton from './CreateFolderButton';
import GenerateImageModal from './GenerateImageModal';

// 📋 TYPE DEFINITIONS
export type TabValue = 'files' | 'starred' | 'trash';

type SidebarProps = {
  activeTab: TabValue;
  onTabChange: (tab: TabValue) => void;
  userId: string;
  currentFolderId: string | null;
  onUploadSuccess: () => void;
  onGenerateImageClick: () => void;
};

// 📊 STORAGE INFO INTERFACE
interface StorageInfo {
  used: number;
  total: number;
  usedGB: number;
  totalGB: number;
  percentage: number;
  fileCount: number;
}

// 🎨 NAVIGATION ITEM COMPONENT
const NavItem = ({ 
  isActive, 
  onClick, 
  children 
}: { 
  isActive: boolean; 
  onClick: () => void; 
  children: React.ReactNode; 
}) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-150 ${
      isActive
        ? 'bg-[rgba(99,102,241,0.12)] text-indigo-400'
        : 'text-[#8b8fa3] hover:text-[#f0f0f3] hover:bg-[#1a1d25]'
    }`}
  >
    {children}
  </button>
);

// 🏗️ MAIN SIDEBAR COMPONENT
export default function Sidebar({ 
  activeTab, 
  onTabChange, 
  userId, 
  currentFolderId, 
  onUploadSuccess, 
  onGenerateImageClick 
}: SidebarProps) {
  
  // 🎨 MODAL STATE
  const [isGenerateImageModalOpen, setIsGenerateImageModalOpen] = useState(false);
  
  // 📊 STORAGE STATE
  const [storage, setStorage] = useState<StorageInfo>({
    used: 0,
    total: 10 * 1024 * 1024 * 1024, // 10GB
    usedGB: 0,
    totalGB: 10,
    percentage: 0,
    fileCount: 0
  });
  const [storageLoading, setStorageLoading] = useState(true);

  // 📡 FETCH REAL STORAGE DATA
  useEffect(() => {
    const fetchStorageInfo = async () => {
      try {
        setStorageLoading(true);
        const response = await fetch('/api/storage/usage');
        
        if (response.ok) {
          const data = await response.json();
          
          const used = data.totalSize || 0;
          const total = 10 * 1024 * 1024 * 1024;
          const usedGB = Number((used / (1024 * 1024 * 1024)).toFixed(2));
          const totalGB = 10;
          const percentage = Math.round((used / total) * 100);

          setStorage({
            used,
            total,
            usedGB,
            totalGB,
            percentage: Math.min(percentage, 100),
            fileCount: data.fileCount || 0
          });
        }
      } catch (error) {
        console.error('Failed to fetch storage info:', error);
      } finally {
        setStorageLoading(false);
      }
    };

    if (userId) {
      fetchStorageInfo();
      const interval = setInterval(fetchStorageInfo, 30000);
      return () => clearInterval(interval);
    }
  }, [userId]);

  // 🎯 MODAL HANDLERS
  const handleGenerateImageClick = () => {
    setIsGenerateImageModalOpen(true);
    onGenerateImageClick();
  };

  const handleCloseGenerateImageModal = () => {
    setIsGenerateImageModalOpen(false);
  };

  const handleGenerateImageSuccess = () => {
    setIsGenerateImageModalOpen(false);
    onUploadSuccess(); 
    setTimeout(() => {
      fetchStorageInfo();
    }, 1000);
  };

  const fetchStorageInfo = async () => {
    try {
      const response = await fetch('/api/storage/usage');
      if (response.ok) {
        const data = await response.json();
        const used = data.totalSize || 0;
        const total = 10 * 1024 * 1024 * 1024;
        const usedGB = Number((used / (1024 * 1024 * 1024)).toFixed(2));
        const percentage = Math.round((used / total) * 100);

        setStorage({
          ...storage,
          used,
          usedGB,
          percentage: Math.min(percentage, 100),
          fileCount: data.fileCount || 0
        });
      }
    } catch (error) {
      console.error('Failed to fetch storage info:', error);
    }
  };

  const handleUploadSuccess = () => {
    onUploadSuccess();
    setTimeout(() => {
      fetchStorageInfo();
    }, 1000);
  };

  return (
    <>
      <aside className="w-full lg:w-64 flex-shrink-0 flex flex-col gap-5 pt-6 lg:pt-0">
        
        {/* 📦 ACTIONS SECTION */}
        <div className="flex flex-col gap-3 p-4 bg-[#12141a] rounded-xl border border-[rgba(255,255,255,0.06)]">
          {/* 📤 UPLOAD FILE SECTION */}
          <FileUploadForm 
            currentFolder={currentFolderId} 
            onUploadSuccess={handleUploadSuccess} 
          />
          
          {activeTab === 'files' && (
            <CreateFolderButton 
              parentId={currentFolderId}
              onSuccess={handleUploadSuccess}
            />
          )}
          
          <button
            onClick={handleGenerateImageClick}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-medium text-[#8b8fa3] bg-[#1a1d25] border border-[rgba(255,255,255,0.06)] rounded-lg hover:text-white hover:bg-[#22252f] hover:border-[rgba(255,255,255,0.1)] transition-all"
          >
            <Sparkles className="w-4 h-4 text-violet-400" />
            <span>Generate Image</span>
          </button>
        </div>

        {/* 📋 NAVIGATION SECTION */}
        <div className="flex flex-col gap-0.5 p-2 bg-[#12141a] rounded-xl border border-[rgba(255,255,255,0.06)]">
          <NavItem 
            isActive={activeTab === 'files'} 
            onClick={() => onTabChange('files')}
          >
            <File className="w-4 h-4" />
            <span>Files</span>
            {storage.fileCount > 0 && (
              <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${
                activeTab === 'files' 
                  ? 'bg-[rgba(99,102,241,0.15)] text-indigo-400' 
                  : 'bg-[#1a1d25] text-[#5c6070]'
              }`}>
                {storage.fileCount}
              </span>
            )}
          </NavItem>
          
          <NavItem 
            isActive={activeTab === 'starred'} 
            onClick={() => onTabChange('starred')}
          >
            <Star className="w-4 h-4" />
            <span>Starred</span>
          </NavItem>
          
          <NavItem 
            isActive={activeTab === 'trash'} 
            onClick={() => onTabChange('trash')}
          >
            <Trash2 className="w-4 h-4" />
            <span>Trash</span>
          </NavItem>
        </div>

        {/* 📊 REAL STORAGE INFO SECTION */}
        <div className="mt-auto p-4 bg-[#12141a] rounded-xl border border-[rgba(255,255,255,0.06)]">
          <div className="flex items-center gap-2 text-sm font-medium text-[#8b8fa3] mb-3">
            <HardDrive className="w-4 h-4 text-indigo-400" />
            <span>Storage</span>
          </div>
          
          {storageLoading ? (
            <div className="animate-pulse space-y-2">
              <div className="w-full bg-[#1a1d25] rounded h-1.5"></div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="w-full bg-[#1a1d25] rounded-full h-1.5 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-500 rounded-full"
                  style={{ width: `${storage.percentage}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between items-center text-xs text-[#5c6070]">
                <span>{storage.usedGB} GB used</span>
                <span>{storage.totalGB} GB</span>
              </div>
              
              {storage.percentage > 85 && (
                <div className="flex items-start gap-2 text-xs text-rose-400 bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/20 mt-3">
                  <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                  <p>
                    {storage.percentage > 95 
                      ? 'Storage critically low.' 
                      : 'Storage running low.'}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </aside>

      {/* 🎨 AI IMAGE GENERATION MODAL */}
      <GenerateImageModal
        isOpen={isGenerateImageModalOpen}
        onClose={handleCloseGenerateImageModal}
        onSuccess={handleGenerateImageSuccess}
        currentFolderId={currentFolderId}
      />
    </>
  );
}