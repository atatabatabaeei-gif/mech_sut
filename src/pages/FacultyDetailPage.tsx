import React from 'react';
import { useParams, useNavigate, NavLink } from 'react-router-dom';
import {
  ArrowRight,
  User,
  Building2,
  BookOpen,
  Briefcase,
  FlaskConical,
  ChevronLeft,
  Send,
  Award
} from 'lucide-react';
import { getFaculty, getLabs, getProjects } from '../services/storage';

export const FacultyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const facultyList = getFaculty();
  const member = facultyList.find((f) => f.id === id);
  const allLabs = getLabs();
  const allProjects = getProjects();

  if (!member) {
    return (
      <div className="pt-28 min-h-screen text-center max-w-xl mx-auto px-4 space-y-4">
        <h2 className="text-2xl font-bold text-white">استاد مورد نظر یافت نشد.</h2>
        <button
          onClick={() => navigate('/faculty')}
          className="text-[#E8530D] hover:underline font-semibold text-sm flex items-center justify-center gap-2"
        >
          <ArrowRight className="w-4 h-4" />
          <span>بازگشت به فهرست اعضای هیئت علمی</span>
        </button>
      </div>
    );
  }

  const supervisedLabObjects = allLabs.filter((l) => member.supervisedLabs?.includes(l.id));
  const ledProjectObjects = allProjects.filter(
    (p) => p.leadFacultyId === member.id || (member.projectsLed && member.projectsLed.includes(p.id))
  );

  return (
    <div className="pt-24 min-h-screen pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      
      {/* Back Link */}
      <div>
        <button
          onClick={() => navigate('/faculty')}
          className="inline-flex items-center gap-2 text-slate-900 hover:bg-slate-900 hover:text-white transition-all text-xs font-black bg-white border-2 border-slate-900 px-4 py-2"
        >
          <ArrowRight className="w-4 h-4" />
          <span>بازگشت به فهرست اساتید</span>
        </button>
      </div>

      {/* Profile Banner */}
      <div className="bg-white border-r-8 border-orange-500 p-8 sm:p-10 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
          
          <img
            src={member.avatarUrl}
            alt={member.name}
            className="w-36 h-36 sm:w-44 sm:h-44 rounded bg-slate-100 border-2 border-slate-300 object-cover shadow shrink-0"
          />

          <div className="space-y-4 text-center md:text-right flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-black text-orange-400 text-xs font-bold uppercase border border-orange-500/30">
              <span>{member.title}</span>
              <span>•</span>
              <span>{member.field}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-slate-900">
              {member.name}
            </h1>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl">
              {member.shortDesc}
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 pt-2 text-xs sm:text-sm text-slate-600 font-bold">
              <span className="flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-orange-500" />
                دانشکده مهندسی مکانیک
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3 shrink-0 w-full md:w-auto">
            <button
              onClick={() => navigate(`/collaboration?targetFaculty=${encodeURIComponent(member.name)}`)}
              className="bg-orange-500 hover:bg-orange-600 text-black px-6 py-3 text-xs font-black transition-all flex items-center justify-center gap-2 shadow-md"
            >
              <Send className="w-4 h-4" />
              <span>درخواست مشاوره یا تعریف پروژه</span>
            </button>
          </div>

        </div>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Bio, Publications, Skills */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Biography */}
          <section className="bg-white border border-slate-200 p-8 shadow-sm space-y-4">
            <h2 className="text-2xl font-black text-slate-900 border-r-4 border-orange-500 pr-3 flex items-center gap-2">
              <User className="w-5 h-5 text-orange-500" />
              بیوگرافی و سوابق پژوهشی
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
              {member.bio}
            </p>
          </section>

          {/* Specializations & Skills */}
          <section className="bg-white border border-slate-200 p-8 shadow-sm space-y-4">
            <h2 className="text-2xl font-black text-slate-900 border-r-4 border-orange-500 pr-3 flex items-center gap-2">
              <Award className="w-5 h-5 text-orange-500" />
              حوزه‌های تخصصی و مهارت‌های کلیدی
            </h2>
            <div className="flex flex-wrap gap-2 pt-2">
              {member.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="bg-slate-100 border border-slate-300 text-slate-900 text-xs font-bold px-3 py-1.5"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>

          {/* Selected Publications & Books */}
          <section className="bg-white border border-slate-200 p-8 shadow-sm space-y-4">
            <h2 className="text-2xl font-black text-slate-900 border-r-4 border-orange-500 pr-3 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-orange-500" />
              گزیده انتشارات، مقالات و کتاب‌ها
            </h2>
            <div className="space-y-3">
              {member.publications.map((pub, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-200 p-4 text-xs text-slate-700 font-mono leading-relaxed">
                  {pub}
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* Right Sidebar: Supervised Labs & Led Projects */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Supervised Labs */}
          <div className="bg-white border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="font-black text-xl text-slate-900 border-r-4 border-orange-500 pr-2 flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-orange-500" />
              آزمایشگاه‌های تحت سرپرستی
            </h3>

            {supervisedLabObjects.length === 0 ? (
              <p className="text-xs text-slate-500">آزمایشگاه ثبت شده مستقیم یافت نشد.</p>
            ) : (
              <div className="space-y-3">
                {supervisedLabObjects.map((lab) => (
                  <NavLink
                    key={lab.id}
                    to={`/labs/${lab.id}`}
                    className="block bg-slate-50 border border-slate-200 p-4 hover:border-orange-500 transition-colors group"
                  >
                    <span className="text-[11px] text-orange-600 font-bold">{lab.field}</span>
                    <h4 className="text-slate-900 text-sm font-black group-hover:text-orange-600 transition-colors">{lab.name}</h4>
                    <span className="text-[11px] text-slate-500 block mt-1">مشاهده تجهیزات و سوابق ←</span>
                  </NavLink>
                ))}
              </div>
            )}
          </div>

          {/* Industrial Projects Led */}
          <div className="bg-white border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="font-black text-xl text-slate-900 border-r-4 border-orange-500 pr-2 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-orange-500" />
              پروژه‌های صنعتی هدایت‌شده
            </h3>

            {ledProjectObjects.length === 0 ? (
              <p className="text-xs text-slate-500">پروژه‌های صنعتی هدایت‌شده مستقیمی ثبت نشده است.</p>
            ) : (
              <div className="space-y-3">
                {ledProjectObjects.map((proj) => (
                  <div
                    key={proj.id}
                    onClick={() => navigate('/projects')}
                    className="bg-slate-50 border border-slate-200 p-4 cursor-pointer hover:border-orange-500 transition-colors space-y-1"
                  >
                    <span className="text-[11px] text-orange-600 font-bold">{proj.clientCompany}</span>
                    <h4 className="text-slate-900 text-sm font-black leading-snug">{proj.title}</h4>
                    <span className="text-[10px] text-slate-500 block">سال اجرای پروژه: {proj.year}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
