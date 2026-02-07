import OpenAI from "openai";
import dotenv from 'dotenv';

dotenv.config();

// Initialize OpenAI client for Doubao (Volcano Engine)
const client = new OpenAI({
  apiKey: process.env.ARK_API_KEY,
  baseURL: "https://ark.cn-beijing.volces.com/api/v3",
});

const MODEL_ID = "doubao-seed-1-8-251228"; // Usually you might want to make this configurable

export interface AssessmentQuestion {
  id: number;
  type: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export const analyzeIssueDifficulty = async (title: string, body: string): Promise<{ isEasy: boolean; reasoning: string; estimatedTime: string }> => {
  try {
    const prompt = `
      You are an expert open source maintainer. Analyze the following GitHub issue to determine if it is TRULY a "Good First Issue" suitable for a beginner.
      
      Issue Title: "${title}"
      Issue Body: "${body.substring(0, 1000)}" (truncated)
      
      Criteria for "Easy":
      - Clear scope (e.g., fix typo, update docs, simple bug fix).
      - Does NOT require deep architectural knowledge.
      - Does NOT involve complex concurrency, security, or core logic changes.
      
      Return ONLY a raw JSON object:
      {
        "isEasy": boolean,
        "reasoning": "string (short explanation why)",
        "estimatedTime": "string (e.g., '30 mins', '2 hours')"
      }
    `;

    const completion = await client.chat.completions.create({
      messages: [
        { role: "system", content: "You are a strict code auditor." },
        { role: "user", content: prompt },
      ],
      model: MODEL_ID,
    });

    const text = completion.choices[0].message.content || '{}';
    const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Error analyzing issue:", error);
    return { isEasy: true, reasoning: "AI analysis failed, defaulting to provided label.", estimatedTime: "Unknown" };
  }
};

export const generateAssessment = async (taskDescription: string, repoName: string, userProfile: string = "Beginner"): Promise<AssessmentQuestion[]> => {
  try {
    const prompt = `
      You are the "Grand Master" of the Adventurer's Guild (ONESMALLPR).
      A novice adventurer wants to accept a quest for the repository "${repoName}".
      
      Quest Description: "${taskDescription}"
      Adventurer Rank: "${userProfile}"
      
      Generate 3 "Gatekeeper Trials" (Multiple Choice Questions) to test if they are ready.
      The questions should be:
      1. Technical but related to the specific context of the issue.
      2. Written in an RPG/Fantasy tone (e.g., "To decipher the ancient scroll of JSON, which rune must be inscribed?").
      3. Solvable if the user has read the issue description carefully.

      Return ONLY a raw JSON array (no markdown formatting, no code blocks) with the following structure for each question:
      {
        "id": number,
        "type": "multiple_choice",
        "question": "string (RPG flavor)",
        "options": ["string", "string", "string", "string"],
        "correctAnswer": number (0-indexed index of the correct option)
      }
    `;

    const completion = await client.chat.completions.create({
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: prompt },
      ],
      model: MODEL_ID,
    });

    const text = completion.choices[0].message.content || '[]';
    
    // Clean up the response to ensure it's valid JSON
    const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Error generating assessment:", error);
    // Fallback questions if AI fails
    return [
      {
        id: 1,
        type: "multiple_choice",
        question: "Adventurer! What is the primary objective of this quest?",
        options: ["Slay a bug", "Update the ancient texts (Docs)", "Forge a new feature", "Optimize the mana flow"],
        correctAnswer: 0
      },
      {
        id: 2,
        type: "multiple_choice",
        question: "Before you enter the dungeon (Repository), what must you do?",
        options: ["Charge blindly", "Fork the repository", "Cast a fire spell", "Delete the README"],
        correctAnswer: 1
      },
      {
        id: 3,
        type: "multiple_choice",
        question: "How will you prove your victory (Verify changes)?",
        options: ["Trust in fate", "Run the local tests", "Ask the Guild Master immediately", "Submit without checking"],
        correctAnswer: 1
      }
    ];
  }
};

export const generateProtocol = async (task: any, userLevel: string): Promise<string> => {
  try {
    const prompt = `
      You are an expert AI pair programmer assistant named "ONESMALLPR".
      Your goal is to generate a structured "Task Protocol" markdown document that guides another AI (like Cursor or Windsurf) to help a human user complete an open source task.
      
      Context:
      - Task ID: ${task.id}
      - Repository: ${task.repo}
      - User Skill Level: ${userLevel}
      - Task Description: "${task.description}"
      - Task URL: ${task.url}
      
      Please generate the markdown content following this EXACT format:
      
      ---
      task_id: ${task.id}
      repo_name: ${task.repo}
      difficulty_level: Level ${task.difficulty}
      user_skill_level: ${userLevel}
      status: READY_FOR_EXECUTION
      ---

      # 🚀 ONESMALLPR 任务简报：${task.title}

      > **致执行 AI (Cursor/Windsurf)**: 用户正在参与开源贡献。本次任务是 ${task.title}。请引导用户完成。

      ---

      ### 1. 🌍 宏观背景 (AI Empire Context)
      * **项目定位**：(Briefly explain what ${task.repo} is based on general knowledge)
      * **贡献价值**：(Explain why this task matters)

      ### 2. 🎯 攻坚目标 (The Target Issue)
      * **任务描述**：${task.description}
      * **技术要点**：
          1. **(Point 1)**: ...
          2. **(Point 2)**: ...
          3. **(Point 3)**: ...

      ### 3. 🛠 执行策略 (Execution Strategy)
      **请按照以下步骤引导用户：**

      1.  **环境准备**：(Steps to clone/fork if needed, or locate files)
      2.  **代码修改**：(Specific instructions on what to change)
      3.  **验证**：(How to verify the change)

      ### 4. ⚠️ 约束与禁忌 (Constraints & Safety)
      * **格式对齐**：...
      * **严禁修改旧数据**：...
      * **PR 礼仪**：...

      ### 5. 💡 知识点同步 (Learning Synced)
      * **(Concept 1)**: ...
      * **(Concept 2)**: ...

      ---
      **ONESMALLPR 发起指令**：*“AI 助理，请先帮助我理解项目结构...”* (Generate a specific starter prompt for the user)
    `;

    const completion = await client.chat.completions.create({
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: prompt },
      ],
      model: MODEL_ID,
    });

    return completion.choices[0].message.content || '# Error Generating Protocol';
  } catch (error) {
    console.error("Error generating protocol:", error);
    return `# Error Generating Protocol\n\nSorry, we couldn't generate the protocol at this time. Please try again later.`;
  }
};
