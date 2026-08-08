import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Users, ArrowLeft, GraduationCap } from 'lucide-react';
import { getFaculty, getCustomCategories } from '../services/storage';
import { CategoryDropdownFilter, CategoryOption } from '../components/CategoryDropdownFilter';

export const FacultyPage: React.FC = () => {
  const navigate = useNavigate();
  const faculty = getFaculty();
  const [selectedField, setSelectedField] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const rawFields = Array.from(new Set([...faculty.map((f) => f.field), ...getCustomCategories().faculty])).filter(Boolean);
  const fieldOptions: CategoryOption[] = rawFields.map((field) => ({
    id: field,
    label: field,
  }));

  const filteredFaculty = faculty.filter((member) => {
    const matchesField = selectedField === 'all' || member.field === selectedField;
    const matchesSearch =
      searchQuery === '' ||
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesField && matchesSearch;
  });

  return (
    <div className="pt-24 min-h-screen pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Page Header */}
      <div className="bg-white border-r-8 border-orange-500 p-8 shadow-sm space-y-3">
        <span className="text-orange-600 font-bold text-xs tracking-widest uppercase block">
          نیروی انسانی و پژوهشگران
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900">
          اعضای هیئت علمی دانشکده مهندسی مکانیک
        </h1>
        <p className="text-slate-600 text-sm max-w-3xl leading-relaxed">
          استادان برجسته، دانشیاران و استادیاران دانشکده مهندسی مکانیک دانشگاه صنعتی شریف. جهت مشاهده سوابق علمی، پروژه‌های صنعتی هدایت‌شده و مقالات پژوهشی روی رزومه هر استاد کلیک کنید.
        </p>
      </div>

      {/* Filter Bar & Search Input */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between border-b border-slate-300 pb-6">
        
        {/* Collapsible Category Dropdown Filter */}
        <div className="flex items-center gap-3">
          <CategoryDropdownFilter
            options={fieldOptions}
            selectedId={selectedField}
            onSelect={setSelectedField}
            placeholder="گرایش تخصصی استاد"
            allLabel="همه گرایش‌های تخصصی"
            icon={<GraduationCap className="w-4 h-4" />}
          />
          {selectedField !== 'all' && (
            <span className="hidden sm:inline-block text-xs font-bold text-orange-600 bg-orange-50 border border-orange-200 px-3 py-1.5 rounded-md">
              تعداد اساتید این گرایش: {filteredFaculty.length} نفر
            </span>
          )}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجوی نام یا مهارت..."
            className="w-full bg-white border border-slate-300 rounded-lg text-slate-900 text-xs sm:text-sm pr-10 pl-4 py-2.5 focus:outline-none focus:border-orange-500 transition-colors shadow-sm"
          />
        </div>
      </div>

      {/* Faculty Cards Grid */}
      {filteredFaculty.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-300 space-y-3">
          <Users className="w-12 h-12 text-slate-400 mx-auto opacity-40" />
          <p className="text-slate-600 text-base">استادی با مشخصات مورد نظر یافت نشد.</p>
          <button
            onClick={() => { setSelectedField('all'); setSearchQuery(''); }}
            className="text-orange-600 hover:underline text-sm font-bold"
          >
            پاک کردن فیلترها
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredFaculty.map((member) => (
            <div
              key={member.id}
              onClick={() => navigate(`/faculty/${member.id}`)}
              className="bg-white border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col group"
            >
              <div className="flex gap-4 mb-4 items-start">
                <img
                  src={member.avatarUrl}
                  alt={member.name}
                  className="w-20 h-20 bg-slate-200 rounded object-cover shrink-0 border border-slate-300"
                />
                <div>
                  <h2 className="font-black text-lg text-slate-900 group-hover:text-orange-600 transition-colors">
                    {member.name}
                  </h2>
                  <p className="text-orange-600 text-xs font-bold">{member.title}</p>
                  <span className="text-[11px] text-slate-600 font-semibold block mt-0.5">{member.field}</span>
                </div>
              </div>

              <p className="text-slate-500 text-xs leading-relaxed mb-6 flex-1 line-clamp-3">
                {member.shortDesc}
              </p>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/faculty/${member.id}`);
                }}
                className="mt-auto w-full text-xs font-black py-2.5 px-4 border-2 border-slate-900 group-hover:bg-slate-900 group-hover:text-white transition-all text-center flex items-center justify-between"
              >
                <span>مشاهده رزومه کامل</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
