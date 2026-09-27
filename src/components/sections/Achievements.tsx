import React from 'react';
import { Trophy, Award, Target } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';

export const Achievements: React.FC = () => {
  const { portfolio } = usePortfolio();
  const { achievements } = portfolio;

  return (
    <section id="achievements" className="py-20 bg-slate-50/50 dark:bg-slate-950/40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-mono font-semibold uppercase tracking-widest text-rose-600 dark:text-rose-400">
            Milestones
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Honors & Achievements
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            Documented recognitions and continuous participation in competitive technical analytics forums.
          </p>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {achievements.map((ach, idx) => (
            <div
              key={ach.id}
              className="p-6 rounded-2xl glass-panel hover:border-rose-500/50 transition-all duration-300 space-y-3 group"
            >
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Trophy className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-mono uppercase text-slate-500 font-semibold">
                {ach.category}
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {ach.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {ach.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
