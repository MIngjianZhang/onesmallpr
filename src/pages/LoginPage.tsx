import { Github, Terminal } from 'lucide-react';
import Button from '../components/common/Button';
import { apiClient } from '../api/client';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      // Call mock login API
      const res = await apiClient.post('/auth/login', {});
      if (res.success) {
        // Store user ID in localStorage for MVP
        localStorage.setItem('userId', res.user.id);
        // Redirect to Onboarding
        navigate('/onboarding');
      }
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg border border-gray-100">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Terminal className="h-8 w-8 text-primary" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Welcome to ONESMALLPR
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Join the community and start your contribution journey.
          </p>
        </div>
        
        <div className="mt-8 space-y-6">
          <Button 
            onClick={handleLogin}
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 gap-3"
          >
            <Github className="h-5 w-5" />
            {loading ? 'Signing in...' : 'Sign in / Sign up with GitHub'}
          </Button>
          
          <p className="text-xs text-center text-gray-500 mt-4">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
