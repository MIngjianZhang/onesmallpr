import express, { type Request, type Response } from 'express';
import { generateAssessment } from '../services/ai.js';

const router = express.Router();

// Mock tasks lookup (should be imported or fetched from DB)
const getTaskDetails = (id: string) => {
    // Ideally import TASKS from tasks.ts, but for now we duplicate or fetch
    // Simplified mock for the demo context
    const tasks: Record<string, any> = {
        "1": { description: "There is a small typo in the README file...", repo: "facebook/react" },
        "2": { description: "Bump the version of a dev dependency...", repo: "vuejs/core" },
        "3": { description: "Add a missing property definition to the TypeScript interface.", repo: "vercel/next.js" },
        "4": { description: "Make the error message more descriptive for the user.", repo: "microsoft/vscode" },
        "5": { description: "Add a missing unit test for the string utility function.", repo: "lodash/lodash" },
        "6": { description: "Update the broken link in the configuration documentation.", repo: "tailwindlabs/tailwindcss" }
    };
    return tasks[id];
}

// POST /api/assessment/generate
router.post('/generate', async (req: Request, res: Response) => {
  const { issueId, userProfile } = req.body;
  
  const task = getTaskDetails(issueId);
  
  if (task) {
      try {
        const questions = await generateAssessment(task.description, task.repo, userProfile || "Beginner");
        res.json({ questions });
        return;
      } catch (error) {
        console.error("AI Generation failed, falling back to mock");
      }
  }

  // Fallback to mock if AI fails or task not found
  // ... (Keep existing mock logic as fallback)
  const questionBank: Record<string, any[]> = {
    "1": [ // Fix typo in README
      {
        id: 1,
        type: "multiple_choice",
        question: "Which file format uses the .md extension?",
        options: ["Markdown", "Module Definition", "MongoDB Data", "Main Document"],
        correctAnswer: 0
      },
      {
        id: 2,
        type: "multiple_choice",
        question: "What is the correct way to fix a typo in a collaborative project?",
        options: ["Email the maintainer", "Create a Pull Request", "Post on StackOverflow", "Ignore it"],
        correctAnswer: 1
      },
      {
        id: 3,
        type: "multiple_choice",
        question: "What command creates a new branch in Git?",
        options: ["git new", "git checkout -b", "git branch -n", "git create"],
        correctAnswer: 1
      }
    ],
    "2": [ // Update dependency
      {
        id: 1,
        type: "multiple_choice",
        question: "Where are project dependencies listed in a Node.js project?",
        options: ["config.js", "package.json", "node_modules", "README.md"],
        correctAnswer: 1
      },
      {
        id: 2,
        type: "multiple_choice",
        question: "What is semantic versioning (SemVer)?",
        options: ["Marketing versioning", "Major.Minor.Patch", "Date based", "Alphabetical"],
        correctAnswer: 1
      },
      {
        id: 3,
        type: "multiple_choice",
        question: "How do you install a new package?",
        options: ["npm add", "npm install", "npm get", "npm fetch"],
        correctAnswer: 1
      }
    ]
  };

  // Default fallback questions if task ID is not in bank
  const defaultQuestions = [
      {
        id: 1,
        type: "multiple_choice",
        question: "What is the primary goal of this task?",
        options: ["Fix a bug", "Update documentation", "Add a new feature", "Improve performance"],
        correctAnswer: 0
      },
      {
        id: 2,
        type: "multiple_choice",
        question: "Which git command downloads a repository?",
        options: ["git push", "git pull", "git clone", "git commit"],
        correctAnswer: 2
      },
      {
        id: 3,
        type: "multiple_choice",
        question: "What is a 'Good First Issue'?",
        options: ["A difficult task", "A task suitable for beginners", "The first issue ever created", "A critical bug"],
        correctAnswer: 1
      }
  ];

  res.json({
    questions: questionBank[issueId] || defaultQuestions
  });
});

// POST /api/assessment/submit
router.post('/submit', (req: Request, res: Response) => {
  const { issueId, answers } = req.body;
  
  // Mock validation logic
  // Assume all answers are correct for MVP demo
  res.json({
    score: 100,
    passed: true,
    feedback: "Excellent! You understand the task requirements perfectly."
  });
});

export default router;
