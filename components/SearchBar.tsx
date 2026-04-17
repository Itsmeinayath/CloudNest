"use client";

import { useState } from 'react';
import { Search, X } from 'lucide-react';

type SearchBarProps = {
  onSearch: (query: string) => void;
  onClear: () => void;
  isSearching: boolean;
};

export default function SearchBar({ onSearch, onClear, isSearching }: SearchBarProps) {
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
      <div className="relative group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5c6070] group-focus-within:text-indigo-400 transition-colors" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search files..."
          className="w-full pl-10 pr-10 py-2.5 border border-[rgba(255,255,255,0.08)] bg-[#12141a] rounded-lg text-sm text-[#f0f0f3] placeholder-[#5c6070] focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 transition-all duration-200"
        />
        {query && (
          <button
            type="button"
            onClick={handleClearClick}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#5c6070] hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </form>
  );
}
