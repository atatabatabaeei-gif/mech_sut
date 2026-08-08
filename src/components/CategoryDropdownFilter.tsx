import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Check, X, Filter } from 'lucide-react';

export interface CategoryOption {
  id: string;
  label: string;
  count?: number;
}

interface CategoryDropdownFilterProps {
  options: CategoryOption[];
  selectedId: string;
  onSelect: (id: string) => void;
  placeholder?: string;
  allLabel?: string;
  icon?: React.ReactNode;
  className?: string;
  variant?: 'light' | 'dark';
}

export const CategoryDropdownFilter: React.FC<CategoryDropdownFilterProps> = ({
  options,
  selectedId,
  onSelect,
  placeholder = 'انتخاب دسته‌بندی تخصصی',
  allLabel = 'همه موارد',
  icon,
  className = '',
  variant = 'light',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto focus search input when opening
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const selectedOption = options.find((opt) => opt.id === selectedId);
  const isFiltered = selectedId !== 'all';

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (id: string) => {
    onSelect(id);
    setIsOpen(false);
    setSearchTerm('');
  };

  const isDark = variant === 'dark';

  return (
    <div ref={containerRef} className={`relative inline-block text-right ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full md:w-80 min-h-[46px] border text-right px-4 py-2.5 rounded-xl flex items-center justify-between gap-3 shadow-sm transition-all text-xs sm:text-sm font-bold ${
          isDark
            ? isOpen
              ? 'bg-[#1B1B1E] border-orange-500 ring-2 ring-orange-500/20 text-white'
              : isFiltered
              ? 'bg-[#1B1B1E] border-orange-500 text-white'
              : 'bg-[#1B1B1E] border-[#28282D] text-slate-200 hover:border-slate-500'
            : isOpen
            ? 'bg-white border-orange-500 ring-2 ring-orange-500/10 text-slate-900'
            : isFiltered
            ? 'bg-orange-50/20 border-orange-500 text-slate-900'
            : 'bg-white border-slate-300 text-slate-700 hover:border-slate-800'
        }`}
      >
        <div className="flex items-center gap-2.5 truncate">
          <span className="text-orange-500 shrink-0">
            {icon || <Filter className="w-4 h-4" />}
          </span>
          <span className="truncate">
            {selectedId === 'all'
              ? placeholder
              : selectedOption?.label || selectedId}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {isFiltered && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                handleSelect('all');
              }}
              className={`p-1 rounded-full transition-colors ${
                isDark
                  ? 'hover:bg-slate-800 text-slate-400 hover:text-white'
                  : 'hover:bg-slate-200/70 text-slate-400 hover:text-slate-700'
              }`}
              title="پاک کردن فیلتر"
            >
              <X className="w-3.5 h-3.5" />
            </span>
          )}
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-orange-500' : 'text-slate-400'
            }`}
          />
        </div>
      </button>

      {/* Dropdown Menu / Popover */}
      {isOpen && (
        <div
          className={`absolute right-0 top-full mt-2 w-full md:w-80 border rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150 ${
            isDark
              ? 'bg-[#141416] border-[#28282D] text-white'
              : 'bg-white border-slate-300 text-slate-900'
          }`}
        >
          {/* Search Header inside Dropdown */}
          <div
            className={`p-2.5 border-b flex items-center gap-2 ${
              isDark
                ? 'bg-[#1B1B1E] border-[#28282D]'
                : 'bg-slate-50 border-slate-200'
            }`}
          >
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="جستجو در دسته‌بندی‌ها..."
              className={`w-full bg-transparent text-xs sm:text-sm focus:outline-none placeholder:text-slate-500 font-medium ${
                isDark ? 'text-white' : 'text-slate-800'
              }`}
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="text-slate-400 hover:text-slate-300 p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Scrollable Option List */}
          <div
            className={`max-h-64 overflow-y-auto divide-y scrollbar-thin ${
              isDark
                ? 'divide-[#28282D] scrollbar-thumb-slate-700'
                : 'divide-slate-100 scrollbar-thumb-slate-300'
            }`}
          >
            {/* 'All' option */}
            {!searchTerm && (
              <button
                type="button"
                onClick={() => handleSelect('all')}
                className={`w-full text-right p-3 text-xs sm:text-sm flex items-center justify-between transition-colors ${
                  selectedId === 'all'
                    ? isDark
                      ? 'bg-orange-500/10 text-orange-400 font-black border-r-4 border-orange-500'
                      : 'bg-orange-50 text-orange-600 font-black border-r-4 border-orange-500'
                    : isDark
                    ? 'text-slate-200 font-semibold hover:bg-[#1B1B1E] hover:text-orange-400'
                    : 'text-slate-800 font-semibold hover:bg-slate-50 hover:text-orange-600'
                }`}
              >
                <span>{allLabel}</span>
                {selectedId === 'all' && <Check className="w-4 h-4 text-orange-500 shrink-0" />}
              </button>
            )}

            {/* Filtered Options */}
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => {
                const isSelected = selectedId === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleSelect(opt.id)}
                    className={`w-full text-right p-3 text-xs sm:text-sm leading-snug flex items-center justify-between gap-2 transition-colors ${
                      isSelected
                        ? isDark
                          ? 'bg-orange-500/10 text-orange-400 font-black border-r-4 border-orange-500'
                          : 'bg-orange-50 text-orange-600 font-black border-r-4 border-orange-500'
                        : isDark
                        ? 'text-slate-200 font-semibold hover:bg-[#1B1B1E] hover:text-orange-400'
                        : 'text-slate-800 font-semibold hover:bg-slate-50 hover:text-orange-600'
                    }`}
                  >
                    <span className="line-clamp-2">{opt.label}</span>
                    {isSelected && <Check className="w-4 h-4 text-orange-500 shrink-0" />}
                  </button>
                );
              })
            ) : (
              <div className="p-4 text-center text-xs text-slate-500 font-medium">
                دسته‌بندی با این مشخصات یافت نشد.
              </div>
            )}
          </div>

          {/* Footer note showing count */}
          <div
            className={`border-t px-3 py-2 text-[11px] font-bold flex justify-between items-center ${
              isDark
                ? 'bg-[#1B1B1E] border-[#28282D] text-slate-400'
                : 'bg-slate-50 border-slate-200 text-slate-500'
            }`}
          >
            <span>تعداد کل گرایش‌ها: {options.length}</span>
            {isFiltered && (
              <button
                type="button"
                onClick={() => handleSelect('all')}
                className="text-orange-500 hover:underline font-black"
              >
                نمایش همه
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
