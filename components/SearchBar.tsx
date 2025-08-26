"use client";

import { useState } from 'react';
import { Search, X } from 'lucide-react';

type SearchBarProps = {
  onSearch: (query: string) => void;
  onClear: () => void;
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
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search files..."
          className="bg-gray-800/50 border border-gray-600/50 rounded-lg pl-10 pr-10 py-2 text-sm text-white placeholder-gray-400 focus:border-purple-500/50 transition-colors w-full"
        />
        {query && (
          <button
            type="button"
            onClick={handleClearClick}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </form>
  );
}
