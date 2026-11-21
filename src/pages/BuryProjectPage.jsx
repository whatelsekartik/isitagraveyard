import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Github,
  ShieldAlert,
  Sparkles,
  Trash2,
  Loader2,
} from 'lucide-react';
import { useGraveyard } from '../context/GraveyardContext';
import { ABANDONMENT_REASONS, PROJECT_CATEGORIES } from '../data/seedProjects';
import { fetchGitHubRepoMetadata } from '../lib/githubApi';
import { calculateRevivalBreakdown } from '../lib/revivalScore';
import { ProjectLogoMark } from '../components/glass-panels/ProjectLogoMark';
import { PageTransition } from '../components/animations/MotionPrimitives';
import { ArchivalWaxSeal } from '../components/illustrations/ArchivalIllustrations';
import { playPaperRustle, playStampThud } from '../lib/paperSound';

const DRAFT_KEY = 'project_graveyard_bury_draft_v1';

const STEPS = [
  { num: 1, title: 'Identity' },
  { num: 2, title: 'Repository' },
  { num: 3, title: 'Autopsy' },
  { num: 4, title: 'Preferences' },
  { num: 5, title: 'Passport' },
];

const LOGO_SEEDS = ['monolith', 'obelisk', 'prism', 'vault', 'cross', 'orbit', 'radar'];

const INITIAL_FORM = {
  name: '',
  tagline: '',
  description: '',
  category: 'Developer Tools',
  logoSeed: 'monolith',
  logoUrl: '',
  repositoryUrl: '',
  demoUrl: '',
  docsUrl: '',
  repoVisibility: 'public',
  languagesText: 'JavaScript, TypeScript',
  frameworksText: 'React, Vite',
  databaseText: 'PostgreSQL',
  abandonmentReason: 'Lack of time',
  abandonedAt: new Date().toISOString().slice(0, 10),
  completionPercentage: 55,
  existingFeaturesText: '',
  unfinishedFeaturesText: '',
  blockersText: '',
  missingDependenciesText: '',
  suggestedNextStepsText: '',
  documentationQuality: 70,
  setupCompleteness: 65,
  acceptContributions: true,
  allowAdoption: true,
  contactPreference: 'Platform Requests',
  requiredSkillsText: 'React, PostgreSQL',
  collaborationModel: 'Co-maintainership',
  creatorAvailability: 'Advisory',
  difficulty: 'Intermediate',
  githubMeta: {},
  ownershipConfirmed: false,
};

function splitLines(text) {
  return (text || '')
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);
}

function splitComma(text) {
  return (text || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function BuryProjectPage() {
  const navigate = useNavigate();
  const { buryProject, activeProfile, isAuthenticated } = useGraveyard();

  const [step, setStep] = useState(1);
  const [form, setForm] = useState(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      return saved ? { ...INITIAL_FORM, ...JSON.parse(saved) } : INITIAL_FORM;
    } catch {
      return INITIAL_FORM;
    }
  });
  const [error, setError] = useState('');
  const [ghFetching, setGhFetching] = useState(false);
  const [ghMessage, setGhMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(form));
    } catch {
      // Ignore quota errors
    }
  }, [form]);

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError('');
  };

  const handleInspectGithub = async () => {
    setGhMessage('');
    setGhFetching(true);
    const res = await fetchGitHubRepoMetadata(form.repositoryUrl);
    setGhFetching(false);

    if (res.data) {
      const detectedLangs = res.data.languages?.map((l) => l.name) || [];
      setForm((prev) => ({
        ...prev,
        githubMeta: res.data,
        description: prev.description || res.data.description || '',
        languagesText: detectedLangs.length ? detectedLangs.join(', ') : prev.languagesText,
      }));
      setGhMessage(
        `Connected: ${res.data.fullName} (${res.data.stars} stars, branch ${res.data.defaultBranch})`
      );
    } else {
      setGhMessage(res.error || 'Could not inspect repository.');
    }
  };

  const validateStep = (targetStep) => {
    if (targetStep === 1) {
      if (form.name.trim().length < 2) return 'Project name must be at least 2 characters.';
      if (form.tagline.trim().length < 10)
        return 'Add a crisp short description (at least 10 characters).';
      if (form.description.trim().length < 25)
        return 'Describe the project context (at least 25 characters).';
    }
    if (targetStep === 2) {
      if (form.repositoryUrl && !/^https?:\/\//i.test(form.repositoryUrl.trim())) {
        return 'Repository URL must start with http:// or https://';
      }
    }
    if (targetStep === 3) {
      if (splitLines(form.existingFeaturesText).length === 0) {
        return 'List at least one working feature or artifact so contributors know where it stands.';
      }
      if (splitLines(form.unfinishedFeaturesText).length === 0) {
        return 'List at least one unfinished feature or remaining milestone.';
      }
    }
    return '';
  };

  const nextStep = () => {
    const err = validateStep(step);
    if (err) {
      setError(err);
      return;
    }
    playPaperRustle();
    setError('');
    setStep((s) => Math.min(5, s + 1));
  };

  const prevStep = () => {
    playPaperRustle();
    setError('');
    setStep((s) => Math.max(1, s - 1));
  };

  const buildPayload = () => ({
    name: form.name,
    tagline: form.tagline,
    description: form.description,
    category: form.category,
    logoSeed: form.logoSeed,
    logoUrl: form.logoUrl,
    repositoryUrl: form.repositoryUrl,
    demoUrl: form.demoUrl,
    docsUrl: form.docsUrl,
    repoVisibility: form.repoVisibility,
    technologies: {
      languages: splitComma(form.languagesText),
      frameworks: splitComma(form.frameworksText),
      libraries: [],
      backend: [],
      database: splitComma(form.databaseText),
      deployment: [],
    },
    requiredSkills: splitComma(form.requiredSkillsText),
    difficulty: form.difficulty,
    completionPercentage: form.completionPercentage,
    abandonmentReason: form.abandonmentReason,
    abandonedAt: form.abandonedAt
      ? new Date(form.abandonedAt).toISOString()
      : new Date().toISOString(),
    existingFeatures: splitLines(form.existingFeaturesText),
    unfinishedFeatures: splitLines(form.unfinishedFeaturesText),
    blockers: splitLines(form.blockersText),
    missingDependencies: splitLines(form.missingDependenciesText),
    suggestedNextSteps: splitLines(form.suggestedNextStepsText),
    documentationQuality: form.documentationQuality,
    setupCompleteness: form.setupCompleteness,
    acceptContributions: form.acceptContributions,
    allowAdoption: form.allowAdoption,
    contactPreference: form.contactPreference,
    collaborationModel: form.collaborationModel,
    creatorAvailability: form.creatorAvailability,
    githubMeta: form.githubMeta,
  });

  const handlePublish = async () => {
    if (!form.ownershipConfirmed) {
      setError('You must confirm ownership or permission to share this project.');
      return;
    }

    playStampThud();
    setSubmitting(true);
    const payload = buildPayload();
    const { project } = await buryProject(payload);
    setSubmitting(false);

    localStorage.removeItem(DRAFT_KEY);
    navigate(`/projects/${project.id}`);
  };

  const clearDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
    setForm(INITIAL_FORM);
    setStep(1);
    setError('');
  };

  const previewPayload = buildPayload();
  const previewScore = calculateRevivalBreakdown(previewPayload).total;

  return (
    <PageTransition className="pb-24 pt-28">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-[#17663F]">
              Ceremonial Preservation · Step {step} of 5
            </p>
            <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-[#181614] sm:text-5xl">
              Bury a{' '}
              <span className="marker-highlight italic font-normal text-[#17663F]">Project.</span>
            </h1>
          </div>

          <button
            type="button"
            onClick={clearDraft}
            className="paper-chip inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-medium text-[#5E584E] hover:text-[#B4432C]"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Clear Draft</span>
          </button>
        </div>

        {/* Folder Tab Stepper */}
        <div className="paper-sheet mb-8 rounded-2xl p-3 sm:p-4">
          <div className="grid grid-cols-5 gap-2">
            {STEPS.map((item) => {
              const active = step === item.num;
              const completed = step > item.num;
              return (
                <button
                  key={item.num}
                  type="button"
                  onClick={() => {
                    if (item.num < step) setStep(item.num);
                  }}
                  className={`flex flex-col items-center gap-1.5 rounded-xl px-2 py-2.5 text-center transition ${
                    active
                      ? 'border border-[#17663F]/40 bg-[#EAF5DC] text-[#17663F]'
                      : completed
                        ? 'bg-[#EFE8DA] text-[#181614]'
                        : 'text-[#5E584E] opacity-70'
                  }`}
                >
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full font-mono text-[11px] font-semibold ${
                      active
                        ? 'bg-[#17663F] text-[#FFFDF9]'
                        : completed
                          ? 'bg-[#181614] text-[#FFFDF9]'
                          : 'bg-[#EFE8DA]'
                    }`}
                  >
                    {completed ? <Check className="h-3.5 w-3.5" /> : item.num}
                  </span>
                  <span className="hidden font-mono text-[10px] font-semibold uppercase tracking-wider sm:block">
                    {item.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step Sheet */}
        <div className="paper-dossier rounded-[2rem] p-6 sm:p-8">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 14 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -14 }}
                transition={{ duration: 0.25 }}
                className="space-y-5"
              >
                <div>
                  <h2 className="font-display text-2xl font-semibold text-[#181614]">
                    01 · Dossier Identity
                  </h2>
                  <p className="mt-1 text-xs text-[#5E584E]">
                    Name the idea and choose its archival seal. Drafts autosave automatically.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-[#5E584E]">
                      Project Name *
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => updateField('name', e.target.value)}
                      placeholder="e.g. MeshArchive"
                      className="paper-input w-full rounded-xl px-4 py-3 text-sm"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-[#5E584E]">
                      Category
                    </label>
                    <select
                      value={form.category}
                      onChange={(e) => updateField('category', e.target.value)}
                      className="paper-input w-full rounded-xl px-4 py-3 text-sm"
                    >
                      {PROJECT_CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-[#5E584E]">
                    Short Tagline *
                  </label>
                  <input
                    type="text"
                    value={form.tagline}
                    onChange={(e) => updateField('tagline', e.target.value)}
                    placeholder="One crisp sentence summarizing what this project was built to do."
                    className="paper-input w-full rounded-xl px-4 py-3 text-sm"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-[#5E584E]">
                    Project Backstory &amp; Scope *
                  </label>
                  <textarea
                    rows={4}
                    value={form.description}
                    onChange={(e) => updateField('description', e.target.value)}
                    placeholder="Explain what inspired the build, how far it got, and why it still matters..."
                    className="paper-input w-full rounded-2xl p-4 text-sm"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block font-mono text-[11px] uppercase tracking-wider text-[#5E584E]">
                      Archive Seal Emblem
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {LOGO_SEEDS.map((seed) => (
                        <button
                          key={seed}
                          type="button"
                          onClick={() => updateField('logoSeed', seed)}
                          className={`rounded-2xl border p-1.5 transition ${
                            form.logoSeed === seed
                              ? 'border-[#17663F] bg-[#EAF5DC]'
                              : 'border-[#181614]/15 opacity-75 hover:opacity-100'
                          }`}
                        >
                          <ProjectLogoMark seed={seed} size="sm" status="Resurrected" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-[#5E584E]">
                      Custom Logo URL (Optional)
                    </label>
                    <input
                      type="url"
                      value={form.logoUrl}
                      onChange={(e) => updateField('logoUrl', e.target.value)}
                      placeholder="https://..."
                      className="paper-input w-full rounded-xl px-4 py-3 text-sm"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 14 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -14 }}
                transition={{ duration: 0.25 }}
                className="space-y-5"
              >
                <div>
                  <h2 className="font-display text-2xl font-semibold text-[#181614]">
                    02 · Repository &amp; Stack
                  </h2>
                  <p className="mt-1 text-xs text-[#5E584E]">
                    Connect a public repository to pull language and commit telemetry automatically.
                  </p>
                </div>

                <div className="flex items-start gap-3 rounded-2xl border border-[#1E4E8C]/25 bg-[#E8EEF5] p-4 text-xs text-[#181614]">
                  <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-[#1E4E8C]" />
                  <span>
                    Only submit repositories you own or have explicit permission to share. Do not
                    expose private source code, credentials, or `.env` files.
                  </span>
                </div>

                <div>
                  <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-[#5E584E]">
                    GitHub Repository URL
                  </label>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <input
                      type="url"
                      value={form.repositoryUrl}
                      onChange={(e) => updateField('repositoryUrl', e.target.value)}
                      placeholder="https://github.com/username/project"
                      className="paper-input flex-1 rounded-xl px-4 py-3 text-sm"
                    />
                    <button
                      type="button"
                      onClick={handleInspectGithub}
                      disabled={ghFetching || !form.repositoryUrl}
                      className="paper-chip inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs font-semibold text-[#17663F] disabled:opacity-50"
                    >
                      {ghFetching ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Github className="h-4 w-4" />
                      )}
                      <span>Fetch Metadata</span>
                    </button>
                  </div>
                  {ghMessage && (
                    <p className="mt-2 font-mono text-[11px] text-[#1E4E8C]">{ghMessage}</p>
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-[#5E584E]">
                      Visibility
                    </label>
                    <select
                      value={form.repoVisibility}
                      onChange={(e) => updateField('repoVisibility', e.target.value)}
                      className="paper-input w-full rounded-xl px-3.5 py-3 text-sm"
                    >
                      <option value="public">Public Repo</option>
                      <option value="request-access">Request Access Only</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-[#5E584E]">
                      Demo URL
                    </label>
                    <input
                      type="url"
                      value={form.demoUrl}
                      onChange={(e) => updateField('demoUrl', e.target.value)}
                      placeholder="https://demo..."
                      className="paper-input w-full rounded-xl px-3.5 py-3 text-sm"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-[#5E584E]">
                      Docs URL
                    </label>
                    <input
                      type="url"
                      value={form.docsUrl}
                      onChange={(e) => updateField('docsUrl', e.target.value)}
                      placeholder="https://docs..."
                      className="paper-input w-full rounded-xl px-3.5 py-3 text-sm"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-[#5E584E]">
                      Languages (comma separated)
                    </label>
                    <input
                      type="text"
                      value={form.languagesText}
                      onChange={(e) => updateField('languagesText', e.target.value)}
                      className="paper-input w-full rounded-xl px-3.5 py-3 text-xs"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-[#5E584E]">
                      Frameworks
                    </label>
                    <input
                      type="text"
                      value={form.frameworksText}
                      onChange={(e) => updateField('frameworksText', e.target.value)}
                      className="paper-input w-full rounded-xl px-3.5 py-3 text-xs"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-[#5E584E]">
                      Database / Storage
                    </label>
                    <input
                      type="text"
                      value={form.databaseText}
                      onChange={(e) => updateField('databaseText', e.target.value)}
                      className="paper-input w-full rounded-xl px-3.5 py-3 text-xs"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 14 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -14 }}
                transition={{ duration: 0.25 }}
                className="space-y-5"
              >
                <div>
                  <h2 className="font-display text-2xl font-semibold text-[#181614]">
                    03 · Technical Autopsy
                  </h2>
                  <p className="mt-1 text-xs text-[#5E584E]">
                    Honest postmortems save future contributors days of archaeology. Use one line per
                    bullet item.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-[#5E584E]">
                      Abandonment Reason
                    </label>
                    <select
                      value={form.abandonmentReason}
                      onChange={(e) => updateField('abandonmentReason', e.target.value)}
                      className="paper-input w-full rounded-xl px-3.5 py-3 text-sm"
                    >
                      {ABANDONMENT_REASONS.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-[#5E584E]">
                      Date Abandoned
                    </label>
                    <input
                      type="date"
                      value={form.abandonedAt}
                      onChange={(e) => updateField('abandonedAt', e.target.value)}
                      className="paper-input w-full rounded-xl px-3.5 py-3 text-sm"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-[#5E584E]">
                      Completion:{' '}
                      <strong className="text-[#17663F]">{form.completionPercentage}%</strong>
                    </label>
                    <input
                      type="range"
                      min="5"
                      max="95"
                      value={form.completionPercentage}
                      onChange={(e) => updateField('completionPercentage', Number(e.target.value))}
                      className="mt-3 w-full accent-[#17663F]"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block font-mono text-[11px] font-semibold uppercase tracking-wider text-[#17663F]">
                      What Currently Works * (one per line)
                    </label>
                    <textarea
                      rows={4}
                      value={form.existingFeaturesText}
                      onChange={(e) => updateField('existingFeaturesText', e.target.value)}
                      placeholder={'User auth & Postgres schema\nCore REST API endpoints'}
                      className="paper-input w-full rounded-2xl p-3.5 text-xs"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block font-mono text-[11px] font-semibold uppercase tracking-wider text-[#1E4E8C]">
                      What Remains Unfinished * (one per line)
                    </label>
                    <textarea
                      rows={4}
                      value={form.unfinishedFeaturesText}
                      onChange={(e) => updateField('unfinishedFeaturesText', e.target.value)}
                      placeholder={'Realtime sync conflict handler\nMobile responsive checkout'}
                      className="paper-input w-full rounded-2xl p-3.5 text-xs"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block font-mono text-[11px] font-semibold uppercase tracking-wider text-[#B4432C]">
                      Technical Blockers (one per line)
                    </label>
                    <textarea
                      rows={3}
                      value={form.blockersText}
                      onChange={(e) => updateField('blockersText', e.target.value)}
                      placeholder="Memory leak in worker queue on large payloads"
                      className="paper-input w-full rounded-2xl p-3.5 text-xs"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block font-mono text-[11px] font-semibold uppercase tracking-wider text-[#5E584E]">
                      Suggested Next Steps (one per line)
                    </label>
                    <textarea
                      rows={3}
                      value={form.suggestedNextStepsText}
                      onChange={(e) => updateField('suggestedNextStepsText', e.target.value)}
                      placeholder="Replace polling loop with SSE stream"
                      className="paper-input w-full rounded-2xl p-3.5 text-xs"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block font-mono text-[11px] text-[#5E584E]">
                      Documentation Quality:{' '}
                      <strong className="text-[#181614]">{form.documentationQuality}/100</strong>
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={form.documentationQuality}
                      onChange={(e) => updateField('documentationQuality', Number(e.target.value))}
                      className="w-full accent-[#1E4E8C]"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block font-mono text-[11px] text-[#5E584E]">
                      Setup Completeness:{' '}
                      <strong className="text-[#181614]">{form.setupCompleteness}/100</strong>
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={form.setupCompleteness}
                      onChange={(e) => updateField('setupCompleteness', Number(e.target.value))}
                      className="w-full accent-[#17663F]"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 14 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -14 }}
                transition={{ duration: 0.25 }}
                className="space-y-5"
              >
                <div>
                  <h2 className="font-display text-2xl font-semibold text-[#181614]">
                    04 · Resurrection Preferences
                  </h2>
                  <p className="mt-1 text-xs text-[#5E584E]">
                    Define how developers can collaborate or request formal stewardship.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="paper-sheet flex cursor-pointer items-start gap-3 rounded-2xl p-4">
                    <input
                      type="checkbox"
                      checked={form.acceptContributions}
                      onChange={(e) => updateField('acceptContributions', e.target.checked)}
                      className="mt-1 accent-[#17663F]"
                    />
                    <div>
                      <p className="text-sm font-semibold text-[#181614]">Accept Contributions</p>
                      <p className="mt-1 text-xs text-[#5E584E]">
                        Allow developers to request permission to fix bugs and build unfinished features.
                      </p>
                    </div>
                  </label>

                  <label className="paper-sheet flex cursor-pointer items-start gap-3 rounded-2xl p-4">
                    <input
                      type="checkbox"
                      checked={form.allowAdoption}
                      onChange={(e) => updateField('allowAdoption', e.target.checked)}
                      className="mt-1 accent-[#1E4E8C]"
                    />
                    <div>
                      <p className="text-sm font-semibold text-[#181614]">Allow Adoption Requests</p>
                      <p className="mt-1 text-xs text-[#5E584E]">
                        Let experienced maintainers request to adopt the project with your explicit approval.
                      </p>
                    </div>
                  </label>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-[#5E584E]">
                      Preferred Collaboration Model
                    </label>
                    <select
                      value={form.collaborationModel}
                      onChange={(e) => updateField('collaborationModel', e.target.value)}
                      className="paper-input w-full rounded-xl px-3.5 py-3 text-sm"
                    >
                      <option value="Co-maintainership">Co-maintainership</option>
                      <option value="Guided Squad">Guided Squad</option>
                      <option value="Full Adoption">Full Adoption (With Approval)</option>
                      <option value="Open Fork / Adoption">Open Fork / Community Revival</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-[#5E584E]">
                      Creator Availability
                    </label>
                    <select
                      value={form.creatorAvailability}
                      onChange={(e) => updateField('creatorAvailability', e.target.value)}
                      className="paper-input w-full rounded-xl px-3.5 py-3 text-sm"
                    >
                      <option value="Active Mentor">Active Mentor</option>
                      <option value="Advisory">Advisory (PR reviews &amp; context)</option>
                      <option value="Async Handoff">Async Handoff</option>
                      <option value="Unavailable">Unavailable</option>
                    </select>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-[#5E584E]">
                      Required Contributor Skills (comma separated)
                    </label>
                    <input
                      type="text"
                      value={form.requiredSkillsText}
                      onChange={(e) => updateField('requiredSkillsText', e.target.value)}
                      className="paper-input w-full rounded-xl px-4 py-3 text-sm"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-[#5E584E]">
                      Difficulty
                    </label>
                    <select
                      value={form.difficulty}
                      onChange={(e) => updateField('difficulty', e.target.value)}
                      className="paper-input w-full rounded-xl px-3.5 py-3 text-sm"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-[#5E584E]">
                    Contact Preferences
                  </label>
                  <select
                    value={form.contactPreference}
                    onChange={(e) => updateField('contactPreference', e.target.value)}
                    className="paper-input w-full rounded-xl px-4 py-3 text-sm"
                  >
                    <option value="Platform Requests">Platform Requests Only</option>
                    <option value="GitHub + Platform">GitHub Discussions + Platform</option>
                    <option value="Fork & Open PR">Fork &amp; Open PR Directly</option>
                  </select>
                </div>
              </motion.div>
            )}

            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 14 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -14 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="font-display text-2xl font-semibold text-[#181614]">
                    05 · Review Project Passport
                  </h2>
                  <p className="mt-1 text-xs text-[#5E584E]">
                    Inspect the archival dossier before sealing and publishing to the Graveyard.
                  </p>
                </div>

                <div className="paper-sheet relative rounded-3xl border-[#17663F]/30 p-6">
                  <div className="pointer-events-none absolute -right-2 -top-4 hidden sm:block">
                    <ArchivalWaxSeal label="PASSPORT" color="#1E4E8C" bg="#E8EEF5" size={72} />
                  </div>
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <ProjectLogoMark
                        seed={form.logoSeed}
                        logoUrl={form.logoUrl}
                        name={form.name}
                        size="lg"
                      />
                      <div>
                        <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#17663F]">
                          Project Passport · {form.category}
                        </span>
                        <h3 className="mt-1 font-display text-2xl font-semibold text-[#181614]">
                          {form.name}
                        </h3>
                        <p className="text-xs text-[#5E584E]">
                          Buried by {activeProfile.displayName} · {form.completionPercentage}% complete
                        </p>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-[#17663F]/35 bg-[#EAF5DC] px-4 py-2 text-center">
                      <p className="font-display text-2xl font-bold text-[#17663F]">
                        {previewScore}
                      </p>
                      <p className="font-mono text-[9px] uppercase tracking-wider text-[#5E584E]">
                        Est. Readiness
                      </p>
                    </div>
                  </div>

                  <p className="mt-4 text-sm leading-relaxed text-[#181614]/85">
                    {form.description}
                  </p>

                  <div className="mt-4 grid gap-3 text-xs sm:grid-cols-3">
                    <div className="paper-manila rounded-xl p-3">
                      <span className="font-mono text-[10px] text-[#5E584E]">Abandonment Cause</span>
                      <p className="mt-1 font-semibold text-[#181614]">{form.abandonmentReason}</p>
                    </div>
                    <div className="paper-manila rounded-xl p-3">
                      <span className="font-mono text-[10px] text-[#5E584E]">Working Items</span>
                      <p className="mt-1 font-semibold text-[#17663F]">
                        {splitLines(form.existingFeaturesText).length} documented
                      </p>
                    </div>
                    <div className="paper-manila rounded-xl p-3">
                      <span className="font-mono text-[10px] text-[#5E584E]">Unfinished Scope</span>
                      <p className="mt-1 font-semibold text-[#1E4E8C]">
                        {splitLines(form.unfinishedFeaturesText).length} milestones
                      </p>
                    </div>
                  </div>
                </div>

                <label className="paper-sheet flex cursor-pointer items-start gap-3 rounded-2xl border-[#17663F]/25 bg-[#EAF5DC]/45 p-4">
                  <input
                    type="checkbox"
                    checked={form.ownershipConfirmed}
                    onChange={(e) => updateField('ownershipConfirmed', e.target.checked)}
                    className="mt-1 accent-[#17663F]"
                  />
                  <span className="text-xs leading-relaxed text-[#181614]">
                    I confirm that I am the creator of this project or have explicit authorization to
                    publish its metadata, and that I have not exposed private source code or secrets.
                  </span>
                </label>

                {!isAuthenticated && (
                  <p className="font-mono text-[11px] text-[#1E4E8C]">
                    Note: You are currently in Demo Sandbox mode. Publishing will persist locally in
                    your browser. Sign in to persist permanently to Supabase.
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <div className="mt-5 rounded-xl border border-[#B4432C]/35 bg-[#F9EAE6] p-3 text-xs font-medium text-[#B4432C]">
              {error}
            </div>
          )}

          {/* Wizard Navigation Footer */}
          <div className="paper-divider mt-8 flex items-center justify-between pt-5">
            <button
              type="button"
              onClick={prevStep}
              disabled={step === 1}
              className="paper-chip inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold text-[#181614] disabled:opacity-35"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Previous</span>
            </button>

            {step < 5 ? (
              <button
                type="button"
                onClick={nextStep}
                className="inline-flex items-center gap-2 rounded-full bg-[#181614] px-6 py-2.5 text-xs font-semibold text-[#FFFDF9] shadow-sm transition hover:bg-[#17663F]"
              >
                <span>Continue</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePublish}
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-full bg-[#17663F] px-7 py-3 text-xs font-semibold text-[#FFFDF9] shadow-sm transition hover:bg-[#135333] disabled:opacity-50"
              >
                <Sparkles className="h-4 w-4 text-[#D8F29B]" />
                <span>{submitting ? 'Preserving...' : 'Publish to the Graveyard'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
