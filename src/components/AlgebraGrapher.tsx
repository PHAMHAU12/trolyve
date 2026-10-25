import React, { useState, useEffect, useRef } from 'react';
import { MathProblemResponse } from '../data/sampleProblems';
import { Sliders, TrendingUp, Compass, RefreshCw, ZoomIn, ZoomOut, ArrowDown, ArrowUp } from 'lucide-react';

interface AlgebraGrapherProps {
  data: MathProblemResponse;
}

export const AlgebraGrapher: React.FC<AlgebraGrapherProps> = ({ data }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const algebra = data.algebra2D;

  const [mVal, setMVal] = useState<number>(algebra?.defaultParam ?? 0);
  const [scale, setScale] = useState<number>(45); // pixels per unit
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 50 }); // Lowered by default
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Cubic function: y = x^3 - 3mx^2 + 3(m^2 - 1)x + 1
  const evaluateF = (x: number, m: number) => {
    return Math.pow(x, 3) - 3 * m * Math.pow(x, 2) + 3 * (m * m - 1) * x + 1;
  };

  // Derivative y' = 3x^2 - 6mx + 3(m^2 - 1)
  const x_cd = mVal - 1; // local max
  const y_cd = evaluateF(x_cd, mVal);
  const x_ct = mVal + 1; // local min
  const y_ct = evaluateF(x_ct, mVal);
  const x_inflection = mVal; // inflection point
  const y_inflection = evaluateF(x_inflection, mVal);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const originX = width / 2 + pan.x;
    const originY = height / 2 + pan.y;

    // Clear background
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, width, height);

    // Grid lines
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#1e293b';
    const gridSize = scale;

    const startX = originX % gridSize;
    for (let x = startX; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    const startY = originY % gridSize;
    for (let y = startY; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Axes Oxy
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2;

    // Ox
    ctx.beginPath();
    ctx.moveTo(0, originY);
    ctx.lineTo(width, originY);
    ctx.stroke();

    // Oy
    ctx.beginPath();
    ctx.moveTo(originX, 0);
    ctx.lineTo(originX, height);
    ctx.stroke();

    // Arrowheads
    ctx.fillStyle = '#94a3b8';
    // Ox arrow
    ctx.beginPath();
    ctx.moveTo(width - 12, originY - 5);
    ctx.lineTo(width, originY);
    ctx.lineTo(width - 12, originY + 5);
    ctx.fill();

    // Oy arrow
    ctx.beginPath();
    ctx.moveTo(originX - 5, 12);
    ctx.lineTo(originX, 0);
    ctx.lineTo(originX + 5, 12);
    ctx.fill();

    // Axis Labels
    ctx.font = 'bold 13px system-ui, sans-serif';
    ctx.fillStyle = '#cbd5e1';
    ctx.fillText('x', width - 20, originY - 10);
    ctx.fillText('y', originX + 10, 20);
    ctx.fillText('O', originX - 16, originY + 16);

    // Tick markers and coordinates numbers
    ctx.font = '11px monospace';
    ctx.fillStyle = '#64748b';
    for (let i = -10; i <= 10; i++) {
      if (i === 0) continue;
      const tickX = originX + i * scale;
      if (tickX > 0 && tickX < width) {
        ctx.beginPath();
        ctx.moveTo(tickX, originY - 3);
        ctx.lineTo(tickX, originY + 3);
        ctx.stroke();
        ctx.fillText(i.toString(), tickX - 5, originY + 16);
      }
      const tickY = originY - i * scale;
      if (tickY > 0 && tickY < height) {
        ctx.beginPath();
        ctx.moveTo(originX - 3, tickY);
        ctx.lineTo(originX + 3, tickY);
        ctx.stroke();
        ctx.fillText(i.toString(), originX + 6, tickY + 4);
      }
    }

    // Locus line for inflection point: y = -2x + 1
    ctx.strokeStyle = '#a855f755';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    for (let px = 0; px <= width; px += 20) {
      const mathX = (px - originX) / scale;
      const mathY = -2 * mathX + 1;
      const py = originY - mathY * scale;
      if (px === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Curve: y = x^3 - 3mx^2 + 3(m^2 - 1)x + 1
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#38bdf8';
    ctx.beginPath();
    let isFirst = true;

    for (let px = 0; px <= width; px += 2) {
      const mathX = (px - originX) / scale;
      const mathY = evaluateF(mathX, mVal);
      const py = originY - mathY * scale;

      if (isFirst) {
        ctx.moveTo(px, py);
        isFirst = false;
      } else {
        ctx.lineTo(px, py);
      }
    }
    ctx.stroke();

    // Plot Points: Cực đại (CD)
    const px_cd = originX + x_cd * scale;
    const py_cd = originY - y_cd * scale;
    ctx.fillStyle = '#f43f5e';
    ctx.beginPath();
    ctx.arc(px_cd, py_cd, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.font = 'bold 12px system-ui, sans-serif';
    ctx.fillStyle = '#fda4af';
    ctx.fillText(`CĐ (${x_cd.toFixed(1)}, ${y_cd.toFixed(1)})`, px_cd - 40, py_cd - 12);

    // Plot Points: Cực tiểu (CT)
    const px_ct = originX + x_ct * scale;
    const py_ct = originY - y_ct * scale;
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(px_ct, py_ct, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#6ee7b7';
    ctx.fillText(`CT (${x_ct.toFixed(1)}, ${y_ct.toFixed(1)})`, px_ct + 10, py_ct + 16);

    // Inflection Point I
    const px_i = originX + x_inflection * scale;
    const py_i = originY - y_inflection * scale;
    ctx.fillStyle = '#c084fc';
    ctx.beginPath();
    ctx.arc(px_i, py_i, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#e9d5ff';
    ctx.fillText(`I (${x_inflection.toFixed(1)}, ${y_inflection.toFixed(1)})`, px_i + 8, py_i - 8);

  }, [mVal, scale, pan]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="relative w-full bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col">
      {/* Canvas */}
      <div className="relative h-[440px] w-full cursor-grab active:cursor-grabbing">
        <canvas
          ref={canvasRef}
          width={750}
          height={440}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="w-full h-full block"
        />

        {/* Top Floating Badge */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-700/60 shadow-lg">
          <div className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-pulse" />
          <span className="text-xs font-semibold text-slate-200 font-mono">
            y = x³ - 3({mVal.toFixed(1)})x² + 3({(mVal * mVal - 1).toFixed(2)})x + 1
          </span>
        </div>

        {/* Zoom, Pan & Reset Controls */}
        <div className="absolute top-4 right-4 z-10 flex items-center gap-1 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-700/60 shadow-lg">
          {/* Lower / Raise Graph */}
          <button
            onClick={() => setPan((p) => ({ ...p, y: p.y + 30 }))}
            className="flex items-center gap-1 px-2 py-1 text-[11px] font-semibold text-amber-300 hover:bg-slate-800 rounded transition-colors"
            title="Hạ đồ thị xuống thêm"
          >
            <ArrowDown className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Hạ xuống</span>
          </button>
          <button
            onClick={() => setPan((p) => ({ ...p, y: p.y - 30 }))}
            className="flex items-center gap-1 px-2 py-1 text-[11px] font-semibold text-slate-300 hover:bg-slate-800 rounded transition-colors"
            title="Nâng đồ thị lên"
          >
            <ArrowUp className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Nâng lên</span>
          </button>

          <div className="w-px h-4 bg-slate-700 mx-0.5" />

          <button
            onClick={() => setScale((s) => Math.min(s + 10, 90))}
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-300"
            title="Phóng to"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setScale((s) => Math.max(s - 10, 25))}
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-300"
            title="Thu nhỏ"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setPan({ x: 0, y: 50 });
              setScale(45);
              setMVal(algebra?.defaultParam ?? 0);
            }}
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-300"
            title="Đặt lại góc nhìn mặc định"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Interactive Parameter Slider & Table of Variations */}
      <div className="p-4 bg-slate-900 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Slider */}
        <div className="flex-1 w-full bg-slate-950/70 p-3 rounded-xl border border-slate-800">
          <div className="flex justify-between items-center mb-1.5 text-xs">
            <span className="font-semibold text-sky-400 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5" />
              Tham số thực {algebra?.parameterName || 'm'}:
            </span>
            <span className="font-mono text-white bg-sky-950/80 border border-sky-800/60 px-2 py-0.5 rounded font-bold">
              m = {mVal.toFixed(2)}
            </span>
          </div>
          <input
            type="range"
            min={algebra?.minParam ?? -3}
            max={algebra?.maxParam ?? 3}
            step={0.1}
            value={mVal}
            onChange={(e) => setMVal(parseFloat(e.target.value))}
            className="w-full accent-sky-500 cursor-pointer h-2 bg-slate-700 rounded-lg appearance-none"
          />
          <div className="flex justify-between text-[11px] text-slate-400 mt-1">
            <span>m = {algebra?.minParam ?? -3}</span>
            <span className="text-amber-400 font-medium">Khoảng cách hoành độ cực trị |x₂ - x₁| = 2 (Hằng số)</span>
            <span>m = {algebra?.maxParam ?? 3}</span>
          </div>
        </div>

        {/* Extrema Quick Stats */}
        <div className="flex gap-2 w-full md:w-auto text-xs">
          <div className="flex-1 md:flex-initial bg-rose-950/30 border border-rose-800/40 p-2.5 rounded-xl">
            <div className="text-[11px] text-rose-300 font-medium">Cực Đại (CĐ)</div>
            <div className="font-mono text-rose-100 font-bold">
              ({x_cd.toFixed(2)}, {y_cd.toFixed(2)})
            </div>
          </div>
          <div className="flex-1 md:flex-initial bg-emerald-950/30 border border-emerald-800/40 p-2.5 rounded-xl">
            <div className="text-[11px] text-emerald-300 font-medium">Cực Tiểu (CT)</div>
            <div className="font-mono text-emerald-100 font-bold">
              ({x_ct.toFixed(2)}, {y_ct.toFixed(2)})
            </div>
          </div>
          <div className="flex-1 md:flex-initial bg-purple-950/30 border border-purple-800/40 p-2.5 rounded-xl">
            <div className="text-[11px] text-purple-300 font-medium">Điểm uốn I</div>
            <div className="font-mono text-purple-100 font-bold">
              ({x_inflection.toFixed(2)}, {y_inflection.toFixed(2)})
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
