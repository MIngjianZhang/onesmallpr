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
import HomePage from './pages/HomePage';
import DiscoveryPage from './pages/DiscoveryPage';
import TaskDetailPage from './pages/TaskDetailPage';
import AssessmentPage from './pages/AssessmentPage';
import ProtocolPage from './pages/ProtocolPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import OnboardingPage from './pages/OnboardingPage';
import NotFoundPage from './pages/NotFoundPage';

// Protected Route Wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  
  if (!user) {
    return <Navigate to="/auth/login" replace />;
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
            <Route index element={<HomePage />} />
            <Route path="discover" element={<DiscoveryPage />} />
            <Route path="task/:id" element={<TaskDetailPage />} />
            <Route path="assessment/:id" element={<AssessmentPage />} />
            <Route path="protocol/:id" element={<ProtocolPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="onboarding" element={<OnboardingPage />} />
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
