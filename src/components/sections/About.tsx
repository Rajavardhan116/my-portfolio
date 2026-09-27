import React from 'react';
import {
  Activity,
  Layers,
  BarChart3,
  FileSpreadsheet,
  CheckCircle2,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';

export const About: React.FC = () => {
  const { portfolio } = usePortfolio();
  const { about, profile } = portfolio;

  const iconMap: Record<string, any> = {
    Activity,
    Layers,
    BarChart3,
    FileSpreadsheet
  };

  return (
    <section id="about" className="py-20 bg-slate-50/50 dark:bg-slate-950/40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-mono font-semibold uppercase tracking-widest text-rose-600 dark:text-rose-400">
            Professional Profile
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            About Raja Vardhan
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            Bridging raw clinical workflows and operational databases into decision-ready executive dashboards and statistical models.
          </p>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {about.quickStats.map((stat, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl glass-panel text-center transition-transform hover:-translate-y-1"
            >
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
                {stat.value}
              </div>
              <div className="mt-1 text-xs font-semibold text-rose-600 dark:text-rose-400">
                {stat.label}
              </div>
              {stat.sublabel && (
                <div className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                  {stat.sublabel}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Narrative & Focus Areas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Summary & Verified Highlights */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 sm:p-7 rounded-2xl glass-panel space-y-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-rose-500" />
                <span>Analytical Foundation</span>
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {about.summary}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {profile.bio}
              </p>
            </div>

            {/* Highlights List */}
            <div className="p-6 rounded-2xl glass-panel space-y-3">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                Key Analytical Competencies
              </h4>
              <ul className="space-y-2.5">
                {about.highlights.map((hl, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <span>{hl}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column: 4 Distinct Domain Focus Pillars */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {about.focusAreas.map((area, idx) => {
              const Icon = iconMap[area.icon] || Activity;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl glass-panel hover:border-rose-500/50 transition-all duration-300 space-y-3 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                    {area.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {area.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
