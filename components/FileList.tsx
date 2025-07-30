import type { File as FileType } from "@/lib/db/schema";
import FileIcon from "./FileIcon";
import FileAction from "./FileAction";

// This interface defines all the functions the component needs from its parent.
interface FileListProps {
  files: FileType[];
  onFolderClick: (folder: FileType) => void;
  onStar: (file: FileType) => void;
  onDelete: (file: FileType) => void;
  onRestore: (file: FileType) => void;
  onDeleteForever: (file: FileType) => void;
}

export default function FileList({ 
  files, 
  onFolderClick, 
  onStar, 
  onDelete,
  onRestore,
  onDeleteForever
}: FileListProps) {

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {files.map((file) => (
        <div
          key={file.id}
          className="group relative flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-lg hover:border-blue-500 dark:hover:border-blue-500 hover:-translate-y-1"
          onClick={() => {
            if (file.isFolder) {
              onFolderClick(file);
            }
          }}
        >
          <div className="absolute top-2 right-2 z-10">
            {/* It correctly passes all the functions down to FileAction. */}
            <FileAction 
              file={file} 
              onStar={onStar} 
              onDelete={onDelete}
              onRestore={onRestore}
              onDeleteForever={onDeleteForever}
            />
          </div>
          
          <FileIcon file={file} />

          <p className="mt-3 text-sm font-medium text-gray-800 dark:text-gray-200 text-center truncate w-full">
            {file.name}
          </p>

          {!file.isFolder && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {formatFileSize(file.size)}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
