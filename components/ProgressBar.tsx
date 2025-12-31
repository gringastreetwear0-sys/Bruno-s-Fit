import React from 'react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
  // Normalize step to a percentage (Step 1 is start, so 0% isn't quite right, let's do relative)
  // Steps are 1, 2, 3.
  const percentage = Math.min(100, Math.max(0, ((currentStep - 1) / (totalSteps - 1)) * 100));

  return (
    <div className="w-full h-2 bg-slate-800 rounded-full mb-8 overflow-hidden">
      <div 
        className="h-full bg-primary transition-all duration-500 ease-out"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};