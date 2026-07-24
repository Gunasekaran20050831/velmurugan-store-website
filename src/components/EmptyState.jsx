import React from 'react';
import { PackageOpen } from 'lucide-react';

export default function EmptyState({ 
  icon: Icon = PackageOpen, 
  title = "No data found", 
  message = "There is nothing to display here right now.", 
  actionLabel, 
  onAction 
}) {
  return (
    <div className="glass-card p-12 rounded-3xl flex flex-col items-center justify-center text-center space-y-4 shadow-sm animate-in fade-in duration-300">
      <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center border border-primary/10 mb-2">
        <Icon className="w-10 h-10 text-primary/40" />
      </div>
      
      <div className="space-y-1 max-w-xs mx-auto">
        <h3 className="text-base font-extrabold text-primary">{title}</h3>
        <p className="text-xs text-muted leading-relaxed font-semibold">{message}</p>
      </div>

      {actionLabel && onAction && (
        <button 
          onClick={onAction}
          className="luxury-btn-primary px-6 py-2.5 rounded-xl text-xs font-bold mt-4"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
