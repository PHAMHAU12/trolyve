import React, { useState } from 'react';
import { MathProblemResponse } from '../data/sampleProblems';
import { 
  FileCode2, 
  Download, 
  Copy, 
  Check, 
  Code2, 
  Share2, 
  QrCode, 
  FileText, 
  ExternalLink,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';
import { LatexDisplay } from './LatexDisplay';

interface ExportDataPanelProps {
  data: MathProblemResponse;
}

export const ExportDataPanel: React.FC<ExportDataPanelProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState<'latex' | 'svg' | 'geogebra' | 'ar'>('latex');
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const downloadSvg = () => {
    const blob = new Blob([data.exportData.svgCode], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${data.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const downloadLatex = () => {
    const blob = new Blob([data.exportData.latexExercise], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${data.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.tex`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      {/* Tabs Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-sky-500/10 text-sky-400 rounded-lg border border-sky-500/20">
            <Share2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">
              Xuất Dữ liệu & Xuất bản Giáo án
            </h3>
            <p className="text-[11px] text-slate-400">
              Tương thích trực tiếp PowerPoint, Canva, GeoGebra, TeXMaker và AR 3D
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('latex')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'latex'
                ? 'bg-sky-500 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Mã LaTeX
          </button>
          <button
            onClick={() => setActiveTab('svg')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'svg'
                ? 'bg-sky-500 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Đồ họa SVG
          </button>
          <button
            onClick={() => setActiveTab('geogebra')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'geogebra'
                ? 'bg-sky-500 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            GeoGebra / Desmos
          </button>
          <button
            onClick={() => setActiveTab('ar')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'ar'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Thực tế ảo AR
          </button>
        </div>
      </div>

      {/* Tab 1: LaTeX */}
      {activeTab === 'latex' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">
              Mã nguồn LaTeX chuẩn gói bài tập (exercise & solution):
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => copyToClipboard(data.exportData.latexExercise, 'latex')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
              >
                {copiedType === 'latex' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedType === 'latex' ? 'Đã sao chép' : 'Sao chép LaTeX'}</span>
              </button>
              <button
                onClick={downloadLatex}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600/20 hover:bg-sky-600/30 text-sky-300 text-xs font-medium border border-sky-500/30 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Tải .tex</span>
              </button>
            </div>
          </div>

          <div className="bg-slate-950 rounded-xl p-3.5 border border-slate-800 font-mono text-xs text-sky-300 overflow-x-auto max-h-[220px]">
            <pre className="whitespace-pre-wrap">{data.exportData.latexExercise}</pre>
          </div>

          {/* Rendered Preview */}
          <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800/80">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Bản xem trước công thức:
            </div>
            <LatexDisplay content={data.exportData.latexExercise} className="text-slate-200 text-xs" />
          </div>
        </div>
      )}

      {/* Tab 2: SVG Vector */}
      {activeTab === 'svg' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">
              Đồ họa vector SVG 2D sắc nét (không vỡ hạt khi phóng to trên Slide / Canva):
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => copyToClipboard(data.exportData.svgCode, 'svg')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
              >
                {copiedType === 'svg' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedType === 'svg' ? 'Đã sao chép' : 'Sao chép mã SVG'}</span>
              </button>
              <button
                onClick={downloadSvg}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 text-xs font-medium border border-emerald-500/30 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Tải tệp .svg</span>
              </button>
            </div>
          </div>

          {/* Live SVG Preview Box */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center bg-slate-950 rounded-xl p-4 border border-slate-800">
            <div className="flex items-center justify-center bg-white rounded-lg p-2 shadow-inner max-h-[260px] overflow-hidden">
              <div
                className="w-full max-w-[320px]"
                dangerouslySetInnerHTML={{ __html: data.exportData.svgCode }}
              />
            </div>
            <div className="space-y-2 text-xs">
              <div className="font-semibold text-slate-200">Đặc tính kỹ thuật SVG:</div>
              <ul className="space-y-1 text-slate-400 text-[11px]">
                <li>• Kích thước: Vector tỷ lệ chuẩn 500x400 viewBox</li>
                <li>• Quy ước chuẩn: Nét đứt (dashed 5,5) cho cạnh khuất</li>
                <li>• Tô màu thiết diện: Gradient trong suốt chuẩn in ấn</li>
                <li>• Chèn trực tiếp: PowerPoint &rarr; Insert Picture &rarr; SVG</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: GeoGebra */}
      {activeTab === 'geogebra' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">
              Kịch bản khởi tạo tự động trên GeoGebra 3D / Desmos:
            </span>
            <button
              onClick={() => copyToClipboard(data.exportData.geogebraScript, 'ggb')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
            >
              {copiedType === 'ggb' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedType === 'ggb' ? 'Đã sao chép' : 'Sao chép lệnh'}</span>
            </button>
          </div>

          <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 font-mono text-xs text-emerald-300 overflow-x-auto max-h-[200px]">
            <pre>{data.exportData.geogebraScript}</pre>
          </div>
          <p className="text-[11px] text-slate-400">
            Mẹo: Dán trực tiếp vào thanh nhập lệnh (Input Bar) của GeoGebra 3D Calculator để tự động sinh đối tượng hình học.
          </p>
        </div>
      )}

      {/* Tab 4: AR Virtual Reality */}
      {activeTab === 'ar' && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-indigo-950/60 to-purple-950/60 border border-indigo-800/60 rounded-xl p-4 flex flex-col sm:flex-row items-center gap-4">
            {/* Mock QR Code for Classroom Smartphone scanning */}
            <div className="bg-white p-3 rounded-xl shadow-lg shrink-0 flex flex-col items-center">
              <svg width="110" height="110" viewBox="0 0 110 110">
                <rect width="110" height="110" fill="white" />
                {/* QR corner 1 */}
                <rect x="10" y="10" width="28" height="28" fill="#0f172a" rx="4" />
                <rect x="16" y="16" width="16" height="16" fill="white" rx="2" />
                <rect x="20" y="20" width="8" height="8" fill="#0f172a" rx="1" />
                {/* QR corner 2 */}
                <rect x="72" y="10" width="28" height="28" fill="#0f172a" rx="4" />
                <rect x="78" y="16" width="16" height="16" fill="white" rx="2" />
                <rect x="82" y="20" width="8" height="8" fill="#0f172a" rx="1" />
                {/* QR corner 3 */}
                <rect x="10" y="72" width="28" height="28" fill="#0f172a" rx="4" />
                <rect x="16" y="78" width="16" height="16" fill="white" rx="2" />
                <rect x="20" y="82" width="8" height="8" fill="#0f172a" rx="1" />
                {/* Random Pattern Dots */}
                <circle cx="48" cy="20" r="3" fill="#0f172a" />
                <circle cx="58" cy="24" r="3" fill="#0f172a" />
                <circle cx="48" cy="38" r="3" fill="#0f172a" />
                <circle cx="58" cy="48" r="3" fill="#0f172a" />
                <circle cx="24" cy="54" r="3" fill="#0f172a" />
                <circle cx="36" cy="54" r="3" fill="#0f172a" />
                <circle cx="76" cy="54" r="3" fill="#0f172a" />
                <circle cx="88" cy="54" r="3" fill="#0f172a" />
                <circle cx="48" cy="74" r="3" fill="#0f172a" />
                <circle cx="58" cy="84" r="3" fill="#0f172a" />
                <circle cx="74" cy="80" r="3" fill="#0f172a" />
                <circle cx="86" cy="88" r="3" fill="#0f172a" />
              </svg>
              <span className="text-[10px] font-bold text-slate-800 mt-1">Quét mở AR 3D</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="font-bold text-white text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Trải nghiệm Thực tế Tăng cường (AR Web)</span>
              </div>
              <p className="text-slate-300 leading-relaxed text-xs">
                Chiếu mô hình 3D trực tiếp lên mặt bàn học sinh hoặc bục giảng. Tương thích WebXR / Apple Quick Look / Android Scene Viewer.
              </p>
              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-indigo-300">Điểm neo không gian (AR Anchors):</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {(data.model3D?.arAnchorPoints || ['Gốc tâm đáy O(0,0,0)', 'Đỉnh S']).map((pt, i) => (
                    <span key={i} className="text-[10px] font-mono bg-indigo-900/60 border border-indigo-700/60 text-indigo-200 px-2 py-0.5 rounded-md">
                      {pt}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Teacher Notes / Ghi chú sư phạm bổ sung */}
      {data.teacherNotes && data.teacherNotes.length > 0 && (
        <div className="bg-slate-950/80 rounded-xl p-3.5 border border-slate-800 space-y-2">
          <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5" />
            <span>Ghi chú Sư phạm & Sai lầm học sinh thường gặp:</span>
          </div>
          <ul className="space-y-1 text-xs text-slate-300">
            {data.teacherNotes.map((note, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <LatexDisplay content={note} className="text-xs" />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
