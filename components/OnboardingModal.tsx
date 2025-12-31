
import React, { useState } from 'react';
import { Role, Goal, TimeHorizon, UserSession } from '../types';
import { useDeviceClass } from '../../hooks/useDeviceClass';

interface OnboardingModalProps {
  onComplete: (userData: Omit<UserSession, 'sessionId'>) => void;
  onCancel: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ onComplete, onCancel }) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState<Role>(Role.Professional);
  const [goal, setGoal] = useState<Goal>(Goal.DecisionConfidence);
  const [timeHorizon, setTimeHorizon] = useState<TimeHorizon>(TimeHorizon.Medium);
  const [error, setError] = useState('');
  const { isMobile, prefersReducedMotion, hasPointer } = useDeviceClass();

  const animationDuration = isMobile ? '0.2s' : '0.3s';
  const buttonHoverClasses = hasPointer ? 'hover:bg-cyan-500 transform hover:scale-105' : '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your first name.');
      return;
    }
    setError('');
    onComplete({ name, role, goal, timeHorizon });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6 md:p-8 max-w-lg w-full shadow-2xl shadow-cyan-500/10 animate-fade-in-scale">
        <h2 className="text-2xl font-bold text-slate-100 mb-2">Temporary Session Setup</h2>
        <p className="text-slate-400 mb-6">This context helps personalize your analysis. No data is stored after you leave.</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1">First Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-700/50 border border-slate-600 rounded-md px-3 py-2 text-slate-200 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition"
              placeholder="e.g., Alex"
            />
             {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
          </div>

          <div>
             <label htmlFor="role" className="block text-sm font-medium text-slate-300 mb-1">Current Role</label>
             <select id="role" value={role} onChange={e => setRole(e.target.value as Role)} className="w-full bg-slate-700/50 border border-slate-600 rounded-md px-3 py-2 text-slate-200 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition appearance-none">
                 {Object.values(Role).map(r => <option key={r} value={r} className="bg-slate-800">{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
             </select>
          </div>

          <div>
             <label htmlFor="goal" className="block text-sm font-medium text-slate-300 mb-1">Primary Goal</label>
             <select id="goal" value={goal} onChange={e => setGoal(e.target.value as Goal)} className="w-full bg-slate-700/50 border border-slate-600 rounded-md px-3 py-2 text-slate-200 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition appearance-none">
                 {Object.values(Goal).map(g => <option key={g} value={g} className="bg-slate-800">{g.charAt(0).toUpperCase() + g.slice(1)}</option>)}
             </select>
          </div>

          <div>
             <label htmlFor="timeHorizon" className="block text-sm font-medium text-slate-300 mb-1">Time Horizon</label>
             <select id="timeHorizon" value={timeHorizon} onChange={e => setTimeHorizon(e.target.value as TimeHorizon)} className="w-full bg-slate-700/50 border border-slate-600 rounded-md px-3 py-2 text-slate-200 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition appearance-none">
                 {Object.values(TimeHorizon).map(t => <option key={t} value={t} className="bg-slate-800">{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
             </select>
          </div>
          
          <div className="flex justify-end gap-4 pt-4">
             <button type="button" onClick={onCancel} className={`text-slate-400 px-4 py-2 rounded-md transition ${hasPointer ? 'hover:text-slate-200' : ''}`}>Cancel</button>
             <button type="submit" className={`bg-cyan-600 text-white font-semibold px-6 py-2 rounded-md transition ${buttonHoverClasses}`}>Proceed</button>
          </div>
        </form>
      </div>
      <style>{`
        @keyframes fade-in-scale {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in-scale { animation: ${prefersReducedMotion ? 'none' : `fade-in-scale ${animationDuration} ease-out forwards`}; }
      `}</style>
    </div>
  );
};
