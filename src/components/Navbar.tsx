import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Search, ChevronLeft, ShieldCheck, Zap } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: 'خانه', path: '/' },
    { label: 'آزمایشگاه‌ها', path: '/labs' },
    { label: 'هیئت علمی', path: '/faculty' },
    { label: 'پروژه‌های صنعتی', path: '/projects' },
    { label: 'صنعت و همکاری', path: '/collaboration' },
    { label: 'جستجوی پیشرفته', path: '/search', icon: Search }
  ];

  return (
    <nav className="fixed top-0 right-0 left-0 z-50 bg-[#0F172A] text-white border-b-4 border-amber-600 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <NavLink to="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 bg-white rounded-full flex items-center justify-center font-black text-xl text-[#0F172A] shadow-md group-hover:bg-amber-400 transition-colors">
            S
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-black leading-none tracking-tight uppercase text-white group-hover:text-amber-400 transition-colors">
              دانشکده مهندسی مکانیک
            </h1>
            <p className="text-[10px] text-amber-400 font-medium tracking-widest uppercase mt-0.5">
              دانشگاه صنعتی شریف
            </p>
          </div>
        </NavLink>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-semibold">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`transition-colors flex items-center gap-1.5 relative py-1 ${
                  isActive
                    ? 'text-amber-500 font-bold border-b-2 border-amber-500'
                    : 'text-slate-300 hover:text-amber-400'
                }`}
              >
                {Icon && <Icon className="w-4 h-4 text-amber-500" />}
                {item.label}
              </NavLink>
            );
          })}
        </div>

        {/* Desktop CTA Action */}
        <div className="hidden lg:flex items-center gap-3">
          <NavLink
            to="/collaboration"
            className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-md font-black text-xs sm:text-sm transition-all flex items-center gap-2 shadow-md border border-blue-700"
          >
            <span>شروع همکاری صنعتی</span>
            <ChevronLeft className="w-4 h-4" />
          </NavLink>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="lg:hidden flex items-center gap-2">
          <button
            onClick={() => navigate('/search')}
            className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800"
            aria-label="Search"
          >
            <Search className="w-5 h-5 text-amber-400" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0F172A] border-t border-slate-800 px-4 pt-3 pb-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-md text-base font-semibold transition-colors ${
                  isActive
                    ? 'bg-amber-600 text-slate-900 font-bold'
                    : 'text-slate-200 hover:bg-slate-800 hover:text-amber-400'
                }`}
              >
                {Icon && <Icon className="w-5 h-5 text-amber-400" />}
                <span>{item.label}</span>
              </NavLink>
            );
          })}

          <div className="pt-4 mt-2 border-t border-slate-800">
            <NavLink
              to="/collaboration"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full bg-blue-800 text-white py-3 rounded-md font-black text-center flex items-center justify-center gap-2 shadow-md"
            >
              <span>شروع همکاری صنعتی</span>
              <ChevronLeft className="w-4 h-4" />
            </NavLink>
          </div>
        </div>
      )}
    </nav>
  );
};
