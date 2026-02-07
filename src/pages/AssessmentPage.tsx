import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../api/client';
import Button from '../components/common/Button';
import { CheckCircle, AlertCircle, Sword, Scroll } from 'lucide-react';

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
  const [result, setResult] = useState<{ passed: boolean; score: number; feedback: string; protocol_url?: string } | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const userProfile = localStorage.getItem('userSkillLevel') || "Beginner (Python/Web)";
        
        const data = await apiClient.post(`/quests/${id}/generate-assessment`, { // Updated endpoint
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
      
      const data = await apiClient.post(`/quests/${id}/accept`, { // Updated endpoint
        answers: formattedAnswers
      });
      
      // Map response to result format
      setResult({
          passed: data.success,
          score: data.success ? 100 : 0, // Mock score for now
          feedback: data.message,
          protocol_url: data.protocol_url
      });

    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-guild-wood flex items-center justify-center text-guild-parchment animate-pulse font-heading text-xl">The Gatekeeper is preparing your trial...</div>;

  if (result) {
    return (
      <div className="bg-guild-wood min-h-screen py-8 font-serif">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <div className="bg-guild-parchment p-8 rounded shadow-2xl border-4 border-guild-bronze relative">
            {/* Wax Seal */}
            <div className={`absolute -top-6 -right-6 w-20 h-20 rounded-full border-4 shadow-lg flex items-center justify-center ${result.passed ? 'bg-guild-green border-green-800' : 'bg-guild-red border-red-900'}`}>
                {result.passed ? <CheckCircle className="text-white w-10 h-10" /> : <AlertCircle className="text-white w-10 h-10" />}
            </div>

            {result.passed ? (
              <div className="flex flex-col items-center">
                <h1 className="text-4xl font-heading font-bold text-guild-wood mb-4">Trial Passed!</h1>
                <p className="text-xl text-guild-green font-bold mb-6">Score: {result.score}%</p>
                <p className="text-guild-wood mb-8 italic">"{result.feedback}"</p>
                <div className="bg-guild-wood/10 p-6 rounded mb-8 w-full border-2 border-dashed border-guild-wood/30">
                    <Scroll className="w-12 h-12 mx-auto text-guild-bronze mb-2" />
                    <p className="font-heading font-bold">The Ancient Scroll (Protocol) is ready.</p>
                </div>
                <Button size="lg" onClick={() => navigate(`/protocol/${id}`)} className="bg-guild-gold text-guild-wood border-2 border-guild-wood hover:bg-yellow-400">
                  Claim Artifact
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <h1 className="text-4xl font-heading font-bold text-guild-wood mb-4">Trial Failed</h1>
                <p className="text-xl text-guild-red font-bold mb-6">Score: {result.score}%</p>
                <p className="text-guild-wood mb-8 italic">"{result.feedback}"</p>
                <Button variant="outline" onClick={() => window.location.reload()} className="border-guild-red text-guild-red hover:bg-red-50">
                  Challenge Again
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-guild-wood min-h-screen py-8 font-serif">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-12">
            <h1 className="text-4xl font-heading font-bold text-guild-gold mb-2 drop-shadow-md">The Gatekeeper's Trial</h1>
            <p className="text-guild-parchment-dark italic">"Prove your worth, adventurer, before you face the beast."</p>
        </div>
        
        <div className="space-y-8">
          {questions.map((q, index) => (
            <div key={q.id} className="bg-guild-parchment p-8 rounded shadow-lg border-2 border-guild-wood-light relative overflow-hidden">
              <span className="absolute top-0 left-0 bg-guild-wood text-guild-gold px-3 py-1 text-sm font-bold rounded-br">Q{index + 1}</span>
              
              <h3 className="font-heading font-bold text-xl mb-6 text-guild-wood mt-4">
                {q.question}
              </h3>
              <div className="space-y-4">
                {q.options.map((option, optIndex) => (
                  <label 
                    key={optIndex} 
                    className={`flex items-center p-4 rounded border-2 cursor-pointer transition-all ${
                      answers[q.id] === optIndex 
                        ? 'border-guild-gold bg-guild-gold/20' 
                        : 'border-guild-wood/20 hover:border-guild-wood/50 hover:bg-guild-wood/5'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 ${
                        answers[q.id] === optIndex ? 'border-guild-gold' : 'border-guild-wood/40'
                    }`}>
                        {answers[q.id] === optIndex && <div className="w-3 h-3 bg-guild-gold rounded-full" />}
                    </div>
                    <span className="text-guild-wood font-medium">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 flex justify-center pb-12">
          <Button 
            size="lg" 
            onClick={handleSubmit} 
            disabled={Object.keys(answers).length < questions.length || submitting}
            className="bg-guild-red text-white text-xl px-16 py-4 border-4 border-double border-guild-gold shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Consulting the Oracle...' : 'Submit Answers'} <Sword className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
