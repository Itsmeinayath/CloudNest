import type { File as FileType } from "@/lib/db/schema";
import FileIcon from "./FileIcon";
import FileAction from "./FileAction";

// This component is now much simpler. It just receives the data and functions it needs.
interface FileListProps {
  files: FileType[];
  onFolderChange: (folder: FileType) => void;
  onStar: (file: FileType) => void;
  onDelete: (file: FileType) => void;
}

export default function FileList({ files, onFolderChange, onStar, onDelete }: FileListProps) {
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
              onFolderChange(file);
            }
          }}
        >
          <div className="absolute top-2 right-2 z-10">
            <FileAction file={file} onStar={onStar} onDelete={onDelete} />
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
