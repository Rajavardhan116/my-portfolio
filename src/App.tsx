/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { PortfolioProvider } from './context/PortfolioContext';
import { Navbar } from './components/navigation/Navbar';
import { Hero } from './components/sections/Hero';
import { About } from './components/sections/About';
import { Skills } from './components/sections/Skills';
import { Experience } from './components/sections/Experience';
import { Projects } from './components/sections/Projects';
import { Certifications } from './components/sections/Certifications';
import { Education } from './components/sections/Education';
import { Achievements } from './components/sections/Achievements';
import { Languages } from './components/sections/Languages';
import { GitHubSection } from './components/sections/GitHubSection';
import { ResumeSection } from './components/sections/ResumeSection';
import { Contact } from './components/sections/Contact';
import { Footer } from './components/navigation/Footer';
import { PortfolioAIAssistant } from './components/ai/PortfolioAIAssistant';
import { AdminDashboard } from './components/admin/AdminDashboard';

function PortfolioApp() {
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [adminDefaultTab, setAdminDefaultTab] = useState<string>('resume-sync');

  const openAdminWithTab = (tab = 'resume-sync') => {
    setAdminDefaultTab(tab);
    setIsAdminOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] dark:bg-[#0b0c10] text-[#0f172a] dark:text-[#f8fafc] transition-colors duration-300 relative selection:bg-rose-600 selection:text-white">
      {/* Background ambient pattern */}
      <div className="fixed inset-0 bg-grid-pattern pointer-events-none opacity-40 dark:opacity-20 z-0" />

      {/* Navigation */}
      <Navbar onOpenAdmin={() => openAdminWithTab('resume-sync')} />

      {/* Main Content Sections */}
      <main className="flex-1 relative z-10">
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Certifications />
        <Education />
        <Achievements />
        <Languages />
        <GitHubSection />
        <ResumeSection onOpenAdminResumeSync={() => openAdminWithTab('resume-sync')} />
        <Contact />
      </main>

      {/* Footer */}
      <Footer />

      {/* Public Grounded AI Assistant */}
      <PortfolioAIAssistant />

      {/* Protected Admin Dashboard & Resume Sync CMS */}
      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        defaultTab={adminDefaultTab}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <PortfolioProvider>
          <PortfolioApp />
        </PortfolioProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
