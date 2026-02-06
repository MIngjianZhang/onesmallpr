import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../api/client';
import Button from '../components/common/Button';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface Question {
  id: number;
  type: string;
  question: string;
  options: string[];
}

export default function AssessmentPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ passed: boolean; score: number; feedback: string } | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        // Retrieve user profile/skill level from storage or context
        // For MVP, we default to "Beginner" or read from localStorage if available
        const userProfile = localStorage.getItem('userSkillLevel') || "Beginner (Python/Web)";
        
        const data = await apiClient.post('/assessment/generate', { 
          issueId: id,
          userProfile: userProfile
        });
        setQuestions(data.questions);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchQuestions();
  }, [id]);

  const handleOptionSelect = (questionId: number, optionIndex: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const formattedAnswers = Object.entries(answers).map(([qId, ans]) => ({
        questionId: parseInt(qId),
        answer: ans
      }));
      
      const data = await apiClient.post('/assessment/submit', {
        issueId: id,
        answers: formattedAnswers
      });
      
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Generating assessment...</div>;

  if (result) {
    return (
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
            {result.passed ? (
              <div className="flex flex-col items-center">
                <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Assessment Passed!</h1>
                <p className="text-xl text-green-600 mb-6">Score: {result.score}%</p>
                <p className="text-gray-600 mb-8">{result.feedback}</p>
                <Button size="lg" onClick={() => navigate(`/protocol/${id}`)}>
                  Generate Protocol
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Assessment Failed</h1>
                <p className="text-xl text-red-600 mb-6">Score: {result.score}%</p>
                <p className="text-gray-600 mb-8">{result.feedback}</p>
                <Button variant="outline" onClick={() => window.location.reload()}>
                  Try Again
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Understanding Check</h1>
        <div className="space-y-6">
          {questions.map((q, index) => (
            <div key={q.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="font-medium text-lg mb-4">
                {index + 1}. {q.question}
              </h3>
              <div className="space-y-3">
                {q.options.map((option, optIndex) => (
                  <label 
                    key={optIndex} 
                    className={`flex items-center p-3 rounded-md border cursor-pointer transition-colors ${
                      answers[q.id] === optIndex 
                        ? 'border-primary bg-blue-50' 
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <input 
                      type="radio" 
                      name={`question-${q.id}`} 
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                      checked={answers[q.id] === optIndex}
                      onChange={() => handleOptionSelect(q.id, optIndex)}
                    />
                    <span className="ml-3 text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 flex justify-end">
          <Button 
            size="lg" 
            onClick={handleSubmit} 
            disabled={Object.keys(answers).length < questions.length || submitting}
          >
            {submitting ? 'Submitting...' : 'Submit Answers'}
          </Button>
        </div>
      </div>
    </div>
  );
}
