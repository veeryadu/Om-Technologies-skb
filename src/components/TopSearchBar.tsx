import React, { useState } from 'react';
import { Search, X, Sparkles, SlidersHorizontal } from 'lucide-react';

interface TopSearchBarProps {
  onSearch?: (query: string) => void;
}

export const TopSearchBar: React.FC<TopSearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const suggestions = [
    'AI Landing Page Design',
    '3D AI Brain Network',
    'Ranjeet Yadav Shikohabad',
    'Custom Websites & Mobile Apps',
    'Hindi Voice Agent & Chatbot',
    '10 Business Automations',
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    onSearch?.(val);
  };

  const handleSelectSuggestion = (item: string) => {
    setQuery(item);
    onSearch?.(item);
    setIsFocused(false);
  };

  return (
    <header className="relative w-full mb-4">
      <div
        className={`flex items-center gap-3.5 w-full px-5 py-3.5 rounded-2xl bg-[#EBE7DF] hover:bg-[#E6E1D8] transition-all duration-200 border ${
          isFocused ? 'border-neutral-400 ring-2 ring-neutral-300 bg-[#E6E1D8]' : 'border-transparent'
        }`}
      >
        <Search className="w-5 h-5 text-[#6D6B64] shrink-0" strokeWidth={2.2} />
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          placeholder="Search"
          className="w-full bg-transparent text-[#22201C] placeholder-[#6D6B64] text-[15px] font-normal outline-none"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              onSearch?.('');
            }}
            className="p-1 rounded-full hover:bg-neutral-300 text-neutral-600 transition"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Quick Suggestions Dropdown on Focus */}
      {isFocused && (
        <>
          <div
            className="fixed inset-0 z-20"
            onClick={() => setIsFocused(false)}
          />
          <div className="absolute left-0 right-0 top-full mt-1.5 p-3 bg-white rounded-2xl shadow-xl border border-neutral-200 z-30 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-2 py-1 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-red-500" />
                Trending Searches
              </span>
              <span className="text-[11px] font-normal text-neutral-400">Press Esc to exit</span>
            </div>
            <div className="mt-1 flex flex-wrap gap-2 p-1">
              {suggestions.map((item, idx) => (
                <button
                  key={idx}
                  onMouseDown={() => handleSelectSuggestion(item)}
                  className="px-3 py-1.5 text-xs font-medium bg-neutral-100 hover:bg-red-50 hover:text-red-600 text-neutral-700 rounded-full transition cursor-pointer"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </header>
  );
};
