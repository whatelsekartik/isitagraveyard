import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Activity,
  Archive,
  Bookmark,
  Check,
  GitPullRequest,
  Inbox,
  Plus,
  Sparkles,
  UserCheck,
  X,
  ArrowUpRight,
} from 'lucide-react';
import { useGraveyard } from '../context/GraveyardContext';
import { ProjectLogoMark } from '../components/glass-panels/ProjectLogoMark';
import { PageTransition, BlurReveal } from '../components/animations/MotionPrimitives';

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'buried', label: 'My Buried Projects' },
  { id: 'resurrections', label: 'My Resurrections' },
  { id: 'requests', label: 'Requests' },
  { id: 'activity', label: 'Activity' },
];

export default function DashboardPage() {
  const {
    isAuthenticated,
    currentUser,
    activeProfile,
    allProjects,
    bookmarks,
    requests,
    contributions,
    activities,
    reviewRequest,
    simulateIncomingDemoRequest,
    updateProjectStatus,
    updateContributionStatus,
    toggleBookmark,
    setAuthModalOpen,
  } = useGraveyard();

  const [activeTab, setActiveTab] = useState('overview');
  const [responseNotes, setResponseNotes] = useState({});

  const myBuriedProjects = useMemo(() => {
    return allProjects.filter((p) => {
      if (isAuthenticated && currentUser) {
        return p.creatorId === currentUser.id || p.isUserDemoSubmission;
      }
      return p.creatorId === activeProfile.id || p.isUserDemoSubmission;
    });
  }, [allProjects, isAuthenticated, currentUser, activeProfile.id]);

  const myBuriedIds = useMemo(() => new Set(myBuriedProjects.map((p) => p.id)), [myBuriedProjects]);

  const incomingRequests = useMemo(() => {
    return requests.filter(
      (r) => myBuriedIds.has(r.projectId) || (!isAuthenticated && r.isIncomingDemo)
    );
  }, [requests, myBuriedIds, isAuthenticated]);

  const outgoingRequests = useMemo(() => {
    return requests.filter((r) => !r.isIncomingDemo);
  }, [requests]);

  const myContributions = useMemo(() => {
    if (isAuthenticated && currentUser) {
      return contributions.filter(
        (c) => c.contributorId === currentUser.id || c.contributorId === activeProfile.id
      );
    }
    return contributions;
  }, [contributions, isAuthenticated, currentUser, activeProfile.id]);

  const bookmarkedProjects = useMemo(
    () => allProjects.filter((p) => bookmarks.includes(p.id)),
    [allProjects, bookmarks]
  );

  const successfulResurrections = useMemo(() => {
    const relatedIds = new Set([
      ...myBuriedProjects.map((p) => p.id),
      ...myContributions.map((c) => c.projectId),
    ]);
    return allProjects.filter(
      (p) => relatedIds.has(p.id) && p.completionStatus === 'Resurrected'
    );
  }, [allProjects, myBuriedProjects, myContributions]);

  const adoptedCount = myContributions.filter((c) => c.role.toLowerCase().includes('adopter')).length;
  const activeCollabCount = myContributions.filter((c) => c.status === 'active').length;

  return (
    <PageTransition className="pb-24 pt-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Header */}
        <BlurReveal className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-[#17663F]">
              Archival Ledger &amp; Command Desk
            </p>
            <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-[#181614] sm:text-5xl">
              {activeProfile.displayName}&apos;s{' '}
              <span className="marker-highlight italic font-normal text-[#17663F]">Archive.</span>
            </h1>
            <p className="mt-2 text-xs text-[#5E584E]">
              {isAuthenticated
                ? 'Synced with live Supabase PostgreSQL & Row Level Security.'
                : 'Demo Sandbox active (persisted locally in browser). Sign in anytime for live cloud persistence.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {!isAuthenticated && (
              <button
                type="button"
                onClick={() => setAuthModalOpen(true)}
                className="paper-chip rounded-full px-4 py-2 text-xs font-semibold text-[#1E4E8C]"
              >
                Connect Live Account
              </button>
            )}
            <Link
              to="/bury"
              className="inline-flex items-center gap-1.5 rounded-full bg-[#181614] px-5 py-2.5 text-xs font-semibold text-[#FFFDF9] shadow-sm transition hover:bg-[#17663F]"
            >
              <Plus className="h-3.5 w-3.5 text-[#D8F29B]" />
              <span>Bury New Project</span>
            </Link>
          </div>
        </BlurReveal>

        {/* Folder Tab Bar */}
        <div className="paper-sheet mt-8 flex flex-wrap gap-1.5 rounded-[4px] p-2">
          {TABS.map((tab) => {
            const active = activeTab === tab.id;
            const pendingCount =
              tab.id === 'requests'
                ? incomingRequests.filter((r) => r.status === 'pending').length
                : 0;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`relative inline-flex items-center gap-2 rounded-[3px] px-4 py-2 text-xs font-bold transition ${
                  active
                    ? 'text-[#FCF9F0]'
                    : 'text-[#5B5246] hover:bg-[#E4D7BE]/60 hover:text-[#1A1714]'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="dashboard-active-tab"
                    transition={{ type: 'spring', stiffness: 360, damping: 30 }}
                    className="absolute inset-0 rounded-[3px] bg-[#1A1714] shadow-sm"
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
                {pendingCount > 0 && (
                  <span
                    className={`relative z-10 rounded-[2px] px-1.5 py-0.5 font-mono text-[10px] ${
                      active ? 'bg-[#D7E5C8] text-[#1A1714]' : 'bg-[#DCE7CE] text-[#1D5B3A]'
                    }`}
                  >
                    {pendingCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="mt-8 space-y-8">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {[
                { label: 'Projects Buried', value: myBuriedProjects.length, icon: Archive, color: '#B4432C' },
                { label: 'Projects Adopted', value: adoptedCount, icon: UserCheck, color: '#1E4E8C' },
                { label: 'Requests Tracked', value: requests.length, icon: GitPullRequest, color: '#17663F' },
                { label: 'Active Collabs', value: activeCollabCount, icon: Activity, color: '#1E4E8C' },
                { label: 'Resurrections', value: successfulResurrections.length, icon: Sparkles, color: '#17663F' },
              ].map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="paper-sheet rounded-2xl p-5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#5E584E]">
                        {stat.label}
                      </span>
                      <Icon className="h-4 w-4" style={{ color: stat.color }} />
                    </div>
                    <p className="mt-3 font-display text-3xl font-bold text-[#181614]">
                      {stat.value}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="paper-sheet rounded-3xl p-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-lg font-semibold text-[#181614]">
                    Bookmarked Dossiers ({bookmarkedProjects.length})
                  </h2>
                  <Link
                    to="/explore"
                    className="font-mono text-xs font-semibold text-[#17663F] hover:underline"
                  >
                    Explore More
                  </Link>
                </div>

                {bookmarkedProjects.length === 0 ? (
                  <p className="mt-6 text-sm text-[#5E584E]">
                    No bookmarked projects yet. Save interesting architectures while scanning the
                    Graveyard Explorer.
                  </p>
                ) : (
                  <div className="mt-4 space-y-3">
                    {bookmarkedProjects.map((p) => (
                      <div
                        key={p.id}
                        className="paper-manila flex items-center justify-between gap-3 rounded-2xl p-3.5"
                      >
                        <div className="flex items-center gap-3">
                          <ProjectLogoMark
                            seed={p.logoSeed}
                            name={p.name}
                            size="sm"
                            status={p.completionStatus}
                          />
                          <div>
                            <Link
                              to={`/projects/${p.id}`}
                              className="text-sm font-semibold text-[#181614] hover:text-[#17663F]"
                            >
                              {p.name}
                            </Link>
                            <p className="text-xs text-[#5E584E]">
                              {p.completionStatus} · Readiness {p.revivalScore}/100
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleBookmark(p)}
                          aria-label={`Remove bookmark for ${p.name}`}
                          className="paper-chip flex h-8 w-8 items-center justify-center rounded-full text-[#17663F]"
                        >
                          <Bookmark className="h-3.5 w-3.5 fill-current" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="paper-sheet rounded-3xl p-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-lg font-semibold text-[#181614]">
                    Recent Activity
                  </h2>
                  <button
                    type="button"
                    onClick={() => setActiveTab('activity')}
                    className="font-mono text-xs font-semibold text-[#1E4E8C] hover:underline"
                  >
                    View All
                  </button>
                </div>

                {activities.length === 0 ? (
                  <p className="mt-6 text-sm text-[#5E584E]">No activity recorded yet.</p>
                ) : (
                  <div className="mt-4 space-y-3">
                    {activities.slice(0, 4).map((act) => (
                      <div
                        key={act.id}
                        className="rounded-2xl border border-[#181614]/10 bg-[#FAF7F0] p-3.5"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#17663F]">
                            {act.eventType}
                          </span>
                          <span className="font-mono text-[10px] text-[#5E584E]">
                            {new Date(act.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-[#181614]">{act.summary}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* MY BURIED PROJECTS TAB */}
        {activeTab === 'buried' && (
          <div className="mt-8">
            {myBuriedProjects.length === 0 ? (
              <div className="paper-sheet rounded-3xl p-12 text-center">
                <Archive className="mx-auto h-10 w-10 text-[#B4432C]" />
                <h2 className="mt-4 font-display text-xl font-semibold text-[#181614]">
                  You haven&apos;t buried any projects yet.
                </h2>
                <p className="mt-2 text-sm text-[#5E584E]">
                  Preserve an unfinished repository and let developers inspect its technical autopsy.
                </p>
                <Link
                  to="/bury"
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#181614] px-6 py-3 text-xs font-semibold text-[#FFFDF9]"
                >
                  <Plus className="h-4 w-4 text-[#D8F29B]" />
                  Bury Your First Project
                </Link>
              </div>
            ) : (
              <div className="grid gap-5 md:grid-cols-2">
                {myBuriedProjects.map((project) => {
                  const reqCount = requests.filter(
                    (r) => r.projectId === project.id && r.status === 'pending'
                  ).length;

                  return (
                    <div key={project.id} className="paper-dossier rounded-3xl p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3.5">
                          <ProjectLogoMark
                            seed={project.logoSeed}
                            logoUrl={project.logoUrl}
                            name={project.name}
                            status={project.completionStatus}
                          />
                          <div>
                            <h3 className="font-display text-xl font-semibold text-[#181614]">
                              {project.name}
                            </h3>
                            <p className="text-xs text-[#5E584E]">
                              {project.completionStatus} · {reqCount} pending request
                              {reqCount === 1 ? '' : 's'}
                            </p>
                          </div>
                        </div>

                        <Link
                          to={`/projects/${project.id}`}
                          className="paper-chip inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold text-[#181614]"
                        >
                          <span>Inspect</span>
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>

                      <p className="mt-4 text-xs leading-relaxed text-[#5E584E]">
                        {project.tagline || project.description}
                      </p>

                      <div className="paper-divider mt-5 flex flex-wrap items-center gap-2 pt-4">
                        {project.completionStatus !== 'Resurrected' && (
                          <button
                            type="button"
                            onClick={() => updateProjectStatus(project, 'Resurrected')}
                            className="rounded-xl bg-[#17663F] px-3.5 py-2 text-xs font-semibold text-[#FFFDF9]"
                          >
                            Mark Resurrected
                          </button>
                        )}
                        {!isAuthenticated && (
                          <button
                            type="button"
                            onClick={() => simulateIncomingDemoRequest(project)}
                            className="paper-chip rounded-xl px-3.5 py-2 text-xs font-semibold text-[#1E4E8C]"
                          >
                            Simulate Incoming Request (Demo)
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* MY RESURRECTIONS TAB */}
        {activeTab === 'resurrections' && (
          <div className="mt-8 space-y-6">
            {myContributions.length === 0 ? (
              <div className="paper-sheet rounded-3xl p-12 text-center">
                <Sparkles className="mx-auto h-10 w-10 text-[#17663F]" />
                <h2 className="mt-4 font-display text-xl font-semibold text-[#181614]">
                  No active resurrections yet.
                </h2>
                <p className="mt-2 text-sm text-[#5E584E]">
                  Explore the archive and request to contribute or adopt a project.
                </p>
                <Link
                  to="/explore"
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#181614] px-6 py-3 text-xs font-semibold text-[#FFFDF9]"
                >
                  Explore Graveyard
                </Link>
              </div>
            ) : (
              <div className="grid gap-5 md:grid-cols-2">
                {myContributions.map((contrib) => (
                  <div key={contrib.id} className="paper-dossier rounded-3xl p-6">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#17663F]">
                          {contrib.role}
                        </span>
                        <h3 className="mt-1 font-display text-xl font-semibold text-[#181614]">
                          <Link
                            to={`/projects/${contrib.projectId}`}
                            className="hover:text-[#17663F]"
                          >
                            {contrib.projectName}
                          </Link>
                        </h3>
                        <p className="mt-1 text-xs text-[#5E584E]">
                          Started {new Date(contrib.startedAt).toLocaleDateString()}
                        </p>
                      </div>

                      <select
                        value={contrib.status}
                        onChange={(e) => updateContributionStatus(contrib, e.target.value)}
                        aria-label={`Collaboration status for ${contrib.projectName}`}
                        className="paper-input rounded-xl px-3 py-1.5 text-xs font-semibold"
                      >
                        <option value="active">Active</option>
                        <option value="paused">Paused</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* REQUESTS TAB */}
        {activeTab === 'requests' && (
          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            {/* Incoming Creator Approval Queue */}
            <div className="paper-sheet rounded-3xl p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Inbox className="h-4 w-4 text-[#17663F]" />
                  <h2 className="font-display text-lg font-semibold text-[#181614]">
                    Incoming Approval Queue
                  </h2>
                </div>
                {!isAuthenticated && (
                  <span className="font-mono text-[10px] font-semibold text-[#1E4E8C]">
                    Demo Creator Sandbox
                  </span>
                )}
              </div>

              {incomingRequests.length === 0 ? (
                <p className="mt-6 text-sm text-[#5E584E]">
                  No incoming requests for your buried projects right now.
                </p>
              ) : (
                <div className="mt-5 space-y-4">
                  {incomingRequests.map((req) => (
                    <div
                      key={req.id}
                      className="rounded-2xl border border-[#181614]/12 bg-[#FAF7F0] p-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold text-[#181614]">
                            {req.requesterName}{' '}
                            <span className="font-normal text-[#5E584E]">
                              wants to {req.requestType}
                            </span>{' '}
                            <Link
                              to={`/projects/${req.projectId}`}
                              className="text-[#17663F] hover:underline"
                            >
                              {req.projectName}
                            </Link>
                          </p>
                          <p className="mt-0.5 font-mono text-[11px] text-[#5E584E]">
                            {req.availability} · {(req.skills || []).slice(0, 4).join(', ')}
                          </p>
                        </div>

                        <span
                          className={`paper-stamp rounded px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase ${
                            req.status === 'accepted'
                              ? 'border-[#17663F] bg-[#EAF5DC] text-[#17663F]'
                              : req.status === 'declined'
                                ? 'border-[#B4432C] bg-[#F9EAE6] text-[#B4432C]'
                                : 'border-[#1E4E8C] bg-[#E8EEF5] text-[#1E4E8C]'
                          }`}
                        >
                          {req.status}
                        </span>
                      </div>

                      <p className="mt-3 text-xs leading-relaxed text-[#181614]">
                        &ldquo;{req.message}&rdquo;
                      </p>

                      {req.status === 'pending' && (
                        <div className="paper-divider mt-4 space-y-2.5 pt-3">
                          <input
                            type="text"
                            value={responseNotes[req.id] || ''}
                            onChange={(e) =>
                              setResponseNotes((prev) => ({ ...prev, [req.id]: e.target.value }))
                            }
                            placeholder="Optional onboarding note..."
                            className="paper-input w-full rounded-xl px-3 py-2 text-xs"
                          />
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                reviewRequest(req, 'accepted', responseNotes[req.id] || '')
                              }
                              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#17663F] px-3 py-2 text-xs font-semibold text-[#FFFDF9]"
                            >
                              <Check className="h-3.5 w-3.5" />
                              Accept
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                reviewRequest(req, 'declined', responseNotes[req.id] || '')
                              }
                              className="paper-chip inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-[#5E584E] hover:text-[#B4432C]"
                            >
                              <X className="h-3.5 w-3.5" />
                              Decline
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Outgoing Sent Requests */}
            <div className="paper-sheet rounded-3xl p-6">
              <div className="flex items-center gap-2">
                <GitPullRequest className="h-4 w-4 text-[#1E4E8C]" />
                <h2 className="font-display text-lg font-semibold text-[#181614]">
                  Your Sent Requests
                </h2>
              </div>

              {outgoingRequests.length === 0 ? (
                <p className="mt-6 text-sm text-[#5E584E]">
                  You haven&apos;t sent any contribution or adoption requests yet.
                </p>
              ) : (
                <div className="mt-5 space-y-4">
                  {outgoingRequests.map((req) => (
                    <div
                      key={req.id}
                      className="rounded-2xl border border-[#181614]/12 bg-[#FAF7F0] p-4"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <Link
                          to={`/projects/${req.projectId}`}
                          className="text-sm font-semibold text-[#181614] hover:text-[#17663F]"
                        >
                          {req.projectName}
                        </Link>
                        <span
                          className={`paper-stamp rounded px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase ${
                            req.status === 'accepted'
                              ? 'border-[#17663F] bg-[#EAF5DC] text-[#17663F]'
                              : req.status === 'declined'
                                ? 'border-[#B4432C] bg-[#F9EAE6] text-[#B4432C]'
                                : 'border-[#1E4E8C] bg-[#E8EEF5] text-[#1E4E8C]'
                          }`}
                        >
                          {req.status}
                        </span>
                      </div>
                      <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-[#5E584E]">
                        Type: {req.requestType} · {new Date(req.createdAt).toLocaleDateString()}
                      </p>
                      <p className="mt-2 text-xs text-[#181614]">{req.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ACTIVITY TAB */}
        {activeTab === 'activity' && (
          <div className="paper-sheet mt-8 rounded-3xl p-6">
            <h2 className="font-display text-xl font-semibold text-[#181614]">
              Archive Activity Ledger
            </h2>
            {activities.length === 0 ? (
              <p className="mt-6 text-sm text-[#5E584E]">
                No events logged yet. Bookmark, bury, or request access to a project to populate your
                timeline.
              </p>
            ) : (
              <div className="mt-6 space-y-3">
                {activities.map((act) => (
                  <div
                    key={act.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#181614]/10 bg-[#FAF7F0] px-4 py-3.5"
                  >
                    <div>
                      <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#17663F]">
                        {act.eventType}
                      </span>
                      <p className="mt-0.5 text-sm text-[#181614]">{act.summary}</p>
                    </div>
                    <span className="font-mono text-[11px] text-[#5E584E]">
                      {new Date(act.createdAt).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </PageTransition>
  );
}
