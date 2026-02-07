import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ConsoleLayout from './components/layout/ConsoleLayout';
import Dashboard from './pages/console/Dashboard';
import APIDocs from './pages/console/APIDocs';
import TestTool from './pages/console/TestTool';
import Stats from './pages/console/Stats';
import Login from './pages/auth/Login';

// Old App Components (Kept for reference or secondary access)
import MainLayout from './components/layout/MainLayout';
import GuildHall from './pages/GuildHall';
import DiscoveryPage from './pages/DiscoveryPage';
import TaskDetailPage from './pages/TaskDetailPage';
import AssessmentPage from './pages/AssessmentPage';
import ProtocolPage from './pages/ProtocolPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import OnboardingPage from './pages/OnboardingPage';
import NotFoundPage from './pages/NotFoundPage';

// Protected Route Wrapper
const ProtectedRoute = ({ children, requireOnboarding = true }: { children: React.ReactNode, requireOnboarding?: boolean }) => {
  const { user, loading, onboardingCompleted } = useAuth();
  
  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  
  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  // If user is logged in but hasn't completed onboarding, redirect to onboarding
  // UNLESS we are already on the onboarding page (to prevent loops)
  if (requireOnboarding && !onboardingCompleted) {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Main OneSmallPR Application Routes */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<GuildHall />} />
            <Route path="quest-board" element={<DiscoveryPage />} />
            <Route path="discover" element={<Navigate to="/quest-board" replace />} />
            <Route path="task/:id" element={<TaskDetailPage />} />
            <Route path="assessment/:id" element={
              <ProtectedRoute>
                <AssessmentPage />
              </ProtectedRoute>
            } />
            <Route path="protocol/:id" element={
              <ProtectedRoute>
                <ProtocolPage />
              </ProtectedRoute>
            } />
            <Route path="profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />
            <Route path="onboarding" element={
              <ProtectedRoute requireOnboarding={false}>
                <OnboardingPage />
              </ProtectedRoute>
            } />
          </Route>

          {/* Auth Routes */}
          <Route path="/auth/login" element={<Login />} />
          <Route path="/login" element={<Navigate to="/auth/login" replace />} />

          {/* Console Routes (kept as secondary tool for API management if needed, or hidden) */}
          <Route path="/console" element={
            <ProtectedRoute>
              <ConsoleLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="docs" element={<APIDocs />} />
            <Route path="test" element={<TestTool />} />
            <Route path="stats" element={<Stats />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
