import { FileSearch } from 'lucide-react';

type FileEmptyStateProps = {
  isSearch?: boolean;
};

export default function FileEmptyState({ isSearch = false }: FileEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-16 border border-dashed border-[rgba(255,255,255,0.08)] rounded-xl">
      <FileSearch className="w-14 h-14 text-[#5c6070] mb-4" strokeWidth={1} />
      <h3 className="text-lg font-semibold text-[#f0f0f3]">
        {isSearch ? 'No Results Found' : 'No Files Yet'}
      </h3>
      <p className="mt-2 text-sm text-[#5c6070] max-w-sm">
        {isSearch
          ? 'Try a different search term to find what you\'re looking for.'
          : 'Upload your first file or create a folder to get started.'}
      </p>
    </div>
  );
}
