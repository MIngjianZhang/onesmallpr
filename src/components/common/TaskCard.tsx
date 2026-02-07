import { Link } from 'react-router-dom';
import { Sword, Coins, ScrollText } from 'lucide-react';

export interface Task {
  id: string;
  title: string;
  repo: string;
  labels: string[]; // Was tags
  rank: 'E' | 'D' | 'C' | 'B'; // Was difficulty
  description?: string;
  element?: string;
  rewards?: {
      xp: number;
      contribution: number;
  };
}

interface TaskCardProps {
  task: Task;
}

export default function TaskCard({ task }: TaskCardProps) {
  const rankColors = {
      'E': 'bg-green-100 text-green-800 border-green-300',
      'D': 'bg-blue-100 text-blue-800 border-blue-300',
      'C': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'B': 'bg-red-100 text-red-800 border-red-300'
  };

  return (
    <Link to={`/task/${task.id}`} className="block h-full group">
      <div className="bg-guild-parchment p-6 rounded-sm shadow-md hover:shadow-xl hover:scale-[1.02] transition-all border-4 border-guild-wood h-full flex flex-col relative overflow-hidden">
        
        {/* Torn Paper Effect Top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-guild-parchment border-b border-dashed border-guild-wood-light"></div>

        {/* Rank Stamp */}
        <div className={`absolute -right-6 top-6 rotate-12 w-24 text-center border-2 ${rankColors[task.rank] || 'bg-gray-100'} font-heading font-bold py-1 shadow-sm z-10 uppercase tracking-widest`}>
          Rank {task.rank}
        </div>

        {/* Header: Repo & Element */}
        <div className="flex justify-between items-start mb-4 pr-16">
          <div className="flex flex-col">
            <span className="text-xs font-heading text-guild-wood-light uppercase tracking-wider mb-1">
              {task.repo}
            </span>
            <span className="text-xs font-bold bg-guild-wood text-guild-gold px-2 py-0.5 rounded-sm inline-block self-start border border-guild-bronze">
              {task.element || 'Unknown'}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-heading font-bold mb-3 text-guild-wood line-clamp-2 group-hover:text-guild-bronze transition-colors">
            {task.title}
        </h3>

        {/* Description */}
        {task.description && (
          <p className="text-guild-wood/80 text-sm mb-6 line-clamp-3 flex-grow font-serif italic border-l-2 border-guild-wood-light pl-3">
            "{task.description.substring(0, 100)}..."
          </p>
        )}

        {/* Rewards Footer */}
        <div className="mt-auto pt-4 border-t-2 border-dashed border-guild-wood-light flex justify-between items-center text-guild-wood text-sm font-bold">
            <div className="flex items-center gap-1" title="Experience Points">
                <Sword className="w-4 h-4 text-guild-bronze" />
                <span>{task.rewards?.xp || 100} XP</span>
            </div>
            <div className="flex items-center gap-1" title="Contribution Points">
                <Coins className="w-4 h-4 text-guild-gold" />
                <span>{task.rewards?.contribution || 50} CP</span>
            </div>
        </div>

        {/* Nail visual */}
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-3 h-3 rounded-full bg-guild-wood shadow-inner border border-guild-bronze"></div>
      </div>
    </Link>
  );
}
