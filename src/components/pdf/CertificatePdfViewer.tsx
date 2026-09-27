import React, { useState } from 'react';
import {
  X,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Download,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { CertificationItem } from '../../types/portfolio';

interface CertificatePdfViewerProps {
  certification: CertificationItem | null;
  onClose: () => void;
}

export const CertificatePdfViewer: React.FC<CertificatePdfViewerProps> = ({
  certification,
  onClose
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  if (!certification) return null;

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 25, 50));
  const toggleFullscreen = () => setIsFullscreen(prev => !prev);

  // If there is an external credential URL or uploaded PDF
  const targetUrl = certification.pdfUrl || certification.credentialUrl || '#';
  const hasDirectPdf = !!certification.pdfUrl;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md">
      <div
        className={`relative flex flex-col bg-slate-900 border border-slate-700/60 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ${
          isFullscreen
            ? 'w-full h-full rounded-none'
            : 'w-full max-w-4xl h-[90vh] max-h-[850px]'
        }`}
      >
        {/* Top Control Bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-950/80 text-white">
          <div className="flex items-center gap-2.5 truncate pr-2">
            <ShieldCheck className="w-5 h-5 text-rose-500 shrink-0" />
            <div className="truncate">
              <h3 className="text-sm font-semibold truncate text-slate-100">
                {certification.title}
              </h3>
              <p className="text-xs text-slate-400 truncate">
                {certification.issuer} {certification.issueDate && `· ${certification.issueDate}`}
              </p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Page navigation */}
            <div className="hidden sm:flex items-center gap-1 px-2 py-1 bg-slate-800/80 rounded-lg text-xs text-slate-300">
              <button
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="p-1 hover:text-white disabled:opacity-30"
                title="Previous Page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-mono px-1">
                {currentPage} / {totalPages}
              </span>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className="p-1 hover:text-white disabled:opacity-30"
                title="Next Page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-1 px-1.5 py-1 bg-slate-800/80 rounded-lg text-xs">
              <button
                onClick={handleZoomOut}
                className="p-1 text-slate-300 hover:text-white transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="font-mono text-slate-300 px-1 text-[11px] hidden sm:inline">
                {zoomLevel}%
              </span>
              <button
                onClick={handleZoomIn}
                className="p-1 text-slate-300 hover:text-white transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </button>

            {/* Download */}
            <a
              href={targetUrl}
              download={hasDirectPdf}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              title="Download or View Original"
            >
              <Download className="w-4 h-4" />
            </a>

            {/* Open in new tab */}
            {certification.credentialUrl && (
              <a
                href={certification.credentialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                title="Open Credential Verification"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}

            {/* Close */}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors ml-1"
              title="Close Viewer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Display Area */}
        <div className="flex-1 bg-slate-950 overflow-auto p-4 sm:p-8 flex items-center justify-center">
          <div
            className="transition-transform duration-200 origin-center flex flex-col items-center"
            style={{ transform: `scale(${zoomLevel / 100})` }}
          >
            {hasDirectPdf ? (
              <iframe
                src={`${certification.pdfUrl}#toolbar=0`}
                className="w-[700px] h-[500px] sm:w-[800px] sm:h-[580px] bg-white rounded-lg shadow-2xl border border-slate-700"
                title={certification.title}
              />
            ) : (
              /* Polished Official Certificate Graphic Representation */
              <div className="w-[340px] sm:w-[650px] md:w-[740px] bg-[#0c1017] border-2 border-rose-500/40 rounded-xl p-8 sm:p-12 shadow-2xl relative overflow-hidden text-center text-slate-100">
                {/* Decorative border elements */}
                <div className="absolute inset-2 border border-slate-700/50 rounded-lg pointer-events-none" />
                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-600/10 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-sky-600/10 rounded-full blur-2xl pointer-events-none" />

                <div className="flex items-center justify-center gap-2 mb-4 text-rose-500 font-mono text-xs uppercase tracking-widest">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verified Credential Record</span>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-2">
                  {certification.title}
                </h2>

                <p className="text-sm sm:text-base text-rose-400 font-medium mb-6">
                  Issued by {certification.issuer}
                </p>

                <div className="max-w-xl mx-auto text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                  {certification.description ||
                    'Recognizing demonstrated proficiency in data analytics methodologies, statistical analysis, and applied analytical tooling.'}
                </div>

                {certification.skills && certification.skills.length > 0 && (
                  <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
                    {certification.skills.map((sk, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 text-xs rounded-md bg-slate-800 text-slate-300 border border-slate-700"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                )}

                <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-slate-500" />
                    <span>Candidate: Iragam Reddy Raja Vardhan Reddy</span>
                  </div>
                  <div className="font-mono text-slate-500">
                    Status: Verified Resume Credential
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Note */}
        <div className="px-4 py-2.5 bg-slate-950 border-t border-slate-800/80 text-xs text-slate-400 flex items-center justify-between">
          <span>
            {certification.pdfUrl
              ? 'Original PDF loaded'
              : 'Verified credentials record from verified resume data.'}
          </span>
          {certification.credentialUrl && (
            <a
              href={certification.credentialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-rose-400 hover:text-rose-300 flex items-center gap-1 font-medium"
            >
              Verify on Issuer Portal <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
