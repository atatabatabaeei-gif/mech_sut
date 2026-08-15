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
  Scissors
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
  theme?: 'dark' | 'light';
  id?: string;
  showQuickTemplates?: boolean;
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

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'متن بیوگرافی و سوابق را وارد کنید...',
  minHeight = '140px',
  theme = 'dark',
  id = 'rich-text-editor',
  showQuickTemplates = true,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
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

  const executeCommand = (command: string, val: string | undefined = undefined) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    document.execCommand(command, false, val);
    updateActiveFormats();
    handleInput();
  };

  const handleInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      onChange(html);
    }
  };

  const setBlockType = (tag: string) => {
    executeCommand('formatBlock', tag);
  };

  const handleHighlight = () => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
      executeCommand('hiliteColor', '#fed7aa'); // light orange
      return;
    }
    document.execCommand('hiliteColor', false, isDark ? '#c2410c' : '#fed7aa');
    handleInput();
  };

  const insertTemplate = (title: string, templateHtml: string) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    document.execCommand('insertHTML', false, templateHtml);
    handleInput();
  };

  return (
    <div
      id={id}
      className={`rounded-xl border transition-all overflow-hidden ${
        isDark
          ? 'bg-[#141416] border-[#28282D] focus-within:border-[#E8530D]'
          : 'bg-white border-slate-300 focus-within:border-orange-500 shadow-sm'
      }`}
    >
      {/* Top Toolbar */}
      <div
        className={`p-2 border-b flex flex-wrap items-center gap-1 text-xs select-none no-print ${
          isDark ? 'bg-[#1B1B1E] border-[#28282D] text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
        }`}
      >
        {/* Style Selector / Headings */}
        <div className="flex items-center gap-1 border-l border-slate-300 dark:border-[#38383D] pl-1.5 ml-1">
          <button
            type="button"
            onClick={() => setBlockType('p')}
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
            onClick={() => setBlockType('h3')}
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
            onClick={() => setBlockType('h4')}
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
            onClick={() => executeCommand('bold')}
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
            onClick={() => executeCommand('italic')}
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
            onClick={() => executeCommand('underline')}
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
            onClick={() => executeCommand('strikeThrough')}
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

          <button
            type="button"
            onClick={handleHighlight}
            className={`p-1.5 rounded transition-colors ${
              isDark ? 'hover:bg-[#28282D] text-amber-400' : 'hover:bg-slate-200 text-amber-600'
            }`}
            title="برجسته‌سازی رنگی / Highlight"
          >
            <Highlighter className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Lists & Quotes */}
        <div className="flex items-center gap-0.5 border-l border-slate-300 dark:border-[#38383D] pl-1.5 ml-1">
          <button
            type="button"
            onClick={() => executeCommand('insertUnorderedList')}
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
            onClick={() => executeCommand('insertOrderedList')}
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
            onClick={() => setBlockType('blockquote')}
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
            onClick={() => executeCommand('justifyRight')}
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
            onClick={() => executeCommand('justifyCenter')}
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
            onClick={() => executeCommand('justifyFull')}
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
            onClick={() => executeCommand('removeFormat')}
            className={`p-1.5 rounded transition-colors ${
              isDark ? 'hover:bg-[#28282D] text-rose-400' : 'hover:bg-slate-200 text-rose-600'
            }`}
            title="پاک کردن فرمت متون انتخاب‌شده"
          >
            <Eraser className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => executeCommand('undo')}
            className={`p-1.5 rounded transition-colors ${
              isDark ? 'hover:bg-[#28282D] text-slate-200' : 'hover:bg-slate-200 text-slate-700'
            }`}
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => executeCommand('redo')}
            className={`p-1.5 rounded transition-colors ${
              isDark ? 'hover:bg-[#28282D] text-slate-200' : 'hover:bg-slate-200 text-slate-700'
            }`}
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Quick Bio Section Templates */}
      {showQuickTemplates && (
        <div
          className={`px-3 py-1.5 text-[11px] flex flex-wrap items-center gap-2 border-b select-none no-print ${
            isDark ? 'bg-[#18181B] border-[#28282D] text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
          }`}
        >
          <span className="font-bold flex items-center gap-1 text-orange-500">
            <Plus className="w-3 h-3" />
            افزودن بخش‌های آماده به بیوگرافی:
          </span>
          <button
            type="button"
            onClick={() =>
              insertTemplate(
                'تحصیلات',
                `<h3>سوابق تحصیلی و دانشگاهی:</h3><ul><li><strong>دکتری:</strong> مهندسی مکانیک، دانشگاه صنعتی شریف (سال فارغ‌التحصیلی)</li><li><strong>کارشناسی ارشد:</strong> مهندسی مکانیک، گرایش تبدیل انرژی (سال فارغ‌التحصیلی)</li></ul>`
              )
            }
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
            onClick={() =>
              insertTemplate(
                'زمینه‌های پژوهشی',
                `<h3>زمینه‌های پژوهشی و تخصصی:</h3><ul><li>طراحی و شبیه‌سازی سیستم‌های حرارتی و برودتی</li><li>دینامیک سیالات محاسباتی و توربولانس</li><li>بهینه‌سازی مصرف انرژی در صنایع نفت و پتروشیمی</li></ul>`
              )
            }
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
            onClick={() =>
              insertTemplate(
                'افتخارات',
                `<h3>افتخارات و جوایز علمی:</h3><ol><li>استاد نمونه آموزشی و پژوهشی دانشکده مهندسی مکانیک</li><li>پژوهشگر برتر ارتباط با صنعت در سطح دانشگاه صنعتی شریف</li></ol>`
              )
            }
            className={`px-2 py-0.5 rounded border transition-colors ${
              isDark
                ? 'bg-[#222226] border-[#333338] hover:border-orange-500 hover:text-white'
                : 'bg-white border-slate-300 hover:border-orange-500 text-slate-800'
            }`}
          >
            + جوایز و افتخارات (شماره‌دار)
          </button>

          <button
            type="button"
            onClick={() =>
              insertTemplate(
                'شکستگی صفحه',
                `<div data-page-break="true" class="html-page-break"><span class="page-break-tag">✂️ ——— شروع صفحه جدید در چاپ (Page Break) ———</span></div><p><br /></p>`
              )
            }
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
