import { Terminal, Mail, ArrowRight } from 'lucide-react';
import Button from '../components/common/Button';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { mockLogin, mockRegister } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isRegister) {
        await mockRegister(email, name);
        // New users always go to onboarding
        navigate('/onboarding');
      } else {
        await mockLogin(email);
        // Login success - check if we should go to onboarding or home
        // Since mockLogin updates context asynchronously, we might need to rely on the effect in a protected route 
        // OR just send everyone to onboarding/home for now.
        // Let's check localStorage directly for immediate feedback
        const mockId = 'dev-user-' + btoa(email).replace(/[^a-zA-Z0-9]/g, '').substring(0, 10);
        const hasCompleted = localStorage.getItem(`onboarding_${mockId}`) === 'true';
        if (hasCompleted) {
            navigate('/');
        } else {
            navigate('/onboarding');
        }
      }
    } catch (error) {
      console.error('Auth failed:', error);
      // Optional: Add user feedback here (e.g., toast notification)
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
            {isRegister ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isRegister ? 'Start your open source journey today.' : 'Continue building your contribution graph.'}
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            {isRegister && (
              <div className="mb-4">
                <label htmlFor="name" className="sr-only">Full Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}
            <div className="mb-4">
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm rounded-md"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Button 
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary gap-2"
            >
              {loading ? 'Processing...' : (isRegister ? 'Create Account' : 'Sign In')}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </Button>
          </div>
        </form>

        <div className="text-center">
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-sm text-primary hover:text-primary/80 font-medium"
          >
            {isRegister ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
}
