import { useState, useEffect } from 'react';
import { Search, Filter, SlidersHorizontal, RefreshCcw, Scroll } from 'lucide-react';
import TaskCard, { Task } from '../components/common/TaskCard';
import Button from '../components/common/Button';
import { apiClient } from '../api/client';

export default function DiscoveryPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [rankFilter, setRankFilter] = useState<'all' | 'E' | 'D' | 'C' | 'B'>('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  // Fetch quests from API
  const fetchQuests = async () => {
    try {
      const res = await apiClient.get('/quests'); // Updated endpoint
      if (res.quests) {
        setTasks(res.quests);
        if (res.lastUpdated) {
             setLastUpdated(res.lastUpdated);
        }
      }
    } catch (err) {
      console.error("Failed to fetch quests", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuests();
  }, []);

  const handleRefresh = async () => {
      setRefreshing(true);
      try {
          await apiClient.post('/quests/refresh', {});
          await fetchQuests();
      } catch (err) {
          console.error("Failed to refresh quests", err);
      } finally {
          setRefreshing(false);
      }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          task.repo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRank = rankFilter === 'all' || task.rank === rankFilter;
    
    return matchesSearch && matchesRank;
  });

  return (
    <div className="bg-guild-wood min-h-screen py-8 text-guild-parchment font-sans">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 border-b-2 border-guild-bronze pb-4">
          <div>
            <h1 className="text-4xl font-heading text-guild-gold drop-shadow-md flex items-center gap-3">
              <Scroll className="w-8 h-8" />
              Quest Board
            </h1>
            {lastUpdated && (
                <p className="text-xs text-guild-parchment-dark mt-1 italic">
                  Last updated by the Guild Master: {new Date(lastUpdated).toLocaleTimeString()}
                </p>
            )}
          </div>
          <div className="flex gap-2">
            <Button 
                className="bg-guild-wood-light text-guild-gold border border-guild-bronze hover:bg-guild-wood gap-2"
                onClick={handleRefresh}
                disabled={refreshing}
            >
              <RefreshCcw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} /> 
              {refreshing ? 'Scouting...' : 'Refresh Posters'}
            </Button>
            <Button className="bg-guild-wood-light text-guild-gold border border-guild-bronze hover:bg-guild-wood gap-2">
              <SlidersHorizontal className="h-4 w-4" /> Filter Magic
            </Button>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-guild-parchment p-4 rounded shadow-lg border-2 border-guild-wood-light mb-8 flex flex-col md:flex-row gap-4 items-center relative overflow-hidden">
          {/* Decorative Screw/Nail heads */}
          <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-guild-bronze shadow-inner"></div>
          <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-guild-bronze shadow-inner"></div>
          <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-guild-bronze shadow-inner"></div>
          <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-guild-bronze shadow-inner"></div>

          <div className="relative flex-grow w-full md:w-auto text-guild-wood">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-guild-wood-light h-5 w-5" />
            <input 
              type="text" 
              placeholder="Search for bounties..." 
              className="w-full pl-10 pr-4 py-2 bg-white/50 border border-guild-wood-light rounded focus:outline-none focus:ring-2 focus:ring-guild-gold placeholder-guild-wood-light"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
            <Filter className="text-guild-wood h-5 w-5 mr-2" />
            
            <span className="text-sm text-guild-wood font-bold whitespace-nowrap">Rank:</span>
            <div className="flex gap-2">
              {['all', 'E', 'D', 'C', 'B'].map((rank) => (
                <button 
                  key={rank}
                  onClick={() => setRankFilter(rank as any)}
                  className={`px-3 py-1 rounded border transition-colors font-heading ${
                    rankFilter === rank 
                      ? 'bg-guild-wood text-guild-gold border-guild-gold' 
                      : 'bg-white/50 text-guild-wood border-guild-wood-light hover:bg-white'
                  }`}
                >
                  {rank === 'all' ? 'All Ranks' : `Rank ${rank}`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Task Grid */}
        {loading ? (
             <div className="text-center py-20 text-guild-parchment animate-pulse">Scouting the realms...</div>
        ) : filteredTasks.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTasks.map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-guild-parchment/10 rounded border border-dashed border-guild-parchment-dark">
            <p className="text-guild-parchment text-lg">No bounties found matching your criteria.</p>
            <Button 
              className="mt-4 bg-guild-bronze text-white"
              onClick={() => { setSearchTerm(''); setRankFilter('all'); }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
