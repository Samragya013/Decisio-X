
import React from 'react';

interface StepperProps {
  steps: string[];
  currentStep: number;
}

export const Stepper: React.FC<StepperProps> = ({ steps, currentStep }) => {
  return (
    <nav aria-label="Progress">
      <ol role="list" className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8">
        {steps.map((step, index) => (
          <li key={step} className="md:flex-1 w-full">
            {index <= currentStep ? (
              <div className="group flex flex-col border-l-4 md:border-l-0 md:border-t-4 border-cyan-500 py-2 pl-4 md:pl-0 md:pt-4">
                <span className="text-sm font-medium text-cyan-400">{`Step ${index + 1}`}</span>
                <span className="text-sm font-medium text-slate-200">{step}</span>
              </div>
            ) : (
              <div className="group flex flex-col border-l-4 md:border-l-0 md:border-t-4 border-slate-600 py-2 pl-4 md:pl-0 md:pt-4">
                <span className="text-sm font-medium text-slate-500">{`Step ${index + 1}`}</span>
                <span className="text-sm font-medium text-slate-500">{step}</span>
              </div>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};
