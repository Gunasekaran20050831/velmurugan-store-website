import React from 'react';

export const ScreenLoader = () => {
  return (
    <div className="flex-1 flex justify-center items-center w-full h-[60vh]">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
        <div className="text-primary font-medium tracking-wide">Loading...</div>
      </div>
    </div>
  );
};

export const SkeletonCard = () => {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col space-y-3">
      <div className="w-full h-32 rounded-xl skeleton-loading"></div>
      <div className="h-4 w-3/4 rounded-md skeleton-loading"></div>
      <div className="h-3 w-1/2 rounded-md skeleton-loading"></div>
      <div className="mt-2 h-8 w-full rounded-lg skeleton-loading"></div>
    </div>
  );
};
