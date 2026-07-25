import React, { useEffect, useState } from 'react';
import muruganFullImg from '@/assets/images/murugan_splash.jpg';
import logoImg from '@/assets/images/velmurugan_logo.jpg';

export default function SplashScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const duration = 3000; // exactly 3 seconds
    const intervalTime = 30;
    const step = 100 / (duration / intervalTime);

    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 100);
          return 100;
        }
        return prev + step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black flex flex-col justify-end">
      
      {/* Background Image with Cinematic Ken Burns Effect */}
      <img 
        src={muruganFullImg} 
        alt="Lord Murugan Full Screen" 
        className="absolute inset-0 w-full h-full object-cover origin-center transition-transform ease-out"
        style={{
          transform: mounted ? 'scale(1.15)' : 'scale(1)',
          transitionDuration: '3s'
        }}
      />

      {/* Subtle Gradient Overlay for Text Readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

      {/* Content Wrapper */}
      <div className="relative z-10 w-full flex flex-col items-center pb-12 px-6 animate-in fade-in duration-1000">
        
        {/* Official Velmurugan Store Logo */}
        <div className="w-16 h-16 rounded-2xl bg-white shadow-2xl flex items-center justify-center p-1.5 mb-5 overflow-hidden border border-accent/20">
          <img src={logoImg} alt="Velmurugan Store Logo" className="w-full h-full object-contain" />
        </div>

        {/* Brand Text & Tagline */}
        <div className="text-center space-y-1.5 mb-10">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white leading-none font-sans drop-shadow-lg">
            VELMURUGAN STORE
          </h1>
          <p className="text-sm font-bold text-accent tracking-widest uppercase drop-shadow-md">
            " Shop. Deliver. Smile. "
          </p>
        </div>

        {/* Premium Animated Loading Bar */}
        <div className="w-full max-w-[240px] h-1.5 bg-white/20 rounded-full overflow-hidden backdrop-blur-md shadow-inner">
          <div 
            className="h-full bg-gradient-to-r from-accent to-yellow-300 transition-all duration-75 ease-out rounded-full shadow-[0_0_12px_rgba(212,175,55,0.8)]"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
      </div>
      
    </div>
  );
}
