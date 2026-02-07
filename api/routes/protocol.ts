import express, { type Request, type Response } from 'express';
import { userStore } from '../db/users.js';
import { generateProtocol } from '../services/ai.js';
import { getQuestById } from './quests.js';

const router = express.Router();

// POST /api/protocol/generate
router.post('/generate', async (req: Request, res: Response) => {
  const { issueId, userId } = req.body;
  
  // Retrieve user info for personalization
  const user = userId ? userStore.getUser(userId) : null;
  const userSkillLevel = user?.level ? 
    `${user.level.charAt(0).toUpperCase() + user.level.slice(1)} (Based on onboarding)` : 
    "Beginner";

  // Try to find from real quests first
  const realQuest = getQuestById(issueId);
  
  let taskData;
  if (realQuest) {
      taskData = {
          id: realQuest.id,
          title: realQuest.title,
          repo: realQuest.repo,
          difficulty: realQuest.rank === 'E' ? 0 : 1, // Simple mapping
          description: realQuest.description,
          url: realQuest.url
      };
  } else {
      // Fallback to generic mock if not found (or old logic)
      taskData = {
        id: issueId,
        title: "Unknown Quest",
        repo: "unknown/repo",
        difficulty: 0,
        description: "Quest details not found in local archives.",
        url: "https://github.com"
      };
  }

  // Generate content using AI
  const content = await generateProtocol(taskData, userSkillLevel);

  res.json({
    protocolId: `OSP-${issueId}-${Date.now()}`,
    content: content,
    downloadUrl: `/api/protocol/download/${issueId}` // Mock download link
  });
});

export default router;
