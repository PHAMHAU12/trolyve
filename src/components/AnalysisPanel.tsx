import React from 'react';
import { MathProblemResponse } from '../data/sampleProblems';
import { Tag, CheckCircle2, Network, ShieldCheck, Box } from 'lucide-react';
import { LatexDisplay } from './LatexDisplay';

interface AnalysisPanelProps {
  data: MathProblemResponse;
}

export const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ data }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      {/* Chapter Tag Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <span className="p-1.5 bg-indigo-500/10 text-indigo-400 rounded-lg border border-indigo-500/20">
            <Tag className="w-4 h-4" />
          </span>
          <span className="text-xs font-semibold text-slate-300">
            Phân loại chương trình:
          </span>
        </div>
        <span className="text-xs font-medium text-sky-400 bg-sky-950/70 border border-sky-800/60 px-3 py-1 rounded-full">
          {data.chapterTag}
        </span>
      </div>

      {/* Problem Summary */}
      <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
        <div className="text-xs font-bold text-slate-200 mb-1 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          Mục tiêu sư phạm cốt lõi:
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          {data.pedagogicalScript.keyTeachingGoal}
        </p>
      </div>

      {/* Grid: Entities & Geometric Relations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        {/* Entities */}
        <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-3.5 space-y-2">
          <div className="font-semibold text-sky-300 flex items-center gap-1.5 border-b border-slate-800 pb-2">
            <Box className="w-3.5 h-3.5 text-sky-400" />
            <span>Thực thể Toán học ({data.analysis.entities.length})</span>
          </div>
          <ul className="space-y-1.5">
            {data.analysis.entities.map((entity, i) => (
              <li key={i} className="flex items-start gap-2 text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-1.5 shrink-0" />
                <LatexDisplay content={entity} className="text-xs" />
              </li>
            ))}
          </ul>
        </div>

        {/* Geometric Relations */}
        <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-3.5 space-y-2">
          <div className="font-semibold text-amber-300 flex items-center gap-1.5 border-b border-slate-800 pb-2">
            <Network className="w-3.5 h-3.5 text-amber-400" />
            <span>Quan hệ Toán học chẩn đoán</span>
          </div>
          <ul className="space-y-1.5">
            {data.analysis.geometricRelations.map((rel, i) => (
              <li key={i} className="flex items-start gap-2 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
                <LatexDisplay content={rel} className="text-xs" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
