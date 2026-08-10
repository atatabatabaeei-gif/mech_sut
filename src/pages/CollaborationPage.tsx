import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Send,
  Upload,
  FileText,
  X,
  CheckCircle2,
  Building2,
  Cpu,
  GraduationCap,
  FlaskConical,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { addRequest, getCollaborationConfig } from '../services/storage';
import { CollaborationRequest } from '../types';
import { Toast } from '../components/Toast';

export const CollaborationPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const config = getCollaborationConfig();

  const partnersScrollRef = useRef<HTMLDivElement>(null);

  const scrollPartners = (direction: 'left' | 'right') => {
    if (!partnersScrollRef.current) return;
    const scrollAmount = 280;
    partnersScrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  const preLab = searchParams.get('targetLab') || '';
  const preFaculty = searchParams.get('targetFaculty') || '';
  const preField = searchParams.get('field') || '';

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [collabType, setCollabType] = useState<CollaborationRequest['collabType']>('پژوهش مشترک');
  const [specializedField, setSpecializedField] = useState(preField || 'مکانیک سیالات و دینامیک محاسباتی');
  const [targetEntityName, setTargetEntityName] = useState(preLab || preFaculty || '');
  const [description, setDescription] = useState('');

  // File Upload State
  const [attachedFile, setAttachedFile] = useState<{
    name: string;
    type: string;
    sizeStr: string;
    content: string;
  } | null>(null);
  const [fileError, setFileError] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  // Success Modal & Toast
  const [submittedReq, setSubmittedReq] = useState<CollaborationRequest | null>(null);
  const [toastMessage, setToastMessage] = useState('');

  // Auto pre-fill if params provided
  useEffect(() => {
    if (preLab) {
      setCollabType('استفاده از تجهیزات');
      setTargetEntityName(`آزمایشگاه: ${preLab}`);
    } else if (preFaculty) {
      setCollabType('مشاوره تخصصی');
      setTargetEntityName(`استاد: ${preFaculty}`);
    }
  }, [preLab, preFaculty]);

  // Handle File Selection
  const handleFileChange = (file: File) => {
    setFileError('');
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const maxBytes = 25 * 1024 * 1024; // 25MB

    if (!validTypes.includes(file.type) && !file.name.endsWith('.pdf') && !file.name.endsWith('.docx') && !file.name.endsWith('.doc')) {
      setFileError('فرمت فایل نامعتبر است. فقط فایل‌های PDF یا Word (DOCX/DOC) مجاز هستند.');
      return;
    }

    if (file.size > maxBytes) {
      setFileError('حجم فایل فراتر از حد مجاز (۲۵ مگابایت) است.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      setAttachedFile({
        name: file.name,
        type: file.type || 'document',
        sizeStr: `${sizeMB} مگابایت`,
        content: reader.result as string
      });
      setToastMessage('✅ فایل پروپوزال با موفقیت ضمیمه گردید.');
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName || !email || !description) {
      setToastMessage('لطفاً تمامی فیلدهای الزامی (*) را تکمیل فرمایید.');
      return;
    }

    const newReq = addRequest({
      fullName,
      company: company || 'شخصی / مستقل',
      email,
      phone: phone || 'ثبت‌نشده',
      collabType,
      specializedField,
      description,
      targetEntityName: targetEntityName || undefined,
      attachedFileName: attachedFile?.name,
      attachedFileType: attachedFile?.type,
      attachedFileSize: attachedFile?.sizeStr,
      attachedFileContent: attachedFile?.content
    });

    setSubmittedReq(newReq);
    setToastMessage('✅ درخواست شما با موفقیت ثبت گردید.');
  };

  const resetForm = () => {
    setFullName('');
    setCompany('');
    setEmail('');
    setPhone('');
    setDescription('');
    setTargetEntityName('');
    setAttachedFile(null);
    setSubmittedReq(null);
  };

  return (
    <div className="pt-24 min-h-screen pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      
      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage('')} />
      )}

      {/* Page Header */}
      <div className="bg-white border-r-8 border-orange-500 p-8 shadow-sm space-y-3">
        <span className="text-orange-600 font-bold text-xs tracking-widest uppercase block">
          {config.headerCategory}
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900">
          {config.headerTitle}
        </h1>
        <p className="text-slate-600 text-sm max-w-3xl leading-relaxed">
          {config.headerDescription}
        </p>
      </div>

      {/* ═══════════ 1. BENEFITS OF COLLABORATION ═══════════ */}
      {config.benefits && config.benefits.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-2xl font-black text-slate-900 border-r-4 border-orange-500 pr-3">
            {config.benefitsTitle}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {config.benefits.map((benefit, idx) => (
              <div key={idx} className="bg-white border border-slate-200 p-6 shadow-sm space-y-3">
                <div className="w-10 h-10 bg-black text-orange-400 font-black flex items-center justify-center text-sm border border-orange-500/30">
                  {benefit.num || `۰${idx + 1}`}
                </div>
                <h3 className="text-lg font-black text-slate-900">{benefit.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ═══════════ 2. COLLABORATION MODELS ═══════════ */}
      {config.models && config.models.length > 0 && (
        <section className="bg-white p-8 sm:p-10 border border-slate-200 shadow-sm space-y-8">
          <div className="text-right space-y-2">
            <span className="text-orange-600 font-bold text-xs tracking-widest uppercase block">
              الگوهای تعامل
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              {config.modelsTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {config.models.map((model, idx) => (
              <div key={idx} className="bg-slate-50 border border-slate-200 p-6 space-y-4 hover:border-orange-500 transition-all">
                <div className="w-12 h-12 bg-orange-500 text-black flex items-center justify-center font-bold">
                  {idx === 0 ? <FlaskConical className="w-6 h-6" /> : idx === 1 ? <Cpu className="w-6 h-6" /> : <GraduationCap className="w-6 h-6" />}
                </div>
                <h3 className="text-xl font-black text-slate-900">{model.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {model.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ═══════════ 3. PARTNERS & LOGOS ═══════════ */}
      {config.partners && config.partners.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-slate-900 border-r-4 border-orange-500 pr-3">
              {config.partnersTitle}
            </h2>

            {/* Navigation buttons for horizontal scrolling */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollPartners('right')}
                className="p-2 bg-white border border-slate-300 hover:border-orange-500 hover:bg-orange-50 text-slate-700 hover:text-orange-600 rounded-xl shadow-sm transition-all"
                title="قبلی"
                aria-label="Previous partners"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => scrollPartners('left')}
                className="p-2 bg-white border border-slate-300 hover:border-orange-500 hover:bg-orange-50 text-slate-700 hover:text-orange-600 rounded-xl shadow-sm transition-all"
                title="بعدی"
                aria-label="Next partners"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div
            ref={partnersScrollRef}
            className="flex items-center gap-4 overflow-x-auto pb-4 pt-1 px-1 scrollbar-thin scrollbar-thumb-orange-500/30 scrollbar-track-transparent snap-x snap-mandatory"
          >
            {config.partners.map((partner, idx) => (
              <div
                key={idx}
                className="min-w-[170px] sm:min-w-[190px] md:min-w-[210px] flex-shrink-0 snap-start bg-white border border-slate-200 hover:border-orange-500 p-5 rounded-2xl text-center flex flex-col items-center justify-center gap-3 shadow-sm hover:shadow-md transition-all h-36 group"
              >
                {partner.logoUrl ? (
                  <div className="h-14 w-full flex items-center justify-center px-2">
                    <img
                      src={partner.logoUrl}
                      alt={partner.name}
                      className="max-h-12 max-w-full object-contain filter group-hover:scale-105 transition-transform"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                ) : (
                  <span className="text-3xl block group-hover:scale-110 transition-transform">
                    {partner.icon || '🤝'}
                  </span>
                )}
                <span className="text-xs sm:text-sm text-slate-900 font-bold block line-clamp-1">{partner.name}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ═══════════ 4. SMART STRUCTURED FORM WITH FILE UPLOAD ═══════════ */}
      <section id="form-section" className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Column: Form Container */}
        <div className="lg:col-span-8 bg-white border border-slate-200 p-8 sm:p-10 shadow-sm space-y-8">
          
          <div className="space-y-2 border-b border-slate-200 pb-6">
            <span className="text-orange-600 font-bold text-xs tracking-widest uppercase block">
              فرم استاندارد هوشمند
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              ثبت آنلاین درخواست همکاری صنعتی
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              اطلاعات پروژه یا خدمات مورد نیاز خود را دقیق وارد فرمایید تا پس از ثبت امن در پایگاه داده، جهت بررسی اولیه به مدیران مرتبط ارجاع داده شود.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Target pre-selection banner if applicable */}
            {targetEntityName && (
              <div className="bg-slate-100 border-r-4 border-orange-500 p-4 flex items-center justify-between text-xs text-slate-900">
                <span className="font-bold">درخواست ارسال مستقیم به: {targetEntityName}</span>
                <button
                  type="button"
                  onClick={() => setTargetEntityName('')}
                  className="text-slate-500 hover:text-slate-900"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Step 1: Contact Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <span className="w-5 h-5 bg-black text-white text-xs flex items-center justify-center font-bold">۱</span>
                مشخصات درخواست‌دهنده
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-700 font-bold block">نام و نام خانوادگی *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="مثال: مهندس احمد رضایی"
                    className="w-full bg-white border border-slate-300 px-4 py-3 text-slate-900 text-sm focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-700 font-bold block">نام شرکت / سازمان</label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="مثال: شرکت توربو ژنراتور پارس"
                    className="w-full bg-white border border-slate-300 px-4 py-3 text-slate-900 text-sm focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-700 font-bold block">ایمیل سازمانی / کاری *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full bg-white border border-slate-300 px-4 py-3 text-slate-900 text-sm focus:outline-none focus:border-orange-500 transition-colors text-left dir-ltr"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-700 font-bold block">شماره همراه جهت تماس</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="۰۹۱۲..."
                    className="w-full bg-white border border-slate-300 px-4 py-3 text-slate-900 text-sm focus:outline-none focus:border-orange-500 transition-colors text-left dir-ltr"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Collaboration Parameters */}
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <span className="w-5 h-5 bg-black text-white text-xs flex items-center justify-center font-bold">۲</span>
                الگو و حوزه تخصصی همکاری
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-700 font-bold block">نوع تعامل مورد نظر *</label>
                  <select
                    value={collabType}
                    onChange={(e) => setCollabType(e.target.value as any)}
                    className="w-full bg-white border border-slate-300 px-4 py-3 text-slate-900 text-sm focus:outline-none focus:border-orange-500 transition-colors"
                  >
                    <option value="پژوهش مشترک">پژوهش مشترک R&D</option>
                    <option value="تحقیق قراردادی">تحقیق قراردادی و بومی‌سازی</option>
                    <option value="انتقال فناوری">انتقال فناوری و دانش فنی</option>
                    <option value="استفاده از تجهیزات">بهره‌برداری از تجهیزات آزمایشگاهی</option>
                    <option value="کارآموزی و جذب استعداد">کارآموزی و جذب نیروی زبده</option>
                    <option value="مشاوره تخصصی">مشاوره تخصصی استادان</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-700 font-bold block">حوزه مهندسی مرتبط *</label>
                  <select
                    value={specializedField}
                    onChange={(e) => setSpecializedField(e.target.value)}
                    className="w-full bg-white border border-slate-300 px-4 py-3 text-slate-900 text-sm focus:outline-none focus:border-orange-500 transition-colors"
                  >
                    <option value="مکانیک سیالات و دینامیک محاسباتی">مکانیک سیالات و CFD</option>
                    <option value="رباتیک و اتوماسیون">رباتیک و اتوماسیون صنعتی</option>
                    <option value="مواد و ساخت">مواد پیشرفته و متالورژی ساخت</option>
                    <option value="ترمودینامیک و انتقال حرارت">ترمودینامیک، انتقال حرارت و نانوسیالات</option>
                    <option value="تحلیل سازه و المان محدود">تست‌های غیرمخرب (NDT) و تحلیل سازه</option>
                    <option value="احتراق و انرژی">احتراق، توربین و سوخت‌های پاک</option>
                    <option value="دینامیک خودرو">دینامیک خودرو و شاسی</option>
                    <option value="سایر">سایر حوزه‌های مهندسی مکانیک</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Step 3: Project Description & Proposal Upload */}
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <span className="w-5 h-5 bg-black text-white text-xs flex items-center justify-center font-bold">۳</span>
                شرح نیازمندی و آپلود فایل پروپوزال (Word / PDF)
              </h3>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-700 font-bold block">توضیح کامل مسئله یا صورت پروژه *</label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="چالش فنی، ابعاد پروژه، قطعه مورد نظر یا هدف صورت مسئله همکاری خود را به اختصار شرح دهید..."
                  className="w-full bg-white border border-slate-300 p-4 text-slate-900 text-sm focus:outline-none focus:border-orange-500 transition-colors leading-relaxed"
                />
              </div>

              {/* Drag-and-Drop File Upload Area */}
              <div className="space-y-2">
                <label className="text-xs text-slate-700 font-bold block">
                  آپلود فایل پروپوزال یا فرم سازمانی (فرمت Word یا PDF - حداکثر ۲۵MB)
                </label>

                {attachedFile ? (
                  <div className="bg-slate-50 border-2 border-black p-4 flex items-center justify-between text-xs text-slate-900">
                    <div className="flex items-center gap-3">
                      <FileText className="w-6 h-6 text-orange-500" />
                      <div>
                        <span className="font-bold block">{attachedFile.name}</span>
                        <span className="text-slate-500">حجم فایل: {attachedFile.sizeStr}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAttachedFile(null)}
                      className="p-1.5 text-slate-500 hover:text-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed p-6 text-center transition-all cursor-pointer ${
                      isDragging
                        ? 'border-orange-500 bg-orange-500/10'
                        : 'border-slate-300 bg-slate-50 hover:border-black'
                    }`}
                  >
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
                      className="hidden"
                      id="file-upload-input"
                    />
                    <label htmlFor="file-upload-input" className="cursor-pointer space-y-2 block">
                      <Upload className="w-8 h-8 text-orange-500 mx-auto" />
                      <span className="text-xs text-slate-900 font-bold block">
                        کشیدن یا کلیک جهت آپلود فایل RFP / پروپوزال
                      </span>
                      <span className="text-[11px] text-slate-500 block">
                        پشتیبانی از فایل‌های Word (.docx/.doc) و PDF
                      </span>
                    </label>
                  </div>
                )}

                {fileError && (
                  <p className="text-xs text-red-600 flex items-center gap-1.5 mt-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{fileError}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-black py-4 font-black text-sm transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <Send className="w-5 h-5" />
                <span>ثبت نهایی و ارسال درخواست به مدیریت پژوهش</span>
              </button>
            </div>

          </form>

        </div>

        {/* Right Column: Process & Contact info */}
        <div className="lg:col-span-4 space-y-8">
          
          <div className="bg-white border border-slate-200 p-8 shadow-sm space-y-6">
            <h3 className="font-black text-xl text-slate-900 border-r-4 border-orange-500 pr-2">
              مراحل بررسی درخواست شما
            </h3>

            <div className="space-y-6 relative">
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-orange-500 text-black font-black flex items-center justify-center shrink-0">
                  ۱
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">ثبت در دیتابیس امن</h4>
                  <p className="text-xs text-slate-600 mt-1">درخواست شما رمزنگاری شده و اعلان آن آنی به دفتر مدیریت ارسال می‌شود.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 bg-white border-2 border-black text-slate-900 font-black flex items-center justify-center shrink-0">
                  ۲
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">ارزیابی استاد یا آزمایشگاه</h4>
                  <p className="text-xs text-slate-600 mt-1">ظرف حداکثر ۲ روز کاری، هیئت پژوهشی دانشکده بهترین گزینه را پیشنهاد می‌دهد.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 bg-slate-100 border border-slate-300 text-slate-600 font-black flex items-center justify-center shrink-0">
                  ۳
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">جلسه هم‌اندیشی اولیه</h4>
                  <p className="text-xs text-slate-600 mt-1">برگزاری جلسه آنلاین یا حضوری جهت تنظیم پروپوزال اجرایی و زمان‌بندی.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-black border-t-4 border-orange-500 p-8 text-white shadow-md space-y-4">
            <h3 className="font-black text-lg text-white">تماس مستقیم با مدیریت صنعت</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              در صورت تمایل به ارتباط تلفنی یا ارسال پروپوزال از طریق فکس یا ایمیل مستقیم:
            </p>
            <div className="space-y-2 text-xs text-orange-400 font-mono bg-slate-900 p-4 border border-slate-800">
              <p>ایمیل: {config.directContactEmail}</p>
              <p>تلفن: {config.directContactPhone}</p>
              <p>نمابر: {config.directContactFax}</p>
            </div>
          </div>

        </div>

      </section>

      {/* SUCCESS MODAL */}
      {submittedReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-white border-4 border-black p-8 max-w-xl w-full text-right space-y-6 shadow-2xl">
            <div className="flex items-center gap-3 text-orange-600">
              <CheckCircle2 className="w-8 h-8 shrink-0" />
              <div>
                <h3 className="text-xl font-black text-slate-900">درخواست همکاری شما با موفقیت به ثبت رسید</h3>
                <span className="text-xs text-slate-500 font-mono">کد پیگیری: {submittedReq.id}</span>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-5 space-y-2 text-xs text-slate-700">
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span>نام درخواست‌دهنده:</span>
                <span className="text-slate-900 font-bold">{submittedReq.fullName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span>شرکت / سازمان:</span>
                <span className="text-slate-900 font-bold">{submittedReq.company}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span>نوع تعامل:</span>
                <span className="text-orange-600 font-bold">{submittedReq.collabType}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span>حوزه تخصصی:</span>
                <span className="text-slate-900 font-bold">{submittedReq.specializedField}</span>
              </div>
              {submittedReq.attachedFileName && (
                <div className="flex justify-between py-1">
                  <span>فایل ضمیمه‌شده:</span>
                  <span className="text-orange-600 font-bold">{submittedReq.attachedFileName}</span>
                </div>
              )}
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              اطلاعات فوق در دیتابیس مرکز تحقیقات مکانیک شریف ثبت گردید. همزمان یک نسخه اطلاع‌رسانی برای کارشناسان ارشد ارسال شد. طی ۲ روز کاری با شما تماس خواهیم گرفت.
            </p>

            <button
              onClick={resetForm}
              className="w-full bg-black text-white py-3 font-black text-sm hover:bg-slate-800 transition-all"
            >
              بستن و بازگشت
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
