import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { LabsPage } from './pages/LabsPage';
import { LabDetailPage } from './pages/LabDetailPage';
import { FacultyPage } from './pages/FacultyPage';
import { FacultyDetailPage } from './pages/FacultyDetailPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { CollaborationPage } from './pages/CollaborationPage';
import { SearchPage } from './pages/SearchPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export default function App() {
  return (
    <HashRouter>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col bg-[#F1F5F9] text-[#0F172A] selection:bg-amber-600 selection:text-white">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/labs" element={<LabsPage />} />
            <Route path="/labs/:id" element={<LabDetailPage />} />
            <Route path="/faculty" element={<FacultyPage />} />
            <Route path="/faculty/:id" element={<FacultyDetailPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/collaboration" element={<CollaborationPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/admin" element={<AdminLoginPage />} />
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            {/* Fallback */}
            <Route path="*" element={<HomePage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </HashRouter>
  );
}
