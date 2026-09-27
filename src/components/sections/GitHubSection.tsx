import React, { useEffect, useState } from 'react';
import {
  Github,
  Star,
  GitFork,
  ExternalLink,
  Code2,
  Calendar,
  Sparkles
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';

interface RepoData {
  id: number;
  name: string;
  description: string;
  html_url: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  topics?: string[];
}

export const GitHubSection: React.FC = () => {
  const { portfolio } = usePortfolio();
  const [repos, setRepos] = useState<RepoData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch('/api/github/repos')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setRepos(data);
      })
      .catch(() => {
        // Handled silently
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <section id="github" className="py-20 bg-slate-50/50 dark:bg-slate-950/40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-xs font-mono font-semibold uppercase tracking-widest text-rose-600 dark:text-rose-400">
              Open Source & Code
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              GitHub Repositories
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Public scripts, OLAP schemas, SQL data pipelines, and analytics modules.
            </p>
          </div>

          <a
            href={portfolio.profile.githubUrl || 'https://github.com/Rajavardhan116'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-xs sm:text-sm font-semibold transition-colors self-start sm:self-auto border border-slate-700"
          >
            <Github className="w-4 h-4" />
            <span>@Rajavardhan116 on GitHub</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Repositories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            [...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-44 rounded-2xl glass-panel animate-pulse p-6 space-y-4"
              >
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-2/3" />
                <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-full" />
                <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
              </div>
            ))
          ) : (
            repos.map(repo => (
              <div
                key={repo.id}
                className="p-6 rounded-2xl glass-panel hover:border-rose-500/50 transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
                    <span className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-semibold">
                      <Code2 className="w-3.5 h-3.5" />
                      {repo.language || 'Analytics'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(repo.updated_at).toLocaleDateString(undefined, {
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                    {repo.name}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                    {repo.description || 'Data analytics algorithms, SQL schema scripts, and exploratory modeling code.'}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
                    <span className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-500" />
                      {repo.stargazers_count}
                    </span>
                    <span className="flex items-center gap-1">
                      <GitFork className="w-3.5 h-3.5" />
                      {repo.forks_count}
                    </span>
                  </div>

                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline"
                  >
                    <span>Inspect Code</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};
