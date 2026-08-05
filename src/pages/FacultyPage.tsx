import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Users, ArrowLeft } from 'lucide-react';
import { getFaculty } from '../services/storage';

export const FacultyPage: React.FC = () => {
  const navigate = useNavigate();
  const faculty = getFaculty();
  const [selectedField, setSelectedField] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const fields = ['all', ...Array.from(new Set(faculty.map((f) => f.field)))];

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
      <div className="bg-white border-r-8 border-blue-800 p-8 shadow-sm space-y-3">
        <span className="text-amber-600 font-bold text-xs tracking-widest uppercase block">
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
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between border-b border-slate-300 pb-6">
        
        {/* Field Category Filter Tabs */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {fields.map((f) => (
            <button
              key={f}
              onClick={() => setSelectedField(f)}
              className={`px-4 py-2 text-xs font-black transition-all border-2 ${
                selectedField === f
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-700 border-slate-300 hover:border-slate-900'
              }`}
            >
              {f === 'all' ? 'همه اساتید' : f}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجوی نام یا مهارت..."
            className="w-full bg-white border border-slate-300 text-slate-900 text-xs sm:text-sm pr-10 pl-4 py-2.5 focus:outline-none focus:border-blue-800 transition-colors"
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
            className="text-blue-800 hover:underline text-sm font-bold"
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
                  <h2 className="font-black text-lg text-slate-900 group-hover:text-blue-800 transition-colors">
                    {member.name}
                  </h2>
                  <p className="text-blue-700 text-xs font-bold">{member.title}</p>
                  <span className="text-[11px] text-amber-700 font-semibold block mt-0.5">{member.field}</span>
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
