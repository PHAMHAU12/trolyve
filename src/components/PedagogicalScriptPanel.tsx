import React from 'react';
import { MathProblemResponse } from '../data/sampleProblems';
import { 
  GitFork, 
  HelpCircle, 
  ArrowRight, 
  Check, 
  Lightbulb, 
  Play, 
  SkipForward, 
  SkipBack, 
  Presentation 
} from 'lucide-react';
import { LatexDisplay } from './LatexDisplay';

interface PedagogicalScriptPanelProps {
  data: MathProblemResponse;
  activeStep: number;
  onStepChange: (stepIndex: number) => void;
  onTogglePresentationMode?: () => void;
}

export const PedagogicalScriptPanel: React.FC<PedagogicalScriptPanelProps> = ({
  data,
  activeStep,
  onStepChange,
  onTogglePresentationMode,
}) => {
  const steps = data.pedagogicalScript.steps;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      {/* Panel Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-amber-500/10 text-amber-400 rounded-lg border border-amber-500/20">
            <Presentation className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">
              Kịch bản Giảng dạy & Trình tự Dựng hình
            </h3>
            <p className="text-[11px] text-slate-400">
              Quy chuẩn 4 bước sư phạm: Đáy → Đường cao → Cạnh bên → Thiết diện / Yếu tố phụ
            </p>
          </div>
        </div>

        {/* Step Navigation Pill Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => onStepChange(Math.max(0, activeStep - 1))}
            disabled={activeStep === 0}
            className="p-1 rounded-lg text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
            title="Bước trước"
          >
            <SkipBack className="w-3.5 h-3.5" />
          </button>
          <span className="text-xs font-mono font-bold text-sky-400 px-2">
            Bước {activeStep + 1}/{steps.length}
          </span>
          <button
            onClick={() => onStepChange(Math.min(steps.length - 1, activeStep + 1))}
            disabled={activeStep === steps.length - 1}
            className="p-1 rounded-lg text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
            title="Bước tiếp theo"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Step by Step Timeline Cards */}
      <div className="space-y-3">
        {steps.map((step, idx) => {
          const isActive = idx === activeStep;
          const isDone = idx < activeStep;

          return (
            <div
              key={step.stepNumber}
              onClick={() => onStepChange(idx)}
              className={`cursor-pointer rounded-xl p-3.5 border transition-all ${
                isActive
                  ? 'bg-sky-950/40 border-sky-500 shadow-md shadow-sky-500/10 ring-1 ring-sky-500/30'
                  : isDone
                  ? 'bg-slate-950/40 border-slate-800/80 opacity-80 hover:opacity-100 hover:border-slate-700'
                  : 'bg-slate-950/20 border-slate-800/40 opacity-60 hover:opacity-100'
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Step indicator bubble */}
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                    isActive
                      ? 'bg-sky-500 text-white shadow'
                      : isDone
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {isDone ? <Check className="w-3.5 h-3.5" /> : step.stepNumber}
                </div>

                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-200">{step.title}</h4>
                    {isActive && (
                      <span className="text-[10px] uppercase font-bold tracking-wider text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-full border border-sky-500/20">
                        Đang chọn
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {step.description}
                  </p>

                  {/* Teacher Heuristic Question */}
                  <div className="bg-amber-950/30 border border-amber-800/40 rounded-lg p-2.5 mt-2 flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[10px] font-bold text-amber-300 uppercase tracking-wider mb-0.5">
                        Gợi ý câu hỏi tương tác cho giáo viên:
                      </div>
                      <p className="text-xs text-amber-100/90 italic">
                        "{step.teacherQuestion}"
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
