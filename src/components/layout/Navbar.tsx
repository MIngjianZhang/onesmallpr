import { Link } from 'react-router-dom';
import { Terminal, Github, User, LayoutDashboard, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function Navbar() {
  const { user, signOut } = useAuth();

  return (
    <nav className="bg-primary text-primary-foreground shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-heading font-bold text-xl hover:opacity-90 transition-opacity">
          <Terminal className="h-6 w-6" />
          <span>ONESMALLPR</span>
        </Link>

        {/* Navigation Links - Always visible for now to improve navigation */}
        <div className="flex items-center gap-6 text-sm font-medium">
          <Link to="/" className="hover:text-secondary transition-colors">Home</Link>
          <Link to="/discover" className="hover:text-secondary transition-colors">Discover</Link>
          <Link to="/console" className="hover:text-secondary transition-colors flex items-center gap-1">
            <LayoutDashboard className="h-4 w-4" />
            <span className="hidden sm:inline">Console</span>
          </Link>
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link to="/profile" className="flex items-center gap-2 hover:text-secondary transition-colors" title="Profile">
                <User className="h-5 w-5" />
                <span className="hidden sm:inline">{user.user_metadata?.full_name || user.email?.split('@')[0]}</span>
              </Link>
              <button 
                onClick={() => signOut()}
                className="hover:text-red-300 transition-colors"
                title="Sign Out"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </>
          ) : (
            <Link 
              to="/login" 
              className="flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-2 rounded-md font-medium hover:bg-secondary/90 transition-colors"
            >
              <Github className="h-4 w-4" />
              <span>Login</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
