import React, { useState } from 'react';
import {
  Code,
  BarChart2,
  Wrench,
  Stethoscope,
  TrendingUp,
  Sparkles,
  Check
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { SkillCategory } from '../../types/portfolio';

export const Skills: React.FC = () => {
  const { portfolio } = usePortfolio();
  const { skills } = portfolio;
  const [activeTab, setActiveTab] = useState<string>('all');

  const categories: { id: string; label: string; icon: any; description: string }[] = [
    { id: 'all', label: 'All Disciplines', icon: Sparkles, description: 'Complete technical & healthcare data analytics toolkit' },
    { id: 'programming', label: 'Programming', icon: Code, description: 'Core languages for scripting, backend logic, and query building' },
    { id: 'analytics', label: 'Data & Analytics', icon: BarChart2, description: 'Analytical modeling, multidimensional OLAP cubes, and EDA' },
    { id: 'tools', label: 'BI & Tools', icon: Wrench, description: 'Enterprise visualization dashboards and developer toolchains' },
    { id: 'domain', label: 'Healthcare Domain', icon: Stethoscope, description: 'Clinical workflows, physician analytics, and patient experience' },
    { id: 'building', label: 'Currently Building', icon: TrendingUp, description: 'Ongoing expansions in Machine Learning and Cloud Fundamentals' }
  ];

  const filteredSkills = activeTab === 'all'
    ? skills
    : skills.filter(s => s.category === activeTab);

  return (
    <section id="skills" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-mono font-semibold uppercase tracking-widest text-rose-600 dark:text-rose-400">
            Technical Competencies
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Skills & Analytical Frameworks
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            Verified analytical capabilities spanning structured query logic, multidimensional data modeling, and healthcare workflow reporting.
          </p>
        </div>

        {/* Category Filter Controls */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map(cat => {
            const Icon = cat.icon;
            const isActive = activeTab === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Skills Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredSkills.map(skill => (
            <div
              key={skill.id}
              className="p-5 rounded-xl glass-panel hover:border-rose-500/50 transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 dark:text-slate-500 mb-2">
                  <span className="uppercase">{skill.category}</span>
                  {skill.level && (
                    <span className="text-rose-600 dark:text-rose-400 font-medium">
                      {skill.level}
                    </span>
                  )}
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                  {skill.name}
                </h4>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
                <span className="font-mono text-[10px]">
                  {skill.source === 'resume' ? 'Verified Credential' : 'CMS Verified'}
                </span>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
