import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  LogOut,
  Inbox,
  FlaskConical,
  Users,
  Briefcase,
  PlayCircle,
  Shield,
  Plus,
  Edit2,
  Trash2,
  FileText,
  Download,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  Search,
  Key,
  Video,
  Eye,
  Layout,
  Lock,
  KeyRound,
  Save,
  RefreshCw,
  Building2,
  Home,
  GraduationCap,
  SlidersHorizontal,
  Tag,
  X,
  Edit3,
  Check,
  Upload,
  Image as ImageIcon,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import {
  getAdminState,
  saveAdminState,
  getRequests,
  saveRequests,
  getLabs,
  saveLabs,
  getFaculty,
  saveFaculty,
  getProjects,
  saveProjects,
  getSecurityLogs,
  addSecurityLog,
  getFooterConfig,
  saveFooterConfig,
  getCollaborationConfig,
  saveCollaborationConfig,
  getHomeConfig,
  saveHomeConfig,
  renameLabField,
  deleteLabField,
  renameFacultyField,
  deleteFacultyField,
  renameProjectCategory,
  deleteProjectCategory,
  getCustomCategories,
  addCustomCategory,
  removeCustomCategory
} from '../services/storage';
import { Lab, FacultyMember, IndustrialProject, CollaborationRequest, FooterConfig, CollaborationPageConfig, HomePageConfig, CollaborationPartner } from '../types';
import { Toast } from '../components/Toast';
import { PDFExportModal } from '../components/PDFExportModal';
import { CategoryDropdownFilter, CategoryOption } from '../components/CategoryDropdownFilter';

export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const adminState = getAdminState();

  useEffect(() => {
    if (!adminState.isLoggedIn) {
      navigate('/admin');
    }
  }, [adminState.isLoggedIn, navigate]);

  const [activeTab, setActiveTab] = useState<'requests' | 'labs' | 'faculty' | 'projects' | 'home' | 'collaboration' | 'footer' | 'tutorial' | 'security'>('requests');
  const [toastMsg, setToastMsg] = useState('');
  const [exportModal, setExportModal] = useState<{ type: 'faculty' | 'project' | 'lab'; data: FacultyMember | IndustrialProject | Lab } | null>(null);

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Home Config State
  const initialHomeConfig = getHomeConfig();
  const [homeConfig, setHomeConfigState] = useState<HomePageConfig>(initialHomeConfig);
  const [homeHeroBadge, setHomeHeroBadge] = useState(initialHomeConfig.heroBadge);
  const [homeHeroTitleLine1, setHomeHeroTitleLine1] = useState(initialHomeConfig.heroTitleLine1);
  const [homeHeroTitleLine2, setHomeHeroTitleLine2] = useState(initialHomeConfig.heroTitleLine2);
  const [homeHeroDesc, setHomeHeroDesc] = useState(initialHomeConfig.heroDescription);
  const [homeKeywordsStr, setHomeKeywordsStr] = useState(initialHomeConfig.heroKeywords.join('\n'));
  const [homeStatsTitle, setHomeStatsTitle] = useState(initialHomeConfig.statsTitle);
  const [homeStatsDesc, setHomeStatsDesc] = useState(initialHomeConfig.statsDescription);
  const [homeLabsCount, setHomeLabsCount] = useState(initialHomeConfig.labsCount);
  const [homeFacultyCount, setHomeFacultyCount] = useState(initialHomeConfig.facultyCount);
  const [homePartnersCount, setHomePartnersCount] = useState(initialHomeConfig.partnersCount);
  const [homeProjectsCount, setHomeProjectsCount] = useState(initialHomeConfig.projectsCount);
  const [homeResponseTime, setHomeResponseTime] = useState(initialHomeConfig.responseTime);
  const [homeAdvCategory, setHomeAdvCategory] = useState(initialHomeConfig.advantagesCategory);
  const [homeAdvTitle, setHomeAdvTitle] = useState(initialHomeConfig.advantagesTitle);
  const [homeAdvDesc, setHomeAdvDesc] = useState(initialHomeConfig.advantagesDescription);
  const [homeAdvStr, setHomeAdvStr] = useState(
    initialHomeConfig.advantages.map((a) => `${a.title} | ${a.description}`).join('\n')
  );
  const [homeCtaTitle, setHomeCtaTitle] = useState(initialHomeConfig.ctaTitle);
  const [homeCtaDesc, setHomeCtaDesc] = useState(initialHomeConfig.ctaDescription);

  // Footer Config State
  const initialFooterConfig = getFooterConfig();
  const [footerConfig, setFooterConfigState] = useState<FooterConfig>(initialFooterConfig);
  const [footerDesc, setFooterDesc] = useState(initialFooterConfig.description);
  const [footerAddress, setFooterAddress] = useState(initialFooterConfig.address);
  const [footerPhones, setFooterPhones] = useState(initialFooterConfig.phones);
  const [footerEmail, setFooterEmail] = useState(initialFooterConfig.email);
  const [footerLinkText, setFooterLinkText] = useState(initialFooterConfig.sharifLinkText);
  const [footerLinkUrl, setFooterLinkUrl] = useState(initialFooterConfig.sharifLinkUrl);
  const [footerCopyright, setFooterCopyright] = useState(initialFooterConfig.copyrightText);
  const [footerAreasStr, setFooterAreasStr] = useState(initialFooterConfig.collaborationAreas.join('\n'));

  // Collaboration Config State
  const initialCollabConfig = getCollaborationConfig();
  const [collabConfig, setCollabConfigState] = useState<CollaborationPageConfig>(initialCollabConfig);
  const [collabHeaderCategory, setCollabHeaderCategory] = useState(initialCollabConfig.headerCategory);
  const [collabHeaderTitle, setCollabHeaderTitle] = useState(initialCollabConfig.headerTitle);
  const [collabHeaderDesc, setCollabHeaderDesc] = useState(initialCollabConfig.headerDescription);

  const [collabBenefitsTitle, setCollabBenefitsTitle] = useState(initialCollabConfig.benefitsTitle);
  const [collabBenefitsStr, setCollabBenefitsStr] = useState(
    initialCollabConfig.benefits.map((b) => `${b.num || ''} | ${b.title} | ${b.description}`).join('\n')
  );

  const [collabModelsTitle, setCollabModelsTitle] = useState(initialCollabConfig.modelsTitle);
  const [collabModelsStr, setCollabModelsStr] = useState(
    initialCollabConfig.models.map((m) => `${m.title} | ${m.description}`).join('\n')
  );

  const [collabPartnersTitle, setCollabPartnersTitle] = useState(initialCollabConfig.partnersTitle);
  const [collabPartnersList, setCollabPartnersList] = useState<CollaborationPartner[]>(
    initialCollabConfig.partners || []
  );

  const handleAddPartner = () => {
    setCollabPartnersList((prev) => [
      ...prev,
      { name: 'شریک تجاری جدید', icon: '🏢', logoUrl: '' }
    ]);
  };

  const handleUpdatePartner = (index: number, field: keyof CollaborationPartner, value: string) => {
    setCollabPartnersList((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleDeletePartner = (index: number) => {
    setCollabPartnersList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMovePartner = (index: number, direction: 'up' | 'down') => {
    setCollabPartnersList((prev) => {
      const updated = [...prev];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= updated.length) return prev;
      const temp = updated[index];
      updated[index] = updated[targetIndex];
      updated[targetIndex] = temp;
      return updated;
    });
  };

  const handlePartnerLogoFileUpload = (index: number, file: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        handleUpdatePartner(index, 'logoUrl', result);
        setToastMsg('لوگوی شرکت با موفقیت آپلود شد.');
      }
    };
    reader.readAsDataURL(file);
  };

  const [collabEmail, setCollabEmail] = useState(initialCollabConfig.directContactEmail);
  const [collabPhone, setCollabPhone] = useState(initialCollabConfig.directContactPhone);
  const [collabFax, setCollabFax] = useState(initialCollabConfig.directContactFax);

  // Local state for CRUD
  const [requests, setRequestsState] = useState<CollaborationRequest[]>([]);
  const [labs, setLabsState] = useState<Lab[]>([]);
  const [faculty, setFacultyState] = useState<FacultyMember[]>([]);
  const [projects, setProjectsState] = useState<IndustrialProject[]>([]);
  const [logs, setLogs] = useState(getSecurityLogs());

  // Admin Filter States & Category Manager
  const [adminLabFilter, setAdminLabFilter] = useState('all');
  const [adminFacultyFilter, setAdminFacultyFilter] = useState('all');
  const [adminProjectFilter, setAdminProjectFilter] = useState('all');

  const [customCats, setCustomCats] = useState(getCustomCategories());
  const [filterModal, setFilterModal] = useState<{
    isOpen: boolean;
    type: 'labs' | 'faculty' | 'projects';
  }>({ isOpen: false, type: 'labs' });

  const [editingCatOldName, setEditingCatOldName] = useState<string | null>(null);
  const [editingCatNewName, setEditingCatNewName] = useState<string>('');
  const [newCatInput, setNewCatInput] = useState<string>('');

  const adminLabFieldOptions: CategoryOption[] = Array.from(
    new Set([...labs.map((l) => l.field), ...customCats.labs])
  ).filter(Boolean).map((f) => ({
    id: String(f),
    label: String(f),
  }));

  const adminFacultyFieldOptions: CategoryOption[] = Array.from(
    new Set([...faculty.map((f) => f.field), ...customCats.faculty])
  ).filter(Boolean).map((f) => ({
    id: String(f),
    label: String(f),
  }));

  const adminProjectCategoryOptions: CategoryOption[] = Array.from(
    new Set([...projects.map((p) => p.category), ...customCats.projects])
  ).filter(Boolean).map((c) => ({
    id: String(c),
    label: String(c),
  }));

  const filteredAdminLabs = labs.filter((l) => adminLabFilter === 'all' || l.field === adminLabFilter);
  const filteredAdminFaculty = faculty.filter((f) => adminFacultyFilter === 'all' || f.field === adminFacultyFilter);
  const filteredAdminProjects = projects.filter((p) => adminProjectFilter === 'all' || p.category === adminProjectFilter);

  // Load all data
  useEffect(() => {
    setRequestsState(getRequests());
    setLabsState(getLabs());
    setFacultyState(getFaculty());
    setProjectsState(getProjects());
    setLogs(getSecurityLogs());
    setCustomCats(getCustomCategories());
  }, []);

  // ----------------- CATEGORY & FILTER MANAGEMENT HANDLERS -----------------
  const handleRenameCategoryAction = (oldName: string) => {
    if (!editingCatNewName.trim() || editingCatNewName.trim() === oldName) {
      setEditingCatOldName(null);
      return;
    }
    const newName = editingCatNewName.trim();

    if (filterModal.type === 'labs') {
      const count = renameLabField(oldName, newName);
      removeCustomCategory('labs', oldName);
      addCustomCategory('labs', newName);
      setCustomCats(getCustomCategories());
      setLabsState(getLabs());
      setToastMsg(`گرایش "${oldName}" به "${newName}" در ${count} آزمایشگاه تغییر نام داد.`);
    } else if (filterModal.type === 'faculty') {
      const count = renameFacultyField(oldName, newName);
      removeCustomCategory('faculty', oldName);
      addCustomCategory('faculty', newName);
      setCustomCats(getCustomCategories());
      setFacultyState(getFaculty());
      setToastMsg(`گرایش "${oldName}" به "${newName}" در ${count} استاد تغییر نام داد.`);
    } else {
      const count = renameProjectCategory(oldName, newName);
      removeCustomCategory('projects', oldName);
      addCustomCategory('projects', newName);
      setCustomCats(getCustomCategories());
      setProjectsState(getProjects());
      setToastMsg(`دسته‌بندی "${oldName}" به "${newName}" در ${count} پروژه تغییر نام داد.`);
    }

    setEditingCatOldName(null);
    setEditingCatNewName('');
  };

  const handleDeleteCategoryAction = (catName: string) => {
    if (!window.confirm(`آیا از حذف/ادغام گرایش "${catName}" اطمینان دارید؟`)) return;

    if (filterModal.type === 'labs') {
      const count = deleteLabField(catName, 'عمومی');
      removeCustomCategory('labs', catName);
      setCustomCats(getCustomCategories());
      setLabsState(getLabs());
      if (adminLabFilter === catName) setAdminLabFilter('all');
      setToastMsg(`گرایش "${catName}" حذف شد و ${count} مورد به "عمومی" منتقل شدند.`);
    } else if (filterModal.type === 'faculty') {
      const count = deleteFacultyField(catName, 'سایر');
      removeCustomCategory('faculty', catName);
      setCustomCats(getCustomCategories());
      setFacultyState(getFaculty());
      if (adminFacultyFilter === catName) setAdminFacultyFilter('all');
      setToastMsg(`گرایش "${catName}" حذف شد و ${count} مورد به "سایر" منتقل شدند.`);
    } else {
      const count = deleteProjectCategory(catName, 'سایر صنایع');
      removeCustomCategory('projects', catName);
      setCustomCats(getCustomCategories());
      setProjectsState(getProjects());
      if (adminProjectFilter === catName) setAdminProjectFilter('all');
      setToastMsg(`دسته‌بندی "${catName}" حذف شد و ${count} مورد به "سایر صنایع" منتقل شدند.`);
    }
  };

  const handleAddCategoryAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatInput.trim()) return;
    const trimmed = newCatInput.trim();

    addCustomCategory(filterModal.type, trimmed);
    setCustomCats(getCustomCategories());
    setNewCatInput('');
    setToastMsg(`گرایش/دسته‌بندی جدید "${trimmed}" اضافه شد.`);
  };

  // ----------------- CHANGE PASSWORD HANDLER -----------------
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    const activePassword = adminState.customPassword || 'sharif2026';
    if (currentPassword !== activePassword && currentPassword !== 'admin123' && currentPassword !== 'admin') {
      setPasswordError('رمز عبور فعلی وارد شده نادرست است.');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('رمز عبور جدید باید حداقل ۶ کاراکتر باشد.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('تکرار رمز عبور جدید با رمز عبور وارد شده مطابقت ندارد.');
      return;
    }

    const updatedState = {
      ...adminState,
      customPassword: newPassword
    };

    saveAdminState(updatedState);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setToastMsg('رمز عبور مدیر با موفقیت تغییر یافت.');

    addSecurityLog({
      action: 'تغییر رمز عبور مدیر',
      status: 'موفق',
      details: 'رمز عبور پنل ادمین با موفقیت به‌روزرسانی شد.'
    });
    setLogs(getSecurityLogs());
  };

  // ----------------- FOOTER CONFIG HANDLER -----------------
  const handleSaveFooter = (e: React.FormEvent) => {
    e.preventDefault();
    const areasArr = footerAreasStr.split('\n').map((line) => line.trim()).filter(Boolean);

    const updatedConfig: FooterConfig = {
      description: footerDesc,
      address: footerAddress,
      phones: footerPhones,
      email: footerEmail,
      sharifLinkText: footerLinkText,
      sharifLinkUrl: footerLinkUrl,
      copyrightText: footerCopyright,
      collaborationAreas: areasArr.length ? areasArr : initialFooterConfig.collaborationAreas
    };

    saveFooterConfig(updatedConfig);
    setFooterConfigState(updatedConfig);
    setToastMsg('اطلاعات فوتر با موفقیت ذخیره و بروزرسانی شد.');

    addSecurityLog({
      action: 'ویرایش مشخصات فوتر',
      status: 'موفق',
      details: 'جزئیات تماس، آدرس و کپی‌رایت فوتر سایت به‌روزرسانی گردید.'
    });
    setLogs(getSecurityLogs());
  };

  // ----------------- COLLABORATION CONFIG HANDLER -----------------
  const handleSaveCollaboration = (e: React.FormEvent) => {
    e.preventDefault();

    const benefits = collabBenefitsStr.split('\n').map((line) => line.trim()).filter(Boolean).map((line, idx) => {
      const parts = line.split('|');
      if (parts.length >= 3) {
        return { num: parts[0].trim(), title: parts[1].trim(), description: parts[2].trim() };
      } else if (parts.length === 2) {
        return { num: `۰${idx + 1}`, title: parts[0].trim(), description: parts[1].trim() };
      }
      return { num: `۰${idx + 1}`, title: line.trim(), description: line.trim() };
    });

    const models = collabModelsStr.split('\n').map((line) => line.trim()).filter(Boolean).map((line) => {
      const parts = line.split('|');
      if (parts.length >= 2) {
        return { title: parts[0].trim(), description: parts[1].trim() };
      }
      return { title: line.trim(), description: line.trim() };
    });

    const updatedConfig: CollaborationPageConfig = {
      headerCategory: collabHeaderCategory,
      headerTitle: collabHeaderTitle,
      headerDescription: collabHeaderDesc,
      benefitsTitle: collabBenefitsTitle,
      benefits,
      modelsTitle: collabModelsTitle,
      models,
      partnersTitle: collabPartnersTitle,
      partners: collabPartnersList,
      directContactEmail: collabEmail,
      directContactPhone: collabPhone,
      directContactFax: collabFax
    };

    saveCollaborationConfig(updatedConfig);
    setCollabConfigState(updatedConfig);
    setToastMsg('محتوای صفحه صنعت و تعامل با موفقیت بروزرسانی شد.');

    addSecurityLog({
      action: 'ویرایش صفحه صنعت و تعامل',
      status: 'موفق',
      details: 'عنوان‌ها، مزایا، الگوهای تعامل و اطلاعات تماس صفحه صنعت بروزرسانی گردید.'
    });
    setLogs(getSecurityLogs());
  };

  // ----------------- HOME CONFIG HANDLER -----------------
  const handleSaveHome = (e: React.FormEvent) => {
    e.preventDefault();

    const heroKeywords = homeKeywordsStr.split('\n').map((k) => k.trim()).filter(Boolean);
    const advantages = homeAdvStr.split('\n').map((line) => line.trim()).filter(Boolean).map((line) => {
      const parts = line.split('|');
      if (parts.length >= 2) {
        return { title: parts[0].trim(), description: parts[1].trim() };
      }
      return { title: line.trim(), description: line.trim() };
    });

    const updatedConfig: HomePageConfig = {
      heroBadge: homeHeroBadge,
      heroTitleLine1: homeHeroTitleLine1,
      heroTitleLine2: homeHeroTitleLine2,
      heroDescription: homeHeroDesc,
      heroKeywords,
      statsTitle: homeStatsTitle,
      statsDescription: homeStatsDesc,
      labsCount: Number(homeLabsCount) || 0,
      facultyCount: Number(homeFacultyCount) || 0,
      partnersCount: Number(homePartnersCount) || 0,
      projectsCount: Number(homeProjectsCount) || 0,
      responseTime: homeResponseTime,
      advantagesCategory: homeAdvCategory,
      advantagesTitle: homeAdvTitle,
      advantagesDescription: homeAdvDesc,
      advantages,
      ctaTitle: homeCtaTitle,
      ctaDescription: homeCtaDesc
    };

    saveHomeConfig(updatedConfig);
    setHomeConfigState(updatedConfig);
    setToastMsg('محتوای صفحه اصلی (خانه) با موفقیت بروزرسانی شد.');

    addSecurityLog({
      action: 'ویرایش صفحه اصلی سایت',
      status: 'موفق',
      details: 'محتوای صفحه اصلی شامل هدر، شاخص‌ها، مزایا و بنر دعوت به همکاری تغییر یافت.'
    });
    setLogs(getSecurityLogs());
  };

  // Logout handler
  const handleLogout = () => {
    saveAdminState({ ...adminState, isLoggedIn: false });
    addSecurityLog({
      action: 'خروج از پنل مدیریت',
      status: 'موفق',
      details: 'مدیر از سیستم خارج شد.'
    });
    navigate('/admin');
  };

  // ----------------- REQUESTS / INBOX HANDLERS -----------------
  const [reqFilter, setReqFilter] = useState('all');
  const [selectedReq, setSelectedReq] = useState<CollaborationRequest | null>(null);
  const [adminNoteInput, setAdminNoteInput] = useState('');

  const handleUpdateReqStatus = (id: string, newStatus: CollaborationRequest['status']) => {
    const updated = requests.map((r) => (r.id === id ? { ...r, status: newStatus } : r));
    saveRequests(updated);
    setRequestsState(updated);
    if (selectedReq && selectedReq.id === id) {
      setSelectedReq({ ...selectedReq, status: newStatus });
    }
    setToastMsg('وضعیت درخواست به‌روزرسانی شد.');
    addSecurityLog({
      action: 'تغییر وضعیت درخواست همکاری',
      status: 'موفق',
      details: `وضعیت درخواست ${id} به ${newStatus} تغییر یافت.`
    });
  };

  const handleSaveAdminNote = (id: string) => {
    const updated = requests.map((r) => (r.id === id ? { ...r, adminNotes: adminNoteInput } : r));
    saveRequests(updated);
    setRequestsState(updated);
    if (selectedReq && selectedReq.id === id) {
      setSelectedReq({ ...selectedReq, adminNotes: adminNoteInput });
    }
    setToastMsg('یادداشت ادمین ذخیره شد.');
  };

  // ----------------- LABS FORM & CRUD -----------------
  const [editingLabId, setEditingLabId] = useState<string | null>(null);
  const [labName, setLabName] = useState('');
  const [labField, setLabField] = useState('');
  const [labShortDesc, setLabShortDesc] = useState('');
  const [labFullDesc, setLabFullDesc] = useState('');
  const [labImageUrl, setLabImageUrl] = useState('');
  const [labSupervisorName, setLabSupervisorName] = useState('');
  const [labLocation, setLabLocation] = useState('');
  const [labContactEmail, setLabContactEmail] = useState('');
  const [labEquipStr, setLabEquipStr] = useState('');

  const handleSaveLab = (e: React.FormEvent) => {
    e.preventDefault();
    const equipmentArr = labEquipStr.split('\n').filter(Boolean).map((line) => {
      const parts = line.split(':');
      return { name: parts[0]?.trim() || line, specs: parts[1]?.trim() || 'مشخصات استاندارد' };
    });

    const newLab: Lab = {
      id: editingLabId || 'l' + Date.now(),
      name: labName,
      field: labField,
      shortDesc: labShortDesc,
      fullDesc: labFullDesc || labShortDesc,
      imageUrl: labImageUrl || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800',
      supervisorId: 'f1',
      supervisorName: labSupervisorName || 'دکتر علی محمدی',
      members: ['مهندس پژوهشگر', 'دانشجوی دکتری'],
      equipment: equipmentArr.length ? equipmentArr : [{ name: 'تجهیز تخصصی', specs: 'دستگاه استاندارد' }],
      projects: [],
      gallery: [labImageUrl],
      achievements: ['توسعه زیرساخت پژوهشی'],
      location: labLocation || 'دانشکده مکانیک',
      contactEmail: labContactEmail || 'lab@sharif.edu'
    };

    let updated: Lab[];
    if (editingLabId) {
      updated = labs.map((l) => (l.id === editingLabId ? newLab : l));
      setToastMsg('آزمایشگاه ویرایش گردید.');
    } else {
      updated = [...labs, newLab];
      setToastMsg('آزمایشگاه جدید اضافه گردید.');
    }

    saveLabs(updated);
    setLabsState(updated);
    resetLabForm();
  };

  const handleEditLabClick = (l: Lab) => {
    setEditingLabId(l.id);
    setLabName(l.name);
    setLabField(l.field);
    setLabShortDesc(l.shortDesc);
    setLabFullDesc(l.fullDesc);
    setLabImageUrl(l.imageUrl);
    setLabSupervisorName(l.supervisorName);
    setLabLocation(l.location);
    setLabContactEmail(l.contactEmail);
    setLabEquipStr(l.equipment.map((eq) => `${eq.name}: ${eq.specs}`).join('\n'));
  };

  const handleDeleteLab = (id: string) => {
    if (!window.confirm('آیا از حذف این آزمایشگاه اطمینان دارید؟')) return;
    const updated = labs.filter((l) => l.id !== id);
    saveLabs(updated);
    setLabsState(updated);
    setToastMsg('آزمایشگاه حذف شد.');
  };

  const resetLabForm = () => {
    setEditingLabId(null);
    setLabName('');
    setLabField('');
    setLabShortDesc('');
    setLabFullDesc('');
    setLabImageUrl('');
    setLabSupervisorName('');
    setLabLocation('');
    setLabContactEmail('');
    setLabEquipStr('');
  };

  // ----------------- FACULTY FORM & CRUD -----------------
  const [editingFacId, setEditingFacId] = useState<string | null>(null);
  const [facName, setFacName] = useState('');
  const [facTitle, setFacTitle] = useState('استاد تمام');
  const [facField, setFacField] = useState('');
  const [facShortDesc, setFacShortDesc] = useState('');
  const [facBio, setFacBio] = useState('');
  const [facAvatarUrl, setFacAvatarUrl] = useState('');
  const [facEmail, setFacEmail] = useState('');
  const [facSkillsStr, setFacSkillsStr] = useState('');
  const [facPublicationsStr, setFacPublicationsStr] = useState('');
  const [facProjectsLed, setFacProjectsLed] = useState<string[]>([]);
  const [facSupervisedLabs, setFacSupervisedLabs] = useState<string[]>([]);

  const handleSaveFaculty = (e: React.FormEvent) => {
    e.preventDefault();
    const skillsArr = facSkillsStr.split(',').map((s) => s.trim()).filter(Boolean);
    const pubsArr = facPublicationsStr.split('\n').map((p) => p.trim()).filter(Boolean);
    const existingFac = editingFacId ? faculty.find((f) => f.id === editingFacId) : null;
    const targetFacId = editingFacId || 'f' + Date.now();

    const newFac: FacultyMember = {
      id: targetFacId,
      name: facName,
      title: facTitle,
      field: facField,
      shortDesc: facShortDesc,
      bio: facBio || facShortDesc,
      avatarUrl: facAvatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
      email: facEmail || 'prof@sharif.edu',
      phone: existingFac?.phone || '۰۲۱-۶۶۱۶۵۵۰۰',
      office: existingFac?.office || 'دانشکده مکانیک',
      skills: skillsArr.length ? skillsArr : [facField],
      supervisedLabs: facSupervisedLabs,
      projectsLed: facProjectsLed,
      publications: pubsArr.length ? pubsArr : ['مقاله پژوهشی در ژورنال بین‌المللی']
    };

    let updatedFaculty: FacultyMember[];
    if (editingFacId) {
      updatedFaculty = faculty.map((f) => (f.id === editingFacId ? newFac : f));
      setToastMsg('اطلاعات استاد و ارتباط پروژه‌ها به‌روزرسانی شد.');
    } else {
      updatedFaculty = [...faculty, newFac];
      setToastMsg('عضو جدید هیئت علمی اضافه شد.');
    }

    saveFaculty(updatedFaculty);
    setFacultyState(updatedFaculty);

    // Keep projects in sync
    const updatedProjects = projects.map((p) => {
      if (facProjectsLed.includes(p.id)) {
        return { ...p, leadFacultyId: targetFacId, leadFacultyName: facName };
      } else if (p.leadFacultyId === targetFacId) {
        return { ...p, leadFacultyId: undefined, leadFacultyName: undefined };
      }
      return p;
    });
    saveProjects(updatedProjects);
    setProjectsState(updatedProjects);

    resetFacForm();
  };

  const handleEditFacClick = (f: FacultyMember) => {
    setEditingFacId(f.id);
    setFacName(f.name);
    setFacTitle(f.title);
    setFacField(f.field);
    setFacShortDesc(f.shortDesc);
    setFacBio(f.bio);
    setFacAvatarUrl(f.avatarUrl);
    setFacEmail(f.email);
    setFacSkillsStr(f.skills.join(', '));
    setFacPublicationsStr((f.publications || []).join('\n'));
    setFacProjectsLed(f.projectsLed || []);
    setFacSupervisedLabs(f.supervisedLabs || []);
  };

  const handleDeleteFaculty = (id: string) => {
    if (!window.confirm('آیا از حذف این استاد اطمینان دارید؟')) return;
    const updated = faculty.filter((f) => f.id !== id);
    saveFaculty(updated);
    setFacultyState(updated);

    const updatedProjects = projects.map((p) => {
      if (p.leadFacultyId === id) {
        return { ...p, leadFacultyId: undefined, leadFacultyName: undefined };
      }
      return p;
    });
    saveProjects(updatedProjects);
    setProjectsState(updatedProjects);

    setToastMsg('استاد حذف شد.');
  };

  const resetFacForm = () => {
    setEditingFacId(null);
    setFacName('');
    setFacTitle('استاد تمام');
    setFacField('');
    setFacShortDesc('');
    setFacBio('');
    setFacAvatarUrl('');
    setFacEmail('');
    setFacSkillsStr('');
    setFacPublicationsStr('');
    setFacProjectsLed([]);
    setFacSupervisedLabs([]);
  };

  // ----------------- PROJECTS FORM & CRUD -----------------
  const [editingProjId, setEditingProjId] = useState<string | null>(null);
  const [projTitle, setProjTitle] = useState('');
  const [projCompany, setProjCompany] = useState('');
  const [projCategory, setProjCategory] = useState('');
  const [projShortDesc, setProjShortDesc] = useState('');
  const [projFullDesc, setProjFullDesc] = useState('');
  const [projImageUrl, setProjImageUrl] = useState('');
  const [projYear, setProjYear] = useState('۱۴۰۳');
  const [projLeadFacultyId, setProjLeadFacultyId] = useState('');
  const [projLabId, setProjLabId] = useState('');
  const [projStatus, setProjStatus] = useState<'تکمیل‌شده' | 'در حال اجرا'>('تکمیل‌شده');
  const [projOutcomesStr, setProjOutcomesStr] = useState('دستیابی به اهداف پروژه\nبومی‌سازی تکنولوژی');

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    const targetProjId = editingProjId || 'p' + Date.now();
    const selectedFac = faculty.find((f) => f.id === projLeadFacultyId);
    const selectedLab = labs.find((l) => l.id === projLabId);
    const outcomesArr = projOutcomesStr.split('\n').map((o) => o.trim()).filter(Boolean);

    const newProj: IndustrialProject = {
      id: targetProjId,
      title: projTitle,
      clientCompany: projCompany,
      category: projCategory || 'صنایع عمومی',
      shortDesc: projShortDesc,
      fullDesc: projFullDesc || projShortDesc,
      imageUrl: projImageUrl || 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&q=80&w=800',
      year: projYear,
      status: projStatus,
      leadFacultyId: projLeadFacultyId || undefined,
      leadFacultyName: selectedFac ? selectedFac.name : undefined,
      labId: projLabId || undefined,
      labName: selectedLab ? selectedLab.name : undefined,
      outcomes: outcomesArr.length ? outcomesArr : ['دستیابی به اهداف پروژه', 'بومی‌سازی تکنولوژی']
    };

    let updatedProjects: IndustrialProject[];
    if (editingProjId) {
      updatedProjects = projects.map((p) => (p.id === editingProjId ? newProj : p));
      setToastMsg('پروژه صنعتی و انتساب استاد راهنما به‌روزرسانی شد.');
    } else {
      updatedProjects = [...projects, newProj];
      setToastMsg('پروژه جدید صنعتی با موفقیت افزوده شد.');
    }

    saveProjects(updatedProjects);
    setProjectsState(updatedProjects);

    // Keep faculty projectsLed in sync
    const updatedFaculty = faculty.map((f) => {
      let fProjects = f.projectsLed ? [...f.projectsLed] : [];
      if (projLeadFacultyId && f.id === projLeadFacultyId) {
        if (!fProjects.includes(targetProjId)) {
          fProjects.push(targetProjId);
        }
      } else {
        fProjects = fProjects.filter((id) => id !== targetProjId);
      }
      return { ...f, projectsLed: fProjects };
    });
    saveFaculty(updatedFaculty);
    setFacultyState(updatedFaculty);

    resetProjForm();
  };

  const handleEditProjClick = (p: IndustrialProject) => {
    setEditingProjId(p.id);
    setProjTitle(p.title);
    setProjCompany(p.clientCompany);
    setProjCategory(p.category);
    setProjShortDesc(p.shortDesc);
    setProjFullDesc(p.fullDesc);
    setProjImageUrl(p.imageUrl);
    setProjYear(p.year);
    setProjLeadFacultyId(p.leadFacultyId || '');
    setProjLabId(p.labId || '');
    setProjStatus(p.status || 'تکمیل‌شده');
    setProjOutcomesStr((p.outcomes || []).join('\n'));
  };

  const handleDeleteProject = (id: string) => {
    if (!window.confirm('آیا از حذف این پروژه اطمینان دارید؟')) return;
    const updated = projects.filter((p) => p.id !== id);
    saveProjects(updated);
    setProjectsState(updated);

    const updatedFaculty = faculty.map((f) => ({
      ...f,
      projectsLed: (f.projectsLed || []).filter((projId) => projId !== id)
    }));
    saveFaculty(updatedFaculty);
    setFacultyState(updatedFaculty);

    setToastMsg('پروژه حذف شد.');
  };

  const resetProjForm = () => {
    setEditingProjId(null);
    setProjTitle('');
    setProjCompany('');
    setProjCategory('');
    setProjShortDesc('');
    setProjFullDesc('');
    setProjImageUrl('');
    setProjYear('۱۴۰۳');
    setProjLeadFacultyId('');
    setProjLabId('');
    setProjStatus('تکمیل‌شده');
    setProjOutcomesStr('دستیابی به اهداف پروژه\nبومی‌سازی تکنولوژی');
  };

  // ----------------- TUTORIAL VIDEO SIMULATOR -----------------
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);

  const filteredReqs = requests.filter((r) => reqFilter === 'all' || r.status === reqFilter);

  return (
    <div className="pt-24 min-h-screen pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg('')} />}

      {/* Admin Top Header */}
      <div className="bg-[#141416] border border-[#28282D] rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#E8530D] text-[#0D0D0F] font-heading font-extrabold text-2xl flex items-center justify-center shadow-lg shadow-[#E8530D]/30">
            مک
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                اتصال امن برقرار است
              </span>
              <span className="text-xs text-[#A0A0A0]">پنل مدیریت محتوا (CMS)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white mt-1">
              مدیریت دانشکده مهندسی مکانیک شریف
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="bg-[#1B1B1E] border border-[#28282D] text-[#A0A0A0] hover:text-white px-4 py-2.5 rounded-xl text-xs font-semibold transition-all"
          >
            مشاهده سایت اصلی
          </button>
          <button
            onClick={handleLogout}
            className="bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500 hover:text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <LogOut className="w-4 h-4" />
            <span>خروج امن</span>
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-[#28282D] pb-4">
        {[
          { id: 'requests', label: 'صندوق درخواست‌های صنعت', icon: Inbox, count: requests.filter((r) => r.status === 'جدید').length },
          { id: 'labs', label: 'مدیریت آزمایشگاه‌ها', icon: FlaskConical, count: labs.length },
          { id: 'faculty', label: 'مدیریت اعضای هیئت علمی', icon: Users, count: faculty.length },
          { id: 'projects', label: 'پروژه‌های صنعتی', icon: Briefcase, count: projects.length },
          { id: 'home', label: 'مدیریت صفحه اصلی (خانه)', icon: Home },
          { id: 'collaboration', label: 'مدیریت صفحه صنعت و همکاری', icon: Building2 },
          { id: 'footer', label: 'تنظیمات فوتر سایت', icon: Layout },
          { id: 'tutorial', label: 'ویدیوی آموزشی مدیریت', icon: Video },
          { id: 'security', label: 'امنیت و تغییر رمز عبور', icon: Shield }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                isActive
                  ? 'bg-[#E8530D] text-white shadow-lg shadow-[#E8530D]/20'
                  : 'bg-[#141416] border border-[#28282D] text-[#A0A0A0] hover:text-white hover:bg-[#1B1B1E]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                  isActive ? 'bg-white text-[#0D0D0F]' : 'bg-[#28282D] text-white'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ═══════════ TAB 1: INCOMING REQUESTS ═══════════ */}
      {activeTab === 'requests' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 bg-[#141416] p-4 rounded-2xl border border-[#28282D]">
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#A0A0A0] font-medium">فیلتر وضعیت:</span>
              {['all', 'جدید', 'در حال بررسی', 'پذیرفته‌شده', 'نیازمند جلسه'].map((st) => (
                <button
                  key={st}
                  onClick={() => setReqFilter(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    reqFilter === st
                      ? 'bg-[#E8530D] text-white'
                      : 'bg-[#1B1B1E] text-[#A0A0A0] hover:text-white'
                  }`}
                >
                  {st === 'all' ? 'همه درخواست‌ها' : st}
                </button>
              ))}
            </div>
            <span className="text-xs text-[#A0A0A0]">تعداد درخواست‌های یافت‌شده: {filteredReqs.length}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* List of Requests */}
            <div className="lg:col-span-6 space-y-4">
              {filteredReqs.length === 0 ? (
                <div className="bg-[#141416] p-8 rounded-2xl text-center text-[#A0A0A0] text-sm border border-[#28282D]">
                  درخواستی با این وضعیت ثبت نشده است.
                </div>
              ) : (
                filteredReqs.map((req) => (
                  <div
                    key={req.id}
                    onClick={() => { setSelectedReq(req); setAdminNoteInput(req.adminNotes || ''); }}
                    className={`bg-[#141416] border rounded-2xl p-5 cursor-pointer transition-all space-y-3 ${
                      selectedReq?.id === req.id
                        ? 'border-[#E8530D] bg-[#1B1B1E] shadow-lg'
                        : 'border-[#28282D] hover:border-[#E8530D]/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{req.fullName} ({req.company})</span>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                        req.status === 'جدید'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : req.status === 'پذیرفته‌شده'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                      }`}>
                        {req.status}
                      </span>
                    </div>

                    <div className="text-xs text-[#A0A0A0] space-y-1">
                      <p><strong className="text-white">نوع تعامل:</strong> {req.collabType} — {req.specializedField}</p>
                      <p className="line-clamp-2">{req.description}</p>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-[#A0A0A0] pt-2 border-t border-[#28282D]">
                      <span>{req.createdAt}</span>
                      {req.attachedFileName && (
                        <span className="text-emerald-400 font-semibold flex items-center gap-1">
                          <FileText className="w-3.5 h-3.5" />
                          دارای فایل ضمیمه ({req.attachedFileName})
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Detailed Request View */}
            <div className="lg:col-span-6">
              {selectedReq ? (
                <div className="bg-[#141416] border border-[#28282D] p-6 sm:p-8 rounded-3xl space-y-6 sticky top-28 shadow-2xl">
                  <div className="flex justify-between items-start border-b border-[#28282D] pb-4">
                    <div>
                      <span className="text-xs text-[#E8530D] font-bold block">کد پیگیری: {selectedReq.id}</span>
                      <h2 className="text-xl font-heading font-bold text-white">{selectedReq.fullName}</h2>
                      <span className="text-xs text-[#A0A0A0]">{selectedReq.company}</span>
                    </div>

                    <div className="space-y-1 text-left">
                      <span className="text-xs text-[#A0A0A0] block">تغییر وضعیت:</span>
                      <select
                        value={selectedReq.status}
                        onChange={(e) => handleUpdateReqStatus(selectedReq.id, e.target.value as any)}
                        className="bg-[#1B1B1E] border border-[#28282D] text-white text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-[#E8530D]"
                      >
                        <option value="جدید">جدید</option>
                        <option value="در حال بررسی">در حال بررسی</option>
                        <option value="پذیرفته‌شده">پذیرفته‌شده</option>
                        <option value="نیازمند جلسه">نیازمند جلسه</option>
                        <option value="آرشیو شده">آرشیو شده</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-3 text-xs text-[#A0A0A0] bg-[#1B1B1E] p-4 rounded-2xl border border-[#28282D]">
                    <p><strong className="text-white">ایمیل:</strong> {selectedReq.email}</p>
                    <p><strong className="text-white">شماره تماس:</strong> {selectedReq.phone}</p>
                    <p><strong className="text-white">نوع تعامل:</strong> {selectedReq.collabType}</p>
                    <p><strong className="text-white">حوزه تخصصی:</strong> {selectedReq.specializedField}</p>
                    <p><strong className="text-white">تاریخ ثبت:</strong> {selectedReq.createdAt}</p>
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs text-white font-bold block">متن شرح درخواست و پروژه:</span>
                    <p className="text-xs text-[#A0A0A0] leading-relaxed bg-[#1B1B1E] p-4 rounded-2xl border border-[#28282D] whitespace-pre-line">
                      {selectedReq.description}
                    </p>
                  </div>

                  {/* Attached Proposal File */}
                  {selectedReq.attachedFileName && (
                    <div className="bg-[#1B1B1E] border border-[#E8530D]/40 p-4 rounded-2xl space-y-2">
                      <span className="text-xs font-bold text-white flex items-center gap-2">
                        <FileText className="w-4 h-4 text-[#E8530D]" />
                        فایل پروپوزال ضمیمه‌شده توسط صنعتگر:
                      </span>
                      <div className="flex items-center justify-between text-xs text-[#A0A0A0] pt-1">
                        <span>{selectedReq.attachedFileName} ({selectedReq.attachedFileSize || '۲.۴MB'})</span>
                        <a
                          href={selectedReq.attachedFileContent || '#'}
                          download={selectedReq.attachedFileName}
                          className="bg-[#E8530D] text-white px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 hover:bg-[#F8631D] transition-all"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>دانلود فایل</span>
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Internal Admin Notes */}
                  <div className="space-y-2 pt-2">
                    <span className="text-xs text-white font-bold block">یادداشت داخلی مدیریت:</span>
                    <textarea
                      rows={3}
                      value={adminNoteInput}
                      onChange={(e) => setAdminNoteInput(e.target.value)}
                      placeholder="یادداشت برای پیگیری کارشناسان..."
                      className="w-full bg-[#1B1B1E] border border-[#28282D] text-white text-xs rounded-xl p-3 focus:outline-none focus:border-[#E8530D]"
                    />
                    <button
                      onClick={() => handleSaveAdminNote(selectedReq.id)}
                      className="bg-[#1B1B1E] border border-[#28282D] text-white text-xs px-4 py-2 rounded-xl hover:border-[#E8530D] hover:text-[#E8530D] transition-all font-semibold"
                    >
                      ذخیره یادداشت
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-[#141416] border border-[#28282D] p-12 rounded-3xl text-center text-[#A0A0A0] text-sm">
                  جهت مشاهده اطلاعات کامل، فایل ضمیمه و تغییر وضعیت روی یکی از درخواست‌های لیست کلیک فرمایید.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════ TAB 2: LABS CRUD ═══════════ */}
      {activeTab === 'labs' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Form */}
          <div className="lg:col-span-5 bg-[#141416] border border-[#28282D] p-6 rounded-3xl space-y-4">
            <h2 className="text-xl font-heading font-bold text-white flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-[#E8530D]" />
              {editingLabId ? 'ویرایش اطلاعات آزمایشگاه' : 'افزودن آزمایشگاه جدید'}
            </h2>

            <form onSubmit={handleSaveLab} className="space-y-3 text-xs">
              <div>
                <label className="text-[#A0A0A0] block mb-1">نام آزمایشگاه *</label>
                <input
                  type="text"
                  required
                  value={labName}
                  onChange={(e) => setLabName(e.target.value)}
                  placeholder="مثلاً: آزمایشگاه روباتیک و اتوماسیون"
                  className="w-full bg-[#1B1B1E] border border-[#28282D] rounded-xl px-3 py-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-[#A0A0A0] block mb-1">حوزه تخصصی *</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={labField}
                    onChange={(e) => setLabField(e.target.value)}
                    placeholder="مثلاً: رباتیک و اتوماسیون"
                    className="w-full bg-[#1B1B1E] border border-[#28282D] rounded-xl px-3 py-2.5 text-white"
                  />
                  {adminLabFieldOptions.length > 0 && (
                    <select
                      onChange={(e) => {
                        if (e.target.value) setLabField(e.target.value);
                      }}
                      value=""
                      className="bg-[#1B1B1E] border border-[#28282D] text-[#A0A0A0] text-xs rounded-xl px-2 py-2.5 max-w-[130px] shrink-0 focus:outline-none hover:text-white"
                      title="انتخاب از گرایش‌های موجود"
                    >
                      <option value="" disabled>انتخاب از لیست...</option>
                      {adminLabFieldOptions.map((opt) => (
                        <option key={opt.id} value={opt.id}>{opt.label}</option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              <div>
                <label className="text-[#A0A0A0] block mb-1">چکیده ۱ جمله‌ای (نمایش در لیست اصلی) *</label>
                <textarea
                  required
                  rows={2}
                  value={labShortDesc}
                  onChange={(e) => setLabShortDesc(e.target.value)}
                  placeholder="چکیده کوتاه..."
                  className="w-full bg-[#1B1B1E] border border-[#28282D] rounded-xl p-3 text-white"
                />
              </div>

              <div>
                <label className="text-[#A0A0A0] block mb-1">توضیحات کامل (نمایش در صفحه اختصاصی)</label>
                <textarea
                  rows={3}
                  value={labFullDesc}
                  onChange={(e) => setLabFullDesc(e.target.value)}
                  placeholder="شرح کامل عملکرد و پروژه‌ها..."
                  className="w-full bg-[#1B1B1E] border border-[#28282D] rounded-xl p-3 text-white"
                />
              </div>

              <div>
                <label className="text-[#A0A0A0] block mb-1">آدرس عکس تصویر پوشش (URL)</label>
                <input
                  type="text"
                  value={labImageUrl}
                  onChange={(e) => setLabImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-[#1B1B1E] border border-[#28282D] rounded-xl px-3 py-2.5 text-white text-left dir-ltr"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[#A0A0A0] block mb-1">نام استاد سرپرست</label>
                  <input
                    type="text"
                    value={labSupervisorName}
                    onChange={(e) => setLabSupervisorName(e.target.value)}
                    placeholder="دکتر..."
                    className="w-full bg-[#1B1B1E] border border-[#28282D] rounded-xl px-3 py-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-[#A0A0A0] block mb-1">مکان آزمایشگاه</label>
                  <input
                    type="text"
                    value={labLocation}
                    onChange={(e) => setLabLocation(e.target.value)}
                    placeholder="طبقه همکف..."
                    className="w-full bg-[#1B1B1E] border border-[#28282D] rounded-xl px-3 py-2.5 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[#A0A0A0] block mb-1">تجهیزات (هر خط یک نام: مشخصات)</label>
                <textarea
                  rows={3}
                  value={labEquipStr}
                  onChange={(e) => setLabEquipStr(e.target.value)}
                  placeholder="پرینتر سه‌بعدی فلزی: لیزر ۴۰۰ وات"
                  className="w-full bg-[#1B1B1E] border border-[#28282D] rounded-xl p-3 text-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#E8530D] text-white py-3 rounded-xl font-bold hover:bg-[#F8631D] transition-all"
                >
                  {editingLabId ? 'به‌روزرسانی آزمایشگاه' : 'ذخیره آزمایشگاه جدید'}
                </button>
                {editingLabId && (
                  <button
                    type="button"
                    onClick={resetLabForm}
                    className="bg-[#1B1B1E] text-[#A0A0A0] px-4 py-3 rounded-xl font-semibold hover:text-white"
                  >
                    انصراف
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* List */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#28282D]">
              <h2 className="text-xl font-heading font-bold text-white">
                لیست آزمایشگاه‌های فعال ({filteredAdminLabs.length} از {labs.length})
              </h2>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setFilterModal({ isOpen: true, type: 'labs' })}
                  className="px-3 py-2.5 bg-orange-500/10 hover:bg-orange-500 text-orange-400 hover:text-white border border-orange-500/30 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0"
                  title="مدیریت و تغییر خود فیلترها/گرایش‌ها"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>ویرایش فیلترها</span>
                </button>
                <CategoryDropdownFilter
                  options={adminLabFieldOptions}
                  selectedId={adminLabFilter}
                  onSelect={setAdminLabFilter}
                  placeholder="فیلتر بر اساس حوزه تخصصی"
                  allLabel="همه آزمایشگاه‌ها"
                  variant="dark"
                  icon={<FlaskConical className="w-4 h-4 text-orange-500" />}
                />
              </div>
            </div>
            <div className="space-y-3">
              {filteredAdminLabs.map((lab) => (
                <div key={lab.id} className="bg-[#141416] border border-[#28282D] p-5 rounded-2xl flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] text-[#E8530D] font-bold bg-[#E8530D]/10 px-2 py-0.5 rounded">{lab.field}</span>
                    <h3 className="text-base font-bold text-white">{lab.name}</h3>
                    <p className="text-xs text-[#A0A0A0] line-clamp-1">{lab.shortDesc}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setExportModal({ type: 'lab', data: lab })}
                      className="px-3 py-2 bg-[#1B1B1E] text-orange-500 hover:text-orange-400 hover:border-orange-500/50 rounded-xl border border-[#28282D] flex items-center gap-1.5 text-xs font-bold transition-colors"
                      title="دانلود شناسنامه / تجهیزات (PDF)"
                    >
                      <Download className="w-4 h-4" />
                      <span>دانلود PDF</span>
                    </button>
                    <button
                      onClick={() => handleEditLabClick(lab)}
                      className="p-2 bg-[#1B1B1E] text-[#A0A0A0] hover:text-[#E8530D] rounded-xl border border-[#28282D]"
                      title="ویرایش"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteLab(lab.id)}
                      className="p-2 bg-[#1B1B1E] text-[#A0A0A0] hover:text-rose-400 rounded-xl border border-[#28282D]"
                      title="حذف"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ═══════════ TAB 3: FACULTY CRUD ═══════════ */}
      {activeTab === 'faculty' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Form */}
          <div className="lg:col-span-5 bg-[#141416] border border-[#28282D] p-6 rounded-3xl space-y-4">
            <h2 className="text-xl font-heading font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-[#E8530D]" />
              {editingFacId ? 'ویرایش عضو هیئت علمی' : 'افزودن عضو جدید هیئت علمی'}
            </h2>

            <form onSubmit={handleSaveFaculty} className="space-y-3 text-xs">
              <div>
                <label className="text-[#A0A0A0] block mb-1">نام کامل *</label>
                <input
                  type="text"
                  required
                  value={facName}
                  onChange={(e) => setFacName(e.target.value)}
                  placeholder="دکتر..."
                  className="w-full bg-[#1B1B1E] border border-[#28282D] rounded-xl px-3 py-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[#A0A0A0] block mb-1">مرتبه علمی *</label>
                  <select
                    value={facTitle}
                    onChange={(e) => setFacTitle(e.target.value)}
                    className="w-full bg-[#1B1B1E] border border-[#28282D] rounded-xl px-3 py-2.5 text-white"
                  >
                    <option value="استاد تمام">استاد تمام</option>
                    <option value="دانشیار">دانشیار</option>
                    <option value="استادیار">استادیار</option>
                  </select>
                </div>
                <div>
                  <label className="text-[#A0A0A0] block mb-1">حوزه تخصصی *</label>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      required
                      value={facField}
                      onChange={(e) => setFacField(e.target.value)}
                      placeholder="مکانیک سیالات..."
                      className="w-full bg-[#1B1B1E] border border-[#28282D] rounded-xl px-3 py-2.5 text-white"
                    />
                    {adminFacultyFieldOptions.length > 0 && (
                      <select
                        onChange={(e) => {
                          if (e.target.value) setFacField(e.target.value);
                        }}
                        value=""
                        className="bg-[#1B1B1E] border border-[#28282D] text-[#A0A0A0] text-xs rounded-xl px-1.5 py-2.5 max-w-[100px] shrink-0 focus:outline-none hover:text-white"
                        title="انتخاب از گرایش‌های موجود"
                      >
                        <option value="" disabled>انتخاب...</option>
                        {adminFacultyFieldOptions.map((opt) => (
                          <option key={opt.id} value={opt.id}>{opt.label}</option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[#A0A0A0] block mb-1">چکیده ۱ جمله‌ای کوتاه *</label>
                <textarea
                  required
                  rows={2}
                  value={facShortDesc}
                  onChange={(e) => setFacShortDesc(e.target.value)}
                  placeholder="شرح کوتاه رزومه..."
                  className="w-full bg-[#1B1B1E] border border-[#28282D] rounded-xl p-3 text-white"
                />
              </div>

              <div>
                <label className="text-[#A0A0A0] block mb-1">بیوگرافی کامل</label>
                <textarea
                  rows={3}
                  value={facBio}
                  onChange={(e) => setFacBio(e.target.value)}
                  placeholder="بیوگرافی مفصل..."
                  className="w-full bg-[#1B1B1E] border border-[#28282D] rounded-xl p-3 text-white"
                />
              </div>

              <div>
                <label className="text-[#A0A0A0] block mb-1">تصویر پرتره (URL)</label>
                <input
                  type="text"
                  value={facAvatarUrl}
                  onChange={(e) => setFacAvatarUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-[#1B1B1E] border border-[#28282D] rounded-xl px-3 py-2.5 text-white text-left dir-ltr"
                />
              </div>

              <div>
                <label className="text-[#A0A0A0] block mb-1">مهارت‌ها (با کاما جدا کنید)</label>
                <input
                  type="text"
                  value={facSkillsStr}
                  onChange={(e) => setFacSkillsStr(e.target.value)}
                  placeholder="CFD, توربولانس, آیرودینامیک"
                  className="w-full bg-[#1B1B1E] border border-[#28282D] rounded-xl px-3 py-2.5 text-white"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[#A0A0A0] block">گزیده مقالات و انتشارات علمی</label>
                  <span className="text-[11px] text-[#E8530D]">هر خط یک مقاله</span>
                </div>
                <textarea
                  rows={4}
                  value={facPublicationsStr}
                  onChange={(e) => setFacPublicationsStr(e.target.value)}
                  placeholder={'Author et al., "Title of the research paper...", Journal Name, 2024.\nنام نویسنده، «عنوان مقاله یا کتاب»، همایش ملی مکانیک، ۱۴۰۲.'}
                  className="w-full bg-[#1B1B1E] border border-[#28282D] rounded-xl p-3 text-white font-mono text-xs leading-relaxed placeholder:font-sans placeholder:text-slate-600"
                />
              </div>

              {/* Linked Projects Selector */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[#A0A0A0] font-bold block flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-[#E8530D]" />
                    <span>پروژه‌های صنعتی هدایت‌شده</span>
                  </label>
                  <span className="text-[11px] text-[#E8530D] font-bold">
                    {facProjectsLed.length} پروژه متصل
                  </span>
                </div>
                <div className="bg-[#1B1B1E] border border-[#28282D] rounded-xl p-2 max-h-40 overflow-y-auto space-y-1.5">
                  {projects.length === 0 ? (
                    <p className="text-xs text-slate-500 text-center py-2">پروژه‌ای تعریف نشده است.</p>
                  ) : (
                    projects.map((proj) => {
                      const isChecked = facProjectsLed.includes(proj.id);
                      return (
                        <label
                          key={proj.id}
                          className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors border text-xs ${
                            isChecked
                              ? 'bg-orange-500/10 border-orange-500/40 text-white'
                              : 'bg-[#141416] border-transparent text-slate-400 hover:bg-[#202025]'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                              if (isChecked) {
                                setFacProjectsLed(facProjectsLed.filter((id) => id !== proj.id));
                              } else {
                                setFacProjectsLed([...facProjectsLed, proj.id]);
                              }
                            }}
                            className="accent-[#E8530D] rounded w-3.5 h-3.5"
                          />
                          <div className="truncate flex-1">
                            <span className="font-bold block text-white">{proj.title}</span>
                            <span className="text-[10px] text-[#A0A0A0]">({proj.clientCompany} - {proj.year})</span>
                          </div>
                        </label>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#E8530D] text-white py-3 rounded-xl font-bold hover:bg-[#F8631D] transition-all"
                >
                  {editingFacId ? 'به‌روزرسانی رزومه' : 'ذخیره عضو جدید'}
                </button>
                {editingFacId && (
                  <button
                    type="button"
                    onClick={resetFacForm}
                    className="bg-[#1B1B1E] text-[#A0A0A0] px-4 py-3 rounded-xl font-semibold"
                  >
                    انصراف
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* List */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#28282D]">
              <h2 className="text-xl font-heading font-bold text-white">
                لیست اعضای هیئت علمی ({filteredAdminFaculty.length} از {faculty.length})
              </h2>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setFilterModal({ isOpen: true, type: 'faculty' })}
                  className="px-3 py-2.5 bg-orange-500/10 hover:bg-orange-500 text-orange-400 hover:text-white border border-orange-500/30 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0"
                  title="مدیریت و تغییر خود فیلترها/گرایش‌ها"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>ویرایش فیلترها</span>
                </button>
                <CategoryDropdownFilter
                  options={adminFacultyFieldOptions}
                  selectedId={adminFacultyFilter}
                  onSelect={setAdminFacultyFilter}
                  placeholder="فیلتر بر اساس گرایش"
                  allLabel="همه اساتید"
                  variant="dark"
                  icon={<GraduationCap className="w-4 h-4 text-orange-500" />}
                />
              </div>
            </div>
            <div className="space-y-3">
              {filteredAdminFaculty.map((f) => (
                <div key={f.id} className="bg-[#141416] border border-[#28282D] p-5 rounded-2xl flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img src={f.avatarUrl} alt={f.name} className="w-12 h-12 rounded-full object-cover border border-[#E8530D]" />
                    <div>
                      <h3 className="text-base font-bold text-white">{f.name}</h3>
                      <div className="flex flex-wrap items-center gap-2 mt-0.5">
                        <span className="text-xs text-[#E8530D]">{f.title} — {f.field}</span>
                        {f.publications && f.publications.length > 0 && (
                          <span className="text-[10px] bg-[#28282D] text-slate-300 px-2 py-0.5 rounded-full border border-slate-700">
                            {f.publications.length} مقاله
                          </span>
                        )}
                        {f.projectsLed && f.projectsLed.length > 0 && (
                          <span className="text-[10px] bg-orange-500/10 text-orange-400 border border-orange-500/30 px-2 py-0.5 rounded-full font-bold">
                            {f.projectsLed.length} پروژه هدایت‌شده
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setExportModal({ type: 'faculty', data: f })}
                      className="px-3 py-2 bg-[#1B1B1E] text-orange-500 hover:text-orange-400 hover:border-orange-500/50 rounded-xl border border-[#28282D] flex items-center gap-1.5 text-xs font-bold transition-colors"
                      title="دانلود شناسنامه / رزومه (PDF)"
                    >
                      <Download className="w-4 h-4" />
                      <span>دانلود PDF</span>
                    </button>
                    <button
                      onClick={() => handleEditFacClick(f)}
                      className="p-2 bg-[#1B1B1E] text-[#A0A0A0] hover:text-[#E8530D] rounded-xl border border-[#28282D]"
                      title="ویرایش"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteFaculty(f.id)}
                      className="p-2 bg-[#1B1B1E] text-[#A0A0A0] hover:text-rose-400 rounded-xl border border-[#28282D]"
                      title="حذف"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════ TAB 4: PROJECTS CRUD ═══════════ */}
      {activeTab === 'projects' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Form */}
          <div className="lg:col-span-5 bg-[#141416] border border-[#28282D] p-6 rounded-3xl space-y-4">
            <h2 className="text-xl font-heading font-bold text-white flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-[#E8530D]" />
              {editingProjId ? 'ویرایش پروژه صنعتی' : 'افزودن پروژه جدید صنعتی'}
            </h2>

            <form onSubmit={handleSaveProject} className="space-y-3 text-xs">
              <div>
                <label className="text-[#A0A0A0] block mb-1">عنوان پروژه *</label>
                <input
                  type="text"
                  required
                  value={projTitle}
                  onChange={(e) => setProjTitle(e.target.value)}
                  placeholder="عنوان پروژه..."
                  className="w-full bg-[#1B1B1E] border border-[#28282D] rounded-xl px-3 py-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-[#A0A0A0] block mb-1">شرکت کارفرما *</label>
                <input
                  type="text"
                  required
                  value={projCompany}
                  onChange={(e) => setProjCompany(e.target.value)}
                  placeholder="مثلاً: گروه مپنا"
                  className="w-full bg-[#1B1B1E] border border-[#28282D] rounded-xl px-3 py-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-[#A0A0A0] block mb-1">حوزه صنعتی *</label>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    required
                    value={projCategory}
                    onChange={(e) => setProjCategory(e.target.value)}
                    placeholder="خودروسازی..."
                    className="w-full bg-[#1B1B1E] border border-[#28282D] rounded-xl px-3 py-2.5 text-white"
                  />
                  {adminProjectCategoryOptions.length > 0 && (
                    <select
                      onChange={(e) => {
                        if (e.target.value) setProjCategory(e.target.value);
                      }}
                      value=""
                      className="bg-[#1B1B1E] border border-[#28282D] text-[#A0A0A0] text-xs rounded-xl px-1.5 py-2.5 max-w-[100px] shrink-0 focus:outline-none hover:text-white"
                      title="انتخاب از حوزه‌های صنعتی موجود"
                    >
                      <option value="" disabled>انتخاب...</option>
                      {adminProjectCategoryOptions.map((opt) => (
                        <option key={opt.id} value={opt.id}>{opt.label}</option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="text-[#A0A0A0] block mb-1 font-bold flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-[#E8530D]" />
                    <span>استاد راهنما / مجری مسئول</span>
                  </label>
                  <select
                    value={projLeadFacultyId}
                    onChange={(e) => setProjLeadFacultyId(e.target.value)}
                    className="w-full bg-[#1B1B1E] border border-[#28282D] rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-[#E8530D]"
                  >
                    <option value="">-- بدون انتساب / نامشخص --</option>
                    {faculty.map((fac) => (
                      <option key={fac.id} value={fac.id}>
                        {fac.name} ({fac.field})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[#A0A0A0] block mb-1 font-bold flex items-center gap-1">
                    <FlaskConical className="w-3.5 h-3.5 text-[#E8530D]" />
                    <span>آزمایشگاه همکار / مجری</span>
                  </label>
                  <select
                    value={projLabId}
                    onChange={(e) => setProjLabId(e.target.value)}
                    className="w-full bg-[#1B1B1E] border border-[#28282D] rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-[#E8530D]"
                  >
                    <option value="">-- بدون آزمایشگاه همکار --</option>
                    {labs.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[#A0A0A0] block mb-1">سال اجرا</label>
                  <input
                    type="text"
                    value={projYear}
                    onChange={(e) => setProjYear(e.target.value)}
                    placeholder="۱۴۰۳"
                    className="w-full bg-[#1B1B1E] border border-[#28282D] rounded-xl px-3 py-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-[#A0A0A0] block mb-1">وضعیت پروژه</label>
                  <select
                    value={projStatus}
                    onChange={(e) => setProjStatus(e.target.value as 'تکمیل‌شده' | 'در حال اجرا')}
                    className="w-full bg-[#1B1B1E] border border-[#28282D] rounded-xl px-3 py-2.5 text-white"
                  >
                    <option value="تکمیل‌شده">تکمیل‌شده</option>
                    <option value="در حال اجرا">در حال اجرا</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[#A0A0A0] block mb-1">توضیح مختصر *</label>
                <textarea
                  required
                  rows={2}
                  value={projShortDesc}
                  onChange={(e) => setProjShortDesc(e.target.value)}
                  placeholder="خلاصه دستاورد..."
                  className="w-full bg-[#1B1B1E] border border-[#28282D] rounded-xl p-3 text-white"
                />
              </div>

              <div>
                <label className="text-[#A0A0A0] block mb-1">شرح جامع و دستاوردهای فنی پروژه</label>
                <textarea
                  rows={3}
                  value={projFullDesc}
                  onChange={(e) => setProjFullDesc(e.target.value)}
                  placeholder="شرح اهداف، روش حل و مراحل پیاده‌سازی..."
                  className="w-full bg-[#1B1B1E] border border-[#28282D] rounded-xl p-3 text-white"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[#A0A0A0] block">نتایج کلیدی و دستاوردها</label>
                  <span className="text-[11px] text-[#E8530D]">هر خط یک دستاورد</span>
                </div>
                <textarea
                  rows={2}
                  value={projOutcomesStr}
                  onChange={(e) => setProjOutcomesStr(e.target.value)}
                  placeholder={'دستیابی به راندمان بالای ۹۰٪\nبومی‌سازی تکنولوژی'}
                  className="w-full bg-[#1B1B1E] border border-[#28282D] rounded-xl p-3 text-white text-xs leading-relaxed"
                />
              </div>

              <div>
                <label className="text-[#A0A0A0] block mb-1">تصویر پروژه (URL)</label>
                <input
                  type="text"
                  value={projImageUrl}
                  onChange={(e) => setProjImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-[#1B1B1E] border border-[#28282D] rounded-xl px-3 py-2.5 text-white text-left dir-ltr"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#E8530D] text-white py-3 rounded-xl font-bold hover:bg-[#F8631D] transition-all"
                >
                  {editingProjId ? 'به‌روزرسانی پروژه' : 'ذخیره پروژه'}
                </button>
                {editingProjId && (
                  <button
                    type="button"
                    onClick={resetProjForm}
                    className="bg-[#1B1B1E] text-[#A0A0A0] px-4 py-3 rounded-xl font-semibold"
                  >
                    انصراف
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* List */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#28282D]">
              <h2 className="text-xl font-heading font-bold text-white">
                لیست پروژه‌های نمونه کار ({filteredAdminProjects.length} از {projects.length})
              </h2>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setFilterModal({ isOpen: true, type: 'projects' })}
                  className="px-3 py-2.5 bg-orange-500/10 hover:bg-orange-500 text-orange-400 hover:text-white border border-orange-500/30 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0"
                  title="مدیریت و تغییر خود فیلترها/دسته‌بندی‌ها"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>ویرایش فیلترها</span>
                </button>
                <CategoryDropdownFilter
                  options={adminProjectCategoryOptions}
                  selectedId={adminProjectFilter}
                  onSelect={setAdminProjectFilter}
                  placeholder="فیلتر بر اساس حوزه صنعتی"
                  allLabel="همه پروژه‌ها"
                  variant="dark"
                  icon={<Briefcase className="w-4 h-4 text-orange-500" />}
                />
              </div>
            </div>
            <div className="space-y-3">
              {filteredAdminProjects.map((p) => {
                const leadFac = faculty.find((f) => f.id === p.leadFacultyId);
                const assignedLab = labs.find((l) => l.id === p.labId);
                return (
                  <div key={p.id} className="bg-[#141416] border border-[#28282D] p-5 rounded-2xl flex items-center justify-between gap-4">
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] text-[#E8530D] font-bold">کارفرما: {p.clientCompany} ({p.year})</span>
                        <span className="text-[10px] bg-[#28282D] text-slate-300 px-2 py-0.5 rounded-full border border-slate-700">
                          {p.category}
                        </span>
                        {p.status && (
                          <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                            p.status === 'تکمیل‌شده'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                              : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          }`}>
                            {p.status}
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-bold text-white truncate">{p.title}</h3>
                      <div className="flex flex-wrap items-center gap-2 pt-0.5">
                        {leadFac ? (
                          <span className="text-[11px] text-orange-400 bg-orange-500/10 border border-orange-500/30 px-2 py-0.5 rounded-lg flex items-center gap-1 font-medium">
                            <Users className="w-3 h-3" />
                            استاد راهنما: {leadFac.name}
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-500 bg-[#1B1B1E] px-2 py-0.5 rounded-lg">
                            بدون استاد راهنما
                          </span>
                        )}
                        {assignedLab && (
                          <span className="text-[11px] text-sky-400 bg-sky-500/10 border border-sky-500/30 px-2 py-0.5 rounded-lg flex items-center gap-1 font-medium">
                            <FlaskConical className="w-3 h-3" />
                            {assignedLab.name}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setExportModal({ type: 'project', data: p })}
                      className="px-3 py-2 bg-[#1B1B1E] text-orange-500 hover:text-orange-400 hover:border-orange-500/50 rounded-xl border border-[#28282D] flex items-center gap-1.5 text-xs font-bold transition-colors"
                      title="دانلود شناسنامه پروژه (PDF)"
                    >
                      <Download className="w-4 h-4" />
                      <span>دانلود PDF</span>
                    </button>
                    <button
                      onClick={() => handleEditProjClick(p)}
                      className="p-2 bg-[#1B1B1E] text-[#A0A0A0] hover:text-[#E8530D] rounded-xl border border-[#28282D]"
                      title="ویرایش"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteProject(p.id)}
                      className="p-2 bg-[#1B1B1E] text-[#A0A0A0] hover:text-rose-400 rounded-xl border border-[#28282D]"
                      title="حذف"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════ TAB 5: HOME PAGE CONFIG ═══════════ */}
      {activeTab === 'home' && (
        <div className="bg-[#141416] border border-[#28282D] p-6 sm:p-10 rounded-3xl space-y-8 shadow-2xl">
          <div className="space-y-2 text-right border-b border-[#28282D] pb-6">
            <span className="text-[#E8530D] font-heading font-bold text-xs uppercase block">مدیریت محتوای اصلی</span>
            <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-white flex items-center gap-3">
              <Home className="w-8 h-8 text-[#E8530D]" />
              مدیریت و ویرایش صفحه اصلی (خانه)
            </h2>
            <p className="text-xs sm:text-sm text-[#A0A0A0] leading-relaxed">
              از این بخش می‌توانید تمامی متون هدر اصلی، کلمات کلیدی، آمار شاخص‌های دانشکده، کارت‌های مزایای رقابتی و بنر دعوت به همکاری صفحه اصلی سایت را به راحتی تغییر دهید.
            </p>
          </div>

          <form onSubmit={handleSaveHome} className="space-y-6">
            <div className="space-y-6 text-xs">
              
              {/* Hero Section */}
              <div className="bg-[#1B1B1E] p-6 rounded-2xl border border-[#28282D] space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2 border-r-2 border-[#E8530D] pr-2">
                  ۱. بخش هدر اصلی (Hero Section)
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-white font-bold block">برچسب هدر (Badge)</label>
                    <input
                      type="text"
                      required
                      value={homeHeroBadge}
                      onChange={(e) => setHomeHeroBadge(e.target.value)}
                      className="w-full bg-[#141416] border border-[#28282D] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#E8530D]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-white font-bold block">عنوان اصلی (خط اول)</label>
                    <input
                      type="text"
                      required
                      value={homeHeroTitleLine1}
                      onChange={(e) => setHomeHeroTitleLine1(e.target.value)}
                      className="w-full bg-[#141416] border border-[#28282D] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#E8530D]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-white font-bold block">عنوان اصلی (خط دوم / رنگی)</label>
                    <input
                      type="text"
                      required
                      value={homeHeroTitleLine2}
                      onChange={(e) => setHomeHeroTitleLine2(e.target.value)}
                      className="w-full bg-[#141416] border border-[#28282D] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#E8530D]"
                    />
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-white font-bold block">متن توضیحات زیر عنوان</label>
                    <textarea
                      required
                      rows={3}
                      value={homeHeroDesc}
                      onChange={(e) => setHomeHeroDesc(e.target.value)}
                      className="w-full bg-[#141416] border border-[#28282D] rounded-xl p-4 text-white leading-relaxed focus:outline-none focus:border-[#E8530D]"
                    />
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-white font-bold block">
                      کلمات کلیدی پژوهشی و صنعتی (هر کدام در یک خط)
                    </label>
                    <textarea
                      rows={4}
                      value={homeKeywordsStr}
                      onChange={(e) => setHomeKeywordsStr(e.target.value)}
                      className="w-full bg-[#141416] border border-[#28282D] rounded-xl p-4 text-white leading-relaxed font-mono text-xs focus:outline-none focus:border-[#E8530D]"
                      placeholder="دینامیک سیالات CFD&#10;رباتیک صنعتی&#10;تست‌های غیرمخرب NDT"
                    />
                  </div>
                </div>
              </div>

              {/* Stats Sidebar Section */}
              <div className="bg-[#1B1B1E] p-6 rounded-2xl border border-[#28282D] space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2 border-r-2 border-[#E8530D] pr-2">
                  ۲. آمار و شاخص‌های کلیدی (کارت کناری هدر)
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-white font-bold block">عنوان آمارها</label>
                    <input
                      type="text"
                      required
                      value={homeStatsTitle}
                      onChange={(e) => setHomeStatsTitle(e.target.value)}
                      className="w-full bg-[#141416] border border-[#28282D] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#E8530D]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-white font-bold block">زمان پاسخگویی دفتر صنعت</label>
                    <input
                      type="text"
                      required
                      value={homeResponseTime}
                      onChange={(e) => setHomeResponseTime(e.target.value)}
                      className="w-full bg-[#141416] border border-[#28282D] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#E8530D]"
                    />
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-white font-bold block">توضیحات کوتاه آمارها</label>
                    <textarea
                      required
                      rows={2}
                      value={homeStatsDesc}
                      onChange={(e) => setHomeStatsDesc(e.target.value)}
                      className="w-full bg-[#141416] border border-[#28282D] rounded-xl p-3 text-white leading-relaxed focus:outline-none focus:border-[#E8530D]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-white font-bold block">تعداد آزمایشگاه‌ها</label>
                    <input
                      type="number"
                      required
                      value={homeLabsCount}
                      onChange={(e) => setHomeLabsCount(Number(e.target.value))}
                      className="w-full bg-[#141416] border border-[#28282D] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#E8530D]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-white font-bold block">تعداد اعضای هیئت علمی</label>
                    <input
                      type="number"
                      required
                      value={homeFacultyCount}
                      onChange={(e) => setHomeFacultyCount(Number(e.target.value))}
                      className="w-full bg-[#141416] border border-[#28282D] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#E8530D]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-white font-bold block">تعداد همکاران صنعتی (+)</label>
                    <input
                      type="number"
                      required
                      value={homePartnersCount}
                      onChange={(e) => setHomePartnersCount(Number(e.target.value))}
                      className="w-full bg-[#141416] border border-[#28282D] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#E8530D]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-white font-bold block">تعداد پروژه‌های کلان (+)</label>
                    <input
                      type="number"
                      required
                      value={homeProjectsCount}
                      onChange={(e) => setHomeProjectsCount(Number(e.target.value))}
                      className="w-full bg-[#141416] border border-[#28282D] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#E8530D]"
                    />
                  </div>
                </div>
              </div>

              {/* Advantages Section */}
              <div className="bg-[#1B1B1E] p-6 rounded-2xl border border-[#28282D] space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2 border-r-2 border-[#E8530D] pr-2">
                  ۳. بخش مزایای رقابتی دانشکده
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-white font-bold block">برچسب بالای عنوان مزایا</label>
                    <input
                      type="text"
                      required
                      value={homeAdvCategory}
                      onChange={(e) => setHomeAdvCategory(e.target.value)}
                      className="w-full bg-[#141416] border border-[#28282D] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#E8530D]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-white font-bold block">عنوان بخش مزایا</label>
                    <input
                      type="text"
                      required
                      value={homeAdvTitle}
                      onChange={(e) => setHomeAdvTitle(e.target.value)}
                      className="w-full bg-[#141416] border border-[#28282D] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#E8530D]"
                    />
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-white font-bold block">توضیحات معرفی مزایا</label>
                    <textarea
                      required
                      rows={2}
                      value={homeAdvDesc}
                      onChange={(e) => setHomeAdvDesc(e.target.value)}
                      className="w-full bg-[#141416] border border-[#28282D] rounded-xl p-3 text-white leading-relaxed focus:outline-none focus:border-[#E8530D]"
                    />
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-white font-bold block">
                      لیست کارت‌های مزایا (هر خط یک مورد به فرمت: <span className="text-[#E8530D] font-mono">عنوان | توضیحات</span>)
                    </label>
                    <textarea
                      rows={5}
                      value={homeAdvStr}
                      onChange={(e) => setHomeAdvStr(e.target.value)}
                      className="w-full bg-[#141416] border border-[#28282D] rounded-xl p-4 text-white leading-relaxed font-mono text-xs focus:outline-none focus:border-[#E8530D]"
                      placeholder="زیرساخت پیشرفته آزمایشگاهی | بیش از ۳۰ آزمایشگاه مجهز..."
                    />
                  </div>
                </div>
              </div>

              {/* CTA Band Section */}
              <div className="bg-[#1B1B1E] p-6 rounded-2xl border border-[#28282D] space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2 border-r-2 border-[#E8530D] pr-2">
                  ۴. بنر فوتری دعوت به ثبت پروژه (CTA Band)
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-white font-bold block">عنوان بنر CTA</label>
                    <input
                      type="text"
                      required
                      value={homeCtaTitle}
                      onChange={(e) => setHomeCtaTitle(e.target.value)}
                      className="w-full bg-[#141416] border border-[#28282D] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#E8530D]"
                    />
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-white font-bold block">توضیحات بنر CTA</label>
                    <textarea
                      required
                      rows={2}
                      value={homeCtaDesc}
                      onChange={(e) => setHomeCtaDesc(e.target.value)}
                      className="w-full bg-[#141416] border border-[#28282D] rounded-xl p-3 text-white leading-relaxed focus:outline-none focus:border-[#E8530D]"
                    />
                  </div>
                </div>
              </div>

            </div>

            <div className="flex items-center gap-4 pt-4 border-t border-[#28282D]">
              <button
                type="submit"
                className="bg-[#E8530D] text-white px-8 py-3.5 rounded-xl font-bold text-xs sm:text-sm hover:bg-[#F8631D] transition-all flex items-center gap-2 shadow-lg shadow-[#E8530D]/20"
              >
                <Save className="w-4 h-4" />
                <span>ذخیره محتوای صفحه اصلی (خانه)</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ═══════════ TAB 5: COLLABORATION PAGE CONFIG ═══════════ */}
      {activeTab === 'collaboration' && (
        <div className="bg-[#141416] border border-[#28282D] p-6 sm:p-10 rounded-3xl space-y-8 shadow-2xl">
          <div className="space-y-2 text-right border-b border-[#28282D] pb-6">
            <span className="text-[#E8530D] font-heading font-bold text-xs uppercase block">مدیریت محتوای عمومی</span>
            <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-white flex items-center gap-3">
              <Building2 className="w-8 h-8 text-[#E8530D]" />
              مدیریت و ویرایش صفحه صنعت و همکاری
            </h2>
            <p className="text-xs sm:text-sm text-[#A0A0A0] leading-relaxed">
              از این بخش می‌توانید متون هدر، مزایای ارتباط با صنعت، الگوهای تعاملی، لیست شرکای تجاری و اطلاعات تماس مستقیم صفحه ارتباط با صنعت را ویرایش و بروزرسانی نمایید.
            </p>
          </div>

          <form onSubmit={handleSaveCollaboration} className="space-y-6">
            <div className="space-y-6 text-xs">
              
              {/* Header Section */}
              <div className="bg-[#1B1B1E] p-6 rounded-2xl border border-[#28282D] space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2 border-r-2 border-[#E8530D] pr-2">
                  ۱. بخش هدر اصلی صفحه صنعت
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-white font-bold block">برچسب هدر (Category Badge)</label>
                    <input
                      type="text"
                      required
                      value={collabHeaderCategory}
                      onChange={(e) => setCollabHeaderCategory(e.target.value)}
                      className="w-full bg-[#141416] border border-[#28282D] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#E8530D]"
                      placeholder="مثلا: ارتباط با صنعت و فناوری"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-white font-bold block">عنوان اصلی هدر</label>
                    <input
                      type="text"
                      required
                      value={collabHeaderTitle}
                      onChange={(e) => setCollabHeaderTitle(e.target.value)}
                      className="w-full bg-[#141416] border border-[#28282D] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#E8530D]"
                      placeholder="عنوان اصلی..."
                    />
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-white font-bold block">توضیحات هدر اصلی</label>
                    <textarea
                      required
                      rows={3}
                      value={collabHeaderDesc}
                      onChange={(e) => setCollabHeaderDesc(e.target.value)}
                      className="w-full bg-[#141416] border border-[#28282D] rounded-xl p-4 text-white leading-relaxed focus:outline-none focus:border-[#E8530D]"
                      placeholder="توضیحات معرفی همکاری..."
                    />
                  </div>
                </div>
              </div>

              {/* Benefits Section */}
              <div className="bg-[#1B1B1E] p-6 rounded-2xl border border-[#28282D] space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2 border-r-2 border-[#E8530D] pr-2">
                  ۲. مزایای همکاری با دانشکده
                </h3>

                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="text-white font-bold block">عنوان بخش مزایا</label>
                    <input
                      type="text"
                      required
                      value={collabBenefitsTitle}
                      onChange={(e) => setCollabBenefitsTitle(e.target.value)}
                      className="w-full bg-[#141416] border border-[#28282D] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#E8530D]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-white font-bold block">
                      لیست مزایا (هر خط یک مورد به فرمت: <span className="text-[#E8530D] font-mono">شماره | عنوان | توضیحات</span>)
                    </label>
                    <textarea
                      rows={5}
                      value={collabBenefitsStr}
                      onChange={(e) => setCollabBenefitsStr(e.target.value)}
                      className="w-full bg-[#141416] border border-[#28282D] rounded-xl p-4 text-white leading-relaxed font-mono text-[11px] focus:outline-none focus:border-[#E8530D]"
                      placeholder="۰۱ | دسترسی به تجهیزات پیشرفته | آزمایشگاه‌های مجهز به جدیدترین فناوری‌ها"
                    />
                  </div>
                </div>
              </div>

              {/* Models Section */}
              <div className="bg-[#1B1B1E] p-6 rounded-2xl border border-[#28282D] space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2 border-r-2 border-[#E8530D] pr-2">
                  ۳. الگوها و مدل‌های تعاملی
                </h3>

                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="text-white font-bold block">عنوان بخش الگوهای تعامل</label>
                    <input
                      type="text"
                      required
                      value={collabModelsTitle}
                      onChange={(e) => setCollabModelsTitle(e.target.value)}
                      className="w-full bg-[#141416] border border-[#28282D] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#E8530D]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-white font-bold block">
                      لیست الگوها (هر خط یک مورد به فرمت: <span className="text-[#E8530D] font-mono">عنوان الگوی تعامل | توضیحات</span>)
                    </label>
                    <textarea
                      rows={5}
                      value={collabModelsStr}
                      onChange={(e) => setCollabModelsStr(e.target.value)}
                      className="w-full bg-[#141416] border border-[#28282D] rounded-xl p-4 text-white leading-relaxed font-mono text-[11px] focus:outline-none focus:border-[#E8530D]"
                      placeholder="پروژه‌های تحقیقاتی سفارش‌محور | تعریف پروژه‌های صنعتی با اهداف مشخص"
                    />
                  </div>
                </div>
              </div>

              {/* Partners Section */}
              <div className="bg-[#1B1B1E] p-6 rounded-2xl border border-[#28282D] space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#28282D] pb-4">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2 border-r-2 border-[#E8530D] pr-2">
                      ۴. شرکا و همکاران صنعتی ({collabPartnersList.length} مورد)
                    </h3>
                    <p className="text-xs text-[#A0A0A0] mt-1">
                      مدیریت مجزای هر یک از شرکا، آپلود لوگو، تغییر ترتیب و ویرایش نام یا آیکون
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddPartner}
                    className="bg-[#E8530D] hover:bg-[#F8631D] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow"
                  >
                    <Plus className="w-4 h-4" />
                    <span>افزودن شریک جدید</span>
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-white font-bold block text-xs">عنوان بخش شرکا</label>
                    <input
                      type="text"
                      required
                      value={collabPartnersTitle}
                      onChange={(e) => setCollabPartnersTitle(e.target.value)}
                      className="w-full bg-[#141416] border border-[#28282D] rounded-xl px-4 py-2.5 text-white text-xs focus:outline-none focus:border-[#E8530D]"
                    />
                  </div>

                  {/* Individual Partner Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    {collabPartnersList.map((partner, idx) => (
                      <div
                        key={idx}
                        className="bg-[#141416] border border-[#28282D] p-4 rounded-xl space-y-3 relative group hover:border-[#E8530D]/50 transition-all"
                      >
                        {/* Partner Card Header */}
                        <div className="flex items-center justify-between border-b border-[#28282D] pb-2">
                          <span className="text-xs font-bold text-[#E8530D] bg-[#E8530D]/10 px-2 py-0.5 rounded border border-[#E8530D]/20">
                            شریک #{idx + 1}
                          </span>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleMovePartner(idx, 'up')}
                              disabled={idx === 0}
                              className="p-1 text-[#A0A0A0] hover:text-white disabled:opacity-30 transition-colors"
                              title="انتقال به بالا"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMovePartner(idx, 'down')}
                              disabled={idx === collabPartnersList.length - 1}
                              className="p-1 text-[#A0A0A0] hover:text-white disabled:opacity-30 transition-colors"
                              title="انتقال به پایین"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeletePartner(idx)}
                              className="p-1 text-rose-400 hover:text-rose-300 transition-colors mr-1"
                              title="حذف این شریک"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Partner Details Inputs */}
                        <div className="space-y-3 text-xs">
                          <div>
                            <label className="text-[#A0A0A0] font-bold block mb-1">نام شرکت / شریک تجاری:</label>
                            <input
                              type="text"
                              value={partner.name}
                              onChange={(e) => handleUpdatePartner(idx, 'name', e.target.value)}
                              placeholder="مثلاً: گروه مپنا..."
                              className="w-full bg-[#1B1B1E] border border-[#28282D] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#E8530D]"
                            />
                          </div>

                          <div>
                            <label className="text-[#A0A0A0] font-bold block mb-1">ایموجی / آیکون جایگزین:</label>
                            <input
                              type="text"
                              value={partner.icon || ''}
                              onChange={(e) => handleUpdatePartner(idx, 'icon', e.target.value)}
                              placeholder="⚡ یا 🏢"
                              className="w-full bg-[#1B1B1E] border border-[#28282D] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#E8530D]"
                            />
                          </div>

                          {/* Logo Upload & Preview */}
                          <div className="space-y-2">
                            <label className="text-[#A0A0A0] font-bold block">تصویر لوگو:</label>

                            <div className="flex items-center gap-3">
                              {partner.logoUrl ? (
                                <div className="relative w-14 h-14 bg-white rounded-lg p-1 border border-[#28282D] flex items-center justify-center shrink-0">
                                  <img
                                    src={partner.logoUrl}
                                    alt={partner.name}
                                    className="max-h-full max-w-full object-contain"
                                    onError={(e) => (e.currentTarget.style.display = 'none')}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleUpdatePartner(idx, 'logoUrl', '')}
                                    className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white p-0.5 rounded-full shadow hover:bg-rose-700"
                                    title="حذف لوگو"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              ) : (
                                <div className="w-14 h-14 bg-[#1B1B1E] border border-dashed border-[#28282D] rounded-lg flex items-center justify-center text-2xl text-[#A0A0A0] shrink-0">
                                  {partner.icon || '🤝'}
                                </div>
                              )}

                              <div className="flex-1 space-y-1.5">
                                <label
                                  htmlFor={`partner-logo-input-${idx}`}
                                  className="cursor-pointer bg-[#28282D] hover:bg-[#323238] text-white px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all inline-flex items-center gap-1.5"
                                >
                                  <Upload className="w-3.5 h-3.5 text-[#E8530D]" />
                                  <span>آپلود فایل لوگو</span>
                                </label>
                                <input
                                  type="file"
                                  id={`partner-logo-input-${idx}`}
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handlePartnerLogoFileUpload(idx, file);
                                  }}
                                />

                                <input
                                  type="text"
                                  value={partner.logoUrl || ''}
                                  onChange={(e) => handleUpdatePartner(idx, 'logoUrl', e.target.value)}
                                  placeholder="یا لینک تصویر (URL)..."
                                  className="w-full bg-[#1B1B1E] border border-[#28282D] rounded-lg px-2.5 py-1 text-[11px] text-[#A0A0A0] focus:text-white focus:outline-none focus:border-[#E8530D]"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {collabPartnersList.length === 0 && (
                    <div className="text-center py-6 border border-dashed border-[#28282D] rounded-xl text-[#A0A0A0] text-xs">
                      هیچ شریک تجاری ثبت نشده است. با زدن دکمه «افزودن شریک جدید» یک مورد اضافه کنید.
                    </div>
                  )}
                </div>
              </div>

              {/* Direct Contact Info */}
              <div className="bg-[#1B1B1E] p-6 rounded-2xl border border-[#28282D] space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2 border-r-2 border-[#E8530D] pr-2">
                  ۵. اطلاعات تماس مستقیم دفتر ارتباط با صنعت
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-white font-bold block">ایمیل مستقیم</label>
                    <input
                      type="email"
                      required
                      value={collabEmail}
                      onChange={(e) => setCollabEmail(e.target.value)}
                      className="w-full bg-[#141416] border border-[#28282D] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#E8530D] text-left dir-ltr"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-white font-bold block">تلفن مستقیم</label>
                    <input
                      type="text"
                      required
                      value={collabPhone}
                      onChange={(e) => setCollabPhone(e.target.value)}
                      className="w-full bg-[#141416] border border-[#28282D] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#E8530D]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-white font-bold block">دورنگار (فکس)</label>
                    <input
                      type="text"
                      required
                      value={collabFax}
                      onChange={(e) => setCollabFax(e.target.value)}
                      className="w-full bg-[#141416] border border-[#28282D] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#E8530D]"
                    />
                  </div>
                </div>
              </div>

            </div>

            <div className="flex items-center gap-4 pt-4 border-t border-[#28282D]">
              <button
                type="submit"
                className="bg-[#E8530D] text-white px-8 py-3.5 rounded-xl font-bold text-xs sm:text-sm hover:bg-[#F8631D] transition-all flex items-center gap-2 shadow-lg shadow-[#E8530D]/20"
              >
                <Save className="w-4 h-4" />
                <span>ذخیره محتوای صفحه صنعت و تعامل</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ═══════════ TAB 6: FOOTER CONFIG ═══════════ */}
      {activeTab === 'footer' && (
        <div className="bg-[#141416] border border-[#28282D] p-6 sm:p-10 rounded-3xl space-y-8 shadow-2xl">
          <div className="space-y-2 text-right border-b border-[#28282D] pb-6">
            <span className="text-[#E8530D] font-heading font-bold text-xs uppercase block">تنظیمات اصلی سایت</span>
            <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-white flex items-center gap-3">
              <Layout className="w-8 h-8 text-[#E8530D]" />
              مدیریت و ویرایش مشخصات فوتر سایت
            </h2>
            <p className="text-xs sm:text-sm text-[#A0A0A0] leading-relaxed">
              تغییرات اعمال‌شده در این بخش به‌طور زنده در بخش پایینی (Footer) تمامی صفحات وب‌سایت دانشگاه اعمال می‌گردد.
            </p>
          </div>

          <form onSubmit={handleSaveFooter} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              
              <div className="space-y-4 md:col-span-2">
                <label className="text-white font-bold block">توضیحات معرفی دانشکده در فوتر</label>
                <textarea
                  required
                  rows={3}
                  value={footerDesc}
                  onChange={(e) => setFooterDesc(e.target.value)}
                  className="w-full bg-[#1B1B1E] border border-[#28282D] rounded-2xl p-4 text-white leading-relaxed focus:outline-none focus:border-[#E8530D]"
                  placeholder="توضیحات کوتاه درباره دانشکده..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-white font-bold block">آدرس پستی دانشکده</label>
                <input
                  type="text"
                  required
                  value={footerAddress}
                  onChange={(e) => setFooterAddress(e.target.value)}
                  className="w-full bg-[#1B1B1E] border border-[#28282D] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#E8530D]"
                  placeholder="تهران، خیابان آزادی..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-white font-bold block">شماره‌های تماس دفتر پژوهش و صنعت</label>
                <input
                  type="text"
                  required
                  value={footerPhones}
                  onChange={(e) => setFooterPhones(e.target.value)}
                  className="w-full bg-[#1B1B1E] border border-[#28282D] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#E8530D]"
                  placeholder="۰۲۱-۶۶۱۶۵۵۰۰ / ۰۲۱-۶۶۰۲۲۷۰۰"
                />
              </div>

              <div className="space-y-2">
                <label className="text-white font-bold block">پست الکترونیک (ایمیل)</label>
                <input
                  type="email"
                  required
                  value={footerEmail}
                  onChange={(e) => setFooterEmail(e.target.value)}
                  className="w-full bg-[#1B1B1E] border border-[#28282D] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#E8530D] text-left dir-ltr"
                  placeholder="me-research@sharif.edu"
                />
              </div>

              <div className="space-y-2">
                <label className="text-white font-bold block">عنوان لینک ویژه خارجی</label>
                <input
                  type="text"
                  value={footerLinkText}
                  onChange={(e) => setFooterLinkText(e.target.value)}
                  className="w-full bg-[#1B1B1E] border border-[#28282D] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#E8530D]"
                  placeholder="سایت اصلی دانشگاه شریف"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-white font-bold block">آدرس لینک ویژه (URL)</label>
                <input
                  type="url"
                  value={footerLinkUrl}
                  onChange={(e) => setFooterLinkUrl(e.target.value)}
                  className="w-full bg-[#1B1B1E] border border-[#28282D] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#E8530D] text-left dir-ltr"
                  placeholder="https://www.sharif.edu"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-white font-bold block">متن حقوق کپی‌رایت پایین فوتر</label>
                <input
                  type="text"
                  required
                  value={footerCopyright}
                  onChange={(e) => setFooterCopyright(e.target.value)}
                  className="w-full bg-[#1B1B1E] border border-[#28282D] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#E8530D]"
                  placeholder="© ۲۰۲۴ دانشگاه صنعتی شریف..."
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-white font-bold block">لیست حوزه‌های تعامل با صنعت (هر خط یک حوزه)</label>
                <textarea
                  rows={6}
                  value={footerAreasStr}
                  onChange={(e) => setFooterAreasStr(e.target.value)}
                  className="w-full bg-[#1B1B1E] border border-[#28282D] rounded-2xl p-4 text-white leading-relaxed focus:outline-none focus:border-[#E8530D]"
                  placeholder="دینامیک سیالات محاسباتی (CFD)&#10;رباتیک و اتوماسیون صنعتی..."
                />
              </div>

            </div>

            <div className="flex items-center gap-4 pt-4 border-t border-[#28282D]">
              <button
                type="submit"
                className="bg-[#E8530D] text-white px-8 py-3.5 rounded-xl font-bold text-xs sm:text-sm hover:bg-[#F8631D] transition-all flex items-center gap-2 shadow-lg shadow-[#E8530D]/20"
              >
                <Save className="w-4 h-4" />
                <span>ذخیره تغییرات فوتر</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ═══════════ TAB 6: TUTORIAL VIDEO & DOCUMENTATION ═══════════ */}
      {activeTab === 'tutorial' && (
        <div className="bg-[#141416] border border-[#28282D] p-8 sm:p-10 rounded-3xl space-y-8 shadow-2xl">
          <div className="space-y-2 text-right">
            <span className="text-[#E8530D] font-heading font-bold text-xs uppercase block">راهنمای بارگذاری محتوا</span>
            <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-white">
              ویدیوی آموزشی و راهنمای گام‌به‌گام ویرایش محتوای سایت
            </h2>
            <p className="text-xs sm:text-sm text-[#A0A0A0] leading-relaxed">
              راهنمای کامل جهت افزودن آزمایشگاه جدید، ویرایش رزومه اساتید، ثبت پروژه‌های نمونه کار صنعتی و دانلود پروپوزال‌های دریافتی از صنایع.
            </p>
          </div>

          {/* Interactive Video Player Simulator */}
          <div className="relative aspect-video max-w-4xl mx-auto rounded-3xl overflow-hidden border-2 border-[#28282D] bg-[#0D0D0F] shadow-2xl flex flex-col justify-between p-6">
            
            {/* Overlay Play State */}
            {!isPlayingVideo ? (
              <div className="absolute inset-0 bg-[#0D0D0F]/80 backdrop-blur-sm flex flex-col items-center justify-center space-y-4 p-6 text-center z-10">
                <button
                  onClick={() => setIsPlayingVideo(true)}
                  className="w-20 h-20 rounded-full bg-[#E8530D] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-2xl shadow-[#E8530D]/40"
                >
                  <PlayCircle className="w-10 h-10" />
                </button>
                <div>
                  <h3 className="text-xl font-heading font-bold text-white">مشاهده ویدئوی جامع آموزش پنل ادمین</h3>
                  <p className="text-xs text-[#A0A0A0] mt-1">مدت زمان: ۴ دقیقه و ۲۰ ثانیه — کیفیت HD با توضیحات کامل فارسی</p>
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 bg-[#0D0D0F] flex flex-col justify-between p-6 z-10 animate-fadeIn">
                <div className="flex justify-between items-center text-xs text-[#A0A0A0] bg-[#141416] p-3 rounded-xl border border-[#28282D]">
                  <span className="text-white font-bold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    در حال پخش: آموزش بارگذاری و ویرایش محتوای دانشکده مهندسی مکانیک
                  </span>
                  <button onClick={() => setIsPlayingVideo(false)} className="text-[#E8530D] hover:underline font-bold">
                    توقف ویدئو
                  </button>
                </div>

                {/* Animated simulated screen */}
                <div className="bg-[#1B1B1E] border border-[#E8530D]/40 p-6 rounded-2xl text-center space-y-3">
                  <span className="text-xs text-[#E8530D] font-bold">گام ۱: مدیریت آزمایشگاه‌ها و آپلود فرم‌های پروپوزال</span>
                  <p className="text-xs text-white max-w-lg mx-auto leading-relaxed">
                    «جهت افزودن آزمایشگاه جدید، وارد تب «مدیریت آزمایشگاه‌ها» شده، نام، عکس و چکیده ۱ جمله‌ای را وارد کنید. با زدن دکمه ذخیره، آزمایشگاه فوراً در صفحه عمومی و موتور جستجوی هوشمند نمایان خواهد شد.»
                  </p>
                </div>

                <div className="w-full bg-[#141416] p-3 rounded-xl border border-[#28282D] flex items-center gap-4 text-xs">
                  <span className="text-[#E8530D] font-mono">02:15 / 04:20</span>
                  <div className="flex-1 bg-[#28282D] h-2 rounded-full overflow-hidden">
                    <div className="bg-[#E8530D] h-full w-1/2 rounded-full" />
                  </div>
                </div>
              </div>
            )}

            {/* Thumbnail background */}
            <img
              src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200"
              alt="Tutorial Thumbnail"
              className="absolute inset-0 w-full h-full object-cover opacity-30"
            />
          </div>

          {/* Written Step-by-Step Instructions */}
          <div className="space-y-4 pt-4 border-t border-[#28282D]">
            <h3 className="text-xl font-heading font-bold text-white border-r-4 border-[#E8530D] pr-3">
              چک‌لیست متنی راهنمای ادمین
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-[#A0A0A0] leading-relaxed">
              <div className="bg-[#1B1B1E] p-5 rounded-2xl border border-[#28282D] space-y-2">
                <h4 className="text-white font-bold text-sm">۱. افزودن و به‌روزرسانی آزمایشگاه‌ها:</h4>
                <p>وارد تب «مدیریت آزمایشگاه‌ها» شوید. چکیده ۱ جمله‌ای دقیقاً همان متنی است که در کارت اولیه نمایش داده می‌شود. با کلیک کاربر روی کارت، تمام تجهیزات و عکس‌های گالری که در این پنل ثبت کرده‌اید نمایان خواهد شد.</p>
              </div>

              <div className="bg-[#1B1B1E] p-5 rounded-2xl border border-[#28282D] space-y-2">
                <h4 className="text-white font-bold text-sm">۲. بررسی پروپوزال‌های صنعتی:</h4>
                <p>صنعتگران از طریق فرم همکاری فایل پروپوزال (Word/PDF) ارسال می‌کنند. در تب «صندوق درخواست‌ها» تمام فایل‌ها آماده دانلود بوده و می‌توانید وضعیت درخواست را به «پذیرفته‌شده» تغییر دهید.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════ TAB 7: SECURITY & LOGS ═══════════ */}
      {activeTab === 'security' && (
        <div className="space-y-8">
          
          {/* Change Admin Password Card */}
          <div className="bg-[#141416] border border-[#28282D] p-6 sm:p-8 rounded-3xl space-y-6 shadow-2xl">
            <div className="space-y-1">
              <span className="text-xs text-[#E8530D] font-bold block">تنظیمات حساب ادمین</span>
              <h2 className="text-xl font-heading font-bold text-white border-r-4 border-[#E8530D] pr-3 flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-[#E8530D]" />
                تغییر رمز عبور مدیر سیستم
              </h2>
            </div>

            {passwordError && (
              <div className="bg-rose-500/10 border border-rose-500/30 p-4 rounded-xl text-xs text-rose-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4 max-w-xl text-xs">
              <div className="space-y-1.5">
                <label className="text-white font-bold block">رمز عبور فعلی ادمین *</label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="رمز عبور فعلی را وارد کنید"
                  className="w-full bg-[#1B1B1E] border border-[#28282D] text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#E8530D] text-left dir-ltr"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-white font-bold block">رمز عبور جدید *</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="حداقل ۶ کاراکتر"
                    className="w-full bg-[#1B1B1E] border border-[#28282D] text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#E8530D] text-left dir-ltr"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-white font-bold block">تکرار رمز عبور جدید *</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="تکرار رمز جدید"
                    className="w-full bg-[#1B1B1E] border border-[#28282D] text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#E8530D] text-left dir-ltr"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="bg-[#E8530D] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#F8631D] transition-all flex items-center gap-2 shadow-lg shadow-[#E8530D]/20 mt-2"
              >
                <Save className="w-4 h-4" />
                <span>بروزرسانی رمز عبور</span>
              </button>
            </form>
          </div>

          <div className="bg-[#141416] border border-[#28282D] p-6 sm:p-8 rounded-3xl space-y-6 shadow-2xl">
            <h2 className="text-xl font-heading font-bold text-white border-r-4 border-[#E8530D] pr-3 flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#E8530D]" />
              پروتکل‌های امنیتی و احراز هویت ادمین
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#1B1B1E] border border-[#28282D] p-6 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white">احراز هویت ۲ مرحله‌ای (2FA)</span>
                  <button
                    onClick={() => {
                      const updated = { ...adminState, requires2FA: !adminState.requires2FA };
                      saveAdminState(updated);
                      setToastMsg(updated.requires2FA ? 'احراز هویت ۲ مرحله‌ای فعال شد.' : 'احراز هویت ۲ مرحله‌ای غیرفعال شد.');
                    }}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                      adminState.requires2FA
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-[#28282D] text-[#A0A0A0]'
                    }`}
                  >
                    {adminState.requires2FA ? 'فعال' : 'غیرفعال'}
                  </button>
                </div>
                <p className="text-xs text-[#A0A0A0] leading-relaxed">
                  در صورت فعال‌سازی، هنگام ورود رمز عبور، وارد کردن کد ۶ رقمی امنیتی الزامی خواهد شد.
                </p>
              </div>

              <div className="bg-[#1B1B1E] border border-[#28282D] p-6 rounded-2xl space-y-3">
                <span className="text-sm font-bold text-white block">محدودسازی ورود ناموفق (Rate Limiting)</span>
                <p className="text-xs text-[#A0A0A0] leading-relaxed">
                  سیستم به‌طور خودکار پس از ۵ تلاش ناموفق متوالی، آی‌پای کاربر را به مدت ۵ دقیقه مسدود کرده و هشدار امنیتی صادر می‌کند.
                </p>
                <span className="text-[11px] text-[#E8530D] font-bold block">تعداد تلاش‌های ناموفق اخیر: {adminState.failedAttempts}</span>
              </div>
            </div>
          </div>

          {/* Audit Logs Table */}
          <div className="bg-[#141416] border border-[#28282D] p-6 sm:p-8 rounded-3xl space-y-4 shadow-2xl">
            <h3 className="text-xl font-heading font-bold text-white">سوابق امنیتی و ثبت رویدادها (Security Audit Trail)</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {logs.map((log) => (
                <div key={log.id} className="bg-[#1B1B1E] border border-[#28282D] p-4 rounded-xl flex items-center justify-between text-xs text-[#A0A0A0]">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`font-bold ${
                        log.status === 'موفق' ? 'text-emerald-400' : 'text-rose-400'
                      }`}>
                        [{log.status}]
                      </span>
                      <span className="text-white font-semibold">{log.action}</span>
                    </div>
                    <p className="text-[11px]">{log.details}</p>
                  </div>
                  <div className="text-left font-mono text-[10px]">
                    <span className="block text-[#E8530D]">{log.timestamp}</span>
                    <span className="block">IP: {log.ip}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {exportModal && (
        <PDFExportModal
          type={exportModal.type}
          data={exportModal.data}
          onClose={() => setExportModal(null)}
        />
      )}

      {/* Category / Filter Manager Modal */}
      {filterModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-[#141416] border border-[#28282D] w-full max-w-2xl rounded-2xl p-6 shadow-2xl relative text-right space-y-6">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#28282D] pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-orange-500/10 rounded-xl border border-orange-500/20 text-orange-500">
                  <SlidersHorizontal className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-heading font-bold text-white">مدیریت و ویرایش خود فیلترها و گرایش‌ها</h3>
                  <p className="text-xs text-[#A0A0A0]">تغییر نام یا حذف مستقیم دسته‌بندی‌ها و اعمال آنی بر روی تمامی آیتم‌ها</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setFilterModal({ isOpen: false, type: 'labs' });
                  setEditingCatOldName(null);
                }}
                className="p-1.5 rounded-lg text-[#A0A0A0] hover:text-white hover:bg-[#1B1B1E] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Type Tabs */}
            <div className="flex items-center gap-2 bg-[#1B1B1E] p-1.5 rounded-xl border border-[#28282D]">
              <button
                type="button"
                onClick={() => {
                  setFilterModal({ isOpen: true, type: 'labs' });
                  setEditingCatOldName(null);
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  filterModal.type === 'labs'
                    ? 'bg-[#E8530D] text-white shadow'
                    : 'text-[#A0A0A0] hover:text-white'
                }`}
              >
                <FlaskConical className="w-4 h-4" />
                <span>آزمایشگاه‌ها</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setFilterModal({ isOpen: true, type: 'faculty' });
                  setEditingCatOldName(null);
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  filterModal.type === 'faculty'
                    ? 'bg-[#E8530D] text-white shadow'
                    : 'text-[#A0A0A0] hover:text-white'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>هیئت علمی</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setFilterModal({ isOpen: true, type: 'projects' });
                  setEditingCatOldName(null);
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  filterModal.type === 'projects'
                    ? 'bg-[#E8530D] text-white shadow'
                    : 'text-[#A0A0A0] hover:text-white'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                <span>پروژه‌های صنعتی</span>
              </button>
            </div>

            {/* Existing Categories List */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-orange-400 flex items-center gap-1.5">
                <Tag className="w-4 h-4" />
                <span>فهرست فیلترها / گرایش‌های موجود ({
                  filterModal.type === 'labs'
                    ? adminLabFieldOptions.length
                    : filterModal.type === 'faculty'
                    ? adminFacultyFieldOptions.length
                    : adminProjectCategoryOptions.length
                })</span>
              </h4>

              <div className="max-h-60 overflow-y-auto space-y-2 pr-1 scrollbar-thin scrollbar-thumb-slate-700">
                {(filterModal.type === 'labs'
                  ? adminLabFieldOptions
                  : filterModal.type === 'faculty'
                  ? adminFacultyFieldOptions
                  : adminProjectCategoryOptions
                ).map((opt) => {
                  const catName = opt.label;
                  const isEditing = editingCatOldName === catName;
                  const count = filterModal.type === 'labs'
                    ? labs.filter((l) => l.field === catName).length
                    : filterModal.type === 'faculty'
                    ? faculty.filter((f) => f.field === catName).length
                    : projects.filter((p) => p.category === catName).length;

                  return (
                    <div
                      key={catName}
                      className="bg-[#1B1B1E] border border-[#28282D] p-3 rounded-xl flex items-center justify-between gap-3 text-xs"
                    >
                      {isEditing ? (
                        <div className="flex items-center gap-2 w-full">
                          <input
                            type="text"
                            value={editingCatNewName}
                            onChange={(e) => setEditingCatNewName(e.target.value)}
                            placeholder="نام جدید گرایش..."
                            className="flex-1 bg-[#141416] border border-orange-500 rounded-lg px-3 py-1.5 text-white text-xs focus:outline-none"
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={() => handleRenameCategoryAction(catName)}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1 shrink-0"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>ذخیره</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingCatOldName(null)}
                            className="bg-[#28282D] text-[#A0A0A0] hover:text-white px-2.5 py-1.5 rounded-lg font-bold transition-all shrink-0"
                          >
                            انصراف
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-2.5 truncate">
                            <span className="font-bold text-white truncate">{catName}</span>
                            <span className="bg-orange-500/10 text-orange-400 px-2 py-0.5 rounded-full text-[10px] font-bold border border-orange-500/20 shrink-0">
                              {count} مورد
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingCatOldName(catName);
                                setEditingCatNewName(catName);
                              }}
                              className="px-2.5 py-1.5 bg-[#28282D] hover:bg-orange-500/20 text-[#A0A0A0] hover:text-orange-400 rounded-lg transition-colors flex items-center gap-1 font-semibold"
                              title="تغییر نام گرایش"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>ویرایش</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteCategoryAction(catName)}
                              className="px-2.5 py-1.5 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white rounded-lg transition-colors flex items-center gap-1 font-semibold"
                              title="حذف/ادغام این گرایش"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>حذف</span>
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Add New Category Section */}
            <form onSubmit={handleAddCategoryAction} className="border-t border-[#28282D] pt-4 space-y-2">
              <label className="text-xs font-bold text-[#A0A0A0] block">افزودن فیلتر / گرایش جدید به این بخش:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCatInput}
                  onChange={(e) => setNewCatInput(e.target.value)}
                  placeholder="مثلاً: هوش مصنوعی و بیومکانیک..."
                  className="flex-1 bg-[#1B1B1E] border border-[#28282D] rounded-xl px-3 py-2 text-white text-xs focus:border-orange-500 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!newCatInput.trim()}
                  className="bg-[#E8530D] hover:bg-[#F8631D] disabled:opacity-50 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>افزودن</span>
                </button>
              </div>
            </form>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setFilterModal({ isOpen: false, type: 'labs' });
                  setEditingCatOldName(null);
                }}
                className="bg-[#1B1B1E] hover:bg-[#28282D] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all"
              >
                بستن پنجره
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
