import express, { type Request, type Response } from 'express';
import { fetchAndFilterIssues } from '../services/github.js';

const router = express.Router();

// Base Mock Data (kept as fallback)
const MOCK_TASKS = [
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
  },
  // ... other mocks can remain if needed, or reduced
];

// In-memory store for combined tasks (Mock + Fetched)
let currentTasks: any[] = [...MOCK_TASKS];

// GET /api/tasks/recommend
router.get('/recommend', async (req: Request, res: Response) => {
  try {
    // Attempt to fetch fresh issues (service handles caching)
    const fetchedTasks = await fetchAndFilterIssues();
    
    if (fetchedTasks.length > 0) {
      // Update in-memory store, prioritizing fetched tasks
      // Deduplicate by ID if necessary, but simple concat is fine for MVP
      currentTasks = [...fetchedTasks, ...MOCK_TASKS]; 
    }
  } catch (error) {
    console.error("Error refreshing tasks:", error);
    // Continue with existing currentTasks if fetch fails
  }

  res.json({
    tasks: currentTasks,
    total: currentTasks.length,
    page: 1
  });
});

// GET /api/tasks/:id/analyze
router.get('/:id/analyze', (req: Request, res: Response) => {
  const task = currentTasks.find(t => t.id === req.params.id);
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
