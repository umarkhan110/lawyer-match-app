import React from 'react';

interface BudgetSliderProps {
  totalBudget: number;
  downPayment: number;
  onTotalBudgetChange: (value: number) => void;
  onDownPaymentChange: (value: number) => void;
}

export const BudgetSlider: React.FC<BudgetSliderProps> = ({
  totalBudget,
  downPayment,
  onTotalBudgetChange,
  onDownPaymentChange,
}) => {
  return (
    <div className="space-y-6 p-4 bg-white rounded-lg shadow">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Total Budget: ${totalBudget.toLocaleString()}
        </label>
        <input
          type="range"
          min="0"
          max="100000"
          step="1000"
          value={totalBudget}
          onChange={(e) => onTotalBudgetChange(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>$0</span>
          <span>$100,000</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Down Payment: ${downPayment.toLocaleString()}
        </label>
        <input
          type="range"
          min="0"
          max="10000"
          step="100"
          value={downPayment}
          onChange={(e) => onDownPaymentChange(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>$0</span>
          <span>$10,000</span>
        </div>
      </div>
    </div>
  );
};