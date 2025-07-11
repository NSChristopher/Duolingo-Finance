import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LessonPath } from '../types';
import { lessonApi } from '../lib/lessons';
import { 
  Calculator, 
  PiggyBank, 
  CreditCard, 
  BookOpen, 
  ArrowRight,
  Star,
  Trophy
} from 'lucide-react';
import { Button } from '../components/ui/button';

const iconMap = {
  Calculator,
  PiggyBank,
  CreditCard,
  BookOpen,
  Star,
  Trophy
};

const LessonPaths: React.FC = () => {
  const [paths, setPaths] = useState<LessonPath[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPaths = async () => {
      try {
        const data = await lessonApi.getLessonPaths();
        setPaths(data);
      } catch (err) {
        setError('Failed to load lesson paths');
        console.error('Error loading lesson paths:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPaths();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading lesson paths...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg">{error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-4"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Learning Path
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start your journey to financial literacy with our interactive lessons. 
            Pick a topic that interests you and begin learning today!
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {paths.map((path) => {
            const IconComponent = iconMap[path.icon as keyof typeof iconMap] || BookOpen;
            
            return (
              <Link
                key={path.id}
                to={`/lessons/path/${path.id}`}
                className="group"
              >
                <div 
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border-2 border-transparent hover:border-blue-200"
                  style={{ borderTopColor: path.color }}
                >
                  <div 
                    className="h-2"
                    style={{ backgroundColor: path.color }}
                  ></div>
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div 
                        className="p-3 rounded-full"
                        style={{ backgroundColor: `${path.color}20` }}
                      >
                        <IconComponent 
                          className="h-8 w-8"
                          style={{ color: path.color }}
                        />
                      </div>
                      <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {path.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {path.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {path.lessons?.length || 0} lessons
                      </span>
                      <div className="flex items-center space-x-1 text-yellow-500">
                        <Star className="h-4 w-4 fill-current" />
                        <Star className="h-4 w-4 fill-current" />
                        <Star className="h-4 w-4 fill-current" />
                        <Star className="h-4 w-4 fill-current" />
                        <Star className="h-4 w-4 fill-current" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            New to personal finance?
          </p>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            We recommend starting with "Budgeting Basics" to build a strong foundation 
            for your financial journey.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LessonPaths;