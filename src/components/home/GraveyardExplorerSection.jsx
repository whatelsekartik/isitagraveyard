import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Search,
  SlidersHorizontal,
  RotateCcw,
  Sparkles,
  Filter,
  Shuffle,
} from 'lucide-react';
import { playPaperRustle } from '../../lib/paperSound';
import { useGraveyard } from '../../context/GraveyardContext';
import { ABANDONMENT_REASONS, PROJECT_CATEGORIES } from '../../data/seedProjects';
import { ProjectMonumentCard } from '../project-cards/ProjectMonumentCard';
import { ResurrectionRequestModal } from '../forms/ResurrectionRequestModal';
import { BlurReveal } from '../animations/MotionPrimitives';
import { calculateSkillMatch } from '../../lib/revivalScore';

export function GraveyardExplorerSection({
  initialReason = 'All',
  showHeader = true,
  defaultExpandedFilters = false,
}) {
  const { allProjects, activeProfile } = useGraveyard();
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [techFilter, setTechFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [reasonFilter, setReasonFilter] = useState(initialReason);
  const [minReadiness, setMinReadiness] = useState(0);
  const [openOnly, setOpenOnly] = useState(false);
  const [recentlyBuriedOnly, setRecentlyBuriedOnly] = useState(false);
  const [sortBy, setSortBy] = useState('most-promising');
  const [showFilters, setShowFilters] = useState(defaultExpandedFilters);

  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    if (initialReason && initialReason !== 'All') {
      setReasonFilter(initialReason);
      setShowFilters(true);
    }
  }, [initialReason]);

  const allTechOptions = useMemo(() => {
    const set = new Set();
    allProjects.forEach((p) => (p.techTags || []).forEach((t) => set.add(t)));
    return ['All', ...Array.from(set).sort()];
  }, [allProjects]);

  const filteredProjects = useMemo(() => {
    const q = query.trim().toLowerCase();
    const sixtyDaysMs = 1000 * 60 * 60 * 24 * 60;
    const now = Date.now();

    const list = allProjects.filter((p) => {
      if (q) {
        const haystack = [
          p.name,
          p.tagline,
          p.description,
          p.creatorName,
          p.category,
          p.abandonmentReason,
          ...(p.techTags || []),
          ...(p.requiredSkills || []),
        ]
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }

      if (techFilter !== 'All' && !(p.techTags || []).includes(techFilter)) return false;
      if (categoryFilter !== 'All' && p.category !== categoryFilter) return false;
      if (statusFilter !== 'All' && p.completionStatus !== statusFilter) return false;
      if (difficultyFilter !== 'All' && p.difficulty !== difficultyFilter) return false;
      if (reasonFilter !== 'All' && p.abandonmentReason !== reasonFilter) return false;
      if ((p.revivalScore || 0) < minReadiness) return false;
      if (openOnly && !p.acceptContributions && !p.allowAdoption) return false;

      if (recentlyBuriedOnly && p.publishedAt) {
        const diff = now - new Date(p.publishedAt).getTime();
        if (diff > sixtyDaysMs) return false;
      }

      return true;
    });

    return [...list].sort((a, b) => {
      if (sortBy === 'recently-abandoned') {
        return new Date(b.abandonedAt || 0) - new Date(a.abandonedAt || 0);
      }
      if (sortBy === 'most-promising') {
        return (b.revivalScore || 0) - (a.revivalScore || 0);
      }
      if (sortBy === 'most-interested') {
        return (b.interestedCount || 0) - (a.interestedCount || 0);
      }
      if (sortBy === 'recently-resurrected') {
        if (a.resurrectedAt && !b.resurrectedAt) return -1;
        if (!a.resurrectedAt && b.resurrectedAt) return 1;
        return new Date(b.resurrectedAt || b.publishedAt || 0) - new Date(a.resurrectedAt || a.publishedAt || 0);
      }
      if (sortBy === 'best-skill-match') {
        const ma = calculateSkillMatch(activeProfile, a).score || 0;
        const mb = calculateSkillMatch(activeProfile, b).score || 0;
        return mb - ma;
      }
      return 0;
    });
  }, [
    allProjects,
    query,
    techFilter,
    categoryFilter,
    statusFilter,
    difficultyFilter,
    reasonFilter,
    minReadiness,
    openOnly,
    recentlyBuriedOnly,
    sortBy,
    activeProfile,
  ]);

  const handleExhumeRandom = () => {
    const pool = filteredProjects.length > 0 ? filteredProjects : allProjects;
    if (pool.length === 0) return;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    playPaperRustle();
    navigate(`/projects/${pick.id}`);
  };

  const activeFilterCount =
    (techFilter !== 'All' ? 1 : 0) +
    (categoryFilter !== 'All' ? 1 : 0) +
    (statusFilter !== 'All' ? 1 : 0) +
    (difficultyFilter !== 'All' ? 1 : 0) +
    (reasonFilter !== 'All' ? 1 : 0) +
    (minReadiness > 0 ? 1 : 0) +
    (openOnly ? 1 : 0) +
    (recentlyBuriedOnly ? 1 : 0);

  const resetFilters = () => {
    setQuery('');
    setTechFilter('All');
    setCategoryFilter('All');
    setStatusFilter('All');
    setDifficultyFilter('All');
    setReasonFilter('All');
    setMinReadiness(0);
    setOpenOnly(false);
    setRecentlyBuriedOnly(false);
  };

  return (
    <section id="graveyard-explorer" className="relative overflow-hidden px-4 py-20 sm:px-6 lg:py-28">
      {/* Subtly Blended Archival Sanctuary Courtyard Watermark */}
      {showHeader && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[420px] overflow-hidden"
          style={{
            WebkitMaskImage:
              'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.85) 28%, rgba(0,0,0,0.4) 72%, transparent 100%)',
            maskImage:
              'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.85) 28%, rgba(0,0,0,0.4) 72%, transparent 100%)',
          }}
        >
          <img
            src="/images/archive-sanctuary.png"
            alt=""
            loading="lazy"
            className="h-full w-full object-cover object-center opacity-[0.14] mix-blend-multiply"
          />
        </div>
      )}

      <div className="relative z-10 mx-auto max-w-6xl">
        {showHeader && (
          <BlurReveal className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="font-typewriter text-[11px] uppercase tracking-[0.2em] text-[#1D5B3A]">
                Folio 02 // The Graveyard Catalog
              </p>
              <h2 className="mt-3 max-w-2xl font-display text-4xl font-bold tracking-tight text-[#1A1714] sm:text-5xl">
                Somewhere in here, there&apos;s a project{' '}
                <span className="marker-highlight italic font-bold text-[#1D5B3A]">
                  worth saving.
                </span>
              </h2>
            </div>
            <p className="max-w-sm text-xs leading-relaxed text-[#5B5246]">
              Dossiers marked <span className="font-bold text-[#1A1714]">Sample Dossier</span> are
              illustrative records. Live user submissions carry a{' '}
              <span className="font-bold text-[#1D5B3A]">Live Record</span> tab.
            </p>
          </BlurReveal>
        )}

        {/* Archive Catalog Search Bar */}
        <div className="paper-sheet rounded-[4px] p-4 sm:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#1D5B3A]" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search archive catalog by project, stack, blocker, or category..."
                aria-label="Search projects"
                className="paper-input w-full rounded-[4px] py-3 pl-11 pr-4 text-sm placeholder:text-[#5B5246]/70"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Sort projects"
                className="paper-input rounded-[4px] px-4 py-3 text-xs font-bold"
              >
                <option value="most-promising">Sort: Most promising</option>
                <option value="best-skill-match">Sort: Best skill match</option>
                <option value="recently-abandoned">Sort: Recently abandoned</option>
                <option value="most-interested">Sort: Most interested</option>
                <option value="recently-resurrected">Sort: Recently resurrected</option>
              </select>

              <button
                type="button"
                onClick={() => setShowFilters((v) => !v)}
                className={`inline-flex items-center gap-2 rounded-[4px] border px-4 py-3 text-xs font-bold transition ${
                  showFilters || activeFilterCount > 0
                    ? 'border-[#1D5B3A] bg-[#DCE7CE] text-[#1D5B3A]'
                    : 'paper-chip text-[#1A1714]'
                }`}
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                <span>Filters</span>
                {activeFilterCount > 0 && (
                  <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#17663F] px-1.5 font-mono text-[10px] font-bold text-[#FFFDF9]">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={handleExhumeRandom}
                title="Open a random archived project dossier"
                className="paper-chip inline-flex items-center gap-2 rounded-[4px] px-3.5 py-3 text-xs font-bold text-[#1D5B3A] hover:border-[#1D5B3A]"
              >
                <Shuffle className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Exhume Random</span>
              </button>

              {(activeFilterCount > 0 || query) && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="paper-chip inline-flex items-center gap-1.5 rounded-[4px] px-3.5 py-3 text-xs font-bold text-[#5B5246] hover:text-[#1A1714]"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="paper-divider mt-4 grid gap-3 pt-4 sm:grid-cols-2 lg:grid-cols-5">
                  <div>
                    <label className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-[#5E584E]">
                      Technology
                    </label>
                    <select
                      value={techFilter}
                      onChange={(e) => setTechFilter(e.target.value)}
                      className="paper-input w-full rounded-xl px-3 py-2 text-xs"
                    >
                      {allTechOptions.map((tech) => (
                        <option key={tech} value={tech}>
                          {tech === 'All' ? 'All Technologies' : tech}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-[#5E584E]">
                      Category
                    </label>
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="paper-input w-full rounded-xl px-3 py-2 text-xs"
                    >
                      <option value="All">All Categories</option>
                      {PROJECT_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-[#5E584E]">
                      Project Status
                    </label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="paper-input w-full rounded-xl px-3 py-2 text-xs"
                    >
                      <option value="All">All Statuses</option>
                      <option value="Awaiting Resurrection">Awaiting Resurrection</option>
                      <option value="In Revival">In Revival</option>
                      <option value="Resurrected">Resurrected</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-[#5E584E]">
                      Difficulty
                    </label>
                    <select
                      value={difficultyFilter}
                      onChange={(e) => setDifficultyFilter(e.target.value)}
                      className="paper-input w-full rounded-xl px-3 py-2 text-xs"
                    >
                      <option value="All">All Levels</option>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-[#5E584E]">
                      Abandonment Reason
                    </label>
                    <select
                      value={reasonFilter}
                      onChange={(e) => setReasonFilter(e.target.value)}
                      className="paper-input w-full rounded-xl px-3 py-2 text-xs"
                    >
                      <option value="All">All Reasons</option>
                      {ABANDONMENT_REASONS.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-[#181614]/10 pt-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <label className="paper-chip inline-flex cursor-pointer items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium text-[#181614]">
                      <input
                        type="checkbox"
                        checked={openOnly}
                        onChange={(e) => setOpenOnly(e.target.checked)}
                        className="accent-[#17663F]"
                      />
                      <span>Open for contributions</span>
                    </label>

                    <label className="paper-chip inline-flex cursor-pointer items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium text-[#181614]">
                      <input
                        type="checkbox"
                        checked={recentlyBuriedOnly}
                        onChange={(e) => setRecentlyBuriedOnly(e.target.checked)}
                        className="accent-[#17663F]"
                      />
                      <span>Recently buried</span>
                    </label>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[11px] text-[#5E584E]">
                      Min Readiness: <strong className="text-[#17663F]">{minReadiness}</strong>
                    </span>
                    <input
                      type="range"
                      min="0"
                      max="85"
                      step="5"
                      value={minReadiness}
                      onChange={(e) => setMinReadiness(Number(e.target.value))}
                      className="w-32 accent-[#17663F]"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Result Telemetry Line */}
        <div className="mt-5 flex items-center justify-between px-1 text-xs text-[#5E584E]">
          <div className="flex items-center gap-2 font-mono">
            <Filter className="h-3.5 w-3.5 text-[#1E4E8C]" />
            <span>
              Cataloged <strong className="text-[#181614]">{filteredProjects.length}</strong>{' '}
              project dossier{filteredProjects.length === 1 ? '' : 's'}
            </span>
          </div>
          <span className="hidden items-center gap-1.5 font-mono text-[11px] font-medium text-[#17663F] sm:inline-flex">
            <Sparkles className="h-3 w-3" />
            Not dead. Just waiting.
          </span>
        </div>

        {/* Dossier Cards Grid (Fast GPU rendering — no layout thrash) */}
        {filteredProjects.length === 0 ? (
          <div className="paper-sheet mt-8 flex flex-col items-center justify-center rounded-[4px] px-6 py-16 text-center">
            <p className="font-display text-3xl font-bold text-[#1A1714]">
              No archived dossiers match those filters.
            </p>
            <p className="mt-2 max-w-md text-sm text-[#5B5246]">
              Clear one or two constraints to scan the wider catalog.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="ink-press-btn mt-6 rounded-[4px] border border-[#1A1714] bg-[#1A1714] px-6 py-2.5 text-xs font-bold text-[#FCF9F0]"
            >
              Reset Archive Filters
            </button>
          </div>
        ) : (
          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <ProjectMonumentCard
                key={project.id}
                project={project}
                onResurrectClick={(p) => setSelectedProject(p)}
              />
            ))}
          </div>
        )}
      </div>

      <ResurrectionRequestModal
        project={selectedProject}
        open={Boolean(selectedProject)}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
}
