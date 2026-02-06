import express, { type Request, type Response } from 'express';
import { analyzeIssueDifficulty } from '../services/ai.js';
import axios from 'axios';

const router = express.Router();

interface Task {
    id: string;
    title: string;
    repo: string;
    difficulty: number;
    labels: string[];
    description: string;
    url: string;
    analysis: any;
}

// In-memory cache for tasks
let TASKS: Task[] = [];
let lastUpdated = 0;
const UPDATE_INTERVAL = 60 * 60 * 1000; // 1 hour

// Initial Seed Data (Fallback)
const SEED_TASKS: Task[] = [
  {
    id: "1",
    title: "Fix typo in README",
    repo: "facebook/react",
    difficulty: 0,
    labels: ["good first issue", "documentation"],
    description: "There is a small typo in the README file...",
    url: "https://github.com/facebook/react/issues/123",
    analysis: {
      complexity: "low",
      estimatedTime: "30 mins",
      requiredSkills: ["Markdown", "Git Basics"],
      projectBackground: "React is a JavaScript library for building user interfaces.",
      technicalRequirements: "Basic knowledge of Markdown syntax."
    }
  }
];

TASKS = [...SEED_TASKS];

// Helper to fetch tasks from GitHub
const fetchTasksFromGitHub = async () => {
    console.log("🔄 Fetching fresh tasks from GitHub...");
    try {
        // Search for recent 'good first issue' across GitHub
        // q=label:"good first issue" state:open no:assignee sort:updated-desc
        const response = await axios.get('https://api.github.com/search/issues', {
            params: {
                q: 'label:"good first issue" state:open no:assignee language:typescript,javascript,python',
                sort: 'updated',
                order: 'desc',
                per_page: 5 // Reduced to 5 for faster response
            },
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                // Add token if available to avoid rate limits
                ...(process.env.GITHUB_TOKEN ? { 'Authorization': `token ${process.env.GITHUB_TOKEN}` } : {})
            },
            timeout: 10000 // 10s timeout
        });

        const issues = response.data.items;
        const newTasks: Task[] = [];

        console.log(`Found ${issues.length} issues. analyzing...`);

        for (const issue of issues) {
            console.log(`Analyzing: ${issue.title}`);
            // Use AI to analyze if it's TRULY easy
            const analysis = await analyzeIssueDifficulty(issue.title, issue.body || "");
            
            // Only include if AI thinks it's easy or if we are desperate (fallback to difficulty 1)
            // For now, include all but mark difficulty based on AI
            
            newTasks.push({
                id: String(issue.id),
                title: issue.title,
                repo: issue.repository_url.replace('https://api.github.com/repos/', ''),
                difficulty: analysis.isEasy ? 0 : 1, // 0 for Easy, 1 for Medium
                labels: issue.labels.map((l: any) => l.name),
                description: issue.body || "No description provided.",
                url: issue.html_url,
                analysis: {
                    complexity: analysis.isEasy ? "low" : "medium",
                    estimatedTime: analysis.estimatedTime,
                    requiredSkills: ["Git", "GitHub"], // Simplified
                    projectBackground: "Fetched from GitHub", // Could be enhanced
                    technicalRequirements: analysis.reasoning
                }
            });
        }

        // Update cache
        if (newTasks.length > 0) {
            TASKS = newTasks;
            lastUpdated = Date.now();
            console.log(`✅ Updated ${newTasks.length} tasks from GitHub.`);
        }

    } catch (error: any) {
        console.error("❌ Error fetching tasks:", error.message);
    }
};

// Middleware to ensure tasks are fresh
const ensureFreshTasks = async (req: Request, res: Response, next: any) => {
    if (Date.now() - lastUpdated > UPDATE_INTERVAL) {
        // Trigger update but don't block response (stale-while-revalidate pattern)
        // Or block if empty.
        if (TASKS.length <= 1) {
             await fetchTasksFromGitHub();
        } else {
             fetchTasksFromGitHub(); // Background update
        }
    }
    next();
};

// GET /api/tasks/recommend
router.get('/recommend', ensureFreshTasks, (req: Request, res: Response) => {
  res.json({
    tasks: TASKS,
    total: TASKS.length,
    page: 1,
    lastUpdated: new Date(lastUpdated).toISOString()
  });
});

// GET /api/tasks/refresh (Manual trigger)
router.post('/refresh', async (req: Request, res: Response) => {
    await fetchTasksFromGitHub();
    res.json({ success: true, count: TASKS.length });
});

// GET /api/tasks/:id/analyze
router.get('/:id/analyze', (req: Request, res: Response) => {
  const task = TASKS.find(t => t.id === req.params.id);
  if (!task) {
    res.status(404).json({ error: "Task not found" });
    return;
  }
  
  res.json({
    id: task.id,
    title: task.title,
    repo: task.repo,
    url: task.url,
    description: task.description,
    analysis: task.analysis
  });
});

export default router;
