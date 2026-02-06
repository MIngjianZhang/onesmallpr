import { ArrowRight, CheckCircle, Search, GitPullRequest, TrendingUp } from 'lucide-react';
import Button from '../components/common/Button';
import TaskCard from '../components/common/TaskCard';
import { Link } from 'react-router-dom';

export default function HomePage() {
  const steps = [
    {
      icon: <CheckCircle className="h-8 w-8 text-secondary" />,
      title: "1. Onboarding",
      description: "Assess your skills and prepare your environment."
    },
    {
      icon: <Search className="h-8 w-8 text-secondary" />,
      title: "2. Discovery",
      description: "Find tasks matched to your skill level (Difficulty 0-1)."
    },
    {
      icon: <GitPullRequest className="h-8 w-8 text-secondary" />,
      title: "3. Co-creation",
      description: "Get AI guidance and generate a task protocol."
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-secondary" />,
      title: "4. Evolution",
      description: "Build your knowledge graph with every PR."
    }
  ];

  const hotTasks = [
    {
      id: "1",
      title: "Fix typo in README",
      repo: "facebook/react",
      tags: ["documentation", "good first issue"],
      difficulty: 0,
      description: "A simple task to fix a typo in the main documentation."
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
    }
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-blue-900 text-white py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6 leading-tight">
            让每一次贡献，<br />都成为进化的台阶。
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Empowering AI beginners to build their technical voice through real open source contributions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/discover" size="lg" variant="secondary" className="gap-2">
              Start Journey <ArrowRight className="h-5 w-5" />
            </Button>
            <Button href="https://github.com/onesmallpr" size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10 hover:text-white">
              View on GitHub
            </Button>
          </div>
        </div>
      </section>

      {/* Features/Steps Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center text-center p-6 rounded-lg bg-gray-50 hover:shadow-lg transition-shadow">
                <div className="mb-4 p-3 bg-blue-50 rounded-full">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hot Tasks Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800">Hot Tasks</h2>
            <Link to="/discover" className="text-primary hover:underline flex items-center gap-1">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {hotTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
