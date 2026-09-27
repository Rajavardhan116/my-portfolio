import React, { useState } from 'react';
import {
  Award,
  ShieldCheck,
  ExternalLink,
  FileText,
  Calendar,
  Eye
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { CertificationItem } from '../../types/portfolio';
import { CertificatePdfViewer } from '../pdf/CertificatePdfViewer';

export const Certifications: React.FC = () => {
  const { portfolio } = usePortfolio();
  const { certifications } = portfolio;
  const [selectedCert, setSelectedCert] = useState<CertificationItem | null>(null);

  return (
    <section id="certifications" className="py-20 bg-slate-50/50 dark:bg-slate-950/40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-mono font-semibold uppercase tracking-widest text-rose-600 dark:text-rose-400">
            Verified Credentials
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Professional Certifications
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            Industry credentials from Google, Cisco Networking Academy, Coursera, and Future Skills Prime covering end-to-end data analysis.
          </p>
        </div>

        {/* Certifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certifications.map(cert => (
            <div
              key={cert.id}
              className="p-6 rounded-2xl glass-panel hover:border-rose-500/50 transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
                  <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400 font-medium">
                    <Award className="w-4 h-4" />
                    {cert.issuer}
                  </span>
                  {cert.issueDate && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {cert.issueDate}
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                  {cert.title}
                </h3>

                {cert.description && (
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                    {cert.description}
                  </p>
                )}

                {/* Skills tags */}
                {cert.skills && cert.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {cert.skills.map((sk, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 text-[10px] font-mono rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => setSelectedCert(cert)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600/10 hover:bg-rose-600 text-rose-600 dark:text-rose-400 hover:text-white text-xs font-semibold transition-all"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Certificate</span>
                </button>

                {cert.credentialUrl && (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                    title="External Verification Link"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* In-App PDF Viewer Modal */}
      <CertificatePdfViewer
        certification={selectedCert}
        onClose={() => setSelectedCert(null)}
      />
    </section>
  );
};
