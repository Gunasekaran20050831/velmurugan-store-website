import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { POLICIES } from '@/constants/infoPages';
import { ShieldCheck, Scale, Truck, RotateCcw } from 'lucide-react';
import EmptyState from '@/components/EmptyState';

// Helper icon mapper
const getIcon = (policyKey) => {
  switch (policyKey) {
    case 'privacy': return ShieldCheck;
    case 'terms': return Scale;
    case 'shipping': return Truck;
    case 'refunds': return RotateCcw;
    default: return ShieldCheck;
  }
};

export default function PolicyPage({ policyKey }) {
  const { language } = useLanguage();
  
  const policy = POLICIES[policyKey];

  if (!policy) {
    return (
      <EmptyState 
        title="Policy Not Found" 
        message="The requested policy document could not be located." 
        actionLabel="Go Back"
        onAction={() => window.history.back()}
      />
    );
  }

  const Icon = getIcon(policyKey);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12 animate-in fade-in duration-300">
      
      <div className="text-center space-y-4 mb-12">
        <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon className="w-8 h-8" />
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-primary font-sans">
          {policy.title[language]}
        </h1>
        <p className="text-xs font-bold text-muted uppercase tracking-widest">
          {policy.lastUpdated[language]}
        </p>
        <div className="w-24 h-1 bg-accent mx-auto rounded-full mt-6"></div>
      </div>

      <div className="glass-card p-6 md:p-10 rounded-3xl border border-border shadow-sm">
        <div className="space-y-6">
          {policy.content[language].map((paragraph, idx) => (
            <p 
              key={idx} 
              className={`text-text leading-relaxed font-medium ${idx === 0 ? 'text-lg md:text-xl font-bold text-primary mb-8' : ''}`}
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>

    </div>
  );
}
