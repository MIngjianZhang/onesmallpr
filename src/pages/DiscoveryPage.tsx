import { useState, useEffect } from 'react';
import { Search, Filter, SlidersHorizontal, Sparkles } from 'lucide-react';
import TaskCard, { Task } from '../components/common/TaskCard';
import Button from '../components/common/Button';
import { apiClient } from '../api/client';

// Extended Mock Data
const MOCK_TASKS: Task[] = [
  {
    id: "1",
    title: "Fix typo in README",
    repo: "facebook/react",
    tags: ["documentation", "good first issue"],
    difficulty: 0,
    description: "A simple task to fix a typo in the main documentation. Good for beginners."
  },
  {
    id: "2",
    title: "Update dependency version",
    repo: "vuejs/core",
    tags: ["maintenance", "chore"],
    difficulty: 1,
    description: "Bump the version of a dev dependency to the latest stable release."
  },
  {
    id: "3",
    title: "Add missing prop type",
    repo: "vercel/next.js",
    tags: ["typescript", "bug"],
    difficulty: 1,
    description: "Add a missing property definition to the TypeScript interface."
  },
  {
    id: "4",
    title: "Improve error message",
    repo: "microsoft/vscode",
    tags: ["dx", "good first issue"],
    difficulty: 0,
    description: "Make the error message more descriptive for the user."
  },
  {
    id: "5",
    title: "Add unit test for utility",
    repo: "lodash/lodash",
    tags: ["testing", "javascript"],
    difficulty: 1,
    description: "Add a missing unit test for the string utility function."
  },
  {
    id: "6",
    title: "Fix broken link in docs",
    repo: "tailwindlabs/tailwindcss",
    tags: ["documentation"],
    difficulty: 0,
    description: "Update the broken link in the configuration documentation."
  },
];

export default function DiscoveryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<number | 'all'>('all');
  const [showRecommendedOnly, setShowRecommendedOnly] = useState(false);
  const [userInterests, setUserInterests] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch user profile to get interests
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (userId) {
          const res = await apiClient.get(`/auth/me?userId=${userId}`);
          if (res.user && res.user.interests) {
            setUserInterests(res.user.interests);
          }
        }
      } catch (err) {
        console.error("Failed to fetch user profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const filteredTasks = MOCK_TASKS.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          task.repo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = difficultyFilter === 'all' || task.difficulty === difficultyFilter;
    
    // Simple Recommendation Logic: Match tags with interests
    // In a real app, this would be more sophisticated (AI-driven)
    let matchesRecommendation = true;
    if (showRecommendedOnly && userInterests.length > 0) {
      // Map some interests to tags for demo purposes
      const interestTags = userInterests.map(i => i.toLowerCase().split(' ')[0]); 
      const taskTags = task.tags.map(t => t.toLowerCase());
      
      // Check if any tag loosely matches any interest
      const hasMatch = taskTags.some(tag => 
        interestTags.some(interest => tag.includes(interest) || interest.includes(tag))
      ) || task.difficulty === 0; // Always recommend beginner tasks

      matchesRecommendation = hasMatch;
    }

    return matchesSearch && matchesDifficulty && matchesRecommendation;
  });

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-800">Discover Tasks</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <SlidersHorizontal className="h-4 w-4" /> Advanced Filter
            </Button>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-8 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-grow w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input 
              type="text" 
              placeholder="Search by title, repo..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
            <Filter className="text-gray-400 h-5 w-5 mr-2" />
            
            {/* Recommendation Toggle */}
            <button
              onClick={() => setShowRecommendedOnly(!showRecommendedOnly)}
              className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-colors border ${
                showRecommendedOnly
                  ? 'bg-purple-100 text-purple-700 border-purple-200'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
            >
              <Sparkles className="h-3 w-3" />
              Recommended for You
            </button>

            <div className="h-6 w-px bg-gray-200 mx-2"></div>

            <span className="text-sm text-gray-600 whitespace-nowrap">Difficulty:</span>
            <div className="flex gap-2">
              <button 
                onClick={() => setDifficultyFilter('all')}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  difficultyFilter === 'all' 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button 
                onClick={() => setDifficultyFilter(0)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  difficultyFilter === 0 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Lv.0 (Beginner)
              </button>
              <button 
                onClick={() => setDifficultyFilter(1)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  difficultyFilter === 1 
                    ? 'bg-yellow-500 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Lv.1 (Easy)
              </button>
            </div>
          </div>
        </div>

        {/* Task Grid */}
        {filteredTasks.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTasks.map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-lg border border-dashed border-gray-300">
            <p className="text-gray-500 text-lg">No tasks found matching your criteria.</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => { setSearchTerm(''); setDifficultyFilter('all'); setShowRecommendedOnly(false); }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
