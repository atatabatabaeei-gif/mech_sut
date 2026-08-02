export interface Lab {
  id: string;
  name: string;
  field: string;
  shortDesc: string; // 1-sentence abstract for list card
  fullDesc: string;
  imageUrl: string;
  supervisorId: string;
  supervisorName: string;
  members: string[];
  equipment: { name: string; specs: string }[];
  projects: string[]; // Project IDs or names
  gallery: string[];
  achievements: string[];
  location: string;
  contactEmail: string;
}

export interface FacultyMember {
  id: string;
  name: string;
  title: string; // e.g., استاد تمام, دانشیار, استادیار
  field: string;
  shortDesc: string; // 1-sentence abstract for list card
  bio: string;
  avatarUrl: string;
  email: string;
  phone: string;
  office: string;
  scholarUrl?: string;
  skills: string[];
  supervisedLabs: string[]; // Lab IDs
  projectsLed: string[];
  publications: string[];
}

export interface IndustrialProject {
  id: string;
  title: string;
  clientCompany: string;
  clientLogo?: string;
  category: string; // e.g., خودروسازی, نفت و گاز, انرژی, هوافضا, رباتیک, صنایع سنگین
  shortDesc: string;
  fullDesc: string;
  imageUrl: string;
  labId?: string;
  labName?: string;
  leadFacultyId?: string;
  leadFacultyName?: string;
  year: string;
  status: 'تکمیل‌شده' | 'در حال اجرا';
  outcomes: string[];
}

export interface CollaborationRequest {
  id: string;
  fullName: string;
  company: string;
  email: string;
  phone: string;
  collabType: 'پژوهش مشترک' | 'تحقیق قراردادی' | 'انتقال فناوری' | 'استفاده از تجهیزات' | 'کارآموزی و جذب استعداد' | 'مشاوره تخصصی';
  specializedField: string;
  description: string;
  targetEntityId?: string; // Optional target lab or faculty ID
  targetEntityType?: 'lab' | 'faculty';
  targetEntityName?: string;
  attachedFileName?: string;
  attachedFileType?: string;
  attachedFileSize?: string;
  attachedFileContent?: string; // Base64 or mock data URL
  createdAt: string;
  status: 'جدید' | 'در حال بررسی' | 'پذیرفته‌شده' | 'نیازمند جلسه' | 'آرشیو شده';
  adminNotes?: string;
}

export interface SecurityAuditLog {
  id: string;
  timestamp: string;
  action: string;
  ip: string;
  status: 'موفق' | 'ناموفق' | 'هشدار';
  details: string;
}

export interface FooterConfig {
  description: string;
  address: string;
  phones: string;
  email: string;
  sharifLinkUrl: string;
  sharifLinkText: string;
  copyrightText: string;
  collaborationAreas: string[];
}

export interface CollaborationBenefit {
  num: string;
  title: string;
  description: string;
}

export interface CollaborationModel {
  title: string;
  description: string;
}

export interface CollaborationPartner {
  name: string;
  icon: string;
}

export interface CollaborationPageConfig {
  headerCategory: string;
  headerTitle: string;
  headerDescription: string;
  benefitsTitle: string;
  benefits: CollaborationBenefit[];
  modelsTitle: string;
  models: CollaborationModel[];
  partnersTitle: string;
  partners: CollaborationPartner[];
  directContactEmail: string;
  directContactPhone: string;
  directContactFax: string;
}

export interface AdvantageItem {
  title: string;
  description: string;
}

export interface HomePageConfig {
  heroBadge: string;
  heroTitleLine1: string;
  heroTitleLine2: string;
  heroDescription: string;
  heroKeywords: string[];
  statsTitle: string;
  statsDescription: string;
  labsCount: number;
  facultyCount: number;
  partnersCount: number;
  projectsCount: number;
  responseTime: string;
  advantagesCategory: string;
  advantagesTitle: string;
  advantagesDescription: string;
  advantages: AdvantageItem[];
  ctaTitle: string;
  ctaDescription: string;
}

export interface AdminState {
  isLoggedIn: boolean;
  username: string;
  customPassword?: string;
  requires2FA: boolean;
  is2FAVerified: boolean;
  failedAttempts: number;
  lockoutUntil: number | null; // Timestamp
}
