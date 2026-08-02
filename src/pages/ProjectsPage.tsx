import React, { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { Search, Briefcase, CheckCircle2, ChevronLeft, Building2, Send } from 'lucide-react';
import { getProjects } from '../services/storage';

export const ProjectsPage: React.FC = () => {
  const navigate = useNavigate();
  const projects = getProjects();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['all', ...Array.from(new Set(projects.map((p) => p.category)))];

  const filteredProjects = projects.filter((p) => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.clientCompany.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.shortDesc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="pt-24 min-h-screen pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Page Header */}
      <div className="bg-white border-r-8 border-blue-800 p-8 shadow-sm space-y-3">
        <span className="text-amber-600 font-bold text-xs tracking-widest uppercase block">
          سوابق و اعتمادسازی صنعتی
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900">
          پروژه‌های موفق و نمونه کارهای صنعتی
        </h1>
        <p className="text-slate-600 text-sm max-w-3xl leading-relaxed">
          نمایش دستاوردهای کلان مهندسی، بومی‌سازی تجهیزات و تحقیقات قراردادی انجام‌شده توسط استادان و آزمایشگاه‌های تخصصی دانشکده مهندسی مکانیک شریف با صنایع پیشرو کشور.
        </p>
      </div>

      {/* Filter Bar & Search Input */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between border-b border-slate-300 pb-6">
        
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-xs font-black transition-all border-2 ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-700 border-slate-300 hover:border-slate-900'
              }`}
            >
              {cat === 'all' ? 'همه پروژه‌ها' : cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجوی نام پروژه یا شرکت..."
            className="w-full bg-white border border-slate-300 text-slate-900 text-xs sm:text-sm pr-10 pl-4 py-2.5 focus:outline-none focus:border-blue-800 transition-colors"
          />
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-300 space-y-3">
          <Briefcase className="w-12 h-12 text-slate-400 mx-auto opacity-40" />
          <p className="text-slate-600 text-base">پروژه‌ای مطابق با فیلترهای انتخابی پیدا نشد.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all grid grid-cols-1 lg:grid-cols-12 gap-6"
            >
              {/* Image */}
              <div className="lg:col-span-5 relative min-h-[240px] lg:min-h-full border border-slate-200 bg-slate-100 overflow-hidden">
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 flex items-center gap-2">
                  <span className="bg-slate-900 text-white text-[10px] font-bold px-2.5 py-1 uppercase shadow">
                    {project.category}
                  </span>
                  <span className={`text-[10px] font-bold px-2.5 py-1 ${
                    project.status === 'تکمیل‌شده'
                      ? 'bg-emerald-700 text-white'
                      : 'bg-amber-600 text-slate-900'
                  }`}>
                    {project.status}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="lg:col-span-7 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-amber-700 text-xs font-bold">
                    <Building2 className="w-4 h-4" />
                    <span>کارفرما / شریک صنعتی: {project.clientCompany}</span>
                    <span className="text-slate-500 font-mono text-xs mr-auto">سال: {project.year}</span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-snug">
                    {project.title}
                  </h2>

                  <p className="text-slate-600 text-sm leading-relaxed">
                    {project.fullDesc}
                  </p>

                  {/* Responsible Lab & Faculty link */}
                  <div className="flex flex-wrap items-center gap-4 text-xs pt-2 text-slate-600 font-bold">
                    {project.labName && project.labId && (
                      <NavLink
                        to={`/labs/${project.labId}`}
                        className="bg-slate-100 border border-slate-300 px-3 py-1.5 hover:border-slate-900 hover:text-slate-900 transition-colors"
                      >
                        آزمایشگاه مجری: <span className="text-blue-800 font-black">{project.labName}</span>
                      </NavLink>
                    )}
                    {project.leadFacultyName && project.leadFacultyId && (
                      <NavLink
                        to={`/faculty/${project.leadFacultyId}`}
                        className="bg-slate-100 border border-slate-300 px-3 py-1.5 hover:border-slate-900 hover:text-slate-900 transition-colors"
                      >
                        استاد راهنما: <span className="text-blue-800 font-black">{project.leadFacultyName}</span>
                      </NavLink>
                    )}
                  </div>

                  {/* Key Outcomes */}
                  {project.outcomes && project.outcomes.length > 0 && (
                    <div className="pt-2 space-y-2">
                      <span className="text-xs font-black text-slate-900 block">نتایج کلیدی و دستاوردهای حاصله:</span>
                      <ul className="space-y-1.5">
                        {project.outcomes.map((out, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-800 shrink-0 mt-0.5" />
                            <span>{out}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Bottom CTA */}
                <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                  <button
                    onClick={() => navigate(`/collaboration?field=${encodeURIComponent(project.category)}`)}
                    className="bg-blue-800 hover:bg-blue-900 text-white px-5 py-2.5 text-xs font-black transition-all flex items-center gap-2 shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>تعریف پروژه مشابه یا مشاوره</span>
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
