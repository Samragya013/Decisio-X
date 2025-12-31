
import React, { useState, useEffect } from 'react';
import { UserSession, DecisionStructure, Assumption, Scenario, Recommendation } from '../../types';
import { generateRecommendation } from '../../services/geminiService';
import { Card } from '../ui/Card';
import { useDeviceClass } from '../../hooks/useDeviceClass';

interface RecommendationStageProps {
  onNext: (data: { recommendation: Recommendation }) => void;
  session: UserSession;
  structure: DecisionStructure;
  assumptions: Assumption[];
  scenarios: Scenario[];
  setIsLoading: (isLoading:boolean) => void;
  setError: (error: string | null) => void;
}

const InfoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const ConfidenceMeter: React.FC<{ score: number }> = ({ score }) => {
  const { isMobile, prefersReducedMotion } = useDeviceClass();
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (score / 100) * circumference;

  let colorClass = 'text-cyan-400';
  if (score < 40) colorClass = 'text-red-400';
  else if (score < 70) colorClass = 'text-yellow-400';
  
  const transitionClasses = prefersReducedMotion 
    ? '' 
    : isMobile 
    ? 'transition-[stroke-dashoffset] duration-700 ease-out' 
    : 'transition-[stroke-dashoffset] duration-1000 ease-out';

  return (
    <div className="relative w-32 h-32">
      <svg className="w-full h-full" viewBox="0 0 100 100">
        <circle
          className="text-slate-700"
          strokeWidth="10"
          stroke="currentColor"
          fill="transparent"
          r="45"
          cx="50"
          cy="50"
        />
        <circle
          className={`${colorClass} ${transitionClasses}`}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r="45"
          cx="50"
          cy="50"
          transform="rotate(-90 50 50)"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`text-3xl font-bold ${colorClass}`}>{score}%</span>
      </div>
    </div>
  );
};

export const RecommendationStage: React.FC<RecommendationStageProps> = ({ onNext, session, structure, assumptions, scenarios, setIsLoading, setError }) => {
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const { isMobile, prefersReducedMotion } = useDeviceClass();
  const animationDuration = isMobile ? '0.3s' : '0.5s';

  useEffect(() => {
    const fetchRecommendation = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await generateRecommendation(structure, assumptions, scenarios, session);
        setRecommendation(result);
        onNext({ recommendation: result });
      } catch (e) {
        setError(e instanceof Error ? e.message : "An unknown error occurred.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecommendation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [structure, assumptions, scenarios, session]);

  if (!recommendation) {
    return null; // Loader is handled by parent
  }

  return (
    <div className="space-y-6 animate-fade-in">
       <div>
        <h2 className="text-2xl font-bold text-slate-100 mb-2">4. Recommendation</h2>
        <p className="text-slate-400">Based on the analysis, here is a synthesized recommendation to guide your decision.</p>
      </div>

      <Card className="bg-gradient-to-br from-slate-800/60 to-violet-900/40 border-violet-700">
        <h3 className="text-xl font-semibold text-violet-300 mb-2">Primary Recommendation</h3>
        <p className="text-2xl text-slate-100">{recommendation.primaryRecommendation}</p>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="flex flex-col items-center justify-center text-center col-span-1">
            <h4 className="text-lg font-semibold text-slate-300 mb-4">Confidence Score</h4>
            <ConfidenceMeter score={recommendation.confidenceScore} />
        </Card>
        <Card className="lg:col-span-2">
            <h4 className="text-lg font-semibold text-slate-300 mb-2 flex items-center"><InfoIcon/><span className="ml-2">Reasoning</span></h4>
            <p className="text-slate-400">{recommendation.confidenceReasoning}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
           <h4 className="text-lg font-semibold text-slate-300 mb-2">Change Factors</h4>
           <p className="text-sm text-slate-400 mb-3">The recommendation could change if these factors prove different:</p>
           <ul className="list-disc list-inside space-y-2 text-slate-300">
             {recommendation.changeFactors.map((factor, i) => <li key={i}>{factor}</li>)}
           </ul>
        </Card>
        <Card>
            <h4 className="text-lg font-semibold text-slate-300 mb-2">Re-evaluation Timeline</h4>
            <p className="text-slate-300">{recommendation.reevaluationTimeline}</p>
        </Card>
      </div>
       <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: ${prefersReducedMotion ? 'none' : `fade-in ${animationDuration} ease-out forwards`}; }
      `}</style>
    </div>
  );
};
