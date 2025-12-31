
import React, { useState, useEffect } from 'react';
import { UserSession, DecisionStructure, Assumption, Scenario } from '../../types';
import { generateScenarios } from '../../services/geminiService';
import { Card } from '../ui/Card';
import { useDeviceClass } from '../../hooks/useDeviceClass';

interface ScenarioSimulationStageProps {
  onNext: (data: { scenarios: Scenario[] }) => void;
  session: UserSession;
  structure: DecisionStructure;
  assumptions: Assumption[];
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

const scenarioConfig = {
    'Best Case': {
        icon: '☀️',
        borderColor: 'border-green-500/50',
    },
    'Base Case': {
        icon: '⚖️',
        borderColor: 'border-cyan-500/50',
    },
    'Failure Case': {
        icon: '🌧️',
        borderColor: 'border-red-500/50',
    }
}

export const ScenarioSimulationStage: React.FC<ScenarioSimulationStageProps> = ({ onNext, session, structure, assumptions, setIsLoading, setError }) => {
  const [scenarios, setScenarios] = useState<Scenario[] | null>(null);
  const { isMobile, prefersReducedMotion, hasPointer } = useDeviceClass();
  const animationDuration = isMobile ? '0.3s' : '0.5s';
  const proceedButtonHover = hasPointer ? 'hover:bg-violet-500 transform hover:scale-105' : '';

  useEffect(() => {
    const fetchScenarios = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await generateScenarios(structure, assumptions, session);
        // Ensure order
        const orderedResult = [
            result.find(s => s.title === 'Best Case'),
            result.find(s => s.title === 'Base Case'),
            result.find(s => s.title === 'Failure Case'),
        ].filter(Boolean) as Scenario[];
        setScenarios(orderedResult);
      } catch (e) {
        setError(e instanceof Error ? e.message : "An unknown error occurred.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchScenarios();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [structure, assumptions, session]);

  const handleConfirm = () => {
    if (scenarios) {
      onNext({ scenarios });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
       <div>
        <h2 className="text-2xl font-bold text-slate-100 mb-2">3. Scenario Simulation</h2>
        <p className="text-slate-400">Let's explore potential futures. How could this decision play out under different conditions?</p>
      </div>

      {scenarios && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {scenarios.map((scenario) => (
             <Card key={scenario.title} className={`border-t-4 ${scenarioConfig[scenario.title].borderColor}`}>
                <div className="flex items-center mb-4">
                  <span className="text-2xl mr-3">{scenarioConfig[scenario.title].icon}</span>
                  <h4 className="text-xl font-bold text-slate-200">{scenario.title}</h4>
                </div>
                <div className="space-y-4">
                    <div>
                        <h5 className="text-sm font-semibold text-slate-400 mb-1">Outcome</h5>
                        <p className="text-slate-300">{scenario.outcome}</p>
                    </div>
                     <div>
                        <h5 className="text-sm font-semibold text-slate-400 mb-1">Time / Effort Impact</h5>
                        <p className="text-slate-300">{scenario.timeImpact} & {scenario.effortCost}</p>
                    </div>
                    {scenario.title === 'Failure Case' && (
                        <div>
                            <h5 className="text-sm font-semibold text-slate-400 mb-1">Recovery Strategy</h5>
                            <p className="text-slate-300">{scenario.recoveryStrategy}</p>
                        </div>
                    )}
                </div>
             </Card>
          ))}
        </div>
      )}

      {scenarios && (
        <div className="flex justify-end mt-6">
          <button onClick={handleConfirm} className={`bg-violet-600 text-white font-semibold px-8 py-3 rounded-md transition ${proceedButtonHover}`}>
            Proceed to Recommendation
          </button>
        </div>
      )}
       <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: ${prefersReducedMotion ? 'none' : `fade-in ${animationDuration} ease-out forwards`}; }
      `}</style>
    </div>
  );
};
