"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export interface SearchableSelectOption {
  id: string;
  label: string;
  description?: string;
  metadata?: string;
}

interface SearchableSelectProps {
  options: SearchableSelectOption[];
  value?: string;
  placeholder?: string;
  onSelect: (value: string) => void;
  onSearch?: (searchTerm: string) => Promise<SearchableSelectOption[]>;
  loading?: boolean;
  error?: string;
  disabled?: boolean;
  className?: string;
  maxHeight?: string;
  showClearButton?: boolean;
}

export function SearchableSelect({
  options,
  value,
  placeholder = "Select an option...",
  onSelect,
  onSearch,
  loading = false,
  error,
  disabled = false,
  className = "",
  maxHeight = "max-h-64",
  showClearButton = true,
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [displayOptions, setDisplayOptions] = useState<SearchableSelectOption[]>(options);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Get selected option
  const selectedOption = displayOptions.find(option => option.id === value);

  // Update display options when options prop changes
  useEffect(() => {
    setDisplayOptions(options);
  }, [options]);

  // Debounced search function
  const debouncedSearch = useCallback(
    async (term: string) => {
      if (!onSearch) return;

      try {
        setIsSearching(true);
        setSearchError(null);
        const results = await onSearch(term);
        setDisplayOptions(results);
      } catch (error) {
        console.error('Search error:', error);
        setSearchError('Search failed');
      } finally {
        setIsSearching(false);
      }
    },
    [onSearch]
  );

  // Debounce search input
  useEffect(() => {
    if (!onSearch) return;

    const timer = setTimeout(() => {
      debouncedSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, debouncedSearch, onSearch]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (optionId: string) => {
    onSelect(optionId);
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleClear = () => {
    onSelect("");
    setSearchTerm("");
  };

  const handleInputClick = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setIsOpen(true);
  };

  const handleInputFocus = () => {
    if (!disabled) {
      setIsOpen(true);
    }
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Input */}
      <div 
        className={`relative cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={handleInputClick}
      >
        <input
          type="text"
          placeholder={selectedOption ? selectedOption.label : placeholder}
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          disabled={disabled}
          className={`w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            disabled ? 'cursor-not-allowed' : 'cursor-pointer'
          } ${error ? 'border-red-300 focus:ring-red-500' : ''}`}
          readOnly={!isOpen}
        />
        
        {/* Right side icons */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          {loading || isSearching ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          ) : (
            <svg 
              className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </div>

        {/* Clear button */}
        {selectedOption && showClearButton && !disabled && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleClear();
            }}
            className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Error message */}
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}

      {/* Dropdown */}
      {isOpen && !disabled && (
        <div className={`absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg ${maxHeight} overflow-y-auto`}>
          {loading || isSearching ? (
            <div className="p-4 text-center text-gray-500 text-sm">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                Loading...
              </div>
            </div>
          ) : searchError ? (
            <div className="p-4 text-center text-red-500 text-sm">
              {searchError}
            </div>
          ) : displayOptions.length === 0 ? (
            <div className="p-4 text-center text-gray-500 text-sm">
              {searchTerm ? 'No options found' : 'No options available'}
            </div>
          ) : (
            <div className="py-1">
              {displayOptions.map(option => (
                <div
                  key={option.id}
                  onClick={() => handleSelect(option.id)}
                  className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                    selectedOption?.id === option.id ? 'bg-blue-50 text-blue-700' : 'text-gray-900'
                  }`}
                >
                  <div className="text-sm font-medium">{option.label}</div>
                  {option.description && (
                    <div className="text-xs text-gray-500 mt-1 line-clamp-1">
                      {option.description}
                    </div>
                  )}
                  {option.metadata && (
                    <div className="text-xs text-gray-400 mt-1">
                      {option.metadata}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
