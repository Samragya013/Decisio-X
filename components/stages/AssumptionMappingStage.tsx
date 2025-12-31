
import React, { useState, useEffect } from 'react';
import { UserSession, DecisionStructure, Assumption, AssumptionReliability } from '../../types';
import { generateAssumptions } from '../../services/geminiService';
import { Card } from '../ui/Card';
import { useDeviceClass } from '../../hooks/useDeviceClass';

interface AssumptionMappingStageProps {
  onNext: (data: { assumptions: Assumption[] }) => void;
  session: UserSession;
  structure: DecisionStructure;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

const reliabilityColor = {
  [AssumptionReliability.Strong]: 'bg-green-500/20 text-green-300 border-green-500/50',
  [AssumptionReliability.Medium]: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50',
  [AssumptionReliability.Weak]: 'bg-red-500/20 text-red-300 border-red-500/50',
};

const LightbulbIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
);


export const AssumptionMappingStage: React.FC<AssumptionMappingStageProps> = ({ onNext, session, structure, setIsLoading, setError }) => {
  const [assumptions, setAssumptions] = useState<Assumption[] | null>(null);
  const { isMobile, prefersReducedMotion, hasPointer } = useDeviceClass();
  const animationDuration = isMobile ? '0.3s' : '0.5s';
  const proceedButtonHover = hasPointer ? 'hover:bg-violet-500 transform hover:scale-105' : '';

  useEffect(() => {
    const fetchAssumptions = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await generateAssumptions(structure, session);
        setAssumptions(result);
      } catch (e) {
        setError(e instanceof Error ? e.message : "An unknown error occurred.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchAssumptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [structure, session]);

  const handleConfirm = () => {
    if (assumptions) {
      onNext({ assumptions });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
       <div>
        <h2 className="text-2xl font-bold text-slate-100 mb-2">2. Assumption Mapping</h2>
        <p className="text-slate-400">Here are the implicit assumptions underlying your decision. Weak or risky assumptions are where decisions often fail.</p>
      </div>

      {assumptions && (
        <div className="space-y-4">
          {assumptions.map((item, i) => (
            <Card key={i} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <p className="text-slate-300 flex-1">{item.assumption}</p>
              <div className="flex items-center gap-4">
                {item.isRisky && (
                   <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/50">
                     Risky
                   </span>
                )}
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${reliabilityColor[item.reliability]}`}>
                  {item.reliability}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {assumptions && assumptions.length > 0 && (
        <div className="flex justify-end mt-6">
          <button onClick={handleConfirm} className={`bg-violet-600 text-white font-semibold px-8 py-3 rounded-md transition ${proceedButtonHover}`}>
            Proceed to Scenarios
          </button>
        </div>
      )}

      {assumptions && assumptions.length === 0 && (
         <Card title="No Key Assumptions Identified" icon={<LightbulbIcon/>}>
           <p className="text-slate-400">The analysis didn't find significant implicit assumptions. This could mean your decision is straightforward or relies on widely accepted facts. You can proceed to the next step.</p>
         </Card>
      )}

       <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: ${prefersReducedMotion ? 'none' : `fade-in ${animationDuration} ease-out forwards`}; }
      `}</style>
    </div>
  );
};
