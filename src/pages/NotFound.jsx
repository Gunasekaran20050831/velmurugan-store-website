import React from 'react';
import { Ghost, ArrowLeft } from 'lucide-react';

export default function NotFound({ onNavigate }) {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
      <div className="glass-card p-12 rounded-3xl max-w-md w-full text-center space-y-6 shadow-sm border border-border">
        
        <div className="relative mx-auto w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center text-primary border border-primary/10">
          <Ghost className="w-12 h-12" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-5xl font-black text-primary font-sans">404</h1>
          <h2 className="text-lg font-bold text-text">Page Not Found</h2>
          <p className="text-xs text-muted font-semibold leading-relaxed max-w-[250px] mx-auto">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
        </div>

        <button 
          onClick={() => onNavigate('home')}
          className="luxury-btn-primary px-8 py-3.5 rounded-xl text-xs font-bold inline-flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>
      </div>
    </div>
  );
}
