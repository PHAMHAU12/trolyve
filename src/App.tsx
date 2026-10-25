import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  BookOpen, 
  Key, 
  Cpu, 
  ExternalLink,
  Layers, 
  CheckCircle2, 
  AlertTriangle,
  XCircle,
  Loader2,
  Info
} from 'lucide-react';
import { PRESET_PROBLEMS, PresetProblem, MathProblemResponse } from './data/sampleProblems';
import { ProblemInputPanel } from './components/ProblemInputPanel';
import { Math3DViewer } from './components/Math3DViewer';
import { AlgebraGrapher } from './components/AlgebraGrapher';
import { LatexDisplay } from './components/LatexDisplay';
import { GeometrySpecsCard } from './components/GeometrySpecsCard';
import { ApiKeySettingsModal } from './components/ApiKeySettingsModal';
import { solveMathProblem } from './services/aiService';

interface StepState {
  id: number;
  label: string;
  status: 'idle' | 'processing' | 'success' | 'error';
  errorMsg?: string;
}

export default function App() {
  const [selectedPresetId, setSelectedPresetId] = useState<string>(PRESET_PROBLEMS[0].id);
  const [currentProblem, setCurrentProblem] = useState<MathProblemResponse>(PRESET_PROBLEMS[0].data);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [activeModel, setActiveModel] = useState<string>('gemini-3-flash-preview');
  const [verbatimError, setVerbatimError] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [hasApiKey, setHasApiKey] = useState<boolean>(true);

  // 3 Steps state tracking as required by AI_INSTRUCTIONS.md
  const [steps, setSteps] = useState<StepState[]>([
    { id: 1, label: 'Bước 1: Bóc tách thực thể toán học & OCR', status: 'idle' },
    { id: 2, label: 'Bước 2: Tính toán tọa độ 3D & Nét vẽ SGK', status: 'idle' },
    { id: 3, label: 'Bước 3: Dựng hình không gian 3D & Xuất dữ liệu', status: 'idle' },
  ]);

  // Check stored API key on mount (Rule 2: Khi chưa có key, hiển thị Modal bắt buộc nhập)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const key = localStorage.getItem('gemini_api_key');
      if (!key) {
        setHasApiKey(false);
        setIsSettingsOpen(true);
      } else {
        setHasApiKey(true);
      }
    }
  }, []);

  // Handle selecting predefined preset
  const handleSelectPreset = (preset: PresetProblem) => {
    setSelectedPresetId(preset.id);
    setCurrentProblem(preset.data);
    setVerbatimError(null);
    setSteps((prev) => prev.map((st) => ({ ...st, status: 'idle', errorMsg: undefined })));
  };

  // Handle AI analysis and drawing generation
  const handleAnalyze = async (prompt: string, imageBase64?: string, imageMime?: string) => {
    const storedKey = typeof window !== 'undefined' ? localStorage.getItem('gemini_api_key') : null;
    if (!storedKey) {
      setIsSettingsOpen(true);
      return;
    }

    setIsLoading(true);
    setVerbatimError(null);
    setStatusMessage('Đang phân tích đề bài...');

    // Reset steps to idle
    setSteps([
      { id: 1, label: 'Bước 1: Bóc tách thực thể toán học & OCR', status: 'processing' },
      { id: 2, label: 'Bước 2: Tính toán tọa độ 3D & Nét vẽ SGK', status: 'idle' },
      { id: 3, label: 'Bước 3: Dựng hình không gian 3D & Xuất dữ liệu', status: 'idle' },
    ]);

    try {
      const storedModel = typeof window !== 'undefined' ? localStorage.getItem('selected_model') : 'gemini-3-flash-preview';

      const result = await solveMathProblem({
        prompt,
        imageBase64,
        imageMime,
        apiKey: storedKey,
        preferredModel: storedModel || 'gemini-3-flash-preview',
        onStatusUpdate: (msg, modelName) => {
          setStatusMessage(msg);
          setActiveModel(modelName);
        },
        onStepUpdate: (stepNum, status, errMsg) => {
          setSteps((prev) =>
            prev.map((s) => {
              if (s.id === stepNum) {
                return { ...s, status, errorMsg: errMsg };
              }
              if (status === 'error' && s.id > stepNum) {
                // Rule 3: Trạng thái các cột đang chờ phải chuyển thành "Đã dừng do lỗi"
                return { ...s, status: 'error', errorMsg: 'Đã dừng do lỗi' };
              }
              return s;
            })
          );
        },
      });

      setCurrentProblem(result);
      setSelectedPresetId('custom');
      setStatusMessage('');
      setSteps([
        { id: 1, label: 'Bước 1: Bóc tách thực thể toán học & OCR', status: 'success' },
        { id: 2, label: 'Bước 2: Tính toán tọa độ 3D & Nét vẽ SGK', status: 'success' },
        { id: 3, label: 'Bước 3: Dựng hình không gian 3D & Xuất dữ liệu', status: 'success' },
      ]);
    } catch (err: any) {
      console.error('Error analyzing problem:', err);
      const rawMsg = err.message || 'Lỗi không xác định khi gọi AI API.';
      // Rule 3: Hiển thị nguyên văn lỗi từ API (VD: 429 RESOURCE_EXHAUSTED)
      setVerbatimError(rawMsg);

      // Rule 3: Trạng thái các bước đang chờ phải chuyển thành "Đã dừng do lỗi", tuyệt đối không hiện checkmark xanh
      setSteps((prev) =>
        prev.map((s) => ({
          ...s,
          status: 'error',
          errorMsg: s.status === 'success' ? undefined : 'Đã dừng do lỗi',
        }))
      );
    } finally {
      setIsLoading(false);
      setStatusMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-sky-500/30 selection:text-sky-200">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Identity: TRỢ LÝ VẼ HÌNH _ PHẠM HẬU */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 via-indigo-600 to-amber-500 flex items-center justify-center shadow-lg shadow-sky-500/20 text-white font-black text-lg">
              ∑
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black tracking-tight text-white uppercase">
                  TRỢ LÝ VẼ HÌNH _ PHẠM HẬU
                </h1>
                <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-wider bg-sky-500/10 text-sky-400 border border-sky-500/20 px-2 py-0.5 rounded-md">
                  Toán Học AI
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                Hệ sinh thái Nạp đề & Dựng hình học 3D chuẩn SGK (Phân tích OCR • Tọa độ chuẩn • Nét vẽ logic)
              </p>
            </div>
          </div>

          {/* Action Header Tools (Rule 2: Nút Settings (API Key) kèm dòng chữ màu đỏ "Lấy API key để sử dụng app" luôn hiển thị) */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all shadow-sm hover:border-slate-600"
              title="Cài đặt Model & API Key"
            >
              <Key className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="hidden lg:inline text-slate-300">Settings</span>
              <span className="text-[11px] font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-md">
                Lấy API key để sử dụng app
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-5">
        {/* Step Progress & Error Banner (Rule 3) */}
        {verbatimError && (
          <div className="bg-rose-950/60 border-2 border-rose-500 rounded-2xl p-4 shadow-xl space-y-2 animate-in fade-in">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-rose-300 uppercase tracking-wide">
                    Đã dừng do lỗi API (Nguyên văn lỗi hệ thống):
                  </h4>
                  <pre className="text-xs text-rose-200 mt-1 font-mono whitespace-pre-wrap break-all bg-rose-900/40 p-2.5 rounded-lg border border-rose-800">
                    {verbatimError}
                  </pre>
                </div>
              </div>
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl shrink-0 transition-colors shadow-md"
              >
                Đổi API Key
              </button>
            </div>
            <p className="text-[11px] text-rose-300/80">
              💡 Gợi ý: Nếu gặp lỗi <code>429 RESOURCE_EXHAUSTED</code>, vui lòng vào Settings để đổi sang API Key khác hoặc chọn model dự phòng.
            </p>
          </div>
        )}

        {/* Step Indicators Bar (Only green checkmark when actually successful, "Đã dừng do lỗi" when failed) */}
        {(isLoading || verbatimError) && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 shadow-md">
            <div className="text-[11px] font-semibold text-slate-400 mb-2 flex items-center justify-between">
              <span>Tiến trình xử lý:</span>
              {statusMessage && <span className="text-amber-400 animate-pulse">{statusMessage}</span>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {steps.map((st) => {
                let badgeClass = 'bg-slate-950 border-slate-800 text-slate-400';
                let icon = <span className="w-2 h-2 rounded-full bg-slate-600" />;

                if (st.status === 'processing') {
                  badgeClass = 'bg-amber-950/50 border-amber-500/50 text-amber-300 animate-pulse';
                  icon = <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />;
                } else if (st.status === 'success') {
                  badgeClass = 'bg-emerald-950/50 border-emerald-500/50 text-emerald-300';
                  icon = <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
                } else if (st.status === 'error') {
                  badgeClass = 'bg-rose-950/60 border-rose-600/60 text-rose-300 font-semibold';
                  icon = <XCircle className="w-3.5 h-3.5 text-rose-400" />;
                }

                return (
                  <div
                    key={st.id}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg border text-xs ${badgeClass}`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {icon}
                      <span className="truncate">{st.label}</span>
                    </div>
                    {st.status === 'error' && (
                      <span className="text-[10px] font-bold text-rose-400 bg-rose-900/60 px-1.5 py-0.5 rounded ml-1 shrink-0">
                        {st.errorMsg || 'Đã dừng do lỗi'}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Section 1: Problem Input Panel (Nạp đề bài) */}
        <ProblemInputPanel
          onAnalyze={handleAnalyze}
          onSelectPreset={handleSelectPreset}
          isLoading={isLoading}
          selectedPresetId={selectedPresetId}
          statusMessage={statusMessage}
        />

        {/* Section 2: Problem Overview Header */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-sky-400 bg-sky-950 border border-sky-800/80 px-2.5 py-0.5 rounded-full">
                {currentProblem.chapterTag || 'Toán học Phổ thông'}
              </span>
              <span className="text-[11px] font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-md">
                {currentProblem.modelType === 'geometry_3d' ? 'Hình học không gian 3D' : 'Đồ thị / Hình học 2D'}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              {currentProblem.title}
            </h2>
            <div className="text-xs text-slate-300 line-clamp-2">
              <LatexDisplay content={currentProblem.analysis.problemSummary} />
            </div>
          </div>
        </div>

        {/* Section 3: Visual Drawing Station (Khung Vẽ Hình Đồng Bộ) */}
        <div className="space-y-5">
          <div>
            {currentProblem.modelType === 'geometry_3d' ? (
              <Math3DViewer data={currentProblem} />
            ) : (
              <AlgebraGrapher data={currentProblem} />
            )}
          </div>

          {/* Geometry Specifications & Coordinates synchronized with the problem */}
          <GeometrySpecsCard data={currentProblem} />
        </div>
      </main>

      {/* API Key Settings Modal (Rule 2: Khi chưa có key, hiển thị Modal bắt buộc nhập) */}
      <ApiKeySettingsModal
        isOpen={isSettingsOpen}
        isRequired={!hasApiKey}
        onClose={() => setIsSettingsOpen(false)}
        onSaved={(key) => {
          setHasApiKey(Boolean(key));
          setVerbatimError(null);
        }}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950 py-4 text-center text-xs text-slate-500">
        <p>TRỢ LÝ VẼ HÌNH _ PHẠM HẬU • Nền tảng Nạp đề & Tự động vẽ hình chuẩn SGK Toán học</p>
      </footer>
    </div>
  );
}
