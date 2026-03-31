'use client';
import { useState, useEffect } from 'react';

export function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollTop = window.scrollY;
          const docHeight = document.documentElement.scrollHeight - window.innerHeight;
          const pct = docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0;
          setProgress(pct);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (progress < 1) return null;

  return (
    <div
      data-progress-bar
      className="fixed top-0 left-0 h-[3px] bg-espresso z-50 transition-[width] duration-75"
      style={{ width: `${progress}%` }}
    />
  );
}
