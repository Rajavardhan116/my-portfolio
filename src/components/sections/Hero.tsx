import React from 'react';
import {
  ArrowRight,
  Download,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Sparkles,
  BarChart2,
  Database,
  ShieldCheck,
  FileSpreadsheet
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { DataCubeScene } from '../3d/DataCubeScene';

export const Hero: React.FC = () => {
  const { portfolio } = usePortfolio();
  const { profile } = portfolio;

  return (
    <section id="home" className="relative pt-28 pb-16 lg:pt-36 lg:pb-24 overflow-hidden">
      {/* Background subtle radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-600/10 dark:bg-rose-900/15 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Recruiter-Focused Narrative */}
          <div className="lg:col-span-6 space-y-6 text-left">
            {/* Status kicker badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/25 text-rose-600 dark:text-rose-400 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{profile.statusText || 'Open to Data Analyst & Healthcare Analytics Roles'}</span>
            </div>

            {/* Candidate Name & Title */}
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
                {profile.fullName}
              </h1>
              <p className="mt-3 text-base sm:text-lg font-semibold text-rose-600 dark:text-rose-400">
                {profile.headline}
              </p>
            </div>

            {/* Value Proposition */}
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
              {profile.subheadline || profile.bio}
            </p>

            {/* Quick Metadata: Location & University */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                {profile.location}
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                Dhanalakshmi Srinivasan University ({profile.yearsOfStudy || '2023 - 2027'})
              </span>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#projects"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs sm:text-sm shadow-lg crimson-glow transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>{profile.heroPrimaryCtaText || 'View Projects'}</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="/api/resume/download"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-200/80 dark:bg-slate-800 text-slate-800 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-700 font-semibold text-xs sm:text-sm border border-slate-300 dark:border-slate-700 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Download className="w-4 h-4" />
                <span>{profile.heroSecondaryCtaText || 'Download Resume'}</span>
              </a>

              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 font-semibold text-xs sm:text-sm transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>Get in Touch</span>
              </a>
            </div>

            {/* Social & Verification Links */}
            <div className="flex items-center gap-4 pt-3 border-t border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-500 font-mono">Connect:</span>
              {profile.githubUrl && (
                <a
                  href={profile.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:text-white hover:bg-slate-900 transition-colors"
                  title="GitHub Profile"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
              {profile.linkedinUrl && (
                <a
                  href={profile.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:text-white hover:bg-[#0077b5] transition-colors"
                  title="LinkedIn Profile"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {profile.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:text-white hover:bg-rose-600 transition-colors"
                  title="Direct Email"
                >
                  <Mail className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Right Column: 3D Interactive OLAP Data Environment */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl glass-panel p-2 shadow-2xl border border-slate-700/40 dark:border-rose-950/40 overflow-hidden">
              {/* Subtle top indicator bar */}
              <div className="flex items-center justify-between px-3 py-2 border-b border-slate-700/20 text-[11px] font-mono text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-rose-500" />
                  <span>3D OLAP Cube · Real-Time WebGL</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>Active Simulation</span>
                </div>
              </div>

              {/* 3D Canvas */}
              <DataCubeScene />

              {/* Bottom Quick Analytics Strip */}
              <div className="grid grid-cols-3 gap-2 p-2 border-t border-slate-700/20 text-center">
                <div className="p-2 rounded-lg bg-slate-100/50 dark:bg-slate-900/50">
                  <div className="text-[10px] text-slate-500 font-mono">MODELING</div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">OLAP Cubes</div>
                </div>
                <div className="p-2 rounded-lg bg-slate-100/50 dark:bg-slate-900/50">
                  <div className="text-[10px] text-slate-500 font-mono">BI TOOLS</div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Power BI · DAX</div>
                </div>
                <div className="p-2 rounded-lg bg-slate-100/50 dark:bg-slate-900/50">
                  <div className="text-[10px] text-slate-500 font-mono">SPECIALIZATION</div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Healthcare</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
