import express, { type Request, type Response } from 'express';

const router = express.Router();

// Mock Data (In a real app, this would come from a DB or GitHub API)
const TASKS = [
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
  {
    id: "2",
    title: "Update dependency version",
    repo: "vuejs/core",
    difficulty: 1,
    labels: ["maintenance", "chore"],
    description: "Bump the version of a dev dependency...",
    url: "https://github.com/vuejs/core/issues/456",
    analysis: {
      complexity: "low",
      estimatedTime: "45 mins",
      requiredSkills: ["JSON", "NPM"],
      projectBackground: "Vue.js is a progressive JavaScript framework.",
      technicalRequirements: "Understanding of package.json structure."
    }
  },
  {
    id: "3",
    title: "Add missing prop type",
    repo: "vercel/next.js",
    difficulty: 1,
    labels: ["typescript", "bug"],
    description: "Add a missing property definition to the TypeScript interface.",
    url: "https://github.com/vercel/next.js/issues/789",
    analysis: {
      complexity: "medium",
      estimatedTime: "1 hour",
      requiredSkills: ["TypeScript", "React"],
      projectBackground: "Next.js is a React framework for production.",
      technicalRequirements: "Knowledge of TypeScript interfaces and React props."
    }
  },
  {
    id: "4",
    title: "Improve error message",
    repo: "microsoft/vscode",
    difficulty: 0,
    labels: ["dx", "good first issue"],
    description: "Make the error message more descriptive for the user.",
    url: "https://github.com/microsoft/vscode/issues/101",
    analysis: {
      complexity: "low",
      estimatedTime: "30 mins",
      requiredSkills: ["TypeScript", "Error Handling"],
      projectBackground: "VS Code is a code editor redefined and optimized for building and debugging modern web and cloud applications.",
      technicalRequirements: "Locate error string and replace with descriptive text."
    }
  },
  {
    id: "5",
    title: "Add unit test for utility",
    repo: "lodash/lodash",
    difficulty: 1,
    labels: ["testing", "javascript"],
    description: "Add a missing unit test for the string utility function.",
    url: "https://github.com/lodash/lodash/issues/202",
    analysis: {
      complexity: "medium",
      estimatedTime: "1.5 hours",
      requiredSkills: ["JavaScript", "Unit Testing", "Jest/Mocha"],
      projectBackground: "Lodash is a modern JavaScript utility library delivering modularity, performance & extras.",
      technicalRequirements: "Write a test case covering edge cases for string manipulation."
    }
  },
  {
    id: "6",
    title: "Fix broken link in docs",
    repo: "tailwindlabs/tailwindcss",
    difficulty: 0,
    labels: ["documentation"],
    description: "Update the broken link in the configuration documentation.",
    url: "https://github.com/tailwindlabs/tailwindcss/issues/303",
    analysis: {
      complexity: "low",
      estimatedTime: "15 mins",
      requiredSkills: ["Markdown", "Documentation"],
      projectBackground: "Tailwind CSS is a utility-first CSS framework for rapidly building custom user interfaces.",
      technicalRequirements: "Find broken URL and replace with correct one."
    }
  }
];

// GET /api/tasks/recommend
router.get('/recommend', (req: Request, res: Response) => {
  // Logic to recommend tasks based on query params (userLevel, languages)
  res.json({
    tasks: TASKS,
    total: TASKS.length,
    page: 1
  });
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
