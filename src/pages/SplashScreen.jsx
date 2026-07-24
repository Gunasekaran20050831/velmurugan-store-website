import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import muruganImg from '../assets/murugan.png';

export default function SplashScreen({ onComplete }) {
  const { t } = useLanguage();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 2800; // 2.8 seconds
    const intervalTime = 30;
    const step = 100 / (duration / intervalTime);

    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 300);
          return 100;
        }
        return prev + step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-luxury-light flex flex-col items-center justify-between py-12 px-6 overflow-hidden">
      
      {/* Top Background Ornaments */}
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"></div>

      <div className="flex-1 flex flex-col items-center justify-center max-w-sm w-full">
        {/* Lord Murugan Artwork Wrapper with Gold Halo Glow */}
        <div className="relative mb-8 group">
          {/* Pulsing Gold Halo Ring */}
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-accent via-accent-light to-accent-dark opacity-35 blur-md animate-pulse"></div>
          {/* Inner border */}
          <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full overflow-hidden border-3 border-accent/70 shadow-2xl bg-white flex items-center justify-center">
            <img 
              src={muruganImg} 
              alt="Lord Murugan Artwork" 
              className="w-full h-full object-cover scale-102 hover:scale-105 transition-transform duration-1000"
            />
          </div>
        </div>

        {/* Brand Text */}
        <div className="text-center space-y-2 animate-in fade-in slide-in-from-bottom-5 duration-700">
          <h1 className="text-3xl font-extrabold tracking-tight text-primary leading-none font-sans">
            VELMURUGAN
          </h1>
          <h2 className="text-xl font-bold tracking-widest text-accent font-sans">
            — STORE —
          </h2>
          <p className="text-xs font-bold text-gray-500 tracking-wider uppercase pt-1">
            " {t('tagline')} "
          </p>
        </div>
      </div>

      {/* Progress Bar & Loader */}
      <div className="w-full max-w-[200px] flex flex-col items-center">
        {/* Bar */}
        <div className="w-full h-1 bg-primary/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-30 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        {/* Quick Bypass Button */}
        <button 
          onClick={onComplete}
          className="text-[9px] font-bold text-primary/40 hover:text-primary tracking-widest uppercase mt-4 transition-colors duration-200"
        >
          Skip Intro
        </button>
      </div>

    </div>
  );
}
