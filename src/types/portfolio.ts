export interface Profile {
  name: string;
  fullName: string;
  headline: string;
  subheadline: string;
  bio: string;
  email: string;
  phone: string;
  location: string;
  linkedinUrl: string;
  githubUrl: string;
  profilePhotoUrl: string;
  heroPrimaryCtaText: string;
  heroSecondaryCtaText: string;
  statusText?: string;
  yearsOfStudy?: string;
}

export interface AboutData {
  summary: string;
  highlights: string[];
  focusAreas: {
    title: string;
    description: string;
    icon: string;
  }[];
  quickStats: {
    label: string;
    value: string;
    sublabel?: string;
  }[];
}

export type SkillCategory = 'programming' | 'analytics' | 'tools' | 'domain' | 'building';

export interface SkillItem {
  id: string;
  name: string;
  category: SkillCategory;
  level?: string; // e.g. "Proficient", "Intermediate", "Currently Learning"
  icon?: string;
  order: number;
  source: 'resume' | 'manual' | 'ai_draft' | 'manual_edit';
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  companyLocation?: string;
  period: string;
  type: string; // e.g. "Virtual Internship", "Full-time", "Internship"
  description: string;
  bulletPoints: string[];
  skills: string[];
  order: number;
  status: 'published' | 'draft';
  source: 'resume' | 'manual' | 'ai_draft' | 'manual_edit';
}

export interface ProjectItem {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  problemStatement?: string;
  features: string[];
  technologies: string[];
  screenshots: string[];
  challenges?: string;
  results?: string;
  githubUrl?: string;
  liveDemoUrl?: string;
  featured: boolean;
  order: number;
  status: 'published' | 'draft';
  source: 'resume' | 'manual' | 'ai_draft' | 'manual_edit';
  createdAt?: string;
  updatedAt?: string;
}

export interface CertificationItem {
  id: string;
  title: string;
  issuer: string;
  issueDate?: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  pdfUrl?: string;
  thumbnailUrl?: string;
  description?: string;
  skills?: string[];
  featured: boolean;
  order: number;
  status: 'published' | 'draft';
  source: 'resume' | 'manual' | 'ai_draft' | 'manual_edit';
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  period: string;
  cgpa?: string;
  highlights?: string[];
  order: number;
  source: 'resume' | 'manual' | 'ai_draft' | 'manual_edit';
}

export interface AchievementItem {
  id: string;
  title: string;
  category: string;
  description: string;
  date?: string;
  order: number;
  source: 'resume' | 'manual' | 'ai_draft' | 'manual_edit';
}

export interface LanguageItem {
  id: string;
  language: string;
  proficiency: string; // "Native", "Fluent", "Professional", "Conversational"
  order: number;
  source: 'resume' | 'manual' | 'ai_draft' | 'manual_edit';
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface ResumeVersion {
  id: string;
  filename: string;
  versionTag: string;
  uploadedAt: string;
  fileSize: number;
  pdfUrl: string;
  isCurrent: boolean;
  notes?: string;
}

export interface ResumeSyncChange {
  id: string;
  category: 'skills' | 'projects' | 'certifications' | 'experience' | 'education' | 'achievements';
  type: 'addition' | 'update' | 'conflict';
  title: string;
  existingValue?: any;
  detectedValue: any;
  status: 'pending' | 'accepted' | 'rejected';
  reason?: string;
}

export interface ResumeSyncJob {
  id: string;
  filename: string;
  uploadedAt: string;
  status: 'processing' | 'completed' | 'failed';
  summary?: string;
  changes: ResumeSyncChange[];
  rawAnalysis?: any;
}

export interface SiteSettings {
  themeDefault: 'dark' | 'light';
  darkThemeName: string; // "Royal Crimson"
  lightThemeName: string; // "Ocean Royale"
  enableAiAssistant: boolean;
  enable3dScene: boolean;
  maintenanceMode: boolean;
}

export interface PortfolioData {
  profile: Profile;
  about: AboutData;
  skills: SkillItem[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
  education: EducationItem[];
  achievements: AchievementItem[];
  languages: LanguageItem[];
  resumeVersions: ResumeVersion[];
  syncJobs: ResumeSyncJob[];
  siteSettings: SiteSettings;
  contactMessages: ContactMessage[];
}
