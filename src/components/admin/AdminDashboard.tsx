import React, { useState } from 'react';
import {
  X,
  Shield,
  Layers,
  FileText,
  User,
  Sparkles,
  Plus,
  Trash2,
  Edit2,
  Upload,
  CheckCircle2,
  AlertTriangle,
  LogOut,
  Key,
  Inbox,
  Settings,
  Briefcase,
  Award,
  GraduationCap,
  Languages,
  ArrowUpDown,
  Eye,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { usePortfolio } from '../../context/PortfolioContext';
import {
  ProjectItem,
  CertificationItem,
  SkillItem,
  ExperienceItem,
  EducationItem,
  AchievementItem,
  LanguageItem,
  ResumeSyncChange
} from '../../types/portfolio';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: string;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  defaultTab = 'resume-sync'
}) => {
  const { isAuthenticated, user, login, logout, changePassword, forgotPassword, resetPassword } = useAuth();
  const {
    portfolio,
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
  } = usePortfolio();

  const [activeTab, setActiveTab] = useState<string>(defaultTab);

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('iragamreddyrajavardhanreddy@gmail.com');
  const [loginPassword, setLoginPassword] = useState('RajaVardhan@2026');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  // Change Password State
  const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false);
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [pwMsg, setPwMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Resume Sync State
  const [syncFile, setSyncFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [syncJobResult, setSyncJobResult] = useState<any | null>(null);
  const [selectedChanges, setSelectedChanges] = useState<string[]>([]);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  // Modal editing states
  const [editingProject, setEditingProject] = useState<Partial<ProjectItem> | null>(null);
  const [editingCert, setEditingCert] = useState<Partial<CertificationItem> | null>(null);
  const [editingSkill, setEditingSkill] = useState<Partial<SkillItem> | null>(null);
  const [editingExp, setEditingExp] = useState<Partial<ExperienceItem> | null>(null);
  const [editingEdu, setEditingEdu] = useState<Partial<EducationItem> | null>(null);
  const [editingAch, setEditingAch] = useState<Partial<AchievementItem> | null>(null);
  const [editingLang, setEditingLang] = useState<Partial<LanguageItem> | null>(null);

  // Destructive Action Confirmation
  const [confirmDelete, setConfirmDelete] = useState<{
    type: 'project' | 'cert' | 'skill' | 'exp' | 'edu' | 'ach' | 'lang' | 'msg';
    id: string;
    title: string;
  } | null>(null);

  if (!isOpen) return null;

  // --- Handlers ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);
    const res = await login(loginEmail, loginPassword);
    setIsLoggingIn(false);
    if (!res.success) {
      setLoginError(res.error || 'Invalid credentials');
    }
  };

  const handleResumeUpload = async () => {
    if (!syncFile) return;
    setIsAnalyzing(true);
    setSyncFeedback(null);
    const res = await uploadAndAnalyzeResume(syncFile);
    setIsAnalyzing(false);
    if (res.success && res.job) {
      setSyncJobResult(res.job);
      // Pre-select all proposed changes by default
      setSelectedChanges(res.job.changes.map((c: ResumeSyncChange) => c.id));
    } else {
      setSyncFeedback(res.error || 'Failed to analyze resume.');
    }
  };

  const handleApplySync = async () => {
    if (!syncJobResult) return;
    setIsAnalyzing(true);
    const success = await applyResumeSync(syncJobResult.id, selectedChanges, true);
    setIsAnalyzing(false);
    if (success) {
      setSyncFeedback(`Successfully applied ${selectedChanges.length} changes! Manual content was completely protected.`);
      setSyncJobResult(null);
      setSyncFile(null);
    } else {
      setSyncFeedback('Failed to apply sync changes.');
    }
  };

  const executeDelete = async () => {
    if (!confirmDelete) return;
    const { type, id } = confirmDelete;
    if (type === 'project') await deleteProject(id);
    else if (type === 'cert') await deleteCertification(id);
    else if (type === 'skill') await deleteSkill(id);
    else if (type === 'exp') await deleteExperience(id);
    else if (type === 'edu') await deleteEducation(id);
    else if (type === 'ach') await deleteAchievement(id);
    else if (type === 'lang') await deleteLanguage(id);
    else if (type === 'msg') await deleteMessage(id);
    setConfirmDelete(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-6xl h-[92vh] flex flex-col bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden text-slate-100">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-rose-600/20 border border-rose-500/40 flex items-center justify-center text-rose-500 font-bold">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight text-white flex items-center gap-2">
                <span>Raja Vardhan Portfolio CMS</span>
                <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-rose-500/20 text-rose-300">
                  v2.0 Protected
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Direct Content Management & AI Resume Synchronization
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated && (
              <>
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <Key className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Security</span>
                </button>
                <button
                  onClick={logout}
                  className="px-3 py-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600 text-rose-400 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        {!isAuthenticated ? (
          /* Admin Login Screen */
          <div className="flex-1 flex items-center justify-center p-6 bg-slate-950/50">
            <div className="w-full max-w-md p-8 rounded-2xl glass-panel space-y-6">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 mx-auto rounded-xl bg-rose-600/20 text-rose-500 flex items-center justify-center">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white">Administrator Access</h3>
                <p className="text-xs text-slate-400">
                  Authenticate to edit portfolio sections, projects, or synchronize new resumes.
                </p>
              </div>

              {loginError && (
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-400">Admin Email</label>
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={e => setLoginEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-rose-500 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-400">Password</label>
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-rose-500 transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs sm:text-sm shadow-lg crimson-glow transition-all hover:scale-[1.01]"
                >
                  {isLoggingIn ? 'Authenticating...' : 'Enter Dashboard'}
                </button>
              </form>

              <div className="pt-4 border-t border-slate-800 text-center">
                <p className="text-[11px] font-mono text-slate-500">
                  Default Credentials seeded for initial assessment.
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Authenticated Dashboard */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Sidebar Tabs */}
            <div className="w-full md:w-60 bg-slate-950/80 border-r border-slate-800 p-3 flex md:flex-col gap-1 overflow-x-auto md:overflow-y-auto shrink-0">
              {[
                { id: 'resume-sync', label: 'AI Resume Sync', icon: Sparkles, badge: portfolio.syncJobs.length },
                { id: 'projects', label: 'Projects CMS', icon: Layers, badge: portfolio.projects.length },
                { id: 'certifications', label: 'Certifications', icon: Award, badge: portfolio.certifications.length },
                { id: 'skills', label: 'Skills & Tools', icon: Sparkles, badge: portfolio.skills.length },
                { id: 'experience', label: 'Experience', icon: Briefcase, badge: portfolio.experience.length },
                { id: 'profile', label: 'Profile & Hero', icon: User },
                { id: 'about', label: 'About Data', icon: FileText },
                { id: 'education', label: 'Education', icon: GraduationCap, badge: portfolio.education.length },
                { id: 'achievements', label: 'Achievements', icon: Award },
                { id: 'languages', label: 'Languages', icon: Languages },
                { id: 'messages', label: 'Inbox Messages', icon: Inbox, badge: portfolio.contactMessages.filter(m => !m.read).length },
                { id: 'settings', label: 'Site Settings', icon: Settings }
              ].map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-rose-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{tab.label}</span>
                    </div>
                    {tab.badge !== undefined && tab.badge > 0 && (
                      <span
                        className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                          isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-rose-400'
                        }`}
                      >
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Tab Content Panels */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-900/60 space-y-6">
              {/* TAB 1: AI RESUME SYNC */}
              {activeTab === 'resume-sync' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-rose-500" />
                      <span>AI Resume Upload & Synchronizer</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Upload a new resume (PDF/DOCX). Gemini analyzes and proposes updates. Manual projects and certifications are permanently preserved.
                    </p>
                  </div>

                  {syncFeedback && (
                    <div className="p-4 rounded-xl bg-slate-800 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between">
                      <span>{syncFeedback}</span>
                      <button onClick={() => setSyncFeedback(null)}>
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Upload Area */}
                  <div className="p-8 rounded-2xl border-2 border-dashed border-slate-700 hover:border-rose-500/60 bg-slate-950/40 text-center space-y-4 transition-colors">
                    <div className="w-12 h-12 mx-auto rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">
                        {syncFile ? syncFile.name : 'Upload New Resume (PDF / DOCX)'}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1">
                        Files will be parsed by Gemini 3.8 Flash for structured entity extraction.
                      </p>
                    </div>

                    <input
                      type="file"
                      id="resume-file-input"
                      accept=".pdf,.docx,.txt"
                      onChange={e => {
                        if (e.target.files && e.target.files[0]) {
                          setSyncFile(e.target.files[0]);
                        }
                      }}
                      className="hidden"
                    />

                    <div className="flex items-center justify-center gap-3">
                      <label
                        htmlFor="resume-file-input"
                        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold cursor-pointer border border-slate-700"
                      >
                        {syncFile ? 'Change File' : 'Select File'}
                      </label>

                      {syncFile && (
                        <button
                          onClick={handleResumeUpload}
                          disabled={isAnalyzing}
                          className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-md crimson-glow flex items-center gap-2"
                        >
                          {isAnalyzing ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              <span>Analyzing with Gemini...</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>Run AI Extraction</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Sync Changes Proposal View */}
                  {syncJobResult && (
                    <div className="p-6 rounded-2xl glass-panel space-y-4 border border-rose-500/40">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                        <div>
                          <h4 className="text-sm font-bold text-white flex items-center gap-2">
                            <span>Detected Changes ({syncJobResult.changes.length})</span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-400">
                              Manual Content Preserved
                            </span>
                          </h4>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Review and check the updates you wish to apply to the live portfolio.
                          </p>
                        </div>

                        <button
                          onClick={handleApplySync}
                          disabled={selectedChanges.length === 0 || isAnalyzing}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md disabled:opacity-50 flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Apply Selected Changes ({selectedChanges.length})</span>
                        </button>
                      </div>

                      <div className="space-y-2.5">
                        {syncJobResult.changes.map((chg: ResumeSyncChange) => {
                          const isSelected = selectedChanges.includes(chg.id);
                          return (
                            <div
                              key={chg.id}
                              onClick={() => {
                                setSelectedChanges(prev =>
                                  isSelected ? prev.filter(id => id !== chg.id) : [...prev, chg.id]
                                );
                              }}
                              className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                                isSelected
                                  ? 'bg-rose-500/10 border-rose-500/50'
                                  : 'bg-slate-950/40 border-slate-800 opacity-60'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => {}}
                                className="mt-1 rounded text-rose-600"
                              />
                              <div className="flex-1 space-y-1">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-bold text-white">
                                    {chg.title}
                                  </span>
                                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                                    {chg.category} · {chg.type}
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-400">
                                  {chg.reason}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Previous Resume Versions */}
                  <div className="p-6 rounded-2xl glass-panel space-y-4">
                    <h4 className="text-sm font-bold text-white">Resume Version History</h4>
                    <div className="space-y-2">
                      {portfolio.resumeVersions.map(v => (
                        <div
                          key={v.id}
                          className="flex items-center justify-between p-3 rounded-xl bg-slate-950/50 border border-slate-800 text-xs"
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="w-4 h-4 text-rose-500" />
                            <div>
                              <div className="font-semibold text-white flex items-center gap-2">
                                <span>{v.filename}</span>
                                {v.isCurrent && (
                                  <span className="px-2 py-0.2 rounded bg-emerald-500/20 text-emerald-400 text-[10px]">
                                    Current
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] text-slate-500">
                                {new Date(v.uploadedAt).toLocaleDateString()} · {v.versionTag}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <a
                              href={v.pdfUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 hover:text-white"
                            >
                              Download
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: PROJECTS CMS */}
              {activeTab === 'projects' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white">Projects Management</h3>
                      <p className="text-xs text-slate-400">
                        Add, edit, reorder, or publish independent projects. Manual projects are never auto-deleted.
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        setEditingProject({
                          title: '',
                          shortDescription: '',
                          fullDescription: '',
                          features: [],
                          technologies: [],
                          screenshots: [],
                          featured: false,
                          status: 'published'
                        })
                      }
                      className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-md flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>+ Add New Project</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {portfolio.projects.map(proj => (
                      <div
                        key={proj.id}
                        className="p-4 rounded-xl glass-panel border border-slate-800 flex items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-white">{proj.title}</h4>
                            <span
                              className={`px-2 py-0.2 text-[10px] rounded font-mono ${
                                proj.status === 'published'
                                  ? 'bg-emerald-500/20 text-emerald-400'
                                  : 'bg-amber-500/20 text-amber-400'
                              }`}
                            >
                              {proj.status}
                            </span>
                            {proj.featured && (
                              <span className="px-2 py-0.2 text-[10px] rounded font-mono bg-rose-500/20 text-rose-400">
                                Featured
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 line-clamp-1">
                            {proj.shortDescription}
                          </p>
                          <div className="text-[10px] font-mono text-slate-500">
                            Tech: {proj.technologies.join(', ')}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => setEditingProject(proj)}
                            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                            title="Edit Project"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              setConfirmDelete({
                                type: 'project',
                                id: proj.id,
                                title: proj.title
                              })
                            }
                            className="p-2 text-rose-400 hover:text-rose-300 rounded-lg hover:bg-rose-500/20"
                            title="Delete Project"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: CERTIFICATIONS */}
              {activeTab === 'certifications' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white">Certifications CMS</h3>
                      <p className="text-xs text-slate-400">
                        Manage professional credentials, in-app PDF links, and verification URLs.
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        setEditingCert({
                          title: '',
                          issuer: '',
                          issueDate: '2024',
                          credentialUrl: '',
                          skills: [],
                          featured: false,
                          status: 'published'
                        })
                      }
                      className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-md flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>+ Add Certification</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {portfolio.certifications.map(cert => (
                      <div
                        key={cert.id}
                        className="p-4 rounded-xl glass-panel border border-slate-800 flex items-center justify-between gap-4"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-white">{cert.title}</h4>
                            <span className="text-xs text-rose-400 font-medium">
                              · {cert.issuer}
                            </span>
                          </div>
                          <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                            Date: {cert.issueDate || 'N/A'} {cert.pdfUrl && '· PDF Attached'}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditingCert(cert)}
                            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              setConfirmDelete({
                                type: 'cert',
                                id: cert.id,
                                title: cert.title
                              })
                            }
                            className="p-2 text-rose-400 hover:text-rose-300 rounded-lg hover:bg-rose-500/20"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: SKILLS */}
              {activeTab === 'skills' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white">Skills Catalog</h3>
                      <p className="text-xs text-slate-400">
                        Edit skills across Programming, Analytics, Tools, and Healthcare Domains.
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        setEditingSkill({
                          name: '',
                          category: 'analytics',
                          level: 'Proficient'
                        })
                      }
                      className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-md flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>+ Add Skill</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {portfolio.skills.map(sk => (
                      <div
                        key={sk.id}
                        className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between"
                      >
                        <div>
                          <div className="text-xs font-bold text-white">{sk.name}</div>
                          <div className="text-[10px] font-mono text-slate-500 uppercase">
                            {sk.category} · {sk.level}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setEditingSkill(sk)}
                            className="p-1 text-slate-400 hover:text-white"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() =>
                              setConfirmDelete({
                                type: 'skill',
                                id: sk.id,
                                title: sk.name
                              })
                            }
                            className="p-1 text-rose-400 hover:text-rose-300"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: EXPERIENCE */}
              {activeTab === 'experience' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white">Experience Timeline</h3>
                      <p className="text-xs text-slate-400">
                        Manage corporate internships and simulation engagements.
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        setEditingExp({
                          role: '',
                          company: '',
                          companyLocation: '',
                          period: '',
                          type: 'Virtual Internship',
                          description: '',
                          bulletPoints: [],
                          skills: []
                        })
                      }
                      className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-md flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>+ Add Experience</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {portfolio.experience.map(exp => (
                      <div
                        key={exp.id}
                        className="p-4 rounded-xl glass-panel border border-slate-800 flex items-center justify-between"
                      >
                        <div>
                          <h4 className="text-sm font-bold text-white">
                            {exp.role} — {exp.company}
                          </h4>
                          <p className="text-xs text-slate-400 font-mono">
                            {exp.period} · {exp.type}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditingExp(exp)}
                            className="p-2 text-slate-400 hover:text-white"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              setConfirmDelete({
                                type: 'exp',
                                id: exp.id,
                                title: `${exp.role} at ${exp.company}`
                              })
                            }
                            className="p-2 text-rose-400 hover:text-rose-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 6: PROFILE */}
              {activeTab === 'profile' && (
                <div className="p-6 rounded-2xl glass-panel space-y-6">
                  <h3 className="text-xl font-bold text-white">Profile Details</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-slate-400">Full Name</label>
                      <input
                        type="text"
                        value={portfolio.profile.fullName}
                        onChange={e => updateProfile({ fullName: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-slate-400">Preferred Name</label>
                      <input
                        type="text"
                        value={portfolio.profile.name}
                        onChange={e => updateProfile({ name: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                      />
                    </div>
                    <div className="sm:col-span-2 space-y-1.5">
                      <label className="text-xs font-mono text-slate-400">Professional Headline</label>
                      <input
                        type="text"
                        value={portfolio.profile.headline}
                        onChange={e => updateProfile({ headline: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-slate-400">Email Address</label>
                      <input
                        type="email"
                        value={portfolio.profile.email}
                        onChange={e => updateProfile({ email: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-slate-400">Phone</label>
                      <input
                        type="text"
                        value={portfolio.profile.phone}
                        onChange={e => updateProfile({ phone: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-slate-400">LinkedIn URL</label>
                      <input
                        type="text"
                        value={portfolio.profile.linkedinUrl}
                        onChange={e => updateProfile({ linkedinUrl: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-slate-400">GitHub URL</label>
                      <input
                        type="text"
                        value={portfolio.profile.githubUrl}
                        onChange={e => updateProfile({ githubUrl: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 7: MESSAGES INBOX */}
              {activeTab === 'messages' && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-white">Contact Messages Inbox</h3>
                  {portfolio.contactMessages.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 font-mono text-xs">
                      No inquiries received yet.
                    </div>
                  ) : (
                    portfolio.contactMessages.map(msg => (
                      <div
                        key={msg.id}
                        className={`p-4 rounded-xl border ${
                          msg.read ? 'bg-slate-950/40 border-slate-800' : 'bg-rose-500/10 border-rose-500/30'
                        } space-y-2`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="font-bold text-xs text-white">
                            {msg.name} ({msg.email})
                          </div>
                          <div className="text-[10px] font-mono text-slate-400">
                            {new Date(msg.createdAt).toLocaleString()}
                          </div>
                        </div>
                        <div className="text-xs font-semibold text-rose-400">{msg.subject}</div>
                        <p className="text-xs text-slate-300 whitespace-pre-line">{msg.message}</p>
                        <div className="flex justify-end gap-2 pt-2">
                          {!msg.read && (
                            <button
                              onClick={() => markMessageRead(msg.id)}
                              className="px-2.5 py-1 text-[11px] rounded bg-slate-800 text-slate-300"
                            >
                              Mark Read
                            </button>
                          )}
                          <button
                            onClick={() =>
                              setConfirmDelete({
                                type: 'msg',
                                id: msg.id,
                                title: `Message from ${msg.name}`
                              })
                            }
                            className="px-2.5 py-1 text-[11px] rounded bg-rose-500/20 text-rose-400"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* TAB 8: SITE SETTINGS */}
              {activeTab === 'settings' && (
                <div className="p-6 rounded-2xl glass-panel space-y-6">
                  <h3 className="text-xl font-bold text-white">Portfolio Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                      <div>
                        <div className="text-xs font-bold text-white">Interactive 3D OLAP Scene</div>
                        <div className="text-[10px] text-slate-400">Three.js WebGL visual analytics on Hero section</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={portfolio.siteSettings.enable3dScene}
                        onChange={e => updateSiteSettings({ enable3dScene: e.target.checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                      <div>
                        <div className="text-xs font-bold text-white">AI Portfolio Assistant</div>
                        <div className="text-[10px] text-slate-400">Floating recruiter assistant powered by Gemini 3.8 Flash</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={portfolio.siteSettings.enableAiAssistant}
                        onChange={e => updateSiteSettings({ enableAiAssistant: e.target.checked })}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* MODAL: PROJECT EDIT */}
        {editingProject && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-bold text-white">
                {editingProject.id ? 'Edit Project' : 'Add New Project'}
              </h3>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-400 font-mono">Title</label>
                  <input
                    type="text"
                    value={editingProject.title || ''}
                    onChange={e => setEditingProject({ ...editingProject, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white mt-1"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-mono">Short Description</label>
                  <input
                    type="text"
                    value={editingProject.shortDescription || ''}
                    onChange={e => setEditingProject({ ...editingProject, shortDescription: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white mt-1"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-mono">Full Description</label>
                  <textarea
                    rows={3}
                    value={editingProject.fullDescription || ''}
                    onChange={e => setEditingProject({ ...editingProject, fullDescription: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white mt-1"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-mono">Technologies (comma separated)</label>
                  <input
                    type="text"
                    value={editingProject.technologies ? editingProject.technologies.join(', ') : ''}
                    onChange={e =>
                      setEditingProject({
                        ...editingProject,
                        technologies: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white mt-1"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 font-mono">GitHub URL</label>
                    <input
                      type="text"
                      value={editingProject.githubUrl || ''}
                      onChange={e => setEditingProject({ ...editingProject, githubUrl: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 font-mono">Live Demo URL</label>
                    <input
                      type="text"
                      value={editingProject.liveDemoUrl || ''}
                      onChange={e => setEditingProject({ ...editingProject, liveDemoUrl: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white mt-1"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  onClick={() => setEditingProject(null)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    await saveProject(editingProject);
                    setEditingProject(null);
                  }}
                  className="px-5 py-2 rounded-lg bg-rose-600 text-white text-xs font-semibold"
                >
                  Save Project
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: CERTIFICATION EDIT */}
        {editingCert && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl p-6 space-y-4">
              <h3 className="text-lg font-bold text-white">
                {editingCert.id ? 'Edit Certification' : 'Add Certification'}
              </h3>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-400 font-mono">Title</label>
                  <input
                    type="text"
                    value={editingCert.title || ''}
                    onChange={e => setEditingCert({ ...editingCert, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white mt-1"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-mono">Issuer (e.g. Coursera, Google)</label>
                  <input
                    type="text"
                    value={editingCert.issuer || ''}
                    onChange={e => setEditingCert({ ...editingCert, issuer: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white mt-1"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-mono">Credential URL</label>
                  <input
                    type="text"
                    value={editingCert.credentialUrl || ''}
                    onChange={e => setEditingCert({ ...editingCert, credentialUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white mt-1"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  onClick={() => setEditingCert(null)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    await saveCertification(editingCert);
                    setEditingCert(null);
                  }}
                  className="px-5 py-2 rounded-lg bg-rose-600 text-white text-xs font-semibold"
                >
                  Save Certification
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: SKILL EDIT */}
        {editingSkill && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 space-y-4">
              <h3 className="text-lg font-bold text-white">
                {editingSkill.id ? 'Edit Skill' : 'Add Skill'}
              </h3>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-400 font-mono">Skill Name</label>
                  <input
                    type="text"
                    value={editingSkill.name || ''}
                    onChange={e => setEditingSkill({ ...editingSkill, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white mt-1"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-mono">Category</label>
                  <select
                    value={editingSkill.category || 'analytics'}
                    onChange={e => setEditingSkill({ ...editingSkill, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white mt-1"
                  >
                    <option value="programming">Programming</option>
                    <option value="analytics">Data & Analytics</option>
                    <option value="tools">BI & Tools</option>
                    <option value="domain">Healthcare Domain</option>
                    <option value="building">Currently Building</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  onClick={() => setEditingSkill(null)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    await saveSkill(editingSkill);
                    setEditingSkill(null);
                  }}
                  className="px-5 py-2 rounded-lg bg-rose-600 text-white text-xs font-semibold"
                >
                  Save Skill
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: SECURITY / CHANGE PASSWORD */}
        {showPasswordModal && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Key className="w-4 h-4 text-rose-500" />
                <span>Change Administrator Password</span>
              </h3>

              {pwMsg && (
                <div
                  className={`p-3 rounded-lg text-xs ${
                    pwMsg.type === 'success'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-rose-500/20 text-rose-400'
                  }`}
                >
                  {pwMsg.text}
                </div>
              )}

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-400 font-mono">Current Password</label>
                  <input
                    type="password"
                    value={currentPw}
                    onChange={e => setCurrentPw(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white mt-1"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-mono">New Password (min 8 chars)</label>
                  <input
                    type="password"
                    value={newPw}
                    onChange={e => setNewPw(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white mt-1"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPwMsg(null);
                  }}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs"
                >
                  Close
                </button>
                <button
                  onClick={async () => {
                    const res = await changePassword(currentPw, newPw);
                    if (res.success) {
                      setPwMsg({ type: 'success', text: 'Password successfully updated.' });
                      setCurrentPw('');
                      setNewPw('');
                    } else {
                      setPwMsg({ type: 'error', text: res.error || 'Failed to update password.' });
                    }
                  }}
                  className="px-5 py-2 rounded-lg bg-rose-600 text-white text-xs font-semibold"
                >
                  Update Password
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: CONFIRM DELETION */}
        {confirmDelete && (
          <div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
            <div className="w-full max-w-sm bg-slate-900 border border-rose-500/50 rounded-2xl p-6 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-500 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">Confirm Removal</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Are you sure you want to permanently delete{' '}
                  <span className="text-white font-semibold">{confirmDelete.title}</span>?
                </p>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={executeDelete}
                  className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
