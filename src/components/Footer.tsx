import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { ShieldCheck, Mail, Phone, MapPin, ExternalLink } from 'lucide-react';
import { getFooterConfig } from '../services/storage';

export const Footer: React.FC = () => {
  const [footerConfig, setFooterConfig] = useState(getFooterConfig());

  useEffect(() => {
    // Refresh footer config when component mounts or on custom event if needed
    setFooterConfig(getFooterConfig());
  }, []);

  return (
    <footer className="bg-black border-t-4 border-orange-500 text-slate-300 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center font-black text-lg text-black">
                S
              </div>
              <div>
                <span className="block text-xs text-orange-400 font-medium tracking-wide">دانشگاه صنعتی شریف</span>
                <span className="block font-black text-base text-white">دانشکده مهندسی مکانیک</span>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              {footerConfig.description}
            </p>
          </div>

          {/* Col 2: Fast Navigation */}
          <div>
            <h4 className="font-heading font-black text-white text-base mb-4 border-r-4 border-orange-500 pr-3">
              بخش‌های اصلی
            </h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>
                <NavLink to="/labs" className="hover:text-orange-400 transition-colors">آزمایشگاه‌های پژوهشی</NavLink>
              </li>
              <li>
                <NavLink to="/faculty" className="hover:text-orange-400 transition-colors">اعضای هیئت علمی</NavLink>
              </li>
              <li>
                <NavLink to="/projects" className="hover:text-orange-400 transition-colors">پروژه‌ها و نمونه کارهای صنعتی</NavLink>
              </li>
              <li>
                <NavLink to="/collaboration" className="hover:text-orange-400 transition-colors">فرم درخواست همکاری</NavLink>
              </li>
              <li>
                <NavLink to="/search" className="hover:text-orange-400 transition-colors">موتور جستجوی پیشرفته</NavLink>
              </li>
            </ul>
          </div>

          {/* Col 3: Collaboration Areas */}
          <div>
            <h4 className="font-heading font-black text-white text-base mb-4 border-r-4 border-orange-500 pr-3">
              حوزه‌های تعامل با صنعت
            </h4>
            <ul className="space-y-2 text-sm text-slate-300">
              {footerConfig.collaborationAreas.map((area, idx) => (
                <li key={idx}>{area}</li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact Info */}
          <div>
            <h4 className="font-heading font-black text-white text-base mb-4 border-r-4 border-orange-500 pr-3">
              ارتباط با دفتر پژوهش و صنعت
            </h4>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                <span>{footerConfig.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-orange-500 shrink-0" />
                <span>{footerConfig.phones}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-orange-500 shrink-0" />
                <span>{footerConfig.email}</span>
              </li>
              {footerConfig.sharifLinkUrl && (
                <li>
                  <a
                    href={footerConfig.sharifLinkUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-orange-400 hover:underline pt-1"
                  >
                    <span>{footerConfig.sharifLinkText || 'سایت اصلی دانشگاه شریف'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </li>
              )}
            </ul>
          </div>

        </div>

        {/* Bottom Bar & Hidden Staff Access */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>{footerConfig.copyrightText}</p>
          
          <div className="flex items-center gap-4">
            <NavLink
              to="/admin"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-900 text-slate-300 hover:text-orange-400 hover:bg-slate-800 transition-colors border border-slate-800"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-orange-500" />
              <span>ورود مسئولین (پنل مدیریت)</span>
            </NavLink>
          </div>
        </div>
      </div>
    </footer>
  );
};
