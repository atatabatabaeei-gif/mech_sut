import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import {
  Printer,
  X,
  ShieldCheck,
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
  RotateCcw,
  Plus,
  Trash2,
  CheckCircle2,
  Briefcase
} from 'lucide-react';
import { FacultyMember, IndustrialProject, Lab } from '../types';
import { getAdminState } from '../services/storage';

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

  const defaultSerialNo = type === 'faculty'
    ? `SUT-ME-FAC-${data.id.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`
    : type === 'lab'
    ? `SUT-ME-LAB-${data.id.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`
    : `SUT-ME-PRJ-${data.id.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const defaultDate = new Date().toLocaleDateString('fa-IR');

  // General Metadata State
  const [isEditMode, setIsEditMode] = useState(true);
  const [serialNo, setSerialNo] = useState(defaultSerialNo);
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

  // Reset to original data
  const handleResetToOriginal = () => {
    if (!window.confirm('آیا مایلید تمام تغییرات به اطلاعات اولیه برگردد؟')) return;
    setSerialNo(defaultSerialNo);
    setIssueDate(defaultDate);
    setHeaderDept('دانشگاه صنعتی شریف — دانشکده مهندسی مکانیک');
    setHeaderSubtitle('سامانه جامع ارتباط با صنعت و پژوهش‌های تخصصی — شریف');
    setFooterAddress('دانشگاه صنعتی شریف — خیابان آزادی، تهران، ایران');
    setFooterArchive('بایگانی دیجیتال دانشکده مهندسی مکانیک');

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

  // Editable input class helper
  const editFieldClass = isEditMode
    ? 'border border-dashed border-orange-400/80 hover:border-orange-500 focus:border-orange-600 focus:bg-orange-50/40 rounded px-1.5 py-0.5 outline-none transition-all w-full bg-transparent'
    : 'border-0 bg-transparent px-0 py-0 outline-none w-full';

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
                    حالت ویرایش زنده فعال
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

        {/* Live Edit Guidance Banner (Hidden in Print) */}
        {isEditMode && (
          <div className="bg-orange-50 border-b border-orange-200 p-2.5 sm:px-6 flex items-center justify-between text-xs text-orange-900 font-medium no-print">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
              <span>
                <strong>امکان ویرایش زنده:</strong> روی هر یک از متون، تاریخ، کلاسه، عناوین و لیست‌ها کلیک کنید تا متن مورد نظر قبل از چاپ ویرایش شود.
              </span>
            </div>
            <button
              onClick={() => setIsEditMode(false)}
              className="text-[11px] text-orange-700 hover:text-black underline shrink-0 mr-2"
            >
              بستن کادرهای ویرایش
            </button>
          </div>
        )}

        {/* PRINTABLE DATASHEET CONTENT CONTAINER */}
        <div id="pdf-printable-content" className="p-6 sm:p-10 space-y-8 bg-white text-slate-900 font-['Vazirmatn',sans-serif]">
          
          {/* Header Banner */}
          <div className="border-b-4 border-slate-900 pb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1.5 flex-1 min-w-0 w-full sm:w-auto">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-orange-500 shrink-0"></span>
                <input
                  type="text"
                  value={headerDept}
                  onChange={(e) => setHeaderDept(e.target.value)}
                  className={`text-xs font-bold text-slate-600 uppercase tracking-wider ${editFieldClass}`}
                  placeholder="عنوان دانشگاه و دانشکده"
                />
              </div>
              <input
                type="text"
                value={headerTitle}
                onChange={(e) => setHeaderTitle(e.target.value)}
                className={`text-2xl sm:text-3xl font-black text-slate-900 ${editFieldClass}`}
                placeholder="عنوان شناسنامه"
              />
              <input
                type="text"
                value={headerSubtitle}
                onChange={(e) => setHeaderSubtitle(e.target.value)}
                className={`text-xs text-slate-500 font-semibold ${editFieldClass}`}
                placeholder="زیرعنوان"
              />
            </div>

            {/* Serial & Date box */}
            <div className="text-left font-mono text-xs text-slate-600 border border-slate-300 p-3 bg-slate-50 space-y-1 shrink-0 w-full sm:w-auto min-w-[200px]">
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold shrink-0">شماره کلاسه:</span>
                <input
                  type="text"
                  value={serialNo}
                  onChange={(e) => setSerialNo(e.target.value)}
                  className={`font-mono text-xs text-left ${editFieldClass}`}
                  dir="ltr"
                />
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold shrink-0">تاریخ صدور:</span>
                <input
                  type="text"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  className={`font-mono text-xs text-left ${editFieldClass}`}
                  dir="ltr"
                />
              </div>
              <div className="text-[10px] text-orange-600 font-bold flex items-center justify-end gap-1 pt-1">
                <ShieldCheck className="w-3 h-3 text-orange-500" />
                <span>دارای تاییدیه دانشکده</span>
              </div>
            </div>
          </div>

          {/* ==================== FACULTY CONTENT ==================== */}
          {type === 'faculty' && (
            <div className="space-y-8">
              {/* Profile Card Summary */}
              <div className="bg-slate-50 border-2 border-slate-900 p-6 flex flex-col md:flex-row gap-6 items-center md:items-start">
                <div className="space-y-2 shrink-0 text-center">
                  <img
                    src={facAvatarUrl}
                    alt={facName}
                    className="w-32 h-32 rounded object-cover border-2 border-slate-900 bg-slate-200 mx-auto"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300';
                    }}
                  />
                  {isEditMode && (
                    <input
                      type="text"
                      value={facAvatarUrl}
                      onChange={(e) => setFacAvatarUrl(e.target.value)}
                      placeholder="لینک آدرس تصویر (URL)"
                      className="text-[10px] font-mono text-slate-500 border border-slate-300 rounded px-1 py-0.5 w-32 no-print"
                    />
                  )}
                </div>

                <div className="space-y-3 flex-1 w-full text-right">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="inline-flex items-center gap-1 bg-slate-900 text-white text-xs font-bold px-2.5 py-1">
                      <input
                        type="text"
                        value={facTitle}
                        onChange={(e) => setFacTitle(e.target.value)}
                        className={`bg-transparent text-white font-bold text-xs text-center ${editFieldClass}`}
                        placeholder="مرتبه علمی (استاد تمام...)"
                      />
                      <span>—</span>
                      <input
                        type="text"
                        value={facField}
                        onChange={(e) => setFacField(e.target.value)}
                        className={`bg-transparent text-white font-bold text-xs text-center ${editFieldClass}`}
                        placeholder="گرایش تخصصی"
                      />
                    </div>
                  </div>

                  <input
                    type="text"
                    value={facName}
                    onChange={(e) => setFacName(e.target.value)}
                    className={`text-2xl sm:text-3xl font-black text-slate-900 ${editFieldClass}`}
                    placeholder="نام و نام خانوادگی استاد"
                  />

                  <textarea
                    rows={2}
                    value={facShortDesc}
                    onChange={(e) => setFacShortDesc(e.target.value)}
                    className={`text-xs sm:text-sm text-slate-700 leading-relaxed ${editFieldClass}`}
                    placeholder="توضیح کوتاه و معرفی..."
                  />
                  
                  <div className="flex items-center gap-1.5 text-xs text-slate-800 font-bold pt-2 border-t border-slate-300">
                    <Building2 className="w-3.5 h-3.5 text-orange-500" />
                    <span>دانشکده مهندسی مکانیک</span>
                  </div>
                </div>
              </div>

              {/* Biography */}
              <div className="space-y-2">
                <h3 className="text-base font-black text-slate-900 border-r-4 border-orange-500 pr-2 flex items-center gap-2">
                  <User className="w-4 h-4 text-orange-500" />
                  بیوگرافی و سوابق علمی
                </h3>
                <textarea
                  rows={4}
                  value={facBio}
                  onChange={(e) => setFacBio(e.target.value)}
                  className={`text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 border border-slate-200 p-4 ${editFieldClass}`}
                  placeholder="متن کامل بیوگرافی و سوابق علمی و اجرایی..."
                />
              </div>

              {/* Skills & Specializations */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-black text-slate-900 border-r-4 border-orange-500 pr-2 flex items-center gap-2">
                    <Award className="w-4 h-4 text-orange-500" />
                    حوزه‌های تخصصی و مهارت‌ها
                  </h3>
                  {isEditMode && (
                    <button
                      onClick={() => setFacSkills([...facSkills, 'مهارت تخصصی جدید'])}
                      className="text-xs bg-orange-500/10 text-orange-600 border border-orange-500/40 hover:bg-orange-500 hover:text-white px-2.5 py-1 rounded font-bold flex items-center gap-1 transition-all no-print"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>افزودن مهارت</span>
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {facSkills.map((skill, idx) => (
                    <div key={idx} className="bg-slate-100 border border-slate-300 text-slate-900 text-xs font-bold px-2.5 py-1 flex items-center gap-1.5">
                      <input
                        type="text"
                        value={skill}
                        onChange={(e) => {
                          const updated = [...facSkills];
                          updated[idx] = e.target.value;
                          setFacSkills(updated);
                        }}
                        className={`bg-transparent text-slate-900 font-bold text-xs ${editFieldClass}`}
                        placeholder="مهارت..."
                      />
                      {isEditMode && (
                        <button
                          onClick={() => setFacSkills(facSkills.filter((_, i) => i !== idx))}
                          className="text-slate-400 hover:text-red-500 p-0.5 no-print"
                          title="حذف این مهارت"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Selected Publications */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-black text-slate-900 border-r-4 border-orange-500 pr-2 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-orange-500" />
                    گزیده مقالات و انتشارات شاخص
                  </h3>
                  {isEditMode && (
                    <button
                      onClick={() => setFacPublications([...facPublications, 'عنوان مقاله پژوهشی یا کتاب جدید، ۲۰۲۶.'])}
                      className="text-xs bg-orange-500/10 text-orange-600 border border-orange-500/40 hover:bg-orange-500 hover:text-white px-2.5 py-1 rounded font-bold flex items-center gap-1 transition-all no-print"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>افزودن مقاله</span>
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  {facPublications.map((pub, idx) => (
                    <div key={idx} className="text-xs font-mono text-slate-800 bg-slate-50 border border-slate-200 p-2.5 flex items-start gap-2">
                      <span className="font-bold text-orange-600 pt-0.5">{idx + 1}.</span>
                      <textarea
                        rows={2}
                        value={pub}
                        onChange={(e) => {
                          const updated = [...facPublications];
                          updated[idx] = e.target.value;
                          setFacPublications(updated);
                        }}
                        className={`flex-1 bg-transparent text-slate-800 font-mono text-xs ${editFieldClass}`}
                        placeholder="متن مقاله..."
                      />
                      {isEditMode && (
                        <button
                          onClick={() => setFacPublications(facPublications.filter((_, i) => i !== idx))}
                          className="text-slate-400 hover:text-red-500 p-1 no-print shrink-0"
                          title="حذف مقاله"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ==================== LAB CONTENT ==================== */}
          {type === 'lab' && (
            <div className="space-y-8">
              {/* Lab Card Summary */}
              <div className="bg-slate-50 border-2 border-slate-900 p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-300 pb-3">
                  <div className="flex items-center gap-2 bg-slate-900 text-white text-xs font-bold px-3 py-1 border-r-2 border-orange-500">
                    <span>آزمایشگاه پژوهشی —</span>
                    <input
                      type="text"
                      value={labField}
                      onChange={(e) => setLabField(e.target.value)}
                      className={`bg-transparent text-white font-bold text-xs ${editFieldClass}`}
                      placeholder="حوزه تخصصی آزمایشگاه"
                    />
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                    <Mail className="w-3.5 h-3.5 text-orange-500" />
                    <input
                      type="text"
                      value={labEmail}
                      onChange={(e) => setLabEmail(e.target.value)}
                      className={`text-slate-700 font-bold text-xs ${editFieldClass}`}
                      placeholder="ایمیل آزمایشگاه"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="space-y-2 shrink-0 w-full md:w-56">
                    <img
                      src={labImageUrl}
                      alt={labName}
                      className="w-full md:w-56 h-36 object-cover border border-slate-300 bg-white rounded"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=400';
                      }}
                    />
                    {isEditMode && (
                      <input
                        type="text"
                        value={labImageUrl}
                        onChange={(e) => setLabImageUrl(e.target.value)}
                        placeholder="آدرس تصویر (URL)"
                        className="text-[10px] font-mono text-slate-500 border border-slate-300 rounded px-1 py-0.5 w-full no-print"
                      />
                    )}
                  </div>

                  <div className="space-y-2 flex-1 w-full">
                    <div className="flex items-center gap-2 text-xs font-bold text-orange-600">
                      <User className="w-4 h-4 shrink-0" />
                      <span>سرپرست علمی آزمایشگاه:</span>
                      <input
                        type="text"
                        value={labSupervisor}
                        onChange={(e) => setLabSupervisor(e.target.value)}
                        className={`text-orange-600 font-bold text-xs ${editFieldClass}`}
                        placeholder="نام سرپرست علمی"
                      />
                    </div>
                    <input
                      type="text"
                      value={labName}
                      onChange={(e) => setLabName(e.target.value)}
                      className={`text-2xl font-black text-slate-900 ${editFieldClass}`}
                      placeholder="نام کامل آزمایشگاه"
                    />
                    <textarea
                      rows={2}
                      value={labShortDesc}
                      onChange={(e) => setLabShortDesc(e.target.value)}
                      className={`text-xs sm:text-sm text-slate-700 leading-relaxed ${editFieldClass}`}
                      placeholder="شرح کوتاه..."
                    />
                  </div>
                </div>
              </div>

              {/* Full Description / Overview */}
              <div className="space-y-2">
                <h3 className="text-base font-black text-slate-900 border-r-4 border-orange-500 pr-2 flex items-center gap-2">
                  <FlaskConical className="w-4 h-4 text-orange-500" />
                  معرفی و حوزه فعالیت تخصصی آزمایشگاه
                </h3>
                <textarea
                  rows={4}
                  value={labFullDesc}
                  onChange={(e) => setLabFullDesc(e.target.value)}
                  className={`text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 border border-slate-200 p-4 ${editFieldClass}`}
                  placeholder="شرح کامل ماموریت‌ها و خدمات تخصصی آزمایشگاه..."
                />
              </div>

              {/* Equipment & Specifications */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-black text-slate-900 border-r-4 border-orange-500 pr-2 flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-orange-500" />
                    تجهیزات، ابزارآلات و زیرساخت‌های آزمایشگاهی
                  </h3>
                  {isEditMode && (
                    <button
                      onClick={() => setLabEquipment([...labEquipment, { name: 'عنوان دستگاه جدید', specs: 'مشخصات فنی و دقت اندازه‌گیری...' }])}
                      className="text-xs bg-orange-500/10 text-orange-600 border border-orange-500/40 hover:bg-orange-500 hover:text-white px-2.5 py-1 rounded font-bold flex items-center gap-1 transition-all no-print"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>افزودن دستگاه</span>
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  {labEquipment.map((eq, idx) => (
                    <div key={idx} className="bg-slate-50 border border-slate-200 p-3 text-xs text-slate-800 space-y-1 relative">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-1">
                          <span className="w-2 h-2 bg-orange-500 rounded-full shrink-0"></span>
                          <input
                            type="text"
                            value={eq.name}
                            onChange={(e) => {
                              const updated = [...labEquipment];
                              updated[idx].name = e.target.value;
                              setLabEquipment(updated);
                            }}
                            className={`font-bold text-slate-900 text-xs ${editFieldClass}`}
                            placeholder="نام دستگاه / تجهیزات"
                          />
                        </div>
                        {isEditMode && (
                          <button
                            onClick={() => setLabEquipment(labEquipment.filter((_, i) => i !== idx))}
                            className="text-slate-400 hover:text-red-500 p-1 no-print shrink-0"
                            title="حذف دستگاه"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      <div className="flex items-center gap-2 pr-4">
                        <span className="text-slate-500 shrink-0 font-bold">مشخصات فنی:</span>
                        <input
                          type="text"
                          value={eq.specs}
                          onChange={(e) => {
                            const updated = [...labEquipment];
                            updated[idx].specs = e.target.value;
                            setLabEquipment(updated);
                          }}
                          className={`text-slate-600 text-xs ${editFieldClass}`}
                          placeholder="مشخصات و قابلیت‌های فنی..."
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Members */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-black text-slate-900 border-r-4 border-orange-500 pr-2 flex items-center gap-2">
                    <User className="w-4 h-4 text-orange-500" />
                    اعضای تیم و پژوهشگران آزمایشگاه
                  </h3>
                  {isEditMode && (
                    <button
                      onClick={() => setLabMembers([...labMembers, 'نام پژوهشگر جدید'])}
                      className="text-xs bg-orange-500/10 text-orange-600 border border-orange-500/40 hover:bg-orange-500 hover:text-white px-2.5 py-1 rounded font-bold flex items-center gap-1 transition-all no-print"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>افزودن عضو</span>
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {labMembers.map((mem, idx) => (
                    <div key={idx} className="bg-slate-100 border border-slate-300 text-slate-900 text-xs font-bold px-2.5 py-1 flex items-center gap-1.5">
                      <input
                        type="text"
                        value={mem}
                        onChange={(e) => {
                          const updated = [...labMembers];
                          updated[idx] = e.target.value;
                          setLabMembers(updated);
                        }}
                        className={`bg-transparent text-slate-900 font-bold text-xs ${editFieldClass}`}
                        placeholder="نام پژوهشگر"
                      />
                      {isEditMode && (
                        <button
                          onClick={() => setLabMembers(labMembers.filter((_, i) => i !== idx))}
                          className="text-slate-400 hover:text-red-500 p-0.5 no-print"
                          title="حذف عضو"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Achievements */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-black text-slate-900 border-r-4 border-orange-500 pr-2 flex items-center gap-2">
                    <Award className="w-4 h-4 text-orange-500" />
                    افتخارات و دستاوردهای علمی و پژوهشی
                  </h3>
                  {isEditMode && (
                    <button
                      onClick={() => setLabAchievements([...labAchievements, 'دستاورد یا افتخار علمی جدید...'])}
                      className="text-xs bg-orange-500/10 text-orange-600 border border-orange-500/40 hover:bg-orange-500 hover:text-white px-2.5 py-1 rounded font-bold flex items-center gap-1 transition-all no-print"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>افزودن افتخار</span>
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  {labAchievements.map((ach, idx) => (
                    <div key={idx} className="bg-slate-50 border border-slate-200 p-2.5 text-xs text-slate-800 font-bold flex items-center gap-2">
                      <span className="w-2 h-2 bg-orange-500 rounded-full shrink-0"></span>
                      <input
                        type="text"
                        value={ach}
                        onChange={(e) => {
                          const updated = [...labAchievements];
                          updated[idx] = e.target.value;
                          setLabAchievements(updated);
                        }}
                        className={`flex-1 bg-transparent text-slate-800 font-bold text-xs ${editFieldClass}`}
                        placeholder="متن افتخار یا دستاورد..."
                      />
                      {isEditMode && (
                        <button
                          onClick={() => setLabAchievements(labAchievements.filter((_, i) => i !== idx))}
                          className="text-slate-400 hover:text-red-500 p-1 no-print shrink-0"
                          title="حذف دستاورد"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ==================== PROJECT CONTENT ==================== */}
          {type === 'project' && (
            <div className="space-y-8">
              {/* Project Card Summary */}
              <div className="bg-slate-50 border-2 border-slate-900 p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-300 pb-3">
                  <div className="flex items-center gap-2 bg-slate-900 text-white text-xs font-bold px-3 py-1 border-r-2 border-orange-500">
                    <span>دسته‌بندی:</span>
                    <input
                      type="text"
                      value={projCategory}
                      onChange={(e) => setProjCategory(e.target.value)}
                      className={`bg-transparent text-white font-bold text-xs ${editFieldClass}`}
                      placeholder="حوزه صنعتی"
                    />
                  </div>
                  <div className="flex items-center gap-3 text-xs font-bold text-slate-700">
                    <div className="flex items-center gap-1">
                      <span>سال اجرا:</span>
                      <input
                        type="text"
                        value={projYear}
                        onChange={(e) => setProjYear(e.target.value)}
                        className={`text-slate-700 font-bold text-xs w-16 text-center ${editFieldClass}`}
                        placeholder="سال"
                      />
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1 text-orange-600 font-bold">
                      <span>وضعیت:</span>
                      <input
                        type="text"
                        value={projStatus}
                        onChange={(e) => setProjStatus(e.target.value)}
                        className={`text-orange-600 font-bold text-xs w-24 text-center ${editFieldClass}`}
                        placeholder="وضعیت"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="space-y-2 shrink-0 w-full md:w-56">
                    <img
                      src={projImageUrl}
                      alt={projTitle}
                      className="w-full md:w-56 h-36 object-cover border border-slate-300 bg-white"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&q=80&w=800';
                      }}
                    />
                    {isEditMode && (
                      <input
                        type="text"
                        value={projImageUrl}
                        onChange={(e) => setProjImageUrl(e.target.value)}
                        placeholder="آدرس تصویر (URL)"
                        className="text-[10px] font-mono text-slate-500 border border-slate-300 rounded px-1 py-0.5 w-full no-print"
                      />
                    )}
                  </div>

                  <div className="space-y-2 flex-1 w-full">
                    <div className="flex items-center gap-2 text-xs font-bold text-orange-600">
                      <Building2 className="w-4 h-4 shrink-0" />
                      <span>طرف قرارداد / کارفرما:</span>
                      <input
                        type="text"
                        value={projCompany}
                        onChange={(e) => setProjCompany(e.target.value)}
                        className={`text-orange-600 font-bold text-xs ${editFieldClass}`}
                        placeholder="نام شرکت کارفرما"
                      />
                    </div>
                    <input
                      type="text"
                      value={projTitle}
                      onChange={(e) => setProjTitle(e.target.value)}
                      className={`text-2xl font-black text-slate-900 ${editFieldClass}`}
                      placeholder="عنوان کامل پروژه"
                    />
                    <textarea
                      rows={2}
                      value={projShortDesc}
                      onChange={(e) => setProjShortDesc(e.target.value)}
                      className={`text-xs sm:text-sm text-slate-700 leading-relaxed ${editFieldClass}`}
                      placeholder="شرح مختصر پروژه..."
                    />
                  </div>
                </div>
              </div>

              {/* Full Description */}
              <div className="space-y-2">
                <h3 className="text-base font-black text-slate-900 border-r-4 border-orange-500 pr-2">
                  تشریح کامل پروژه و اهداف مهندسی
                </h3>
                <textarea
                  rows={4}
                  value={projFullDesc}
                  onChange={(e) => setProjFullDesc(e.target.value)}
                  className={`text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 border border-slate-200 p-4 ${editFieldClass}`}
                  placeholder="تشریح کامل متدولوژی، مراحل انجام و اهداف پروژه..."
                />
              </div>

              {/* Faculty & Lab Execution */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border border-slate-300 p-4 bg-slate-50 space-y-1">
                  <span className="text-[11px] font-bold text-slate-500 block">استاد راهنما / سرپرست پروژه:</span>
                  <input
                    type="text"
                    value={projLeadFac}
                    onChange={(e) => setProjLeadFac(e.target.value)}
                    className={`text-sm font-black text-slate-900 ${editFieldClass}`}
                    placeholder="نام استاد راهنما"
                  />
                </div>
                <div className="border border-slate-300 p-4 bg-slate-50 space-y-1">
                  <span className="text-[11px] font-bold text-slate-500 block">آزمایشگاه تخصصی مجری:</span>
                  <input
                    type="text"
                    value={projLabName}
                    onChange={(e) => setProjLabName(e.target.value)}
                    className={`text-sm font-black text-slate-900 ${editFieldClass}`}
                    placeholder="نام آزمایشگاه مجری"
                  />
                </div>
              </div>

              {/* Outcomes */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-black text-slate-900 border-r-4 border-orange-500 pr-2">
                    نتایج کلیدی و تحویلی‌های پروژه
                  </h3>
                  {isEditMode && (
                    <button
                      onClick={() => setProjOutcomes([...projOutcomes, 'دستاورد یا نتیجه جدید پروژه...'])}
                      className="text-xs bg-orange-500/10 text-orange-600 border border-orange-500/40 hover:bg-orange-500 hover:text-white px-2.5 py-1 rounded font-bold flex items-center gap-1 transition-all no-print"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>افزودن نتیجه</span>
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  {projOutcomes.map((out, idx) => (
                    <div key={idx} className="bg-slate-50 border border-slate-200 p-2.5 text-xs text-slate-800 font-bold flex items-center gap-2">
                      <span className="w-2 h-2 bg-orange-500 rounded-full shrink-0"></span>
                      <input
                        type="text"
                        value={out}
                        onChange={(e) => {
                          const updated = [...projOutcomes];
                          updated[idx] = e.target.value;
                          setProjOutcomes(updated);
                        }}
                        className={`flex-1 bg-transparent text-slate-800 font-bold text-xs ${editFieldClass}`}
                        placeholder="شرح دستاورد..."
                      />
                      {isEditMode && (
                        <button
                          onClick={() => setProjOutcomes(projOutcomes.filter((_, i) => i !== idx))}
                          className="text-slate-400 hover:text-red-500 p-1 no-print shrink-0"
                          title="حذف دستاورد"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Official Footer */}
          <div className="pt-6 border-t-2 border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
            <div className="space-y-1 text-center sm:text-right w-full sm:w-auto">
              <input
                type="text"
                value={footerAddress}
                onChange={(e) => setFooterAddress(e.target.value)}
                className={`font-bold text-slate-900 text-xs ${editFieldClass}`}
                placeholder="آدرس دانشگاه..."
              />
              <input
                type="text"
                value={footerArchive}
                onChange={(e) => setFooterArchive(e.target.value)}
                className={`text-[11px] text-slate-500 ${editFieldClass}`}
                placeholder="یادداشت بایگانی..."
              />
            </div>
            <div className="text-[10px] text-slate-400 font-mono shrink-0">
              Generated by Sharif Industrial Relations Portal
            </div>
          </div>

        </div>

      </div>
    </div>,
    document.body
  );
};
