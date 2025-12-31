
import React, { useState } from 'react';
import { UserSession, DecisionAnalysis } from '../types';
import { DecisionStructuringStage } from './stages/DecisionStructuringStage';
import { AssumptionMappingStage } from './stages/AssumptionMappingStage';
import { ScenarioSimulationStage } from './stages/ScenarioSimulationStage';
import { RecommendationStage } from './stages/RecommendationStage';
import { Stepper } from './ui/Stepper';
import { useDeviceClass } from '../hooks/useDeviceClass';

interface DecisionConsoleProps {
  session: UserSession;
  onEndSession: () => void;
}

const STAGES = [
  "Structuring",
  "Assumptions",
  "Scenarios",
  "Recommendation"
];

export const DecisionConsole: React.FC<DecisionConsoleProps> = ({ session, onEndSession }) => {
  const [currentStage, setCurrentStage] = useState(0);
  const [analysis, setAnalysis] = useState<DecisionAnalysis>({
    decision: '',
    structure: null,
    assumptions: null,
    scenarios: null,
    recommendation: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { hasPointer } = useDeviceClass();

  const handleNextStage = <T,>(data: T) => {
    setAnalysis(prev => ({...prev, ...data}));
    if (currentStage < STAGES.length - 1) {
      setCurrentStage(s => s + 1);
    }
  };

  const resetAnalysis = () => {
    setCurrentStage(0);
    setAnalysis({
      decision: '',
      structure: null,
      assumptions: null,
      scenarios: null,
      recommendation: null,
    });
    setError(null);
  }

  const newDecisionHover = hasPointer ? 'hover:bg-slate-700' : '';
  const endSessionHover = hasPointer ? 'hover:bg-violet-600/70' : '';

  return (
    <div className="container mx-auto max-w-7xl p-4 md:p-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Welcome, {session.name}</h1>
          <p className="text-slate-400">Decision Intelligence Console</p>
        </div>
        <div className="flex gap-4 mt-4 md:mt-0">
          <button onClick={resetAnalysis} className={`text-sm bg-slate-700/50 border border-slate-600 px-4 py-2 rounded-lg transition ${newDecisionHover}`}>New Decision</button>
          <button onClick={onEndSession} className={`text-sm bg-violet-600/50 border border-violet-500 px-4 py-2 rounded-lg transition ${endSessionHover}`}>End Session</button>
        </div>
      </header>
      
      <Stepper steps={STAGES} currentStep={currentStage} />

      {error && <div className="bg-red-500/20 border border-red-500/50 text-red-300 p-4 rounded-lg my-4">{error}</div>}
      
      <main className="mt-8 min-h-[500px]">
        {currentStage === 0 && (
          <DecisionStructuringStage 
            onNext={handleNextStage} 
            session={session} 
            setIsLoading={setIsLoading}
            setError={setError}
            initialDecision={analysis.decision}
          />
        )}
        {currentStage === 1 && analysis.structure && (
           <AssumptionMappingStage
            onNext={handleNextStage}
            session={session}
            structure={analysis.structure}
            setIsLoading={setIsLoading}
            setError={setError}
          />
        )}
        {currentStage === 2 && analysis.structure && analysis.assumptions && (
          <ScenarioSimulationStage
            onNext={handleNextStage}
            session={session}
            structure={analysis.structure}
            assumptions={analysis.assumptions}
            setIsLoading={setIsLoading}
            setError={setError}
          />
        )}
        {currentStage === 3 && analysis.structure && analysis.assumptions && analysis.scenarios && (
          <RecommendationStage
            onNext={handleNextStage}
            session={session}
            structure={analysis.structure}
            assumptions={analysis.assumptions}
            scenarios={analysis.scenarios}
            setIsLoading={setIsLoading}
            setError={setError}
          />
        )}
      </main>
      
      {isLoading && <Loader />}

      <footer className="text-center text-slate-500 mt-12 text-sm">
        This is a demo system. All data is temporary and will be cleared when you close this tab.
      </footer>
    </div>
  );
};

const Loader: React.FC = () => (
  <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
    <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
    <p className="mt-4 text-slate-300 text-lg">Analyzing...</p>
  </div>
);
