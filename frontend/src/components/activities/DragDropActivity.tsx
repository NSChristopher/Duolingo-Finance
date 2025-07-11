import React, { useState } from 'react';
import { DragDropCategory, DragDropItem } from '../../types';
import { CheckCircle, X } from 'lucide-react';
import { Button } from '../ui/button';

interface DragDropActivityProps {
  categories: DragDropCategory[];
  items: DragDropItem[];
  instructions: string;
  onComplete: (score: number) => void;
}

const DragDropActivity: React.FC<DragDropActivityProps> = ({ 
  categories, 
  items, 
  instructions, 
  onComplete 
}) => {
  const [categoryItems, setCategoryItems] = useState<{ [key: string]: string[] }>(
    categories.reduce((acc, cat) => ({ ...acc, [cat.name]: [] }), {})
  );
  const [availableItems, setAvailableItems] = useState(items.map(item => item.text));
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleDragStart = (item: string) => {
    setDraggedItem(item);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (categoryName: string) => {
    if (!draggedItem) return;

    // Remove from available items
    setAvailableItems(prev => prev.filter(item => item !== draggedItem));
    
    // Add to category
    setCategoryItems(prev => ({
      ...prev,
      [categoryName]: [...prev[categoryName], draggedItem]
    }));

    setDraggedItem(null);

    // Check if all items are placed
    if (availableItems.length === 1) { // Will be 0 after this drop
      setCompleted(true);
    }
  };

  const handleItemClick = (item: string, fromCategory?: string) => {
    if (fromCategory) {
      // Move item back to available items
      setCategoryItems(prev => ({
        ...prev,
        [fromCategory]: prev[fromCategory].filter(i => i !== item)
      }));
      setAvailableItems(prev => [...prev, item]);
      setCompleted(false);
      setShowResults(false);
    } else {
      // For mobile: select item to place
      setDraggedItem(item);
    }
  };

  const handleCategoryClick = (categoryName: string) => {
    if (draggedItem && availableItems.includes(draggedItem)) {
      handleDrop(categoryName);
    }
  };

  const checkAnswers = () => {
    let correct = 0;
    let total = 0;

    items.forEach(item => {
      total++;
      const placedInCategory = Object.keys(categoryItems).find(catName => 
        categoryItems[catName].includes(item.text)
      );
      if (placedInCategory === item.category) {
        correct++;
      }
    });

    const score = Math.round((correct / total) * 100);
    setShowResults(true);
    onComplete(score);
  };

  const reset = () => {
    setCategoryItems(categories.reduce((acc, cat) => ({ ...acc, [cat.name]: [] }), {}));
    setAvailableItems(items.map(item => item.text));
    setDraggedItem(null);
    setCompleted(false);
    setShowResults(false);
  };

  const getItemCorrectness = (itemText: string, categoryName: string) => {
    if (!showResults) return null;
    const correctCategory = items.find(item => item.text === itemText)?.category;
    return correctCategory === categoryName;
  };

  return (
    <div className="p-6 bg-white rounded-lg border-2 border-blue-200">
      <h3 className="text-lg font-semibold mb-2 text-center">
        Drag & Drop Challenge
      </h3>
      <p className="text-gray-600 mb-6 text-center">
        {instructions}
      </p>

      {/* Available Items */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-700 mb-3">Available Items</h4>
        <div className="flex flex-wrap gap-2 min-h-[60px] p-3 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          {availableItems.map((item) => (
            <div
              key={item}
              draggable
              onDragStart={() => handleDragStart(item)}
              onClick={() => handleItemClick(item)}
              className={`px-3 py-2 bg-blue-100 border border-blue-300 rounded-lg cursor-move hover:bg-blue-200 transition-colors select-none ${
                draggedItem === item ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              {item}
            </div>
          ))}
          {availableItems.length === 0 && (
            <p className="text-gray-500 text-sm w-full text-center py-4">
              All items have been categorized!
            </p>
          )}
        </div>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {categories.map((category) => (
          <div
            key={category.name}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(category.name)}
            onClick={() => handleCategoryClick(category.name)}
            className={`min-h-[120px] p-4 border-2 border-dashed rounded-lg transition-all ${
              draggedItem 
                ? 'border-green-400 bg-green-50 cursor-pointer' 
                : 'border-gray-300 bg-gray-50'
            }`}
          >
            <h5 className="font-medium text-gray-800 mb-3 text-center">
              {category.name}
            </h5>
            <div className="space-y-2">
              {categoryItems[category.name].map((item) => {
                const isCorrect = getItemCorrectness(item, category.name);
                return (
                  <div
                    key={item}
                    onClick={() => handleItemClick(item, category.name)}
                    className={`px-3 py-2 rounded-lg cursor-pointer transition-all flex items-center justify-between ${
                      showResults
                        ? isCorrect
                          ? 'bg-green-100 border border-green-300'
                          : 'bg-red-100 border border-red-300'
                        : 'bg-white border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-sm">{item}</span>
                    {showResults && (
                      isCorrect 
                        ? <CheckCircle className="h-4 w-4 text-green-500" />
                        : <X className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="text-center">
        {completed && !showResults && (
          <Button onClick={checkAnswers} className="mr-3">
            Check Answers
          </Button>
        )}
        
        {showResults && (
          <div className="space-y-4">
            <div className="text-lg font-semibold">
              Score: {Math.round((
                items.filter(item => {
                  const placedInCategory = Object.keys(categoryItems).find(catName => 
                    categoryItems[catName].includes(item.text)
                  );
                  return placedInCategory === item.category;
                }).length / items.length
              ) * 100)}%
            </div>
            <div className="space-x-3">
              <Button onClick={() => onComplete(Math.round((
                items.filter(item => {
                  const placedInCategory = Object.keys(categoryItems).find(catName => 
                    categoryItems[catName].includes(item.text)
                  );
                  return placedInCategory === item.category;
                }).length / items.length
              ) * 100))}>
                Continue
              </Button>
              <Button variant="outline" onClick={reset}>
                Try Again
              </Button>
            </div>
          </div>
        )}
        
        {!completed && (
          <p className="text-gray-600 text-sm">
            Drag items into the correct categories or click to select and place them.
          </p>
        )}
      </div>
    </div>
  );
};

export default DragDropActivity;