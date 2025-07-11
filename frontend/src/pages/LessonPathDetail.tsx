import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { LessonPath } from '../types';
import { lessonApi } from '../lib/lessons';
import { 
  ArrowLeft,
  BookOpen,
  CheckCircle,
  Circle,
  Play,
  Lock,
  Star
} from 'lucide-react';
import { Button } from '../components/ui/button';

const LessonPathDetail: React.FC = () => {
  const { pathId } = useParams<{ pathId: string }>();
  const [path, setPath] = useState<LessonPath | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPath = async () => {
      if (!pathId) return;
      
      try {
        const data = await lessonApi.getLessonPath(parseInt(pathId));
        setPath(data);
      } catch (err) {
        setError('Failed to load lesson path');
        console.error('Error loading lesson path:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPath();
  }, [pathId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading lessons...</p>
        </div>
      </div>
    );
  }

  if (error || !path) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg">{error || 'Lesson path not found'}</p>
          <Link to="/lessons" className="mt-4 inline-block">
            <Button>Back to Lesson Paths</Button>
          </Link>
        </div>
      </div>
    );
  }

  const completedLessons = path.lessons?.filter(lesson => 
    lesson.userProgress?.[0]?.completed
  ).length || 0;
  
  const totalLessons = path.lessons?.length || 0;
  const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link to="/lessons" className="mr-4">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
        </div>

        {/* Path Info */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {path.title}
              </h1>
              <p className="text-lg text-gray-600 mb-4">
                {path.description}
              </p>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>{totalLessons} lessons</span>
                <span>•</span>
                <span>{completedLessons} completed</span>
              </div>
            </div>
            <div 
              className="p-4 rounded-full ml-6"
              style={{ backgroundColor: `${path.color}20` }}
            >
              <BookOpen 
                className="h-12 w-12"
                style={{ color: path.color }}
              />
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm text-gray-600">
                {Math.round(progressPercentage)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="h-3 rounded-full transition-all duration-300"
                style={{ 
                  width: `${progressPercentage}%`,
                  backgroundColor: path.color 
                }}
              ></div>
            </div>
          </div>

          {/* Achievement Section */}
          {progressPercentage === 100 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <Star className="h-6 w-6 text-green-600 mr-3" />
                <div>
                  <h3 className="text-lg font-semibold text-green-800">
                    Path Complete!
                  </h3>
                  <p className="text-green-600">
                    Congratulations! You've mastered {path.title}.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Lessons List */}
        <div className="space-y-4">
          {path.lessons?.map((lesson, index) => {
            const isCompleted = lesson.userProgress?.[0]?.completed || false;
            const isUnlocked = index === 0 || 
              path.lessons?.[index - 1]?.userProgress?.[0]?.completed || false;
            
            return (
              <div
                key={lesson.id}
                className={`bg-white rounded-lg shadow-md border-2 transition-all duration-200 ${
                  isUnlocked 
                    ? 'border-transparent hover:border-blue-200 hover:shadow-lg' 
                    : 'border-gray-200 opacity-60'
                }`}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      {/* Status Icon */}
                      <div className="flex-shrink-0">
                        {isCompleted ? (
                          <CheckCircle className="h-8 w-8 text-green-500" />
                        ) : isUnlocked ? (
                          <Circle className="h-8 w-8 text-gray-400" />
                        ) : (
                          <Lock className="h-8 w-8 text-gray-300" />
                        )}
                      </div>

                      {/* Lesson Info */}
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {lesson.title}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {lesson.description}
                        </p>
                        {lesson.userProgress?.[0]?.score && (
                          <div className="mt-2 flex items-center">
                            <Star className="h-4 w-4 text-yellow-500 mr-1" />
                            <span className="text-sm text-gray-600">
                              Score: {lesson.userProgress[0].score}/100
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex-shrink-0 ml-4">
                      {isUnlocked ? (
                        <Link to={`/lessons/${lesson.id}`}>
                          <Button 
                            className="min-w-[100px]"
                            style={{ backgroundColor: path.color }}
                          >
                            {isCompleted ? (
                              <>Review</>
                            ) : (
                              <>
                                <Play className="h-4 w-4 mr-2" />
                                Start
                              </>
                            )}
                          </Button>
                        </Link>
                      ) : (
                        <Button disabled className="min-w-[100px]">
                          <Lock className="h-4 w-4 mr-2" />
                          Locked
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Next Steps */}
        {progressPercentage === 100 && (
          <div className="mt-8 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Ready for the next challenge?
            </h3>
            <Link to="/lessons">
              <Button size="lg">
                Explore More Paths
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonPathDetail;