import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../api/client';
import Button from '../components/common/Button';
import { Clock, Code, FileText, ArrowLeft, BrainCircuit, Github, ExternalLink } from 'lucide-react';

export default function TaskDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [taskData, setTaskData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const data = await apiClient.get(`/tasks/${id}/analyze`);
        setTaskData(data);
      } catch (err) {
        setError('Failed to load task details');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchTask();
  }, [id]);

  if (loading) return <div className="p-8 text-center">Loading task details...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!taskData) return <div className="p-8 text-center">Task not found</div>;

  const { analysis, title, repo, url } = taskData;

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 gap-2 pl-0">
          <ArrowLeft className="h-4 w-4" /> Back to Tasks
        </Button>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-blue-50 p-6 border-b border-blue-100">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">{title}</h1>
                <div className="flex items-center gap-2 text-gray-600">
                  <Github className="h-4 w-4" />
                  <span className="font-medium">{repo}</span>
                </div>
              </div>
              <a 
                href={url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 hover:underline"
              >
                View Issue <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            
            <div className="flex gap-4 text-sm text-blue-700">
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" /> {analysis.estimatedTime}
              </span>
              <span className="flex items-center gap-1">
                <BrainCircuit className="h-4 w-4" /> Complexity: {analysis.complexity}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-8">
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" /> Project Background
              </h2>
              <p className="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-md">
                {analysis.projectBackground}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Code className="h-5 w-5 text-primary" /> Technical Requirements
              </h2>
              <p className="text-gray-600 mb-4">{analysis.technicalRequirements}</p>
              <div className="flex flex-wrap gap-2">
                {analysis.requiredSkills.map((skill: string) => (
                  <span key={skill} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </section>

            <div className="border-t border-gray-100 pt-8 flex justify-end">
              <Button 
                size="lg" 
                onClick={() => navigate(`/assessment/${id}`)}
                className="gap-2"
              >
                Start Assessment <BrainCircuit className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
