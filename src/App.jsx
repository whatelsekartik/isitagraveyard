import React from 'react';
import { BrowserRouter, Route, Routes, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import { GraveyardProvider, useGraveyard } from './context/GraveyardContext';
import { Navbar } from './components/navigation/Navbar';
import { Footer } from './components/navigation/Footer';
import { AuthModal } from './components/glass-panels/AuthModal';
import { PaperAtmosphere } from './components/animations/PaperAtmosphere';
import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import ProjectAutopsyPage from './pages/ProjectAutopsyPage';
import BuryProjectPage from './pages/BuryProjectPage';
import CommunityPage from './pages/CommunityPage';
import DashboardPage from './pages/DashboardPage';

function AppShell() {
  const location = useLocation();
  const { toast } = useGraveyard();

  return (
    <div className="relative flex min-h-screen flex-col bg-[#EFE7D6] text-[#1A1714]">
      <PaperAtmosphere />
      <Navbar />

      <main className="flex-1">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomePage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/projects/:id" element={<ProjectAutopsyPage />} />
          <Route path="/bury" element={<BuryProjectPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
      <AuthModal />

      {/* Floating Archival Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            className="paper-sheet-deep fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-[4px] border-[#1D5B3A]/40 px-4 py-3 text-xs font-bold text-[#1A1714]"
          >
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                toast.tone === 'cyan' ? 'bg-[#1E4A7A]' : 'bg-[#1D5B3A]'
              }`}
            />
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <GraveyardProvider>
        <BrowserRouter>
          <AppShell />
        </BrowserRouter>
      </GraveyardProvider>
    </MotionConfig>
  );
}
