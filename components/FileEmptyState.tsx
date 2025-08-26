import { FileSearch } from 'lucide-react';

type FileEmptyStateProps = {
  isSearch?: boolean;
};

export default function FileEmptyState({ isSearch = false }: FileEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-gray-600/50 rounded-lg">
      <FileSearch className="w-16 h-16 text-gray-400 mb-4" strokeWidth={1} />
      <h3 className="text-xl font-semibold text-white">
        {isSearch ? 'No Results Found' : 'No Files Yet'}
      </h3>
      <p className="mt-2 text-sm text-gray-400">
        {isSearch
          ? 'Try a different search term to find what you\'re looking for.'
          : 'Upload your first file to see it appear here.'}
      </p>
    </div>
  );
}
