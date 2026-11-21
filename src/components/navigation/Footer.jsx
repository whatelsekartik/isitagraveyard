import React from 'react';
import { Link } from 'react-router-dom';
import { useGraveyard } from '../../context/GraveyardContext';

export function Footer() {
  const { isAuthenticated, supabaseStatus } = useGraveyard();

  return (
    <footer className="relative border-t border-[#181614]/15 bg-[#EFE8DA]/80 px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-[4px] border border-[#1A1714]/25 bg-[#F8F2E4] shadow-sm">
                <img
                  src="/images/brand-logo.png"
                  alt="Project Graveyard emblem"
                  className="h-9 w-9 object-contain mix-blend-multiply"
                />
              </div>
              <div>
                <p className="font-display text-xl font-bold text-[#1A1714]">Project Graveyard</p>
                <p className="font-typewriter text-[10px] uppercase tracking-[0.16em] text-[#1D5B3A]">
                  Bury · Discover · Resurrect
                </p>
              </div>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-[#5E584E]">
              Somewhere between abandoned and forgotten, there&apos;s an idea waiting to be resurrected.
            </p>
            <div className="paper-chip mt-5 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 font-mono text-[11px] text-[#5E584E]">
              <span
                className={`h-2 w-2 rounded-full ${
                  isAuthenticated
                    ? 'bg-[#17663F]'
                    : supabaseStatus === 'connected'
                      ? 'bg-[#1E4E8C]'
                      : 'bg-[#A36218]'
                }`}
              />
              <span>
                {isAuthenticated
                  ? 'Live Supabase Session Active'
                  : supabaseStatus === 'connected'
                    ? 'Demo Sandbox Active · Sign in for Cloud Sync'
                    : 'Demo Sandbox Active (Local Persistence)'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:col-span-7">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#181614]">
                Archive
              </p>
              <ul className="mt-4 space-y-2.5 text-sm text-[#5E584E]">
                <li>
                  <Link to="/explore" className="transition hover:text-[#17663F]">
                    Graveyard Explorer
                  </Link>
                </li>
                <li>
                  <Link to="/bury" className="transition hover:text-[#17663F]">
                    Bury a Project
                  </Link>
                </li>
                <li>
                  <Link to="/community" className="transition hover:text-[#17663F]">
                    Resurrection Wall
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#181614]">
                Builders
              </p>
              <ul className="mt-4 space-y-2.5 text-sm text-[#5E584E]">
                <li>
                  <Link to="/community" className="transition hover:text-[#17663F]">
                    Skill Matcher
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard" className="transition hover:text-[#17663F]">
                    Revival Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/projects/demo-campus-os" className="transition hover:text-[#17663F]">
                    Sample Autopsy
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#181614]">
                Stewardship
              </p>
              <ul className="mt-4 space-y-2.5 text-xs leading-relaxed text-[#5E584E]">
                <li>Creator permission required for adoption.</li>
                <li>No automatic ownership transfer.</li>
                <li>Public repositories only unless authorized.</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="paper-divider mt-12 flex flex-col items-start justify-between gap-4 pt-6 text-xs text-[#5E584E] sm:flex-row sm:items-center">
          <p className="font-mono font-semibold uppercase tracking-[0.16em] text-[#181614]">
            DEAD PROJECTS. LIVING POSSIBILITIES.
          </p>
          <p>
            Sample projects marked <span className="font-semibold text-[#1E4E8C]">Illustrative Demo</span> are seeded for demonstration.
          </p>
        </div>
      </div>
    </footer>
  );
}
