import React from 'react';
import { useParams, useNavigate, NavLink } from 'react-router-dom';
import {
  ArrowRight,
  FlaskConical,
  User,
  Wrench,
  Award,
  Briefcase,
  Mail,
  MapPin,
  ChevronLeft,
  Image as ImageIcon,
  Send
} from 'lucide-react';
import { getLabs, getProjects } from '../services/storage';

export const LabDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const labs = getLabs();
  const lab = labs.find((l) => l.id === id);
  const allProjects = getProjects();

  if (!lab) {
    return (
      <div className="pt-28 min-h-screen text-center max-w-xl mx-auto px-4 space-y-4">
        <h2 className="text-2xl font-bold text-white">آزمایشگاه مورد نظر یافت نشد.</h2>
        <button
          onClick={() => navigate('/labs')}
          className="text-[#E8530D] hover:underline font-semibold text-sm flex items-center justify-center gap-2"
        >
          <ArrowRight className="w-4 h-4" />
          <span>بازگشت به فهرست آزمایشگاه‌ها</span>
        </button>
      </div>
    );
  }

  const labProjects = allProjects.filter((p) => p.labId === lab.id);

  return (
    <div className="pt-24 min-h-screen pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      
      {/* Top Navigation Back Link */}
      <div>
        <button
          onClick={() => navigate('/labs')}
          className="inline-flex items-center gap-2 text-slate-900 hover:bg-slate-900 hover:text-white transition-all text-xs font-black bg-white border-2 border-slate-900 px-4 py-2"
        >
          <ArrowRight className="w-4 h-4" />
          <span>بازگشت به فهرست آزمایشگاه‌ها</span>
        </button>
      </div>

      {/* Lab Hero Header */}
      <div className="bg-white border-r-8 border-blue-800 shadow-sm overflow-hidden">
        <div className="relative h-64 sm:h-80 w-full bg-slate-100">
          <img
            src={lab.imageUrl}
            alt={lab.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/40 to-transparent" />
          
          <div className="absolute bottom-6 right-6 left-6 space-y-2">
            <span className="bg-amber-600 text-slate-900 text-xs font-bold px-3 py-1 uppercase shadow">
              آزمایشگاه پژوهشی — {lab.field}
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-white">
              {lab.name}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-xs sm:text-sm text-slate-300">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-amber-400" />
                {lab.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-amber-400" />
                {lab.contactEmail}
              </span>
            </div>
          </div>
        </div>

        {/* Action Row */}
        <div className="p-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-blue-800" />
            <span className="text-xs sm:text-sm text-slate-600 font-bold">سرپرست علمی آزمایشگاه:</span>
            <NavLink
              to={`/faculty/${lab.supervisorId}`}
              className="text-blue-800 font-black hover:underline transition-colors"
            >
              {lab.supervisorName}
            </NavLink>
          </div>

          <button
            onClick={() => navigate(`/collaboration?targetLab=${encodeURIComponent(lab.name)}`)}
            className="bg-blue-800 hover:bg-blue-900 text-white px-6 py-2.5 text-xs font-black transition-all flex items-center justify-center gap-2 shadow-md"
          >
            <Send className="w-4 h-4" />
            <span>ارسال درخواست پروژه یا خدمات به این آزمایشگاه</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Overview & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Full Description, Equipment, Gallery */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Overview Section */}
          <section className="bg-white border border-slate-200 p-8 shadow-sm space-y-4">
            <h2 className="text-2xl font-black text-slate-900 border-r-4 border-amber-600 pr-3 flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-amber-600" />
              معرفی و حوزه فعالیت تخصصی
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
              {lab.fullDesc}
            </p>
          </section>

          {/* Equipment & Specifications */}
          <section className="bg-white border border-slate-200 p-8 shadow-sm space-y-6">
            <h2 className="text-2xl font-black text-slate-900 border-r-4 border-blue-800 pr-3 flex items-center gap-2">
              <Wrench className="w-5 h-5 text-blue-800" />
              تجهیزات و زیرساخت‌های آزمایشگاهی
            </h2>
            <div className="space-y-4">
              {lab.equipment.map((item, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-200 p-5 space-y-1.5 hover:border-slate-400 transition-colors">
                  <h3 className="text-slate-900 font-black text-base flex items-center gap-2">
                    <span className="w-2 h-2 bg-amber-600" />
                    {item.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 pr-4">
                    مشخصات فنی: {item.specs}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Photo Gallery */}
          {lab.gallery && lab.gallery.length > 0 && (
            <section className="bg-white border border-slate-200 p-8 shadow-sm space-y-6">
              <h2 className="text-2xl font-black text-slate-900 border-r-4 border-amber-600 pr-3 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-amber-600" />
                گالری تصاویر آزمایشگاه و تست‌ها
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {lab.gallery.map((img, idx) => (
                  <div key={idx} className="h-44 border border-slate-200 overflow-hidden bg-slate-100">
                    <img
                      src={img}
                      alt={`Gallery ${idx + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Research Achievements */}
          {lab.achievements && lab.achievements.length > 0 && (
            <section className="bg-white border border-slate-200 p-8 shadow-sm space-y-4">
              <h2 className="text-2xl font-black text-slate-900 border-r-4 border-blue-800 pr-3 flex items-center gap-2">
                <Award className="w-5 h-5 text-blue-800" />
                افتخارات و دستاوردهای علمی
              </h2>
              <ul className="space-y-3">
                {lab.achievements.map((ach, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-600">
                    <span className="text-amber-600 font-bold mt-0.5">•</span>
                    <span>{ach}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

        </div>

        {/* Right Sidebar: Members & Executed Projects */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Members */}
          <div className="bg-white border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="font-black text-xl text-slate-900 border-r-4 border-amber-600 pr-2 flex items-center gap-2">
              <User className="w-4 h-4 text-amber-600" />
              پژوهشگران و اعضای تیم
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
              {lab.members.map((mem, idx) => (
                <li key={idx} className="bg-slate-50 border border-slate-200 px-4 py-2.5">
                  {mem}
                </li>
              ))}
            </ul>
          </div>

          {/* Related Industrial Projects */}
          <div className="bg-white border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="font-black text-xl text-slate-900 border-r-4 border-blue-800 pr-2 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-blue-800" />
              پروژه‌های صنعتی این آزمایشگاه
            </h3>

            {labProjects.length === 0 ? (
              <p className="text-xs text-slate-500">پروژه صنعتی ثبت‌شده مستقیمی برای این آزمایشگاه درج نشده است.</p>
            ) : (
              <div className="space-y-3">
                {labProjects.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => navigate('/projects')}
                    className="bg-slate-50 border border-slate-200 p-4 cursor-pointer hover:border-blue-800 transition-colors space-y-1.5"
                  >
                    <span className="text-[11px] text-amber-700 font-bold">{p.clientCompany}</span>
                    <h4 className="text-slate-900 text-sm font-black leading-snug">{p.title}</h4>
                    <span className="text-[10px] text-slate-500 block">وضعیت: {p.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Direct Contact Box */}
          <div className="bg-[#0F172A] border-t-4 border-amber-600 p-6 text-white shadow-md space-y-4">
            <h3 className="font-black text-lg text-white">ارتباط مستقیم با آزمایشگاه</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              جهت دریافت فرم قیمت‌دهی خدمات، مشاوره فنی یا هماهنگی بازدید حضوری:
            </p>
            <div className="space-y-2 text-xs text-amber-400 font-mono">
              <p>Email: {lab.contactEmail}</p>
              <p>تلفن: ۰۲۱-۶۶۱۶۵۵۰۰ (داخلی ۴۲۰)</p>
            </div>
            <button
              onClick={() => navigate(`/collaboration?targetLab=${encodeURIComponent(lab.name)}`)}
              className="w-full bg-blue-800 hover:bg-blue-900 text-white py-2.5 text-xs font-black transition-all border border-blue-700"
            >
              ثبت درخواست همکاری
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
