import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import {
  Printer,
  X,
  Lock,
  FileText,
  Building2,
  User,
  Award,
  BookOpen,
  Mail,
  LogIn,
  FlaskConical,
  Wrench,
  Edit3,
  Eye,
  EyeOff,
  RotateCcw,
  Plus,
  Trash2,
  Calendar,
  Layers,
  CheckCircle2,
  Upload,
  Camera,
  Image as ImageIcon,
  Palette,
  Paintbrush,
  Check,
  Pipette,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { FacultyMember, IndustrialProject, Lab } from '../types';
import { getAdminState } from '../services/storage';
import { RichTextEditor, normalizeToHtml } from './RichTextEditor';

export interface ColorTheme {
  id: string;
  name: string;
  desc: string;
  bgColor: string;
  textColor: string;
  headingColor: string;
  accentColor: string;
  cardBgColor: string;
  borderColor: string;
}

export const COLOR_THEMES: ColorTheme[] = [
  {
    id: 'classic-white',
    name: 'سفید رسمی',
    desc: 'کلاسیک دانشگاهی',
    bgColor: '#ffffff',
    textColor: '#1e293b',
    headingColor: '#0f172a',
    accentColor: '#ea580c',
    cardBgColor: '#f8fafc',
    borderColor: '#0f172a',
  },
  {
    id: 'parchment-ivory',
    name: 'کرم دانشگاهی',
    desc: 'کاغذ نفیس دانشگاهی',
    bgColor: '#fdfbf7',
    textColor: '#292524',
    headingColor: '#1c1917',
    accentColor: '#c2410c',
    cardBgColor: '#f5efe6',
    borderColor: '#44403c',
  },
  {
    id: 'navy-corporate',
    name: 'آبی مهندسی',
    desc: 'سازمانی و صنعتی',
    bgColor: '#f8fafc',
    textColor: '#0f172a',
    headingColor: '#1e3a8a',
    accentColor: '#2563eb',
    cardBgColor: '#eff6ff',
    borderColor: '#1e3a8a',
  },
  {
    id: 'emerald-lab',
    name: 'سبز زمردی',
    desc: 'پژوهشی و سلامت',
    bgColor: '#f7fdf9',
    textColor: '#064e3b',
    headingColor: '#064e3b',
    accentColor: '#059669',
    cardBgColor: '#ecfdf5',
    borderColor: '#065f46',
  },
  {
    id: 'slate-minimal',
    name: 'خاکستری مدرن',
    desc: 'مینیمال و مونوکروم',
    bgColor: '#f1f5f9',
    textColor: '#0f172a',
    headingColor: '#0f172a',
    accentColor: '#475569',
    cardBgColor: '#ffffff',
    borderColor: '#334155',
  },
  {
    id: 'dark-executive',
    name: 'تیره اختصاصی',
    desc: 'Dark Mode رسمی',
    bgColor: '#0f172a',
    textColor: '#f8fafc',
    headingColor: '#ffffff',
    accentColor: '#fb923c',
    cardBgColor: '#1e293b',
    borderColor: '#475569',
  },
];

interface PDFExportModalProps {
  type: 'faculty' | 'project' | 'lab';
  data: FacultyMember | IndustrialProject | Lab | null;
  onClose: () => void;
}

export const PDFExportModal: React.FC<PDFExportModalProps> = ({ type, data, onClose }) => {
  const navigate = useNavigate();
  if (!data) return null;

  const adminState = getAdminState();
  const isAdmin = adminState.isLoggedIn;

  const defaultDate = new Date().toLocaleDateString('fa-IR');

  // General Metadata State
  const [isEditMode, setIsEditMode] = useState(true);
  const [pageDensity, setPageDensity] = useState<'compact' | 'standard'>('compact');
  const [issueDate, setIssueDate] = useState(defaultDate);
  const [headerDept, setHeaderDept] = useState('دانشگاه صنعتی شریف — دانشکده مهندسی مکانیک');
  const [headerTitle, setHeaderTitle] = useState(
    type === 'faculty'
      ? 'شناسنامه رسمی و رزومه علمی هیئت علمی'
      : type === 'lab'
      ? 'شناسنامه فنی و تجهیزات تخصصی آزمایشگاه'
      : 'شناسنامه فنی و اجرایی پروژه صنعتی'
  );
  const [headerSubtitle, setHeaderSubtitle] = useState('سامانه جامع ارتباط با صنعت و پژوهش‌های تخصصی — شریف');
  const [footerAddress, setFooterAddress] = useState('دانشگاه صنعتی شریف — خیابان آزادی، تهران، ایران');
  const [footerArchive, setFooterArchive] = useState('بایگانی دیجیتال دانشکده مهندسی مکانیک');

  // Color & Theme Customization State
  const [selectedThemeId, setSelectedThemeId] = useState<string>('classic-white');
  const [pdfBgColor, setPdfBgColor] = useState<string>('#ffffff');
  const [pdfTextColor, setPdfTextColor] = useState<string>('#1e293b');
  const [pdfHeadingColor, setPdfHeadingColor] = useState<string>('#0f172a');
  const [pdfAccentColor, setPdfAccentColor] = useState<string>('#ea580c');
  const [pdfCardBgColor, setPdfCardBgColor] = useState<string>('#f8fafc');
  const [pdfBorderColor, setPdfBorderColor] = useState<string>('#0f172a');
  const [showColorPanel, setShowColorPanel] = useState<boolean>(false);

  // Apply a Preset Color Theme
  const handleApplyTheme = (theme: ColorTheme) => {
    setSelectedThemeId(theme.id);
    setPdfBgColor(theme.bgColor);
    setPdfTextColor(theme.textColor);
    setPdfHeadingColor(theme.headingColor);
    setPdfAccentColor(theme.accentColor);
    setPdfCardBgColor(theme.cardBgColor);
    setPdfBorderColor(theme.borderColor);
  };

  // Custom Color Change handler
  const handleCustomColorChange = (key: 'bg' | 'text' | 'heading' | 'accent' | 'card' | 'border', color: string) => {
    setSelectedThemeId('custom');
    if (key === 'bg') setPdfBgColor(color);
    if (key === 'text') setPdfTextColor(color);
    if (key === 'heading') setPdfHeadingColor(color);
    if (key === 'accent') setPdfAccentColor(color);
    if (key === 'card') setPdfCardBgColor(color);
    if (key === 'border') setPdfBorderColor(color);
  };

  // Faculty State
  const initialMember = type === 'faculty' ? (data as FacultyMember) : null;
  const [facName, setFacName] = useState(initialMember?.name || '');
  const [facTitle, setFacTitle] = useState(initialMember?.title || '');
  const [facField, setFacField] = useState(initialMember?.field || '');
  const [facShortDesc, setFacShortDesc] = useState(initialMember?.shortDesc || '');
  const [facBio, setFacBio] = useState(initialMember?.bio || '');
  const [facAvatarUrl, setFacAvatarUrl] = useState(initialMember?.avatarUrl || '');
  const [facSkills, setFacSkills] = useState<string[]>(initialMember?.skills ? [...initialMember.skills] : []);
  const [facPublications, setFacPublications] = useState<string[]>(initialMember?.publications ? [...initialMember.publications] : []);
  const [facGallery, setFacGallery] = useState<string[]>([]);

  // Faculty Section Visibility States
  const [showFacBio, setShowFacBio] = useState(!!initialMember?.bio?.trim());
  const [showFacSkills, setShowFacSkills] = useState((initialMember?.skills?.length || 0) > 0);
  const [showFacPublications, setShowFacPublications] = useState((initialMember?.publications?.length || 0) > 0);
  const [showFacGallery, setShowFacGallery] = useState(false);

  // Lab State
  const initialLab = type === 'lab' ? (data as Lab) : null;
  const [labName, setLabName] = useState(initialLab?.name || '');
  const [labField, setLabField] = useState(initialLab?.field || '');
  const [labSupervisor, setLabSupervisor] = useState(initialLab?.supervisorName || '');
  const [labEmail, setLabEmail] = useState(initialLab?.contactEmail || '');
  const [labShortDesc, setLabShortDesc] = useState(initialLab?.shortDesc || '');
  const [labFullDesc, setLabFullDesc] = useState(initialLab?.fullDesc || '');
  const [labImageUrl, setLabImageUrl] = useState(initialLab?.imageUrl || '');
  const [labEquipment, setLabEquipment] = useState<{ name: string; specs: string }[]>(
    initialLab?.equipment ? initialLab.equipment.map((e) => ({ ...e })) : []
  );
  const [labMembers, setLabMembers] = useState<string[]>(initialLab?.members ? [...initialLab.members] : []);
  const [labAchievements, setLabAchievements] = useState<string[]>(initialLab?.achievements ? [...initialLab.achievements] : []);
  const [labGallery, setLabGallery] = useState<string[]>(
    initialLab?.gallery && initialLab.gallery.length > 0
      ? [...initialLab.gallery]
      : initialLab?.imageUrl
      ? [initialLab.imageUrl]
      : []
  );

  // Lab Section Visibility States
  const [showLabDesc, setShowLabDesc] = useState(!!initialLab?.fullDesc?.trim());
  const [showLabEquipment, setShowLabEquipment] = useState((initialLab?.equipment?.length || 0) > 0);
  const [showLabMembers, setShowLabMembers] = useState((initialLab?.members?.length || 0) > 0);
  const [showLabAchievements, setShowLabAchievements] = useState((initialLab?.achievements?.length || 0) > 0);
  const [showLabGallery, setShowLabGallery] = useState(
    (initialLab?.gallery && initialLab.gallery.length > 0) || !!initialLab?.imageUrl
  );

  // Project State
  const initialProject = type === 'project' ? (data as IndustrialProject) : null;
  const [projTitle, setProjTitle] = useState(initialProject?.title || '');
  const [projCompany, setProjCompany] = useState(initialProject?.clientCompany || '');
  const [projCategory, setProjCategory] = useState(initialProject?.category || '');
  const [projYear, setProjYear] = useState(initialProject?.year || '');
  const [projStatus, setProjStatus] = useState(initialProject?.status || 'تکمیل‌شده');
  const [projShortDesc, setProjShortDesc] = useState(initialProject?.shortDesc || '');
  const [projFullDesc, setProjFullDesc] = useState(initialProject?.fullDesc || '');
  const [projImageUrl, setProjImageUrl] = useState(initialProject?.imageUrl || '');
  const [projLeadFac, setProjLeadFac] = useState(initialProject?.leadFacultyName || 'نامشخص');
  const [projLabName, setProjLabName] = useState(initialProject?.labName || 'نامشخص');
  const [projOutcomes, setProjOutcomes] = useState<string[]>(initialProject?.outcomes ? [...initialProject.outcomes] : []);

  // Project Section Visibility States
  const [showProjDesc, setShowProjDesc] = useState(!!initialProject?.fullDesc?.trim());
  const [showProjExecution, setShowProjExecution] = useState(true);
  const [showProjOutcomes, setShowProjOutcomes] = useState((initialProject?.outcomes?.length || 0) > 0);

  // Reset to original data
  const handleResetToOriginal = () => {
    if (!window.confirm('آیا مایلید تمام تغییرات به اطلاعات اولیه برگردد؟')) return;
    setIssueDate(defaultDate);
    setHeaderDept('دانشگاه صنعتی شریف — دانشکده مهندسی مکانیک');
    setHeaderSubtitle('سامانه جامع ارتباط با صنعت و پژوهش‌های تخصصی — شریف');
    setFooterAddress('دانشگاه صنعتی شریف — خیابان آزادی، تهران، ایران');
    setFooterArchive('بایگانی دیجیتال دانشکده مهندسی مکانیک');

    setSelectedThemeId('classic-white');
    setPdfBgColor('#ffffff');
    setPdfTextColor('#1e293b');
    setPdfHeadingColor('#0f172a');
    setPdfAccentColor('#ea580c');
    setPdfCardBgColor('#f8fafc');
    setPdfBorderColor('#0f172a');

    if (type === 'faculty' && initialMember) {
      setHeaderTitle('شناسنامه رسمی و رزومه علمی هیئت علمی');
      setFacName(initialMember.name || '');
      setFacTitle(initialMember.title || '');
      setFacField(initialMember.field || '');
      setFacShortDesc(initialMember.shortDesc || '');
      setFacBio(initialMember.bio || '');
      setFacAvatarUrl(initialMember.avatarUrl || '');
      setFacSkills(initialMember.skills ? [...initialMember.skills] : []);
      setFacPublications(initialMember.publications ? [...initialMember.publications] : []);
      setFacGallery([]);
      setShowFacBio(!!initialMember.bio?.trim());
      setShowFacSkills((initialMember.skills?.length || 0) > 0);
      setShowFacPublications((initialMember.publications?.length || 0) > 0);
      setShowFacGallery(false);
    } else if (type === 'lab' && initialLab) {
      setHeaderTitle('شناسنامه فنی و تجهیزات تخصصی آزمایشگاه');
      setLabName(initialLab.name || '');
      setLabField(initialLab.field || '');
      setLabSupervisor(initialLab.supervisorName || '');
      setLabEmail(initialLab.contactEmail || '');
      setLabShortDesc(initialLab.shortDesc || '');
      setLabFullDesc(initialLab.fullDesc || '');
      setLabImageUrl(initialLab.imageUrl || '');
      setLabEquipment(initialLab.equipment ? initialLab.equipment.map((e) => ({ ...e })) : []);
      setLabMembers(initialLab.members ? [...initialLab.members] : []);
      setLabAchievements(initialLab.achievements ? [...initialLab.achievements] : []);
      setLabGallery(
        initialLab.gallery && initialLab.gallery.length > 0
          ? [...initialLab.gallery]
          : initialLab.imageUrl
          ? [initialLab.imageUrl]
          : []
      );
      setShowLabDesc(!!initialLab.fullDesc?.trim());
      setShowLabEquipment((initialLab.equipment?.length || 0) > 0);
      setShowLabMembers((initialLab.members?.length || 0) > 0);
      setShowLabAchievements((initialLab.achievements?.length || 0) > 0);
      setShowLabGallery((initialLab.gallery && initialLab.gallery.length > 0) || !!initialLab.imageUrl);
    } else if (type === 'project' && initialProject) {
      setHeaderTitle('شناسنامه فنی و اجرایی پروژه صنعتی');
      setProjTitle(initialProject.title || '');
      setProjCompany(initialProject.clientCompany || '');
      setProjCategory(initialProject.category || '');
      setProjYear(initialProject.year || '');
      setProjStatus(initialProject.status || 'تکمیل‌شده');
      setProjShortDesc(initialProject.shortDesc || '');
      setProjFullDesc(initialProject.fullDesc || '');
      setProjImageUrl(initialProject.imageUrl || '');
      setProjLeadFac(initialProject.leadFacultyName || 'نامشخص');
      setProjLabName(initialProject.labName || 'نامشخص');
      setProjOutcomes(initialProject.outcomes ? [...initialProject.outcomes] : []);
      setShowProjDesc(!!initialProject.fullDesc?.trim());
      setShowProjExecution(true);
      setShowProjOutcomes((initialProject.outcomes?.length || 0) > 0);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // If NOT ADMIN, display Access Denied
  if (!isAdmin) {
    return createPortal(
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 overflow-y-auto no-print">
        <div className="bg-white border-2 border-slate-900 w-full max-w-lg shadow-2xl relative p-6 sm:p-8 space-y-6 text-center">
          <button
            onClick={onClose}
            className="absolute left-4 top-4 text-slate-400 hover:text-slate-900 p-1 transition-colors"
            title="بستن"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="w-16 h-16 bg-orange-100 border-2 border-orange-500 rounded-full flex items-center justify-center mx-auto text-orange-600">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="bg-orange-500 text-black text-[11px] font-black px-2.5 py-1 inline-block uppercase tracking-wider">
              دسترسی غیرمجاز
            </span>
            <h3 className="text-xl font-black text-slate-900">
              دانلود و ویرایش شناسنامه فقط برای مدیران ممکن است
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">
              قابلیت ویرایش آنلاین، استخراج و چاپ فایل PDF شناسنامه‌ها فقط برای کاربران دارای سطح دسترسی مدیریت فعال می‌باشد.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => {
                onClose();
                navigate('/admin');
              }}
              className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-black py-3 px-4 text-xs flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <LogIn className="w-4 h-4 text-orange-500" />
              <span>ورود به پنل مدیریت</span>
            </button>

            <button
              onClick={onClose}
              className="px-5 py-3 border-2 border-slate-300 hover:border-slate-900 text-slate-700 text-xs font-black transition-colors"
            >
              انصراف
            </button>
          </div>
        </div>
      </div>,
      document.body
    );
  }

  return createPortal(
    <div className="pdf-export-modal-overlay fixed inset-0 z-50 flex items-center justify-center bg-slate-900/85 backdrop-blur-sm p-2 sm:p-4 overflow-y-auto">
      <div className="pdf-export-modal-card bg-white border-2 border-slate-900 w-full max-w-4xl max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col my-auto relative">
        
        {/* Modal Toolbar (Sticky top) - Hidden during print */}
        <div className="sticky top-0 bg-[#0F0F12] text-white p-3.5 sm:p-4 flex flex-wrap items-center justify-between gap-3 z-30 no-print border-b-2 border-orange-500 shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-orange-500 text-black rounded font-black">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-xs sm:text-sm text-white flex items-center gap-2">
                <span>پیش‌نمایش و ویرایش شناسنامه PDF</span>
                {isEditMode ? (
                  <span className="text-[10px] bg-orange-500/20 text-orange-400 border border-orange-500/40 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                    <Edit3 className="w-3 h-3" />
                    حالت ویرایش متن فعال
                  </span>
                ) : (
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    حالت نمایش نهایی
                  </span>
                )}
              </h3>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-2">
            {/* Color Customization Toggle */}
            <button
              onClick={() => setShowColorPanel(!showColorPanel)}
              className={`px-3 py-2 text-xs font-bold rounded flex items-center gap-1.5 transition-all border ${
                showColorPanel
                  ? 'bg-purple-500/20 border-purple-400 text-purple-300 hover:bg-purple-500/30'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
              }`}
              title="تغییر رنگ پس‌زمینه و رنگ متن‌ها در خروجی PDF"
            >
              <Palette className="w-3.5 h-3.5 text-purple-400" />
              <span>تنظیم رنگ و تم خروجی</span>
              {showColorPanel ? <ChevronUp className="w-3 h-3 text-purple-400" /> : <ChevronDown className="w-3 h-3 text-purple-400" />}
            </button>

            {/* Toggle Page Density */}
            <button
              onClick={() => setPageDensity(pageDensity === 'compact' ? 'standard' : 'compact')}
              className={`px-3 py-2 text-xs font-bold rounded flex items-center gap-1.5 transition-all border ${
                pageDensity === 'compact'
                  ? 'bg-amber-500/10 border-amber-500 text-amber-400 hover:bg-amber-500/20'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
              }`}
              title="تنظیم تراکم چیدمان متناسب با استاندارد تک‌صفحه‌ای یا چندصفحه‌ای A4"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{pageDensity === 'compact' ? 'چیدمان: بهینه A4 (تک‌صفحه)' : 'چیدمان: باز (چندصفحه)'}</span>
            </button>

            {/* Toggle Edit Mode */}
            <button
              onClick={() => setIsEditMode(!isEditMode)}
              className={`px-3 py-2 text-xs font-bold rounded flex items-center gap-1.5 transition-all border ${
                isEditMode
                  ? 'bg-orange-500/10 border-orange-500 text-orange-400 hover:bg-orange-500/20'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
              }`}
              title={isEditMode ? 'تغییر به حالت مشاهده خروجی' : 'تغییر به حالت ویرایش متن‌ها'}
            >
              {isEditMode ? <Eye className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
              <span>{isEditMode ? 'مشاهده خروجی نهایی' : 'ویرایش متن‌ها'}</span>
            </button>

            {/* Reset */}
            <button
              onClick={handleResetToOriginal}
              className="px-3 py-2 text-xs font-bold rounded bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 transition-all flex items-center gap-1.5"
              title="بازگرداندن به اطلاعات اولیه قبل از ویرایش"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">بازنشانی</span>
            </button>

            {/* Print / Download Button */}
            <button
              onClick={handlePrint}
              className="bg-orange-500 hover:bg-orange-600 text-black font-black px-4 py-2 text-xs flex items-center gap-2 transition-all shadow-lg rounded"
            >
              <Printer className="w-4 h-4" />
              <span>چاپ / ذخیره PDF</span>
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1.5 transition-colors"
              title="بستن"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Color Palette & Customization Panel (Hidden in Print) */}
        {showColorPanel && (
          <div className="bg-slate-900 border-b-2 border-purple-500/60 p-3.5 sm:p-4 text-white text-xs space-y-3.5 no-print shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Paintbrush className="w-4 h-4 text-purple-400" />
                <span className="font-bold text-sm text-purple-200">
                  شخصی‌سازی رنگ پس‌زمینه، متن‌ها و قالب گرافیکی خروجی PDF:
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleApplyTheme(COLOR_THEMES[0])}
                  className="text-[11px] text-slate-400 hover:text-white underline"
                >
                  بازگشت به رنگ‌های پیش‌فرض
                </button>
              </div>
            </div>

            {/* Quick Themes Preset Grid */}
            <div>
              <span className="text-[11px] text-slate-400 font-bold block mb-1.5">
                ۱. انتخاب سریع تم‌های هماهنگ دانشگاهی و صنعتی:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                {COLOR_THEMES.map((theme) => {
                  const isSelected = selectedThemeId === theme.id;
                  return (
                    <button
                      key={theme.id}
                      onClick={() => handleApplyTheme(theme)}
                      className={`p-2 rounded border text-right transition-all flex flex-col justify-between gap-1.5 ${
                        isSelected
                          ? 'border-purple-400 bg-purple-950/60 ring-2 ring-purple-500/40 shadow-sm'
                          : 'border-slate-700 bg-slate-800/80 hover:bg-slate-800 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="font-bold text-[11px] text-white truncate">{theme.name}</span>
                        {isSelected && <Check className="w-3 h-3 text-purple-400 shrink-0" />}
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-slate-500 shrink-0"
                          style={{ backgroundColor: theme.bgColor }}
                          title="رنگ پس‌زمینه"
                        />
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-slate-500 shrink-0"
                          style={{ backgroundColor: theme.textColor }}
                          title="رنگ متن"
                        />
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-slate-500 shrink-0"
                          style={{ backgroundColor: theme.accentColor }}
                          title="رنگ تاکیدی"
                        />
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-slate-500 shrink-0"
                          style={{ backgroundColor: theme.cardBgColor }}
                          title="رنگ کادرها"
                        />
                      </div>
                      <span className="text-[9px] text-slate-400 truncate">{theme.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Individual Granular Color Pickers */}
            <div className="pt-2 border-t border-slate-800">
              <span className="text-[11px] text-slate-400 font-bold block mb-2">
                ۲. تنظیم دقیق و تفکیک‌شده رنگ‌ها:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5">
                {/* 1. Background Color */}
                <div className="bg-slate-800/90 border border-slate-700 p-2 rounded flex flex-col gap-1.5">
                  <span className="text-[11px] font-bold text-slate-300">رنگ پس‌زمینه صفحه:</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={pdfBgColor}
                      onChange={(e) => handleCustomColorChange('bg', e.target.value)}
                      className="w-7 h-7 rounded border border-slate-600 cursor-pointer bg-transparent"
                    />
                    <input
                      type="text"
                      value={pdfBgColor}
                      onChange={(e) => handleCustomColorChange('bg', e.target.value)}
                      className="text-[10px] font-mono bg-slate-900 border border-slate-700 rounded px-1.5 py-1 text-slate-200 w-16 text-center uppercase"
                    />
                  </div>
                  <div className="flex items-center gap-1 pt-0.5">
                    {['#ffffff', '#fdfbf7', '#f8fafc', '#f7fdf9', '#0f172a'].map((c) => (
                      <button
                        key={c}
                        onClick={() => handleCustomColorChange('bg', c)}
                        className="w-4 h-4 rounded-full border border-slate-600 transition-transform hover:scale-110"
                        style={{ backgroundColor: c }}
                        title={c}
                      />
                    ))}
                  </div>
                </div>

                {/* 2. Text Color */}
                <div className="bg-slate-800/90 border border-slate-700 p-2 rounded flex flex-col gap-1.5">
                  <span className="text-[11px] font-bold text-slate-300">رنگ متن اصلی و توضیحات:</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={pdfTextColor}
                      onChange={(e) => handleCustomColorChange('text', e.target.value)}
                      className="w-7 h-7 rounded border border-slate-600 cursor-pointer bg-transparent"
                    />
                    <input
                      type="text"
                      value={pdfTextColor}
                      onChange={(e) => handleCustomColorChange('text', e.target.value)}
                      className="text-[10px] font-mono bg-slate-900 border border-slate-700 rounded px-1.5 py-1 text-slate-200 w-16 text-center uppercase"
                    />
                  </div>
                  <div className="flex items-center gap-1 pt-0.5">
                    {['#1e293b', '#0f172a', '#292524', '#064e3b', '#f8fafc'].map((c) => (
                      <button
                        key={c}
                        onClick={() => handleCustomColorChange('text', c)}
                        className="w-4 h-4 rounded-full border border-slate-600 transition-transform hover:scale-110"
                        style={{ backgroundColor: c }}
                        title={c}
                      />
                    ))}
                  </div>
                </div>

                {/* 3. Heading Color */}
                <div className="bg-slate-800/90 border border-slate-700 p-2 rounded flex flex-col gap-1.5">
                  <span className="text-[11px] font-bold text-slate-300">رنگ عناوین و سرتیترها:</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={pdfHeadingColor}
                      onChange={(e) => handleCustomColorChange('heading', e.target.value)}
                      className="w-7 h-7 rounded border border-slate-600 cursor-pointer bg-transparent"
                    />
                    <input
                      type="text"
                      value={pdfHeadingColor}
                      onChange={(e) => handleCustomColorChange('heading', e.target.value)}
                      className="text-[10px] font-mono bg-slate-900 border border-slate-700 rounded px-1.5 py-1 text-slate-200 w-16 text-center uppercase"
                    />
                  </div>
                  <div className="flex items-center gap-1 pt-0.5">
                    {['#0f172a', '#1e3a8a', '#064e3b', '#1c1917', '#ffffff'].map((c) => (
                      <button
                        key={c}
                        onClick={() => handleCustomColorChange('heading', c)}
                        className="w-4 h-4 rounded-full border border-slate-600 transition-transform hover:scale-110"
                        style={{ backgroundColor: c }}
                        title={c}
                      />
                    ))}
                  </div>
                </div>

                {/* 4. Accent Color */}
                <div className="bg-slate-800/90 border border-slate-700 p-2 rounded flex flex-col gap-1.5">
                  <span className="text-[11px] font-bold text-slate-300">رنگ تاکیدی و آیکون‌ها:</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={pdfAccentColor}
                      onChange={(e) => handleCustomColorChange('accent', e.target.value)}
                      className="w-7 h-7 rounded border border-slate-600 cursor-pointer bg-transparent"
                    />
                    <input
                      type="text"
                      value={pdfAccentColor}
                      onChange={(e) => handleCustomColorChange('accent', e.target.value)}
                      className="text-[10px] font-mono bg-slate-900 border border-slate-700 rounded px-1.5 py-1 text-slate-200 w-16 text-center uppercase"
                    />
                  </div>
                  <div className="flex items-center gap-1 pt-0.5">
                    {['#ea580c', '#2563eb', '#059669', '#c2410c', '#fb923c'].map((c) => (
                      <button
                        key={c}
                        onClick={() => handleCustomColorChange('accent', c)}
                        className="w-4 h-4 rounded-full border border-slate-600 transition-transform hover:scale-110"
                        style={{ backgroundColor: c }}
                        title={c}
                      />
                    ))}
                  </div>
                </div>

                {/* 5. Card / Box Background */}
                <div className="bg-slate-800/90 border border-slate-700 p-2 rounded flex flex-col gap-1.5">
                  <span className="text-[11px] font-bold text-slate-300">رنگ کادرها و باکس‌ها:</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={pdfCardBgColor}
                      onChange={(e) => handleCustomColorChange('card', e.target.value)}
                      className="w-7 h-7 rounded border border-slate-600 cursor-pointer bg-transparent"
                    />
                    <input
                      type="text"
                      value={pdfCardBgColor}
                      onChange={(e) => handleCustomColorChange('card', e.target.value)}
                      className="text-[10px] font-mono bg-slate-900 border border-slate-700 rounded px-1.5 py-1 text-slate-200 w-16 text-center uppercase"
                    />
                  </div>
                  <div className="flex items-center gap-1 pt-0.5">
                    {['#f8fafc', '#ffffff', '#f5efe6', '#eff6ff', '#1e293b'].map((c) => (
                      <button
                        key={c}
                        onClick={() => handleCustomColorChange('card', c)}
                        className="w-4 h-4 rounded-full border border-slate-600 transition-transform hover:scale-110"
                        style={{ backgroundColor: c }}
                        title={c}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Live Edit Guidance Banner (Hidden in Print) */}
        {isEditMode && (
          <div className="bg-orange-50 border-b border-orange-200 p-2.5 sm:px-6 flex items-center justify-between text-xs text-orange-900 font-medium no-print">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
              <span>
                <strong>امکان ویرایش مستقیم:</strong> کافیست روی هر عنوان، پاراگراف، برچسب یا متن کلیک کرده و متن دلخواه خود را مستقیماً تایپ یا تصحیح کنید.
              </span>
            </div>
            <button
              onClick={() => setIsEditMode(false)}
              className="text-[11px] text-orange-700 hover:text-black underline shrink-0 mr-2"
            >
              پیش‌نمایش خروجی نهایی
            </button>
          </div>
        )}

        {/* Section Visibility Manager Bar (Hidden in Print) */}
        {isEditMode && (
          <div className="bg-slate-900/95 text-white px-4 py-2 border-b border-slate-800 flex items-center flex-wrap gap-2 text-xs no-print">
            <div className="flex items-center gap-1.5 text-slate-400 font-bold ml-1">
              <Layers className="w-3.5 h-3.5 text-orange-500" />
              <span>مدیریت نمایش بخش‌ها در خروجی:</span>
            </div>

            {type === 'faculty' && (
              <>
                <button
                  onClick={() => setShowFacBio(!showFacBio)}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold flex items-center gap-1 transition-all border ${
                    showFacBio
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 hover:bg-emerald-500/30'
                      : 'bg-slate-800 border-slate-700 text-slate-400 line-through hover:text-white'
                  }`}
                >
                  {showFacBio ? <Eye className="w-3 h-3 text-emerald-400" /> : <EyeOff className="w-3 h-3 text-red-400" />}
                  <span>بیوگرافی و سوابق</span>
                </button>

                <button
                  onClick={() => setShowFacSkills(!showFacSkills)}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold flex items-center gap-1 transition-all border ${
                    showFacSkills
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 hover:bg-emerald-500/30'
                      : 'bg-slate-800 border-slate-700 text-slate-400 line-through hover:text-white'
                  }`}
                >
                  {showFacSkills ? <Eye className="w-3 h-3 text-emerald-400" /> : <EyeOff className="w-3 h-3 text-red-400" />}
                  <span>حوزه‌های تخصصی ({facSkills.length})</span>
                </button>

                <button
                  onClick={() => setShowFacPublications(!showFacPublications)}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold flex items-center gap-1 transition-all border ${
                    showFacPublications
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 hover:bg-emerald-500/30'
                      : 'bg-slate-800 border-slate-700 text-slate-400 line-through hover:text-white'
                  }`}
                >
                  {showFacPublications ? <Eye className="w-3 h-3 text-emerald-400" /> : <EyeOff className="w-3 h-3 text-red-400" />}
                  <span>گزیده مقالات ({facPublications.length})</span>
                </button>

                <button
                  onClick={() => setShowFacGallery(!showFacGallery)}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold flex items-center gap-1 transition-all border ${
                    showFacGallery
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 hover:bg-emerald-500/30'
                      : 'bg-slate-800 border-slate-700 text-slate-400 line-through hover:text-white'
                  }`}
                >
                  {showFacGallery ? <Eye className="w-3 h-3 text-emerald-400" /> : <EyeOff className="w-3 h-3 text-red-400" />}
                  <span>گالری تصاویر ({facGallery.length})</span>
                </button>
              </>
            )}

            {type === 'lab' && (
              <>
                <button
                  onClick={() => setShowLabDesc(!showLabDesc)}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold flex items-center gap-1 transition-all border ${
                    showLabDesc
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 hover:bg-emerald-500/30'
                      : 'bg-slate-800 border-slate-700 text-slate-400 line-through hover:text-white'
                  }`}
                >
                  {showLabDesc ? <Eye className="w-3 h-3 text-emerald-400" /> : <EyeOff className="w-3 h-3 text-red-400" />}
                  <span>معرفی آزمایشگاه</span>
                </button>

                <button
                  onClick={() => setShowLabEquipment(!showLabEquipment)}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold flex items-center gap-1 transition-all border ${
                    showLabEquipment
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 hover:bg-emerald-500/30'
                      : 'bg-slate-800 border-slate-700 text-slate-400 line-through hover:text-white'
                  }`}
                >
                  {showLabEquipment ? <Eye className="w-3 h-3 text-emerald-400" /> : <EyeOff className="w-3 h-3 text-red-400" />}
                  <span>تجهیزات ({labEquipment.length})</span>
                </button>

                <button
                  onClick={() => setShowLabMembers(!showLabMembers)}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold flex items-center gap-1 transition-all border ${
                    showLabMembers
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 hover:bg-emerald-500/30'
                      : 'bg-slate-800 border-slate-700 text-slate-400 line-through hover:text-white'
                  }`}
                >
                  {showLabMembers ? <Eye className="w-3 h-3 text-emerald-400" /> : <EyeOff className="w-3 h-3 text-red-400" />}
                  <span>اعضای تیم ({labMembers.length})</span>
                </button>

                <button
                  onClick={() => setShowLabAchievements(!showLabAchievements)}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold flex items-center gap-1 transition-all border ${
                    showLabAchievements
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 hover:bg-emerald-500/30'
                      : 'bg-slate-800 border-slate-700 text-slate-400 line-through hover:text-white'
                  }`}
                >
                  {showLabAchievements ? <Eye className="w-3 h-3 text-emerald-400" /> : <EyeOff className="w-3 h-3 text-red-400" />}
                  <span>افتخارات ({labAchievements.length})</span>
                </button>

                <button
                  onClick={() => setShowLabGallery(!showLabGallery)}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold flex items-center gap-1 transition-all border ${
                    showLabGallery
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 hover:bg-emerald-500/30'
                      : 'bg-slate-800 border-slate-700 text-slate-400 line-through hover:text-white'
                  }`}
                >
                  {showLabGallery ? <Eye className="w-3 h-3 text-emerald-400" /> : <EyeOff className="w-3 h-3 text-red-400" />}
                  <span>گالری تصاویر ({labGallery.length})</span>
                </button>
              </>
            )}

            {type === 'project' && (
              <>
                <button
                  onClick={() => setShowProjDesc(!showProjDesc)}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold flex items-center gap-1 transition-all border ${
                    showProjDesc
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 hover:bg-emerald-500/30'
                      : 'bg-slate-800 border-slate-700 text-slate-400 line-through hover:text-white'
                  }`}
                >
                  {showProjDesc ? <Eye className="w-3 h-3 text-emerald-400" /> : <EyeOff className="w-3 h-3 text-red-400" />}
                  <span>تشریح کامل پروژه</span>
                </button>

                <button
                  onClick={() => setShowProjExecution(!showProjExecution)}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold flex items-center gap-1 transition-all border ${
                    showProjExecution
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 hover:bg-emerald-500/30'
                      : 'bg-slate-800 border-slate-700 text-slate-400 line-through hover:text-white'
                  }`}
                >
                  {showProjExecution ? <Eye className="w-3 h-3 text-emerald-400" /> : <EyeOff className="w-3 h-3 text-red-400" />}
                  <span>سرپرست و آزمایشگاه مجری</span>
                </button>

                <button
                  onClick={() => setShowProjOutcomes(!showProjOutcomes)}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold flex items-center gap-1 transition-all border ${
                    showProjOutcomes
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 hover:bg-emerald-500/30'
                      : 'bg-slate-800 border-slate-700 text-slate-400 line-through hover:text-white'
                  }`}
                >
                  {showProjOutcomes ? <Eye className="w-3 h-3 text-emerald-400" /> : <EyeOff className="w-3 h-3 text-red-400" />}
                  <span>نتایج کلیدی ({projOutcomes.length})</span>
                </button>
              </>
            )}
          </div>
        )}

        {/* PRINTABLE DATASHEET CONTENT CONTAINER */}
        <div
          id="pdf-printable-content"
          style={{
            '--pdf-bg': pdfBgColor,
            '--pdf-text': pdfTextColor,
            '--pdf-heading': pdfHeadingColor,
            '--pdf-accent': pdfAccentColor,
            '--pdf-card-bg': pdfCardBgColor,
            '--pdf-border': pdfBorderColor,
            backgroundColor: pdfBgColor,
            color: pdfTextColor,
          } as React.CSSProperties}
          className={`font-['Vazirmatn',sans-serif] transition-colors ${
            pageDensity === 'compact' ? 'p-6 sm:p-8' : 'p-8 sm:p-12'
          }`}
        >
          <table className="pdf-print-table w-full border-collapse">
            <tbody>
              <tr>
                <td className="p-0 border-0 align-top">
                  {/* Official Header Banner - Rendered ONLY on Page 1 */}
                  <div
                    className={`pdf-header-banner pdf-avoid-break ${pageDensity === 'compact' ? 'pb-2.5 mb-3' : 'pb-4 mb-5'}`}
                    style={{
                      backgroundColor: pdfBgColor,
                      borderBottomWidth: pageDensity === 'compact' ? '2px' : '4px',
                      borderBottomStyle: 'solid',
                      borderBottomColor: pdfBorderColor,
                    }}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 shrink-0" style={{ backgroundColor: pdfAccentColor }}></span>
                        <span
                          contentEditable={isEditMode}
                          suppressContentEditableWarning
                          onBlur={(e) => setHeaderDept(e.currentTarget.textContent || '')}
                          className="text-xs font-bold uppercase tracking-wider"
                          style={{ color: pdfTextColor, opacity: 0.85 }}
                        >
                          {headerDept}
                        </span>
                      </div>
                      <h1
                        contentEditable={isEditMode}
                        suppressContentEditableWarning
                        onBlur={(e) => setHeaderTitle(e.currentTarget.textContent || '')}
                        className={`${pageDensity === 'compact' ? 'text-xl sm:text-2xl' : 'text-2xl sm:text-3xl'} font-black leading-tight`}
                        style={{ color: pdfHeadingColor }}
                      >
                        {headerTitle}
                      </h1>
                      <p
                        contentEditable={isEditMode}
                        suppressContentEditableWarning
                        onBlur={(e) => setHeaderSubtitle(e.currentTarget.textContent || '')}
                        className="text-[11px] sm:text-xs font-semibold"
                        style={{ color: pdfTextColor, opacity: 0.75 }}
                      >
                        {headerSubtitle}
                      </p>
                    </div>
                  </div>

                  <div className={`space-y-6 ${pageDensity === 'compact' ? 'space-y-4' : 'space-y-7'}`}>

                    {/* ==================== FACULTY CONTENT ==================== */}
                    {type === 'faculty' && (
                      <div className={pageDensity === 'compact' ? 'space-y-4' : 'space-y-7'}>
                        {/* Profile Card Summary */}
                        <div
                          className={`pdf-card pdf-avoid-break flex flex-row gap-4 items-start rounded ${
                            pageDensity === 'compact' ? 'p-3.5 sm:p-4' : 'p-5 sm:p-6 gap-6'
                          }`}
                          style={{
                            backgroundColor: pdfCardBgColor,
                            borderColor: pdfBorderColor,
                            borderWidth: '2px',
                            borderStyle: 'solid',
                            color: pdfTextColor,
                          }}
                        >
                          <div className="space-y-1.5 shrink-0 text-center relative group">
                            <img
                              src={facAvatarUrl}
                              alt={facName}
                              className={`rounded object-cover mx-auto ${
                                pageDensity === 'compact' ? 'w-24 h-24 sm:w-28 sm:h-28' : 'w-28 h-28 sm:w-32 sm:h-32'
                              }`}
                              style={{ borderColor: pdfBorderColor, borderWidth: '2px', borderStyle: 'solid' }}
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300';
                              }}
                            />
                            {isEditMode && (
                              <div className="space-y-1 no-print">
                                <label className="cursor-pointer bg-orange-500 hover:bg-orange-600 text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center justify-center gap-1 transition-all shadow-sm">
                                  <Upload className="w-2.5 h-2.5" />
                                  <span>آپلود از سیستم</span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        const reader = new FileReader();
                                        reader.onload = (ev) => {
                                          if (ev.target?.result) setFacAvatarUrl(ev.target.result as string);
                                        };
                                        reader.readAsDataURL(file);
                                      }
                                    }}
                                  />
                                </label>
                                <input
                                  type="text"
                                  value={facAvatarUrl.startsWith('data:') ? 'عکس محلی آپلود شد' : facAvatarUrl}
                                  onChange={(e) => setFacAvatarUrl(e.target.value)}
                                  placeholder="لینک تصویر (URL)"
                                  className="text-[10px] font-mono text-slate-500 border border-slate-300 rounded px-1 py-0.5 w-24 block mx-auto text-center"
                                  title="آدرس اینترنتی تصویر برای تغییر عکس"
                                />
                              </div>
                            )}
                          </div>

                          <div className="space-y-2 flex-1 w-full text-right">
                            <h2
                              contentEditable={isEditMode}
                              suppressContentEditableWarning
                              onBlur={(e) => setFacName(e.currentTarget.textContent || '')}
                              className={`${pageDensity === 'compact' ? 'text-xl sm:text-2xl' : 'text-2xl sm:text-3xl'} font-black leading-tight`}
                              style={{ color: pdfHeadingColor }}
                            >
                              {facName}
                            </h2>

                            <p
                              contentEditable={isEditMode}
                              suppressContentEditableWarning
                              onBlur={(e) => setFacShortDesc(e.currentTarget.textContent || '')}
                              className="text-xs leading-relaxed"
                              style={{ color: pdfTextColor, opacity: 0.9 }}
                            >
                              {facShortDesc}
                            </p>
                            
                            <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold pt-1.5 border-t" style={{ borderColor: pdfBorderColor, color: pdfTextColor }}>
                              <Building2 className="w-3.5 h-3.5" style={{ color: pdfAccentColor }} />
                              <span>دانشکده مهندسی مکانیک</span>
                            </div>
                          </div>
                        </div>

                        {/* Biography */}
                        {showFacBio ? (
                          <div className="pdf-section space-y-1.5">
                            <div className="flex items-center justify-between">
                              <h3
                                className="text-sm sm:text-base font-black border-r-4 pr-2 flex items-center gap-2"
                                style={{ color: pdfHeadingColor, borderRightColor: pdfAccentColor }}
                              >
                                <User className="w-4 h-4" style={{ color: pdfAccentColor }} />
                                بیوگرافی و سوابق علمی
                              </h3>
                              {isEditMode && (
                                <div className="flex items-center gap-2 no-print">
                                  <button
                                    onClick={() => setShowFacBio(false)}
                                    className="text-[11px] text-slate-500 hover:text-red-500 bg-slate-100 hover:bg-red-50 border border-slate-300 px-2 py-0.5 rounded flex items-center gap-1 font-bold transition-all"
                                    title="مخفی کردن این بخش از خروجی چاپی"
                                  >
                                    <EyeOff className="w-3 h-3" />
                                    <span>مخفی‌سازی بخش</span>
                                  </button>
                                  <span className="text-[11px] text-orange-600 font-bold bg-orange-50 px-2 py-0.5 border border-orange-200 rounded hidden sm:inline-block">
                                    ادیتور متن پیشرفته
                                  </span>
                                </div>
                              )}
                            </div>
                            {isEditMode ? (
                              <RichTextEditor
                                value={facBio}
                                onChange={(html) => setFacBio(html)}
                                theme="light"
                                placeholder="بیوگرافی و سوابق علمی..."
                                minHeight="140px"
                                id="pdf-fac-bio-editor"
                              />
                            ) : (
                              <div
                                className="text-xs sm:text-[13px] leading-relaxed p-3.5 bio-rendered-content text-justify rounded"
                                style={{
                                  backgroundColor: pdfCardBgColor,
                                  borderColor: pdfBorderColor,
                                  borderWidth: '1px',
                                  borderStyle: 'solid',
                                  color: pdfTextColor,
                                }}
                                dangerouslySetInnerHTML={{ __html: normalizeToHtml(facBio) }}
                              />
                            )}
                          </div>
                        ) : isEditMode ? (
                          <div className="border border-dashed border-slate-300 bg-slate-50 p-3 text-center text-xs text-slate-500 rounded flex items-center justify-between no-print">
                            <span className="flex items-center gap-1.5">
                              <EyeOff className="w-4 h-4 text-slate-400" />
                              بخش «بیوگرافی و سوابق علمی» در خروجی چاپ مخفی است.
                            </span>
                            <button
                              onClick={() => setShowFacBio(true)}
                              className="text-xs font-bold text-orange-600 hover:text-orange-700 underline"
                            >
                              فعال‌سازی و نمایش
                            </button>
                          </div>
                        ) : null}

                        {/* Skills & Specializations */}
                        {showFacSkills && (facSkills.length > 0 || isEditMode) ? (
                          <div className="pdf-section space-y-1.5">
                            <div className="flex items-center justify-between">
                              <h3
                                className="text-sm sm:text-base font-black border-r-4 pr-2 flex items-center gap-2"
                                style={{ color: pdfHeadingColor, borderRightColor: pdfAccentColor }}
                              >
                                <Award className="w-4 h-4" style={{ color: pdfAccentColor }} />
                                حوزه‌های تخصصی و مهارت‌ها
                              </h3>
                              {isEditMode && (
                                <div className="flex items-center gap-2 no-print">
                                  <button
                                    onClick={() => setShowFacSkills(false)}
                                    className="text-[11px] text-slate-500 hover:text-red-500 bg-slate-100 hover:bg-red-50 border border-slate-300 px-2 py-0.5 rounded flex items-center gap-1 font-bold transition-all"
                                    title="مخفی کردن این بخش از خروجی چاپی"
                                  >
                                    <EyeOff className="w-3 h-3" />
                                    <span>مخفی‌سازی بخش</span>
                                  </button>
                                  <button
                                    onClick={() => {
                                      setShowFacSkills(true);
                                      setFacSkills([...facSkills, 'مهارت یا تخصص جدید']);
                                    }}
                                    className="text-xs bg-orange-500/10 text-orange-600 border border-orange-500/40 hover:bg-orange-500 hover:text-white px-2.5 py-1 rounded font-bold flex items-center gap-1 transition-all"
                                  >
                                    <Plus className="w-3.5 h-3.5" />
                                    <span>افزودن مهارت</span>
                                  </button>
                                </div>
                              )}
                            </div>

                            {facSkills.length > 0 ? (
                              <div className="flex flex-wrap gap-1.5">
                                {facSkills.map((skill, idx) => (
                                  <span
                                    key={idx}
                                    className="text-xs font-bold px-2.5 py-1 inline-flex items-center gap-1.5 rounded"
                                    style={{
                                      backgroundColor: pdfCardBgColor,
                                      borderColor: pdfBorderColor,
                                      borderWidth: '1px',
                                      borderStyle: 'solid',
                                      color: pdfTextColor,
                                    }}
                                  >
                                    <span
                                      contentEditable={isEditMode}
                                      suppressContentEditableWarning
                                      onBlur={(e) => {
                                        const updated = [...facSkills];
                                        updated[idx] = e.currentTarget.textContent || '';
                                        setFacSkills(updated);
                                      }}
                                    >
                                      {skill}
                                    </span>
                                    {isEditMode && (
                                      <button
                                        onClick={() => {
                                          const updated = facSkills.filter((_, i) => i !== idx);
                                          setFacSkills(updated);
                                          if (updated.length === 0) setShowFacSkills(false);
                                        }}
                                        className="text-slate-400 hover:text-red-500 p-0.5 no-print"
                                        title="حذف این مهارت"
                                      >
                                        <X className="w-3 h-3" />
                                      </button>
                                    )}
                                  </span>
                                ))}
                              </div>
                            ) : isEditMode ? (
                              <p className="text-xs text-slate-400 italic py-1 no-print">هیچ مهارتی ثبت نشده است.</p>
                            ) : null}
                          </div>
                        ) : !showFacSkills && isEditMode ? (
                          <div className="border border-dashed border-slate-300 bg-slate-50 p-3 text-center text-xs text-slate-500 rounded flex items-center justify-between no-print">
                            <span className="flex items-center gap-1.5">
                              <EyeOff className="w-4 h-4 text-slate-400" />
                              بخش «حوزه‌های تخصصی و مهارت‌ها» در خروجی چاپ مخفی است.
                            </span>
                            <button
                              onClick={() => setShowFacSkills(true)}
                              className="text-xs font-bold text-orange-600 hover:text-orange-700 underline"
                            >
                              فعال‌سازی و نمایش
                            </button>
                          </div>
                        ) : null}

                        {/* Selected Publications */}
                        {showFacPublications && (facPublications.length > 0 || isEditMode) ? (
                          <div className="pdf-section space-y-1.5">
                            <div className="flex items-center justify-between">
                              <h3
                                className="text-sm sm:text-base font-black border-r-4 pr-2 flex items-center gap-2"
                                style={{ color: pdfHeadingColor, borderRightColor: pdfAccentColor }}
                              >
                                <BookOpen className="w-4 h-4" style={{ color: pdfAccentColor }} />
                                گزیده مقالات و انتشارات شاخص
                              </h3>
                              {isEditMode && (
                                <div className="flex items-center gap-2 no-print">
                                  <button
                                    onClick={() => setShowFacPublications(false)}
                                    className="text-[11px] text-slate-500 hover:text-red-500 bg-slate-100 hover:bg-red-50 border border-slate-300 px-2.5 py-0.5 rounded flex items-center gap-1 font-bold transition-all"
                                    title="مخفی کردن این بخش از خروجی چاپی"
                                  >
                                    <EyeOff className="w-3 h-3" />
                                    <span>مخفی‌سازی بخش</span>
                                  </button>
                                  <button
                                    onClick={() => {
                                      setShowFacPublications(true);
                                      setFacPublications([...facPublications, 'عنوان مقاله پژوهشی یا کتاب جدید، ۲۰۲۶.']);
                                    }}
                                    className="text-xs bg-orange-500/10 text-orange-600 border border-orange-500/40 hover:bg-orange-500 hover:text-white px-2.5 py-1 rounded font-bold flex items-center gap-1 transition-all"
                                  >
                                    <Plus className="w-3.5 h-3.5" />
                                    <span>افزودن مقاله</span>
                                  </button>
                                </div>
                              )}
                            </div>

                            {facPublications.length > 0 ? (
                              <div className="space-y-1.5">
                                {facPublications.map((pub, idx) => (
                                  <div
                                    key={idx}
                                    className="pdf-block text-xs font-mono p-2.5 flex items-start gap-2 rounded"
                                    style={{
                                      backgroundColor: pdfCardBgColor,
                                      borderColor: pdfBorderColor,
                                      borderWidth: '1px',
                                      borderStyle: 'solid',
                                      color: pdfTextColor,
                                    }}
                                  >
                                    <span className="font-bold shrink-0 pt-0.5" style={{ color: pdfAccentColor }}>{idx + 1}.</span>
                                    <div
                                      contentEditable={isEditMode}
                                      suppressContentEditableWarning
                                      onBlur={(e) => {
                                        const updated = [...facPublications];
                                        updated[idx] = e.currentTarget.textContent || '';
                                        setFacPublications(updated);
                                      }}
                                      className="flex-1 leading-relaxed"
                                      style={{ color: pdfTextColor }}
                                    >
                                      {pub}
                                    </div>
                                    {isEditMode && (
                                      <button
                                        onClick={() => {
                                          const updated = facPublications.filter((_, i) => i !== idx);
                                          setFacPublications(updated);
                                          if (updated.length === 0) {
                                            setShowFacPublications(false);
                                          }
                                        }}
                                        className="text-slate-400 hover:text-red-500 p-1 no-print shrink-0"
                                        title="حذف مقاله"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    )}
                                  </div>
                                ))}
                              </div>
                            ) : isEditMode ? (
                              <div className="border border-dashed border-amber-300 bg-amber-50/50 p-2.5 text-xs text-amber-800 rounded flex items-center justify-between no-print">
                                <span>هیچ مقاله‌ای برای این استاد ثبت نشده است. در صورت تمایل می‌توانید مقاله اضافه کنید یا این بخش را خاموش کنید.</span>
                                <button
                                  onClick={() => setShowFacPublications(false)}
                                  className="text-xs font-bold text-amber-900 hover:underline shrink-0 mr-2"
                                >
                                  خاموش کردن بخش
                                </button>
                              </div>
                            ) : null}
                          </div>
                        ) : !showFacPublications && isEditMode ? (
                          <div className="border border-dashed border-slate-300 bg-slate-50 p-3 text-center text-xs text-slate-500 rounded flex items-center justify-between no-print">
                            <span className="flex items-center gap-1.5">
                              <EyeOff className="w-4 h-4 text-slate-400" />
                              بخش «گزیده مقالات و انتشارات شاخص» در خروجی چاپ مخفی است.
                            </span>
                            <button
                              onClick={() => setShowFacPublications(true)}
                              className="text-xs font-bold text-orange-600 hover:text-orange-700 underline"
                            >
                              فعال‌سازی و نمایش
                            </button>
                          </div>
                        ) : null}

                        {/* Faculty Visual Gallery */}
                        {showFacGallery ? (
                          <div className="pdf-avoid-break space-y-2">
                            <div className="flex items-center justify-between border-b pb-1" style={{ borderColor: pdfBorderColor }}>
                              <h3
                                className="text-sm sm:text-base font-black border-r-4 pr-2 flex items-center gap-2"
                                style={{ color: pdfHeadingColor, borderRightColor: pdfAccentColor }}
                              >
                                <ImageIcon className="w-4 h-4" style={{ color: pdfAccentColor }} />
                                گالری تصاویر، فعالیت‌های پژوهشی و آزمایشگاهی
                              </h3>
                              {isEditMode && (
                                <div className="flex items-center gap-2 no-print">
                                  <button
                                    onClick={() => setShowFacGallery(false)}
                                    className="text-[11px] text-slate-500 hover:text-red-500 bg-slate-100 hover:bg-red-50 border border-slate-300 px-2 py-0.5 rounded flex items-center gap-1 font-bold transition-all"
                                    title="مخفی کردن این بخش از خروجی چاپی"
                                  >
                                    <EyeOff className="w-3 h-3" />
                                    <span>مخفی‌سازی بخش</span>
                                  </button>
                                  <label className="cursor-pointer text-xs bg-orange-500/10 text-orange-600 border border-orange-500/40 hover:bg-orange-500 hover:text-white px-2.5 py-1 rounded font-bold flex items-center gap-1 transition-all">
                                    <Upload className="w-3.5 h-3.5" />
                                    <span>+ افزودن عکس از سیستم</span>
                                    <input
                                      type="file"
                                      multiple
                                      accept="image/*"
                                      className="hidden"
                                      onChange={(e) => {
                                        const fileList = e.target.files;
                                        if (!fileList || fileList.length === 0) return;
                                        for (let i = 0; i < fileList.length; i++) {
                                          const file = fileList[i];
                                          if (file) {
                                            const reader = new FileReader();
                                            reader.onload = (ev) => {
                                              if (ev.target?.result) {
                                                setFacGallery((prev) => [...prev, ev.target!.result as string]);
                                              }
                                            };
                                            reader.readAsDataURL(file);
                                          }
                                        }
                                      }}
                                    />
                                  </label>
                                </div>
                              )}
                            </div>

                            {facGallery.length > 0 ? (
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
                                {facGallery.map((imgUrl, idx) => (
                                  <div
                                    key={idx}
                                    className="pdf-card pdf-avoid-break rounded p-1.5 space-y-1 relative group"
                                    style={{
                                      backgroundColor: pdfCardBgColor,
                                      borderColor: pdfBorderColor,
                                      borderWidth: '1px',
                                      borderStyle: 'solid',
                                      color: pdfTextColor,
                                    }}
                                  >
                                    <div className="overflow-hidden rounded border border-slate-200 aspect-video bg-white">
                                      <img
                                        src={imgUrl}
                                        alt={`مستند استاد ${idx + 1}`}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300';
                                        }}
                                      />
                                    </div>
                                    <div className="flex items-center justify-between text-[10px] px-0.5" style={{ color: pdfTextColor, opacity: 0.85 }}>
                                      <span className="font-bold">تصویر {idx + 1}</span>
                                      {isEditMode && (
                                        <button
                                          onClick={() => {
                                            const updated = facGallery.filter((_, i) => i !== idx);
                                            setFacGallery(updated);
                                            if (updated.length === 0) setShowFacGallery(false);
                                          }}
                                          className="text-red-500 hover:text-red-700 p-0.5 no-print"
                                          title="حذف از چاپ"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : isEditMode ? (
                              <div className="border border-dashed border-slate-300 p-3 text-center rounded text-xs text-slate-400 no-print">
                                تصویری در گالری ثبت نشده است. برای افزودن از دکمه «+ افزودن عکس از سیستم» استفاده فرمایید.
                              </div>
                            ) : null}
                          </div>
                        ) : !showFacGallery && isEditMode ? (
                          <div className="border border-dashed border-slate-300 bg-slate-50 p-3 text-center text-xs text-slate-500 rounded flex items-center justify-between no-print">
                            <span className="flex items-center gap-1.5">
                              <EyeOff className="w-4 h-4 text-slate-400" />
                              بخش «گالری تصاویر استاد» در خروجی چاپ مخفی است.
                            </span>
                            <button
                              onClick={() => setShowFacGallery(true)}
                              className="text-xs font-bold text-orange-600 hover:text-orange-700 underline"
                            >
                              فعال‌سازی و نمایش
                            </button>
                          </div>
                        ) : null}
                      </div>
                    )}

                    {/* ==================== LAB CONTENT ==================== */}
                    {type === 'lab' && (
                      <div className={pageDensity === 'compact' ? 'space-y-4' : 'space-y-7'}>
                        {/* Lab Card Summary */}
                        <div
                          className={`pdf-card pdf-avoid-break rounded ${
                            pageDensity === 'compact' ? 'p-3.5 sm:p-4 space-y-2.5' : 'p-5 sm:p-6 space-y-4'
                          }`}
                          style={{
                            backgroundColor: pdfCardBgColor,
                            borderColor: pdfBorderColor,
                            borderWidth: '2px',
                            borderStyle: 'solid',
                            color: pdfTextColor,
                          }}
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-2" style={{ borderColor: pdfBorderColor }}>
                            <div className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 border-r-2" style={{ backgroundColor: pdfHeadingColor, color: pdfBgColor, borderRightColor: pdfAccentColor }}>
                              <span>آزمایشگاه پژوهشی —</span>
                              <span
                                contentEditable={isEditMode}
                                suppressContentEditableWarning
                                onBlur={(e) => setLabField(e.currentTarget.textContent || '')}
                              >
                                {labField}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs font-bold" style={{ color: pdfTextColor }}>
                              <Mail className="w-3.5 h-3.5" style={{ color: pdfAccentColor }} />
                              <span
                                contentEditable={isEditMode}
                                suppressContentEditableWarning
                                onBlur={(e) => setLabEmail(e.currentTarget.textContent || '')}
                                dir="ltr"
                              >
                                {labEmail}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-4 items-start">
                            <div className="space-y-1.5 shrink-0 w-full sm:w-44">
                              <img
                                src={labImageUrl}
                                alt={labName}
                                className="w-full sm:w-44 h-28 object-cover border bg-white rounded"
                                style={{ borderColor: pdfBorderColor }}
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=400';
                                }}
                              />
                              {isEditMode && (
                                <div className="space-y-1 no-print">
                                  <label className="cursor-pointer bg-orange-500 hover:bg-orange-600 text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center justify-center gap-1 transition-all shadow-sm">
                                    <Upload className="w-2.5 h-2.5" />
                                    <span>آپلود تصویر از سیستم</span>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      className="hidden"
                                      onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                          const reader = new FileReader();
                                          reader.onload = (ev) => {
                                            if (ev.target?.result) setLabImageUrl(ev.target.result as string);
                                          };
                                          reader.readAsDataURL(file);
                                        }
                                      }}
                                    />
                                  </label>
                                  <input
                                    type="text"
                                    value={labImageUrl.startsWith('data:') ? 'عکس محلی آزمایشگاه' : labImageUrl}
                                    onChange={(e) => setLabImageUrl(e.target.value)}
                                    placeholder="آدرس تصویر (URL)"
                                    className="text-[10px] font-mono text-slate-500 border border-slate-300 rounded px-1.5 py-0.5 w-full block text-center"
                                  />
                                </div>
                              )}
                            </div>

                            <div className="space-y-1.5 flex-1 w-full text-right">
                              <div className="flex items-center gap-1.5 text-xs font-bold" style={{ color: pdfAccentColor }}>
                                <User className="w-3.5 h-3.5 shrink-0" />
                                <span>سرپرست علمی آزمایشگاه:</span>
                                <span
                                  contentEditable={isEditMode}
                                  suppressContentEditableWarning
                                  onBlur={(e) => setLabSupervisor(e.currentTarget.textContent || '')}
                                  className="font-bold"
                                  style={{ color: pdfHeadingColor }}
                                >
                                  {labSupervisor}
                                </span>
                              </div>
                              <h2
                                contentEditable={isEditMode}
                                suppressContentEditableWarning
                                onBlur={(e) => setLabName(e.currentTarget.textContent || '')}
                                className={`${pageDensity === 'compact' ? 'text-xl sm:text-2xl' : 'text-2xl'} font-black leading-tight`}
                                style={{ color: pdfHeadingColor }}
                              >
                                {labName}
                              </h2>
                              <p
                                contentEditable={isEditMode}
                                suppressContentEditableWarning
                                onBlur={(e) => setLabShortDesc(e.currentTarget.textContent || '')}
                                className="text-xs leading-relaxed"
                                style={{ color: pdfTextColor, opacity: 0.9 }}
                              >
                                {labShortDesc}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Full Description / Overview */}
                        {showLabDesc ? (
                          <div className="pdf-section space-y-1.5">
                            <div className="flex items-center justify-between">
                              <h3
                                className="text-sm sm:text-base font-black border-r-4 pr-2 flex items-center gap-2"
                                style={{ color: pdfHeadingColor, borderRightColor: pdfAccentColor }}
                              >
                                <FlaskConical className="w-4 h-4" style={{ color: pdfAccentColor }} />
                                معرفی و حوزه فعالیت تخصصی آزمایشگاه
                              </h3>
                              {isEditMode && (
                                <div className="flex items-center gap-2 no-print">
                                  <button
                                    onClick={() => setShowLabDesc(false)}
                                    className="text-[11px] text-slate-500 hover:text-red-500 bg-slate-100 hover:bg-red-50 border border-slate-300 px-2 py-0.5 rounded flex items-center gap-1 font-bold transition-all"
                                    title="مخفی کردن این بخش از خروجی چاپی"
                                  >
                                    <EyeOff className="w-3 h-3" />
                                    <span>مخفی‌سازی بخش</span>
                                  </button>
                                  <span className="text-[11px] text-orange-600 font-bold bg-orange-50 px-2 py-0.5 border border-orange-200 rounded hidden sm:inline-block">
                                    ادیتور متن پیشرفته
                                  </span>
                                </div>
                              )}
                            </div>
                            {isEditMode ? (
                              <RichTextEditor
                                value={labFullDesc}
                                onChange={(html) => setLabFullDesc(html)}
                                theme="light"
                                placeholder="شرح کامل معرفی، قابلیت‌ها و خدمات آزمایشگاه..."
                                minHeight="140px"
                                id="pdf-lab-desc-editor"
                                templatesType="lab"
                              />
                            ) : (
                              <div
                                className="text-xs sm:text-[13px] leading-relaxed p-3.5 bio-rendered-content text-justify rounded"
                                style={{
                                  backgroundColor: pdfCardBgColor,
                                  borderColor: pdfBorderColor,
                                  borderWidth: '1px',
                                  borderStyle: 'solid',
                                  color: pdfTextColor,
                                }}
                                dangerouslySetInnerHTML={{ __html: normalizeToHtml(labFullDesc) }}
                              />
                            )}
                          </div>
                        ) : isEditMode ? (
                          <div className="border border-dashed border-slate-300 bg-slate-50 p-3 text-center text-xs text-slate-500 rounded flex items-center justify-between no-print">
                            <span className="flex items-center gap-1.5">
                              <EyeOff className="w-4 h-4 text-slate-400" />
                              بخش «معرفی آزمایشگاه» در خروجی چاپ مخفی است.
                            </span>
                            <button
                              onClick={() => setShowLabDesc(true)}
                              className="text-xs font-bold text-orange-600 hover:text-orange-700 underline"
                            >
                              فعال‌سازی و نمایش
                            </button>
                          </div>
                        ) : null}

                        {/* Equipment & Specifications */}
                        {showLabEquipment && (labEquipment.length > 0 || isEditMode) ? (
                          <div className="pdf-section space-y-1.5">
                            <div className="flex items-center justify-between">
                              <h3
                                className="text-sm sm:text-base font-black border-r-4 pr-2 flex items-center gap-2"
                                style={{ color: pdfHeadingColor, borderRightColor: pdfAccentColor }}
                              >
                                <Wrench className="w-4 h-4" style={{ color: pdfAccentColor }} />
                                تجهیزات، ابزارآلات و زیرساخت‌های آزمایشگاهی
                              </h3>
                              {isEditMode && (
                                <div className="flex items-center gap-2 no-print">
                                  <button
                                    onClick={() => setShowLabEquipment(false)}
                                    className="text-[11px] text-slate-500 hover:text-red-500 bg-slate-100 hover:bg-red-50 border border-slate-300 px-2 py-0.5 rounded flex items-center gap-1 font-bold transition-all"
                                    title="مخفی کردن این بخش از خروجی چاپی"
                                  >
                                    <EyeOff className="w-3 h-3" />
                                    <span>مخفی‌سازی بخش</span>
                                  </button>
                                  <button
                                    onClick={() => {
                                      setShowLabEquipment(true);
                                      setLabEquipment([...labEquipment, { name: 'عنوان دستگاه جدید', specs: 'مشخصات فنی و دقت اندازه‌گیری...' }]);
                                    }}
                                    className="text-xs bg-orange-500/10 text-orange-600 border border-orange-500/40 hover:bg-orange-500 hover:text-white px-2.5 py-1 rounded font-bold flex items-center gap-1 transition-all"
                                  >
                                    <Plus className="w-3.5 h-3.5" />
                                    <span>افزودن دستگاه</span>
                                  </button>
                                </div>
                              )}
                            </div>

                            {labEquipment.length > 0 ? (
                              <div className="space-y-1.5">
                                {labEquipment.map((eq, idx) => (
                                  <div
                                    key={idx}
                                    className="pdf-block p-2.5 text-xs space-y-1 relative rounded"
                                    style={{
                                      backgroundColor: pdfCardBgColor,
                                      borderColor: pdfBorderColor,
                                      borderWidth: '1px',
                                      borderStyle: 'solid',
                                      color: pdfTextColor,
                                    }}
                                  >
                                    <div className="flex items-center justify-between gap-2">
                                      <div className="flex items-center gap-2 flex-1">
                                        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: pdfAccentColor }}></span>
                                        <span
                                          contentEditable={isEditMode}
                                          suppressContentEditableWarning
                                          onBlur={(e) => {
                                            const updated = [...labEquipment];
                                            updated[idx].name = e.currentTarget.textContent || '';
                                            setLabEquipment(updated);
                                          }}
                                          className="font-bold text-xs"
                                          style={{ color: pdfHeadingColor }}
                                        >
                                          {eq.name}
                                        </span>
                                      </div>
                                      {isEditMode && (
                                        <button
                                          onClick={() => {
                                            const updated = labEquipment.filter((_, i) => i !== idx);
                                            setLabEquipment(updated);
                                            if (updated.length === 0) setShowLabEquipment(false);
                                          }}
                                          className="text-slate-400 hover:text-red-500 p-1 no-print shrink-0"
                                          title="حذف دستگاه"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-2 pr-4 text-xs opacity-90">
                                      <span className="font-bold shrink-0" style={{ color: pdfTextColor }}>مشخصات فنی:</span>
                                      <span
                                        contentEditable={isEditMode}
                                        suppressContentEditableWarning
                                        onBlur={(e) => {
                                          const updated = [...labEquipment];
                                          updated[idx].specs = e.currentTarget.textContent || '';
                                          setLabEquipment(updated);
                                        }}
                                        style={{ color: pdfTextColor }}
                                      >
                                        {eq.specs}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : isEditMode ? (
                              <p className="text-xs text-slate-400 italic py-1 no-print">تجهیزاتی برای این آزمایشگاه ثبت نشده است.</p>
                            ) : null}
                          </div>
                        ) : !showLabEquipment && isEditMode ? (
                          <div className="border border-dashed border-slate-300 bg-slate-50 p-3 text-center text-xs text-slate-500 rounded flex items-center justify-between no-print">
                            <span className="flex items-center gap-1.5">
                              <EyeOff className="w-4 h-4 text-slate-400" />
                              بخش «تجهیزات و زیرساخت‌های آزمایشگاهی» در خروجی چاپ مخفی است.
                            </span>
                            <button
                              onClick={() => setShowLabEquipment(true)}
                              className="text-xs font-bold text-orange-600 hover:text-orange-700 underline"
                            >
                              فعال‌سازی و نمایش
                            </button>
                          </div>
                        ) : null}

                        {/* Members */}
                        {showLabMembers && (labMembers.length > 0 || isEditMode) ? (
                          <div className="pdf-section space-y-1.5">
                            <div className="flex items-center justify-between">
                              <h3
                                className="text-sm sm:text-base font-black border-r-4 pr-2 flex items-center gap-2"
                                style={{ color: pdfHeadingColor, borderRightColor: pdfAccentColor }}
                              >
                                <User className="w-4 h-4" style={{ color: pdfAccentColor }} />
                                اعضای تیم و پژوهشگران آزمایشگاه
                              </h3>
                              {isEditMode && (
                                <div className="flex items-center gap-2 no-print">
                                  <button
                                    onClick={() => setShowLabMembers(false)}
                                    className="text-[11px] text-slate-500 hover:text-red-500 bg-slate-100 hover:bg-red-50 border border-slate-300 px-2 py-0.5 rounded flex items-center gap-1 font-bold transition-all"
                                    title="مخفی کردن این بخش از خروجی چاپی"
                                  >
                                    <EyeOff className="w-3 h-3" />
                                    <span>مخفی‌سازی بخش</span>
                                  </button>
                                  <button
                                    onClick={() => {
                                      setShowLabMembers(true);
                                      setLabMembers([...labMembers, 'نام پژوهشگر جدید']);
                                    }}
                                    className="text-xs bg-orange-500/10 text-orange-600 border border-orange-500/40 hover:bg-orange-500 hover:text-white px-2.5 py-1 rounded font-bold flex items-center gap-1 transition-all"
                                  >
                                    <Plus className="w-3.5 h-3.5" />
                                    <span>افزودن عضو</span>
                                  </button>
                                </div>
                              )}
                            </div>

                            {labMembers.length > 0 ? (
                              <div className="flex flex-wrap gap-1.5">
                                {labMembers.map((mem, idx) => (
                                  <span
                                    key={idx}
                                    className="text-xs font-bold px-2.5 py-1 inline-flex items-center gap-1.5 rounded"
                                    style={{
                                      backgroundColor: pdfCardBgColor,
                                      borderColor: pdfBorderColor,
                                      borderWidth: '1px',
                                      borderStyle: 'solid',
                                      color: pdfTextColor,
                                    }}
                                  >
                                    <span
                                      contentEditable={isEditMode}
                                      suppressContentEditableWarning
                                      onBlur={(e) => {
                                        const updated = [...labMembers];
                                        updated[idx] = e.currentTarget.textContent || '';
                                        setLabMembers(updated);
                                      }}
                                    >
                                      {mem}
                                    </span>
                                    {isEditMode && (
                                      <button
                                        onClick={() => {
                                          const updated = labMembers.filter((_, i) => i !== idx);
                                          setLabMembers(updated);
                                          if (updated.length === 0) setShowLabMembers(false);
                                        }}
                                        className="text-slate-400 hover:text-red-500 p-0.5 no-print"
                                        title="حذف عضو"
                                      >
                                        <X className="w-3 h-3" />
                                      </button>
                                    )}
                                  </span>
                                ))}
                              </div>
                            ) : isEditMode ? (
                              <p className="text-xs text-slate-400 italic py-1 no-print">عضوی ثبت نشده است.</p>
                            ) : null}
                          </div>
                        ) : !showLabMembers && isEditMode ? (
                          <div className="border border-dashed border-slate-300 bg-slate-50 p-3 text-center text-xs text-slate-500 rounded flex items-center justify-between no-print">
                            <span className="flex items-center gap-1.5">
                              <EyeOff className="w-4 h-4 text-slate-400" />
                              بخش «اعضای تیم آزمایشگاه» در خروجی چاپ مخفی است.
                            </span>
                            <button
                              onClick={() => setShowLabMembers(true)}
                              className="text-xs font-bold text-orange-600 hover:text-orange-700 underline"
                            >
                              فعال‌سازی و نمایش
                            </button>
                          </div>
                        ) : null}

                        {/* Achievements */}
                        {showLabAchievements && (labAchievements.length > 0 || isEditMode) ? (
                          <div className="pdf-section space-y-1.5">
                            <div className="flex items-center justify-between">
                              <h3
                                className="text-sm sm:text-base font-black border-r-4 pr-2 flex items-center gap-2"
                                style={{ color: pdfHeadingColor, borderRightColor: pdfAccentColor }}
                              >
                                <Award className="w-4 h-4" style={{ color: pdfAccentColor }} />
                                افتخارات و دستاوردهای علمی و پژوهشی
                              </h3>
                              {isEditMode && (
                                <div className="flex items-center gap-2 no-print">
                                  <button
                                    onClick={() => setShowLabAchievements(false)}
                                    className="text-[11px] text-slate-500 hover:text-red-500 bg-slate-100 hover:bg-red-50 border border-slate-300 px-2 py-0.5 rounded flex items-center gap-1 font-bold transition-all"
                                    title="مخفی کردن این بخش از خروجی چاپی"
                                  >
                                    <EyeOff className="w-3 h-3" />
                                    <span>مخفی‌سازی بخش</span>
                                  </button>
                                  <button
                                    onClick={() => {
                                      setShowLabAchievements(true);
                                      setLabAchievements([...labAchievements, 'دستاورد یا افتخار علمی جدید...']);
                                    }}
                                    className="text-xs bg-orange-500/10 text-orange-600 border border-orange-500/40 hover:bg-orange-500 hover:text-white px-2.5 py-1 rounded font-bold flex items-center gap-1 transition-all"
                                  >
                                    <Plus className="w-3.5 h-3.5" />
                                    <span>افزودن افتخار</span>
                                  </button>
                                </div>
                              )}
                            </div>

                            {labAchievements.length > 0 ? (
                              <div className="space-y-1.5">
                                {labAchievements.map((ach, idx) => (
                                  <div
                                    key={idx}
                                    className="pdf-block p-2.5 text-xs font-bold flex items-center gap-2 rounded"
                                    style={{
                                      backgroundColor: pdfCardBgColor,
                                      borderColor: pdfBorderColor,
                                      borderWidth: '1px',
                                      borderStyle: 'solid',
                                      color: pdfTextColor,
                                    }}
                                  >
                                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: pdfAccentColor }}></span>
                                    <span
                                      contentEditable={isEditMode}
                                      suppressContentEditableWarning
                                      onBlur={(e) => {
                                        const updated = [...labAchievements];
                                        updated[idx] = e.currentTarget.textContent || '';
                                        setLabAchievements(updated);
                                      }}
                                      className="flex-1"
                                      style={{ color: pdfTextColor }}
                                    >
                                      {ach}
                                    </span>
                                    {isEditMode && (
                                      <button
                                        onClick={() => {
                                          const updated = labAchievements.filter((_, i) => i !== idx);
                                          setLabAchievements(updated);
                                          if (updated.length === 0) setShowLabAchievements(false);
                                        }}
                                        className="text-slate-400 hover:text-red-500 p-1 no-print shrink-0"
                                        title="حذف دستاورد"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    )}
                                  </div>
                                ))}
                              </div>
                            ) : isEditMode ? (
                              <p className="text-xs text-slate-400 italic py-1 no-print">دستاوردی ثبت نشده است.</p>
                            ) : null}
                          </div>
                        ) : !showLabAchievements && isEditMode ? (
                          <div className="border border-dashed border-slate-300 bg-slate-50 p-3 text-center text-xs text-slate-500 rounded flex items-center justify-between no-print">
                            <span className="flex items-center gap-1.5">
                              <EyeOff className="w-4 h-4 text-slate-400" />
                              بخش «افتخارات و دستاوردها» در خروجی چاپ مخفی است.
                            </span>
                            <button
                              onClick={() => setShowLabAchievements(true)}
                              className="text-xs font-bold text-orange-600 hover:text-orange-700 underline"
                            >
                              فعال‌سازی و نمایش
                            </button>
                          </div>
                        ) : null}

                        {/* 5. Visual Gallery & Facility Images */}
                        {showLabGallery ? (
                          <div className="pdf-avoid-break space-y-2">
                            <div className="flex items-center justify-between border-b pb-1" style={{ borderColor: pdfBorderColor }}>
                              <h3
                                className="text-sm sm:text-base font-black border-r-4 pr-2 flex items-center gap-2"
                                style={{ color: pdfHeadingColor, borderRightColor: pdfAccentColor }}
                              >
                                <ImageIcon className="w-4 h-4" style={{ color: pdfAccentColor }} />
                                گالری تصاویر، فضا و مستندات فنی آزمایشگاه
                              </h3>
                              {isEditMode && (
                                <div className="flex items-center gap-2 no-print">
                                  <button
                                    onClick={() => setShowLabGallery(false)}
                                    className="text-[11px] text-slate-500 hover:text-red-500 bg-slate-100 hover:bg-red-50 border border-slate-300 px-2 py-0.5 rounded flex items-center gap-1 font-bold transition-all"
                                    title="مخفی کردن این بخش از خروجی چاپی"
                                  >
                                    <EyeOff className="w-3 h-3" />
                                    <span>مخفی‌سازی بخش</span>
                                  </button>
                                  <label className="cursor-pointer text-xs bg-orange-500/10 text-orange-600 border border-orange-500/40 hover:bg-orange-500 hover:text-white px-2.5 py-1 rounded font-bold flex items-center gap-1 transition-all">
                                    <Upload className="w-3.5 h-3.5" />
                                    <span>+ افزودن عکس از سیستم</span>
                                    <input
                                      type="file"
                                      multiple
                                      accept="image/*"
                                      className="hidden"
                                      onChange={(e) => {
                                        const fileList = e.target.files;
                                        if (!fileList || fileList.length === 0) return;
                                        for (let i = 0; i < fileList.length; i++) {
                                          const file = fileList[i];
                                          if (file) {
                                            const reader = new FileReader();
                                            reader.onload = (ev) => {
                                              if (ev.target?.result) {
                                                setLabGallery((prev) => [...prev, ev.target!.result as string]);
                                              }
                                            };
                                            reader.readAsDataURL(file);
                                          }
                                        }
                                      }}
                                    />
                                  </label>
                                </div>
                              )}
                            </div>

                            {labGallery.length > 0 ? (
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
                                {labGallery.map((imgUrl, idx) => (
                                  <div
                                    key={idx}
                                    className="pdf-card pdf-avoid-break rounded p-1.5 space-y-1 relative group"
                                    style={{
                                      backgroundColor: pdfCardBgColor,
                                      borderColor: pdfBorderColor,
                                      borderWidth: '1px',
                                      borderStyle: 'solid',
                                      color: pdfTextColor,
                                    }}
                                  >
                                    <div className="overflow-hidden rounded border border-slate-200 aspect-video bg-white">
                                      <img
                                        src={imgUrl}
                                        alt={`مستند آزمایشگاهی ${idx + 1}`}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=400';
                                        }}
                                      />
                                    </div>
                                    <div className="flex items-center justify-between text-[10px] px-0.5" style={{ color: pdfTextColor, opacity: 0.85 }}>
                                      <span className="font-bold">تصویر {idx + 1}</span>
                                      {isEditMode && (
                                        <button
                                          onClick={() => {
                                            const updated = labGallery.filter((_, i) => i !== idx);
                                            setLabGallery(updated);
                                            if (updated.length === 0) setShowLabGallery(false);
                                          }}
                                          className="text-red-500 hover:text-red-700 p-0.5 no-print"
                                          title="حذف از چاپ"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : isEditMode ? (
                              <div className="border border-dashed border-slate-300 p-3 text-center rounded text-xs text-slate-400 no-print">
                                تصویری در گالری ثبت نشده است. برای افزودن از دکمه بالا استفاده فرمایید.
                              </div>
                            ) : null}
                          </div>
                        ) : !showLabGallery && isEditMode ? (
                          <div className="border border-dashed border-slate-300 bg-slate-50 p-3 text-center text-xs text-slate-500 rounded flex items-center justify-between no-print">
                            <span className="flex items-center gap-1.5">
                              <EyeOff className="w-4 h-4 text-slate-400" />
                              بخش «گالری تصاویر آزمایشگاه» در خروجی چاپ مخفی است.
                            </span>
                            <button
                              onClick={() => setShowLabGallery(true)}
                              className="text-xs font-bold text-orange-600 hover:text-orange-700 underline"
                            >
                              فعال‌سازی و نمایش
                            </button>
                          </div>
                        ) : null}
                      </div>
                    )}

                    {/* ==================== PROJECT CONTENT ==================== */}
                    {type === 'project' && (
                      <div className={pageDensity === 'compact' ? 'space-y-4' : 'space-y-7'}>
                        {/* Project Card Summary */}
                        <div
                          className={`pdf-card pdf-avoid-break rounded ${
                            pageDensity === 'compact' ? 'p-3.5 sm:p-4 space-y-2.5' : 'p-5 sm:p-6 space-y-4'
                          }`}
                          style={{
                            backgroundColor: pdfCardBgColor,
                            borderColor: pdfBorderColor,
                            borderWidth: '2px',
                            borderStyle: 'solid',
                            color: pdfTextColor,
                          }}
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-2" style={{ borderColor: pdfBorderColor }}>
                            <div className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 border-r-2" style={{ backgroundColor: pdfHeadingColor, color: pdfBgColor, borderRightColor: pdfAccentColor }}>
                              <span>دسته‌بندی:</span>
                              <span
                                contentEditable={isEditMode}
                                suppressContentEditableWarning
                                onBlur={(e) => setProjCategory(e.currentTarget.textContent || '')}
                              >
                                {projCategory}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-xs font-bold" style={{ color: pdfTextColor }}>
                              <div className="flex items-center gap-1">
                                <span>سال اجرا:</span>
                                <span
                                  contentEditable={isEditMode}
                                  suppressContentEditableWarning
                                  onBlur={(e) => setProjYear(e.currentTarget.textContent || '')}
                                >
                                  {projYear}
                                </span>
                              </div>
                              <span>•</span>
                              <div className="flex items-center gap-1 font-bold" style={{ color: pdfAccentColor }}>
                                <span>وضعیت:</span>
                                <span
                                  contentEditable={isEditMode}
                                  suppressContentEditableWarning
                                  onBlur={(e) => setProjStatus(e.currentTarget.textContent || '')}
                                >
                                  {projStatus}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-4 items-start">
                            <div className="space-y-1.5 shrink-0 w-full sm:w-44">
                              <img
                                src={projImageUrl}
                                alt={projTitle}
                                className="w-full sm:w-44 h-28 object-cover border bg-white rounded"
                                style={{ borderColor: pdfBorderColor }}
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&q=80&w=800';
                                }}
                              />
                              {isEditMode && (
                                <div className="space-y-1 no-print">
                                  <label className="cursor-pointer bg-orange-500 hover:bg-orange-600 text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center justify-center gap-1 transition-all shadow-sm">
                                    <Upload className="w-2.5 h-2.5" />
                                    <span>آپلود تصویر از سیستم</span>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      className="hidden"
                                      onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                          const reader = new FileReader();
                                          reader.onload = (ev) => {
                                            if (ev.target?.result) setProjImageUrl(ev.target.result as string);
                                          };
                                          reader.readAsDataURL(file);
                                        }
                                      }}
                                    />
                                  </label>
                                  <input
                                    type="text"
                                    value={projImageUrl.startsWith('data:') ? 'عکس محلی پروژه' : projImageUrl}
                                    onChange={(e) => setProjImageUrl(e.target.value)}
                                    placeholder="آدرس تصویر (URL)"
                                    className="text-[10px] font-mono text-slate-500 border border-slate-300 rounded px-1.5 py-0.5 w-full block text-center"
                                  />
                                </div>
                              )}
                            </div>

                            <div className="space-y-1.5 flex-1 w-full text-right">
                              <div className="flex items-center gap-1.5 text-xs font-bold" style={{ color: pdfAccentColor }}>
                                <Building2 className="w-3.5 h-3.5 shrink-0" />
                                <span>طرف قرارداد / کارفرما:</span>
                                <span
                                  contentEditable={isEditMode}
                                  suppressContentEditableWarning
                                  onBlur={(e) => setProjCompany(e.currentTarget.textContent || '')}
                                  className="font-bold"
                                  style={{ color: pdfHeadingColor }}
                                >
                                  {projCompany}
                                </span>
                              </div>
                              <h2
                                contentEditable={isEditMode}
                                suppressContentEditableWarning
                                onBlur={(e) => setProjTitle(e.currentTarget.textContent || '')}
                                className={`${pageDensity === 'compact' ? 'text-xl sm:text-2xl' : 'text-2xl'} font-black leading-tight`}
                                style={{ color: pdfHeadingColor }}
                              >
                                {projTitle}
                              </h2>
                              <p
                                contentEditable={isEditMode}
                                suppressContentEditableWarning
                                onBlur={(e) => setProjShortDesc(e.currentTarget.textContent || '')}
                                className="text-xs leading-relaxed"
                                style={{ color: pdfTextColor, opacity: 0.9 }}
                              >
                                {projShortDesc}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Full Description */}
                        {showProjDesc ? (
                          <div className="pdf-section space-y-1.5">
                            <div className="flex items-center justify-between">
                              <h3
                                className="text-sm sm:text-base font-black border-r-4 pr-2"
                                style={{ color: pdfHeadingColor, borderRightColor: pdfAccentColor }}
                              >
                                تشریح کامل پروژه و اهداف مهندسی
                              </h3>
                              {isEditMode && (
                                <button
                                  onClick={() => setShowProjDesc(false)}
                                  className="text-[11px] text-slate-500 hover:text-red-500 bg-slate-100 hover:bg-red-50 border border-slate-300 px-2 py-0.5 rounded flex items-center gap-1 font-bold transition-all no-print"
                                  title="مخفی کردن این بخش از خروجی چاپی"
                                >
                                  <EyeOff className="w-3 h-3" />
                                  <span>مخفی‌سازی بخش</span>
                                </button>
                              )}
                            </div>
                            <div
                              contentEditable={isEditMode}
                              suppressContentEditableWarning
                              onBlur={(e) => setProjFullDesc(e.currentTarget.textContent || '')}
                              className="text-xs sm:text-[13px] leading-relaxed p-3 whitespace-pre-line text-justify pdf-editorial-text rounded"
                              style={{
                                backgroundColor: pdfCardBgColor,
                                borderColor: pdfBorderColor,
                                borderWidth: '1px',
                                borderStyle: 'solid',
                                color: pdfTextColor,
                              }}
                            >
                              {projFullDesc}
                            </div>
                          </div>
                        ) : isEditMode ? (
                          <div className="border border-dashed border-slate-300 bg-slate-50 p-3 text-center text-xs text-slate-500 rounded flex items-center justify-between no-print">
                            <span className="flex items-center gap-1.5">
                              <EyeOff className="w-4 h-4 text-slate-400" />
                              بخش «تشریح کامل پروژه» در خروجی چاپ مخفی است.
                            </span>
                            <button
                              onClick={() => setShowProjDesc(true)}
                              className="text-xs font-bold text-orange-600 hover:text-orange-700 underline"
                            >
                              فعال‌سازی و نمایش
                            </button>
                          </div>
                        ) : null}

                        {/* Faculty & Lab Execution */}
                        {showProjExecution ? (
                          <div className="pdf-section space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold opacity-80" style={{ color: pdfTextColor }}>ارکان اجرایی و علمی پروژه:</span>
                              {isEditMode && (
                                <button
                                  onClick={() => setShowProjExecution(false)}
                                  className="text-[11px] text-slate-500 hover:text-red-500 bg-slate-100 hover:bg-red-50 border border-slate-300 px-2 py-0.5 rounded flex items-center gap-1 font-bold transition-all no-print"
                                  title="مخفی کردن این بخش از خروجی چاپی"
                                >
                                  <EyeOff className="w-3 h-3" />
                                  <span>مخفی‌سازی بخش</span>
                                </button>
                              )}
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div
                                className="p-3 space-y-1 text-right rounded"
                                style={{
                                  backgroundColor: pdfCardBgColor,
                                  borderColor: pdfBorderColor,
                                  borderWidth: '1px',
                                  borderStyle: 'solid',
                                  color: pdfTextColor,
                                }}
                              >
                                <span className="text-[11px] font-bold opacity-75 block" style={{ color: pdfTextColor }}>استاد راهنما / سرپرست پروژه:</span>
                                <div
                                  contentEditable={isEditMode}
                                  suppressContentEditableWarning
                                  onBlur={(e) => setProjLeadFac(e.currentTarget.textContent || '')}
                                  className="text-xs sm:text-sm font-black"
                                  style={{ color: pdfHeadingColor }}
                                >
                                  {projLeadFac}
                                </div>
                              </div>
                              <div
                                className="p-3 space-y-1 text-right rounded"
                                style={{
                                  backgroundColor: pdfCardBgColor,
                                  borderColor: pdfBorderColor,
                                  borderWidth: '1px',
                                  borderStyle: 'solid',
                                  color: pdfTextColor,
                                }}
                              >
                                <span className="text-[11px] font-bold opacity-75 block" style={{ color: pdfTextColor }}>آزمایشگاه تخصصی مجری:</span>
                                <div
                                  contentEditable={isEditMode}
                                  suppressContentEditableWarning
                                  onBlur={(e) => setProjLabName(e.currentTarget.textContent || '')}
                                  className="text-xs sm:text-sm font-black"
                                  style={{ color: pdfHeadingColor }}
                                >
                                  {projLabName}
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : isEditMode ? (
                          <div className="border border-dashed border-slate-300 bg-slate-50 p-3 text-center text-xs text-slate-500 rounded flex items-center justify-between no-print">
                            <span className="flex items-center gap-1.5">
                              <EyeOff className="w-4 h-4 text-slate-400" />
                              بخش «سرپرست و آزمایشگاه مجری» در خروجی چاپ مخفی است.
                            </span>
                            <button
                              onClick={() => setShowProjExecution(true)}
                              className="text-xs font-bold text-orange-600 hover:text-orange-700 underline"
                            >
                              فعال‌سازی و نمایش
                            </button>
                          </div>
                        ) : null}

                        {/* Outcomes */}
                        {showProjOutcomes && (projOutcomes.length > 0 || isEditMode) ? (
                          <div className="pdf-section space-y-1.5">
                            <div className="flex items-center justify-between">
                              <h3
                                className="text-sm sm:text-base font-black border-r-4 pr-2"
                                style={{ color: pdfHeadingColor, borderRightColor: pdfAccentColor }}
                              >
                                نتایج کلیدی و تحویلی‌های پروژه
                              </h3>
                              {isEditMode && (
                                <div className="flex items-center gap-2 no-print">
                                  <button
                                    onClick={() => setShowProjOutcomes(false)}
                                    className="text-[11px] text-slate-500 hover:text-red-500 bg-slate-100 hover:bg-red-50 border border-slate-300 px-2 py-0.5 rounded flex items-center gap-1 font-bold transition-all"
                                    title="مخفی کردن این بخش از خروجی چاپی"
                                  >
                                    <EyeOff className="w-3 h-3" />
                                    <span>مخفی‌سازی بخش</span>
                                  </button>
                                  <button
                                    onClick={() => {
                                      setShowProjOutcomes(true);
                                      setProjOutcomes([...projOutcomes, 'دستاورد یا نتیجه جدید پروژه...']);
                                    }}
                                    className="text-xs bg-orange-500/10 text-orange-600 border border-orange-500/40 hover:bg-orange-500 hover:text-white px-2.5 py-1 rounded font-bold flex items-center gap-1 transition-all"
                                  >
                                    <Plus className="w-3.5 h-3.5" />
                                    <span>افزودن نتیجه</span>
                                  </button>
                                </div>
                              )}
                            </div>

                            {projOutcomes.length > 0 ? (
                              <div className="space-y-1.5">
                                {projOutcomes.map((out, idx) => (
                                  <div
                                    key={idx}
                                    className="pdf-block p-2.5 text-xs font-bold flex items-center gap-2 rounded"
                                    style={{
                                      backgroundColor: pdfCardBgColor,
                                      borderColor: pdfBorderColor,
                                      borderWidth: '1px',
                                      borderStyle: 'solid',
                                      color: pdfTextColor,
                                    }}
                                  >
                                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: pdfAccentColor }}></span>
                                    <span
                                      contentEditable={isEditMode}
                                      suppressContentEditableWarning
                                      onBlur={(e) => {
                                        const updated = [...projOutcomes];
                                        updated[idx] = e.currentTarget.textContent || '';
                                        setProjOutcomes(updated);
                                      }}
                                      className="flex-1"
                                      style={{ color: pdfTextColor }}
                                    >
                                      {out}
                                    </span>
                                    {isEditMode && (
                                      <button
                                        onClick={() => {
                                          const updated = projOutcomes.filter((_, i) => i !== idx);
                                          setProjOutcomes(updated);
                                          if (updated.length === 0) setShowProjOutcomes(false);
                                        }}
                                        className="text-slate-400 hover:text-red-500 p-1 no-print shrink-0"
                                        title="حذف دستاورد"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    )}
                                  </div>
                                ))}
                              </div>
                            ) : isEditMode ? (
                              <p className="text-xs text-slate-400 italic py-1 no-print">نتیجه‌ای ثبت نشده است.</p>
                            ) : null}
                          </div>
                        ) : !showProjOutcomes && isEditMode ? (
                          <div className="border border-dashed border-slate-300 bg-slate-50 p-3 text-center text-xs text-slate-500 rounded flex items-center justify-between no-print">
                            <span className="flex items-center gap-1.5">
                              <EyeOff className="w-4 h-4 text-slate-400" />
                              بخش «نتایج کلیدی پروژه» در خروجی چاپ مخفی است.
                            </span>
                            <button
                              onClick={() => setShowProjOutcomes(true)}
                              className="text-xs font-bold text-orange-600 hover:text-orange-700 underline"
                            >
                              فعال‌سازی و نمایش
                            </button>
                          </div>
                        ) : null}
                      </div>
                    )}

                  </div>
                </td>
              </tr>
            </tbody>

            {/* Tfoot Spacer - reserves blank margin so tbody never overlaps the fixed bottom footer in print */}
            <tfoot>
              <tr>
                <td className="p-0 border-0">
                  <div className="pdf-footer-spacer hidden print:block"></div>
                </td>
              </tr>
            </tfoot>
          </table>

          {/* Official Fixed PDF Footer Banner */}
          <div
            className={`pdf-footer-banner flex flex-col sm:flex-row items-center justify-between gap-3 text-xs ${
              pageDensity === 'compact' ? 'pt-2 mt-4 pb-0.5' : 'pt-3 mt-6 pb-1'
            }`}
            style={{
              backgroundColor: pdfBgColor,
              borderTopWidth: '2px',
              borderTopStyle: 'solid',
              borderTopColor: pdfBorderColor,
              color: pdfTextColor,
            }}
          >
            {/* Right Side: University Address & Digital Archive */}
            <div className="space-y-0.5 text-center sm:text-right w-full sm:w-auto">
              <div
                contentEditable={isEditMode}
                suppressContentEditableWarning
                onBlur={(e) => setFooterAddress(e.currentTarget.textContent || '')}
                className="font-bold text-xs"
                style={{ color: pdfHeadingColor }}
              >
                {footerAddress}
              </div>
              <div
                contentEditable={isEditMode}
                suppressContentEditableWarning
                onBlur={(e) => setFooterArchive(e.currentTarget.textContent || '')}
                className="text-[11px]"
                style={{ color: pdfTextColor, opacity: 0.75 }}
              >
                {footerArchive}
              </div>
            </div>

            {/* Left Side: Issue Date */}
            <div
              className="flex items-center gap-1.5 text-xs font-bold px-3 py-1 shrink-0 rounded"
              style={{
                backgroundColor: pdfCardBgColor,
                borderColor: pdfBorderColor,
                borderWidth: '1px',
                borderStyle: 'solid',
                color: pdfTextColor,
              }}
            >
              <Calendar className="w-3.5 h-3.5" style={{ color: pdfAccentColor }} />
              <span>تاریخ صدور:</span>
              <span
                contentEditable={isEditMode}
                suppressContentEditableWarning
                onBlur={(e) => setIssueDate(e.currentTarget.textContent || '')}
                className="font-mono mr-1"
                style={{ color: pdfHeadingColor }}
                dir="ltr"
              >
                {issueDate}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>,
    document.body
  );
};
