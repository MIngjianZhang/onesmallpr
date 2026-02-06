import { Link } from 'react-router-dom';
import { Terminal, Github, User } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-heading font-bold text-xl">
          <Terminal className="h-6 w-6" />
          <span>ONESMALLPR</span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="hover:text-secondary transition-colors">Home</Link>
          <Link to="/discover" className="hover:text-secondary transition-colors">Discover</Link>
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-4">
          <Link to="/profile" className="hover:text-secondary transition-colors" title="Profile">
            <User className="h-5 w-5" />
          </Link>
          <Link 
            to="/login" 
            className="flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-2 rounded-md font-medium hover:bg-secondary/90 transition-colors"
          >
            <Github className="h-4 w-4" />
            <span>Login</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
