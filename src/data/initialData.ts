import { Lab, FacultyMember, IndustrialProject, CollaborationRequest } from '../types';

export const INITIAL_FACULTY: FacultyMember[] = [
  {
    id: 'f_pakzad',
    name: 'دکتر حسین پاکزاد',
    title: 'استادیار',
    field: 'تبدیل انرژی — میکرو و نانوسیالات، میعان و مایکروفابریکیشن',
    shortDesc: 'استادیار گروه تبدیل انرژی، مدیر روابط عمومی دانشکده، متخصص مایکروفابریکیشن و سیستم‌های میکرو/نانو سیال.',
    bio: 'دکتر حسین پاکزاد دارای دکتری مهندسی مکانیک از دانشگاه صنعتی شریف (۱۴۰۲) و استادیار گروه تبدیل انرژی دانشکده مهندسی مکانیک دانشگاه صنعتی شریف است. ایشان همچنین مدیریت روابط عمومی دانشکده را بر عهده دارند و حوزه پژوهشی اصلی وی سیستم‌های میکرو و نانوسیالات، مایکروفابریکیشن، مایکروفلوییدیک و دینامیک قطرات می‌باشد.',
    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
    email: 'pakzad@sharif.edu',
    phone: '۰۲۱-۶۶۱۶۵۵۴۰',
    office: 'دانشکده مکانیک — طبقه ۴ — اتاق ۴۱۴',
    scholarUrl: 'https://scholar.google.com',
    skills: ['مایکروسیستم‌ها', 'مایکروفابریکیشن', 'نانوسیالات', 'میکروفلوییدیک', 'تحلیل حرارتی میکرو'],
    supervisedLabs: ['l7'],
    projectsLed: [],
    publications: [
      'Pakzad et al., "Microfluidic platforms for micro-particle separation", Lab on a Chip, 2024.',
      'Pakzad & Manzari, "Numerical analysis of nanofluid transport in microchannels", Int. J. Heat Mass Transfer, 2023.'
    ]
  },
  {
    id: 'f_mohammadi_k',
    name: 'دکتر کیوان محمدی',
    title: 'استادیار',
    field: 'طراحی کاربردی — ساخت و تولید پیشرفته و پرینتر سه‌بعدی میکرو',
    shortDesc: 'استادیار گروه ساخت و تولید، مدیر برنامه کوآپ و کارآموزی، سازنده نخستین پرینتر ۳ بعدی میکرو در خاورمیانه.',
    bio: 'دکتر کیوان محمدی دارای دکتری مهندسی مکانیک از دانشگاه صنعتی شریف (۱۳۹۹) و استادیار گروه طراحی کاربردی (گرایش ساخت و تولید) دانشکده است. ایشان مدیر برنامه کارآموزی و کوآپ دانشکده بوده و با همکاری پژوهشگران دانشکده موفق به طراحی و ساخت نخستین پرینتر سه‌بعدی ابعاد میکرو در خاورمیانه گردیده‌اند.',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    email: 'kaivan.mohammadi@sharif.edu',
    phone: '۰۲۱-۶۶۱۶۵۵۸۵',
    office: 'دانشکده مکانیک — طبقه ۶ — اتاق ۶۱۹',
    scholarUrl: 'https://scholar.google.com',
    skills: ['ماشینکاری التراسونیک', 'طراحی ماشین ابزار CNC', 'مواد مرکب (کامپوزیت)', 'فرآیندهای ساخت پیشرفته', 'پرینتر سه‌بعدی میکرو'],
    supervisedLabs: ['l3'],
    projectsLed: ['p6'],
    publications: [
      'Mohammadi et al., "Ultrasonic-assisted machining of advanced aerospace alloys", J. Mater. Process. Technol., 2024.',
      'Mohammadi & Farahmand, "Design and Control of Multi-axis CNC Machine Tools", Robotics and Computer-Integrated Manufacturing, 2023.'
    ]
  },
  {
    id: 'f_kamran',
    name: 'خانم دکتر مریم کامران',
    title: 'استادیار',
    field: 'مهندسی دریا — هیدرودینامیک کاربردی و دیداری‌سازی جریان',
    shortDesc: 'استادیار مهندسی دریا، مدیر وب‌سایت دانشکده، عضو قطب علمی هیدرودینامیک و دینامیک متحرک‌های دریایی.',
    bio: 'دکتر مریم کامران دارای دکتری مهندسی مکانیک از دانشگاه علم و صنعت ایران (۱۴۰۱) و استادیار دانشکده مهندسی مکانیک دانشگاه صنعتی شریف است. ایشان مسئولیت مدیریت تیم وب‌سایت دانشکده را بر عهده داشته و عضو قطب علمی هیدرودینامیک و دینامیک متحرک‌های دریایی دانشگاه شریف می‌باشند.',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    email: 'kamran@sharif.edu',
    phone: '۰۲۱-۶۶۱۶۵۵۳۳',
    office: 'دانشکده مکانیک — طبقه ۴ — اتاق ۴۰۸',
    scholarUrl: 'https://scholar.google.com',
    skills: ['هیدرودینامیک کاربردی', 'مکانیک سیالات عددی و تجربی', 'انرژی‌های تجدیدپذیر دریایی', 'دیداری‌سازی جریان', 'طراحی سازه‌های دریایی'],
    supervisedLabs: [],
    projectsLed: ['p4'],
    publications: [
      'Kamran et al., "Machine Learning Applications in Marine Hydrodynamics", Ocean Engineering, 2024.',
      'Kamran & Seif, "Experimental and numerical investigation of wave energy converters", Renewable Energy, 2023.'
    ]
  },
  {
    id: 'f_mohammadi_s',
    name: 'خانم دکتر سمیه محمدی',
    title: 'استادیار',
    field: 'طراحی کاربردی — دینامیک، کنترل و سیستم‌های خودران',
    shortDesc: 'استادیار گروه کنترل، مدیر روابط عمومی دانشگاه صنعتی شریف و معاون آموزش‌های تخصصی دانشکده.',
    bio: 'دکتر سمیه محمدی دارای دکتری مهندسی مکانیک از دانشگاه صنعتی امیرکبیر (۱۴۰۰) و استادیار دانشکده مهندسی مکانیک دانشگاه صنعتی شریف است. ایشان به عنوان مدیر روابط عمومی و ارتباطات دانشگاه صنعتی شریف و نیز معاون آموزش‌های تخصصی دانشکده فعالیت می‌نمایند.',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400',
    email: 'somaye.mohammadi@sharif.edu',
    phone: '۰۲۱-۶۶۱۶۵۶۹۰',
    office: 'دانشکده مکانیک — طبقه ۴ — اتاق ۴۳۶',
    scholarUrl: 'https://scholar.google.com',
    skills: ['سیستم‌های خودران', 'عیب‌یابی هوشمند', 'کنترل پیشرفته', 'پایش آنلاین سلامت', 'مدل‌سازی سیستم‌های دینامیکی'],
    supervisedLabs: [],
    projectsLed: ['p2'],
    publications: [
      'Mohammadi et al., "Fault Diagnosis in Autonomous Vehicles using Deep Learning", IEEE Trans. Control Syst., 2024.',
      'Mohammadi & Moradi, "Nonlinear Control Strategy for Autonomous Navigation", Control Engineering Practice, 2023.'
    ]
  },
  {
    id: 'f_taheri',
    name: 'دکتر علیرضا طاهری',
    title: 'دانشیار',
    field: 'طراحی کاربردی — کنترل، رباتیک اجتماعی و شناختی',
    shortDesc: 'دانشیار گروه کنترل، معاون آموزشی دانشکده، مدیر گروه جذب استعدادهای درخشان و سرپرست آزمایشگاه رباتیک اجتماعی.',
    bio: 'دکتر علیرضا طاهری دارای دکتری مهندسی مکانیک از دانشگاه صنعتی شریف (۱۳۹۶) و دانشیار گروه طراحی کاربردی دانشکده است. ایشان معاونت آموزشی دانشکده، مدیریت گروه جذب استعدادهای درخشان و سرپرستی آزمایشگاه رباتیک اجتماعی و شناختی دانشگاه صنعتی شریف را بر عهده دارند.',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
    email: 'artaheri@sharif.edu',
    phone: '۰۲۱-۶۶۱۶۵۵۳۱',
    office: 'دانشکده مکانیک — طبقه ۴ — اتاق ۴۳۸',
    scholarUrl: 'https://scholar.google.com',
    skills: ['رباتیک اجتماعی و شناختی', 'تعامل انسان و ربات (HRI)', 'هوش مصنوعی', 'ربات‌های توانبخشی', 'پردازش سیگنال‌های زیستی'],
    supervisedLabs: ['l1'],
    projectsLed: [],
    publications: [
      'Taheri et al., "Social Robots in Pediatric Rehabilitation", International Journal of Social Robotics, 2024.',
      'Taheri & Meghdari, "Cognitive Robotics Architecture for Human Assistance", Advanced Robotics, 2023.'
    ]
  },
  {
    id: 'f_bijarchi',
    name: 'دکتر محمدعلی بیجارچی',
    title: 'استادیار',
    field: 'تبدیل انرژی — انتقال حرارت، لوله‌های حرارتی و مایکروفلوئیدیک',
    shortDesc: 'استادیار گروه تبدیل انرژی، معاون دانشجویی دانشکده و سرپرست آزمایشگاه لوله‌های حرارتی.',
    bio: 'دکتر محمدعلی بیجارچی دارای دکتری مهندسی مکانیک از دانشگاه صنعتی شریف (۱۳۹۹) و استادیار گروه تبدیل انرژی دانشکده مهندسی مکانیک است. ایشان معاونت دانشجویی دانشکده را بر عهده داشته و در حوزه انتقال حرارت پیشرفته، لوله‌های حرارتی، و کاربرد هوش مصنوعی در مکانیک سیالات فعالیت می‌کنند.',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400',
    email: 'bijarchi@sharif.edu',
    phone: '۰۲۱-۶۶۱۶۵۵۵۸',
    office: 'دانشکده مکانیک — طبقه ۶ — اتاق ۶۰۶',
    scholarUrl: 'https://scholar.google.com',
    skills: ['لوله‌های حرارتی (Heat Pipes)', 'انتقال حرارت پیشرفته', 'انرژی‌های تجدیدپذیر', 'هوش مصنوعی در سیالات', 'اندازه‌گیری اپتیکی'],
    supervisedLabs: ['l4'],
    projectsLed: [],
    publications: [
      'Bijarchi et al., "Thermal performance of pulsating heat pipes using AI modeling", Appl. Therm. Eng., 2024.',
      'Bijarchi & Shafii, "Experimental study of bio-mass transfer in capillary heat pipes", Int. J. Heat Mass Transfer, 2023.'
    ]
  },
  {
    id: 'f_saadat',
    name: 'دکتر محمود سعادت فومنی',
    title: 'استاد تمام',
    field: 'طراحی کاربردی — دینامیک خودرو، بهینه‌سازی و طراحی شاسی',
    shortDesc: 'استاد تمام گروه طراحی کاربردی، معاون تحصیلات تکمیلی دانشکده و دبیر جذب هیئت علمی.',
    bio: 'دکتر محمود سعادت فومنی دارای دکتری مهندسی مکانیک از دانشگاه صنعتی شریف (۱۳۸۰) و استاد تمام گروه طراحی کاربردی است. ایشان معاونت تحصیلات تکمیلی و دبیر جذب هیئت علمی دانشکده مهندسی مکانیک را بر عهده داشته و دارای سوابق درخشان در تحلیل سیستم‌های تعلیق و دینامیک خودرو می‌باشند.',
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400',
    email: 'saadat@sharif.edu',
    phone: '۰۲۱-۶۶۱۶۵۵۳۴',
    office: 'دانشکده مکانیک — طبقه ۴ — اتاق ۴۲۱',
    scholarUrl: 'https://scholar.google.com',
    skills: ['دینامیک خودرو', 'طراحی شاسی', 'بهینه‌سازی سیستم‌های دینامیکی', 'کنترل دینامیکی', 'تست‌های جاده‌ای و آزمایشگاهی'],
    supervisedLabs: ['l6'],
    projectsLed: ['p5'],
    publications: [
      'Saadat et al., "Multi-objective Optimization of Heavy Vehicle Suspension Systems", Vehicle System Dynamics, 2024.',
      'Saadat & Vossooughi, "Active Chassis Control Algorithms for Vehicle Stability", IEEE Trans. Veh. Technol., 2023.'
    ]
  },
  {
    id: 'f_behzad',
    name: 'دکتر مهدی بهزاد',
    title: 'استاد تمام',
    field: 'طراحی کاربردی — پایش وضعیت (Condition Monitoring) و ارتعاشات صنعتی',
    shortDesc: 'استاد تمام گروه طراحی کاربردی، مدیر دوره‌های تخصصی دانشکده و رئیس سابق انجمن پایش وضعیت ایران.',
    bio: 'دکتر مهدی بهزاد دارای دکتری مهندسی مکانیک از دانشگاه نیوساوث ولز (UNSW) استرالیا (۱۳۷۴) و استاد تمام گروه طراحی کاربردی دانشگاه صنعتی شریف است. ایشان بنیان‌گذار روش‌های نوین عیب‌یابی توربوماشین‌ها و پایش وضعیت تجهیزات دوار در صنایع کشور می‌باشند.',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400',
    email: 'm_behzad@sharif.edu',
    phone: '۰۲۱-۶۶۱۶۵۵۰۹',
    office: 'دانشکده مکانیک — طبقه ۴ — اتاق ۴۳۹',
    scholarUrl: 'https://scholar.google.com',
    skills: ['پایش وضعیت (Condition Monitoring)', 'آنالیز ارتعاشات صنعتی', 'روتور دینامیک', 'عیب‌یابی بلبرینگ‌ها و توربین‌ها', 'تست مودال'],
    supervisedLabs: ['l5'],
    projectsLed: ['p3'],
    publications: [
      'Behzad et al., "Vibration-based Condition Monitoring of Turbomachinery", Mech. Syst. Signal Process., 2024.',
      'Behzad & Alasti, "Remaining Useful Life Estimation of Rolling Element Bearings", Reliability Eng. Syst. Safety, 2023.'
    ]
  },
  {
    id: 'f_taghipoor',
    name: 'دکتر مجتبی تقی پور',
    title: 'دانشیار',
    field: 'تبدیل انرژی — مکانیک سیالات عددی/تجربی و تهویه صنعتی',
    shortDesc: 'دانشیار گروه تبدیل انرژی، پژوهشگر برتر تعاملات بین‌المللی و سرپرست آزمایشگاه تهویه صنعتی.',
    bio: 'دکتر مجتبی تقی پور دارای دکتری مهندسی مکانیک از دانشگاه EPFL سوییس (۱۳۹۴) و دانشیار گروه تبدیل انرژی دانشکده مهندسی مکانیک دانشگاه صنعتی شریف است. زمینه‌های پژوهشی وی شامل توربولانس جریان‌های برشی، کاهش مصرف انرژی در سیستم‌های تهویه مطبوع صنعتی و مدلسازی عددی سیالات است.',
    avatarUrl: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=400',
    email: 'mtaghipoor@sharif.edu',
    phone: '۰۲۱-۶۶۱۶۵۵۱۰',
    office: 'دانشکده مکانیک — طبقه ۵ — اتاق ۵۱۳',
    scholarUrl: 'https://scholar.google.com',
    skills: ['سیستم‌های تهویه صنعتی', 'فیزیک توربولانس', 'کاهش مصرف انرژی (Energy Saving)', 'طراحی HVAC صنعتی', 'جریان‌های برشی'],
    supervisedLabs: ['l2'],
    projectsLed: [],
    publications: [
      'Taghipoor et al., "Advanced Ventilation Strategies in Industrial Workshops", Building and Environment, 2024.',
      'Taghipoor & Afshin, "Turbulence structures in shear flow ventilation systems", Int. J. Thermal Sciences, 2023.'
    ]
  },
  {
    id: 'f_karimi',
    name: 'دکتر محمدصادق کریمی',
    title: 'استادیار',
    field: 'تبدیل انرژی — طراحی و بهینه‌سازی توربوماشین‌ها',
    shortDesc: 'استادیار گروه تبدیل انرژی، مدیر مرکز دینامیک شریف و معاون سابق دانشجویی و فرهنگی دانشکده.',
    bio: 'دکتر محمدصادق کریمی دارای دکتری دوگانه مهندسی مکانیک از دانشگاه تهران (۱۳۹۹) و دانشگاه آزاد بروکسل بلژیک (۲۰۲۱) و استادیار گروه تبدیل انرژی دانشکده مهندسی مکانیک است. ایشان مدیریت مرکز دینامیک شریف را بر عهده دارند.',
    avatarUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400',
    email: 'mohamad.karimi@sharif.edu',
    phone: '۰۲۱-۶۶۱۶۵۵۲۷',
    office: 'دانشکده مکانیک — طبقه ۶ — اتاق ۶۰۳',
    scholarUrl: 'https://scholar.google.com',
    skills: ['توربوماشین‌ها', 'تحلیل داده‌های جریان (Data Analytics)', 'بهینه‌سازی استوار', 'عددی پیشرفته سیالات', 'سیستم‌های بیوممز'],
    supervisedLabs: [],
    projectsLed: ['p1'],
    publications: [
      'Karimi et al., "Robust Optimization of Turbomachinery Blades under Uncertainties", Computers & Fluids, 2024.',
      'Karimi & Hannani, "Data-driven flow analysis in complex micro-geometries", J. Comput. Physics, 2023.'
    ]
  }
];

export const INITIAL_LABS: Lab[] = [
  {
    id: 'l1',
    name: 'آزمایشگاه رباتیک اجتماعی و شناختی',
    field: 'رباتیک و هوش مصنوعی',
    shortDesc: 'مجهز به سیستم‌های پردازش سیگنال زیستی، ربات‌های تعاملی و پلتفرم‌های هوش مصنوعی شناختی.',
    fullDesc: 'آزمایشگاه رباتیک اجتماعی و شناختی دانشگاه صنعتی شریف، مرجع تخصصی طراحی و پیاده‌سازی ربات‌های تعاملی، توانبخشی و هوش مصنوعی شناختی در کشور است.',
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800',
    supervisorId: 'f_taheri',
    supervisorName: 'دکتر علیرضا طاهری',
    members: ['مهندس رضا صادقی (پژوهشگر ارشد)', 'سارا مرادی (دانشجوی دکتری)', 'محمد حسینی (دانشجوی ارشد)'],
    equipment: [
      { name: 'ربات اجتماعی تعاملی NAO v6', specs: 'مجهز به سیستم پردازش گفتار، تشخیص چهره و ۲۵ درجه آزادی' },
      { name: 'سیستم ثبت سیگنال‌های مغزی EEG الکترود ۲۴ کاناله', specs: 'اندازه‌گیری آنی پاسخ‌های عصبی و شناختی کاربر' },
      { name: 'دستگاه اسکنر حرکت بدنی Vicon', specs: 'سیستم ۱۰ دوربینی ردگیری دقیق حرکت با دقت زیر میلی‌متر' }
    ],
    projects: ['p2'],
    gallery: [
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600'
    ],
    achievements: [
      'طراحی ربات‌های توانبخشی اطفال مبتلا به اوتیسم با تاییدیه وزارت بهداشت',
      'ثبت ۲ گواهی اختراع بین‌المللی در حوزه ربات‌های اجتماعی تعاملی'
    ],
    location: 'دانشکده مهندسی مکانیک — طبقه ۴ — اتاق ۱۰۷',
    contactEmail: 'artaheri@sharif.edu'
  },
  {
    id: 'l2',
    name: 'آزمایشگاه سیستم‌های پیشرفته تهویه صنعتی',
    field: 'مکانیک سیالات و HVAC',
    shortDesc: 'مجهز به سیستم‌های اندازه‌گیری سرعت جریان هوای برشی و تجهیزات کاهش مصرف انرژی تهویه.',
    fullDesc: 'آزمایشگاه سیستم‌های پیشرفته تهویه صنعتی با هدف بهینه‌سازی جریان هوا در محیط‌های بزرگ کارگاهی، پالایشگاهی و بیمارستانی فعالیت می‌کند.',
    imageUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&q=80&w=800',
    supervisorId: 'f_taghipoor',
    supervisorName: 'دکتر مجتبی تقی پور',
    members: ['دکتر حامد کاظمی (پژوهشگر پسادکتری)', 'مهندس نیلوفر واحدی', 'امیررضا بهرامی (دانشجوی دکتری)'],
    equipment: [
      { name: 'سیستم اندازه‌گیری سرعت لیزری جریان PIV', specs: 'اندازه‌گیری سرعت و میدان توربولانس جریان‌های برشی' },
      { name: 'آنالایزر کیفیت هوای سالن‌های صنعتی', specs: 'اندازه‌گیری پارتیکل‌ها و گازهای محبوس' }
    ],
    projects: ['p1'],
    gallery: [
      'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&q=80&w=600'
    ],
    achievements: [
      'طراحی سیستم‌های تهویه متمایز کم‌مصرف برای سالن‌های تولید خودرو و فولاد'
    ],
    location: 'دانشکده مهندسی مکانیک — همکف — سالن ۲۰۸',
    contactEmail: 'mtaghipoor@sharif.edu'
  },
  {
    id: 'l3',
    name: 'آزمایشگاه مواد مرکب و ساخت پیشرفته',
    field: 'جامدات و ساخت',
    shortDesc: 'مجهز به سیستم‌های ساخت افزایشی، ماشینکاری التراسونیک و دستگاه‌های تست خواص مکانیکی کامپوزیت‌ها.',
    fullDesc: 'این آزمایشگاه تحت مدیریت دکتر کیوان محمدی خدمات پژوهشی و صنعتی ساخت قطعات پیچیده از مواد نوین، ماشینکاری التراسونیک و آنالیز کامپوزیت‌ها را ارائه می‌کند.',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800',
    supervisorId: 'f_mohammadi_k',
    supervisorName: 'دکتر کیوان محمدی',
    members: ['مهندس علی امینی', 'زهرا باقری', 'سینا موسوی'],
    equipment: [
      { name: 'سیستم ماشینکاری التراسونیک ۵ محوره CNC', specs: 'قابلیت ماشینکاری سرامیک‌ها و آلیاژهای سخت صنایع هوافضا' },
      { name: 'دستگاه تست کشش و خستگی یونیورسال', specs: 'ظرفیت ۱۰۰ تن با سیستم ثبت دیجیتال داده‌ها' }
    ],
    projects: ['p6'],
    gallery: [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600'
    ],
    achievements: [
      'طراحی و بومی‌سازی دستگاه ماشینکاری التراسونیک قطعات سرامیکی پیشرفته'
    ],
    location: 'دانشکده مهندسی مکانیک — طبقه همکف — سالن ۲۱۴',
    contactEmail: 'kaivan.mohammadi@sharif.edu'
  },
  {
    id: 'l4',
    name: 'آزمایشگاه لوله‌های حرارتی و انتقال حرارت',
    field: 'ترمودینامیک و انتقال حرارت',
    shortDesc: 'تست‌های دقیق خنک‌کاری تجهیزات الکترونیکی پرقدرت و لوله‌های حرارتی نوسانی.',
    fullDesc: 'این مرکز تحت سرپرستی دکتر محمدعلی بیجارچی مرجع آزمایشگاهی بررسی لوله‌های حرارتی پیشرفته و سیستم‌های خنک‌کننده الکترونیک است.',
    imageUrl: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=800',
    supervisorId: 'f_bijarchi',
    supervisorName: 'دکتر محمدعلی بیجارچی',
    members: ['مهندس دانیال ملک', 'فاطمه رستمی'],
    equipment: [
      { name: 'استند تست لوله‌های حرارتی نوسانی Pulsating Heat Pipe', specs: 'کنترل دقیق توان حرارتی تا ۳ کیلووات' },
      { name: 'دوربین حرارتی ترموویژن پیشرفته FLIR', specs: 'تفکیک حرارتی ۰.۰۱ درجه سانتی‌گراد' }
    ],
    projects: [],
    gallery: [
      'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=600'
    ],
    achievements: [
      'توسعه لوله‌های حرارتی فشرده جهت استفاده در ماهواره‌ها و پردازنده‌های پرقدرت'
    ],
    location: 'دانشکده مهندسی مکانیک — طبقه ۳ — اتاق ۳۱۵',
    contactEmail: 'bijarchi@sharif.edu'
  },
  {
    id: 'l5',
    name: 'آزمایشگاه پایش وضعیت و ارتعاشات صنعتی',
    field: 'پایش سلامت سازه و ارتعاشات',
    shortDesc: 'دستگاه‌های آنالیز ارتعاشات دوار، تست‌های غیرمخرب NDT و تحلیل روتوردینامیک.',
    fullDesc: 'آزمایشگاه پایش وضعیت تحت سرپرستی استاد برجسته دکتر مهدی بهزاد، اصلی‌ترین مرکز عیب‌یابی تجهیزات دوار و پایش سلامت نیروگاه‌ها و صنایع نفت کشور است.',
    imageUrl: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80&w=800',
    supervisorId: 'f_behzad',
    supervisorName: 'دکتر مهدی بهزاد',
    members: ['مهندس پیمان نجفی', 'آرش سعیدی'],
    equipment: [
      { name: 'دستگاه آنالایزر ارتعاشات multichannel B&K', specs: '۳۲ کانال ورودی با قابلیت آنالیز آنی فرکانسی FFT' },
      { name: 'استند تست روتور دینامیک و عیب‌یابی بلبرینگ (b10)', specs: 'دور تا ۳۰۰۰۰ RPM با قابلیت ایجاد انحراف مرکز و ترک' }
    ],
    projects: ['p3'],
    gallery: [
      'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80&w=600'
    ],
    achievements: [
      'پایش سلامت و عیب‌یابی توربوژنراتورهای نیروگاه‌های کلان کشور و خطوط انتقال گاز'
    ],
    location: 'دانشکده مهندسی مکانیک — سالن ارتعاشات (b10)',
    contactEmail: 'm_behzad@sharif.edu'
  },
  {
    id: 'l6',
    name: 'آزمایشگاه دینامیک خودرو و شاسی',
    field: 'دینامیک خودرو',
    shortDesc: 'استندهای تست کمک‌فنر، دستگاه تست ترمز و شبیه‌سازهای دینامیکی حرکت خودرو.',
    fullDesc: 'آزمایشگاه تخصصی دینامیک خودرو تحت سرپرستی دکتر محمود سعادت فومنی مرجع تست و ارزیابی سیستم‌های تعلیق، فرمان و پایداری خودروها در کشور است.',
    imageUrl: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&q=80&w=800',
    supervisorId: 'f_saadat',
    supervisorName: 'دکتر محمود سعادت فومنی',
    members: ['مهندس کامران عباسی', 'نوید فرهمند'],
    equipment: [
      { name: 'استند تست ارتعاشات شاسی خودرو (4-Poster)', specs: 'قابلیت شبیه‌سازی جاده‌های استاندارد ISO' },
      { name: 'دستگاه تست دینامومتری کمک‌فنر و فنر', specs: 'اندازه‌گیری دقیق منحنی دمپینگ در فرکانس‌های مختلف' }
    ],
    projects: ['p5'],
    gallery: [
      'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&q=80&w=600'
    ],
    achievements: [
      'طراحی سیستم‌های تعلیق پیشرفته برای صنایع خودروسازی کشور'
    ],
    location: 'دانشکده مهندسی مکانیک — همکف — سالن b05',
    contactEmail: 'saadat@sharif.edu'
  },
  {
    id: 'l7',
    name: 'آزمایشگاه سیستم‌های میکرو و نانو',
    field: 'میکروفلوییدیک و MEMS',
    shortDesc: 'تجهیزات ساخت و تحلیل چیپ‌های میکروفلوییدیک و سیستم‌های نانو سیالات.',
    fullDesc: 'مرکز تحقیقات سیستم‌های میکرو و نانو تحت مدیریت دکتر حسین پاکزاد به مطالعه و ساخت چیپ‌های میکروفلوییدیک و سامانه‌های خنک‌کننده نانوسیال می‌پردازد.',
    imageUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=800',
    supervisorId: 'f_pakzad',
    supervisorName: 'دکتر حسین پاکزاد',
    members: ['مهندس مریم صادقی', 'احسان کریمی'],
    equipment: [
      { name: 'میکروسکوپ نوری فاز کنتراست مجهز به دوربین سرعت بالا', specs: 'اندازه‌گیری جریان سیال در کانال‌های ۱۰۰ نانومتری' },
      { name: 'پمپ پایش تزریق تزریقی چندکاناله دقیق Microfluidic Syringe Pump', specs: 'دقت تزریق نانولیتر بر دقیقه' }
    ],
    projects: [],
    gallery: [
      'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=600'
    ],
    achievements: [
      'ساخت موفقیت‌آمیز چیپ‌های میکروفلوییدیک جداسازی سلول‌های سرطانی'
    ],
    location: 'دانشکده مهندسی مکانیک — همکف — سالن ۴۴۷',
    contactEmail: 'pakzad@sharif.edu'
  }
];

export const INITIAL_PROJECTS: IndustrialProject[] = [
  {
    id: 'p1',
    title: 'تحلیل داده و بهینه‌سازی استوار توربوماشین‌های نیروگاهی',
    clientCompany: 'شرکت مپنا (MAPNA Group)',
    clientLogo: '⚡',
    category: 'انرژی و توربین',
    shortDesc: 'شبیه‌سازی عددی ۳ بعدی و بهینه‌سازی استوار پره‌های کمپرسور و توربین تحت عدم قطعیت.',
    fullDesc: 'این پروژه با هدف افزایش بازدهی و قابلیت اطمینان توربوماشین‌های نیروگاهی تحت مدیریت دکتر محمدصادق کریمی انجام پذیرفت.',
    imageUrl: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&q=80&w=800',
    labId: 'l2',
    labName: 'آزمایشگاه سیستم‌های پیشرفته تهویه صنعتی',
    leadFacultyId: 'f_karimi',
    leadFacultyName: 'دکتر محمدصادق کریمی',
    year: '۱۴۰۲ - ۱۴۰۳',
    status: 'تکمیل‌شده',
    outcomes: [
      'افزایش ۳.۸ درصدی بازده روتور کمپرسور تحت افت فشارهای متغیر',
      'کاهش استهلاک قطعات حرارتی نیروگاه'
    ]
  },
  {
    id: 'p2',
    title: 'الگوریتم‌های عیب‌یابی هوشمند و کنترل سیستم‌های خودران',
    clientCompany: 'گروه صنعتی ایران خودرو',
    clientLogo: '🚗',
    category: 'خودروسازی و رباتیک',
    shortDesc: 'پیاده‌سازی الگوریتم‌های هوشمند پایش سلامت و کنترل خط سیر خودران در شرایط محیطی پیچیده.',
    fullDesc: 'این پروژه تحت سرپرستی خانم دکتر سمیه محمدی جهت توسعه ماژول کنترل و عیب‌یابی آنلاین خودروهای خودران اجرا گردید.',
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800',
    labId: 'l1',
    labName: 'آزمایشگاه رباتیک اجتماعی و شناختی',
    leadFacultyId: 'f_mohammadi_s',
    leadFacultyName: 'خانم دکتر سمیه محمدی',
    year: '۱۴۰۱ - ۱۴۰۲',
    status: 'تکمیل‌شده',
    outcomes: [
      'افزایش سربرگ ایمنی حرکت خودران تا ۹۹.۴٪ در تست‌های جاده‌ای',
      'شناسایی آنی خطا در سنسورهای رادار و لیدار'
    ]
  },
  {
    id: 'p3',
    title: 'سیستم آنالیز ارتعاشات و NDT پایش سلامت خطوط لوله گاز',
    clientCompany: 'شرکت ملی گاز ایران',
    clientLogo: '🔥',
    category: 'نفت، گاز و پتروشیمی',
    shortDesc: 'استفاده از سیستم پایش وضعیت ارتعاشی و التراسونیک جهت عیب‌یابی خطوط لوله.',
    fullDesc: 'تحت هدایت استاد تمام دکتر مهدی بهزاد پروژه جامع پایش سلامت و ارتعاشات توربوکمپرسورها و لوله‌های انتقال گاز کشور به اجرا درآمد.',
    imageUrl: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80&w=800',
    labId: 'l5',
    labName: 'آزمایشگاه پایش وضعیت و ارتعاشات صنعتی',
    leadFacultyId: 'f_behzad',
    leadFacultyName: 'دکتر مهدی بهزاد',
    year: '۱۴۰۲ - ۱۴۰۳',
    status: 'در حال اجرا',
    outcomes: [
      'بازرسی و پایش آنلاین ارتعاشات بیش از ۵۰ ایستگاه تقویت فشار گاز',
      'جلوگیری از توقف ناخواسته توربین‌ها با تشخیص زودهنگام خرابی بلبرینگ'
    ]
  },
  {
    id: 'p4',
    title: 'تحلیل هیدرودینامیک کاربردی و مبدل‌های انرژی تجدیدپذیر دریایی',
    clientCompany: 'صنایع دریایی ایران',
    clientLogo: '⚓',
    category: 'مهندسی دریا و انرژی',
    shortDesc: 'شبیه‌سازی و تست‌های هیدرودینامیکی مبدل‌های امواج و سازه‌های متحرک دریایی.',
    fullDesc: 'پروژه پژوهشی تحت سرپرستی خانم دکتر مریم کامران در حوزه طراحی هیدرودینامیکی و کاربرد هوش مصنوعی در تخمین پایداری سازه‌های دریایی.',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=800',
    labId: 'l4',
    labName: 'آزمایشگاه لوله‌های حرارتی و انتقال حرارت',
    leadFacultyId: 'f_kamran',
    leadFacultyName: 'خانم دکتر مریم کامران',
    year: '۱۴۰۱ - ۱۴۰۲',
    status: 'تکمیل‌شده',
    outcomes: [
      'بهینه‌سازی فرم بدنه شناورهای تجاری و کاهش پسای آب تا ۱۱٪',
      'مدل‌سازی پیش‌بینی امواج با استفاده از شبکه عصبی'
    ]
  },
  {
    id: 'p5',
    title: 'طراحی سیستم تعلیق فعال و بهینه‌سازی شاسی خودروهای سنگین',
    clientCompany: 'شرکت ایران خودرو دیزل',
    clientLogo: '🚚',
    category: 'خودروسازی و حمل و نقل',
    shortDesc: 'افزایش پایداری اتوبوس‌ها و کامیون‌ها در پیچ‌های تند و جاده‌های ناهموار.',
    fullDesc: 'پروژه کلان بهینه‌سازی سیستم تعلیق و شاسی تحت مدیریت دکتر محمود سعادت فومنی.',
    imageUrl: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&q=80&w=800',
    labId: 'l6',
    labName: 'آزمایشگاه دینامیک خودرو و شاسی',
    leadFacultyId: 'f_saadat',
    leadFacultyName: 'دکتر محمود سعادت فومنی',
    year: '۱۴۰۲',
    status: 'تکمیل‌شده',
    outcomes: [
      'کاهش ۶۵ درصدی نوسانات بدنه در جاده‌های کوهستانی',
      'ارتقای استانداردهای دینامیکی شاسی'
    ]
  },
  {
    id: 'p6',
    title: 'ماشینکاری التراسونیک ۵ محوره و ساخت قطعات کامپوزیتی پیشرفته',
    clientCompany: 'صنایع قطعه‌سازی پیشرفته',
    clientLogo: '✈️',
    category: 'هوافضا و مواد پیشرفته',
    shortDesc: 'فرآیند ساخت و ماشینکاری دقیق قطعات با امواج التراسونیک به کمک ماشین ابزار CNC.',
    fullDesc: 'پروژه بومی‌سازی ماشینکاری قطعات سخت کامپوزیتی و سرامیکی تحت هدایت دکتر کیوان محمدی.',
    imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=800',
    labId: 'l3',
    labName: 'آزمایشگاه مواد مرکب و ساخت پیشرفته',
    leadFacultyId: 'f_mohammadi_k',
    leadFacultyName: 'دکتر کیوان محمدی',
    year: '۱۴۰۲ - ۱۴۰۳',
    status: 'در حال اجرا',
    outcomes: [
      'دست‌یابی به کیفیت سطح با زبری زیر ۰.۲ میکرون در ماشینکاری التراسونیک',
      'کاهش زمان ماشینکاری قطعات سخت تا ۴۰٪'
    ]
  }
];


export const INITIAL_REQUESTS: CollaborationRequest[] = [
  {
    id: 'req-101',
    fullName: 'مهندس بهزاد کریمی',
    company: 'شرکت توربوژنراتور صنعتی پارس',
    email: 'b.karimi@parsturbo.ir',
    phone: '۰۹۱۲۳۴۵۶۷۸۹',
    collabType: 'پژوهش مشترک',
    specializedField: 'مکانیک سیالات و دینامیک محاسباتی',
    description: 'نیاز به شبیه‌سازی عددی ۳ بعدی CFD توربولانس در محفظه ورودی کمپرسورهای گازی جهت رفع افت فشار غیرعادی در شرایط دمایی بالای ۵۰ درجه.',
    attachedFileName: 'Proposal_ParsTurbo_2026.pdf',
    attachedFileType: 'application/pdf',
    attachedFileSize: '۲.۴ مگابایت',
    createdAt: '۱۴۰۳/۰۵/۱۰ - ۱۰:۳۰',
    status: 'در حال بررسی',
    adminNotes: 'به دکتر علی محمدی (آزمایشگاه CFD) جهت ارزیابی اولیه ارجاع شد.'
  },
  {
    id: 'req-102',
    fullName: 'دکتر سارا نوری',
    company: 'صنایع رباتیک پیشرفته آریا',
    email: 'sara.nouri@ariarobotics.com',
    phone: '۰۹۱۸۸۷۶۵۴۳۲',
    collabType: 'استفاده از تجهیزات',
    specializedField: 'رباتیک و اتوماسیون',
    description: 'درخواست بهره‌برداری از اسکنر سه‌بعدی نوری آزمایشگاه رباتیک شریف جهت مهندسی معکوس و کنترل کیفیت ابعادی ۱۰ قطعه قالب‌سازی شده.',
    attachedFileName: 'Part_Specs_AriaRobotics.docx',
    attachedFileType: 'application/msword',
    attachedFileSize: '۱.۱ مگابایت',
    createdAt: '۱۴۰۳/۰۵/۱۲ - ۱۴:۱۵',
    status: 'پذیرفته‌شده',
    adminNotes: 'تجهیزات برای روز دوشنبه آینده رزرو گردید.'
  }
];
