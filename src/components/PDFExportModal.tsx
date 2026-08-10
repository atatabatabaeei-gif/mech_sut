import React from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { Download, Printer, X, ShieldCheck, Lock, ShieldAlert, FileText, Building2, User, Award, BookOpen, MapPin, Phone, Mail, LogIn, FlaskConical, Wrench } from 'lucide-react';
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

  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('fa-IR');
  const serialNo = type === 'faculty' 
    ? `SUT-ME-FAC-${data.id.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`
    : type === 'lab'
    ? `SUT-ME-LAB-${data.id.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`
    : `SUT-ME-PRJ-${data.id.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const member = type === 'faculty' ? (data as FacultyMember) : null;
  const lab = type === 'lab' ? (data as Lab) : null;
  const project = type === 'project' ? (data as IndustrialProject) : null;

  // If NOT ADMIN, display Access Denied / Admin Login Prompt
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
              دانلود شناسنامه فقط برای مدیران ممکن است
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">
              قابلیت استخراج و چاپ فایل PDF شناسنامه اعضای هیئت علمی، آزمایشگاه‌ها و پروژه‌های صنعتی فقط برای کاربران دارای سطح دسترسی مدیریت (Admin) فعال می‌باشد.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-4 text-xs text-slate-700 font-bold space-y-1">
            <div>دانشگاه صنعتی شریف — دانشکده مهندسی مکانیک</div>
            <div className="text-slate-500 font-normal">جهت دانلود شناسنامه و رزومه، لطفاً با حساب کاربری مدیریت وارد شوید.</div>
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

  // IF ADMIN, DISPLAY FULL PRINTABLE DATASHEET
  return createPortal(
    <div className="pdf-export-modal-overlay fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="pdf-export-modal-card bg-white border-2 border-slate-900 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col my-auto relative">
        
        {/* Modal Toolbar (Sticky top) - Hidden during print */}
        <div className="sticky top-0 bg-black text-white p-4 flex items-center justify-between z-20 no-print border-b-2 border-orange-500">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-orange-500" />
            <h3 className="font-bold text-sm sm:text-base">
              پیش‌نمایش سند PDF — {type === 'faculty' ? 'شناسنامه رزومه عضو هیئت علمی' : type === 'lab' ? 'شناسنامه تخصصی آزمایشگاه' : 'شناسنامه پروژه صنعتی'}
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="bg-orange-500 hover:bg-orange-600 text-black font-black px-4 py-2 text-xs flex items-center gap-2 transition-all shadow"
            >
              <Printer className="w-4 h-4" />
              <span>دانلود / چاپ فایل PDF</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1.5 transition-colors"
              title="بستن"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* PRINTABLE DATASHEET CONTENT CONTAINER */}
        <div id="pdf-printable-content" className="p-8 sm:p-12 space-y-8 bg-white text-slate-900 font-['Vazirmatn',sans-serif]">
          
          {/* Header Banner */}
          <div className="border-b-4 border-slate-900 pb-6 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-orange-500 inline-block"></span>
                <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  دانشگاه صنعتی شریف — دانشکده مهندسی مکانیک
                </h4>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                {type === 'faculty' ? 'شناسنامه رسمی و رزومه علمی هیئت علمی' : type === 'lab' ? 'شناسنامه فنی و تجهیزات تخصصی آزمایشگاه' : 'شناسنامه فنی و اجرایی پروژه صنعتی'}
              </h1>
              <p className="text-xs text-slate-500 font-semibold">
                سامانه جامع ارتباط با صنعت و پژوهش‌های تخصصی — شریف
              </p>
            </div>

            {/* Serial & Date box */}
            <div className="text-left font-mono text-xs text-slate-600 border border-slate-300 p-3 bg-slate-50 space-y-1 shrink-0">
              <div><span className="font-bold">شماره کلاسه:</span> {serialNo}</div>
              <div><span className="font-bold">تاریخ صدور:</span> {currentDate}</div>
              <div className="text-[10px] text-orange-600 font-bold flex items-center justify-end gap-1">
                <ShieldCheck className="w-3 h-3 text-orange-500" />
                <span>دارای تاییدیه دانشکده</span>
              </div>
            </div>
          </div>

          {/* FACULTY CONTENT */}
          {type === 'faculty' && member && (
            <div className="space-y-8">
              {/* Profile Card Summary */}
              <div className="bg-slate-50 border-2 border-slate-900 p-6 flex flex-col md:flex-row gap-6 items-center md:items-start">
                <img
                  src={member.avatarUrl}
                  alt={member.name}
                  className="w-32 h-32 rounded object-cover border-2 border-slate-900 shrink-0 bg-slate-200"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300';
                  }}
                />
                <div className="space-y-3 flex-1 text-center md:text-right">
                  <div className="inline-block bg-slate-900 text-white text-xs font-bold px-3 py-1">
                    {member.title} — {member.field}
                  </div>
                  <h2 className="text-3xl font-black text-slate-900">{member.name}</h2>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{member.shortDesc}</p>
                  
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
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 border border-slate-200 p-4">
                  {member.bio}
                </p>
              </div>

              {/* Skills & Specializations */}
              <div className="space-y-2">
                <h3 className="text-base font-black text-slate-900 border-r-4 border-orange-500 pr-2 flex items-center gap-2">
                  <Award className="w-4 h-4 text-orange-500" />
                  حوزه‌های تخصصی و مهارت‌ها
                </h3>
                <div className="flex flex-wrap gap-2">
                  {member.skills.map((skill, idx) => (
                    <span key={idx} className="bg-slate-100 border border-slate-300 text-slate-900 text-xs font-bold px-3 py-1">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Selected Publications */}
              {member.publications.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-base font-black text-slate-900 border-r-4 border-orange-500 pr-2 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-orange-500" />
                    گزیده مقالات و انتشارات شاخص
                  </h3>
                  <div className="space-y-2">
                    {member.publications.map((pub, idx) => (
                      <div key={idx} className="text-xs font-mono text-slate-800 bg-slate-50 border border-slate-200 p-2.5">
                        {idx + 1}. {pub}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* LAB CONTENT */}
          {type === 'lab' && lab && (
            <div className="space-y-8">
              {/* Lab Card Summary */}
              <div className="bg-slate-50 border-2 border-slate-900 p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-300 pb-3">
                  <span className="bg-slate-900 text-white text-xs font-bold px-3 py-1 border-r-2 border-orange-500">
                    آزمایشگاه پژوهشی — {lab.field}
                  </span>
                  <div className="flex items-center gap-3 text-xs font-bold text-slate-700">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-orange-500" />
                      {lab.contactEmail}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <img
                    src={lab.imageUrl}
                    alt={lab.name}
                    className="w-full md:w-56 h-36 object-cover border border-slate-300 shrink-0 bg-white rounded"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=400';
                    }}
                  />
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-orange-600">
                      <User className="w-4 h-4" />
                      <span>سرپرست علمی آزمایشگاه: {lab.supervisorName}</span>
                    </div>
                    <h2 className="text-2xl font-black text-slate-900">{lab.name}</h2>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{lab.shortDesc}</p>
                  </div>
                </div>
              </div>

              {/* Full Description / Overview */}
              <div className="space-y-2">
                <h3 className="text-base font-black text-slate-900 border-r-4 border-orange-500 pr-2 flex items-center gap-2">
                  <FlaskConical className="w-4 h-4 text-orange-500" />
                  معرفی و حوزه فعالیت تخصصی آزمایشگاه
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 border border-slate-200 p-4 whitespace-pre-line">
                  {lab.fullDesc}
                </p>
              </div>

              {/* Equipment & Specifications */}
              {lab.equipment && lab.equipment.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-base font-black text-slate-900 border-r-4 border-orange-500 pr-2 flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-orange-500" />
                    تجهیزات، ابزارآلات و زیرساخت‌های آزمایشگاهی
                  </h3>
                  <div className="space-y-2">
                    {lab.equipment.map((eq, idx) => (
                      <div key={idx} className="bg-slate-50 border border-slate-200 p-3 text-xs text-slate-800 space-y-1">
                        <div className="font-bold text-slate-900 flex items-center gap-2">
                          <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                          <span>{eq.name}</span>
                        </div>
                        <p className="text-slate-600 pr-4">مشخصات فنی: {eq.specs}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Members */}
              {lab.members && lab.members.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-base font-black text-slate-900 border-r-4 border-orange-500 pr-2 flex items-center gap-2">
                    <User className="w-4 h-4 text-orange-500" />
                    اعضای تیم و پژوهشگران آزمایشگاه
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {lab.members.map((mem, idx) => (
                      <span key={idx} className="bg-slate-100 border border-slate-300 text-slate-900 text-xs font-bold px-3 py-1">
                        {mem}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Achievements */}
              {lab.achievements && lab.achievements.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-base font-black text-slate-900 border-r-4 border-orange-500 pr-2 flex items-center gap-2">
                    <Award className="w-4 h-4 text-orange-500" />
                    افتخارات و دستاوردهای علمی و پژوهشی
                  </h3>
                  <ul className="space-y-2">
                    {lab.achievements.map((ach, idx) => (
                      <li key={idx} className="bg-slate-50 border border-slate-200 p-3 text-xs text-slate-800 font-bold flex items-center gap-2">
                        <span className="w-2 h-2 bg-orange-500 rounded-full shrink-0"></span>
                        <span>{ach}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* PROJECT CONTENT */}
          {type === 'project' && project && (
            <div className="space-y-8">
              {/* Project Card Summary */}
              <div className="bg-slate-50 border-2 border-slate-900 p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-300 pb-3">
                  <span className="bg-slate-900 text-white text-xs font-bold px-3 py-1 border-r-2 border-orange-500">
                    دسته‌بندی: {project.category}
                  </span>
                  <div className="flex items-center gap-3 text-xs font-bold text-slate-700">
                    <span>سال اجرای پروژه: {project.year}</span>
                    <span>•</span>
                    <span className="text-orange-600 font-bold">وضعیت: {project.status}</span>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full md:w-56 h-36 object-cover border border-slate-300 shrink-0 bg-white"
                  />
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-orange-600">
                      <Building2 className="w-4 h-4" />
                      <span>طرف قرارداد / کارفرما: {project.clientCompany}</span>
                    </div>
                    <h2 className="text-2xl font-black text-slate-900">{project.title}</h2>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{project.shortDesc}</p>
                  </div>
                </div>
              </div>

              {/* Full Description */}
              <div className="space-y-2">
                <h3 className="text-base font-black text-slate-900 border-r-4 border-orange-500 pr-2">
                  تشریح کامل پروژه و اهداف مهندسی
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 border border-slate-200 p-4">
                  {project.fullDesc}
                </p>
              </div>

              {/* Faculty & Lab Execution */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border border-slate-300 p-4 bg-slate-50 space-y-1">
                  <span className="text-[11px] font-bold text-slate-500 block">استاد راهنما / سرپرست پروژه:</span>
                  <span className="text-sm font-black text-slate-900">{project.leadFacultyName || 'نامشخص'}</span>
                </div>
                <div className="border border-slate-300 p-4 bg-slate-50 space-y-1">
                  <span className="text-[11px] font-bold text-slate-500 block">آزمایشگاه تخصصی مجری:</span>
                  <span className="text-sm font-black text-slate-900">{project.labName || 'نامشخص'}</span>
                </div>
              </div>

              {/* Outcomes */}
              {project.outcomes && project.outcomes.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-base font-black text-slate-900 border-r-4 border-orange-500 pr-2">
                    نتایج کلیدی و تحویلی‌های پروژه
                  </h3>
                  <ul className="space-y-2">
                    {project.outcomes.map((out, idx) => (
                      <li key={idx} className="bg-slate-50 border border-slate-200 p-3 text-xs text-slate-800 font-bold flex items-center gap-2">
                        <span className="w-2 h-2 bg-orange-500 rounded-full shrink-0"></span>
                        <span>{out}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Official Footer */}
          <div className="pt-8 border-t-2 border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
            <div className="space-y-1 text-center sm:text-right">
              <p className="font-bold text-slate-900">دانشگاه صنعتی شریف — خیابان آزادی، تهران، ایران</p>
              <p className="text-[11px] text-slate-500">بایگانی دیجیتال دانشکده مهندسی مکانیک</p>
            </div>
          </div>

        </div>

      </div>
    </div>,
    document.body
  );
};
