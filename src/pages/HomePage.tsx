import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Cpu,
  FlaskConical,
  Users,
  Briefcase,
  ChevronLeft,
  Sparkles,
  ShieldCheck,
  Award,
  CheckCircle2,
  ExternalLink,
  Search
} from 'lucide-react';
import { getLabs, getFaculty, getProjects, getHomeConfig } from '../services/storage';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const labs = getLabs().slice(0, 3);
  const faculty = getFaculty().slice(0, 3);
  const projects = getProjects().slice(0, 3);

  const homeConfig = getHomeConfig();

  // Animated stat counters
  const [labsCount, setLabsCount] = useState(0);
  const [facultyCount, setFacultyCount] = useState(0);
  const [partnersCount, setPartnersCount] = useState(0);
  const [projectsCount, setProjectsCount] = useState(0);

  useEffect(() => {
    const duration = 1500;
    const steps = 30;
    const stepTime = duration / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      setLabsCount(Math.min(homeConfig.labsCount, Math.floor(homeConfig.labsCount * progress)));
      setFacultyCount(Math.min(homeConfig.facultyCount, Math.floor(homeConfig.facultyCount * progress)));
      setPartnersCount(Math.min(homeConfig.partnersCount, Math.floor(homeConfig.partnersCount * progress)));
      setProjectsCount(Math.min(homeConfig.projectsCount, Math.floor(homeConfig.projectsCount * progress)));

      if (currentStep >= steps) clearInterval(timer);
    }, stepTime);

    return () => clearInterval(timer);
  }, [homeConfig.labsCount, homeConfig.facultyCount, homeConfig.partnersCount, homeConfig.projectsCount]);

  return (
    <div className="pt-20 min-h-screen space-y-24 pb-16">
      
      {/* ═══════════ HERO SECTION ═══════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Main Hero Card */}
          <div className="lg:col-span-8 bg-white border-r-8 border-orange-500 p-8 sm:p-12 shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-black text-orange-400 text-xs font-bold uppercase tracking-wide border border-orange-500/30">
                <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                <span>{homeConfig.heroBadge}</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-black text-slate-900 leading-tight tracking-tighter">
                {homeConfig.heroTitleLine1} <br />
                <span className="text-orange-600">{homeConfig.heroTitleLine2}</span>
              </h1>

              <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl italic font-serif">
                {homeConfig.heroDescription}
              </p>
            </div>

            {/* Quick Keyword Pills */}
            {homeConfig.heroKeywords && homeConfig.heroKeywords.length > 0 && (
              <div className="pt-2 border-t border-slate-100">
                <span className="text-xs text-slate-400 block mb-2 font-bold uppercase">حوزه‌های کلیدی پژوهشی و صنعتی:</span>
                <div className="flex flex-wrap gap-2">
                  {homeConfig.heroKeywords.map((kw) => (
                    <button
                      key={kw}
                      onClick={() => navigate(`/search?q=${encodeURIComponent(kw)}`)}
                      className="px-3 py-1 bg-slate-100 border border-slate-200 text-xs text-slate-700 font-medium hover:bg-black hover:text-orange-400 transition-all flex items-center gap-1"
                    >
                      <Search className="w-3 h-3 text-orange-500" />
                      <span>#{kw}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-wrap gap-4">
              <button
                onClick={() => navigate('/collaboration')}
                className="bg-orange-500 hover:bg-orange-600 text-black font-black py-3 px-7 text-sm shadow-lg shadow-orange-500/20 transition-all flex items-center gap-2"
              >
                <span>ارسال درخواست بررسی</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate('/labs')}
                className="border-2 border-black text-black hover:bg-black hover:text-white font-black text-xs py-3 px-6 transition-all"
              >
                مشاهده آزمایشگاه‌ها و تجهیزات ←
              </button>
            </div>
          </div>

          {/* Side Editorial Highlight Box */}
          <div className="lg:col-span-4 bg-white border-t-4 border-orange-500 p-8 shadow-sm flex flex-col justify-between space-y-6">
            <div>
              <span className="text-xs font-bold text-orange-600 uppercase tracking-wider block mb-2">اطلاعات در یک نگاه</span>
              <h3 className="text-2xl font-black text-slate-900 mb-4">{homeConfig.statsTitle}</h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-6">
                {homeConfig.statsDescription}
              </p>
            </div>

            {/* Stats List */}
            <div className="space-y-4 divide-y divide-slate-100">
              <div className="flex justify-between items-center pt-2">
                <span className="text-xs font-bold text-slate-600">آزمایشگاه تخصصی</span>
                <span className="text-3xl font-black text-slate-900">{labsCount}</span>
              </div>
              <div className="flex justify-between items-center pt-3">
                <span className="text-xs font-bold text-slate-600">عضو هیئت علمی</span>
                <span className="text-3xl font-black text-orange-600">{facultyCount}</span>
              </div>
              <div className="flex justify-between items-center pt-3">
                <span className="text-xs font-bold text-slate-600">همکار صنعتی</span>
                <span className="text-3xl font-black text-orange-500">{partnersCount}+</span>
              </div>
              <div className="flex justify-between items-center pt-3">
                <span className="text-xs font-bold text-slate-600">پروژه کلان موفق</span>
                <span className="text-3xl font-black text-slate-900">{projectsCount}+</span>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-4 text-center">
              <span className="text-[11px] font-bold text-slate-500 block">پاسخگویی دفتر ارتباط با صنعت:</span>
              <span className="text-xs font-black text-orange-600">{homeConfig.responseTime}</span>
            </div>
          </div>

        </div>
      </section>

      {/* ═══════════ WHY SHARIF ME ═══════════ */}
      <section className="bg-slate-200/60 py-16 border-y border-slate-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-right max-w-2xl mb-12">
            <span className="text-orange-600 font-bold text-xs tracking-widest uppercase block mb-1">
              {homeConfig.advantagesCategory}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-3">
              {homeConfig.advantagesTitle}
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              {homeConfig.advantagesDescription}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {homeConfig.advantages && homeConfig.advantages.map((adv, idx) => (
              <div key={idx} className="bg-white border-t-4 border-orange-500 p-8 shadow-sm space-y-4">
                <div className="w-12 h-12 bg-black text-orange-500 flex items-center justify-center font-bold">
                  {idx === 0 ? <FlaskConical className="w-6 h-6 text-orange-500" /> : idx === 1 ? <Users className="w-6 h-6 text-orange-500" /> : <Briefcase className="w-6 h-6 text-orange-500" />}
                </div>
                <h3 className="text-xl font-black text-slate-900">{adv.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">
                  {adv.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ HIGHLIGHTED LABS ═══════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-4 border-b border-slate-300">
          <div>
            <span className="text-orange-600 font-bold text-xs tracking-widest uppercase block mb-1">
              زیرساخت پژوهشی
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
              آزمایشگاه‌های پژوهشی دانشکده
            </h2>
          </div>
          <NavLink
            to="/labs"
            className="text-xs font-black py-2 px-4 border-2 border-black hover:bg-black hover:text-white transition-all self-start md:self-auto"
          >
            <span>مشاهده تمامی آزمایشگاه‌ها ←</span>
          </NavLink>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {labs.map((lab) => (
            <div
              key={lab.id}
              onClick={() => navigate(`/labs/${lab.id}`)}
              className="bg-white border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="h-44 overflow-hidden relative mb-4 bg-slate-100 border border-slate-200">
                  <img
                    src={lab.imageUrl}
                    alt={lab.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-2 right-2 bg-orange-500 text-black font-bold px-2 py-0.5 text-[10px]">
                    {lab.field}
                  </span>
                </div>

                <h3 className="font-black text-lg text-slate-900 group-hover:text-orange-600 transition-colors mb-2">
                  {lab.name}
                </h3>
                <p className="text-slate-500 text-xs leading-relaxed mb-4 line-clamp-2">
                  {lab.shortDesc}
                </p>
              </div>

              <button className="mt-auto text-xs font-black py-2 px-4 border-2 border-black group-hover:bg-black group-hover:text-white transition-all text-right flex items-center justify-between">
                <span>درخواست خدمات آزمایشگاهی</span>
                <span>←</span>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════ HIGHLIGHTED FACULTY ═══════════ */}
      <section className="bg-slate-200/60 py-16 border-y border-slate-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-4 border-b border-slate-300">
            <div>
              <span className="text-orange-600 font-bold text-xs tracking-widest uppercase block mb-1">
                نیروی انسانی و اساتید
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
                اعضای هیئت علمی دانشکده
              </h2>
            </div>
            <NavLink
              to="/faculty"
              className="text-xs font-black py-2 px-4 border-2 border-black hover:bg-black hover:text-white transition-all self-start md:self-auto"
            >
              <span>مشاهده تمامی اساتید ←</span>
            </NavLink>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {faculty.map((member) => (
              <div
                key={member.id}
                onClick={() => navigate(`/faculty/${member.id}`)}
                className="bg-white p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col group"
              >
                <div className="flex gap-4 mb-4 items-start">
                  <img
                    src={member.avatarUrl}
                    alt={member.name}
                    className="w-20 h-20 bg-slate-200 rounded object-cover shrink-0 border border-slate-300"
                  />
                  <div>
                    <h3 className="font-black text-lg text-slate-900 group-hover:text-orange-600 transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-orange-600 text-xs font-bold">{member.title}</p>
                    <span className="text-[11px] text-slate-600 font-semibold block mt-0.5">{member.field}</span>
                  </div>
                </div>

                <p className="text-slate-500 text-xs leading-relaxed mb-4 flex-1">
                  {member.shortDesc}
                </p>

                <button className="mt-auto text-xs font-black py-2 px-4 border-2 border-black group-hover:bg-black group-hover:text-white transition-all text-right flex items-center justify-between">
                  <span>مشاهده پروفایل و دستاوردها</span>
                  <span>←</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ FEATURED INDUSTRIAL PROJECTS ═══════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-4 border-b border-slate-300">
          <div>
            <span className="text-orange-600 font-bold text-xs tracking-widest uppercase block mb-1">
              سوابق و دستاوردها
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
              نمونه پروژه‌های صنعتی موفق
            </h2>
          </div>
          <NavLink
            to="/projects"
            className="text-xs font-black py-2 px-4 border-2 border-black hover:bg-black hover:text-white transition-all self-start md:self-auto"
          >
            <span>مشاهده کلیه پروژه‌ها ←</span>
          </NavLink>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {projects.map((proj) => (
            <div
              key={proj.id}
              onClick={() => navigate('/projects')}
              className="bg-white border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="h-44 overflow-hidden relative mb-4 bg-slate-100 border border-slate-200">
                  <img
                    src={proj.imageUrl}
                    alt={proj.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-2 right-2 bg-black text-orange-400 font-bold px-2 py-0.5 text-[10px]">
                    {proj.category}
                  </span>
                </div>
                <span className="text-xs text-orange-600 font-bold block mb-1">
                  کارفرما: {proj.clientCompany}
                </span>
                <h3 className="text-base font-black text-slate-900 group-hover:text-orange-600 transition-colors leading-snug mb-2">
                  {proj.title}
                </h3>
                <p className="text-slate-500 text-xs line-clamp-2">
                  {proj.shortDesc}
                </p>
              </div>
              <div className="pt-3 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>سال: {proj.year}</span>
                <span className="text-orange-600 font-black group-hover:underline">
                  جزئیات فنی پروژه ←
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════ CTA BAND ═══════════ */}
      <section className="bg-black text-white border-t-4 border-orange-500 py-12 px-4 sm:px-6 lg:px-8 shadow-xl">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-right">
          <div className="space-y-2">
            <span className="text-orange-400 font-bold text-xs uppercase tracking-widest">آماده همکاری با صنایع کشور</span>
            <h2 className="text-3xl font-black">
              {homeConfig.ctaTitle}
            </h2>
            <p className="text-slate-300 text-sm max-w-xl">
              {homeConfig.ctaDescription}
            </p>
          </div>
          <button
            onClick={() => navigate('/collaboration')}
            className="bg-orange-500 hover:bg-orange-600 text-black font-black px-8 py-3.5 text-sm shadow-lg shadow-orange-500/20 transition-all shrink-0 border border-orange-400"
          >
            <span>ارسال پروپوزال / درخواست</span>
          </button>
        </div>
      </section>

    </div>
  );
};
