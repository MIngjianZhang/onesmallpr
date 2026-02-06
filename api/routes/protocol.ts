import express, { type Request, type Response } from 'express';
import { userStore } from '../db/users.js';
import { generateProtocol } from '../services/ai.js';

const router = express.Router();

// Mock tasks lookup (Shared with assessment, ideally centralized)
const getTaskDetails = (id: string) => {
    // Extended mock data for protocol context
    const tasks: Record<string, any> = {
        "1": { 
            id: "1", 
            title: "Fix typo in README", 
            repo: "facebook/react", 
            difficulty: 0, 
            description: "There is a small typo in the README file...",
            url: "https://github.com/facebook/react/issues/123"
        },
        "2": { 
            id: "2", 
            title: "Update dependency version", 
            repo: "vuejs/core", 
            difficulty: 1, 
            description: "Bump the version of a dev dependency...",
            url: "https://github.com/vuejs/core/issues/456"
        },
        "3": { 
            id: "3", 
            title: "Add missing prop type", 
            repo: "vercel/next.js", 
            difficulty: 1, 
            description: "Add a missing property definition to the TypeScript interface.",
            url: "https://github.com/vercel/next.js/issues/789"
        },
        // ... add others if needed, fallback to generic
    };
    return tasks[id] || {
        id: id,
        title: "Generic Task",
        repo: "unknown/repo",
        difficulty: 0,
        description: "A generic task description",
        url: "https://github.com"
    };
}

// POST /api/protocol/generate
router.post('/generate', async (req: Request, res: Response) => {
  const { issueId, userId } = req.body;
  
  // Retrieve user info for personalization
  const user = userId ? userStore.getUser(userId) : null;
  const userSkillLevel = user?.level ? 
    `${user.level.charAt(0).toUpperCase() + user.level.slice(1)} (Based on onboarding)` : 
    "Beginner";

  const task = getTaskDetails(issueId);

  // Generate content using AI
  const content = await generateProtocol(task, userSkillLevel);

  res.json({
    protocolId: `OSP-${issueId}-${Date.now()}`,
    content: content,
    downloadUrl: `/api/protocol/download/${issueId}` // Mock download link
  });
});

export default router;
