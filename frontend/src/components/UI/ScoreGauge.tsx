import React from 'react';

interface ScoreGaugeProps {
  score: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score, label = "Health Score", size = "md" }) => {
  const radius = size === 'lg' ? 60 : size === 'md' ? 45 : 30;
  const strokeWidth = size === 'lg' ? 10 : size === 'md' ? 8 : 6;
  const normalizedRadius = radius - strokeWidth * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getColor = (s: number) => {
    if (s >= 85) return 'text-emerald-400 stroke-emerald-500';
    if (s >= 70) return 'text-brand-400 stroke-brand-500';
    if (s >= 50) return 'text-amber-400 stroke-amber-500';
    return 'text-rose-400 stroke-rose-500';
  };

  const dimensions = size === 'lg' ? 140 : size === 'md' ? 105 : 70;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative flex items-center justify-center">
        <svg height={dimensions} width={dimensions} className="transform -rotate-90">
          <circle
            stroke="currentColor"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx={dimensions / 2}
            cy={dimensions / 2}
            className="text-slate-200 dark:text-slate-800"
          />
          <circle
            stroke="currentColor"
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ strokeDashoffset }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={dimensions / 2}
            cy={dimensions / 2}
            className={`transition-all duration-1000 ease-out ${getColor(score)}`}
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className={`font-extrabold text-slate-900 dark:text-slate-100 ${size === 'lg' ? 'text-2xl' : size === 'md' ? 'text-xl' : 'text-sm'}`}>
            {Math.round(score)}
          </span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">/100</span>
        </div>
      </div>
      {label && <p className="mt-2 text-xs font-medium text-slate-600 dark:text-slate-400">{label}</p>}
    </div>
  );
};
