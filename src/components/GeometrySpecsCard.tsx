import React, { useState } from 'react';
import { MathProblemResponse } from '../data/sampleProblems';
import { 
  Compass, 
  Layers, 
  Code2, 
  Copy, 
  Check, 
  CheckCircle2, 
  Hash, 
  FileCode,
  Info
} from 'lucide-react';
import { LatexDisplay } from './LatexDisplay';

interface GeometrySpecsCardProps {
  data: MathProblemResponse;
}

export const GeometrySpecsCard: React.FC<GeometrySpecsCardProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState<'specs' | 'latex' | 'geogebra'>('specs');
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">
              Thông số & Logic hình học chuẩn xác
            </h3>
            <p className="text-[11px] text-slate-400">
              Đồng bộ trực tiếp từ đề bài toán
            </p>
          </div>
        </div>

        {/* Tab Pills */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('specs')}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${
              activeTab === 'specs'
                ? 'bg-sky-500 text-white font-bold shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Tọa độ & Logic
          </button>
          <button
            onClick={() => setActiveTab('latex')}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${
              activeTab === 'latex'
                ? 'bg-sky-500 text-white font-bold shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Mã TikZ / LaTeX
          </button>
          <button
            onClick={() => setActiveTab('geogebra')}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${
              activeTab === 'geogebra'
                ? 'bg-sky-500 text-white font-bold shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            GeoGebra
          </button>
        </div>
      </div>

      {/* Tab 1: Specs & Coordinate Logic */}
      {activeTab === 'specs' && (
        <div className="space-y-3.5 text-xs">
          {/* Summary */}
          {data.analysis?.problemSummary && (
            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 text-slate-300">
              <span className="font-bold text-sky-400 block mb-1">Tóm tắt hình học:</span>
              <LatexDisplay content={data.analysis.problemSummary} />
            </div>
          )}

          {/* Key Relations */}
          {data.analysis?.geometricRelations && data.analysis.geometricRelations.length > 0 && (
            <div>
              <span className="font-semibold text-slate-300 block mb-1.5">
                Quan hệ hình học & Nét vẽ:
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {data.analysis.geometricRelations.map((rel, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 bg-slate-950/40 p-2 rounded-lg border border-slate-800/80 text-[11px] text-slate-300"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{rel}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Vertex Coordinates Grid */}
          {data.model3D?.vertices && data.model3D.vertices.length > 0 && (
            <div>
              <span className="font-semibold text-slate-300 block mb-1.5">
                Tọa độ không gian 3D của các đỉnh:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {data.model3D.vertices.map((v) => (
                  <div
                    key={v.id}
                    className="bg-slate-950 p-2 rounded-lg border border-slate-800 flex items-center justify-between"
                  >
                    <span className="font-bold text-sky-400">{v.id}</span>
                    <span className="font-mono text-[11px] text-slate-400">
                      ({v.x.toFixed(1)}, {v.y.toFixed(1)}, {v.z.toFixed(1)})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: LaTeX & TikZ Code */}
      {activeTab === 'latex' && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Mã LaTeX đề bài & hình vẽ:</span>
            <button
              onClick={() => handleCopy(data.exportData.latexExercise, 'latex')}
              className="flex items-center gap-1 text-[11px] font-semibold text-sky-400 hover:text-sky-300 bg-sky-950/60 px-2.5 py-1 rounded-lg border border-sky-800/80 transition-colors"
            >
              {copied === 'latex' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied === 'latex' ? 'Đã sao chép' : 'Sao chép LaTeX'}</span>
            </button>
          </div>
          <pre className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300 overflow-x-auto max-h-56 leading-relaxed">
            {data.exportData.latexExercise}
          </pre>
        </div>
      )}

      {/* Tab 3: GeoGebra Script */}
      {activeTab === 'geogebra' && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Script GeoGebra dựng hình tự động:</span>
            <button
              onClick={() => handleCopy(data.exportData.geogebraScript, 'geo')}
              className="flex items-center gap-1 text-[11px] font-semibold text-sky-400 hover:text-sky-300 bg-sky-950/60 px-2.5 py-1 rounded-lg border border-sky-800/80 transition-colors"
            >
              {copied === 'geo' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied === 'geo' ? 'Đã sao chép' : 'Sao chép GeoGebra'}</span>
            </button>
          </div>
          <pre className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300 overflow-x-auto max-h-56 leading-relaxed">
            {data.exportData.geogebraScript}
          </pre>
        </div>
      )}
    </div>
  );
};
