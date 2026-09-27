import React from 'react';
import { GraduationCap, Calendar, Award, CheckCircle2 } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';

export const Education: React.FC = () => {
  const { portfolio } = usePortfolio();
  const { education } = portfolio;

  return (
    <section id="education" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-mono font-semibold uppercase tracking-widest text-rose-600 dark:text-rose-400">
            Academic Background
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Formal Education & Accreditations
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            Rigorous undergraduate training in computational intelligence, relational database systems, and statistical methodologies.
          </p>
        </div>

        {/* Education List */}
        <div className="max-w-3xl mx-auto space-y-6">
          {education.map(edu => (
            <div
              key={edu.id}
              className="p-6 sm:p-8 rounded-2xl glass-panel hover:border-rose-500/50 transition-all duration-300 space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                      {edu.degree}
                    </h3>
                    <p className="text-sm font-semibold text-rose-600 dark:text-rose-400">
                      {edu.institution}
                    </p>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1 font-mono text-xs">
                  <span className="flex items-center gap-1 text-slate-500">
                    <Calendar className="w-3.5 h-3.5" />
                    {edu.period}
                  </span>
                  {edu.cgpa && (
                    <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20">
                      CGPA: {edu.cgpa}
                    </span>
                  )}
                </div>
              </div>

              {edu.highlights && edu.highlights.length > 0 && (
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                  <ul className="space-y-2">
                    {edu.highlights.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
