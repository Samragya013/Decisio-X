
import React from 'react';
import { useDeviceClass } from '../../hooks/useDeviceClass';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  icon?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title, icon }) => {
  const { isDesktop, isMobile, hasPointer } = useDeviceClass();

  const glassmorphismClasses = isMobile 
    ? 'bg-slate-800/90 backdrop-blur-none border-slate-700'
    : isDesktop 
    ? 'bg-slate-800/50 backdrop-blur-md border-slate-700'
    : 'bg-slate-800/70 backdrop-blur-sm border-slate-700';

  const glowClasses = isMobile 
    ? 'shadow-lg' // Basic shadow for depth on mobile
    : isDesktop 
    ? 'shadow-[0_0_20px_rgba(0,200,255,0.1)]' // Desktop: visible cyan glow
    : 'shadow-[0_0_15px_rgba(0,200,255,0.08)]'; // Tablet: Milder glow

  const hoverClasses = hasPointer && isDesktop ? 'transition-all duration-300 hover:border-cyan-500/20 hover:shadow-[0_0_30px_rgba(0,200,255,0.25)]' : '';

  return (
    <div className={`rounded-lg p-6 ${glassmorphismClasses} ${glowClasses} ${hoverClasses} ${className}`}>
      {title && (
        <div className="flex items-center mb-4">
          {icon && <div className="mr-3 text-cyan-400">{icon}</div>}
          <h3 className="text-xl font-semibold text-slate-200">{title}</h3>
        </div>
      )}
      {children}
    </div>
  );
};
