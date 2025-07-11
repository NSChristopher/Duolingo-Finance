import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Lesson, LessonContent } from '../types';
import { lessonApi } from '../lib/lessons';
import { ArrowLeft, ArrowRight, CheckCircle, X } from 'lucide-react';
import { Button } from '../components/ui/button';
import MatchingActivity from '../components/activities/MatchingActivity';
import DragDropActivity from '../components/activities/DragDropActivity';
import BudgetScenarioComponent from '../components/activities/BudgetScenario';
import { toast } from 'sonner';

const LessonPlayer: React.FC = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [content, setContent] = useState<LessonContent | null>(null);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [quizResults, setQuizResults] = useState<boolean[]>([]);
  const [showQuizResults, setShowQuizResults] = useState(false);
  const [activityScores, setActivityScores] = useState<number[]>([]);

  useEffect(() => {
    const fetchLesson = async () => {
      if (!lessonId) return;
      
      try {
        const data = await lessonApi.getLesson(parseInt(lessonId));
        setLesson(data);
        
        const parsedContent = JSON.parse(data.content) as LessonContent;
        setContent(parsedContent);
        
        // Start the lesson
        await lessonApi.startLesson(parseInt(lessonId));
      } catch (err) {
        setError('Failed to load lesson');
        console.error('Error loading lesson:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [lessonId]);

  const handleNext = () => {
    if (!content) return;

    if (showQuiz) {
      if (currentQuizIndex < content.quiz!.length - 1) {
        setCurrentQuizIndex(prev => prev + 1);
      } else {
        completeLesson();
      }
    } else {
      if (currentSectionIndex < content.sections.length - 1) {
        setCurrentSectionIndex(prev => prev + 1);
      } else if (content.quiz && content.quiz.length > 0) {
        setShowQuiz(true);
      } else {
        completeLesson();
      }
    }
  };

  const handleBack = () => {
    if (showQuiz) {
      if (currentQuizIndex > 0) {
        setCurrentQuizIndex(prev => prev - 1);
      } else {
        setShowQuiz(false);
        setCurrentSectionIndex(content!.sections.length - 1);
      }
    } else {
      if (currentSectionIndex > 0) {
        setCurrentSectionIndex(prev => prev - 1);
      }
    }
  };

  const handleQuizAnswer = (answerIndex: number) => {
    if (!content?.quiz) return;

    const newAnswers = [...quizAnswers];
    newAnswers[currentQuizIndex] = answerIndex;
    setQuizAnswers(newAnswers);

    const isCorrect = answerIndex === content.quiz[currentQuizIndex].correct;
    const newResults = [...quizResults];
    newResults[currentQuizIndex] = isCorrect;
    setQuizResults(newResults);

    setShowQuizResults(true);
  };

  const calculateFinalScore = () => {
    const quizScore = quizResults.length > 0 
      ? (quizResults.filter(r => r).length / quizResults.length) * 100 
      : 100;
    
    const activityScore = activityScores.length > 0 
      ? activityScores.reduce((sum, score) => sum + score, 0) / activityScores.length 
      : 100;

    return Math.round((quizScore + activityScore) / 2);
  };

  const completeLesson = async () => {
    if (!lessonId) return;

    const finalScore = calculateFinalScore();

    try {
      await lessonApi.completeLesson(parseInt(lessonId), finalScore);
      toast.success('Lesson completed!', {
        description: `You scored ${finalScore}%`
      });
      
      // Navigate back to the lesson path
      if (lesson?.path) {
        navigate(`/lessons/path/${lesson.path.id}`);
      } else {
        navigate('/lessons');
      }
    } catch (err) {
      console.error('Error completing lesson:', err);
      toast.error('Failed to save lesson progress');
    }
  };

  const handleActivityComplete = (score: number) => {
    setActivityScores(prev => [...prev, score]);
    setTimeout(() => handleNext(), 1000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading lesson...</p>
        </div>
      </div>
    );
  }

  if (error || !lesson || !content) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg">{error || 'Lesson not found'}</p>
          <Button onClick={() => navigate('/lessons')} className="mt-4">
            Back to Lessons
          </Button>
        </div>
      </div>
    );
  }

  const currentSection = content.sections[currentSectionIndex];
  const currentQuiz = content.quiz?.[currentQuizIndex];
  const totalSteps = content.sections.length + (content.quiz?.length || 0);
  const currentStep = showQuiz 
    ? content.sections.length + currentQuizIndex + 1 
    : currentSectionIndex + 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="outline" onClick={() => navigate(`/lessons/path/${lesson.pathId}`)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Exit Lesson
          </Button>
          
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">{lesson.title}</h1>
            <p className="text-gray-600">Step {currentStep} of {totalSteps}</p>
          </div>
          
          <div className="w-20" /> {/* Spacer */}
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          {!showQuiz ? (
            // Lesson Section
            <div>
              <h2 className="text-xl font-bold mb-4">{currentSection.title}</h2>
              
              {currentSection.type === 'intro' || currentSection.type === 'explanation' ? (
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {currentSection.content}
                  </p>
                </div>
              ) : currentSection.type === 'interactive' ? (
                <div>
                  {currentSection.activity === 'matching' && currentSection.pairs && (
                    <MatchingActivity 
                      pairs={currentSection.pairs}
                      onComplete={handleActivityComplete}
                    />
                  )}
                  
                  {currentSection.activity === 'drag-drop' && currentSection.categories && currentSection.items && (
                    <DragDropActivity 
                      categories={currentSection.categories}
                      items={currentSection.items}
                      instructions={currentSection.instructions || ''}
                      onComplete={handleActivityComplete}
                    />
                  )}
                  
                  {currentSection.activity === 'scenario' && currentSection.scenario && (
                    <BudgetScenarioComponent 
                      scenario={currentSection.scenario}
                      onComplete={() => handleActivityComplete(100)}
                    />
                  )}
                </div>
              ) : null}
            </div>
          ) : (
            // Quiz Section
            <div>
              <h2 className="text-xl font-bold mb-6">Quiz Time!</h2>
              
              {currentQuiz && (
                <div>
                  <p className="text-lg mb-6">{currentQuiz.question}</p>
                  
                  <div className="space-y-3 mb-6">
                    {currentQuiz.options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuizAnswer(index)}
                        disabled={showQuizResults}
                        className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                          showQuizResults
                            ? index === currentQuiz.correct
                              ? 'border-green-500 bg-green-50'
                              : quizAnswers[currentQuizIndex] === index
                              ? 'border-red-500 bg-red-50'
                              : 'border-gray-200 bg-gray-50'
                            : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{option}</span>
                          {showQuizResults && (
                            index === currentQuiz.correct ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : quizAnswers[currentQuizIndex] === index ? (
                              <X className="h-5 w-5 text-red-500" />
                            ) : null
                          )}
                        </div>
                      </button>
                    ))}
                  </div>

                  {showQuizResults && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">Explanation</h4>
                      <p className="text-blue-800">{currentQuiz.explanation}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={handleBack}
            disabled={currentSectionIndex === 0 && !showQuiz}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <Button 
            onClick={handleNext}
            disabled={showQuiz && !showQuizResults}
          >
            {currentStep === totalSteps ? 'Complete Lesson' : 'Next'}
            {currentStep !== totalSteps && <ArrowRight className="h-4 w-4 ml-2" />}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LessonPlayer;