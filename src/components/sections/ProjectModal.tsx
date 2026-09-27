import React from 'react';
import {
  X,
  ExternalLink,
  Github,
  CheckCircle2,
  AlertCircle,
  Trophy,
  Layers,
  Sparkles
} from 'lucide-react';
import { ProjectItem } from '../../types/portfolio';

interface ProjectModalProps {
  project: ProjectItem | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl my-8 bg-slate-900 border border-slate-700/60 rounded-2xl shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[90vh]">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80 sticky top-0 z-10">
          <div className="flex items-center gap-2 text-rose-500 font-mono text-xs uppercase tracking-wider">
            <Layers className="w-4 h-4" />
            <span>Analytical Project Specification</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3">
              {project.title}
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              {project.fullDescription || project.shortDescription}
            </p>
          </div>

          {/* Technologies */}
          <div className="flex flex-wrap gap-2 pt-1">
            {project.technologies.map((tech, idx) => (
              <span
                key={idx}
                className="px-3 py-1 text-xs font-mono rounded-md bg-rose-500/10 text-rose-300 border border-rose-500/20"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-3 pt-2">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition-colors border border-slate-700"
              >
                <Github className="w-4 h-4" />
                <span>View on GitHub</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>
            )}
            {project.liveDemoUrl && (
              <a
                href={project.liveDemoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-medium rounded-lg bg-rose-600 hover:bg-rose-500 text-white transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                <span>Live Interactive Demo</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          {/* Screenshots */}
          {project.screenshots && project.screenshots.length > 0 && (
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
                Visual Artifacts & Architecture
              </h4>
              <div className="grid grid-cols-1 gap-4">
                {project.screenshots.map((shot, idx) => (
                  <div
                    key={idx}
                    className="relative overflow-hidden rounded-xl border border-slate-700 bg-slate-950 aspect-video"
                  >
                    <img
                      src={shot}
                      alt={`${project.title} screenshot ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Problem Statement */}
          {project.problemStatement && (
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider">
                <AlertCircle className="w-4 h-4" />
                <span>Problem Statement</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {project.problemStatement}
              </p>
            </div>
          )}

          {/* Key Features */}
          {project.features && project.features.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
                Key Features & Engineering Highlights
              </h4>
              <ul className="space-y-2.5">
                {project.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Challenges & Results */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {project.challenges && (
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
                <h5 className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
                  Technical Challenges
                </h5>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {project.challenges}
                </p>
              </div>
            )}
            {project.results && (
              <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-900/40 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-400 uppercase tracking-wider font-mono">
                  <Trophy className="w-3.5 h-3.5" />
                  <span>Outcomes & Impact</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {project.results}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-950/80 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
