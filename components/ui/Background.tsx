
import React, { useEffect } from 'react';
import { useDeviceClass } from '../../hooks/useDeviceClass';

export const Background: React.FC = () => {
  const { isDesktop, isMobile, prefersReducedMotion } = useDeviceClass();

  useEffect(() => {
    if (isDesktop && !prefersReducedMotion) {
      const handleMouseMove = (event: MouseEvent) => {
        const { clientX, clientY } = event;
        const x = (clientX / window.innerWidth - 0.5) * -30;
        const y = (clientY / window.innerHeight - 0.5) * -30;
        document.documentElement.style.setProperty('--parallax-x', `${x}px`);
        document.documentElement.style.setProperty('--parallax-y', `${y}px`);
      };
      window.addEventListener('mousemove', handleMouseMove);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        document.documentElement.style.removeProperty('--parallax-x');
        document.documentElement.style.removeProperty('--parallax-y');
      };
    }
  }, [isDesktop, prefersReducedMotion]);

  const starsAnimation = !prefersReducedMotion ? 'move-stars 200s linear infinite' : 'none';
  const nebulaAnimation = !prefersReducedMotion ? 'move-nebula 300s linear infinite' : 'none';
  const nebula2Animation = !prefersReducedMotion ? 'move-nebula 250s linear infinite reverse' : 'none';

  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden">
      <style>{`
        :root { --parallax-x: 0px; --parallax-y: 0px; }
        @keyframes move-stars {
          from { background-position: 0 0; }
          to { background-position: -10000px 5000px; }
        }
        @keyframes move-nebula {
          from { transform: translate(-50%, -50%) rotate(0deg) scale(1.5); }
          to { transform: translate(-50%, -50%) rotate(360deg) scale(1.5); }
        }
        .stars-desktop {
          background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><circle cx="10" cy="10" r="0.5" fill="white"/><circle cx="30" cy="70" r="0.5" fill="white"/><circle cx="80" cy="30" r="0.5" fill="white"/><circle cx="50" cy="50" r="0.5" fill="white"/></svg>');
          animation: ${starsAnimation};
          transform: translate(var(--parallax-x), var(--parallax-y));
          transition: transform 0.1s linear;
        }
        .stars-tablet {
            background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="150" height="150"><circle cx="15" cy="15" r="0.5" fill="white" opacity="0.8"/><circle cx="45" cy="105" r="0.5" fill="white" opacity="0.8"/><circle cx="120" cy="45" r="0.5" fill="white" opacity="0.8"/></svg>');
            animation: ${starsAnimation};
        }
        .stars-mobile {
            background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><circle cx="20" cy="20" r="0.4" fill="white" opacity="0.6"/><circle cx="150" cy="170" r="0.4" fill="white" opacity="0.6"/><circle cx="80" cy="90" r="0.4" fill="white" opacity="0.6"/></svg>');
        }
        .nebula {
          background: radial-gradient(ellipse at center, rgba(30, 0, 80, 0.6) 0%, rgba(0,0,0,0) 70%);
          animation: ${nebulaAnimation};
          animation-duration: ${isDesktop ? '300s' : '450s'};
        }
        .nebula2 {
          background: radial-gradient(ellipse at center, rgba(0, 50, 80, 0.5) 0%, rgba(0,0,0,0) 70%);
          animation: ${nebula2Animation};
        }
      `}</style>
      <div className="absolute top-0 left-0 w-full h-full bg-slate-900"></div>
      <div className={`absolute top-0 left-0 w-[200%] h-[200%] ${isDesktop ? 'stars-desktop' : isMobile ? 'stars-mobile' : 'stars-tablet'}`}></div>
      {!isMobile && <div className="absolute top-1/2 left-1/2 w-[150vw] h-[150vh] nebula opacity-50"></div>}
      {isDesktop && <div className="absolute top-1/2 left-1/2 w-[120vw] h-[120vh] nebula2 opacity-40"></div>}
    </div>
  );
};
