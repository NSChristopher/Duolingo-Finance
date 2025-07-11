import React, { useState } from 'react';
import { MatchingPair } from '../../types';
import { CheckCircle, X } from 'lucide-react';
import { Button } from '../ui/button';

interface MatchingActivityProps {
  pairs: MatchingPair[];
  onComplete: (score: number) => void;
}

const MatchingActivity: React.FC<MatchingActivityProps> = ({ pairs, onComplete }) => {
  const [leftItems] = useState(pairs.map(p => p.left));
  const [rightItems] = useState([...pairs.map(p => p.right)].sort(() => Math.random() - 0.5));
  const [matches, setMatches] = useState<{ [key: string]: string }>({});
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleLeftClick = (item: string) => {
    if (completed) return;
    setSelectedLeft(selectedLeft === item ? null : item);
  };

  const handleRightClick = (item: string) => {
    if (completed || !selectedLeft) return;
    
    const newMatches = { ...matches, [selectedLeft]: item };
    setMatches(newMatches);
    setSelectedLeft(null);

    if (Object.keys(newMatches).length === pairs.length) {
      setCompleted(true);
      setShowResults(true);
    }
  };

  const checkAnswer = () => {
    let correct = 0;
    pairs.forEach(pair => {
      if (matches[pair.left] === pair.right) {
        correct++;
      }
    });
    
    const score = Math.round((correct / pairs.length) * 100);
    onComplete(score);
  };

  const isCorrectMatch = (left: string, right: string) => {
    return pairs.find(p => p.left === left && p.right === right);
  };

  const reset = () => {
    setMatches({});
    setSelectedLeft(null);
    setCompleted(false);
    setShowResults(false);
  };

  return (
    <div className="p-6 bg-white rounded-lg border-2 border-blue-200">
      <h3 className="text-lg font-semibold mb-4 text-center">
        Match the terms with their definitions
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Left Column */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-700 text-center">Terms</h4>
          {leftItems.map((item) => (
            <button
              key={item}
              onClick={() => handleLeftClick(item)}
              disabled={completed}
              className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                selectedLeft === item
                  ? 'border-blue-500 bg-blue-50'
                  : matches[item]
                  ? showResults && isCorrectMatch(item, matches[item])
                    ? 'border-green-500 bg-green-50'
                    : showResults
                    ? 'border-red-500 bg-red-50'
                    : 'border-blue-200 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{item}</span>
                {matches[item] && showResults && (
                  isCorrectMatch(item, matches[item]) 
                    ? <CheckCircle className="h-5 w-5 text-green-500" />
                    : <X className="h-5 w-5 text-red-500" />
                )}
              </div>
              {matches[item] && (
                <div className="text-sm text-gray-600 mt-1">
                  → {matches[item]}
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Right Column */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-700 text-center">Definitions</h4>
          {rightItems.map((item) => (
            <button
              key={item}
              onClick={() => handleRightClick(item)}
              disabled={completed || !selectedLeft}
              className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                Object.values(matches).includes(item)
                  ? 'border-gray-300 bg-gray-100 opacity-50'
                  : selectedLeft
                  ? 'border-green-300 hover:border-green-500 hover:bg-green-50'
                  : 'border-gray-200'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="text-center">
        {completed && !showResults && (
          <Button onClick={checkAnswer} className="mr-3">
            Check Answers
          </Button>
        )}
        
        {showResults && (
          <div className="space-y-4">
            <div className="text-lg font-semibold">
              Score: {Math.round((Object.keys(matches).filter(left => 
                isCorrectMatch(left, matches[left])
              ).length / pairs.length) * 100)}%
            </div>
            <div className="space-x-3">
              <Button onClick={checkAnswer}>
                Continue
              </Button>
              <Button variant="outline" onClick={reset}>
                Try Again
              </Button>
            </div>
          </div>
        )}
        
        {Object.keys(matches).length === 0 && (
          <p className="text-gray-600 text-sm">
            Click a term on the left, then click its matching definition on the right.
          </p>
        )}
      </div>
    </div>
  );
};

export default MatchingActivity;