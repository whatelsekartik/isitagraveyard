/**
 * Transparent, deterministic heuristic for estimating a project's revival readiness.
 * Explicitly presented as an estimated readiness indicator, never an objective prediction of success.
 */
export function calculateRevivalBreakdown(project) {
  const docQuality = clamp(Number(project.documentationQuality ?? project.documentation_quality ?? 60), 0, 100);
  const setupCompleteness = clamp(Number(project.setupCompleteness ?? project.setup_completeness ?? 55), 0, 100);

  const repoVisibility = project.repoVisibility || project.repo_visibility || 'public';
  const hasRepoUrl = Boolean(project.repositoryUrl || project.repository_url);
  const repoAccessibility =
    repoVisibility === 'public' && hasRepoUrl
      ? 95
      : repoVisibility === 'request-access' && hasRepoUrl
        ? 65
        : hasRepoUrl
          ? 45
          : 25;

  const blockersCount = (project.blockers || []).length;
  const blockerScore = clamp(100 - blockersCount * 16, 20, 100);

  const availability = project.creatorAvailability || project.creator_availability || 'Advisory';
  const availabilityMap = {
    'Active Mentor': 95,
    Advisory: 80,
    'Async Handoff': 60,
    Unavailable: 28,
  };
  const creatorAvailabilityScore = availabilityMap[availability] ?? 65;

  const unfinishedCount = (project.unfinishedFeatures || project.unfinished_features || []).length;
  const nextStepsCount = (project.suggestedNextSteps || project.suggested_next_steps || []).length;
  const taskClarity = clamp(
    (unfinishedCount > 0 ? 45 : 15) + Math.min(nextStepsCount, 4) * 14,
    25,
    100
  );

  const factors = [
    {
      key: 'documentation',
      label: 'Documentation Quality',
      weight: 0.2,
      score: docQuality,
      detail: docQuality >= 75 ? 'Detailed architecture & README notes' : docQuality >= 50 ? 'Partial setup & design notes' : 'Minimal documentation preserved',
    },
    {
      key: 'repository',
      label: 'Repository Accessibility',
      weight: 0.18,
      score: repoAccessibility,
      detail:
        repoVisibility === 'public' && hasRepoUrl
          ? 'Public source repository accessible'
          : hasRepoUrl
            ? 'Controlled access repository'
            : 'Repository link pending',
    },
    {
      key: 'setup',
      label: 'Setup Completeness',
      weight: 0.17,
      score: setupCompleteness,
      detail: setupCompleteness >= 70 ? 'Environment & dependencies documented' : 'Local setup needs reconstruction',
    },
    {
      key: 'blockers',
      label: 'Blocker Manageability',
      weight: 0.15,
      score: blockerScore,
      detail: `${blockersCount} documented technical blocker${blockersCount === 1 ? '' : 's'}`,
    },
    {
      key: 'creator',
      label: 'Creator Availability',
      weight: 0.15,
      score: creatorAvailabilityScore,
      detail: `Original creator: ${availability}`,
    },
    {
      key: 'clarity',
      label: 'Clarity of Next Steps',
      weight: 0.15,
      score: taskClarity,
      detail: `${unfinishedCount} unfinished scope items · ${nextStepsCount} concrete next steps`,
    },
  ];

  const total = Math.round(
    factors.reduce((sum, f) => sum + f.score * f.weight, 0)
  );

  return {
    total: clamp(total, 10, 99),
    factors,
  };
}

/**
 * Explainable Skill Matching algorithm.
 * Computes overlap between a developer's profile and a project's stack/requirements/category.
 */
export function calculateSkillMatch(userProfile, project) {
  if (!userProfile) {
    return { score: null, factors: [], summary: 'Set your skills to unlock matching' };
  }

  const userTokens = new Set(
    [
      ...(userProfile.skills || []),
      ...(userProfile.languages || []),
      ...(userProfile.frameworks || []),
    ]
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean)
  );

  const userInterests = new Set(
    (userProfile.interests || []).map((s) => s.trim().toLowerCase()).filter(Boolean)
  );

  if (userTokens.size === 0 && userInterests.size === 0) {
    return { score: null, factors: [], summary: 'Add skills in your matcher profile' };
  }

  const projectSkills = [
    ...(project.requiredSkills || project.required_skills || []),
    ...(project.techTags || project.tech_tags || []),
  ];
  const uniqueProjectTokens = Array.from(
    new Set(projectSkills.map((s) => s.trim()).filter(Boolean))
  );

  const matchedSkills = [];
  const missingSkills = [];

  for (const token of uniqueProjectTokens) {
    const norm = token.toLowerCase();
    if (userTokens.has(norm)) {
      matchedSkills.push(token);
    } else {
      missingSkills.push(token);
    }
  }

  const skillCoverage =
    uniqueProjectTokens.length > 0
      ? matchedSkills.length / Math.min(uniqueProjectTokens.length, 5)
      : 0.4;
  const skillScore = Math.min(1, skillCoverage) * 65;

  const categoryLower = (project.category || '').toLowerCase();
  const interestMatched =
    userInterests.has(categoryLower) ||
    Array.from(userInterests).some(
      (interest) =>
        categoryLower.includes(interest) ||
        (project.description || '').toLowerCase().includes(interest)
    );
  const interestScore = interestMatched ? 20 : 6;

  // Experience alignment
  const expLevel = (userProfile.experienceLevel || userProfile.experience_level || 'Intermediate').toLowerCase();
  const diff = (project.difficulty || 'Intermediate').toLowerCase();
  let expScore = 10;
  let expNote = 'Balanced complexity alignment';
  if (expLevel === diff) {
    expScore = 15;
    expNote = `Direct match for ${project.difficulty} scope`;
  } else if (expLevel === 'senior' || expLevel === 'advanced') {
    expScore = 14;
    expNote = 'Experience exceeds minimum difficulty';
  } else if (expLevel === 'beginner' && diff === 'advanced') {
    expScore = 5;
    expNote = 'Challenging scope relative to current level';
  }

  const total = clamp(Math.round(skillScore + interestScore + expScore), 18, 98);

  const factors = [
    {
      label: 'Overlapping Stack & Skills',
      detail:
        matchedSkills.length > 0
          ? `Matched: ${matchedSkills.slice(0, 4).join(', ')}`
          : 'No direct stack overlap yet',
      points: Math.round(skillScore),
      maxPoints: 65,
    },
    {
      label: 'Domain & Interest Fit',
      detail: interestMatched
        ? `Aligns with your ${project.category} interest`
        : `Domain: ${project.category}`,
      points: interestScore,
      maxPoints: 20,
    },
    {
      label: 'Difficulty Alignment',
      detail: expNote,
      points: expScore,
      maxPoints: 15,
    },
  ];

  const summary =
    matchedSkills.length > 0
      ? `Matches ${matchedSkills.slice(0, 3).join(', ')}${interestMatched ? ` & ${project.category}` : ''}`
      : interestMatched
        ? `Strong interest alignment in ${project.category}`
        : `Adjacent stack opportunity (${missingSkills.slice(0, 2).join(', ')})`;

  return {
    score: total,
    matchedSkills,
    missingSkills: missingSkills.slice(0, 4),
    interestMatched,
    factors,
    summary,
  };
}

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}
