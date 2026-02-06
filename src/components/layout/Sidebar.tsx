import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Book, Terminal, BarChart2, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function Sidebar() {
  const { signOut } = useAuth();

  const navItems = [
    { name: 'Console', path: '/console', icon: LayoutDashboard },
    { name: 'API Docs', path: '/console/docs', icon: Book },
    { name: 'Test Tool', path: '/console/test', icon: Terminal },
    { name: 'Usage Stats', path: '/console/stats', icon: BarChart2 },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white min-h-screen flex flex-col">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <span className="bg-blue-600 w-8 h-8 rounded-lg flex items-center justify-center text-sm">DB</span>
          Doubao API
        </h1>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <NavLink
            to="/"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white mb-4 border border-slate-700/50"
        >
            <span className="font-medium">← Back to App</span>
        </NavLink>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive && item.path !== '/' // Only highlight if exact match or subpath, but 'end' prop usually handles this better.
                                            // Since we are using absolute paths now /console vs /console/docs, standard isActive works.
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`
          }
          end={item.path === '/console'} // Add 'end' prop to prevent Console link being active on subpages if desired, or keep it active.
                                         // Usually dashboard is distinct. Let's assume exact match for Dashboard.
        >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors mb-2 ${
              isActive
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`
          }
        >
          <Settings className="w-5 h-5" />
          <span className="font-medium">Settings</span>
        </NavLink>
        <button
          onClick={signOut}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-red-900/20 hover:text-red-400 w-full transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
}
