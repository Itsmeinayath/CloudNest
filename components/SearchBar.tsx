"use client";

import { useState } from 'react';
import { Search, X } from 'lucide-react';

type SearchBarProps = {
  onSearch: (query: string) => void;
  onClear: () => void;
  isSearching: boolean;
};

export default function SearchBar({ onSearch, onClear }: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleClearClick = () => {
    setQuery('');
    onClear();
  };

  return (
    <form onSubmit={handleFormSubmit} className="w-full max-w-md relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search files by name or description..."
          className="w-full pl-10 pr-10 py-2.5 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:border-blue-500 transition-all text-gray-900 dark:text-gray-100"
        />
        {query && (
          <button
            type="button"
            onClick={handleClearClick}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
    </form>
  );
}
