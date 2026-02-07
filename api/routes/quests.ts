import express, { type Request, type Response } from 'express';
import { analyzeIssueDifficulty, generateAssessment } from '../services/ai.js';
import axios from 'axios';

const router = express.Router();

interface Quest {
    id: string;
    title: string;
    repo: string;
    rank: 'E' | 'D' | 'C' | 'B'; // Updated Difficulty to Rank
    labels: string[];
    description: string;
    url: string;
    element: string; // Added Element (Language)
    rewards: {
        xp: number;
        contribution: number;
    };
    analysis: any;
}

// In-memory cache for quests
let QUESTS: Quest[] = [];
let lastUpdated = 0;
const UPDATE_INTERVAL = 60 * 60 * 1000; // 1 hour

// Helper to determine Rank based on difficulty/labels
const determineRank = (isEasy: boolean, labels: string[]): 'E' | 'D' | 'C' | 'B' => {
    if (isEasy) return 'E';
    if (labels.some(l => l.includes('medium') || l.includes('help wanted'))) return 'D';
    if (labels.some(l => l.includes('hard') || l.includes('bug'))) return 'C';
    return 'B'; // Default fallback for harder tasks
};

// Helper to determine Element (Language)
const determineElement = (labels: string[], repo: string): string => {
    const commonLangs = ['python', 'javascript', 'typescript', 'go', 'rust', 'java', 'html', 'css', 'json'];
    for (const lang of commonLangs) {
        if (labels.some(l => l.toLowerCase().includes(lang)) || repo.toLowerCase().includes(lang)) {
            return lang.charAt(0).toUpperCase() + lang.slice(1);
        }
    }
    return 'Unknown';
};

// Helper to fetch quests from GoodFirstIssues.com (Mocked via GitHub API for now as GFI doesn't have a public API, but we mimic the behavior)
const fetchQuestsFromGitHub = async () => {
    console.log("🔄 [Guild] Fetching fresh commissions from the Realm...");
    try {
        // Search for recent 'good first issue' across GitHub
        const response = await axios.get('https://api.github.com/search/issues', {
            params: {
                q: 'label:"good first issue" state:open no:assignee',
                sort: 'updated',
                order: 'desc',
                per_page: 5 
            },
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                ...(process.env.GITHUB_TOKEN ? { 'Authorization': `token ${process.env.GITHUB_TOKEN}` } : {})
            },
            timeout: 10000 
        });

        const issues = response.data.items;
        const newQuests: Quest[] = [];

        console.log(`[Guild] Found ${issues.length} potential bounties.`);

        for (const issue of issues) {
            // Use AI to analyze if it's TRULY easy
            const analysis = await analyzeIssueDifficulty(issue.title, issue.body || "");
            
            // Map to RPG Quest format
            const rank = determineRank(analysis.isEasy, issue.labels.map((l: any) => l.name));
            const element = determineElement(issue.labels.map((l: any) => l.name), issue.repository_url);
            
            newQuests.push({
                id: String(issue.id),
                title: issue.title, // In future, AI could rename this to RPG style
                repo: issue.repository_url.replace('https://api.github.com/repos/', ''),
                rank: rank,
                labels: issue.labels.map((l: any) => l.name),
                description: issue.body || "No description provided.",
                url: issue.html_url,
                element: element,
                rewards: {
                    xp: rank === 'E' ? 100 : (rank === 'D' ? 200 : 500),
                    contribution: rank === 'E' ? 50 : 100
                },
                analysis: {
                    complexity: analysis.isEasy ? "low" : "medium",
                    estimatedTime: analysis.estimatedTime,
                    requiredSkills: ["Git", "GitHub"],
                    projectBackground: "Fetched from GitHub",
                    technicalRequirements: analysis.reasoning
                }
            });
        }

        // Update cache
        if (newQuests.length > 0) {
            QUESTS = newQuests;
            lastUpdated = Date.now();
            console.log(`✅ [Guild] Posted ${newQuests.length} new bounties to the board.`);
        }

    } catch (error: any) {
        console.error("❌ [Guild] Failed to fetch commissions:", error.message);
    }
};

// Middleware to ensure quests are fresh
const ensureFreshQuests = async (req: Request, res: Response, next: any) => {
    if (Date.now() - lastUpdated > UPDATE_INTERVAL) {
        if (QUESTS.length <= 0) {
             await fetchQuestsFromGitHub();
        } else {
             fetchQuestsFromGitHub(); // Background update
        }
    }
    next();
};

// GET /api/quests
router.get('/', ensureFreshQuests, (req: Request, res: Response) => {
  res.json({
    quests: QUESTS,
    total: QUESTS.length,
    lastUpdated: new Date(lastUpdated).toISOString()
  });
});

// POST /api/quests/refresh (Manual trigger)
router.post('/refresh', async (req: Request, res: Response) => {
    await fetchQuestsFromGitHub();
    res.json({ success: true, count: QUESTS.length });
});

// GET /api/quests/:id
router.get('/:id', (req: Request, res: Response) => {
  const quest = QUESTS.find(t => t.id === req.params.id);
  if (!quest) {
    res.status(404).json({ error: "Quest not found in the archives." });
    return;
  }
  res.json(quest);
});

// POST /api/quests/:id/generate-assessment
router.post('/:id/generate-assessment', async (req: Request, res: Response) => {
    const quest = QUESTS.find(t => t.id === req.params.id);
    const { userProfile } = req.body;

    if (!quest) {
        res.status(404).json({ error: "Quest not found." });
        return;
    }

    try {
        const questions = await generateAssessment(quest.description, quest.repo, userProfile || "Novice Adventurer");
        res.json({ questions });
    } catch (error) {
        res.status(500).json({ error: "The Guild Master is busy (AI Error)." });
    }
});

// POST /api/quests/:id/accept
router.post('/:id/accept', (req: Request, res: Response) => {
    // Mock logic for accepting a quest
    // In real app, this would validate answers and update DB
    const { answers } = req.body;
    // Assuming simple pass if answers provided
    if (!answers || answers.length < 3) {
        res.json({ success: false, message: "You must complete the trial first!" });
        return;
    }

    res.json({
        success: true,
        message: "Quest Accepted! The scroll has been added to your inventory.",
        protocol_url: `/api/protocol/${req.params.id}/download` // Mock URL
    });
});

export const getQuestById = (id: string): Quest | undefined => {
    return QUESTS.find(t => t.id === id);
};

export default router;
