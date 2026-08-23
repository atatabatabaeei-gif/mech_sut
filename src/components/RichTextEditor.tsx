import React, { useRef, useEffect, useState } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  AlignRight,
  AlignCenter,
  AlignJustify,
  Eraser,
  Undo2,
  Redo2,
  Highlighter,
  Heading2,
  Heading3,
  Type,
  Plus,
  Scissors,
  Palette,
  Paintbrush,
  Check,
  RotateCcw,
  Sparkles,
  ChevronDown,
  SlidersHorizontal
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
  theme?: 'dark' | 'light';
  id?: string;
  showQuickTemplates?: boolean;
  templatesType?: 'faculty' | 'lab' | 'general';
}

// Convert plain text into paragraphs/html if needed
export const normalizeToHtml = (textOrHtml: string): string => {
  if (!textOrHtml) return '';
  const trimmed = textOrHtml.trim();
  // If it already contains HTML tags like <p>, <ul>, <div>, <strong>, <h3>
  if (/<[a-z][\s\S]*>/i.test(trimmed)) {
    return trimmed;
  }
  // Otherwise wrap lines in <p> tags
  return trimmed
    .split('\n\n')
    .map((para) => {
      const lines = para.split('\n').join('<br />');
      return `<p>${lines}</p>`;
    })
    .join('');
};

// Preset text colors palette
const TEXT_COLORS = [
  { label: 'مشکی رسمی', color: '#0f172a' },
  { label: 'خاکستری تیره', color: '#334155' },
  { label: 'نارنجی رسمی شریف', color: '#ea580c' },
  { label: 'نارنجی پررنگ', color: '#c2410c' },
  { label: 'سرمه‌ای دانشگاهی', color: '#1e3a8a' },
  { label: 'آبی مهندسی', color: '#2563eb' },
  { label: 'سبز پژوهشی', color: '#059669' },
  { label: 'سبز تیره', color: '#15803d' },
  { label: 'قرمز یاقوتی', color: '#dc2626' },
  { label: 'زرشکی', color: '#991b1b' },
  { label: 'کهربایی / طلایی', color: '#d97706' },
  { label: 'بنفش سلطنتی', color: '#7c3aed' },
  { label: 'سفید / روشن', color: '#ffffff' },
  { label: 'خاکستری روشن', color: '#94a3b8' },
];

// Preset highlight / background colors palette
const HIGHLIGHT_COLORS = [
  { label: 'هلویی شریف', color: '#ffedd5', border: '#fdba74' },
  { label: 'زرد طلایی', color: '#fef08a', border: '#fde047' },
  { label: 'سبز نعنایی', color: '#dcfce7', border: '#86efac' },
  { label: 'آبی یخی', color: '#e0f2fe', border: '#7dd3fc' },
  { label: 'صورتی ملایم', color: '#ffe4e6', border: '#fca5a5' },
  { label: 'بنفش یاسی', color: '#f3e8ff', border: '#d8b4fe' },
  { label: 'خاکستری ملایم', color: '#f1f5f9', border: '#cbd5e1' },
  { label: 'نارنجی تأکیدی', color: '#fed7aa', border: '#fb923c' },
  { label: 'زرد پررنگ', color: '#fef08a', border: '#eab308' },
  { label: 'سبز چمنی', color: '#bbf7d0', border: '#4ade80' },
  { label: 'آبی آسمانی', color: '#bae6fd', border: '#38bdf8' },
  { label: 'سرمه‌ای تیره (متن روشن)', color: '#1e3a8a', border: '#172554' },
  { label: 'نارنجی تیره (متن روشن)', color: '#c2410c', border: '#9a3412' },
];

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'متن بیوگرافی و سوابق را وارد کنید...',
  minHeight = '140px',
  theme = 'dark',
  id = 'rich-text-editor',
  showQuickTemplates = true,
  templatesType = 'faculty',
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const savedRangeRef = useRef<Range | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [showTextColorMenu, setShowTextColorMenu] = useState(false);
  const [showHighlightMenu, setShowHighlightMenu] = useState(false);
  const [showCalloutMenu, setShowCalloutMenu] = useState(false);

  const [currentTextColor, setCurrentTextColor] = useState<string>('#ea580c');
  const [currentHighlightColor, setCurrentHighlightColor] = useState<string>('#fed7aa');
  const [customTextHex, setCustomTextHex] = useState<string>('#ea580c');
  const [customHighlightHex, setCustomHighlightHex] = useState<string>('#ffedd5');

  const [activeFormats, setActiveFormats] = useState<{
    bold: boolean;
    italic: boolean;
    underline: boolean;
    strikeThrough: boolean;
    insertUnorderedList: boolean;
    insertOrderedList: boolean;
    justifyRight: boolean;
    justifyCenter: boolean;
    justifyFull: boolean;
  }>({
    bold: false,
    italic: false,
    underline: false,
    strikeThrough: false,
    insertUnorderedList: false,
    insertOrderedList: false,
    justifyRight: true,
    justifyCenter: false,
    justifyFull: false,
  });

  const isDark = theme === 'dark';

  // Initial and external sync
  useEffect(() => {
    if (editorRef.current) {
      const currentHtml = editorRef.current.innerHTML;
      const targetHtml = normalizeToHtml(value);
      if (currentHtml !== targetHtml && document.activeElement !== editorRef.current) {
        editorRef.current.innerHTML = targetHtml;
      }
    }
  }, [value]);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowTextColorMenu(false);
        setShowHighlightMenu(false);
        setShowCalloutMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      savedRangeRef.current = sel.getRangeAt(0).cloneRange();
    }
  };

  const restoreSelection = () => {
    if (savedRangeRef.current && editorRef.current) {
      editorRef.current.focus();
      const sel = window.getSelection();
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(savedRangeRef.current);
      }
    }
  };

  const updateActiveFormats = () => {
    try {
      setActiveFormats({
        bold: document.queryCommandState('bold'),
        italic: document.queryCommandState('italic'),
        underline: document.queryCommandState('underline'),
        strikeThrough: document.queryCommandState('strikeThrough'),
        insertUnorderedList: document.queryCommandState('insertUnorderedList'),
        insertOrderedList: document.queryCommandState('insertOrderedList'),
        justifyRight: document.queryCommandState('justifyRight'),
        justifyCenter: document.queryCommandState('justifyCenter'),
        justifyFull: document.queryCommandState('justifyFull'),
      });
    } catch {
      // ignore
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      onChange(html);
    }
  };

  const executeCommand = (command: string, val: string | undefined = undefined) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    document.execCommand(command, false, val);
    updateActiveFormats();
    handleInput();
  };

  const setBlockType = (tag: string) => {
    executeCommand('formatBlock', tag);
  };

  const applyTextColor = (color: string) => {
    restoreSelection();
    if (!editorRef.current) return;
    editorRef.current.focus();
    document.execCommand('foreColor', false, color);
    setCurrentTextColor(color);
    updateActiveFormats();
    handleInput();
    setShowTextColorMenu(false);
  };

  const removeTextColor = () => {
    restoreSelection();
    if (!editorRef.current) return;
    editorRef.current.focus();
    document.execCommand('removeFormat', false, undefined);
    handleInput();
    setShowTextColorMenu(false);
  };

  const applyHighlightColor = (color: string) => {
    restoreSelection();
    if (!editorRef.current) return;
    editorRef.current.focus();
    
    // Check if background color should be cleared
    if (color === 'transparent') {
      document.execCommand('hiliteColor', false, 'transparent');
      document.execCommand('backColor', false, 'transparent');
    } else {
      document.execCommand('hiliteColor', false, color);
      // Fallback for some browsers
      document.execCommand('backColor', false, color);
    }
    
    setCurrentHighlightColor(color);
    updateActiveFormats();
    handleInput();
    setShowHighlightMenu(false);
  };

  const insertTemplate = (title: string, templateHtml: string) => {
    restoreSelection();
    if (!editorRef.current) return;
    editorRef.current.focus();
    document.execCommand('insertHTML', false, templateHtml);
    handleInput();
  };

  return (
    <div
      id={id}
      ref={containerRef}
      className={`rounded-xl border transition-all overflow-visible relative ${
        isDark
          ? 'bg-[#141416] border-[#28282D] focus-within:border-[#E8530D]'
          : 'bg-white border-slate-300 focus-within:border-orange-500 shadow-sm'
      }`}
    >
      {/* Top Toolbar */}
      <div
        className={`p-2 border-b flex flex-wrap items-center gap-1 text-xs select-none no-print rounded-t-xl ${
          isDark ? 'bg-[#1B1B1E] border-[#28282D] text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
        }`}
      >
        {/* Style Selector / Headings */}
        <div className="flex items-center gap-1 border-l border-slate-300 dark:border-[#38383D] pl-1.5 ml-1">
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              setBlockType('p');
            }}
            className={`p-1.5 rounded font-bold text-xs flex items-center gap-1 transition-colors ${
              isDark ? 'hover:bg-[#28282D] hover:text-white' : 'hover:bg-slate-200 text-slate-700'
            }`}
            title="متن عادی / پاراگراف"
          >
            <Type className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px]">عادی</span>
          </button>

          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              setBlockType('h3');
            }}
            className={`p-1.5 rounded font-bold text-xs flex items-center gap-1 transition-colors ${
              isDark ? 'hover:bg-[#28282D] hover:text-white' : 'hover:bg-slate-200 text-slate-700'
            }`}
            title="سرتیتر بزرگ (H3)"
          >
            <Heading2 className="w-3.5 h-3.5 text-orange-500" />
            <span className="hidden sm:inline text-[11px]">تیتر بزرگ</span>
          </button>

          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              setBlockType('h4');
            }}
            className={`p-1.5 rounded font-bold text-xs flex items-center gap-1 transition-colors ${
              isDark ? 'hover:bg-[#28282D] hover:text-white' : 'hover:bg-slate-200 text-slate-700'
            }`}
            title="سرتیتر متوسط (H4)"
          >
            <Heading3 className="w-3.5 h-3.5 text-orange-500" />
            <span className="hidden sm:inline text-[11px]">تیتر متوسط</span>
          </button>
        </div>

        {/* Basic Text Formatting */}
        <div className="flex items-center gap-0.5 border-l border-slate-300 dark:border-[#38383D] pl-1.5 ml-1">
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand('bold');
            }}
            className={`p-1.5 rounded transition-colors ${
              activeFormats.bold
                ? 'bg-orange-500 text-white font-black'
                : isDark
                ? 'hover:bg-[#28282D] text-slate-200'
                : 'hover:bg-slate-200 text-slate-800'
            }`}
            title="برجسته / Bold (Ctrl+B)"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand('italic');
            }}
            className={`p-1.5 rounded transition-colors ${
              activeFormats.italic
                ? 'bg-orange-500 text-white'
                : isDark
                ? 'hover:bg-[#28282D] text-slate-200'
                : 'hover:bg-slate-200 text-slate-800'
            }`}
            title="مورب / Italic (Ctrl+I)"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand('underline');
            }}
            className={`p-1.5 rounded transition-colors ${
              activeFormats.underline
                ? 'bg-orange-500 text-white'
                : isDark
                ? 'hover:bg-[#28282D] text-slate-200'
                : 'hover:bg-slate-200 text-slate-800'
            }`}
            title="زیرخط / Underline (Ctrl+U)"
          >
            <Underline className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand('strikeThrough');
            }}
            className={`p-1.5 rounded transition-colors ${
              activeFormats.strikeThrough
                ? 'bg-orange-500 text-white'
                : isDark
                ? 'hover:bg-[#28282D] text-slate-200'
                : 'hover:bg-slate-200 text-slate-800'
            }`}
            title="خط‌خورده / Strikethrough"
          >
            <Strikethrough className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* ═══════════ COLOR PICKERS (TEXT & HIGHLIGHT) ═══════════ */}
        <div className="flex items-center gap-1 border-l border-slate-300 dark:border-[#38383D] pl-1.5 ml-1 relative">
          
          {/* 1. Text Color Dropdown Button */}
          <div className="relative">
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                saveSelection();
                setShowTextColorMenu(!showTextColorMenu);
                setShowHighlightMenu(false);
                setShowCalloutMenu(false);
              }}
              className={`p-1.5 rounded flex items-center gap-1 transition-all ${
                showTextColorMenu
                  ? 'bg-orange-500 text-white font-bold'
                  : isDark
                  ? 'hover:bg-[#28282D] text-slate-200'
                  : 'hover:bg-slate-200 text-slate-800'
              }`}
              title="تغییر رنگ قلم و متن (Text Color)"
            >
              <div className="flex flex-col items-center justify-center">
                <Palette className="w-3.5 h-3.5" />
                <span
                  className="w-3 h-0.5 mt-0.5 rounded-full"
                  style={{ backgroundColor: currentTextColor }}
                />
              </div>
              <span className="hidden sm:inline text-[11px] font-medium">رنگ قلم</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>

            {/* Text Color Popover Menu */}
            {showTextColorMenu && (
              <div
                className={`absolute top-full right-0 mt-1.5 z-50 p-3 rounded-xl border shadow-2xl w-64 text-right ${
                  isDark
                    ? 'bg-[#1e1e24] border-[#33333d] text-white'
                    : 'bg-white border-slate-300 text-slate-900'
                }`}
              >
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200 dark:border-[#33333d]">
                  <span className="font-black text-xs flex items-center gap-1.5 text-orange-500">
                    <Palette className="w-4 h-4" />
                    انتخاب رنگ قلم و متن
                  </span>
                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      removeTextColor();
                    }}
                    className="text-[10px] text-rose-500 hover:underline flex items-center gap-1 font-bold"
                    title="حذف رنگ متن و بازگشت به حالت پیش‌فرض"
                  >
                    <RotateCcw className="w-2.5 h-2.5" />
                    حالت پیش‌فرض
                  </button>
                </div>

                {/* Color Swatches Grid */}
                <div className="grid grid-cols-7 gap-1.5 mb-3">
                  {TEXT_COLORS.map((item) => {
                    const isSelected = currentTextColor.toLowerCase() === item.color.toLowerCase();
                    return (
                      <button
                        key={item.color}
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          applyTextColor(item.color);
                        }}
                        className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-transform hover:scale-110 relative ${
                          isSelected ? 'ring-2 ring-orange-500 ring-offset-1 z-10' : 'border-slate-300 dark:border-[#44444e]'
                        }`}
                        style={{ backgroundColor: item.color }}
                        title={item.label}
                      >
                        {isSelected && (
                          <Check
                            className={`w-3.5 h-3.5 ${
                              item.color === '#ffffff' || item.color === '#fef08a' || item.color === '#ffedd5'
                                ? 'text-black'
                                : 'text-white'
                            }`}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Custom Hex Color Picker */}
                <div className={`pt-2.5 border-t flex items-center justify-between gap-2 text-xs ${
                  isDark ? 'border-[#33333d]' : 'border-slate-200'
                }`}>
                  <label className="text-[11px] font-bold opacity-80 flex items-center gap-1">
                    <SlidersHorizontal className="w-3 h-3 text-orange-500" />
                    رنگ سفارشی:
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="color"
                      value={customTextHex}
                      onChange={(e) => {
                        setCustomTextHex(e.target.value);
                        applyTextColor(e.target.value);
                      }}
                      className="w-7 h-7 rounded border cursor-pointer bg-transparent p-0"
                      title="انتخاب رنگ دلخواه"
                    />
                    <input
                      type="text"
                      value={customTextHex}
                      onChange={(e) => {
                        setCustomTextHex(e.target.value);
                        if (/^#[0-9A-F]{6}$/i.test(e.target.value)) {
                          applyTextColor(e.target.value);
                        }
                      }}
                      className={`w-16 px-1.5 py-1 text-[10px] font-mono border rounded uppercase text-center ${
                        isDark ? 'bg-[#141416] border-[#383842] text-white' : 'bg-slate-50 border-slate-300 text-slate-800'
                      }`}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 2. Highlight / Background Color Dropdown Button */}
          <div className="relative">
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                saveSelection();
                setShowHighlightMenu(!showHighlightMenu);
                setShowTextColorMenu(false);
                setShowCalloutMenu(false);
              }}
              className={`p-1.5 rounded flex items-center gap-1 transition-all ${
                showHighlightMenu
                  ? 'bg-amber-500 text-white font-bold'
                  : isDark
                  ? 'hover:bg-[#28282D] text-amber-400'
                  : 'hover:bg-slate-200 text-amber-600'
              }`}
              title="تغییر رنگ هایلایت و پس‌زمینه متن (Highlight Color)"
            >
              <div className="flex flex-col items-center justify-center">
                <Highlighter className="w-3.5 h-3.5" />
                <span
                  className="w-3 h-0.5 mt-0.5 rounded-full"
                  style={{ backgroundColor: currentHighlightColor }}
                />
              </div>
              <span className="hidden sm:inline text-[11px] font-medium">هایلایت</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>

            {/* Highlight Popover Menu */}
            {showHighlightMenu && (
              <div
                className={`absolute top-full right-0 mt-1.5 z-50 p-3 rounded-xl border shadow-2xl w-64 text-right ${
                  isDark
                    ? 'bg-[#1e1e24] border-[#33333d] text-white'
                    : 'bg-white border-slate-300 text-slate-900'
                }`}
              >
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200 dark:border-[#33333d]">
                  <span className="font-black text-xs flex items-center gap-1.5 text-amber-500">
                    <Highlighter className="w-4 h-4" />
                    انتخاب رنگ هایلایت متن
                  </span>
                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      applyHighlightColor('transparent');
                    }}
                    className="text-[10px] text-rose-500 hover:underline flex items-center gap-1 font-bold"
                    title="حذف هایلایت و بدون رنگ کردن پس‌زمینه"
                  >
                    <RotateCcw className="w-2.5 h-2.5" />
                    بدون هایلایت
                  </button>
                </div>

                {/* Highlight Swatches Grid */}
                <div className="grid grid-cols-7 gap-1.5 mb-3">
                  {HIGHLIGHT_COLORS.map((item) => {
                    const isSelected = currentHighlightColor.toLowerCase() === item.color.toLowerCase();
                    return (
                      <button
                        key={item.color}
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          applyHighlightColor(item.color);
                        }}
                        className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-transform hover:scale-110 relative ${
                          isSelected ? 'ring-2 ring-amber-500 ring-offset-1 z-10' : 'border-slate-300 dark:border-[#44444e]'
                        }`}
                        style={{ backgroundColor: item.color, borderColor: item.border }}
                        title={item.label}
                      >
                        {isSelected && (
                          <Check
                            className={`w-3.5 h-3.5 ${
                              item.color === '#1e3a8a' || item.color === '#c2410c' ? 'text-white' : 'text-slate-900'
                            }`}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Custom Hex Highlight Picker */}
                <div className={`pt-2.5 border-t flex items-center justify-between gap-2 text-xs ${
                  isDark ? 'border-[#33333d]' : 'border-slate-200'
                }`}>
                  <label className="text-[11px] font-bold opacity-80 flex items-center gap-1">
                    <Paintbrush className="w-3 h-3 text-amber-500" />
                    رنگ هایلایت سفارشی:
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="color"
                      value={customHighlightHex}
                      onChange={(e) => {
                        setCustomHighlightHex(e.target.value);
                        applyHighlightColor(e.target.value);
                      }}
                      className="w-7 h-7 rounded border cursor-pointer bg-transparent p-0"
                      title="انتخاب رنگ هایلایت دلخواه"
                    />
                    <input
                      type="text"
                      value={customHighlightHex}
                      onChange={(e) => {
                        setCustomHighlightHex(e.target.value);
                        if (/^#[0-9A-F]{6}$/i.test(e.target.value)) {
                          applyHighlightColor(e.target.value);
                        }
                      }}
                      className={`w-16 px-1.5 py-1 text-[10px] font-mono border rounded uppercase text-center ${
                        isDark ? 'bg-[#141416] border-[#383842] text-white' : 'bg-slate-50 border-slate-300 text-slate-800'
                      }`}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Lists & Quotes */}
        <div className="flex items-center gap-0.5 border-l border-slate-300 dark:border-[#38383D] pl-1.5 ml-1">
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand('insertUnorderedList');
            }}
            className={`p-1.5 rounded transition-colors ${
              activeFormats.insertUnorderedList
                ? 'bg-orange-500 text-white'
                : isDark
                ? 'hover:bg-[#28282D] text-slate-200'
                : 'hover:bg-slate-200 text-slate-800'
            }`}
            title="لیست نشانه‌دار (بولت پوینت)"
          >
            <List className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand('insertOrderedList');
            }}
            className={`p-1.5 rounded transition-colors ${
              activeFormats.insertOrderedList
                ? 'bg-orange-500 text-white'
                : isDark
                ? 'hover:bg-[#28282D] text-slate-200'
                : 'hover:bg-slate-200 text-slate-800'
            }`}
            title="لیست شماره‌دار (۱، ۲، ۳)"
          >
            <ListOrdered className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              setBlockType('blockquote');
            }}
            className={`p-1.5 rounded transition-colors ${
              isDark ? 'hover:bg-[#28282D] text-slate-200' : 'hover:bg-slate-200 text-slate-800'
            }`}
            title="نقل قول / کادر برجسته"
          >
            <Quote className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Alignments */}
        <div className="flex items-center gap-0.5 border-l border-slate-300 dark:border-[#38383D] pl-1.5 ml-1">
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand('justifyRight');
            }}
            className={`p-1.5 rounded transition-colors ${
              activeFormats.justifyRight
                ? 'bg-orange-500 text-white'
                : isDark
                ? 'hover:bg-[#28282D] text-slate-200'
                : 'hover:bg-slate-200 text-slate-800'
            }`}
            title="راست‌چین"
          >
            <AlignRight className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand('justifyCenter');
            }}
            className={`p-1.5 rounded transition-colors ${
              activeFormats.justifyCenter
                ? 'bg-orange-500 text-white'
                : isDark
                ? 'hover:bg-[#28282D] text-slate-200'
                : 'hover:bg-slate-200 text-slate-800'
            }`}
            title="وسط‌چین"
          >
            <AlignCenter className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand('justifyFull');
            }}
            className={`p-1.5 rounded transition-colors ${
              activeFormats.justifyFull
                ? 'bg-orange-500 text-white'
                : isDark
                ? 'hover:bg-[#28282D] text-slate-200'
                : 'hover:bg-slate-200 text-slate-800'
            }`}
            title="تراز دوطرفه (Justify)"
          >
            <AlignJustify className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Clear & Undo/Redo */}
        <div className="flex items-center gap-0.5 mr-auto">
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand('removeFormat');
            }}
            className={`p-1.5 rounded transition-colors ${
              isDark ? 'hover:bg-[#28282D] text-rose-400' : 'hover:bg-slate-200 text-rose-600'
            }`}
            title="پاک کردن فرمت متون انتخاب‌شده"
          >
            <Eraser className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand('undo');
            }}
            className={`p-1.5 rounded transition-colors ${
              isDark ? 'hover:bg-[#28282D] text-slate-200' : 'hover:bg-slate-200 text-slate-700'
            }`}
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand('redo');
            }}
            className={`p-1.5 rounded transition-colors ${
              isDark ? 'hover:bg-[#28282D] text-slate-200' : 'hover:bg-slate-200 text-slate-700'
            }`}
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Quick Section & Colored Callout Templates */}
      {showQuickTemplates && (
        <div
          className={`px-3 py-2 text-[11px] flex flex-wrap items-center gap-2 border-b select-none no-print ${
            isDark ? 'bg-[#18181B] border-[#28282D] text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
          }`}
        >
          <span className="font-bold flex items-center gap-1 text-orange-500">
            <Plus className="w-3 h-3" />
            {templatesType === 'lab' ? 'بخش‌های آماده آزمایشگاه:' : 'بخش‌های آماده معرفی:'}
          </span>

          {templatesType === 'lab' ? (
            <>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  insertTemplate(
                    'اهداف و محورها',
                    `<h3>اهداف و محورهای فعالیت آزمایشگاه:</h3><ul><li>انجام آزمون‌های تخصصی، استاندارد و عیب‌یابی صنعتی</li><li>توسعه فناوری‌های پیشرفته، طراحی و نمونه‌سازی تجربی</li><li>انجام پروژه‌های مشترک ارتباط با صنعت و مشاوره‌های فنی مهندسی</li></ul>`
                  );
                }}
                className={`px-2 py-0.5 rounded border transition-colors ${
                  isDark
                    ? 'bg-[#222226] border-[#333338] hover:border-orange-500 hover:text-white'
                    : 'bg-white border-slate-300 hover:border-orange-500 text-slate-800'
                }`}
              >
                + اهداف و محورها (لیست)
              </button>

              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  insertTemplate(
                    'خدمات صنعتی',
                    `<h3>خدمات قابل ارائه به صنایع و شرکت‌ها:</h3><ol><li>طراحی، ساخت و تست ستاپ‌های آزمایشگاهی سفارشی</li><li>اندازه‌گیری و کالیبراسیون سنسورها و عملگرها با دقت بالا</li><li>شبیه‌سازی و صحه‌گذاری تجربی نتایج عددی</li></ol>`
                  );
                }}
                className={`px-2 py-0.5 rounded border transition-colors ${
                  isDark
                    ? 'bg-[#222226] border-[#333338] hover:border-orange-500 hover:text-white'
                    : 'bg-white border-slate-300 hover:border-orange-500 text-slate-800'
                }`}
              >
                + خدمات صنعتی و آزمون‌ها
              </button>

              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  insertTemplate(
                    'استانداردها',
                    `<h3>استانداردها و تاییدیه‌های فنی:</h3><p>آزمایشگاه دارای تاییدیه معتبر، تجهیزات کالیبره شده و آماده پذیرش نمونه‌ها بر اساس استانداردهای ملی و بین‌المللی است.</p>`
                  );
                }}
                className={`px-2 py-0.5 rounded border transition-colors ${
                  isDark
                    ? 'bg-[#222226] border-[#333338] hover:border-orange-500 hover:text-white'
                    : 'bg-white border-slate-300 hover:border-orange-500 text-slate-800'
                }`}
              >
                + استانداردها و تاییدیه‌ها
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  insertTemplate(
                    'تحصیلات',
                    `<h3>سوابق تحصیلی و دانشگاهی:</h3><ul><li><strong>دکتری:</strong> مهندسی مکانیک، دانشگاه صنعتی شریف (سال فارغ‌التحصیلی)</li><li><strong>کارشناسی ارشد:</strong> مهندسی مکانیک، گرایش تبدیل انرژی (سال فارغ‌التحصیلی)</li></ul>`
                  );
                }}
                className={`px-2 py-0.5 rounded border transition-colors ${
                  isDark
                    ? 'bg-[#222226] border-[#333338] hover:border-orange-500 hover:text-white'
                    : 'bg-white border-slate-300 hover:border-orange-500 text-slate-800'
                }`}
              >
                + تحصیلات
              </button>

              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  insertTemplate(
                    'زمینه‌های پژوهشی',
                    `<h3>زمینه‌های پژوهشی و تخصصی:</h3><ul><li>طراحی و شبیه‌سازی سیستم‌های حرارتی و برودتی</li><li>دینامیک سیالات محاسباتی و توربولانس</li><li>بهینه‌سازی مصرف انرژی در صنایع نفت و پتروشیمی</li></ul>`
                  );
                }}
                className={`px-2 py-0.5 rounded border transition-colors ${
                  isDark
                    ? 'bg-[#222226] border-[#333338] hover:border-orange-500 hover:text-white'
                    : 'bg-white border-slate-300 hover:border-orange-500 text-slate-800'
                }`}
              >
                + زمینه‌های پژوهشی (لیست)
              </button>

              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  insertTemplate(
                    'افتخارات',
                    `<h3>افتخارات و جوایز علمی:</h3><ol><li>استاد نمونه آموزشی و پژوهشی دانشکده مهندسی مکانیک</li><li>پژوهشگر برتر ارتباط با صنعت در سطح دانشگاه صنعتی شریف</li></ol>`
                  );
                }}
                className={`px-2 py-0.5 rounded border transition-colors ${
                  isDark
                    ? 'bg-[#222226] border-[#333338] hover:border-orange-500 hover:text-white'
                    : 'bg-white border-slate-300 hover:border-orange-500 text-slate-800'
                }`}
              >
                + جوایز و افتخارات (شماره‌دار)
              </button>
            </>
          )}

          {/* Pre-styled colored callout boxes */}
          <div className="flex items-center gap-1 border-r border-slate-300 dark:border-[#333338] pr-2 mr-1">
            <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              کادرهای رنگی:
            </span>

            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                insertTemplate(
                  'کادر نارنجی',
                  `<div class="callout-box callout-box-orange"><strong>نکته کلیدی و تمایز تخصصی:</strong> این بخش شامل توضیحات تأکیدی و برجسته مربوط به خدمات و دستاوردهای دانشگاهی است.</div><p><br /></p>`
                );
              }}
              className="px-1.5 py-0.5 rounded text-[10px] font-bold border border-orange-500/40 bg-orange-500/10 text-orange-600 hover:bg-orange-500/20 transition-colors"
              title="درج کادر تأکیدی نارنجی شریف"
            >
              🟧 کادر نارنجی
            </button>

            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                insertTemplate(
                  'کادر آبی',
                  `<div class="callout-box callout-box-blue"><strong>اطلاعات فنی و همکاری صنعتی:</strong> پروژه‌های مشترک و قراردادهای ارتباط با صنعت با کیفیت استاندارد انجام می‌شوند.</div><p><br /></p>`
                );
              }}
              className="px-1.5 py-0.5 rounded text-[10px] font-bold border border-blue-500/40 bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 transition-colors"
              title="درج کادر اطلاعات آبی مهندسی"
            >
              🟦 کادر آبی
            </button>

            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                insertTemplate(
                  'کادر سبز',
                  `<div class="callout-box callout-box-green"><strong>تأییدیه‌ها و استانداردهای اخذ شده:</strong> تجهیزات و آزمون‌ها دارای استانداردهای معتبر آزمایشگاهی هستند.</div><p><br /></p>`
                );
              }}
              className="px-1.5 py-0.5 rounded text-[10px] font-bold border border-emerald-500/40 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 transition-colors"
              title="درج کادر سبز استاندارد و دستاوردها"
            >
              🟩 کادر سبز
            </button>
          </div>

          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              insertTemplate(
                'شکستگی صفحه',
                `<div data-page-break="true" class="html-page-break"><span class="page-break-tag">✂️ ——— شروع صفحه جدید در چاپ (Page Break) ———</span></div><p><br /></p>`
              );
            }}
            className={`px-2 py-0.5 rounded border transition-colors flex items-center gap-1 font-bold ${
              isDark
                ? 'bg-orange-950/40 border-orange-700/60 text-orange-400 hover:bg-orange-900/50 hover:text-white'
                : 'bg-orange-50 border-orange-300 text-orange-700 hover:bg-orange-100'
            }`}
            title="انتقال مطالب پس از این نقطه به صفحه بعد در خروجی PDF"
          >
            <Scissors className="w-3 h-3" />
            + شکستگی صفحه (Page Break)
          </button>
        </div>
      )}

      {/* ContentEditable Editing Area */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onKeyUp={updateActiveFormats}
        onMouseUp={updateActiveFormats}
        style={{ minHeight }}
        data-placeholder={placeholder}
        className={`p-4 outline-none leading-relaxed text-xs sm:text-sm font-['Vazirmatn',sans-serif] text-right dir-rtl rich-editor-content ${
          isDark ? 'text-slate-100 bg-[#141416]' : 'text-slate-900 bg-white'
        }`}
      />
    </div>
  );
};
