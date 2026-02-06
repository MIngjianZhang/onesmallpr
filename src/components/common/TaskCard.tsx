import { Link } from 'react-router-dom';

export interface Task {
  id: string;
  title: string;
  repo: string;
  tags: string[];
  difficulty: number;
  description?: string;
}

interface TaskCardProps {
  task: Task;
}

export default function TaskCard({ task }: TaskCardProps) {
  return (
    <Link to={`/task/${task.id}`} className="block h-full">
      <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100 h-full flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <span className="text-xs font-mono bg-blue-100 text-blue-800 px-2 py-1 rounded">
            {task.repo}
          </span>
          <span className={`text-xs font-bold px-2 py-1 rounded ${
            task.difficulty === 0 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
          }`}>
            Lv.{task.difficulty}
          </span>
        </div>
        <h3 className="text-lg font-bold mb-2 text-gray-800 line-clamp-2">{task.title}</h3>
        {task.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
            {task.description}
          </p>
        )}
        <div className="flex flex-wrap gap-2 mt-auto pt-4">
          {task.tags.map(tag => (
            <span key={tag} className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
