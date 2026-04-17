"use client";

import { useState, useEffect, useRef } from 'react';
import type { File as FileType } from '@/lib/db/schema';
import { MoreVertical, Star, Trash2, Download, Undo, Trash, Info } from 'lucide-react';
import FileActionButton from './FileActionButton';

type FileActionProps = {
  file: FileType;
  onStar: (file: FileType) => void;
  onDelete: (file: FileType) => void;
  onRestore: (file: FileType) => void;
  onDeleteForever: (file: FileType) => void;
  onViewDetails: (file: FileType) => void;
};

export default function FileAction({ file, onStar, onDelete, onRestore, onDeleteForever, onViewDetails }: FileActionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuRef]);

  return (
    <div className="relative" ref={menuRef}>
      <button onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }} className="p-1.5 rounded-lg bg-[#12141a]/80 backdrop-blur-sm border border-[rgba(255,255,255,0.08)] hover:bg-[#1a1d25] transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100">
        <MoreVertical className="w-4 h-4 text-[#8b8fa3]" />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-[#1a1d25] border border-[rgba(255,255,255,0.08)] rounded-xl shadow-xl shadow-black/40 z-10 overflow-hidden">
          <ul className="py-1">
            <FileActionButton onClick={() => { onViewDetails(file); setIsOpen(false); }}>
              <Info className="w-4 h-4 mr-3" />
              View Details
            </FileActionButton>

            {file.isTrash ? (
              <>
                <FileActionButton onClick={() => { onRestore(file); setIsOpen(false); }}>
                  <Undo className="w-4 h-4 mr-3" />
                  Restore
                </FileActionButton>
                <FileActionButton 
                  onClick={() => { onDeleteForever(file); setIsOpen(false); }}
                  className="!text-rose-400 hover:!bg-rose-500/10"
                >
                  <Trash className="w-4 h-4 mr-3" />
                  Delete Forever
                </FileActionButton>
              </>
            ) : (
              <>
                <FileActionButton onClick={() => { onStar(file); setIsOpen(false); }}>
                  <Star className={`w-4 h-4 mr-3 ${file.isStarred ? 'text-amber-400 fill-current' : ''}`} />
                  {file.isStarred ? 'Unstar' : 'Star'}
                </FileActionButton>
                
                {!file.isFolder && (
                  <FileActionButton onClick={() => window.open(file.fileUrl!, '_blank')}>
                    <Download className="w-4 h-4 mr-3" />
                    Download
                  </FileActionButton>
                )}

                <FileActionButton 
                  onClick={() => { onDelete(file); setIsOpen(false); }}
                  className="!text-rose-400 hover:!bg-rose-500/10"
                >
                  <Trash2 className="w-4 h-4 mr-3" />
                  Move to Trash
                </FileActionButton>
              </>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
