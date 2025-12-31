
import React, { useState, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { OnboardingModal } from './components/OnboardingModal';
import { DecisionConsole } from './components/DecisionConsole';
import { useSession } from './hooks/useSession';
import { Background } from './components/ui/Background';
import { UserSession } from './types';

export default function App() {
  const [session, setSession] = useSession<UserSession | null>('userSession', null);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const handleStartSession = () => {
    setShowOnboarding(true);
  };

  const handleOnboardingComplete = (userData: Omit<UserSession, 'sessionId'>) => {
    const newSession = {
      ...userData,
      sessionId: `temp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    };
    setSession(newSession);
    setShowOnboarding(false);
  };

  const handleEndSession = () => {
    sessionStorage.clear();
    setSession(null);
    setShowOnboarding(false);
  };

  return (
    <div className="relative min-h-screen w-full font-sans text-slate-200 overflow-x-hidden">
      <Background />
      <div className="relative z-10">
        {!session ? (
          <>
            <LandingPage onStart={handleStartSession} />
            {showOnboarding && <OnboardingModal onComplete={handleOnboardingComplete} onCancel={() => setShowOnboarding(false)} />}
          </>
        ) : (
          <DecisionConsole session={session} onEndSession={handleEndSession} />
        )}
      </div>
    </div>
  );
}
