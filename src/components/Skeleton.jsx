import React from 'react';

export default function Skeleton({ className = '', variant = 'rectangular' }) {
  // variant: 'rectangular', 'circular', 'text'
  let baseClass = 'skeleton-loading bg-border/40 ';
  
  if (variant === 'circular') {
    baseClass += 'rounded-full';
  } else if (variant === 'text') {
    baseClass += 'rounded-md h-4';
  } else {
    baseClass += 'rounded-2xl'; // Default for cards/images
  }

  return (
    <div className={`${baseClass} ${className}`} aria-hidden="true"></div>
  );
}

export function ProductSkeleton() {
  return (
    <div className="glass-card rounded-3xl p-4 flex flex-col space-y-3">
      {/* Image Skeleton */}
      <Skeleton className="w-full h-40" />
      
      {/* Content Skeleton */}
      <div className="space-y-2 pt-2">
        <Skeleton variant="text" className="w-3/4" />
        <Skeleton variant="text" className="w-1/2" />
      </div>
      
      {/* Footer Skeleton (Price + Button) */}
      <div className="flex justify-between items-end pt-2">
        <Skeleton variant="text" className="w-1/3 h-6" />
        <Skeleton className="w-10 h-10 rounded-full" />
      </div>
    </div>
  );
}
