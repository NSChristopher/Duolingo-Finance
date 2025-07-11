import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ProgressSummary } from '../types';
import { lessonApi } from '../lib/lessons';
import { 
  Trophy, 
  Flame, 
  Star, 
  BookOpen, 
  Target,
  TrendingUp,
  Calendar,
  Award
} from 'lucide-react';
import { Button } from '../components/ui/button';

const ProgressDashboard: React.FC = () => {
  const [progress, setProgress] = useState<ProgressSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const data = await lessonApi.getProgressSummary();
        setProgress(data);
      } catch (err) {
        setError('Failed to load progress data');
        console.error('Error loading progress:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your progress...</p>
        </div>
      </div>
    );
  }

  if (error || !progress) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg">{error || 'Failed to load progress'}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const iconMap = {
    Trophy,
    Star,
    Flame,
    Award
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Your Progress Dashboard
          </h1>
          <p className="text-xl text-gray-600">
            Track your financial learning journey
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Current Streak */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-100 rounded-full">
                <Flame className="h-8 w-8 text-orange-600" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-900">
                  {progress.currentStreak}
                </div>
                <div className="text-sm text-gray-600">Current Streak</div>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Best: {progress.longestStreak} days
            </div>
          </div>

          {/* Lessons Completed */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-900">
                  {progress.totalLessonsCompleted}
                </div>
                <div className="text-sm text-gray-600">Lessons Done</div>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Keep it up!
            </div>
          </div>

          {/* Badges Earned */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-100 rounded-full">
                <Trophy className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-900">
                  {progress.badges.length}
                </div>
                <div className="text-sm text-gray-600">Badges Earned</div>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Achievements unlocked
            </div>
          </div>

          {/* Overall Progress */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-full">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-900">
                  {Math.round((progress.pathProgress.reduce((sum, path) => 
                    sum + (path.completed / path.total), 0) / 
                    Math.max(progress.pathProgress.length, 1)) * 100)}%
                </div>
                <div className="text-sm text-gray-600">Average Progress</div>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Across all paths
            </div>
          </div>
        </div>

        {/* Learning Paths Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Path Progress */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Learning Paths</h2>
            <div className="space-y-4">
              {progress.pathProgress.map((pathProgress) => {
                const percentage = Math.round((pathProgress.completed / pathProgress.total) * 100);
                return (
                  <div key={pathProgress.path.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900">
                        {pathProgress.path.title}
                      </h3>
                      <span className="text-sm text-gray-600">
                        {pathProgress.completed}/{pathProgress.total} lessons
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                      <div 
                        className="h-3 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${percentage}%`,
                          backgroundColor: pathProgress.path.color 
                        }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{percentage}% complete</span>
                      <Link to={`/lessons/path/${pathProgress.path.id}`}>
                        <Button size="sm">
                          {percentage === 100 ? 'Review' : 'Continue'}
                        </Button>
                      </Link>
                    </div>
                  </div>
                );
              })}
              
              {progress.pathProgress.length === 0 && (
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No progress yet</p>
                  <Link to="/lessons">
                    <Button>Start Learning</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Badges */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Achievements</h2>
            <div className="grid grid-cols-2 gap-4">
              {progress.badges.map((badge) => {
                const IconComponent = iconMap[badge.icon as keyof typeof iconMap] || Trophy;
                return (
                  <div 
                    key={badge.id}
                    className="p-4 border rounded-lg text-center hover:shadow-md transition-shadow"
                  >
                    <div 
                      className="p-3 rounded-full mx-auto mb-3 w-fit"
                      style={{ backgroundColor: `${badge.color}20` }}
                    >
                      <IconComponent 
                        className="h-6 w-6"
                        style={{ color: badge.color }}
                      />
                    </div>
                    <h3 className="font-medium text-gray-900 mb-1">{badge.name}</h3>
                    <p className="text-xs text-gray-600">{badge.description}</p>
                  </div>
                );
              })}
              
              {progress.badges.length === 0 && (
                <div className="col-span-2 text-center py-8">
                  <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No badges earned yet</p>
                  <p className="text-sm text-gray-500">Complete lessons to earn achievements</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/lessons" className="group">
              <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all group-hover:shadow-md">
                <div className="text-center">
                  <BookOpen className="h-8 w-8 text-gray-400 group-hover:text-blue-600 mx-auto mb-3" />
                  <h3 className="font-medium text-gray-900 group-hover:text-blue-900">
                    Browse Lessons
                  </h3>
                  <p className="text-sm text-gray-600">
                    Explore all learning paths
                  </p>
                </div>
              </div>
            </Link>

            <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg">
              <div className="text-center">
                <Target className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                <h3 className="font-medium text-gray-900">Daily Goal</h3>
                <p className="text-sm text-gray-600">
                  {progress.currentStreak > 0 
                    ? `${progress.currentStreak} day streak!` 
                    : 'Start your streak today'
                  }
                </p>
              </div>
            </div>

            <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg">
              <div className="text-center">
                <Calendar className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                <h3 className="font-medium text-gray-900">Study Schedule</h3>
                <p className="text-sm text-gray-600">
                  Coming soon - personalized reminders
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressDashboard;