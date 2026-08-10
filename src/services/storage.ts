import { Lab, FacultyMember, IndustrialProject, CollaborationRequest, SecurityAuditLog, AdminState, FooterConfig, CollaborationPageConfig, HomePageConfig } from '../types';
import { INITIAL_LABS, INITIAL_FACULTY, INITIAL_PROJECTS, INITIAL_REQUESTS } from '../data/initialData';

const KEYS = {
  LABS: 'sharif_me_labs_v3',
  FACULTY: 'sharif_me_faculty_v5',
  PROJECTS: 'sharif_me_projects_v3',
  REQUESTS: 'sharif_me_requests_v2',
  LOGS: 'sharif_me_audit_logs',
  ADMIN_STATE: 'sharif_me_admin_state',
  FOOTER: 'sharif_me_footer_config',
  COLLABORATION: 'sharif_me_collaboration_config_v1',
  HOME: 'sharif_me_home_config_v1'
};

export const DEFAULT_HOME_CONFIG: HomePageConfig = {
  heroBadge: 'دانشگاه صنعتی شریف — دانشکده مهندسی مکانیک',
  heroTitleLine1: 'قطب علمی طراحی،',
  heroTitleLine2: 'دینامیک و ارتعاشات',
  heroDescription: 'مرجع تخصصی همکاری‌های استراتژیک بین دانش و صنعت در حوزه‌های نوین مهندسی مکانیک. ما پژوهش را به تأثیر تبدیل می‌کنیم — با مشارکت صنعت برای حل پیچیده‌ترین چالش‌های مهندسی کشور.',
  heroKeywords: ['دینامیک سیالات CFD', 'رباتیک صنعتی', 'تست‌های غیرمخرب NDT', 'دینامیک خودرو', 'نانوسیالات', 'احتراق و انرژی'],
  statsTitle: 'شاخص‌های کلیدی دانشکده',
  statsDescription: 'پلی مستحکم بین مراکز تحقیقاتی دانشکده مهندسی مکانیک شریف و بیش از ۱۲۰ شرکت صنعتی مادر در سراسر کشور.',
  labsCount: 34,
  facultyCount: 58,
  partnersCount: 120,
  projectsCount: 45,
  responseTime: 'حداکثر ۲ روز کاری',
  advantagesCategory: 'مزایای رقابتی',
  advantagesTitle: 'پلی مستحکم میان دانشگاه و صنایع کلیدی کشور',
  advantagesDescription: 'دانشکده مهندسی مکانیک دانشگاه صنعتی شریف با بهره‌گیری از زیرساخت‌های آزمایشگاهی پیشرفته و دانش استادان برجسته، آماده ارائه راهکارهای علمی و عملی به صنایع کشور است.',
  advantages: [
    {
      title: 'زیرساخت پیشرفته آزمایشگاهی',
      description: 'بیش از ۳۰ آزمایشگاه مجهز به دستگاه‌های پرینتر سه‌بعدی فلزی، خوشه‌های ابرمحاسباتی CFD، سیستم‌های تست غیرمخرب (NDT) و تونل باد.'
    },
    {
      title: 'اعضای هیئت علمی بین‌المللی',
      description: 'استادان برجسته با سوابق درخشان پژوهشی، مجریان پروژه‌های کلان ملی و نویسندگان صدها مقاله معتبر علمی در ژورنال‌های بین‌المللی.'
    },
    {
      title: 'سابقه درخشان در صنعت',
      description: 'همکاری مستمر با بزرگترین شرکتهای صنعتی در حوزه‌های خودروسازی، نفت و گاز، پتروشیمی، هوافضا، نیروگاه و قطعه‌سازی.'
    }
  ],
  ctaTitle: 'آماده‌اید پروژه صنعتی خود را کلید بزنید؟',
  ctaDescription: 'فرم آنلاین درخواست همکاری را پر کنید تا کارشناسان دفتر پژوهش و صنعت دانشکده ظرف حداکثر ۲ روز کاری با شما تماس بگیرند.'
};

export const getHomeConfig = (): HomePageConfig => {
  try {
    const data = localStorage.getItem(KEYS.HOME);
    if (!data) {
      localStorage.setItem(KEYS.HOME, JSON.stringify(DEFAULT_HOME_CONFIG));
      return DEFAULT_HOME_CONFIG;
    }
    return JSON.parse(data);
  } catch {
    return DEFAULT_HOME_CONFIG;
  }
};

export const saveHomeConfig = (config: HomePageConfig): void => {
  localStorage.setItem(KEYS.HOME, JSON.stringify(config));
};

export const DEFAULT_COLLABORATION_CONFIG: CollaborationPageConfig = {
  headerCategory: 'ارتباط صنعت و دانشگاه',
  headerTitle: 'بخش صنعت و فرآیند تعامل و همکاری',
  headerDescription: 'دانشکده مهندسی مکانیک دانشگاه صنعتی شریف آماده ارائه خدمات فنی، انجام پژوهش‌های قراردادی، بهره‌برداری از تجهیزات پیشرفته و معرفی کارآموزان زبده به صنایع کشور است.',
  benefitsTitle: 'مزایای ارزش‌آفرین همکاری با شریف برای صنایع',
  benefits: [
    {
      num: '۰۱',
      title: 'حل چالش‌های پیچیده مهندسی',
      description: 'دسترسی به تیم‌های تخصصی اساتید و دانشجویان نخبه برای تحلیل عددی و آزمایشگاهی مسائلی که دانش فنی آن‌ها در صنعت موجود نیست.'
    },
    {
      num: '۰۲',
      title: 'کاهش هزینه‌های R&D صنعت',
      description: 'استفاده از آزمایشگاه‌های مجهز دانشگاه به جای سرمایه‌گذاری سنگین در خرید تجهیزات گران‌قیمت خارجی.'
    },
    {
      num: '۰۳',
      title: 'صدور تاییدیه‌های رسمی علمی',
      description: 'ارائه گزارش‌های فنی، آنالیزهای NDT و تاییدیه کارکرد قطعات با اعتبار حقوقی و بین‌المللی برند دانشگاه صنعتی شریف.'
    },
    {
      num: '۰۴',
      title: 'معافیت و اعتبار مالیاتی R&D',
      description: 'بهره‌مندی از مشوق‌های قانونی و مالیاتی پروژه‌های تحقیق و توسعه مشترک بر اساس قوانین حمایت از تولید دانش‌بنیان.'
    }
  ],
  modelsTitle: 'انواع روش‌ها و الگوی همکاری',
  models: [
    {
      title: '۱. بهره‌برداری از امکانات آزمایشگاهی',
      description: 'امکان رزرو و استفاده از تجهیزات پیشرفته از جمله پرینتر سه‌بعدی فلزی، تست آلتراسونیک Phased Array، تونل باد و ابرمحاسبه‌گر CFD جهت انجام آزمون‌های صنعتی شما.'
    },
    {
      title: '۲. پروژه‌های صنعتی مشترک و R&D',
      description: 'تعریف پروژه پژوهشی و بومی‌سازی قطعات یا اصلاح فرآیندهای صنعتی با هدایت مستقیم اعضای هیئت علمی دانشکده و عقد قراردادهای رسمی تحقیقاتی.'
    },
    {
      title: '۳. کارآموزی و جذب نخبگان به صنعت',
      description: 'معرفی دانشجویان مستعد مقاطع کارشناسی و تحصیلات تکمیلی جهت گذراندن دوره‌های کارآموزی صنعتی یا جذب به عنوان نیروی متخصص در مجموعه شما.'
    }
  ],
  partnersTitle: 'سوابق و شرکای تجاری ما',
  partners: [
    { name: 'گروه مپنا', icon: '⚡', logoUrl: 'https://images.unsplash.com/photo-1516802273409-68526ee1bdd6?auto=format&fit=crop&w=200&q=80' },
    { name: 'ایران خودرو', icon: '🚗', logoUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=200&q=80' },
    { name: 'شرکت ملی گاز', icon: '🔥', logoUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=200&q=80' },
    { name: 'شرکت ملی نفت', icon: '🛢️', logoUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=200&q=80' },
    { name: 'گروه سایپا', icon: '🏎️', logoUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=200&q=80' },
    { name: 'پالایشگاه اصفهان', icon: '🏭', logoUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b2?auto=format&fit=crop&w=200&q=80' }
  ],
  directContactEmail: 'me-research@sharif.edu',
  directContactPhone: '۰۲۱-۶۶۱۶۵۵۰۰ / ۰۲۱-۶۶۰۲۲۷۰۰',
  directContactFax: '۰۲۱-۶۶۰۰۵۶۱۶'
};

export const getCollaborationConfig = (): CollaborationPageConfig => {
  try {
    const data = localStorage.getItem(KEYS.COLLABORATION);
    if (!data) {
      localStorage.setItem(KEYS.COLLABORATION, JSON.stringify(DEFAULT_COLLABORATION_CONFIG));
      return DEFAULT_COLLABORATION_CONFIG;
    }
    return JSON.parse(data);
  } catch {
    return DEFAULT_COLLABORATION_CONFIG;
  }
};

export const saveCollaborationConfig = (config: CollaborationPageConfig): void => {
  localStorage.setItem(KEYS.COLLABORATION, JSON.stringify(config));
};

export const DEFAULT_FOOTER_CONFIG: FooterConfig = {
  description: 'قطب علمی و پژوهشی مهندسی مکانیک کشور — ارائه‌دهنده خدمات تخصصی، تحقیقات کاربردی و توسعه زیرساخت‌های صنعتی با تکیه بر دانش استادان و تجهیزات آزمایشگاهی.',
  address: 'تهران، خیابان آزادی، دانشگاه صنعتی شریف، دانشکده مهندسی مکانیک',
  phones: '۰۲۱-۶۶۱۶۵۵۰۰ / ۰۲۱-۶۶۰۲۲۷۰۰',
  email: 'me-research@sharif.edu',
  sharifLinkUrl: 'https://www.sharif.edu',
  sharifLinkText: 'سایت اصلی دانشگاه شریف',
  copyrightText: '© ۲۰۲۴ دانشگاه صنعتی شریف — دانشکده مهندسی مکانیک. تمامی حقوق محفوظ است.',
  collaborationAreas: [
    'دینامیک سیالات محاسباتی (CFD)',
    'رباتیک و اتوماسیون صنعتی',
    'تست‌های غیرمخرب (NDT) و پایش سازه',
    'دینامیک خودرو و سیستم تعلیق',
    'احتراق، انرژی و نانوسیالات',
    'طراحی و ساخت افزودنی فلزی'
  ]
};

export const getFooterConfig = (): FooterConfig => {
  try {
    const data = localStorage.getItem(KEYS.FOOTER);
    if (!data) {
      localStorage.setItem(KEYS.FOOTER, JSON.stringify(DEFAULT_FOOTER_CONFIG));
      return DEFAULT_FOOTER_CONFIG;
    }
    return JSON.parse(data);
  } catch {
    return DEFAULT_FOOTER_CONFIG;
  }
};

export const saveFooterConfig = (config: FooterConfig): void => {
  localStorage.setItem(KEYS.FOOTER, JSON.stringify(config));
};

export const getLabs = (): Lab[] => {
  try {
    const data = localStorage.getItem(KEYS.LABS);
    if (!data) {
      localStorage.setItem(KEYS.LABS, JSON.stringify(INITIAL_LABS));
      return INITIAL_LABS;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_LABS;
  }
};

export const saveLabs = (labs: Lab[]): void => {
  localStorage.setItem(KEYS.LABS, JSON.stringify(labs));
};

export const getFaculty = (): FacultyMember[] => {
  try {
    const data = localStorage.getItem(KEYS.FACULTY);
    if (!data) {
      localStorage.setItem(KEYS.FACULTY, JSON.stringify(INITIAL_FACULTY));
      return INITIAL_FACULTY;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_FACULTY;
  }
};

export const saveFaculty = (faculty: FacultyMember[]): void => {
  localStorage.setItem(KEYS.FACULTY, JSON.stringify(faculty));
};

export const getProjects = (): IndustrialProject[] => {
  try {
    const data = localStorage.getItem(KEYS.PROJECTS);
    if (!data) {
      localStorage.setItem(KEYS.PROJECTS, JSON.stringify(INITIAL_PROJECTS));
      return INITIAL_PROJECTS;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_PROJECTS;
  }
};

export const saveProjects = (projects: IndustrialProject[]): void => {
  localStorage.setItem(KEYS.PROJECTS, JSON.stringify(projects));
};

export const renameLabField = (oldField: string, newField: string): number => {
  const labs = getLabs();
  let count = 0;
  const updated = labs.map((lab) => {
    if (lab.field === oldField) {
      count++;
      return { ...lab, field: newField };
    }
    return lab;
  });
  if (count > 0) {
    saveLabs(updated);
    addSecurityLog({
      action: 'ویرایش نام گرایش/فیلتر آزمایشگاه‌ها',
      status: 'موفق',
      details: `گرایش "${oldField}" به "${newField}" در ${count} آزمایشگاه تغییر کرد.`
    });
  }
  return count;
};

export const deleteLabField = (fieldToDelete: string, fallbackField: string = 'عمومی'): number => {
  const labs = getLabs();
  let count = 0;
  const updated = labs.map((lab) => {
    if (lab.field === fieldToDelete) {
      count++;
      return { ...lab, field: fallbackField };
    }
    return lab;
  });
  if (count > 0) {
    saveLabs(updated);
    addSecurityLog({
      action: 'حذف/ادغام گرایش آزمایشگاه‌ها',
      status: 'موفق',
      details: `گرایش "${fieldToDelete}" حذف و ${count} مورد به "${fallbackField}" منتقل شدند.`
    });
  }
  return count;
};

export const renameFacultyField = (oldField: string, newField: string): number => {
  const faculty = getFaculty();
  let count = 0;
  const updated = faculty.map((f) => {
    if (f.field === oldField) {
      count++;
      return { ...f, field: newField };
    }
    return f;
  });
  if (count > 0) {
    saveFaculty(updated);
    addSecurityLog({
      action: 'ویرایش نام گرایش/فیلتر هیئت علمی',
      status: 'موفق',
      details: `گرایش "${oldField}" به "${newField}" در ${count} استاد تغییر کرد.`
    });
  }
  return count;
};

export const deleteFacultyField = (fieldToDelete: string, fallbackField: string = 'سایر'): number => {
  const faculty = getFaculty();
  let count = 0;
  const updated = faculty.map((f) => {
    if (f.field === fieldToDelete) {
      count++;
      return { ...f, field: fallbackField };
    }
    return f;
  });
  if (count > 0) {
    saveFaculty(updated);
    addSecurityLog({
      action: 'حذف/ادغام گرایش هیئت علمی',
      status: 'موفق',
      details: `گرایش "${fieldToDelete}" حذف و ${count} مورد به "${fallbackField}" منتقل شدند.`
    });
  }
  return count;
};

export const renameProjectCategory = (oldCategory: string, newCategory: string): number => {
  const projects = getProjects();
  let count = 0;
  const updated = projects.map((p) => {
    if (p.category === oldCategory) {
      count++;
      return { ...p, category: newCategory };
    }
    return p;
  });
  if (count > 0) {
    saveProjects(updated);
    addSecurityLog({
      action: 'ویرایش نام دسته‌بندی/فیلتر پروژه‌های صنعتی',
      status: 'موفق',
      details: `دسته‌بندی "${oldCategory}" به "${newCategory}" در ${count} پروژه تغییر کرد.`
    });
  }
  return count;
};

export const deleteProjectCategory = (categoryToDelete: string, fallbackCategory: string = 'سایر صنایع'): number => {
  const projects = getProjects();
  let count = 0;
  const updated = projects.map((p) => {
    if (p.category === categoryToDelete) {
      count++;
      return { ...p, category: fallbackCategory };
    }
    return p;
  });
  if (count > 0) {
    saveProjects(updated);
    addSecurityLog({
      action: 'حذف/ادغام دسته‌بندی پروژه‌ها',
      status: 'موفق',
      details: `دسته‌بندی "${categoryToDelete}" حذف و ${count} مورد به "${fallbackCategory}" منتقل شدند.`
    });
  }
  return count;
};

const CUSTOM_CAT_KEY = 'sharif_me_custom_categories_v1';

export interface CustomCategories {
  labs: string[];
  faculty: string[];
  projects: string[];
}

export const getCustomCategories = (): CustomCategories => {
  try {
    const data = localStorage.getItem(CUSTOM_CAT_KEY);
    if (!data) return { labs: [], faculty: [], projects: [] };
    return JSON.parse(data);
  } catch {
    return { labs: [], faculty: [], projects: [] };
  }
};

export const saveCustomCategories = (cats: CustomCategories): void => {
  localStorage.setItem(CUSTOM_CAT_KEY, JSON.stringify(cats));
};

export const addCustomCategory = (type: 'labs' | 'faculty' | 'projects', categoryName: string): void => {
  const current = getCustomCategories();
  const trimmed = categoryName.trim();
  if (!trimmed || current[type].includes(trimmed)) return;
  current[type].push(trimmed);
  saveCustomCategories(current);
};

export const removeCustomCategory = (type: 'labs' | 'faculty' | 'projects', categoryName: string): void => {
  const current = getCustomCategories();
  current[type] = current[type].filter((c) => c !== categoryName);
  saveCustomCategories(current);
};

export const getRequests = (): CollaborationRequest[] => {
  try {
    const data = localStorage.getItem(KEYS.REQUESTS);
    if (!data) {
      localStorage.setItem(KEYS.REQUESTS, JSON.stringify(INITIAL_REQUESTS));
      return INITIAL_REQUESTS;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_REQUESTS;
  }
};

export const saveRequests = (requests: CollaborationRequest[]): void => {
  localStorage.setItem(KEYS.REQUESTS, JSON.stringify(requests));
};

export const addRequest = (req: Omit<CollaborationRequest, 'id' | 'createdAt' | 'status'>): CollaborationRequest => {
  const requests = getRequests();
  const newReq: CollaborationRequest = {
    ...req,
    id: 'req-' + Date.now(),
    createdAt: new Date().toLocaleDateString('fa-IR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
    status: 'جدید'
  };
  const updated = [newReq, ...requests];
  saveRequests(updated);

  addSecurityLog({
    action: 'ثبت فرم درخواست همکاری صنعتی',
    status: 'موفق',
    details: `درخواست توسط ${newReq.fullName} (${newReq.company}) ثبت گردید.`
  });

  return newReq;
};

export const getSecurityLogs = (): SecurityAuditLog[] => {
  try {
    const data = localStorage.getItem(KEYS.LOGS);
    if (!data) return [];
    return JSON.parse(data);
  } catch {
    return [];
  }
};

export const addSecurityLog = (log: Omit<SecurityAuditLog, 'id' | 'timestamp' | 'ip'>): void => {
  const logs = getSecurityLogs();
  const newLog: SecurityAuditLog = {
    ...log,
    id: 'log-' + Date.now(),
    timestamp: new Date().toLocaleDateString('fa-IR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
    ip: '192.168.1.' + Math.floor(Math.random() * 200 + 10)
  };
  localStorage.setItem(KEYS.LOGS, JSON.stringify([newLog, ...logs].slice(0, 100)));
};

export const getAdminState = (): AdminState => {
  try {
    const data = localStorage.getItem(KEYS.ADMIN_STATE);
    if (!data) {
      const defaultState: AdminState = {
        isLoggedIn: false,
        username: 'admin@sharif.edu',
        requires2FA: false,
        is2FAVerified: false,
        failedAttempts: 0,
        lockoutUntil: null
      };
      return defaultState;
    }
    return JSON.parse(data);
  } catch {
    return {
      isLoggedIn: false,
      username: 'admin@sharif.edu',
      requires2FA: false,
      is2FAVerified: false,
      failedAttempts: 0,
      lockoutUntil: null
    };
  }
};

export const saveAdminState = (state: AdminState): void => {
  localStorage.setItem(KEYS.ADMIN_STATE, JSON.stringify(state));
};
