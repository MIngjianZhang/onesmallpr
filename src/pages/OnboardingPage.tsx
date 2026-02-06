import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import { apiClient } from '../api/client';
import { Check, Terminal, Code, BookOpen } from 'lucide-react';

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    environment: {
      hasGit: false,
      os: 'macos', // default
      hasEditor: false
    },
    skills: [] as string[],
    interests: [] as string[],
    level: 'beginner'
  });

  const updateFormData = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const updateEnvironment = (key: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      environment: { ...prev.environment, [key]: value }
    }));
  };

  const toggleSelection = (listKey: 'skills' | 'interests', item: string) => {
    setFormData(prev => {
      const list = prev[listKey];
      if (list.includes(item)) {
        return { ...prev, [listKey]: list.filter(i => i !== item) };
      }
      return { ...prev, [listKey]: [...list, item] };
    });
  };

  const handleFinish = async () => {
    setLoading(true);
    const userId = localStorage.getItem('userId');
    try {
      await apiClient.post('/auth/onboarding', { userId, data: formData });
      navigate('/profile'); // Or /discover
    } catch (error) {
      console.error('Onboarding failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Progress Bar */}
        <div className="bg-gray-100 h-2 w-full">
          <div 
            className="bg-primary h-full transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        <div className="p-8">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800">
              {step === 1 && "Let's check your cockpit 🚀"}
              {step === 2 && "What are your superpowers? ⚡"}
              {step === 3 && "Choose your mission 🎯"}
            </h2>
            <p className="text-gray-500 mt-2">
              {step === 1 && "We need to ensure your local environment is ready for takeoff."}
              {step === 2 && "Tell us what technologies you are familiar with."}
              {step === 3 && "What kind of projects do you want to contribute to?"}
            </p>
          </div>

          {/* Step 1: Environment */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">How should we call you?</label>
                <input
                  type="text"
                  placeholder="Enter your username"
                  className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2 border"
                  value={formData.username}
                  onChange={(e) => updateFormData('username', e.target.value)}
                />
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h3 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                  <Terminal className="h-5 w-5" /> Local Environment Check
                </h3>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="form-checkbox h-5 w-5 text-primary rounded"
                      checked={formData.environment.hasGit}
                      onChange={(e) => updateEnvironment('hasGit', e.target.checked)}
                    />
                    <span>I have <strong>Git</strong> installed and configured.</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="form-checkbox h-5 w-5 text-primary rounded"
                      checked={formData.environment.hasEditor}
                      onChange={(e) => updateEnvironment('hasEditor', e.target.checked)}
                    />
                    <span>I have a Code Editor (VS Code, Trae, etc.) installed.</span>
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Operating System</label>
                <select 
                  className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2 border"
                  value={formData.environment.os}
                  onChange={(e) => updateEnvironment('os', e.target.value)}
                >
                  <option value="macos">macOS</option>
                  <option value="windows">Windows</option>
                  <option value="linux">Linux</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 2: Skills */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <Code className="h-5 w-5" /> Programming Languages
                </h3>
                <div className="flex flex-wrap gap-2">
                  {['JavaScript', 'TypeScript', 'Python', 'Java', 'HTML/CSS', 'Go', 'Rust'].map(skill => (
                    <button
                      key={skill}
                      onClick={() => toggleSelection('skills', skill)}
                      className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                        formData.skills.includes(skill)
                          ? 'bg-primary text-white border-primary'
                          : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level</label>
                <div className="grid grid-cols-3 gap-4">
                  {['beginner', 'intermediate', 'advanced'].map(lvl => (
                    <button
                      key={lvl}
                      onClick={() => updateFormData('level', lvl)}
                      className={`p-3 rounded-lg border text-center capitalize ${
                        formData.level === lvl
                          ? 'bg-primary/10 border-primary text-primary font-bold'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Interests */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <BookOpen className="h-5 w-5" /> Areas of Interest
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {['Web Development', 'Artificial Intelligence', 'Data Science', 'Documentation', 'Game Development', 'DevOps'].map(interest => (
                    <button
                      key={interest}
                      onClick={() => toggleSelection('interests', interest)}
                      className={`p-4 rounded-lg border text-left transition-all ${
                        formData.interests.includes(interest)
                          ? 'bg-secondary/10 border-secondary ring-1 ring-secondary'
                          : 'bg-white border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{interest}</span>
                        {formData.interests.includes(interest) && <Check className="h-4 w-4 text-secondary" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-10 flex justify-between">
            {step > 1 ? (
              <Button variant="outline" onClick={() => setStep(step - 1)}>
                Back
              </Button>
            ) : (
              <div></div>
            )}
            
            {step < 3 ? (
              <Button onClick={() => setStep(step + 1)}>
                Next Step
              </Button>
            ) : (
              <Button onClick={handleFinish} disabled={loading}>
                {loading ? 'Saving...' : 'Complete Setup'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
