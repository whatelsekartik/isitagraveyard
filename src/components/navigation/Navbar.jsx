import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import { useGraveyard } from '../../context/GraveyardContext';
import { Plus, Menu, X, User, LogOut, Sparkles, Volume2, VolumeX } from 'lucide-react';
import {
  isPaperSoundEnabled,
  playPenClick,
  setPaperSoundEnabled,
} from '../../lib/paperSound';

const NAV_LINKS = [
  { label: 'Explore', to: '/explore' },
  { label: 'How it works', to: '/#how-it-works' },
  { label: 'Community', to: '/community' },
  { label: 'Dashboard', to: '/dashboard' },
];

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, activeProfile, setAuthModalOpen, signOut } = useGraveyard();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(isPaperSoundEnabled);

  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 180, damping: 28 });

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setPaperSoundEnabled(next);
    if (next) playPenClick();
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 36);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname, location.hash]);

  const handleNavClick = (to) => {
    if (to === '/#how-it-works') {
      if (location.pathname !== '/') {
        navigate('/#how-it-works');
      } else {
        document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
      }
      setMobileOpen(false);
      return;
    }
    navigate(to);
  };

  const isActive = (to) => {
    if (to === '/#how-it-works') return location.pathname === '/' && location.hash === '#how-it-works';
    return location.pathname === to;
  };

  return (
    <>
      {/* Top Drafting Progress Hairline */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[3px] bg-[#181614]/10">
        <motion.div
          style={{ scaleX: smoothProgress, transformOrigin: 'left' }}
          className="h-full w-full bg-[#17663F]"
        />
      </div>

      <header className="pointer-events-none fixed inset-x-0 top-0 z-40 flex justify-center px-4 pt-4 sm:px-6">
        <nav
          aria-label="Global Navigation"
          className={`pointer-events-auto flex w-full max-w-6xl items-center justify-between rounded-[6px] px-3 py-2 transition-all duration-300 sm:px-5 ${
            scrolled ? 'paper-nav paper-nav-scrolled' : 'paper-nav'
          }`}
        >
          {/* Wordmark + Custom Brand Emblem */}
          <Link to="/" className="group flex items-center gap-2.5 pl-1">
            <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-[4px] border border-[#1A1714]/25 bg-[#F8F2E4] shadow-sm transition group-hover:border-[#1D5B3A]">
              <img
                src="/images/brand-logo.png"
                alt="Project Graveyard emblem"
                className="h-9 w-9 object-contain mix-blend-multiply"
              />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-display text-lg font-bold tracking-tight text-[#1A1714] sm:text-xl">
                Project Graveyard
              </span>
              <span className="hidden font-typewriter text-[9px] uppercase tracking-[0.16em] text-[#5B5246] sm:block">
                Dead Projects · Living Ideas
              </span>
            </div>
          </Link>

          {/* Desktop Center Links */}
          <div className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((item) => {
              const active = isActive(item.to);
              return (
                <button
                  key={item.to}
                  type="button"
                  onClick={() => handleNavClick(item.to)}
                  className={`relative rounded-[4px] px-3.5 py-1.5 text-[13px] font-bold transition ${
                    active ? 'text-[#FCF9F0]' : 'text-[#5B5246] hover:text-[#1A1714]'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-active-ink"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      className="absolute inset-0 rounded-[4px] bg-[#1A1714] shadow-sm"
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleSound}
              title={soundOn ? 'Mute paper sound effects' : 'Enable paper sound effects'}
              aria-label={soundOn ? 'Mute paper sound effects' : 'Enable paper sound effects'}
              className="paper-chip hidden h-8 w-8 items-center justify-center rounded-full text-[#5E584E] hover:text-[#181614] sm:flex"
            >
              {soundOn ? <Volume2 className="h-3.5 w-3.5 text-[#17663F]" /> : <VolumeX className="h-3.5 w-3.5" />}
            </button>

            {isAuthenticated ? (
              <div className="hidden items-center gap-1.5 sm:flex">
                <Link
                  to="/dashboard"
                  className="paper-chip flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium text-[#181614]"
                >
                  <span className="h-2 w-2 rounded-full bg-[#17663F]" />
                  <span className="max-w-[110px] truncate">{activeProfile.displayName}</span>
                </Link>
                <button
                  type="button"
                  onClick={signOut}
                  title="Sign out"
                  aria-label="Sign out"
                  className="paper-chip flex h-8 w-8 items-center justify-center rounded-full text-[#5E584E] hover:text-[#181614]"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setAuthModalOpen(true)}
                className="paper-chip hidden items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium text-[#181614] sm:flex"
              >
                <User className="h-3.5 w-3.5 text-[#17663F]" />
                <span>Sign In</span>
              </button>
            )}

            <Link
              to="/bury"
              className="group relative inline-flex items-center gap-1.5 rounded-full bg-[#17663F] px-3.5 py-1.5 text-xs font-semibold text-[#FFFDF9] shadow-sm transition hover:bg-[#135333] sm:px-4 sm:py-2"
            >
              <Plus className="h-3.5 w-3.5 transition-transform group-hover:rotate-90" />
              <span>Bury a Project</span>
            </Link>

            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle navigation menu"
              className="paper-chip flex h-9 w-9 items-center justify-center rounded-full text-[#181614] md:hidden"
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Vellum Folio Mobile Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 flex flex-col justify-between bg-[#F4EFE6]/95 px-6 pb-10 pt-24 backdrop-blur-md md:hidden"
          >
            <div className="space-y-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#5E584E]">
                Archive Index
              </p>
              {NAV_LINKS.map((item, idx) => (
                <motion.button
                  key={item.to}
                  type="button"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => handleNavClick(item.to)}
                  className={`paper-sheet flex w-full items-center justify-between rounded-2xl px-5 py-4 text-left font-display text-lg font-semibold ${
                    isActive(item.to)
                      ? 'border-[#17663F] text-[#17663F]'
                      : 'text-[#181614]'
                  }`}
                >
                  <span>{item.label}</span>
                  <Sparkles className="h-4 w-4 opacity-60" />
                </motion.button>
              ))}
            </div>

            <div className="paper-sheet rounded-2xl p-4">
              {isAuthenticated ? (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-[#181614]">{activeProfile.displayName}</p>
                    <p className="font-mono text-[11px] text-[#17663F]">Supabase Connected</p>
                  </div>
                  <button
                    type="button"
                    onClick={signOut}
                    className="paper-chip rounded-full px-4 py-2 text-xs font-medium text-[#181614]"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[#181614]">Guest Demo Sandbox</p>
                    <p className="text-xs text-[#5E584E]">Sign in to sync across devices</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileOpen(false);
                      setAuthModalOpen(true);
                    }}
                    className="rounded-full bg-[#181614] px-4 py-2 text-xs font-semibold text-[#FFFDF9]"
                  >
                    Sign In
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
