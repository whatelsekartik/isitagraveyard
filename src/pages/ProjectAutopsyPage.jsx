import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Bookmark,
  CheckCircle2,
  Code2,
  ExternalLink,
  GitBranch,
  GitFork,
  Github,
  AlertOctagon,
  ListChecks,
  Mail,
  Shield,
  Sparkles,
  Star,
  Wrench,
  Zap,
  Clock,
  Info,
  AlertTriangle,
} from 'lucide-react';
import { useGraveyard } from '../context/GraveyardContext';
import { ProjectLogoMark } from '../components/glass-panels/ProjectLogoMark';
import { RevivalGauge } from '../components/glass-panels/RevivalGauge';
import { GlassModal } from '../components/glass-panels/GlassModal';
import { ResurrectionRequestModal } from '../components/forms/ResurrectionRequestModal';
import { PageTransition, MonumentLoader } from '../components/animations/MotionPrimitives';
import {
  ArchivalWaxSeal,
  BinderHolesColumn,
  BrassPaperclip,
} from '../components/illustrations/ArchivalIllustrations';
import { calculateRevivalBreakdown, calculateSkillMatch } from '../lib/revivalScore';
import { fetchGitHubRepoMetadata } from '../lib/githubApi';
import { playStampThud, playPenClick } from '../lib/paperSound';

export default function ProjectAutopsyPage() {
  const { id } = useParams();
  const {
    allProjects,
    bookmarks,
    toggleBookmark,
    activeProfile,
    currentUser,
    updateProjectStatus,
    logDemoActivity,
    showToast,
  } = useGraveyard();

  const project = allProjects.find((p) => p.id === id || p.slug === id);

  const [requestModal, setRequestModal] = useState({ open: false, type: 'contribute' });
  const [contactOpen, setContactOpen] = useState(false);
  const [contactMsg, setContactMsg] = useState('');
  const [activeTechCategory, setActiveTechCategory] = useState('all');
  const [resurrectFlash, setResurrectFlash] = useState(false);
  const [scratchpad, setScratchpad] = useState('');

  useEffect(() => {
    if (!project?.id) return;
    try {
      setScratchpad(localStorage.getItem(`pg_note_${project.id}`) || '');
    } catch {
      setScratchpad('');
    }
  }, [project?.id]);

  const handleScratchpadChange = (val) => {
    setScratchpad(val);
    if (!project?.id) return;
    try {
      localStorage.setItem(`pg_note_${project.id}`, val);
    } catch {
      // Ignore storage errors
    }
  };

  const [githubState, setGithubState] = useState({
    loading: false,
    status: null,
    error: null,
    data: null,
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const loadGitHubInfo = async () => {
    if (!project?.repositoryUrl) return;
    setGithubState({ loading: true, status: null, error: null, data: null });
    const res = await fetchGitHubRepoMetadata(project.repositoryUrl);
    setGithubState({
      loading: false,
      status: res.status,
      error: res.error,
      data: res.data,
    });
  };

  useEffect(() => {
    if (project?.repositoryUrl && project?.repoVisibility === 'public') {
      loadGitHubInfo();
    } else {
      setGithubState({ loading: false, status: null, error: null, data: null });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project?.id]);

  if (!project) {
    return (
      <PageTransition className="mx-auto max-w-3xl px-4 pb-24 pt-36 text-center">
        <div className="paper-sheet rounded-3xl p-10">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#B4432C]">
            Dossier Not Found
          </p>
          <h1 className="mt-3 font-display text-3xl font-semibold text-[#181614]">
            This archive record does not exist.
          </h1>
          <p className="mt-2 text-sm text-[#5E584E]">
            It may have been removed by its creator or the URL is incorrect.
          </p>
          <Link
            to="/explore"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#181614] px-6 py-3 text-xs font-semibold text-[#FFFDF9]"
          >
            <ArrowLeft className="h-4 w-4" />
            Return to Graveyard Explorer
          </Link>
        </div>
      </PageTransition>
    );
  }

  const isBookmarked = bookmarks.includes(project.id);
  const breakdown = calculateRevivalBreakdown(project);
  const skillMatch = calculateSkillMatch(activeProfile, project);
  const isOwner =
    (currentUser && project.creatorId === currentUser.id) ||
    project.creatorId === activeProfile.id ||
    project.isDemo;

  const handleResurrectTransition = async (nextStatus) => {
    await updateProjectStatus(project, nextStatus);
    if (nextStatus === 'Resurrected') {
      playStampThud();
      setResurrectFlash(true);
      setTimeout(() => setResurrectFlash(false), 2600);
    }
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (contactMsg.trim().length < 10) return;
    logDemoActivity(
      project.id,
      project.name,
      'Creator contacted',
      `Sent message to ${project.creatorName} regarding ${project.name} via ${project.contactPreference}.`
    );
    showToast(`Message routed via ${project.contactPreference} preference.`);
    setContactMsg('');
    setContactOpen(false);
  };

  const timelineEvents = [
    project.createdAt && { label: 'Project Created', date: project.createdAt, color: '#1E4E8C' },
    project.firstReleaseAt && { label: 'First Release', date: project.firstReleaseAt, color: '#1E4E8C' },
    (githubState.data?.lastUpdated || project.lastCommitAt) && {
      label: 'Last Commit',
      date: githubState.data?.lastUpdated || project.lastCommitAt,
      color: '#A36218',
    },
    project.abandonedAt && { label: 'Abandoned', date: project.abandonedAt, color: '#B4432C' },
    project.publishedAt && { label: 'Submitted to Graveyard', date: project.publishedAt, color: '#181614' },
    project.adoptedAt && { label: 'Adopted', date: project.adoptedAt, color: '#17663F' },
    project.resurrectedAt && { label: 'Resurrected', date: project.resurrectedAt, color: '#17663F' },
  ].filter(Boolean);

  const techGroups = [
    { key: 'languages', label: 'Languages', items: project.technologies?.languages || [] },
    { key: 'frameworks', label: 'Frameworks', items: project.technologies?.frameworks || [] },
    { key: 'libraries', label: 'Libraries', items: project.technologies?.libraries || [] },
    { key: 'backend', label: 'Backend', items: project.technologies?.backend || [] },
    { key: 'database', label: 'Database', items: project.technologies?.database || [] },
    { key: 'deployment', label: 'Deployment', items: project.technologies?.deployment || [] },
  ].filter((g) => g.items.length > 0);

  const forkUrl = project.repositoryUrl
    ? `${project.repositoryUrl.replace(/\/$/, '')}/fork`
    : null;

  return (
    <PageTransition className="relative pb-24 pt-28">
      <AnimatePresence>
        {resurrectFlash && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none fixed inset-0 z-30 bg-[radial-gradient(circle_at_50%_25%,rgba(216,242,155,0.45),transparent_65%)]"
          />
        )}
      </AnimatePresence>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Back Breadcrumb */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <Link
            to="/explore"
            className="paper-chip inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium text-[#5E584E] hover:text-[#181614]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Graveyard Explorer</span>
          </Link>

          <div className="flex items-center gap-2">
            {project.isDemo ? (
              <span className="paper-chip rounded-full px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-[#1E4E8C]">
                Illustrative Demo Project
              </span>
            ) : (
              <span className="rounded-full border border-[#17663F]/35 bg-[#EAF5DC] px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-[#17663F]">
                Live Archive Record
              </span>
            )}
          </div>
        </div>

        {/* Hero Identity Dossier Folio */}
        <motion.div
          animate={
            resurrectFlash
              ? {
                  scale: [1, 1.012, 1],
                  boxShadow: [
                    '4px 4px 0 0 #dfd2b8',
                    '0 0 0 3px rgba(29, 91, 58, 0.35), 0 24px 48px rgba(29, 91, 58, 0.22)',
                    '4px 4px 0 0 #dfd2b8',
                  ],
                }
              : undefined
          }
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className={`paper-dossier relative overflow-hidden rounded-[5px] p-6 sm:p-8 ${
            project.completionStatus === 'Resurrected' ? 'border-[#1D5B3A]' : ''
          }`}
        >
          {/* Restrained Luminous Resurrection Sweep Wave */}
          <AnimatePresence>
            {resurrectFlash && (
              <motion.div
                initial={{ x: '-110%', opacity: 0.85 }}
                animate={{ x: '210%', opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.35, ease: [0.22, 1, 0.36, 1] }}
                className="pointer-events-none absolute inset-y-0 left-0 z-30 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-[#D7E5C8]/70 to-transparent"
              />
            )}
          </AnimatePresence>

          <BrassPaperclip className="absolute -top-5 right-10 hidden h-14 w-7 sm:block" />
          {project.completionStatus === 'Resurrected' && (
            <div className="pointer-events-none absolute right-6 top-6 hidden sm:block">
              <ArchivalWaxSeal label="RESURRECTED" size={76} />
            </div>
          )}
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <div className="flex flex-wrap items-start gap-4">
                <ProjectLogoMark
                  seed={project.logoSeed}
                  logoUrl={project.logoUrl}
                  name={project.name}
                  status={project.completionStatus}
                  size="lg"
                />

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-typewriter text-[11px] uppercase tracking-[0.18em] text-[#1E4A7A]">
                      Project Autopsy · {project.category}
                    </span>
                    <motion.span
                      key={project.completionStatus}
                      initial={{ scale: 0.9, opacity: 0.6 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 320, damping: 20 }}
                      className={`paper-stamp rounded-[2px] px-2.5 py-0.5 font-typewriter text-[10px] uppercase tracking-wider ${
                        project.completionStatus === 'Resurrected'
                          ? 'border-[#1D5B3A] bg-[#DCE7CE] text-[#1D5B3A]'
                          : project.completionStatus === 'In Revival'
                            ? 'border-[#9A7532] bg-[#F6ECD8] text-[#9A7532]'
                            : 'border-[#1E4A7A] bg-[#E6ECF3] text-[#1E4A7A]'
                      }`}
                    >
                      {project.completionStatus}
                    </motion.span>
                  </div>

                  <h1 className="mt-2 font-display text-4xl font-bold tracking-tight text-[#1A1714] sm:text-5xl">
                    {project.name}
                  </h1>
                  <p className="mt-1 text-sm text-[#5E584E]">
                    Created by <strong className="text-[#181614]">{project.creatorName}</strong> ·
                    Collaboration:{' '}
                    <strong className="text-[#181614]">{project.collaborationModel}</strong>
                  </p>
                </div>
              </div>

              <p className="mt-6 text-base leading-relaxed text-[#181614]/85">
                {project.description}
              </p>

              {/* Action Bar */}
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  disabled={!project.acceptContributions}
                  onClick={() => setRequestModal({ open: true, type: 'contribute' })}
                  className="inline-flex items-center gap-2 rounded-full bg-[#181614] px-5 py-3 text-xs font-semibold text-[#FFFDF9] shadow-sm transition hover:bg-[#17663F] disabled:cursor-not-allowed disabled:opacity-45"
                >
                  <Zap className="h-4 w-4 text-[#D8F29B]" />
                  <span>
                    {project.acceptContributions
                      ? 'Request to Contribute'
                      : 'Contributions Closed'}
                  </span>
                </button>

                <button
                  type="button"
                  disabled={!project.allowAdoption}
                  onClick={() => setRequestModal({ open: true, type: 'adopt' })}
                  className="paper-chip inline-flex items-center gap-2 rounded-full px-5 py-3 text-xs font-semibold text-[#181614] hover:border-[#1E4E8C] hover:text-[#1E4E8C] disabled:cursor-not-allowed disabled:opacity-45"
                >
                  <Sparkles className="h-4 w-4 text-[#1E4E8C]" />
                  <span>{project.allowAdoption ? 'Request to Adopt' : 'Adoption Disabled'}</span>
                </button>

                {forkUrl && (
                  <a
                    href={forkUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="paper-chip inline-flex items-center gap-2 rounded-full px-4 py-3 text-xs font-semibold text-[#181614]"
                  >
                    <GitFork className="h-4 w-4 text-[#5E584E]" />
                    <span>Fork Repo</span>
                  </a>
                )}

                <button
                  type="button"
                  onClick={() => setContactOpen(true)}
                  className="paper-chip inline-flex items-center gap-2 rounded-full px-4 py-3 text-xs font-semibold text-[#181614]"
                >
                  <Mail className="h-4 w-4 text-[#5E584E]" />
                  <span>Contact Creator</span>
                </button>

                <button
                  type="button"
                  onClick={() => toggleBookmark(project)}
                  className={`paper-chip inline-flex items-center gap-2 rounded-full px-4 py-3 text-xs font-semibold ${
                    isBookmarked ? 'border-[#17663F] bg-[#EAF5DC] text-[#17663F]' : 'text-[#5E584E]'
                  }`}
                >
                  <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
                  <span>{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
                </button>
              </div>
            </div>

            {/* Revival-Readiness Dial */}
            <div className="paper-manila flex flex-col items-center justify-center rounded-3xl p-6 text-center lg:col-span-4">
              <RevivalGauge score={breakdown.total} size={142} label="Readiness" />
              <p className="mt-4 font-display text-base font-semibold text-[#181614]">
                Estimated Revival Readiness
              </p>
              <p className="mt-1.5 text-[11px] leading-relaxed text-[#5E584E]">
                Heuristic indicator computed from docs, setup clarity, blockers, and creator
                availability — not an objective prediction of future success.
              </p>

              {isOwner && project.completionStatus !== 'Resurrected' && (
                <div className="paper-divider mt-4 w-full pt-4">
                  <button
                    type="button"
                    onClick={() => handleResurrectTransition('Resurrected')}
                    className="w-full rounded-xl bg-[#17663F] px-3 py-2.5 text-xs font-semibold text-[#FFFDF9] shadow-sm transition hover:bg-[#135333]"
                  >
                    Trigger Resurrection Status
                  </button>
                  <span className="mt-1.5 block font-mono text-[9px] text-[#5E584E]">
                    {project.isDemo ? 'Demo Sandbox control' : 'Creator control'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Main Autopsy Grid */}
        <div className="mt-8 grid gap-6 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-8">
            {/* Development Autopsy — Ruled Ring-Binder Notebook Sheet */}
            <div className="paper-sheet bg-ruled-paper relative overflow-hidden rounded-3xl p-6 sm:pl-14">
              <BinderHolesColumn count={7} />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute bottom-0 left-10 top-0 hidden w-[1.5px] bg-[#B4432C]/25 sm:block"
              />
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#1E4E8C]">
                    Development Autopsy
                  </p>
                  <h2 className="mt-1 font-display text-2xl font-semibold text-[#181614]">
                    Last Signs of Development
                  </h2>
                </div>
                <span className="rounded-full border border-[#B4432C]/30 bg-[#F9EAE6] px-3 py-1 font-mono text-xs font-medium text-[#B4432C]">
                  Cause: {project.abandonmentReason}
                </span>
              </div>

              <div className="mt-5">
                <div className="mb-2 flex items-center justify-between text-xs">
                  <span className="text-[#5E584E]">Estimated Completion at Burial</span>
                  <span className="font-mono font-semibold text-[#17663F]">
                    {project.completionPercentage}%
                  </span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-[#EFE8DA]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${project.completionPercentage}%` }}
                    transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full rounded-full bg-[#17663F]"
                  />
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-[#17663F]/25 bg-[#EAF5DC]/65 p-4">
                  <div className="flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-wider text-[#17663F]">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Existing Features ({project.existingFeatures?.length || 0})</span>
                  </div>
                  <ul className="mt-3 space-y-2 text-xs leading-relaxed text-[#181614]">
                    {(project.existingFeatures || []).length > 0 ? (
                      project.existingFeatures.map((item, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#17663F]" />
                          <span>{item}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-[#5E584E]">No working features documented.</li>
                    )}
                  </ul>
                </div>

                <div className="rounded-2xl border border-[#1E4E8C]/25 bg-[#E8EEF5]/65 p-4">
                  <div className="flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-wider text-[#1E4E8C]">
                    <ListChecks className="h-4 w-4" />
                    <span>Incomplete Scope ({project.unfinishedFeatures?.length || 0})</span>
                  </div>
                  <ul className="mt-3 space-y-2 text-xs leading-relaxed text-[#181614]">
                    {(project.unfinishedFeatures || []).length > 0 ? (
                      project.unfinishedFeatures.map((item, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1E4E8C]" />
                          <span>{item}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-[#5E584E]">All planned features completed.</li>
                    )}
                  </ul>
                </div>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-[#B4432C]/25 bg-[#F9EAE6]/70 p-4">
                  <div className="flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-wider text-[#B4432C]">
                    <AlertOctagon className="h-4 w-4" />
                    <span>Technical Blockers</span>
                  </div>
                  <ul className="mt-3 space-y-2 text-xs leading-relaxed text-[#181614]">
                    {(project.blockers || []).length > 0 ? (
                      project.blockers.map((b, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#B4432C]" />
                          <span>{b}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-[#5E584E]">No active blockers reported.</li>
                    )}
                  </ul>
                </div>

                <div className="paper-manila rounded-2xl p-4">
                  <div className="flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-wider text-[#A36218]">
                    <AlertTriangle className="h-4 w-4" />
                    <span>Known Issues &amp; Missing Deps</span>
                  </div>
                  <ul className="mt-3 space-y-2 text-xs leading-relaxed text-[#181614]">
                    {[...(project.missingDependencies || []), ...(project.knownIssues || [])].length > 0 ? (
                      [...(project.missingDependencies || []), ...(project.knownIssues || [])].map(
                        (item, i) => (
                          <li key={i} className="flex gap-2">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#A36218]" />
                            <span>{item}</span>
                          </li>
                        )
                      )
                    ) : (
                      <li className="text-[#5E584E]">None documented.</li>
                    )}
                  </ul>
                </div>
              </div>

              {(project.suggestedNextSteps || []).length > 0 && (
                <div className="mt-4 rounded-2xl border border-[#181614]/15 bg-[#D8F29B]/25 p-4">
                  <div className="flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-wider text-[#17663F]">
                    <Wrench className="h-4 w-4" />
                    <span>Suggested Next Steps for Contributors</span>
                  </div>
                  <ol className="mt-3 space-y-2 text-xs leading-relaxed text-[#181614]">
                    {project.suggestedNextSteps.map((step, i) => (
                      <li key={i} className="flex gap-2.5">
                        <span className="font-mono font-bold text-[#17663F]">0{i + 1}.</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>

            {/* Interactive Technology Fingerprint */}
            <div className="paper-sheet rounded-3xl p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#5E584E]">
                    Technology Fingerprint
                  </p>
                  <h2 className="mt-1 font-display text-2xl font-semibold text-[#181614]">
                    Architecture &amp; Stack Layers
                  </h2>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => setActiveTechCategory('all')}
                    className={`relative rounded-[3px] px-3 py-1 font-typewriter text-[10px] uppercase transition ${
                      activeTechCategory === 'all'
                        ? 'text-[#FCF9F0]'
                        : 'paper-chip text-[#5B5246]'
                    }`}
                  >
                    {activeTechCategory === 'all' && (
                      <motion.span
                        layoutId="tech-layer-pill"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        className="absolute inset-0 rounded-[3px] bg-[#1A1714]"
                      />
                    )}
                    <span className="relative z-10">All Layers</span>
                  </button>
                  {techGroups.map((g) => (
                    <button
                      key={g.key}
                      type="button"
                      onClick={() => setActiveTechCategory(g.key)}
                      className={`relative rounded-[3px] px-3 py-1 font-typewriter text-[10px] uppercase transition ${
                        activeTechCategory === g.key
                          ? 'text-[#FCF9F0]'
                          : 'paper-chip text-[#5B5246]'
                      }`}
                    >
                      {activeTechCategory === g.key && (
                        <motion.span
                          layoutId="tech-layer-pill"
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                          className="absolute inset-0 rounded-[3px] bg-[#1D5B3A]"
                        />
                      )}
                      <span className="relative z-10">{g.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <motion.div layout className="mt-5 grid gap-4 sm:grid-cols-2">
                <AnimatePresence mode="popLayout">
                  {techGroups
                    .filter((g) => activeTechCategory === 'all' || activeTechCategory === g.key)
                    .map((group) => (
                      <motion.div
                        key={group.key}
                        layout
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        transition={{ duration: 0.25 }}
                        className="paper-manila rounded-[4px] p-4"
                      >
                        <p className="font-typewriter text-[10px] uppercase tracking-widest text-[#5B5246]">
                          {group.label}
                        </p>
                        <div className="mt-2.5 flex flex-wrap gap-2">
                          {group.items.map((tech) => (
                            <span
                              key={tech}
                              className="paper-chip inline-flex items-center gap-1.5 rounded-[3px] px-3 py-1.5 font-mono text-xs font-medium text-[#1A1714]"
                            >
                              <Code2 className="h-3 w-3 text-[#1D5B3A]" />
                              {tech}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                </AnimatePresence>
              </motion.div>
            </div>

            {/* Transparent Readiness Breakdown */}
            <div className="paper-sheet rounded-3xl p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#17663F]">
                    Transparent Heuristic Scoring
                  </p>
                  <h2 className="mt-1 font-display text-2xl font-semibold text-[#181614]">
                    How Revival Readiness ({breakdown.total}/100) is Calculated
                  </h2>
                </div>
                <Info className="h-5 w-5 shrink-0 text-[#5E584E]" />
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {breakdown.factors.map((f) => (
                  <div
                    key={f.key}
                    className="rounded-2xl border border-[#181614]/12 bg-[#FAF7F0] p-4"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#181614]">{f.label}</span>
                      <span className="font-mono font-semibold text-[#17663F]">
                        {f.score}/100 ({Math.round(f.weight * 100)}%)
                      </span>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#EFE8DA]">
                      <div
                        className="h-full rounded-full bg-[#17663F]"
                        style={{ width: `${f.score}%` }}
                      />
                    </div>
                    <p className="mt-2 text-[11px] text-[#5E584E]">{f.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right 4 Columns */}
          <div className="space-y-6 lg:col-span-4">
            {skillMatch.score !== null && (
              <div className="paper-sheet rounded-3xl border-[#17663F]/30 bg-[#EAF5DC]/45 p-5">
                <div className="flex items-center justify-between">
                  <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#17663F]">
                    Your Skill Match
                  </p>
                  <span className="font-display text-2xl font-bold text-[#17663F]">
                    {skillMatch.score}%
                  </span>
                </div>
                <p className="mt-2 text-xs font-medium text-[#181614]">{skillMatch.summary}</p>
                <div className="mt-4 space-y-2.5">
                  {skillMatch.factors.map((f) => (
                    <div
                      key={f.label}
                      className="rounded-xl border border-[#181614]/10 bg-[#FFFDF9] p-3 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-[#181614]">{f.label}</span>
                        <span className="font-mono font-semibold text-[#1E4E8C]">
                          {f.points}/{f.maxPoints}
                        </span>
                      </div>
                      <p className="mt-1 text-[11px] text-[#5E584E]">{f.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* GitHub Public Repository Telemetry with Subtle Archival Scan Line */}
            <div className="paper-sheet relative overflow-hidden rounded-[4px] p-5">
              <motion.div
                aria-hidden="true"
                initial={{ y: '-10%', opacity: 0 }}
                whileInView={{ y: ['0%', '115%'], opacity: [0, 0.55, 0] }}
                viewport={{ once: true }}
                transition={{ duration: 2.2, ease: 'easeInOut' }}
                className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#1D5B3A]/45 to-transparent"
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Github className="h-4 w-4 text-[#181614]" />
                  <h3 className="font-display text-base font-semibold text-[#181614]">
                    GitHub Repository
                  </h3>
                </div>
                {project.repositoryUrl && (
                  <a
                    href={project.repositoryUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-[#1E4E8C] hover:underline"
                  >
                    Open <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>

              {githubState.loading ? (
                <MonumentLoader compact message="Exhuming repository..." />
              ) : githubState.data ? (
                <div className="mt-4 space-y-3">
                  <p className="font-mono text-xs font-semibold text-[#181614]">
                    {githubState.data.fullName}
                  </p>
                  {githubState.data.description && (
                    <p className="text-xs leading-relaxed text-[#5E584E]">
                      {githubState.data.description}
                    </p>
                  )}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="paper-manila rounded-xl p-2.5">
                      <Star className="mx-auto h-3.5 w-3.5 text-[#A36218]" />
                      <p className="mt-1 font-mono font-semibold text-[#181614]">
                        {githubState.data.stars}
                      </p>
                      <p className="text-[10px] text-[#5E584E]">Stars</p>
                    </div>
                    <div className="paper-manila rounded-xl p-2.5">
                      <GitFork className="mx-auto h-3.5 w-3.5 text-[#1E4E8C]" />
                      <p className="mt-1 font-mono font-semibold text-[#181614]">
                        {githubState.data.forks}
                      </p>
                      <p className="text-[10px] text-[#5E584E]">Forks</p>
                    </div>
                    <div className="paper-manila rounded-xl p-2.5">
                      <GitBranch className="mx-auto h-3.5 w-3.5 text-[#17663F]" />
                      <p className="mt-1 truncate font-mono font-semibold text-[#181614]">
                        {githubState.data.defaultBranch}
                      </p>
                      <p className="text-[10px] text-[#5E584E]">Branch</p>
                    </div>
                  </div>
                  {githubState.data.languages?.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <p className="font-mono text-[10px] uppercase tracking-wider text-[#5E584E]">
                        Detected Languages
                      </p>
                      {githubState.data.languages.map((lang) => (
                        <div key={lang.name} className="flex items-center justify-between text-xs">
                          <span className="text-[#181614]">{lang.name}</span>
                          <span className="font-mono font-semibold text-[#17663F]">
                            {lang.percentage}%
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="mt-4 space-y-2.5 text-xs text-[#5E584E]">
                  {githubState.error && (
                    <p className="paper-manila rounded-xl p-3 text-[11px]">{githubState.error}</p>
                  )}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="paper-manila rounded-xl p-3">
                      <span className="font-mono text-[10px] text-[#5E584E]">Visibility</span>
                      <p className="mt-1 font-semibold capitalize text-[#181614]">
                        {project.repoVisibility}
                      </p>
                    </div>
                    <div className="paper-manila rounded-xl p-3">
                      <span className="font-mono text-[10px] text-[#5E584E]">Default Branch</span>
                      <p className="mt-1 font-mono font-semibold text-[#181614]">
                        {project.githubMeta?.defaultBranch || 'main'}
                      </p>
                    </div>
                    {typeof project.githubMeta?.stars === 'number' && (
                      <div className="paper-manila rounded-xl p-3">
                        <span className="font-mono text-[10px] text-[#5E584E]">Saved Stars</span>
                        <p className="mt-1 font-mono font-semibold text-[#17663F]">
                          {project.githubMeta.stars}
                        </p>
                      </div>
                    )}
                    {typeof project.githubMeta?.forks === 'number' && (
                      <div className="paper-manila rounded-xl p-3">
                        <span className="font-mono text-[10px] text-[#5E584E]">Saved Forks</span>
                        <p className="mt-1 font-mono font-semibold text-[#1E4E8C]">
                          {project.githubMeta.forks}
                        </p>
                      </div>
                    )}
                  </div>
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="paper-chip flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-medium text-[#181614]"
                    >
                      <span>Archived Demo Link</span>
                      <ExternalLink className="h-3.5 w-3.5 text-[#17663F]" />
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Ownership & Permissions */}
            <div className="paper-sheet rounded-3xl p-5">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-[#17663F]" />
                <h3 className="font-display text-base font-semibold text-[#181614]">
                  Ownership &amp; Permissions
                </h3>
              </div>
              <dl className="mt-4 space-y-2.5 text-xs">
                <div className="flex justify-between gap-2">
                  <dt className="text-[#5E584E]">Contributions</dt>
                  <dd className="font-semibold text-[#181614]">
                    {project.acceptContributions ? 'Open via Request' : 'Closed'}
                  </dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-[#5E584E]">Formal Adoption</dt>
                  <dd className="font-semibold text-[#181614]">
                    {project.allowAdoption ? 'Approval Required' : 'Not Allowed'}
                  </dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-[#5E584E]">Creator Availability</dt>
                  <dd className="font-semibold text-[#1E4E8C]">{project.creatorAvailability}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-[#5E584E]">Contact Channel</dt>
                  <dd className="font-semibold text-[#181614]">{project.contactPreference}</dd>
                </div>
              </dl>
            </div>

            {/* Chronological Project Timeline */}
            <div className="paper-sheet rounded-[4px] p-5">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#1E4A7A]" />
                <h3 className="font-display text-xl font-bold text-[#1A1714]">
                  Dossier Timeline
                </h3>
              </div>
              <div className="relative mt-4 space-y-4 pl-5">
                <motion.div
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  style={{ transformOrigin: 'top' }}
                  className="absolute bottom-1 left-[5px] top-1 w-[2px] bg-[#1A1714]/15"
                />
                {timelineEvents.map((ev, idx) => (
                  <motion.div
                    key={ev.label}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: 0.1 + idx * 0.08 }}
                    className="relative"
                  >
                    <span
                      className="absolute -left-[20px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-[#FCF9F0]"
                      style={{ backgroundColor: ev.color }}
                    />
                    <p className="text-xs font-bold text-[#1A1714]">{ev.label}</p>
                    <p className="font-mono text-[11px] text-[#5B5246]">
                      {new Date(ev.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Interactive Archivist's Margin Scratchpad */}
            <div className="paper-sheet relative rounded-3xl border-[#A36218]/25 bg-[#FBF6E2] p-5">
              <div className="flex items-center justify-between">
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#A36218]">
                  Archivist&apos;s Sticky Note
                </p>
                <span className="font-mono text-[10px] text-[#5E584E]">Saved locally</span>
              </div>
              <textarea
                rows={3}
                value={scratchpad}
                onChange={(e) => handleScratchpadChange(e.target.value)}
                onFocus={playPenClick}
                placeholder={`Jot down your inspection notes or revival plan for ${project.name}...`}
                className="mt-2.5 w-full resize-none rounded-xl border border-[#181614]/12 bg-[#FFFDF7]/80 p-3 text-sm text-[#181614] placeholder:text-[#5E584E]/60 focus:border-[#17663F] focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      <ResurrectionRequestModal
        project={project}
        open={requestModal.open}
        initialType={requestModal.type}
        onClose={() => setRequestModal({ open: false, type: 'contribute' })}
      />

      <GlassModal
        open={contactOpen}
        onClose={() => setContactOpen(false)}
        subtitle={`Preferred Channel: ${project.contactPreference}`}
        title={`Message ${project.creatorName}`}
      >
        <form onSubmit={handleContactSubmit} className="space-y-4">
          <p className="text-xs leading-relaxed text-[#5E584E]">
            Ask technical questions about {project.name}&apos;s architecture, environment variables,
            or licensing before submitting a formal resurrection request.
          </p>
          <textarea
            rows={4}
            required
            value={contactMsg}
            onChange={(e) => setContactMsg(e.target.value)}
            placeholder={`Hi ${project.creatorName}, I inspected the autopsy for ${project.name}...`}
            className="paper-input w-full rounded-2xl p-3.5 text-sm placeholder:text-[#5E584E]/60"
          />
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setContactOpen(false)}
              className="paper-chip rounded-xl px-4 py-2 text-xs font-medium text-[#5E584E]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-[#181614] px-5 py-2 text-xs font-semibold text-[#FFFDF9]"
            >
              Send Message
            </button>
          </div>
        </form>
      </GlassModal>
    </PageTransition>
  );
}
