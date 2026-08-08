import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, FlaskConical, ChevronLeft, ArrowRight } from 'lucide-react';
import { getLabs, getCustomCategories } from '../services/storage';
import { CategoryDropdownFilter, CategoryOption } from '../components/CategoryDropdownFilter';

export const LabsPage: React.FC = () => {
  const navigate = useNavigate();
  const labs = getLabs();
  const [selectedField, setSelectedField] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const rawFields = Array.from(new Set([...labs.map((l) => l.field), ...getCustomCategories().labs])).filter(Boolean);
  const fieldOptions: CategoryOption[] = rawFields.map((field) => ({
    id: field,
    label: field,
  }));

  const filteredLabs = labs.filter((lab) => {
    const matchesField = selectedField === 'all' || lab.field === selectedField;
    const matchesSearch =
      searchQuery === '' ||
      lab.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lab.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lab.field.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesField && matchesSearch;
  });

  return (
    <div className="pt-24 min-h-screen pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Page Header */}
      <div className="bg-white border-r-8 border-orange-500 p-8 shadow-sm space-y-3">
        <span className="text-orange-600 font-bold text-xs tracking-widest uppercase block">
          زیرساخت‌های پژوهشی
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900">
          آزمایشگاه‌های پژوهشی و صنعتی
        </h1>
        <p className="text-slate-600 text-sm max-w-3xl leading-relaxed">
          آزمایشگاه‌های تخصصی دانشکده مهندسی مکانیک دانشگاه صنعتی شریف مجهز به پیشرفته‌ترین تجهیزات تست، شبیه‌سازی عددی، رباتیک و متالورژی صنعتی. جهت مشاهده سوابق، تجهیزات و اعضا روی هر آزمایشگاه کلیک کنید.
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
            placeholder="حوزه تخصصی آزمایشگاه"
            allLabel="همه آزمایشگاه‌ها"
            icon={<FlaskConical className="w-4 h-4" />}
          />
          {selectedField !== 'all' && (
            <span className="hidden sm:inline-block text-xs font-bold text-orange-600 bg-orange-50 border border-orange-200 px-3 py-1.5 rounded-md">
              تعداد آزمایشگاه‌ها: {filteredLabs.length} واحد
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
            placeholder="جستجوی نام یا تجهیزات..."
            className="w-full bg-white border border-slate-300 rounded-lg text-slate-900 text-xs sm:text-sm pr-10 pl-4 py-2.5 focus:outline-none focus:border-orange-500 transition-colors shadow-sm"
          />
        </div>
      </div>

      {/* Lab Cards Grid */}
      {filteredLabs.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-300 space-y-3">
          <FlaskConical className="w-12 h-12 text-slate-400 mx-auto opacity-40" />
          <p className="text-slate-600 text-base">آزمایشگاهی با مشخصات مورد نظر شما یافت نشد.</p>
          <button
            onClick={() => { setSelectedField('all'); setSearchQuery(''); }}
            className="text-orange-600 hover:underline text-sm font-bold"
          >
            پاک کردن فیلترها
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredLabs.map((lab) => (
            <div
              key={lab.id}
              onClick={() => navigate(`/labs/${lab.id}`)}
              className="bg-white border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="h-52 overflow-hidden relative mb-4 bg-slate-100 border border-slate-200">
                  <img
                    src={lab.imageUrl}
                    alt={lab.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-2 right-2 bg-orange-500 text-black font-bold px-2 py-0.5 text-[10px]">
                    {lab.field}
                  </span>
                </div>

                <h2 className="text-xl font-black text-slate-900 group-hover:text-orange-600 transition-colors mb-2">
                  {lab.name}
                </h2>
                <p className="text-slate-500 text-xs line-clamp-3 leading-relaxed mb-4">
                  {lab.shortDesc}
                </p>
              </div>

              <button className="mt-auto text-xs font-black py-2.5 px-4 border-2 border-black group-hover:bg-black group-hover:text-white transition-all text-right flex items-center justify-between">
                <span>صفحه اختصاصی آزمایشگاه</span>
                <span>←</span>
              </button>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
