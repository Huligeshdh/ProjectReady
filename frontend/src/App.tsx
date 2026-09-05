import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/Layout/Sidebar';
import { Header } from './components/Layout/Header';
import { BackToTop } from './components/UI/BackToTop';

import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProjectPage } from './pages/ProjectPage';
import { ResearchHubPage } from './pages/ResearchHubPage';
import { MentorPage } from './pages/MentorPage';
import { ReviewHealthPage } from './pages/ReviewHealthPage';
import { DocumentGeneratorPage } from './pages/DocumentGeneratorPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { AuthPage } from './pages/AuthPage';
import { OnboardingWizard } from './components/Onboarding/OnboardingWizard';

export function App() {
  const [authenticated, setAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem('access_token');
  });

  const [onboardingNeeded, setOnboardingNeeded] = useState<boolean>(() => {
    return !localStorage.getItem('onboarding_completed');
  });

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLoginSuccess = (isNewUser?: boolean) => {
    setAuthenticated(true);
    if (isNewUser) {
      setOnboardingNeeded(true);
    }
  };

  const handleOnboardingComplete = () => {
    localStorage.setItem('onboarding_completed', 'true');
    setOnboardingNeeded(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    setAuthenticated(false);
  };

  return (
    <Router>
      <Routes>
        {/* PUBLIC LANDING PAGE */}
        <Route
          path="/"
          element={
            authenticated && !onboardingNeeded ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <LandingPage />
            )
          }
        />

        {/* AUTHENTICATION ROUTES */}
        <Route
          path="/login"
          element={
            authenticated && !onboardingNeeded ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <AuthPage initialMode="login" onLoginSuccess={handleLoginSuccess} />
            )
          }
        />

        <Route
          path="/signup"
          element={
            authenticated && !onboardingNeeded ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <AuthPage initialMode="signup" onLoginSuccess={handleLoginSuccess} />
            )
          }
        />

        {/* PROTECTED APPLICATION ROUTES */}
        <Route
          path="/*"
          element={
            !authenticated ? (
              <Navigate to="/login" replace />
            ) : onboardingNeeded ? (
              <OnboardingWizard onComplete={handleOnboardingComplete} />
            ) : (
              <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans antialiased selection:bg-brand-500 selection:text-white">
                <Sidebar mobileOpen={mobileMenuOpen} setMobileOpen={setMobileMenuOpen} />

                {/* Mobile Overlay */}
                {mobileMenuOpen && (
                  <div
                    onClick={() => setMobileMenuOpen(false)}
                    className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-20 md:hidden"
                  />
                )}

                <div className="flex-1 flex flex-col min-w-0">
                  <Header onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} onLogout={handleLogout} />
                  <main className="flex-1 overflow-y-auto">
                    <Routes>
                      {/* 5 CORE SECTIONS */}
                      <Route path="/dashboard" element={<DashboardPage />} />
                      <Route path="/project" element={<ProjectPage />} />
                      <Route path="/research" element={<ResearchHubPage />} />
                      <Route path="/mentor" element={<MentorPage />} />
                      <Route path="/review" element={<ReviewHealthPage />} />

                      {/* ALIAS REDIRECTS FOR PREVIOUS LINKS */}
                      <Route path="/ideas" element={<Navigate to="/project?tab=idea" replace />} />
                      <Route path="/feasibility" element={<Navigate to="/project?tab=feasibility" replace />} />
                      <Route path="/blueprint" element={<Navigate to="/project?tab=blueprint" replace />} />
                      <Route path="/roadmap" element={<Navigate to="/project?tab=roadmap" replace />} />
                      <Route path="/code-review" element={<Navigate to="/review?tab=review" replace />} />
                      <Route path="/health" element={<Navigate to="/review?tab=health" replace />} />
                      <Route path="/reality-check" element={<Navigate to="/review?tab=reality-check" replace />} />
                      <Route path="/improvements" element={<Navigate to="/review?tab=improvements" replace />} />

                      {/* PROFILE & SETTINGS */}
                      <Route path="/documents" element={<DocumentGeneratorPage />} />
                      <Route path="/profile" element={<ProfilePage />} />
                      <Route path="/settings" element={<SettingsPage />} />

                      <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                  </main>
                </div>
                <BackToTop />
              </div>
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
