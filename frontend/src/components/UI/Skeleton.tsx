import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'card';
  count?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rectangular',
  count = 1,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'text':
        return 'h-4 w-full rounded';
      case 'circular':
        return 'rounded-full';
      case 'card':
        return 'h-32 w-full rounded-2xl';
      case 'rectangular':
      default:
        return 'h-10 w-full rounded-xl';
    }
  };

  const skeletons = Array.from({ length: count });

  return (
    <>
      {skeletons.map((_, i) => (
        <div
          key={i}
          className={`animate-pulse bg-slate-200 dark:bg-slate-800/80 border border-slate-300/40 dark:border-slate-700/30 ${getVariantStyles()} ${className}`}
        />
      ))}
    </>
  );
};

export const DashboardSkeleton: React.FC = () => (
  <div className="p-6 space-y-6 max-w-7xl mx-auto">
    <div className="space-y-2">
      <Skeleton variant="text" className="w-48 h-6" />
      <Skeleton variant="text" className="w-96 h-4" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Skeleton variant="card" />
      <Skeleton variant="card" />
      <Skeleton variant="card" />
      <Skeleton variant="card" />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Skeleton variant="card" className="h-64 lg:col-span-2" />
      <Skeleton variant="card" className="h-64" />
    </div>
  </div>
);

export const CardSkeleton: React.FC = () => (
  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-4">
    <div className="flex items-center justify-between">
      <Skeleton variant="text" className="w-1/3 h-5" />
      <Skeleton variant="circular" className="w-8 h-8" />
    </div>
    <Skeleton variant="text" className="w-full h-4" />
    <Skeleton variant="text" className="w-4/5 h-4" />
    <Skeleton variant="rectangular" className="h-8 w-28" />
  </div>
);
