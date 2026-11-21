/**
 * Fetches publicly available GitHub repository metadata via GitHub's unauthenticated public REST API.
 * Gracefully handles invalid URLs, rate limits, private repos, and network constraints.
 */
export function parseGitHubRepoUrl(url) {
  if (!url || typeof url !== 'string') return null;
  try {
    const cleaned = url.trim().replace(/\.git$/, '');
    const parsed = new URL(cleaned);
    if (!parsed.hostname.includes('github.com')) return null;
    const parts = parsed.pathname.split('/').filter(Boolean);
    if (parts.length < 2) return null;
    return {
      owner: parts[0],
      repo: parts[1],
    };
  } catch {
    return null;
  }
}

export async function fetchGitHubRepoMetadata(url) {
  const parsed = parseGitHubRepoUrl(url);
  if (!parsed) {
    return {
      status: 'invalid',
      error: 'Enter a valid public GitHub repository URL (e.g. https://github.com/owner/repo).',
      data: null,
    };
  }

  const { owner, repo } = parsed;

  try {
    const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: {
        Accept: 'application/vnd.github+json',
      },
    });

    if (repoRes.status === 404) {
      return {
        status: 'not_found',
        error: 'Repository not found or is private. Project Graveyard never inspects private repositories without explicit permission.',
        data: null,
      };
    }

    if (repoRes.status === 403 || repoRes.status === 429) {
      return {
        status: 'rate_limited',
        error: 'GitHub public API rate limit reached. Cached or creator-supplied metadata is shown instead.',
        data: null,
      };
    }

    if (!repoRes.ok) {
      return {
        status: 'error',
        error: `GitHub API returned status ${repoRes.status}.`,
        data: null,
      };
    }

    const repoData = await repoRes.json();

    let languages = [];
    try {
      const langRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/languages`, {
        headers: { Accept: 'application/vnd.github+json' },
      });
      if (langRes.ok) {
        const langObj = await langRes.json();
        const totalBytes = Object.values(langObj).reduce((acc, n) => acc + n, 0) || 1;
        languages = Object.entries(langObj)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 6)
          .map(([name, bytes]) => ({
            name,
            percentage: Math.max(1, Math.round((bytes / totalBytes) * 100)),
          }));
      }
    } catch {
      // Language breakdown is optional
    }

    return {
      status: 'ok',
      error: null,
      data: {
        fullName: repoData.full_name,
        name: repoData.name,
        description: repoData.description || '',
        stars: repoData.stargazers_count ?? 0,
        forks: repoData.forks_count ?? 0,
        openIssues: repoData.open_issues_count ?? 0,
        defaultBranch: repoData.default_branch || 'main',
        primaryLanguage: repoData.language || null,
        languages,
        lastUpdated: repoData.pushed_at || repoData.updated_at,
        createdAt: repoData.created_at,
        license: repoData.license?.spdx_id || null,
        htmlUrl: repoData.html_url,
        isArchived: Boolean(repoData.archived),
      },
    };
  } catch {
    return {
      status: 'network_error',
      error: 'Could not reach GitHub API from this network environment. Showing saved repository metadata.',
      data: null,
    };
  }
}
