import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { apiClient } from '../api/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  onboardingCompleted: boolean;
  completeOnboarding: () => void;
  mockLogin: (email: string) => Promise<void>;
  mockRegister: (email: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      // Check onboarding status from local storage for MVP
      const hasCompleted = localStorage.getItem(`onboarding_${session?.user?.id}`) === 'true';
      setOnboardingCompleted(hasCompleted);
      setLoading(false);
    });

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      // Check onboarding status from local storage for MVP
      const hasCompleted = localStorage.getItem(`onboarding_${session?.user?.id}`) === 'true';
      setOnboardingCompleted(hasCompleted);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const completeOnboarding = () => {
    if (user) {
      localStorage.setItem(`onboarding_${user.id}`, 'true');
      setOnboardingCompleted(true);
    }
  };

  const mockLogin = async (email: string) => {
    console.log('Mocking login for development...');
    // Generate a deterministic ID based on email to distinguish users
    const mockId = 'dev-user-' + btoa(email).replace(/[^a-zA-Z0-9]/g, '').substring(0, 10);
    const name = email.split('@')[0];

    // Sync with backend to ensure user exists in userStore
    try {
      await apiClient.post('/auth/login', {
        id: mockId,
        email: email,
        name: name
      });
      // Save userId for OnboardingPage
      localStorage.setItem('userId', mockId);
    } catch (err) {
      console.error("Failed to sync user with backend:", err);
    }

    const mockUser = {
      id: mockId,
      email: email,
      app_metadata: {},
      user_metadata: { full_name: name },
      aud: 'authenticated',
      created_at: new Date().toISOString()
    } as User;

    setUser(mockUser);
    setSession({
      access_token: 'mock-token',
      token_type: 'bearer',
      expires_in: 3600,
      refresh_token: 'mock-refresh',
      user: mockUser
    });

    // Check if this mock user has completed onboarding
    const hasCompleted = localStorage.getItem(`onboarding_${mockId}`) === 'true';
    setOnboardingCompleted(hasCompleted);
  };

  const mockRegister = async (email: string, name: string) => {
    console.log('Mocking registration for development...');
    const mockId = 'dev-user-' + btoa(email).replace(/[^a-zA-Z0-9]/g, '').substring(0, 10);

    // Sync with backend to ensure user exists in userStore
    try {
      await apiClient.post('/auth/login', {
        id: mockId,
        email: email,
        name: name
      });
      // Save userId for OnboardingPage
      localStorage.setItem('userId', mockId);
    } catch (err) {
      console.error("Failed to sync user with backend:", err);
    }

    const mockUser = {
      id: mockId,
      email: email,
      app_metadata: {},
      user_metadata: { full_name: name },
      aud: 'authenticated',
      created_at: new Date().toISOString()
    } as User;

    setUser(mockUser);
    setSession({
      access_token: 'mock-token',
      token_type: 'bearer',
      expires_in: 3600,
      refresh_token: 'mock-refresh',
      user: mockUser
    });
    // New registration means onboarding not completed
    localStorage.removeItem(`onboarding_${mockId}`); // Clear any old state
    setOnboardingCompleted(false);
  };

  const signOut = async () => {
    // Development Mock
    if (import.meta.env.VITE_SUPABASE_URL?.includes('placeholder')) {
      setUser(null);
      setSession(null);
      return;
    }

    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, onboardingCompleted, completeOnboarding, mockLogin, mockRegister, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
