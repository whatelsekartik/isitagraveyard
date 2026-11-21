import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Bookmark,
  Users,
  Calendar,
  ArrowUpRight,
  Zap,
  Sparkles,
  AlertTriangle,
  FolderOpen,
} from 'lucide-react';
import { ProjectLogoMark } from '../glass-panels/ProjectLogoMark';
import { BrassPaperclip, DogEarCorner } from '../illustrations/ArchivalIllustrations';
import { useGraveyard } from '../../context/GraveyardContext';
import { calculateSkillMatch } from '../../lib/revivalScore';
import { playPaperRustle, playPenClick } from '../../lib/paperSound';

export function ProjectMonumentCard({ project, onResurrectClick, showSkillMatch = true }) {
  const { bookmarks, toggleBookmark, activeProfile } = useGraveyard();
  const prefersReduced = useReducedMotion();
  const [isOpen, setIsOpen] = useState(false);

  const isBookmarked = bookmarks.includes(project.id);
  const match = showSkillMatch ? calculateSkillMatch(activeProfile, project) : null;

  const statusStyles =
    project.completionStatus === 'Resurrected'
      ? {
          badge: 'border-[#1D5B3A] bg-[#DCE7CE] text-[#1D5B3A]',
          dot: 'bg-[#1D5B3A]',
          topBar: '#1D5B3A',
        }
      : project.completionStatus === 'In Revival'
        ? {
            badge: 'border-[#9A7532] bg-[#F6ECD8] text-[#9A7532]',
            dot: 'bg-[#9A7532]',
            topBar: '#9A7532',
          }
        : {
            badge: 'border-[#1E4A7A] bg-[#E6ECF3] text-[#1E4A7A]',
            dot: 'bg-[#1E4A7A]',
            topBar: '#1E4A7A',
          };

  const abandonedDate = project.abandonedAt
    ? new Date(project.abandonedAt).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      })
    : 'Unknown';

  const handleOpenStart = () => {
    if (!isOpen) setIsOpen(true);
  };

  const handleOpenEnd = () => {
    setIsOpen(false);
  };

  return (
    <article
      onMouseEnter={handleOpenStart}
      onMouseLeave={handleOpenEnd}
      className="group/folder relative flex flex-col pt-4"
      style={{ perspective: 1100 }}
    >
      {/* Protruding Manila Folder Tab */}
      <div className="relative z-10 flex items-end justify-between px-1">
        <button
          type="button"
          onClick={() => {
            playPaperRustle();
            setIsOpen((v) => !v);
          }}
          className="inline-flex items-center gap-2 rounded-t-[5px] border border-b-0 border-[#1A1714]/25 bg-[#E0D2B5] px-3 py-1.5 font-typewriter text-[10px] tracking-wider text-[#4F473C] transition-colors hover:bg-[#D7E5C8] hover:text-[#1A1714]"
        >
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: statusStyles.topBar }}
          />
          <span>{project.isDemo ? 'SAMPLE DOSSIER' : 'LIVE RECORD'}</span>
          <span className="text-[#1A1714]/35">//</span>
          <span className="truncate max-w-[115px]">{project.category?.toUpperCase()}</span>
          <FolderOpen
            className={`h-3 w-3 transition-transform duration-300 ${
              isOpen ? 'text-[#1D5B3A] scale-110' : 'opacity-65'
            }`}
          />
        </button>

        {/* Subtle status stamp on right edge of folder back */}
        <span className="pb-1 pr-2 font-typewriter text-[9px] uppercase tracking-widest text-[#5B5246]/55">
          {isOpen ? 'OPEN' : 'FILE'}
        </span>
      </div>

      {/* Manila Folder Back Cover Wrapper */}
      <div className="relative flex flex-1 flex-col rounded-[4px] rounded-tl-none border border-[#1A1714]/22 bg-[#DDD0B3] p-2 pb-2.5 shadow-[4px_5px_0_0_#D2C3A3,0_14px_26px_rgba(26,23,20,0.09)]">
        {/* Inner Cream Document Sheet (Slides UP smoothly when folder opens!) */}
        <motion.div
          animate={
            prefersReduced
              ? undefined
              : {
                  y: isOpen ? -14 : 0,
                  rotate: isOpen ? -0.4 : 0,
                  boxShadow: isOpen
                    ? '0 14px 26px rgba(26,23,20,0.13)'
                    : '0 2px 6px rgba(26,23,20,0.06)',
                }
          }
          transition={{ type: 'spring', stiffness: 280, damping: 24 }}
          className="paper-sheet relative z-10 flex flex-1 flex-col justify-between rounded-[3px] p-4 sm:p-5"
        >
          {(project.completionStatus === 'Resurrected' ||
            project.completionStatus === 'In Revival') && (
            <BrassPaperclip className="absolute -top-4 right-12 z-20 h-9 w-5 opacity-90" />
          )}

          <div>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3.5">
                <ProjectLogoMark
                  seed={project.logoSeed}
                  logoUrl={project.logoUrl}
                  name={project.name}
                  status={project.completionStatus}
                />
                <div>
                  <h3 className="font-display text-2xl font-bold leading-none text-[#1A1714] transition group-hover/folder:text-[#1D5B3A]">
                    {project.name}
                  </h3>
                  <p className="mt-1 font-mono text-[11px] text-[#5B5246]">
                    by <span className="font-bold text-[#1A1714]">{project.creatorName}</span>
                  </p>
                </div>
              </div>

              <motion.button
                type="button"
                whileTap={{ scale: 0.85 }}
                onClick={() => {
                  playPenClick();
                  toggleBookmark(project);
                }}
                aria-label={
                  isBookmarked ? `Remove bookmark for ${project.name}` : `Bookmark ${project.name}`
                }
                className={`paper-chip flex h-8 w-8 shrink-0 items-center justify-center rounded-[3px] ${
                  isBookmarked
                    ? 'border-[#1D5B3A] bg-[#DCE7CE] text-[#1D5B3A]'
                    : 'text-[#5B5246] hover:text-[#1A1714]'
                }`}
              >
                <Bookmark
                  className={`h-4 w-4 transition-transform duration-200 ${
                    isBookmarked ? 'scale-110 fill-current' : ''
                  }`}
                />
              </motion.button>
            </div>

            {/* Rubber Stamp Status & Skill Match */}
            <div className="mt-3.5 flex flex-wrap items-center gap-2">
              <span
                className={`paper-stamp inline-flex items-center gap-1.5 rounded-[2px] px-2.5 py-0.5 font-typewriter text-[10px] uppercase tracking-wider -rotate-1 ${statusStyles.badge}`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${statusStyles.dot}`} />
                {project.completionStatus}
              </span>

              {match?.score !== null && match?.score !== undefined && (
                <span
                  title={match.summary}
                  className="inline-flex items-center gap-1 rounded-[2px] border border-[#1D5B3A]/30 bg-[#DCE7CE]/75 px-2 py-0.5 font-mono text-[10px] font-bold text-[#1D5B3A]"
                >
                  <Sparkles className="h-3 w-3" />
                  {match.score}% match
                </span>
              )}
            </div>

            {/* Handwritten Epitaph Quote */}
            <p className="mt-3 line-clamp-3 border-l-2 border-[#1A1714]/20 pl-3 text-sm leading-relaxed text-[#5B5246]">
              &ldquo;{project.tagline || project.description}&rdquo;
            </p>

            {/* Tech Stack Tags (revealed sharply as paper rises) */}
            <div className="mt-3.5 flex flex-wrap gap-1.5 pb-1">
              {(project.techTags || []).slice(0, 5).map((tag) => (
                <span
                  key={tag}
                  className="paper-chip rounded-[2px] px-2 py-0.5 font-mono text-[10px] font-medium text-[#1A1714]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <DogEarCorner className="absolute bottom-0 right-0 h-6 w-6 opacity-85" />
        </motion.div>

        {/* Hinged Front Manila Folder Pocket Flap (Tilts open forward on hover!) */}
        <motion.div
          animate={
            prefersReduced
              ? undefined
              : {
                  rotateX: isOpen ? -14 : 0,
                  y: isOpen ? 3 : 0,
                }
          }
          transition={{ type: 'spring', stiffness: 260, damping: 24 }}
          style={{ transformOrigin: 'bottom center' }}
          className="relative z-20 -mt-2 rounded-[3px] border border-[#1A1714]/22 bg-gradient-to-b from-[#EDE1C6] to-[#E2D3B3] p-4 shadow-[0_-4px_12px_rgba(26,23,20,0.08)]"
        >
          {/* Die-Cut Manila Pocket Notch & Brass Fastener Detail */}
          <div className="pointer-events-none absolute -top-2.5 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-t-[3px] border border-b-0 border-[#1A1714]/20 bg-[#EDE1C6] px-3 py-0.5">
            <span className="h-1.5 w-1.5 rounded-full border border-[#1A1714]/40 bg-[#9A7532]" />
            <span className="font-typewriter text-[8px] uppercase tracking-[0.2em] text-[#5B5246]">
              AUTOPSY POCKET
            </span>
            <span className="h-1.5 w-1.5 rounded-full border border-[#1A1714]/40 bg-[#9A7532]" />
          </div>

          {/* Pocket Ledger Metrics */}
          <div className="grid grid-cols-3 gap-2 pt-1 text-xs">
            <div className="rounded-[3px] border border-[#1A1714]/15 bg-[#F8F2E4]/80 p-2">
              <span className="block font-typewriter text-[9px] uppercase tracking-wider text-[#5B5246]">
                Buried
              </span>
              <span className="mt-0.5 inline-flex items-center gap-1 font-mono text-[11px] font-bold text-[#1A1714]">
                <Calendar className="h-3 w-3 text-[#1E4A7A]" />
                {abandonedDate}
              </span>
            </div>

            <div className="rounded-[3px] border border-[#1A1714]/15 bg-[#F8F2E4]/80 p-2">
              <span className="block font-typewriter text-[9px] uppercase tracking-wider text-[#5B5246]">
                Built
              </span>
              <span className="mt-0.5 block font-mono text-[11px] font-bold text-[#1A1714]">
                {project.completionPercent}%
              </span>
            </div>

            <div className="rounded-[3px] border border-[#1D5B3A]/35 bg-[#DCE7CE]/80 p-2">
              <span className="block font-typewriter text-[9px] uppercase tracking-wider text-[#1D5B3A]">
                Readiness
              </span>
              <span className="mt-0.5 block font-mono text-[11px] font-bold text-[#1D5B3A]">
                {project.revivalScore}/100
              </span>
            </div>
          </div>

          {/* Abandonment Cause & Interested */}
          <div className="mt-2.5 flex items-center justify-between text-[11px] text-[#5B5246]">
            <span className="inline-flex items-center gap-1.5 truncate">
              <AlertTriangle className="h-3 w-3 shrink-0 text-[#9A2F22]" />
              <span className="truncate">{project.abandonmentReason}</span>
            </span>
            <span className="inline-flex shrink-0 items-center gap-1 font-mono font-bold text-[#1A1714]">
              <Users className="h-3 w-3 text-[#1D5B3A]" />
              {project.interestedCount || 0}
            </span>
          </div>

          {/* Letterpress Action Buttons */}
          <div className="mt-3.5 flex items-center gap-2.5">
            <Link
              to={`/projects/${project.id}`}
              onClick={playPenClick}
              className="paper-chip inline-flex flex-1 items-center justify-center gap-1.5 rounded-[3px] px-3 py-2 text-xs font-bold text-[#1A1714]"
            >
              <span>Inspect File</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>

            <button
              type="button"
              onClick={() => {
                playPenClick();
                onResurrectClick?.(project);
              }}
              className="ink-press-btn inline-flex flex-1 items-center justify-center gap-1.5 rounded-[3px] border border-[#1A1714] bg-[#1A1714] px-3 py-2 text-xs font-bold text-[#FCF9F0] hover:bg-[#1D5B3A]"
            >
              <Zap className="h-3.5 w-3.5 text-[#D7E5C8]" />
              <span>Resurrect</span>
            </button>
          </div>
        </motion.div>
      </div>
    </article>
  );
}
