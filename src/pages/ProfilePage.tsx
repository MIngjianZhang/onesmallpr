import { useEffect, useState } from 'react';
import { User, Award, GitCommit, Map, FileText } from 'lucide-react';
import { apiClient } from '../api/client';
import { UserProfile } from '../../api/db/users'; // We can't import from api/db/users in frontend if it's not shared. 
// Actually, in this setup, the frontend code is in src and backend in api. They are in the same repo but usually frontend shouldn't import from backend directly if they are separate builds.
// However, since this is a mono-repo style setup where we likely just want the type, let's define a local interface or just use 'any' for now to be safe, OR better, define the interface in the component.

interface UserData {
  username: string;
  level: string;
  email: string;
  // ... other fields
}

const KnowledgeGraph = () => (
  <div className="relative w-full h-80 bg-slate-900 rounded-lg overflow-hidden flex items-center justify-center">
    <div className="absolute top-4 left-4 text-slate-400 text-sm flex items-center gap-2">
      <Map className="h-4 w-4" /> Knowledge Graph
    </div>
    <svg viewBox="0 0 400 300" className="w-full h-full">
      {/* Links */}
      <line x1="200" y1="150" x2="100" y2="100" stroke="#475569" strokeWidth="2" />
      <line x1="200" y1="150" x2="300" y2="100" stroke="#475569" strokeWidth="2" />
      <line x1="200" y1="150" x2="200" y2="250" stroke="#475569" strokeWidth="2" />
      <line x1="100" y1="100" x2="50" y2="150" stroke="#475569" strokeWidth="2" />
      
      {/* Nodes */}
      <circle cx="200" cy="150" r="20" fill="#F59E0B" />
      <text x="200" y="155" textAnchor="middle" fill="#1F2937" fontSize="10" fontWeight="bold">Git</text>
      
      <circle cx="100" cy="100" r="15" fill="#3B82F6" />
      <text x="100" y="105" textAnchor="middle" fill="white" fontSize="8">HTML</text>
      
      <circle cx="300" cy="100" r="15" fill="#3B82F6" />
      <text x="300" y="105" textAnchor="middle" fill="white" fontSize="8">JS</text>
      
      <circle cx="200" cy="250" r="15" fill="#10B981" />
      <text x="200" y="255" textAnchor="middle" fill="white" fontSize="8">React</text>
      
      <circle cx="50" cy="150" r="12" fill="#6366F1" />
      <text x="50" y="154" textAnchor="middle" fill="white" fontSize="6">CSS</text>
    </svg>
  </div>
);

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) return;
      try {
        const res = await apiClient.get(`/auth/me?userId=${userId}`);
        setUser(res.user);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // Removed hardcoded achievements

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading profile...</div>;
  }

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">User not found</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* User Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8 flex flex-col md:flex-row items-center gap-6">
          <div className="h-24 w-24 bg-primary rounded-full flex items-center justify-center text-white">
            <User className="h-12 w-12" />
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-800">{user.username || "Anonymous"}</h1>
            <p className="text-gray-500 mb-2">{user.level ? `Level ${user.level}` : "Beginner"}</p>
            <div className="flex gap-4 justify-center md:justify-start">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-bold">
                {user.contributions || 0} Contributions
              </span>
              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-bold">
                {user.xp || 0} XP
              </span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content (Graph) */}
          <div className="md:col-span-2 space-y-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold mb-4">Knowledge Graph</h2>
              <KnowledgeGraph />
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {/* Empty State for Activity */}
                <div className="text-center py-8 text-gray-400">
                   <GitCommit className="h-10 w-10 mx-auto mb-2 opacity-20" />
                   <p>No recent activity. Start your first task!</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar (Achievements) */}
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold mb-4">Achievements</h2>
              <div className="space-y-4">
                {user.achievements && user.achievements.length > 0 ? (
                  user.achievements.map((ach: any) => (
                    <div key={ach.id} className="flex items-start gap-3 p-3 border border-gray-100 rounded-lg">
                      <div className="p-2 bg-gray-50 rounded-full">
                         {/* Simple fallback icon mapping could be added here */}
                         <Award className="h-6 w-6 text-yellow-500" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800 text-sm">{ach.name}</h3>
                        <p className="text-xs text-gray-500">{ach.description}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-400 border border-dashed rounded-lg">
                    <Award className="h-10 w-10 mx-auto mb-2 opacity-20" />
                    <p className="text-sm">No achievements yet.</p>
                    <p className="text-xs mt-1">Complete your first task to unlock badges!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
