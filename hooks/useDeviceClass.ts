
import { useState, useEffect } from 'react';

const breakpoints = {
  mobile: 768,
  tablet: 1024,
};

export const useDeviceClass = () => {
  const [deviceState, setDeviceState] = useState({
    isDesktop: false,
    isTablet: false,
    isMobile: true, // Default to mobile for SSR or initial render
    prefersReducedMotion: false,
    hasPointer: false,
  });

  useEffect(() => {
    const checkDevice = () => {
      if (typeof window === 'undefined') return;
      
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const hasPointer = window.matchMedia('(pointer: fine)').matches;
      const width = window.innerWidth;

      setDeviceState({
        isMobile: width < breakpoints.mobile,
        isTablet: width >= breakpoints.mobile && width < breakpoints.tablet,
        isDesktop: width >= breakpoints.tablet,
        prefersReducedMotion,
        hasPointer,
      });
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  return deviceState;
};
