import { ChevronRight, Home } from 'lucide-react';
import type { File as FileType } from '@/lib/db/schema';

type FolderNavigationProps = {
  path: (FileType | { id: null; name: string })[];
  onNavigate: (folderId: string | null) => void;
};

export default function FolderNavigation({ path, onNavigate }: FolderNavigationProps) {
  return (
    <nav className="flex items-center text-sm text-[#8b8fa3] mb-6">
      <button
        onClick={() => onNavigate(null)}
        className="flex items-center hover:text-indigo-400 transition-colors"
      >
        <Home className="w-4 h-4 mr-2" />
        My Files
      </button>

      {path.slice(1).map((folder, index) => (
        <div key={folder.id || `folder-${index}`} className="flex items-center">
          <ChevronRight className="w-4 h-4 mx-1 text-[#5c6070]" />
          <button
            onClick={() => onNavigate(folder.id)}
            disabled={index === path.length - 2}
            className="hover:text-indigo-400 transition-colors disabled:text-[#f0f0f3] disabled:font-semibold disabled:cursor-default"
          >
            {folder.name}
          </button>
        </div>
      ))}
    </nav>
  );
}
