import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, NavLink } from 'react-router-dom';
import {
  Search,
  Sparkles,
  Users,
  FlaskConical,
  Briefcase,
  ChevronLeft,
  Tag,
  Wrench,
  CheckCircle2
} from 'lucide-react';
import { getFaculty, getLabs, getProjects } from '../services/storage';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);

  const faculty = getFaculty();
  const labs = getLabs();
  const projects = getProjects();

  const sampleKeywords = [
    'دینامیک خودرو',
    'نانو سیالات',
    'تست غیرمخرب',
    'ساخت و تولید',
    'CFD',
    'رباتیک',
    'احتراق',
    'توربولانس',
    'کامپوزیت',
    'سیست م تعلیق'
  ];

  // Auto update URL on search change
  const handleQueryChange = (val: string) => {
    setQuery(val);
    if (val.trim()) {
      setSearchParams({ q: val });
    } else {
      setSearchParams({});
    }
  };

  const cleanQuery = query.trim().toLowerCase();

  // Search Logic
  const matchingFaculty = cleanQuery
    ? faculty.filter((f) => {
        return (
          f.name.toLowerCase().includes(cleanQuery) ||
          f.field.toLowerCase().includes(cleanQuery) ||
          f.shortDesc.toLowerCase().includes(cleanQuery) ||
          f.bio.toLowerCase().includes(cleanQuery) ||
          f.skills.some((s) => s.toLowerCase().includes(cleanQuery))
        );
      })
    : [];

  const matchingLabs = cleanQuery
    ? labs.filter((l) => {
        return (
          l.name.toLowerCase().includes(cleanQuery) ||
          l.field.toLowerCase().includes(cleanQuery) ||
          l.shortDesc.toLowerCase().includes(cleanQuery) ||
          l.fullDesc.toLowerCase().includes(cleanQuery) ||
          l.equipment.some((eq) => eq.name.toLowerCase().includes(cleanQuery) || eq.specs.toLowerCase().includes(cleanQuery))
        );
      })
    : [];

  const matchingProjects = cleanQuery
    ? projects.filter((p) => {
        return (
          p.title.toLowerCase().includes(cleanQuery) ||
          p.category.toLowerCase().includes(cleanQuery) ||
          p.clientCompany.toLowerCase().includes(cleanQuery) ||
          p.shortDesc.toLowerCase().includes(cleanQuery) ||
          p.fullDesc.toLowerCase().includes(cleanQuery)
        );
      })
    : [];

  const totalResults = matchingFaculty.length + matchingLabs.length + matchingProjects.length;

  return (
    <div className="pt-24 min-h-screen pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      
      {/* Header */}
      <div className="bg-white border-r-8 border-orange-500 p-8 shadow-sm space-y-3">
        <div className="inline-flex items-center gap-2 bg-black text-orange-400 border border-orange-500/30 text-xs font-bold px-3 py-1">
          <Sparkles className="w-3.5 h-3.5 text-orange-500" />
          <span>سیستم جستجوی پیشرفته</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900">
          موتور جستجوی پیشرفته اساتید، آزمایشگاه‌ها و پروژه‌ها
        </h1>
        <p className="text-slate-600 text-sm max-w-3xl leading-relaxed">
          کلمه کلیدی یا حوزه صنعتی مد نظر خود (نظیر CFD، تست غیرمخرب NDT، رباتیک، دینامیک خودرو یا نانوسیالات) را وارد کنید تا سیستم به‌طور خودکار ظرفیت‌ها را استخراج کند.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="bg-white border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="relative">
          <Search className="w-6 h-6 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder="کلمه کلیدی مورد نظر را تایپ کنید (مثلاً: نانو سیالات، CFD، تست غیرمخرب)..."
            className="w-full bg-white border-2 border-slate-300 text-slate-900 text-base sm:text-lg pr-14 pl-6 py-4 focus:outline-none focus:border-orange-500 transition-colors"
          />
        </div>

        {/* Preset Keywords */}
        <div className="space-y-2">
          <span className="text-xs text-slate-600 font-bold block">کلمات کلیدی پیشنهادی برای جستجوی سریع:</span>
          <div className="flex flex-wrap gap-2">
            {sampleKeywords.map((kw) => (
              <button
                key={kw}
                onClick={() => handleQueryChange(kw)}
                className={`px-3 py-1 text-xs font-bold transition-all border ${
                  query === kw
                    ? 'bg-black text-orange-400 border-black'
                    : 'bg-slate-100 text-slate-700 border-slate-300 hover:border-black'
                }`}
              >
                #{kw}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Content */}
      {!cleanQuery ? (
        <div className="text-center py-16 bg-white border border-slate-200 space-y-4 shadow-sm">
          <Search className="w-12 h-12 text-slate-400 mx-auto opacity-30" />
          <h3 className="text-lg font-black text-slate-900">جستجوی پیشرفته آماده دریافت کلیدواژه شماست</h3>
          <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
            لطفاً یک کلیدواژه در کادر بالا وارد کرده یا از تگ‌های پیشنهادی فوق استفاده نمایید تا پیشنهادهای تخصصی نمایش داده شوند.
          </p>
        </div>
      ) : totalResults === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-200 space-y-4 shadow-sm">
          <Search className="w-12 h-12 text-red-500 mx-auto opacity-50" />
          <h3 className="text-xl font-black text-slate-900">نتیجه‌ای با عبارت «{query}» یافت نشد</h3>
          <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
            می‌توانید کلمات کلیدی عام‌تر یا مترادف‌های علمی (مانند سیالات، رباتیک، خودرو، مواد) را امتحان فرمایید.
          </p>
        </div>
      ) : (
        <div className="space-y-12">
          
          <div className="flex items-center justify-between border-b border-slate-300 pb-4 text-sm text-slate-600 font-bold">
            <span>یافته‌های مرتبط با عبارت «<strong className="text-slate-900">{query}</strong>»:</span>
            <span className="bg-orange-500 text-black text-xs font-black px-3 py-1">
              مجموع {totalResults} پیشنهاد
            </span>
          </div>

          {/* 1. MATCHING FACULTY MEMBERS */}
          {matchingFaculty.length > 0 && (
            <section className="space-y-6">
              <h2 className="text-2xl font-black text-slate-900 border-r-4 border-orange-500 pr-3 flex items-center gap-2">
                <Users className="w-5 h-5 text-orange-600" />
                اساتید و اعضای هیئت علمی مرتبط ({matchingFaculty.length})
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {matchingFaculty.map((member) => (
                  <div
                    key={member.id}
                    onClick={() => navigate(`/faculty/${member.id}`)}
                    className="bg-white border border-slate-200 p-6 cursor-pointer hover:border-black transition-all space-y-4 group shadow-sm"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={member.avatarUrl}
                        alt={member.name}
                        className="w-16 h-16 object-cover border-2 border-slate-900"
                      />
                      <div>
                        <h3 className="text-lg font-black text-slate-900 group-hover:text-orange-600 transition-colors">
                          {member.name}
                        </h3>
                        <span className="text-xs text-orange-600 font-bold block">{member.title}</span>
                        <span className="text-[11px] text-slate-500 font-bold block">{member.field}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {member.shortDesc}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {member.skills.slice(0, 3).map((s, idx) => (
                        <span key={idx} className="bg-slate-100 border border-slate-300 text-[10px] text-slate-900 font-bold px-2 py-0.5">
                          {s}
                        </span>
                      ))}
                    </div>

                    <div className="pt-3 border-t border-slate-200 flex justify-between items-center text-xs text-orange-600 font-black">
                      <span>مشاهده صفحه اختصاصی</span>
                      <ChevronLeft className="w-4 h-4" />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 2. MATCHING LABS */}
          {matchingLabs.length > 0 && (
            <section className="space-y-6">
              <h2 className="text-2xl font-black text-slate-900 border-r-4 border-orange-500 pr-3 flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-orange-600" />
                آزمایشگاه‌ها و تجهیزات دارای پتانسیل ({matchingLabs.length})
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {matchingLabs.map((lab) => (
                  <div
                    key={lab.id}
                    onClick={() => navigate(`/labs/${lab.id}`)}
                    className="bg-white border border-slate-200 p-6 cursor-pointer hover:border-black transition-all space-y-4 group flex flex-col justify-between shadow-sm"
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <span className="bg-black text-white text-xs px-3 py-1 font-bold">
                          آزمایشگاه: {lab.field}
                        </span>
                        <span className="text-xs text-slate-600 font-bold">سرپرست: {lab.supervisorName}</span>
                      </div>

                      <h3 className="text-xl font-black text-slate-900 group-hover:text-orange-600 transition-colors">
                        {lab.name}
                      </h3>

                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                        {lab.shortDesc}
                      </p>

                      {/* Matching Equipment */}
                      {lab.equipment.length > 0 && (
                        <div className="bg-slate-50 p-3 border border-slate-200 space-y-1">
                          <span className="text-[11px] text-orange-600 font-bold flex items-center gap-1">
                            <Wrench className="w-3 h-3" /> تجهیزات کلیدی مرتبط:
                          </span>
                          <span className="text-xs text-slate-900 font-bold block">
                            {lab.equipment[0].name} ({lab.equipment[0].specs})
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-200 flex justify-between items-center text-xs text-orange-600 font-black">
                      <span>مشاهده تجهیزات و جزئیات</span>
                      <ChevronLeft className="w-4 h-4" />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 3. MATCHING INDUSTRIAL PROJECTS */}
          {matchingProjects.length > 0 && (
            <section className="space-y-6">
              <h2 className="text-2xl font-black text-slate-900 border-r-4 border-orange-500 pr-3 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-orange-600" />
                پروژه‌های صنعتی قبلی مرتبط ({matchingProjects.length})
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {matchingProjects.map((proj) => (
                  <div
                    key={proj.id}
                    onClick={() => navigate('/projects')}
                    className="bg-white border border-slate-200 p-6 cursor-pointer hover:border-black transition-all space-y-3 group shadow-sm"
                  >
                    <span className="text-xs text-orange-600 font-bold block">کارفرما: {proj.clientCompany}</span>
                    <h3 className="text-base font-black text-slate-900 group-hover:text-orange-600 transition-colors leading-snug">
                      {proj.title}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2">
                      {proj.shortDesc}
                    </p>
                    <div className="pt-2 flex justify-between items-center text-xs text-slate-500 font-bold">
                      <span>دسته‌بندی: {proj.category}</span>
                      <span className="text-orange-600 font-black">جزئیات پروژه ←</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

        </div>
      )}

    </div>
  );
};
