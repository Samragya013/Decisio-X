
import React from 'react';
import { useDeviceClass } from '../hooks/useDeviceClass';

interface LandingPageProps {
  onStart: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const { isMobile, prefersReducedMotion, hasPointer } = useDeviceClass();
  const animationDuration = isMobile ? '0.5s' : '0.8s';
  const buttonHoverClasses = hasPointer ? 'hover:bg-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/20 transform hover:-translate-y-1' : '';

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <div className="max-w-3xl">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-slate-100 to-slate-400 mb-4 animate-fade-in-down">
          Decisio X
        </h1>
        <h2 className="text-xl md:text-2xl text-slate-300 mb-6 animate-fade-in-down animation-delay-300">
          A Decision Intelligence System
        </h2>
        <p className="text-lg md:text-xl text-cyan-400/80 italic mb-12 animate-fade-in-up animation-delay-600">
          “Decisions don’t fail. Assumptions do.”
        </p>
        <button
          onClick={onStart}
          className={`bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 text-lg font-semibold px-8 py-3 rounded-lg transition-all duration-300 animate-fade-in-up animation-delay-900 ${buttonHoverClasses}`}
        >
          Start a Demo Session
        </button>
      </div>
      <style>{`
        @keyframes fade-in-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-down { animation: ${prefersReducedMotion ? 'none' : `fade-in-down ${animationDuration} ease-out forwards`}; }
        .animate-fade-in-up { animation: ${prefersReducedMotion ? 'none' : `fade-in-up ${animationDuration} ease-out forwards`}; }
        .animation-delay-300 { animation-delay: 0.3s; opacity: 0; }
        .animation-delay-600 { animation-delay: 0.6s; opacity: 0; }
        .animation-delay-900 { animation-delay: 0.9s; opacity: 0; }
      `}</style>
    </div>
  );
};
