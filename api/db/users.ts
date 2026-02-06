// Simple in-memory store for MVP
export interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string;
  // Onboarding Data
  environment?: {
    hasGit: boolean;
    os: string;
    hasEditor: boolean;
  };
  skills?: string[];
  interests?: string[];
  level?: 'beginner' | 'intermediate' | 'advanced';
  achievements?: Array<{
    id: string;
    name: string;
    description: string;
    icon: string; // lucide icon name
    unlockedAt: string;
  }>;
}

class UserStore {
  private users: Map<string, UserProfile> = new Map();

  // Seed with a demo user
  constructor() {
    this.users.set('demo-user', {
      id: 'demo-user',
      username: 'DemoUser',
      email: 'demo@example.com',
      level: 'beginner',
      skills: ['python', 'html'],
      interests: ['gamedev', 'web'],
      achievements: [
        { id: '1', name: 'First Steps', description: 'Created an account', icon: 'User', unlockedAt: new Date().toISOString() }
      ],
      environment: {
        hasGit: true,
        os: 'macos',
        hasEditor: true
      }
    });
  }

  createUser(user: UserProfile) {
    this.users.set(user.id, user);
    return user;
  }

  getUser(id: string) {
    return this.users.get(id);
  }

  updateUser(id: string, data: Partial<UserProfile>) {
    const user = this.users.get(id);
    if (!user) return null;
    const updated = { ...user, ...data };
    this.users.set(id, updated);
    return updated;
  }
}

export const userStore = new UserStore();
