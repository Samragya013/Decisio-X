
import React, { useState } from 'react';
import { UserSession, DecisionStructure } from '../../types';
import { generateDecisionStructure } from '../../services/geminiService';
import { Card } from '../ui/Card';
import { useDeviceClass } from '../../hooks/useDeviceClass';

interface DecisionStructuringStageProps {
  onNext: (data: { decision: string, structure: DecisionStructure }) => void;
  session: UserSession;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  initialDecision: string;
}

const ListIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
    </svg>
);

const TargetIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
);


export const DecisionStructuringStage: React.FC<DecisionStructuringStageProps> = ({ onNext, session, setIsLoading, setError, initialDecision }) => {
  const [decision, setDecision] = useState(initialDecision);
  const [structure, setStructure] = useState<DecisionStructure | null>(null);
  const { isMobile, prefersReducedMotion, hasPointer } = useDeviceClass();

  const animationDuration = isMobile ? '0.3s' : '0.5s';
  const buttonHover = hasPointer ? 'hover:bg-cyan-500' : '';
  const proceedButtonHover = hasPointer ? 'hover:bg-violet-500 transform hover:scale-105' : '';

  const handleGenerate = async () => {
    if (!decision.trim()) {
      setError("Please describe the decision you're facing.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const result = await generateDecisionStructure(decision, session);
      setStructure(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = () => {
    if (structure) {
      onNext({ decision, structure });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-slate-100 mb-2">1. Decision Structuring</h2>
        <p className="text-slate-400">Start by clearly defining the decision you want to make. What is the core problem or choice?</p>
      </div>

      <Card>
        <textarea
          value={decision}
          onChange={(e) => setDecision(e.target.value)}
          placeholder="e.g., Should I accept the new job offer at Company X or stay in my current role?"
          className="w-full h-24 bg-slate-700/50 border border-slate-600 rounded-md p-3 text-slate-200 focus:ring-2 focus:ring-cyan-500 outline-none transition"
          disabled={!!structure}
        />
        {!structure && (
          <button onClick={handleGenerate} className={`mt-4 bg-cyan-600 text-white font-semibold px-6 py-2 rounded-md transition ${buttonHover}`}>
            Structure Decision
          </button>
        )}
      </Card>
      
      {structure && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card title="Objective" icon={<TargetIcon/>}>
                <p className="text-slate-300">{structure.objective}</p>
              </Card>
              <Card title="Success Criteria" icon={<ListIcon/>}>
                <ul className="list-disc list-inside space-y-1 text-slate-300">
                  {structure.successCriteria.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </Card>
              <Card title="Constraints" icon={<ListIcon/>}>
                <ul className="list-disc list-inside space-y-1 text-slate-300">
                  {structure.constraints.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </Card>
              <Card title="Variables" icon={<ListIcon/>}>
                <ul className="list-disc list-inside space-y-1 text-slate-300">
                  {structure.variables.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </Card>
          </div>
          <div className="flex justify-end">
            <button onClick={handleConfirm} className={`bg-violet-600 text-white font-semibold px-8 py-3 rounded-md transition ${proceedButtonHover}`}>
              Confirm & Proceed to Assumptions
            </button>
          </div>
        </div>
      )}
       <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: ${prefersReducedMotion ? 'none' : `fade-in ${animationDuration} ease-out forwards`}; }
      `}</style>
    </div>
  );
};
