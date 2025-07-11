import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, BookOpen, Trophy, Target, TrendingUp, Gamepad2, Star } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Duolingo Finance
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to="/register">
                <Button>Start Learning</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Learn Personal Finance Like a Game
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Master budgeting, saving, investing, and credit through interactive lessons, 
            quizzes, and challenges. Build financial literacy while having fun!
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/register">
              <Button size="lg" className="flex items-center">
                Start Learning <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg">
                Login
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card>
            <CardHeader>
              <Gamepad2 className="h-12 w-12 text-blue-600 mb-4" />
              <CardTitle>Interactive Learning</CardTitle>
              <CardDescription>
                Engage with drag-and-drop activities, matching games, and real-world scenarios 
                that make learning finance fun and memorable.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Trophy className="h-12 w-12 text-green-600 mb-4" />
              <CardTitle>Progress Tracking</CardTitle>
              <CardDescription>
                Earn badges, maintain streaks, and track your progress through multiple 
                lesson paths covering all aspects of personal finance.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Target className="h-12 w-12 text-purple-600 mb-4" />
              <CardTitle>Practical Skills</CardTitle>
              <CardDescription>
                Learn real-world financial skills like budgeting, saving, investing, 
                and managing credit that you can apply immediately.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Learning Paths Preview */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Learning Paths
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 border-2 border-blue-200 rounded-lg">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Budgeting Basics</h4>
              <p className="text-gray-600 text-sm">Learn to create and manage a budget</p>
            </div>
            
            <div className="text-center p-6 border-2 border-green-200 rounded-lg">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Saving & Emergency Funds</h4>
              <p className="text-gray-600 text-sm">Build financial security through smart saving</p>
            </div>
            
            <div className="text-center p-6 border-2 border-yellow-200 rounded-lg">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-yellow-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Credit & Debt</h4>
              <p className="text-gray-600 text-sm">Master credit scores and debt management</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">
            Ready to Transform Your Financial Future?
          </h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Join thousands of learners who are building financial confidence through our 
            interactive, game-like approach to personal finance education.
          </p>
          <Link to="/register">
            <Button size="lg" variant="secondary" className="flex items-center mx-auto">
              Start Your Journey <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Home;