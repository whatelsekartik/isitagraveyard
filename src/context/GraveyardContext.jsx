import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { SEED_PROJECTS, SEED_RESURRECTIONS } from '../data/seedProjects';
import { calculateRevivalBreakdown } from '../lib/revivalScore';

const GraveyardContext = createContext(null);

const LOCAL_STORAGE_KEY = 'project_graveyard_demo_state_v1';

const DEFAULT_DEMO_PROFILE = {
  id: 'demo-explorer',
  username: 'explorer_guest',
  displayName: 'Guest Explorer',
  bio: 'Inspecting forgotten architectures and looking for promising codebases to revive.',
  skills: ['React', 'TypeScript', 'PostgreSQL', 'Node.js', 'Tailwind CSS'],
  languages: ['JavaScript', 'TypeScript', 'Python', 'SQL'],
  frameworks: ['React', 'Next.js', 'Vite', 'FastAPI'],
  interests: ['Developer Tools', 'Education', 'Climate & Mobility', 'Open Infrastructure'],
  experienceLevel: 'Intermediate',
  availability: '5-10 hrs/week',
};

const INITIAL_DEMO_STATE = {
  profile: DEFAULT_DEMO_PROFILE,
  customProjects: [],
  bookmarks: ['demo-campus-os'],
  requests: [
    {
      id: 'demo-req-incoming-1',
      projectId: 'demo-campus-os',
      projectName: 'CampusOS',
      requesterId: 'demo-dev-aria',
      requesterName: 'Aria Chen',
      requestType: 'contribute',
      message: 'I implemented OIDC adapters for two university portals last year and can build the pluggable auth layer for CampusOS.',
      skills: ['TypeScript', 'React', 'OAuth / SAML', 'PostgreSQL'],
      availability: '8 hrs/week',
      status: 'pending',
      creatorResponse: '',
      isIncomingDemo: true,
      createdAt: '2026-11-18T14:20:00Z',
    },
  ],
  contributions: [
    {
      id: 'demo-contrib-1',
      projectId: 'demo-dev-vault',
      projectName: 'DevVault',
      contributorId: 'demo-explorer',
      contributorName: 'Guest Explorer',
      role: 'CRDT Attachment Contributor',
      status: 'active',
      startedAt: '2026-11-10T09:00:00Z',
    },
  ],
  activities: [
    {
      id: 'demo-act-1',
      projectId: 'demo-campus-os',
      projectName: 'CampusOS',
      eventType: 'Project bookmarked',
      summary: 'Saved CampusOS to your resurrection watchlist (Demo Sandbox).',
      createdAt: '2026-11-17T18:10:00Z',
    },
    {
      id: 'demo-act-2',
      projectId: 'demo-dev-vault',
      projectName: 'DevVault',
      eventType: 'Request accepted',
      summary: 'Joined DevVault revival squad as CRDT Attachment Contributor (Demo Sandbox).',
      createdAt: '2026-11-10T09:05:00Z',
    },
  ],
  demoProjectStatuses: {},
};

function loadDemoState() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return INITIAL_DEMO_STATE;
    const parsed = JSON.parse(raw);
    return {
      ...INITIAL_DEMO_STATE,
      ...parsed,
      profile: { ...DEFAULT_DEMO_PROFILE, ...(parsed.profile || {}) },
    };
  } catch {
    return INITIAL_DEMO_STATE;
  }
}

function mapDbProject(row) {
  return {
    id: row.id,
    slug: row.slug,
    isDemo: Boolean(row.is_demo),
    creatorId: row.creator_id,
    creatorName: row.creator_name,
    name: row.name,
    tagline: row.tagline || '',
    description: row.description,
    category: row.category,
    logoSeed: row.logo_seed || 'monolith',
    logoUrl: row.logo_url || '',
    repositoryUrl: row.repository_url || '',
    demoUrl: row.demo_url || '',
    docsUrl: row.docs_url || '',
    repoVisibility: row.repo_visibility || 'public',
    technologies: row.technologies || {
      languages: [],
      frameworks: [],
      libraries: [],
      backend: [],
      database: [],
      deployment: [],
    },
    techTags: row.tech_tags || [],
    requiredSkills: row.required_skills || [],
    difficulty: row.difficulty || 'Intermediate',
    completionPercentage: row.completion_percentage ?? 45,
    completionStatus: row.completion_status || 'Awaiting Resurrection',
    abandonmentReason: row.abandonment_reason,
    existingFeatures: row.existing_features || [],
    unfinishedFeatures: row.unfinished_features || [],
    blockers: row.blockers || [],
    missingDependencies: row.missing_dependencies || [],
    knownIssues: row.known_issues || [],
    suggestedNextSteps: row.suggested_next_steps || [],
    documentationQuality: row.documentation_quality ?? 60,
    setupCompleteness: row.setup_completeness ?? 55,
    creatorAvailability: row.creator_availability || 'Advisory',
    acceptContributions: row.accept_contributions ?? true,
    allowAdoption: row.allow_adoption ?? true,
    collaborationModel: row.collaboration_model || 'Co-maintainership',
    contactPreference: row.contact_preference || 'Platform Requests',
    revivalScore: row.revival_score ?? 70,
    interestedCount: 0,
    githubMeta: row.github_meta || {},
    createdAt: row.created_at,
    abandonedAt: row.abandoned_at,
    publishedAt: row.published_at,
    resurrectedAt: row.resurrected_at,
  };
}

export function GraveyardProvider({ children }) {
  const [demoState, setDemoState] = useState(loadDemoState);
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(isSupabaseConfigured);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const [liveProjects, setLiveProjects] = useState([]);
  const [liveProfile, setLiveProfile] = useState(null);
  const [liveBookmarks, setLiveBookmarks] = useState([]);
  const [liveRequests, setLiveRequests] = useState([]);
  const [liveContributions, setLiveContributions] = useState([]);
  const [liveActivities, setLiveActivities] = useState([]);
  const [supabaseStatus, setSupabaseStatus] = useState(
    isSupabaseConfigured ? 'connecting' : 'unavailable'
  );
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, tone = 'acid') => {
    const id = Date.now();
    setToast({ id, message, tone });
    setTimeout(() => {
      setToast((prev) => (prev?.id === id ? null : prev));
    }, 4200);
  }, []);

  // Persist demo state locally
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(demoState));
    } catch {
      // Ignore storage quota errors
    }
  }, [demoState]);

  const fetchLiveData = useCallback(async (currentUser) => {
    if (!supabase) return;
    try {
      const { data: projData, error: projErr } = await supabase
        .from('projects')
        .select('*')
        .order('published_at', { ascending: false });

      if (projErr) throw projErr;
      setLiveProjects((projData || []).map(mapDbProject));
      setSupabaseStatus('connected');

      if (currentUser) {
        const [profRes, bmRes, reqRes, contribRes, actRes] = await Promise.all([
          supabase.from('profiles').select('*').eq('id', currentUser.id).maybeSingle(),
          supabase.from('bookmarks').select('project_id').eq('user_id', currentUser.id),
          supabase.from('requests').select('*').order('created_at', { ascending: false }),
          supabase.from('contributions').select('*').order('started_at', { ascending: false }),
          supabase
            .from('activity_logs')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(40),
        ]);

        if (profRes.data) {
          setLiveProfile({
            id: profRes.data.id,
            username: profRes.data.username,
            displayName: profRes.data.display_name,
            bio: profRes.data.bio || '',
            skills: profRes.data.skills || [],
            languages: profRes.data.languages || [],
            frameworks: profRes.data.frameworks || [],
            interests: profRes.data.interests || [],
            experienceLevel: profRes.data.experience_level || 'Intermediate',
            availability: profRes.data.availability || '5-10 hrs/week',
          });
        }
        setLiveBookmarks((bmRes.data || []).map((b) => b.project_id));
        setLiveRequests(
          (reqRes.data || []).map((r) => ({
            id: r.id,
            projectId: r.project_id,
            requesterId: r.requester_id,
            requesterName: r.requester_name,
            requestType: r.request_type,
            message: r.message,
            skills: r.skills || [],
            availability: r.availability,
            status: r.status,
            creatorResponse: r.creator_response || '',
            createdAt: r.created_at,
          }))
        );
        setLiveContributions(
          (contribRes.data || []).map((c) => ({
            id: c.id,
            projectId: c.project_id,
            contributorId: c.contributor_id,
            contributorName: c.contributor_name,
            role: c.role,
            status: c.status,
            startedAt: c.started_at,
          }))
        );
        setLiveActivities(
          (actRes.data || []).map((a) => ({
            id: a.id,
            projectId: a.project_id,
            projectName: a.project_name,
            eventType: a.event_type,
            summary: a.summary,
            createdAt: a.created_at,
          }))
        );
      } else {
        setLiveProfile(null);
        setLiveBookmarks([]);
        setLiveRequests([]);
        setLiveContributions([]);
        setLiveActivities([]);
      }
    } catch {
      setSupabaseStatus('fallback');
    }
  }, []);

  useEffect(() => {
    if (!supabase) {
      setAuthLoading(false);
      return;
    }

    let mounted = true;
    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!mounted) return;
        const currentSession = data?.session || null;
        setSession(currentSession);
        setAuthLoading(false);
        fetchLiveData(currentSession?.user || null);
      })
      .catch(() => {
        if (!mounted) return;
        setAuthLoading(false);
        setSupabaseStatus('fallback');
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      fetchLiveData(nextSession?.user || null);
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, [fetchLiveData]);

  const isAuthenticated = Boolean(session?.user);
  const currentUser = session?.user || null;

  const activeProfile = useMemo(() => {
    if (isAuthenticated && liveProfile) return liveProfile;
    if (isAuthenticated && currentUser) {
      return {
        ...DEFAULT_DEMO_PROFILE,
        id: currentUser.id,
        username: currentUser.email?.split('@')[0] || 'member',
        displayName:
          currentUser.user_metadata?.display_name ||
          currentUser.email?.split('@')[0] ||
          'Member',
      };
    }
    return demoState.profile;
  }, [isAuthenticated, liveProfile, currentUser, demoState.profile]);

  // Combine live Supabase projects + local demo custom projects + illustrative seeded projects
  const allProjects = useMemo(() => {
    const seededCombined = [...SEED_PROJECTS, ...SEED_RESURRECTIONS].map((proj) => {
      const override = demoState.demoProjectStatuses?.[proj.id];
      if (!override) return proj;
      return {
        ...proj,
        completionStatus: override.completionStatus || proj.completionStatus,
        resurrectedAt: override.resurrectedAt ?? proj.resurrectedAt,
        completionPercentage:
          override.completionStatus === 'Resurrected' ? 100 : proj.completionPercentage,
      };
    });

    const customDemoProjects = (demoState.customProjects || []).map((proj) => {
      const override = demoState.demoProjectStatuses?.[proj.id];
      return override ? { ...proj, ...override } : proj;
    });

    const merged = [...liveProjects, ...customDemoProjects, ...seededCombined];
    const seen = new Set();
    return merged.filter((p) => {
      if (seen.has(p.id)) return false;
      seen.add(p.id);
      return true;
    });
  }, [liveProjects, demoState.customProjects, demoState.demoProjectStatuses]);

  const bookmarks = useMemo(() => {
    const combined = new Set([...(demoState.bookmarks || []), ...liveBookmarks]);
    return Array.from(combined);
  }, [demoState.bookmarks, liveBookmarks]);

  const requests = useMemo(() => {
    const projectMap = new Map(allProjects.map((p) => [p.id, p]));
    const merged = [...liveRequests, ...(demoState.requests || [])];
    return merged.map((r) => ({
      ...r,
      projectName: r.projectName || projectMap.get(r.projectId)?.name || 'Unknown Project',
    }));
  }, [liveRequests, demoState.requests, allProjects]);

  const contributions = useMemo(() => {
    const projectMap = new Map(allProjects.map((p) => [p.id, p]));
    const merged = [...liveContributions, ...(demoState.contributions || [])];
    return merged.map((c) => ({
      ...c,
      projectName: c.projectName || projectMap.get(c.projectId)?.name || 'Unknown Project',
    }));
  }, [liveContributions, demoState.contributions, allProjects]);

  const activities = useMemo(() => {
    return [...liveActivities, ...(demoState.activities || [])].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }, [liveActivities, demoState.activities]);

  // Auth Actions
  const signIn = async (email, password) => {
    if (!supabase) return { error: 'Supabase is not configured in this environment.' };
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    showToast('Signed in to Project Graveyard.');
    setAuthModalOpen(false);
    return { error: null };
  };

  const signUp = async (email, password, displayName) => {
    if (!supabase) return { error: 'Supabase is not configured in this environment.' };
    const cleanName = displayName?.trim() || email.split('@')[0];
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: cleanName,
          username: cleanName.toLowerCase().replace(/[^a-z0-9_]/g, '_') + '_' + Math.floor(100 + Math.random() * 900),
        },
      },
    });
    if (error) return { error: error.message };
    if (data?.user && !data.session) {
      return { error: 'Account created! Please confirm your email if required by auth settings.' };
    }
    showToast('Account created. Welcome to the Graveyard.');
    setAuthModalOpen(false);
    return { error: null };
  };

  const signOut = async () => {
    if (supabase) await supabase.auth.signOut();
    setSession(null);
    showToast('Signed out. Switched to Guest Demo Sandbox.', 'cyan');
  };

  // Profile Skill Matcher Update
  const updateProfile = async (updates) => {
    if (isAuthenticated && supabase && currentUser) {
      const payload = {
        id: currentUser.id,
        display_name: updates.displayName ?? activeProfile.displayName,
        bio: updates.bio ?? activeProfile.bio,
        skills: updates.skills ?? activeProfile.skills,
        languages: updates.languages ?? activeProfile.languages,
        frameworks: updates.frameworks ?? activeProfile.frameworks,
        interests: updates.interests ?? activeProfile.interests,
        experience_level: updates.experienceLevel ?? activeProfile.experienceLevel,
        availability: updates.availability ?? activeProfile.availability,
        updated_at: new Date().toISOString(),
      };
      const { error } = await supabase.from('profiles').upsert(payload);
      if (!error) {
        setLiveProfile((prev) => ({ ...(prev || activeProfile), ...updates }));
        showToast('Developer skill profile saved to Supabase.');
        return { ok: true };
      }
    }

    setDemoState((prev) => ({
      ...prev,
      profile: { ...prev.profile, ...updates },
    }));
    showToast('Skill matcher profile updated locally.');
    return { ok: true };
  };

  const logDemoActivity = (projectId, projectName, eventType, summary) => {
    setDemoState((prev) => ({
      ...prev,
      activities: [
        {
          id: `demo-act-${Date.now()}`,
          projectId,
          projectName,
          eventType,
          summary,
          createdAt: new Date().toISOString(),
        },
        ...(prev.activities || []),
      ],
    }));
  };

  // Bury a project
  const buryProject = async (formData) => {
    const scoreBreakdown = calculateRevivalBreakdown(formData);
    const nowIso = new Date().toISOString();
    const techTags = Array.from(
      new Set([
        ...(formData.technologies?.languages || []),
        ...(formData.technologies?.frameworks || []),
        ...(formData.technologies?.database || []),
        ...(formData.requiredSkills || []),
      ])
    ).slice(0, 8);

    if (isAuthenticated && supabase && currentUser) {
      const slug =
        formData.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '') +
        '-' +
        Math.random().toString(36).slice(2, 6);

      const dbPayload = {
        creator_id: currentUser.id,
        creator_name: activeProfile.displayName || 'Developer',
        slug,
        name: formData.name.trim(),
        tagline: formData.tagline?.trim() || '',
        description: formData.description.trim(),
        category: formData.category,
        logo_seed: formData.logoSeed || 'monolith',
        logo_url: formData.logoUrl || null,
        repository_url: formData.repositoryUrl || null,
        demo_url: formData.demoUrl || null,
        docs_url: formData.docsUrl || null,
        repo_visibility: formData.repoVisibility || 'public',
        technologies: formData.technologies || {},
        tech_tags: techTags,
        required_skills: formData.requiredSkills || [],
        difficulty: formData.difficulty || 'Intermediate',
        completion_percentage: Number(formData.completionPercentage || 45),
        completion_status: 'Awaiting Resurrection',
        abandonment_reason: formData.abandonmentReason,
        existing_features: formData.existingFeatures || [],
        unfinished_features: formData.unfinishedFeatures || [],
        blockers: formData.blockers || [],
        missing_dependencies: formData.missingDependencies || [],
        known_issues: formData.knownIssues || [],
        suggested_next_steps: formData.suggestedNextSteps || [],
        documentation_quality: Number(formData.documentationQuality || 65),
        setup_completeness: Number(formData.setupCompleteness || 60),
        creator_availability: formData.creatorAvailability || 'Advisory',
        accept_contributions: Boolean(formData.acceptContributions),
        allow_adoption: Boolean(formData.allowAdoption),
        collaboration_model: formData.collaborationModel || 'Co-maintainership',
        contact_preference: formData.contactPreference || 'Platform Requests',
        revival_score: scoreBreakdown.total,
        github_meta: formData.githubMeta || {},
        is_demo: false,
        abandoned_at: formData.abandonedAt || nowIso,
        published_at: nowIso,
      };

      const { data, error } = await supabase.from('projects').insert(dbPayload).select().single();
      if (!error && data) {
        await supabase.from('activity_logs').insert({
          user_id: currentUser.id,
          project_id: data.id,
          project_name: data.name,
          event_type: 'Project submitted',
          summary: `Buried ${data.name} in Project Graveyard.`,
        });
        const mapped = mapDbProject(data);
        setLiveProjects((prev) => [mapped, ...prev]);
        fetchLiveData(currentUser);
        showToast(`${mapped.name} buried & preserved in Supabase.`);
        return { project: mapped, persistedTo: 'supabase' };
      }
    }

    // Demo Sandbox local persistence
    const localProject = {
      id: `local-${Date.now()}`,
      slug: formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      isDemo: true,
      isUserDemoSubmission: true,
      creatorId: activeProfile.id,
      creatorName: activeProfile.displayName,
      name: formData.name.trim(),
      tagline: formData.tagline?.trim() || '',
      description: formData.description.trim(),
      category: formData.category,
      logoSeed: formData.logoSeed || 'monolith',
      logoUrl: formData.logoUrl || '',
      repositoryUrl: formData.repositoryUrl || '',
      demoUrl: formData.demoUrl || '',
      docsUrl: formData.docsUrl || '',
      repoVisibility: formData.repoVisibility || 'public',
      technologies: formData.technologies || {},
      techTags,
      requiredSkills: formData.requiredSkills || [],
      difficulty: formData.difficulty || 'Intermediate',
      completionPercentage: Number(formData.completionPercentage || 45),
      completionStatus: 'Awaiting Resurrection',
      abandonmentReason: formData.abandonmentReason,
      existingFeatures: formData.existingFeatures || [],
      unfinishedFeatures: formData.unfinishedFeatures || [],
      blockers: formData.blockers || [],
      missingDependencies: formData.missingDependencies || [],
      knownIssues: formData.knownIssues || [],
      suggestedNextSteps: formData.suggestedNextSteps || [],
      documentationQuality: Number(formData.documentationQuality || 65),
      setupCompleteness: Number(formData.setupCompleteness || 60),
      creatorAvailability: formData.creatorAvailability || 'Advisory',
      acceptContributions: Boolean(formData.acceptContributions),
      allowAdoption: Boolean(formData.allowAdoption),
      collaborationModel: formData.collaborationModel || 'Co-maintainership',
      contactPreference: formData.contactPreference || 'Platform Requests',
      revivalScore: scoreBreakdown.total,
      interestedCount: 1,
      githubMeta: formData.githubMeta || {},
      createdAt: formData.createdAt || nowIso,
      lastCommitAt: formData.githubMeta?.lastUpdated || null,
      abandonedAt: formData.abandonedAt || nowIso,
      publishedAt: nowIso,
      resurrectedAt: null,
    };

    setDemoState((prev) => ({
      ...prev,
      customProjects: [localProject, ...(prev.customProjects || [])],
      activities: [
        {
          id: `demo-act-${Date.now()}`,
          projectId: localProject.id,
          projectName: localProject.name,
          eventType: 'Project submitted',
          summary: `Buried ${localProject.name} in local Demo Sandbox.`,
          createdAt: nowIso,
        },
        ...(prev.activities || []),
      ],
    }));

    showToast(`${localProject.name} preserved in Demo Sandbox (local persistence).`);
    return { project: localProject, persistedTo: 'demo' };
  };

  // Toggle Bookmark
  const toggleBookmark = async (project) => {
    const isBookmarked = bookmarks.includes(project.id);
    const isLiveUuid = !project.id.startsWith('demo-') && !project.id.startsWith('local-');

    if (isAuthenticated && supabase && currentUser && isLiveUuid) {
      if (isBookmarked) {
        await supabase
          .from('bookmarks')
          .delete()
          .eq('user_id', currentUser.id)
          .eq('project_id', project.id);
        setLiveBookmarks((prev) => prev.filter((id) => id !== project.id));
        showToast(`Removed ${project.name} from bookmarks.`, 'cyan');
      } else {
        await supabase.from('bookmarks').insert({
          user_id: currentUser.id,
          project_id: project.id,
        });
        await supabase.from('activity_logs').insert({
          user_id: currentUser.id,
          project_id: project.id,
          project_name: project.name,
          event_type: 'Project bookmarked',
          summary: `Bookmarked ${project.name}.`,
        });
        setLiveBookmarks((prev) => [...prev, project.id]);
        fetchLiveData(currentUser);
        showToast(`Bookmarked ${project.name}.`);
      }
      return;
    }

    setDemoState((prev) => {
      const next = isBookmarked
        ? (prev.bookmarks || []).filter((id) => id !== project.id)
        : [...(prev.bookmarks || []), project.id];
      return {
        ...prev,
        bookmarks: next,
        activities: [
          {
            id: `demo-act-${Date.now()}`,
            projectId: project.id,
            projectName: project.name,
            eventType: isBookmarked ? 'Bookmark removed' : 'Project bookmarked',
            summary: `${isBookmarked ? 'Removed bookmark for' : 'Bookmarked'} ${project.name} (Demo Sandbox).`,
            createdAt: new Date().toISOString(),
          },
          ...(prev.activities || []),
        ],
      };
    });
    showToast(
      isBookmarked ? `Removed ${project.name} from bookmarks.` : `Bookmarked ${project.name}.`,
      isBookmarked ? 'cyan' : 'acid'
    );
  };

  // Submit Request to Contribute or Adopt
  const submitRequest = async (project, { requestType, message, skills, availability }) => {
    if (requestType === 'contribute' && !project.acceptContributions) {
      return { error: 'This project is not accepting contribution requests.' };
    }
    if (requestType === 'adopt' && !project.allowAdoption) {
      return { error: 'The original creator has disabled full adoption requests.' };
    }

    const isLiveUuid = !project.id.startsWith('demo-') && !project.id.startsWith('local-');
    if (isAuthenticated && supabase && currentUser && isLiveUuid) {
      const { data, error } = await supabase
        .from('requests')
        .insert({
          project_id: project.id,
          requester_id: currentUser.id,
          requester_name: activeProfile.displayName,
          request_type: requestType,
          message: message.trim(),
          skills: skills || activeProfile.skills || [],
          availability: availability || activeProfile.availability,
          status: 'pending',
        })
        .select()
        .single();

      if (error) return { error: error.message };

      await supabase.from('activity_logs').insert({
        user_id: currentUser.id,
        project_id: project.id,
        project_name: project.name,
        event_type: 'Contributor request sent',
        summary: `Requested to ${requestType} on ${project.name}.`,
      });
      await fetchLiveData(currentUser);
      showToast(`Your ${requestType} request for ${project.name} was sent.`);
      return { error: null, request: data };
    }

    const newReq = {
      id: `demo-req-${Date.now()}`,
      projectId: project.id,
      projectName: project.name,
      requesterId: activeProfile.id,
      requesterName: activeProfile.displayName,
      requestType,
      message: message.trim(),
      skills: skills || activeProfile.skills || [],
      availability: availability || activeProfile.availability,
      status: 'pending',
      creatorResponse: '',
      createdAt: new Date().toISOString(),
    };

    setDemoState((prev) => ({
      ...prev,
      requests: [newReq, ...(prev.requests || [])],
      activities: [
        {
          id: `demo-act-${Date.now()}`,
          projectId: project.id,
          projectName: project.name,
          eventType: 'Contributor request sent',
          summary: `Submitted ${requestType} request for ${project.name} (Demo Sandbox).`,
          createdAt: new Date().toISOString(),
        },
        ...(prev.activities || []),
      ],
    }));

    showToast(`Request to ${requestType} saved in Demo Sandbox.`);
    return { error: null, request: newReq };
  };

  // Review incoming request (Accept / Decline)
  const reviewRequest = async (request, decision, creatorResponse = '') => {
    const isLiveUuid = !request.id.startsWith('demo-');
    if (isAuthenticated && supabase && currentUser && isLiveUuid) {
      const { error } = await supabase
        .from('requests')
        .update({
          status: decision,
          creator_response: creatorResponse,
          updated_at: new Date().toISOString(),
        })
        .eq('id', request.id);
      if (error) return { error: error.message };

      if (decision === 'accepted') {
        await supabase.from('contributions').insert({
          project_id: request.projectId,
          contributor_id: request.requesterId,
          contributor_name: request.requesterName,
          role: request.requestType === 'adopt' ? 'Steward / Adopter' : 'Contributor',
          status: 'active',
        });
        await supabase
          .from('projects')
          .update({ completion_status: 'In Revival' })
          .eq('id', request.projectId)
          .eq('completion_status', 'Awaiting Resurrection');
      }

      await supabase.from('activity_logs').insert({
        user_id: currentUser.id,
        project_id: request.projectId,
        project_name: request.projectName,
        event_type: decision === 'accepted' ? 'Request accepted' : 'Request declined',
        summary: `${decision === 'accepted' ? 'Accepted' : 'Declined'} ${request.requesterName}'s ${request.requestType} request on ${request.projectName}.`,
      });

      await fetchLiveData(currentUser);
      showToast(
        decision === 'accepted'
          ? `Accepted ${request.requesterName} onto ${request.projectName}!`
          : `Declined request from ${request.requesterName}.`,
        decision === 'accepted' ? 'acid' : 'cyan'
      );
      return { error: null };
    }

    // Demo state update
    setDemoState((prev) => {
      const updatedReqs = (prev.requests || []).map((r) =>
        r.id === request.id ? { ...r, status: decision, creatorResponse } : r
      );
      const nextContribs =
        decision === 'accepted'
          ? [
              {
                id: `demo-contrib-${Date.now()}`,
                projectId: request.projectId,
                projectName: request.projectName,
                contributorId: request.requesterId,
                contributorName: request.requesterName,
                role: request.requestType === 'adopt' ? 'Steward / Adopter' : 'Contributor',
                status: 'active',
                startedAt: new Date().toISOString(),
              },
              ...(prev.contributions || []),
            ]
          : prev.contributions || [];

      const nextStatuses = { ...(prev.demoProjectStatuses || {}) };
      if (decision === 'accepted') {
        nextStatuses[request.projectId] = {
          ...(nextStatuses[request.projectId] || {}),
          completionStatus: 'In Revival',
        };
      }

      return {
        ...prev,
        requests: updatedReqs,
        contributions: nextContribs,
        demoProjectStatuses: nextStatuses,
        activities: [
          {
            id: `demo-act-${Date.now()}`,
            projectId: request.projectId,
            projectName: request.projectName,
            eventType: decision === 'accepted' ? 'Request accepted' : 'Request declined',
            summary: `${decision === 'accepted' ? 'Accepted' : 'Declined'} ${request.requesterName} for ${request.projectName} (Demo Sandbox).`,
            createdAt: new Date().toISOString(),
          },
          ...(prev.activities || []),
        ],
      };
    });

    showToast(
      decision === 'accepted'
        ? `Accepted ${request.requesterName} onto ${request.projectName}!`
        : `Declined request from ${request.requesterName}.`,
      decision === 'accepted' ? 'acid' : 'cyan'
    );
    return { error: null };
  };

  // Simulate an incoming request on a user's demo project so they can test approval end-to-end
  const simulateIncomingDemoRequest = (project) => {
    const newReq = {
      id: `demo-req-sim-${Date.now()}`,
      projectId: project.id,
      projectName: project.name,
      requesterId: 'demo-dev-kai',
      requesterName: 'Kai Lindqvist',
      requestType: project.allowAdoption ? 'adopt' : 'contribute',
      message: `I've reviewed the ${project.name} autopsy notes and would love to help unblock "${project.unfinishedFeatures?.[0] || 'core roadmap'}" this month.`,
      skills: project.requiredSkills?.slice(0, 3) || ['React', 'Node.js'],
      availability: '6-10 hrs/week',
      status: 'pending',
      creatorResponse: '',
      isIncomingDemo: true,
      createdAt: new Date().toISOString(),
    };
    setDemoState((prev) => ({
      ...prev,
      requests: [newReq, ...(prev.requests || [])],
      activities: [
        {
          id: `demo-act-${Date.now()}`,
          projectId: project.id,
          projectName: project.name,
          eventType: 'Contributor request received',
          summary: `Simulated incoming request from Kai Lindqvist for ${project.name} (Demo Sandbox).`,
          createdAt: new Date().toISOString(),
        },
        ...(prev.activities || []),
      ],
    }));
    showToast(`Simulated contributor request received for ${project.name}.`, 'cyan');
  };

  // Update project resurrection status
  const updateProjectStatus = async (project, nextStatus) => {
    const isResurrected = nextStatus === 'Resurrected';
    const isLiveUuid = !project.id.startsWith('demo-') && !project.id.startsWith('local-');
    const nowIso = new Date().toISOString();

    if (isAuthenticated && supabase && currentUser && isLiveUuid && project.creatorId === currentUser.id) {
      const { error } = await supabase
        .from('projects')
        .update({
          completion_status: nextStatus,
          completion_percentage: isResurrected ? 100 : project.completionPercentage,
          resurrected_at: isResurrected ? nowIso : null,
        })
        .eq('id', project.id);

      if (!error) {
        await supabase.from('activity_logs').insert({
          user_id: currentUser.id,
          project_id: project.id,
          project_name: project.name,
          event_type: isResurrected ? 'Project resurrected' : 'Status updated',
          summary: `${project.name} transitioned to ${nextStatus}.`,
        });
        await fetchLiveData(currentUser);
        showToast(
          isResurrected
            ? `${project.name} has been Resurrected!`
            : `${project.name} status updated to ${nextStatus}.`
        );
        return { error: null };
      }
    }

    setDemoState((prev) => ({
      ...prev,
      demoProjectStatuses: {
        ...(prev.demoProjectStatuses || {}),
        [project.id]: {
          completionStatus: nextStatus,
          resurrectedAt: isResurrected ? nowIso : project.resurrectedAt,
        },
      },
      activities: [
        {
          id: `demo-act-${Date.now()}`,
          projectId: project.id,
          projectName: project.name,
          eventType: isResurrected ? 'Project resurrected' : 'Status updated',
          summary: `${project.name} marked as ${nextStatus} (Demo Sandbox).`,
          createdAt: nowIso,
        },
        ...(prev.activities || []),
      ],
    }));

    showToast(
      isResurrected
        ? `${project.name} has been Resurrected!`
        : `${project.name} transitioned to ${nextStatus}.`
    );
    return { error: null };
  };

  // Update contributor collaboration status
  const updateContributionStatus = async (contribution, nextStatus) => {
    const isLiveUuid = !contribution.id.startsWith('demo-');
    if (isAuthenticated && supabase && currentUser && isLiveUuid) {
      await supabase
        .from('contributions')
        .update({ status: nextStatus })
        .eq('id', contribution.id);
      await fetchLiveData(currentUser);
      showToast(`Collaboration status updated to ${nextStatus}.`);
      return;
    }

    setDemoState((prev) => ({
      ...prev,
      contributions: (prev.contributions || []).map((c) =>
        c.id === contribution.id ? { ...c, status: nextStatus } : c
      ),
    }));
    showToast(`Collaboration status set to ${nextStatus}.`);
  };

  const value = {
    isSupabaseConfigured,
    supabaseStatus,
    isAuthenticated,
    authLoading,
    currentUser,
    activeProfile,
    allProjects,
    bookmarks,
    requests,
    contributions,
    activities,
    authModalOpen,
    setAuthModalOpen,
    toast,
    showToast,
    signIn,
    signUp,
    signOut,
    updateProfile,
    buryProject,
    toggleBookmark,
    submitRequest,
    reviewRequest,
    simulateIncomingDemoRequest,
    updateProjectStatus,
    updateContributionStatus,
    logDemoActivity,
  };

  return <GraveyardContext.Provider value={value}>{children}</GraveyardContext.Provider>;
}

export function useGraveyard() {
  const ctx = useContext(GraveyardContext);
  if (!ctx) throw new Error('useGraveyard must be used inside GraveyardProvider');
  return ctx;
}
