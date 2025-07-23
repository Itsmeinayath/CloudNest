import { ChevronRight, Home } from 'lucide-react';
import type { File as FileType } from '@/lib/db/schema';

type FolderNavigationProps = {
  // An array representing the current folder path.
  // e.g., [rootFolder, projectsFolder, designsFolder]
  path: (FileType | { id: null; name: string })[];
  // A function to handle clicks on a breadcrumb link.
  onNavigate: (folderId: string | null) => void;
};

export default function FolderNavigation({ path, onNavigate }: FolderNavigationProps) {
  return (
    <nav className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-6">
      {/* Home/Root button */}
      <button
        onClick={() => onNavigate(null)}
        className="flex items-center hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
      >
        <Home className="w-4 h-4 mr-2" />
        My Files
      </button>

      {/* Map over the rest of the path to create breadcrumbs */}
      {path.slice(1).map((folder, index) => (
        <div key={folder.id || `folder-${index}`} className="flex items-center">
          <ChevronRight className="w-4 h-4 mx-1 text-gray-400 dark:text-gray-500" />
          <button
            onClick={() => onNavigate(folder.id)}
            // Disable the button for the last item in the path (the current folder)
            disabled={index === path.length - 2}
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors disabled:text-gray-800 dark:disabled:text-gray-200 disabled:font-semibold disabled:cursor-default"
          >
            {folder.name}
          </button>
        </div>
      ))}
    </nav>
  );
}
