import React, { useState, useRef } from 'react';
import { 
  Sparkles, 
  UploadCloud, 
  FileImage, 
  X, 
  BookOpen, 
  Layers, 
  Loader2, 
  CheckCircle2,
  Send,
  HelpCircle,
  FileText
} from 'lucide-react';
import { PRESET_PROBLEMS, PresetProblem } from '../data/sampleProblems';

interface ProblemInputPanelProps {
  onAnalyze: (prompt: string, imageBase64?: string, imageMime?: string) => Promise<void>;
  onSelectPreset: (preset: PresetProblem) => void;
  isLoading: boolean;
  selectedPresetId: string;
  statusMessage?: string;
}

export const ProblemInputPanel: React.FC<ProblemInputPanelProps> = ({
  onAnalyze,
  onSelectPreset,
  isLoading,
  selectedPresetId,
  statusMessage,
}) => {
  const [promptText, setPromptText] = useState('');
  const [imageFile, setImageFile] = useState<{ base64: string; mime: string; name: string } | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn tệp hình ảnh (PNG, JPEG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setImageFile({
        base64,
        mime: file.type,
        name: file.name,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.startsWith('image/')) {
        const file = items[i].getAsFile();
        if (file) {
          processFile(file);
          break;
        }
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptText.trim() && !imageFile) return;
    onAnalyze(promptText, imageFile?.base64, imageFile?.mime);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-gradient-to-tr from-sky-500 to-indigo-600 text-white rounded-xl shadow-md shadow-sky-500/20">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <span>Nạp đề bài toán học</span>
              <span className="text-[11px] font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20 px-2 py-0.5 rounded-md">
                Tự động đồng bộ hình vẽ
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Nhập đề, dán ảnh tài liệu (OCR) hoặc chọn bài tập mẫu chuẩn SGK
            </p>
          </div>
        </div>

        {/* Quick Help Badge */}
        <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-400 bg-slate-950 px-3 py-1 rounded-full border border-slate-800">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Chuẩn SGK Kết nối tri thức</span>
        </span>
      </div>

      {/* Preset Problems Row */}
      <div>
        <label className="text-xs font-semibold text-slate-400 block mb-1.5">
          Đề bài mẫu dựng sẵn (Đồng bộ ngay khi chọn):
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {PRESET_PROBLEMS.map((preset) => {
            const isSelected = selectedPresetId === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => {
                  setPromptText(preset.fullPrompt);
                  setImageFile(null);
                  onSelectPreset(preset);
                }}
                className={`text-left p-2.5 rounded-xl border transition-all text-xs flex flex-col justify-between ${
                  isSelected
                    ? 'bg-sky-950/70 border-sky-500 text-sky-200 shadow-md shadow-sky-500/20 ring-1 ring-sky-500/50'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-white line-clamp-1">{preset.title}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {preset.grade}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2">{preset.brief}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} onPaste={handlePaste} className="space-y-3">
        <div className="relative">
          <textarea
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            placeholder="Nhập hoặc dán đề toán vào đây (Ví dụ: Cho hình hộp ABCD.A'B'C'D'... hoặc Cho hình lăng trụ tam giác ABC.A'B'C'... hoặc Cho hình chóp S.ABCD)..."
            rows={3}
            className="w-full bg-slate-950 border border-slate-800 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 rounded-xl p-3 text-sm text-slate-200 placeholder-slate-500 outline-none resize-none transition-all"
          />
        </div>

        {/* OCR Image Dropzone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-2.5 text-center transition-all ${
            dragOver
              ? 'border-sky-400 bg-sky-950/30'
              : imageFile
              ? 'border-emerald-500/50 bg-emerald-950/20'
              : 'border-slate-800 bg-slate-950/40 hover:border-slate-700'
          }`}
        >
          {imageFile ? (
            <div className="flex items-center justify-between bg-slate-900 px-3 py-2 rounded-lg border border-slate-700/60">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <img
                  src={imageFile.base64}
                  alt="Đề bài"
                  className="w-10 h-10 object-cover rounded-md border border-slate-700 shrink-0"
                />
                <div className="text-left overflow-hidden">
                  <div className="text-xs font-semibold text-slate-200 truncate">{imageFile.name}</div>
                  <div className="text-[11px] text-emerald-400 flex items-center gap-1">
                    <FileImage className="w-3 h-3" /> Đã nạp ảnh đề bài (hỗ trợ OCR tự động)
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setImageFile(null)}
                className="p-1 hover:bg-slate-800 rounded-md text-slate-400 hover:text-rose-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-xs text-slate-400 py-1">
              <UploadCloud className="w-4 h-4 text-sky-400" />
              <span>
                Kéo thả ảnh đề bài, hoặc{' '}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-sky-400 font-semibold hover:underline"
                >
                  tải tệp ảnh từ máy
                </button>{' '}
                (Hỗ trợ chụp màn hình rồi dán trực tiếp bằng Ctrl+V)
              </span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          )}
        </div>

        {/* Submit & Status Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          {/* Status feedback */}
          <div className="text-xs text-slate-400 flex items-center gap-2">
            {isLoading ? (
              <div className="flex items-center gap-2 text-amber-400">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>{statusMessage || 'Đang bóc tách đề bài & dựng hình học 3D...'}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-slate-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>Sẵn sàng nạp đề & vẽ hình chuẩn SGK</span>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || (!promptText.trim() && !imageFile)}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-sky-500 via-indigo-600 to-indigo-700 hover:from-sky-400 hover:to-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs rounded-xl shadow-lg shadow-sky-500/25 transition-all"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang vẽ hình theo đề...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>VẼ HÌNH THEO ĐỀ BÀI</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
