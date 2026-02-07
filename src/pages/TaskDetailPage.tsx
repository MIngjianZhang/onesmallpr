import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../api/client';
import Button from '../components/common/Button';
import { Clock, Code, FileText, ArrowLeft, ScrollText, Github, ExternalLink, Sword, BrainCircuit } from 'lucide-react';

export default function TaskDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [taskData, setTaskData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const data = await apiClient.get(`/quests/${id}`); // Updated endpoint
        setTaskData(data);
      } catch (err) {
        setError('Failed to decipher the ancient scroll.');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchTask();
  }, [id]);

  if (loading) return <div className="p-8 text-center text-guild-parchment animate-pulse">Unfurling scroll...</div>;
  if (error) return <div className="p-8 text-center text-guild-red font-heading text-xl">{error}</div>;
  if (!taskData) return <div className="p-8 text-center text-guild-parchment">Scroll not found in the archives.</div>;

  const { analysis, title, repo, url, rank, rewards } = taskData;

  return (
    <div className="bg-guild-wood min-h-screen py-8 text-guild-wood font-serif">
      <div className="container mx-auto px-4 max-w-4xl">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 gap-2 pl-0 text-guild-parchment hover:text-guild-gold">
          <ArrowLeft className="h-4 w-4" /> Return to Board
        </Button>

        {/* Scroll Container */}
        <div className="relative bg-guild-parchment rounded-sm shadow-2xl overflow-hidden mx-auto max-w-3xl transform rotate-1">
          {/* Scroll Rollers (Visual) */}
          <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-guild-wood-light to-transparent opacity-20"></div>
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-guild-wood-light to-transparent opacity-20"></div>
          
          {/* Content */}
          <div className="p-12 relative">
             {/* Wax Seal */}
             <div className="absolute top-8 right-8 w-24 h-24 bg-guild-red rounded-full flex items-center justify-center shadow-lg border-4 border-red-900 opacity-90 transform rotate-12">
                <span className="text-white font-heading font-bold text-3xl">Rank {rank}</span>
             </div>

            <div className="border-b-2 border-guild-wood mb-8 pb-4">
              <h1 className="text-4xl font-heading font-bold text-guild-wood mb-2 pr-24">{title}</h1>
              <div className="flex items-center gap-4 text-guild-wood-light font-bold">
                 <div className="flex items-center gap-2">
                    <Github className="h-5 w-5" />
                    <span>{repo}</span>
                 </div>
                 <a 
                  href={url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm text-guild-bronze hover:underline"
                >
                  View Original Decree <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
               <div className="p-4 bg-guild-wood/5 rounded border border-guild-wood/20 text-center">
                  <Clock className="h-6 w-6 mx-auto mb-2 text-guild-bronze" />
                  <span className="block text-sm uppercase tracking-wide">Time Limit</span>
                  <span className="font-bold text-lg">{analysis.estimatedTime}</span>
               </div>
               <div className="p-4 bg-guild-wood/5 rounded border border-guild-wood/20 text-center">
                  <Sword className="h-6 w-6 mx-auto mb-2 text-guild-bronze" />
                  <span className="block text-sm uppercase tracking-wide">Reward</span>
                  <span className="font-bold text-lg">{rewards?.xp || 100} XP</span>
               </div>
               <div className="p-4 bg-guild-wood/5 rounded border border-guild-wood/20 text-center">
                  <BrainCircuit className="h-6 w-6 mx-auto mb-2 text-guild-bronze" />
                  <span className="block text-sm uppercase tracking-wide">Difficulty</span>
                  <span className="font-bold text-lg">{analysis.complexity}</span>
               </div>
            </div>

            <div className="space-y-8">
               <section>
                 <h2 className="text-2xl font-heading font-bold mb-4 flex items-center gap-2 text-guild-wood">
                   <ScrollText className="h-6 w-6" /> The Lore (Background)
                 </h2>
                 <p className="text-lg leading-relaxed italic bg-white/40 p-6 rounded border-l-4 border-guild-bronze">
                   "{analysis.projectBackground}"
                 </p>
               </section>

               <section>
                 <h2 className="text-2xl font-heading font-bold mb-4 flex items-center gap-2 text-guild-wood">
                   <Code className="h-6 w-6" /> The Mission (Requirements)
                 </h2>
                 <p className="text-lg mb-6">{analysis.technicalRequirements}</p>
                 
                 <div className="bg-guild-wood p-4 rounded text-guild-parchment">
                    <h3 className="font-bold mb-2 uppercase text-xs tracking-widest text-guild-gold">Required Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {analysis.requiredSkills.map((skill: string) => (
                        <span key={skill} className="bg-guild-bronze px-3 py-1 rounded text-sm font-bold shadow-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                 </div>
               </section>
            </div>

            <div className="mt-12 flex justify-center">
              <Button 
                size="lg" 
                onClick={() => navigate(`/assessment/${id}`)}
                className="bg-guild-red text-white text-xl px-12 py-6 border-4 border-double border-guild-gold shadow-xl hover:scale-105 transition-transform"
              >
                Accept Quest <Sword className="ml-3 h-6 w-6" />
              </Button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
