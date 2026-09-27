import React from 'react';
import {
  FileText,
  Download,
  ExternalLink,
  ShieldCheck,
  Calendar,
  CheckCircle2,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';

interface ResumeSectionProps {
  onOpenAdminResumeSync: () => void;
}

export const ResumeSection: React.FC<ResumeSectionProps> = ({ onOpenAdminResumeSync }) => {
  const { portfolio } = usePortfolio();
  const currentResume = portfolio.resumeVersions.find(v => v.isCurrent) || portfolio.resumeVersions[0];

  return (
    <section id="resume" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-mono font-semibold uppercase tracking-widest text-rose-600 dark:text-rose-400">
            Curriculum Vitae
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Verified Resume & Credentials
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            Download the official verified technical resume for Iragam Reddy Raja Vardhan Reddy.
          </p>
        </div>

        {/* Resume Card Preview */}
        <div className="max-w-4xl mx-auto rounded-3xl glass-panel p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-2xl relative overflow-hidden">
          {/* Decorative Corner Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-slate-200 dark:border-slate-800">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-mono text-xs font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Active Production Document</span>
                {currentResume && (
                  <span className="px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 text-[10px]">
                    {currentResume.versionTag}
                  </span>
                )}
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                {portfolio.profile.fullName}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-mono">
                {currentResume ? currentResume.filename : 'Raja_Vardhan_Resume.pdf'}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="/api/resume/download"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs sm:text-sm shadow-md transition-all hover:scale-105 active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>Download Resume</span>
              </a>

              <button
                onClick={onOpenAdminResumeSync}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-medium text-xs sm:text-sm border border-slate-300 dark:border-slate-700 transition-colors"
              >
                <Sparkles className="w-4 h-4 text-rose-500" />
                <span>Upload New (Admin Sync)</span>
              </button>
            </div>
          </div>

          {/* Quick Summary Preview of Resume Data */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8">
            <div className="space-y-2">
              <h4 className="text-xs font-mono font-bold uppercase text-slate-400">
                Core Concentrations
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Healthcare Data Analytics, Multidimensional OLAP Cubes, Clinical Workflows, Patient Dashboards.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-mono font-bold uppercase text-slate-400">
                Technical Stack
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Python, SQL, Power BI, Advanced Excel, Java, C, Git, GitHub, VS Code.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-mono font-bold uppercase text-slate-400">
                Experience & Education
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Deloitte Virtual Internship · Dhanalakshmi Srinivasan University B.Tech AI & Data Science (CGPA: 8.5/10).
              </p>
            </div>
          </div>

          {/* Note on Sync Architecture */}
          <div className="mt-8 p-4 rounded-xl bg-slate-100/50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 flex items-center justify-between flex-wrap gap-3 text-xs text-slate-500 dark:text-slate-400">
            <span>
              Synchronized with AI-powered resume comparison engine. Manual portfolio items are permanently preserved.
            </span>
            <span className="font-mono text-[11px] text-rose-600 dark:text-rose-400 font-semibold">
              Source: Verified Resume 2026
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
