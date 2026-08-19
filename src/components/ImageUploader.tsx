import React, { useState, useRef } from 'react';
import {
  Upload,
  Image as ImageIcon,
  Link,
  Trash2,
  CheckCircle2,
  Plus,
  RefreshCw,
  Eye
} from 'lucide-react';

interface ImageUploaderProps {
  value: string;
  onChange: (val: string) => void;
  label?: string;
  placeholder?: string;
  theme?: 'dark' | 'light';
  aspectRatio?: 'square' | 'video' | 'wide' | 'any';
  helpText?: string;
  id?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  value,
  onChange,
  label = 'تصویر',
  placeholder = 'انتخاب تصویر از سیستم یا درج لینک...',
  theme = 'dark',
  aspectRatio = 'square',
  helpText,
  id = 'image-uploader',
}) => {
  const [activeMode, setActiveMode] = useState<'upload' | 'url'>('upload');
  const [isDragging, setIsDragging] = useState(false);
  const [urlInput, setUrlInput] = useState(value && !value.startsWith('data:') ? value : '');
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isDark = theme === 'dark';

  const handleFile = (file: File) => {
    if (!file || !file.type.startsWith('image/')) return;
    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        onChange(result);
      }
      setIsProcessing(false);
    };
    reader.onerror = () => {
      setIsProcessing(false);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setUrlInput('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div id={id} className="space-y-1.5 text-xs">
      <div className="flex items-center justify-between">
        <label className={`font-bold flex items-center gap-1.5 ${isDark ? 'text-[#A0A0A0]' : 'text-slate-700'}`}>
          <ImageIcon className="w-3.5 h-3.5 text-[#E8530D]" />
          <span>{label}</span>
        </label>
        
        {/* Toggle between Local Upload & URL */}
        <div className="flex items-center gap-1 bg-black/20 p-0.5 rounded-lg border border-slate-700/30">
          <button
            type="button"
            onClick={() => setActiveMode('upload')}
            className={`px-2 py-0.5 rounded text-[11px] font-bold flex items-center gap-1 transition-all ${
              activeMode === 'upload'
                ? 'bg-[#E8530D] text-white shadow'
                : isDark
                ? 'text-[#A0A0A0] hover:text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Upload className="w-3 h-3" />
            <span>آپلود از رایانه</span>
          </button>
          
          <button
            type="button"
            onClick={() => setActiveMode('url')}
            className={`px-2 py-0.5 rounded text-[11px] font-bold flex items-center gap-1 transition-all ${
              activeMode === 'url'
                ? 'bg-[#E8530D] text-white shadow'
                : isDark
                ? 'text-[#A0A0A0] hover:text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Link className="w-3 h-3" />
            <span>لینک مستقیم (URL)</span>
          </button>
        </div>
      </div>

      {/* Upload Box or URL Input */}
      {activeMode === 'upload' ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all relative overflow-hidden group ${
            isDragging
              ? 'border-[#E8530D] bg-[#E8530D]/10'
              : value
              ? isDark
                ? 'border-emerald-500/40 bg-[#1B1B1E] hover:border-[#E8530D]'
                : 'border-emerald-500/50 bg-slate-50 hover:border-orange-500'
              : isDark
              ? 'border-[#28282D] bg-[#1B1B1E] hover:border-[#E8530D]/60 hover:bg-[#222226]'
              : 'border-slate-300 bg-slate-50 hover:border-orange-400 hover:bg-orange-50/30'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            className="hidden"
          />

          {value ? (
            <div className="flex items-center gap-4 text-right">
              <div
                className={`relative overflow-hidden rounded-xl border border-slate-700 bg-black/40 shrink-0 ${
                  aspectRatio === 'wide' ? 'w-24 h-16' : 'w-16 h-16'
                }`}
              >
                <img
                  src={value}
                  alt="پیش‌نمایش تصویر"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>تصویر با موفقیت بارگذاری شد</span>
                </div>
                <p className={`text-[11px] truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {value.startsWith('data:') ? 'تصویر ذخیره‌شده از کامپیوتر' : value}
                </p>
                <p className="text-[10px] text-orange-400 font-medium">
                  جهت جایگزینی کلیک کنید یا فایل جدید را بکشید و رها کنید
                </p>
              </div>

              <button
                type="button"
                onClick={handleRemove}
                className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white transition-all border border-rose-500/30 shrink-0"
                title="حذف تصویر"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="py-3 space-y-2">
              <div className="w-10 h-10 mx-auto rounded-full bg-[#E8530D]/10 border border-[#E8530D]/30 flex items-center justify-center text-[#E8530D] group-hover:scale-110 transition-transform">
                {isProcessing ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <Upload className="w-5 h-5" />
                )}
              </div>
              <div>
                <p className={`font-bold text-xs ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  برای انتخاب عکس از رایانه کلیک کنید
                </p>
                <p className={`text-[11px] ${isDark ? 'text-[#A0A0A0]' : 'text-slate-500'}`}>
                  یا فایل تصویر (JPG, PNG, WebP) را به اینجا بکشید و رها کنید
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleUrlSubmit())}
              placeholder="https://images.unsplash.com/..."
              className={`flex-1 rounded-xl px-3 py-2.5 text-xs text-left dir-ltr border transition-all ${
                isDark
                  ? 'bg-[#1B1B1E] border-[#28282D] text-white focus:border-[#E8530D]'
                  : 'bg-white border-slate-300 text-slate-900 focus:border-orange-500'
              }`}
            />
            <button
              type="button"
              onClick={handleUrlSubmit}
              className="bg-[#E8530D] hover:bg-[#F8631D] text-white px-3 py-2.5 rounded-xl font-bold transition-all shrink-0"
            >
              ثبت لینک
            </button>
          </div>

          {value && (
            <div className="flex items-center gap-3 p-2 rounded-xl bg-black/20 border border-slate-700/40">
              <img
                src={value}
                alt="پیش‌نمایش"
                className="w-10 h-10 rounded-lg object-cover border border-slate-600 shrink-0"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=200';
                }}
              />
              <div className="flex-1 min-w-0">
                <span className="text-[11px] text-emerald-400 font-bold block">لینک فعال تصویر</span>
                <p className="text-[10px] text-slate-400 truncate dir-ltr text-left">{value}</p>
              </div>
              <button
                type="button"
                onClick={handleRemove}
                className="p-1.5 text-rose-400 hover:text-white hover:bg-rose-500 rounded-lg transition-colors"
                title="حذف"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}

      {helpText && (
        <p className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          {helpText}
        </p>
      )}
    </div>
  );
};

// Multi-image gallery uploader for Laboratories
interface GalleryUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  label?: string;
  theme?: 'dark' | 'light';
  id?: string;
}

export const GalleryUploader: React.FC<GalleryUploaderProps> = ({
  images,
  onChange,
  label = 'گالری تصاویر آزمایشگاه',
  theme = 'dark',
  id = 'gallery-uploader',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [urlInput, setUrlInput] = useState('');
  const [showUrlModal, setShowUrlModal] = useState(false);
  const isDark = theme === 'dark';

  const handleFiles = (files: FileList) => {
    const fileArray = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (fileArray.length === 0) return;

    let loadedCount = 0;
    const newBase64s: string[] = [];

    fileArray.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const res = e.target?.result as string;
        if (res) {
          newBase64s.push(res);
        }
        loadedCount++;
        if (loadedCount === fileArray.length) {
          onChange([...images, ...newBase64s]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddUrl = () => {
    if (urlInput.trim()) {
      onChange([...images, urlInput.trim()]);
      setUrlInput('');
      setShowUrlModal(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div id={id} className="space-y-2 text-xs">
      <div className="flex items-center justify-between">
        <label className={`font-bold flex items-center gap-1.5 ${isDark ? 'text-[#A0A0A0]' : 'text-slate-700'}`}>
          <ImageIcon className="w-3.5 h-3.5 text-[#E8530D]" />
          <span>{label} ({images.length} تصویر)</span>
        </label>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="bg-[#E8530D] hover:bg-[#F8631D] text-white px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all"
          >
            <Upload className="w-3 h-3" />
            <span>+ آپلود عکس از سیستم</span>
          </button>

          <button
            type="button"
            onClick={() => setShowUrlModal(!showUrlModal)}
            className={`px-2 py-1 rounded-lg text-[11px] font-bold border transition-all ${
              isDark
                ? 'bg-[#1B1B1E] border-[#28282D] text-[#A0A0A0] hover:text-white'
                : 'bg-slate-100 border-slate-300 text-slate-700 hover:text-slate-900'
            }`}
          >
            <Link className="w-3 h-3" />
            <span>+ افزودن URL</span>
          </button>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
        className="hidden"
      />

      {showUrlModal && (
        <div className="flex gap-2 p-2 rounded-xl bg-black/20 border border-slate-700/40">
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://images.unsplash.com/..."
            className={`flex-1 rounded-lg px-2.5 py-1.5 text-xs text-left dir-ltr border ${
              isDark ? 'bg-[#141416] border-[#28282D] text-white' : 'bg-white border-slate-300'
            }`}
          />
          <button
            type="button"
            onClick={handleAddUrl}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold"
          >
            افزودن
          </button>
        </div>
      )}

      {/* Grid of gallery thumbnails */}
      {images.length > 0 ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 max-h-48 overflow-y-auto p-2 bg-black/10 rounded-xl border border-slate-800/40">
          {images.map((img, idx) => (
            <div
              key={idx}
              className="relative group rounded-xl overflow-hidden border border-slate-700 aspect-video bg-black/30"
            >
              <img
                src={img}
                alt={`تصویر ${idx + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="p-1 bg-rose-600 text-white rounded-lg hover:bg-rose-500 transition-colors"
                  title="حذف تصویر"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className={`border border-dashed rounded-xl p-3 text-center cursor-pointer transition-colors ${
            isDark
              ? 'border-[#28282D] bg-[#141416] hover:border-[#E8530D]/50 text-slate-500'
              : 'border-slate-300 bg-slate-50 hover:border-orange-400 text-slate-600'
          }`}
        >
          <p className="text-[11px]">هنوز تصویری به گالری اضافه نشده است. برای انتخاب چندین عکس کلیک فرمایید.</p>
        </div>
      )}
    </div>
  );
};
