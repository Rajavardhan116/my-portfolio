import React from 'react';
import { Languages as LanguagesIcon, CheckCircle2 } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';

export const Languages: React.FC = () => {
  const { portfolio } = usePortfolio();
  const { languages } = portfolio;

  return (
    <section id="languages" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-mono font-semibold uppercase tracking-widest text-rose-600 dark:text-rose-400">
            Communication
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Languages & Fluency
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            Multi-lingual proficiency enabling seamless collaboration across regional and international technical teams.
          </p>
        </div>

        {/* Languages Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {languages.map(lang => (
            <div
              key={lang.id}
              className="p-5 rounded-2xl glass-panel text-center hover:border-rose-500/50 transition-all duration-300 space-y-2 group"
            >
              <div className="w-10 h-10 mx-auto rounded-xl bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <LanguagesIcon className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {lang.language}
              </h3>
              <p className="text-xs text-rose-600 dark:text-rose-400 font-mono font-medium">
                {lang.proficiency}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
