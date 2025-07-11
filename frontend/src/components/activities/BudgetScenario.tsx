import React from 'react';
import { BudgetScenario } from '../../types';

interface BudgetScenarioProps {
  scenario: BudgetScenario;
  onComplete: () => void;
}

const BudgetScenarioComponent: React.FC<BudgetScenarioProps> = ({ scenario, onComplete }) => {
  return (
    <div className="p-6 bg-white rounded-lg border-2 border-blue-200">
      <h3 className="text-lg font-semibold mb-4 text-center">
        Budget Breakdown: ${scenario.monthlyIncome.toLocaleString()}/month
      </h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Visual Budget Bars */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-700">Visual Breakdown</h4>
          {scenario.categories.map((category, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">{category.name}</span>
                <span className="text-sm text-gray-600">{category.percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-6">
                <div
                  className="h-6 rounded-full flex items-center justify-center text-white text-sm font-medium"
                  style={{ 
                    width: `${category.percentage}%`,
                    backgroundColor: category.color 
                  }}
                >
                  ${category.amount.toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Category Details */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-700">Category Details</h4>
          {scenario.categories.map((category, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: category.color }}
                ></div>
                <span className="font-medium">{category.name}</span>
              </div>
              <div className="text-right">
                <div className="font-semibold">
                  ${category.amount.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">
                  {category.percentage}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Explanation */}
      <div className="bg-blue-50 p-4 rounded-lg mb-4">
        <h4 className="font-medium text-blue-900 mb-2">
          Understanding the 50/30/20 Rule
        </h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• <strong>50% for Needs:</strong> Essential expenses like rent, groceries, utilities</li>
          <li>• <strong>30% for Wants:</strong> Entertainment, dining out, hobbies</li>
          <li>• <strong>20% for Savings:</strong> Emergency fund, retirement, debt payments</li>
        </ul>
      </div>

      <div className="text-center">
        <button
          onClick={onComplete}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default BudgetScenarioComponent;