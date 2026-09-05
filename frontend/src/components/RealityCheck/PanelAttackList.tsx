import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle2, ChevronDown, ChevronUp, HelpCircle, ArrowRight } from 'lucide-react';
import { PanelAttackPoint, EvaluatorQuestion } from '../../types';

interface PanelAttackListProps {
  attackPoints: PanelAttackPoint[];
  evaluatorQuestions: EvaluatorQuestion[];
}

export const PanelAttackList: React.FC<PanelAttackListProps> = ({ attackPoints, evaluatorQuestions }) => {
  const [expandedId, setExpandedId] = useState<number | null>(1);

  const getSeverityStyle = (sev: string) => {
    switch (sev) {
      case 'CRITICAL':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case 'HIGH':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      default:
        return 'bg-brand-500/10 text-brand-400 border-brand-500/30';
    }
  };

  return (
    <div className="space-y-8">
      {/* Panel Attack Points Section */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div>
          <span className="text-xs text-rose-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4" /> Panel Attack Points
          </span>
          <h3 className="text-lg font-bold text-slate-100 mt-1">“Questions your evaluator is likely to challenge you on.”</h3>
          <p className="text-xs text-slate-400 mt-0.5">Identifies critical architectural and validation vulnerabilities before your final evaluation panel.</p>
        </div>

        <div className="space-y-3">
          {attackPoints.map((ap, idx) => {
            const isExp = expandedId === (ap.id || idx + 1);
            return (
              <div key={ap.id || idx} className="rounded-xl border border-slate-800 bg-slate-850 overflow-hidden text-xs">
                <div
                  onClick={() => setExpandedId(isExp ? null : (ap.id || idx + 1))}
                  className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-800/80 transition"
                >
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${getSeverityStyle(ap.severity)}`}>
                      {ap.severity}
                    </span>
                    <div>
                      <h4 className="font-bold text-slate-100">{ap.issue_title}</h4>
                      <span className="text-[10px] text-slate-400 font-mono">{ap.related_component}</span>
                    </div>
                  </div>
                  {isExp ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </div>

                {isExp && (
                  <div className="p-4 bg-slate-950/80 border-t border-slate-800 space-y-3">
                    <div>
                      <span className="font-bold text-amber-400">Why Evaluator May Challenge: </span>
                      <p className="text-slate-300 mt-0.5">{ap.why_evaluator_challenges}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="font-bold text-brand-400">Likely Evaluator Question: </span>
                      <p className="text-slate-200 font-medium mt-0.5">“{ap.likely_evaluator_question}”</p>
                    </div>
                    <div>
                      <span className="font-bold text-emerald-400">Recommended Defense Answer: </span>
                      <p className="text-slate-300 mt-0.5">{ap.recommended_answer}</p>
                    </div>
                    <div className="pt-1">
                      <span className="font-bold text-brand-400">Actionable Fix: </span>
                      <p className="text-slate-300 mt-0.5">{ap.recommended_fix}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Expected Evaluator Questions Box */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-brand-400" /> Expected Evaluator Questions (Contextual Risk)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Specific questions expected based on your actual tech stack (FastAPI, PyTorch, React, PostgreSQL).</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {evaluatorQuestions.map((q, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-850 border border-slate-800 space-y-2 text-xs">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-brand-400 font-mono">
                {q.category}
              </span>
              <p className="font-bold text-slate-100">“{q.question}”</p>
              <p className="text-slate-400 text-[11px]"><span className="font-semibold text-slate-300">Context: </span>{q.context_reason}</p>
              <div className="p-2.5 rounded-lg bg-slate-900 text-slate-300 text-[11px]">
                <span className="font-semibold text-emerald-400">Strategy: </span>{q.suggested_response_strategy}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
