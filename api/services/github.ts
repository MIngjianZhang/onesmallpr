import { analyzeIssueDifficulty } from './ai.js';

interface GitHubIssue {
  id: number;
  title: string;
  body: string;
  html_url: string;
  repository_url: string;
  labels: { name: string }[];
}

let cachedTasks: any[] = [];
let lastFetchTime = 0;
const CACHE_DURATION = 3600000; // 1 hour in ms

export const fetchAndFilterIssues = async () => {
  const now = Date.now();
  if (cachedTasks.length > 0 && now - lastFetchTime < CACHE_DURATION) {
    console.log('Returning cached tasks');
    return cachedTasks;
  }

  console.log('Fetching fresh issues from GitHub...');
  try {
    // Search for issues with label "good first issue" in JavaScript/TypeScript repos
    const query = encodeURIComponent('label:"good first issue" language:javascript state:open no:assignee');
    const response = await fetch(`https://api.github.com/search/issues?q=${query}&sort=created&order=desc&per_page=10`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'OneSmallPR-App'
      }
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`);
    }

    const data = await response.json();
    const rawIssues: GitHubIssue[] = data.items || [];
    
    const validatedTasks = [];

    for (const issue of rawIssues) {
      // Analyze with Doubao Model
      const analysis = await analyzeIssueDifficulty(issue.title, issue.body || '');
      
      if (analysis.isEasy) {
        const repoName = issue.repository_url.replace('https://api.github.com/repos/', '');
        
        validatedTasks.push({
          id: String(issue.id),
          title: issue.title,
          repo: repoName,
          difficulty: 0, // AI confirmed it's easy
          labels: issue.labels.map(l => l.name),
          description: issue.body ? issue.body.substring(0, 200) + '...' : 'No description provided.',
          url: issue.html_url,
          analysis: {
            complexity: "low",
            estimatedTime: analysis.estimatedTime,
            requiredSkills: ["JavaScript", "Git"], // Simplification for MVP
            projectBackground: `Contribute to ${repoName}`,
            technicalRequirements: analysis.reasoning
          }
        });
      }
    }

    cachedTasks = validatedTasks;
    lastFetchTime = now;
    return validatedTasks;
  } catch (error) {
    console.error('Failed to fetch issues:', error);
    return []; // Return empty or fallback to mock if needed in controller
  }
};
