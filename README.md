# 🚀 ONESMALLPR

> "One small step for a coder, one giant leap for the AI Empire."

**ONESMALLPR** is an AI-powered educational platform designed to bridge the gap between "learning to code" and "contributing to open source." Inspired by Neil Armstrong’s first step on the moon, this project empowers beginners to overcome the intimidation of GitHub and make their first meaningful contribution.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-Alpha-orange.svg)
![AI-Powered](https://img.shields.io/badge/AI-Doubao-red)

## 🌓 The Vision

For many beginners, GitHub is a vast, intimidating universe. While AI tools like Cursor and Trae make coding easier, the process of open-source collaboration remains a high hurdle. **ONESMALLPR** provides the "Lunar Module"—the scaffolding, guidance, and confidence needed to land your first Pull Request and begin building your personal knowledge empire.

---

## ✨ Key Features

### 🛠️ Phase 1: The Scaffolding (Onboarding)
- **Environment Check**: Guided onboarding to ensure you have the basics (GitHub account, Git installed, AI-native IDEs like Trae/Cursor ready).
- **Tech Profiling**: A self-assessment tool to define your current skill level (e.g., Python basics, HTML/CSS).
- **Seamless Mock Auth**: Development-friendly login system for instant access.

### 🔍 Phase 2: Discovery & Triage (Powered by AI)
- **Smart Recommendation**: Fetches real "Good First Issues" from GitHub in real-time.
- **AI Gatekeeper (Doubao Model)**: Analyzing issues on-the-fly to filter out "fake easy" tasks (e.g., issues marked "good first issue" that actually require deep architectural changes).
- **Cache Strategy**: Intelligent caching to respect GitHub API limits while keeping data fresh.

### 📄 Phase 3: The Task Protocol (Artifact Generation)
- **ONESMALLPR_TASK_PROTOCOL.md**: Our core output. A structured Markdown file that acts as a "battle plan" for your local AI IDE.
- **Bridge the Gap**: The protocol defines the macro-context, target logic, and "safety constraints" to ensure your PR is professional and mergeable.

### 📈 Phase 4: Growth & Evolution
- **Personal Knowledge Graph**: (Planned) Automatically map the concepts you've mastered based on your successful PRs.
- **Continuous Learning**: Receive recommendations for "The Next Step" based on your evolving expertise.

---

## 💻 Tech Stack

- **IDE**: Trae (AI-native evolution)
- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express
- **AI Engine**: Doubao (Volcano Engine Ark)
- **Database**: Supabase (Mock integration for MVP)
- **Tools**: Lucide React (Icons), React Router v6

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.x or higher.
- **GitHub Token**: (Optional) A Personal Access Token for higher API rate limits.
- **Doubao API Key**: Required for AI analysis features.

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/MIngjianZhang/onesmallpr.git
   cd onesmallpr
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   # .env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_key
   
   # For Backend Service (AI Analysis)
   ARK_API_KEY=your_doubao_api_key
   GITHUB_TOKEN=your_github_token_optional
   ```

### Local Development

Start both the frontend client and backend server concurrently:

```bash
npm run dev
```

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001

---

## 📜 The ONESMALLPR Protocol

When you use our platform, you generate a `ONESMALLPR_TASK_PROTOCOL.md`. This is the secret sauce.

1. **Download** the generated `.md` file.
2. **Move** it to the root of the target repository you are contributing to.
3. **Attach** it to your AI IDE Chat (Cursor/Trae) and say: 
   > "Follow this protocol to guide me through the fix."

---

## 🗺️ Roadmap

- [x] **MVP**: Automated Issue analysis and Protocol generation.
- [x] **Smart Filter**: AI-driven "Good First Issue" verification.
- [ ] **V1.0**: User login with real GitHub OAuth and "Achievement Badges."
- [ ] **V2.0**: Multimodal support (upload error screenshots, voice-guided PR instructions).
- [ ] **V3.0**: Dynamic 3D Knowledge Graph visualization.

---

## 🤝 Contributing

We believe in the power of **One Small PR**. If you'd like to contribute to this project:

1. Find a Good First Issue in our repo.
2. Follow our own **ONESMALLPR Protocol**.
3. Submit your PR!

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
