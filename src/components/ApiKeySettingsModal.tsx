import React, { useState, useEffect } from 'react';
import { Key, ExternalLink, Check, AlertCircle, Sparkles, Cpu, ShieldCheck, X, AlertTriangle } from 'lucide-react';
import { AI_MODELS } from '../services/aiService';

interface ApiKeySettingsModalProps {
  isOpen: boolean;
  isRequired?: boolean;
  onClose: () => void;
  onSaved: (apiKey: string, model: string) => void;
}

export const ApiKeySettingsModal: React.FC<ApiKeySettingsModalProps> = ({
  isOpen,
  isRequired = false,
  onClose,
  onSaved,
}) => {
  const [apiKey, setApiKey] = useState('');
  const [selectedModel, setSelectedModel] = useState('gemini-3-flash-preview');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedKey = localStorage.getItem('gemini_api_key') || '';
      const storedModel = localStorage.getItem('selected_model') || 'gemini-3-flash-preview';
      setApiKey(storedKey);
      setSelectedModel(storedModel);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanKey = apiKey.trim();
    if (!cleanKey && isRequired) {
      setValidationError('Vui lòng nhập API Key để kích hoạt ứng dụng trước khi tiếp tục.');
      return;
    }

    if (typeof window !== 'undefined') {
      if (cleanKey) {
        localStorage.setItem('gemini_api_key', cleanKey);
      }
      localStorage.setItem('selected_model', selectedModel);
    }

    setSavedSuccess(true);
    setValidationError('');
    onSaved(cleanKey, selectedModel);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 max-w-lg w-full rounded-2xl p-6 shadow-2xl relative space-y-5 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-gradient-to-tr from-amber-500 to-rose-500 text-white rounded-xl shadow-md">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <span>Thiết lập Model & API Key</span>
                {isRequired && (
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-rose-500/20 text-rose-400 border border-rose-500/30 px-2 py-0.5 rounded-md">
                    Bắt buộc nhập
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-400">
                Nhập Gemini API Key để ứng dụng phân tích đề bài & vẽ hình
              </p>
            </div>
          </div>
          {!isRequired && (
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Instructions banner with link to aistudio */}
        <div className="bg-gradient-to-r from-amber-950/40 via-sky-950/40 to-slate-900 border border-amber-500/30 rounded-xl p-3.5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Lấy API Key Miễn Phí (Google AI Studio)
            </span>
            <a
              href="https://aistudio.google.com/api-keys"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-300 hover:text-amber-200 bg-amber-500/20 hover:bg-amber-500/30 px-2.5 py-1 rounded-lg border border-amber-500/40 transition-colors shadow-sm"
            >
              <span>Truy cập lấy API key</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            1. Đăng nhập tài khoản Google tại <a href="https://aistudio.google.com/api-keys" target="_blank" rel="noreferrer" className="text-sky-400 underline font-semibold">aistudio.google.com/api-keys</a>.<br />
            2. Nhấn nút <strong>"Create API Key"</strong> $\rightarrow$ Sao chép mã key rồi dán vào ô bên dưới.
          </p>
        </div>

        {/* Model AI Selection Cards (Exact order from AI_INSTRUCTIONS.md) */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 block">
            Chọn mô hình AI (Thứ tự ưu tiên):
          </label>
          <div className="grid grid-cols-1 gap-2">
            {AI_MODELS.map((model) => {
              const isSelected = selectedModel === model.id;
              return (
                <div
                  key={model.id}
                  onClick={() => setSelectedModel(model.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-sky-950/70 border-sky-500 text-sky-200 ring-1 ring-sky-500/50 shadow-sm'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold font-mono text-white">{model.name}</span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        model.tag === 'Mặc định'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}>
                        {model.tag}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">{model.description}</p>
                  </div>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                    isSelected ? 'border-sky-400 bg-sky-500' : 'border-slate-700'
                  }`}>
                    {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-3.5">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Mã Gemini API Key:
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => {
                setApiKey(e.target.value);
                setValidationError('');
              }}
              placeholder="Dán mã AIzaSy... vào đây"
              className="w-full bg-slate-950 border border-slate-800 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 outline-none font-mono"
            />
            {validationError && (
              <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{validationError}</span>
              </p>
            )}
            <p className="text-[10px] text-slate-500 mt-1">
              Lưu vào <code>localStorage</code> trên máy của bạn. Tự động chuyển đổi sang model dự phòng khi hết quota.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-800">
            {!isRequired && (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                Đóng
              </button>
            )}
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white shadow-lg shadow-sky-600/30 transition-all"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>Đã lưu thành công!</span>
                </>
              ) : (
                <span>Lưu & Kích hoạt App</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
