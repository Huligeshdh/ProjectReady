import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { DimensionDetail } from '../../types';

interface ScoreRadarChartProps {
  dimensions: DimensionDetail[];
}

export const ScoreRadarChart: React.FC<ScoreRadarChartProps> = ({ dimensions }) => {
  const chartData = dimensions.map(d => ({
    subject: d.name,
    score: d.score,
    fullMark: 100
  }));

  return (
    <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-100">14-Dimension Score Breakdown</h3>
          <p className="text-xs text-slate-400 mt-0.5">Multi-dimensional evaluation matrix comparing measured & qualitative metrics</p>
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
            <XAxis
              dataKey="subject"
              tick={{ fill: '#94a3b8', fontSize: 10 }}
              interval={0}
              angle={-25}
              textAnchor="end"
            />
            <YAxis domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 10 }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#f8fafc' }}
            />
            <Bar dataKey="score" fill="#3b82f6" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        {dimensions.map(d => (
          <div key={d.key} className="p-3.5 rounded-xl bg-slate-850 border border-slate-800 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-200">{d.name}</span>
              <span className="font-bold text-brand-400">{d.score} / 100</span>
            </div>
            <p className="text-[11px] text-emerald-400 mt-1">✓ {d.strong_because}</p>
            {d.weakness_note && !d.weakness_note.includes('No critical') && (
              <p className="text-[11px] text-amber-400 mt-0.5">⚠ {d.weakness_note}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
