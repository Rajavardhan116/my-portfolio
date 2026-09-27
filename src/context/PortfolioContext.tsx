import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { initialPortfolioData } from '../data/seedData';
import {
  PortfolioData,
  ProjectItem,
  CertificationItem,
  SkillItem,
  ExperienceItem,
  EducationItem,
  AchievementItem,
  LanguageItem,
  Profile,
  AboutData,
  SiteSettings,
  ResumeSyncJob
} from '../types/portfolio';
import { useAuth } from './AuthContext';

interface PortfolioContextType {
  portfolio: PortfolioData;
  isLoading: boolean;
  refreshPortfolio: () => Promise<void>;
  submitContact: (name: string, email: string, subject: string, message: string) => Promise<{ success: boolean; message: string }>;
  sendChatMessage: (message: string) => Promise<string>;
  
  // Admin Operations
  saveProject: (project: Partial<ProjectItem>) => Promise<boolean>;
  deleteProject: (id: string) => Promise<boolean>;
  reorderProjects: (orderedIds: string[]) => Promise<boolean>;

  saveCertification: (cert: Partial<CertificationItem>) => Promise<boolean>;
  deleteCertification: (id: string) => Promise<boolean>;

  saveSkill: (skill: Partial<SkillItem>) => Promise<boolean>;
  deleteSkill: (id: string) => Promise<boolean>;

  saveExperience: (exp: Partial<ExperienceItem>) => Promise<boolean>;
  deleteExperience: (id: string) => Promise<boolean>;

  saveEducation: (edu: Partial<EducationItem>) => Promise<boolean>;
  deleteEducation: (id: string) => Promise<boolean>;

  saveAchievement: (ach: Partial<AchievementItem>) => Promise<boolean>;
  deleteAchievement: (id: string) => Promise<boolean>;

  saveLanguage: (lang: Partial<LanguageItem>) => Promise<boolean>;
  deleteLanguage: (id: string) => Promise<boolean>;

  updateProfile: (profile: Partial<Profile>) => Promise<boolean>;
  updateAbout: (about: Partial<AboutData>) => Promise<boolean>;
  updateSiteSettings: (settings: Partial<SiteSettings>) => Promise<boolean>;

  uploadFile: (file: File) => Promise<{ success: boolean; fileUrl?: string; error?: string }>;
  uploadAndAnalyzeResume: (file: File) => Promise<{ success: boolean; job?: ResumeSyncJob; error?: string }>;
  applyResumeSync: (jobId: string, acceptedIds: string[], setResumeCurrent?: boolean, versionId?: string) => Promise<boolean>;
  markMessageRead: (id: string) => Promise<boolean>;
  deleteMessage: (id: string) => Promise<boolean>;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [portfolio, setPortfolio] = useState<PortfolioData>(initialPortfolioData);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { token, isAuthenticated } = useAuth();

  const fetchPortfolio = useCallback(async () => {
    try {
      setIsLoading(true);
      const endpoint = isAuthenticated ? '/api/admin/portfolio' : '/api/portfolio';
      const headers: Record<string, string> = {};
      if (isAuthenticated && token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const res = await fetch(endpoint, { headers });
      if (res.ok) {
        const data = await res.json();
        setPortfolio(data);
      }
    } catch (err) {
      console.error('Failed to fetch portfolio data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, token]);

  useEffect(() => {
    fetchPortfolio();
  }, [fetchPortfolio]);

  const refreshPortfolio = async () => {
    await fetchPortfolio();
  };

  const submitContact = async (name: string, email: string, subject: string, message: string) => {
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message })
      });
      const data = await res.json();
      if (!res.ok) return { success: false, message: data.error || 'Failed to send message.' };
      return { success: true, message: data.message };
    } catch (err: any) {
      return { success: false, message: err.message || 'Network error occurred.' };
    }
  };

  const sendChatMessage = async (message: string): Promise<string> => {
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error processing inquiry');
      return data.reply;
    } catch (err: any) {
      return `I encountered an issue connecting to the AI service: ${err.message}. Please feel free to email Raja directly at ${portfolio.profile.email}.`;
    }
  };

  // Helper for admin requests
  const adminRequest = async (url: string, method: string, body?: any) => {
    if (!token) return null;
    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: body ? JSON.stringify(body) : undefined
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  };

  // Admin Project actions
  const saveProject = async (project: Partial<ProjectItem>): Promise<boolean> => {
    let result;
    if (project.id && portfolio.projects.some(p => p.id === project.id)) {
      result = await adminRequest(`/api/admin/projects/${project.id}`, 'PUT', project);
    } else {
      result = await adminRequest('/api/admin/projects', 'POST', project);
    }
    if (result) {
      await fetchPortfolio();
      return true;
    }
    return false;
  };

  const deleteProject = async (id: string): Promise<boolean> => {
    const result = await adminRequest(`/api/admin/projects/${id}`, 'DELETE');
    if (result) {
      await fetchPortfolio();
      return true;
    }
    return false;
  };

  const reorderProjects = async (orderedIds: string[]): Promise<boolean> => {
    const result = await adminRequest('/api/admin/projects/reorder', 'PUT', { orderedIds });
    if (result) {
      await fetchPortfolio();
      return true;
    }
    return false;
  };

  // Admin Certification actions
  const saveCertification = async (cert: Partial<CertificationItem>): Promise<boolean> => {
    let result;
    if (cert.id && portfolio.certifications.some(c => c.id === cert.id)) {
      result = await adminRequest(`/api/admin/certifications/${cert.id}`, 'PUT', cert);
    } else {
      result = await adminRequest('/api/admin/certifications', 'POST', cert);
    }
    if (result) {
      await fetchPortfolio();
      return true;
    }
    return false;
  };

  const deleteCertification = async (id: string): Promise<boolean> => {
    const result = await adminRequest(`/api/admin/certifications/${id}`, 'DELETE');
    if (result) {
      await fetchPortfolio();
      return true;
    }
    return false;
  };

  // Admin Skill actions
  const saveSkill = async (skill: Partial<SkillItem>): Promise<boolean> => {
    let result;
    if (skill.id && portfolio.skills.some(s => s.id === skill.id)) {
      result = await adminRequest(`/api/admin/skills/${skill.id}`, 'PUT', skill);
    } else {
      result = await adminRequest('/api/admin/skills', 'POST', skill);
    }
    if (result) {
      await fetchPortfolio();
      return true;
    }
    return false;
  };

  const deleteSkill = async (id: string): Promise<boolean> => {
    const result = await adminRequest(`/api/admin/skills/${id}`, 'DELETE');
    if (result) {
      await fetchPortfolio();
      return true;
    }
    return false;
  };

  // Admin Experience actions
  const saveExperience = async (exp: Partial<ExperienceItem>): Promise<boolean> => {
    let result;
    if (exp.id && portfolio.experience.some(e => e.id === exp.id)) {
      result = await adminRequest(`/api/admin/experience/${exp.id}`, 'PUT', exp);
    } else {
      result = await adminRequest('/api/admin/experience', 'POST', exp);
    }
    if (result) {
      await fetchPortfolio();
      return true;
    }
    return false;
  };

  const deleteExperience = async (id: string): Promise<boolean> => {
    const result = await adminRequest(`/api/admin/experience/${id}`, 'DELETE');
    if (result) {
      await fetchPortfolio();
      return true;
    }
    return false;
  };

  // Admin Education actions
  const saveEducation = async (edu: Partial<EducationItem>): Promise<boolean> => {
    let result;
    if (edu.id && portfolio.education.some(e => e.id === edu.id)) {
      result = await adminRequest(`/api/admin/education/${edu.id}`, 'PUT', edu);
    } else {
      result = await adminRequest('/api/admin/education', 'POST', edu);
    }
    if (result) {
      await fetchPortfolio();
      return true;
    }
    return false;
  };

  const deleteEducation = async (id: string): Promise<boolean> => {
    const result = await adminRequest(`/api/admin/education/${id}`, 'DELETE');
    if (result) {
      await fetchPortfolio();
      return true;
    }
    return false;
  };

  // Admin Achievement actions
  const saveAchievement = async (ach: Partial<AchievementItem>): Promise<boolean> => {
    let result;
    if (ach.id && portfolio.achievements.some(a => a.id === ach.id)) {
      result = await adminRequest(`/api/admin/achievements/${ach.id}`, 'PUT', ach);
    } else {
      result = await adminRequest('/api/admin/achievements', 'POST', ach);
    }
    if (result) {
      await fetchPortfolio();
      return true;
    }
    return false;
  };

  const deleteAchievement = async (id: string): Promise<boolean> => {
    const result = await adminRequest(`/api/admin/achievements/${id}`, 'DELETE');
    if (result) {
      await fetchPortfolio();
      return true;
    }
    return false;
  };

  // Admin Language actions
  const saveLanguage = async (lang: Partial<LanguageItem>): Promise<boolean> => {
    let result;
    if (lang.id && portfolio.languages.some(l => l.id === lang.id)) {
      result = await adminRequest(`/api/admin/languages/${lang.id}`, 'PUT', lang);
    } else {
      result = await adminRequest('/api/admin/languages', 'POST', lang);
    }
    if (result) {
      await fetchPortfolio();
      return true;
    }
    return false;
  };

  const deleteLanguage = async (id: string): Promise<boolean> => {
    const result = await adminRequest(`/api/admin/languages/${id}`, 'DELETE');
    if (result) {
      await fetchPortfolio();
      return true;
    }
    return false;
  };

  // Profile and About updates
  const updateProfile = async (profile: Partial<Profile>): Promise<boolean> => {
    const result = await adminRequest('/api/admin/profile', 'PUT', profile);
    if (result) {
      await fetchPortfolio();
      return true;
    }
    return false;
  };

  const updateAbout = async (about: Partial<AboutData>): Promise<boolean> => {
    const result = await adminRequest('/api/admin/about', 'PUT', about);
    if (result) {
      await fetchPortfolio();
      return true;
    }
    return false;
  };

  const updateSiteSettings = async (settings: Partial<SiteSettings>): Promise<boolean> => {
    const result = await adminRequest('/api/admin/portfolio', 'PUT', {
      ...portfolio,
      siteSettings: { ...portfolio.siteSettings, ...settings }
    });
    if (result) {
      await fetchPortfolio();
      return true;
    }
    return false;
  };

  // File Upload Helper
  const uploadFile = async (file: File): Promise<{ success: boolean; fileUrl?: string; error?: string }> => {
    if (!token) return { success: false, error: 'Unauthorized' };
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const res = await fetch('/api/admin/upload', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
              filename: file.name,
              fileData: reader.result as string,
              mimeType: file.type
            })
          });
          const data = await res.json();
          if (!res.ok) resolve({ success: false, error: data.error });
          resolve({ success: true, fileUrl: data.fileUrl });
        } catch (err: any) {
          resolve({ success: false, error: err.message });
        }
      };
      reader.onerror = () => resolve({ success: false, error: 'Failed to read file' });
      reader.readAsDataURL(file);
    });
  };

  // Resume Upload and AI Analysis
  const uploadAndAnalyzeResume = async (file: File): Promise<{ success: boolean; job?: ResumeSyncJob; error?: string }> => {
    if (!token) return { success: false, error: 'Unauthorized' };
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const res = await fetch('/api/admin/resume/upload-and-analyze', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
              filename: file.name,
              fileData: reader.result as string,
              mimeType: file.type
            })
          });
          const data = await res.json();
          if (!res.ok) resolve({ success: false, error: data.error });
          await fetchPortfolio();
          resolve({ success: true, job: data.job });
        } catch (err: any) {
          resolve({ success: false, error: err.message });
        }
      };
      reader.onerror = () => resolve({ success: false, error: 'Failed to read resume file' });
      reader.readAsDataURL(file);
    });
  };

  // Apply Resume Sync
  const applyResumeSync = async (jobId: string, acceptedIds: string[], setResumeCurrent = true, versionId?: string): Promise<boolean> => {
    const result = await adminRequest('/api/admin/resume/apply-sync', 'POST', {
      jobId,
      acceptedChangeIds: acceptedIds,
      setResumeCurrent,
      versionId
    });
    if (result) {
      await fetchPortfolio();
      return true;
    }
    return false;
  };

  const markMessageRead = async (id: string): Promise<boolean> => {
    const result = await adminRequest(`/api/admin/messages/${id}/read`, 'PATCH');
    if (result) {
      await fetchPortfolio();
      return true;
    }
    return false;
  };

  const deleteMessage = async (id: string): Promise<boolean> => {
    const result = await adminRequest(`/api/admin/messages/${id}`, 'DELETE');
    if (result) {
      await fetchPortfolio();
      return true;
    }
    return false;
  };

  return (
    <PortfolioContext.Provider
      value={{
        portfolio,
        isLoading,
        refreshPortfolio,
        submitContact,
        sendChatMessage,
        saveProject,
        deleteProject,
        reorderProjects,
        saveCertification,
        deleteCertification,
        saveSkill,
        deleteSkill,
        saveExperience,
        deleteExperience,
        saveEducation,
        deleteEducation,
        saveAchievement,
        deleteAchievement,
        saveLanguage,
        deleteLanguage,
        updateProfile,
        updateAbout,
        updateSiteSettings,
        uploadFile,
        uploadAndAnalyzeResume,
        applyResumeSync,
        markMessageRead,
        deleteMessage
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) throw new Error('usePortfolio must be used within a PortfolioProvider');
  return context;
};
