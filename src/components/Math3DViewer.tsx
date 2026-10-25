import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { MathProblemResponse } from '../data/sampleProblems';
import { 
  RotateCw, 
  Compass, 
  Eye, 
  Sliders, 
  RefreshCw,
  Sun,
  Moon,
  Camera,
  Copy,
  Download,
  ArrowDown,
  ArrowUp,
  Layers,
  Check,
  Maximize2
} from 'lucide-react';

interface Math3DViewerProps {
  data: MathProblemResponse;
  activeStep?: number;
}

export const Math3DViewer: React.FC<Math3DViewerProps> = ({ data }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [crossSectionParam, setCrossSectionParam] = useState<number>(
    data.model3D?.crossSection?.defaultVal ?? 0.5
  );
  const [autoRotate, setAutoRotate] = useState(false);
  const [cameraPreset, setCameraPreset] = useState<'iso' | 'top' | 'front'>('iso');
  const [isWhitePaperMode, setIsWhitePaperMode] = useState(false);
  const [showLabels, setShowLabels] = useState(true);
  const [showFaces, setShowFaces] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [copiedSuccess, setCopiedSuccess] = useState(false);
  const [yOffset, setYOffset] = useState<number>(-1.3);
  const yOffsetRef = useRef<number>(-1.3);

  // Screen projected coordinates for 2D labels over 3D canvas
  const [projectedLabels, setProjectedLabels] = useState<
    Array<{ id: string; x: number; y: number; role?: string; visible: boolean }>
  >([]);

  // Refs for threejs objects
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const dynamicGroupRef = useRef<THREE.Group | null>(null);
  const gridRef = useRef<THREE.GridHelper | null>(null);
  const facesGroupRef = useRef<THREE.Group | null>(null);

  // Initialize Scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container || !data.model3D) return;

    const width = container.clientWidth || 700;
    const height = container.clientHeight || 520;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(isWhitePaperMode ? '#ffffff' : '#090d16');
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(5.5, 3.8, 8.0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: true, // Necessary for screenshot & clipboard copy
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = isWhitePaperMode ? 1.0 : 1.15;
    rendererRef.current = renderer;

    container.replaceChildren(renderer.domElement);

    // Environment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Lighting
    const ambientLight = new THREE.HemisphereLight(
      isWhitePaperMode ? '#ffffff' : '#bae6fd',
      isWhitePaperMode ? '#cbd5e1' : '#1e293b',
      isWhitePaperMode ? 1.2 : 0.9
    );
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight('#ffffff', isWhitePaperMode ? 1.4 : 1.8);
    dirLight.position.set(6, 12, 8);
    scene.add(dirLight);

    const rimLight = new THREE.DirectionalLight('#38bdf8', isWhitePaperMode ? 0.3 : 0.7);
    rimLight.position.set(-6, -4, -6);
    scene.add(rimLight);

    // Grid
    const gridColor1 = isWhitePaperMode ? '#cbd5e1' : '#334155';
    const gridColor2 = isWhitePaperMode ? '#f1f5f9' : '#1e293b';
    const grid = new THREE.GridHelper(10, 20, gridColor1, gridColor2);
    grid.position.y = -0.01 + yOffsetRef.current;
    grid.visible = showGrid;
    scene.add(grid);
    gridRef.current = grid;

    // Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.target.set(0, 0.4, 0);
    controls.maxDistance = 25;
    controls.minDistance = 2;
    controlsRef.current = controls;

    // Model Group
    const modelGroup = new THREE.Group();
    modelGroup.position.y = yOffsetRef.current;
    scene.add(modelGroup);
    dynamicGroupRef.current = modelGroup;

    // Faces Group
    const facesGroup = new THREE.Group();
    modelGroup.add(facesGroup);
    facesGroupRef.current = facesGroup;

    const { vertices, edges, faces } = data.model3D;
    const vertexMap = new Map<string, THREE.Vector3>();
    vertices.forEach((v) => {
      vertexMap.set(v.id, new THREE.Vector3(v.x, v.y, v.z));
    });

    // 1. Draw Vertices (Points)
    const vertexGeom = new THREE.SphereGeometry(0.08, 16, 16);
    vertices.forEach((v) => {
      let matColor = isWhitePaperMode ? '#0284c7' : '#38bdf8';
      if (v.role === 'apex') matColor = '#f43f5e';
      else if (v.role === 'midpoint' || v.role === 'cross_section') matColor = '#d97706';
      else if (v.role === 'base') matColor = isWhitePaperMode ? '#0f766e' : '#10b981';
      else if (v.role === 'top_base' || v.role === 'base_top') matColor = isWhitePaperMode ? '#7c3aed' : '#a855f7';

      const mat = new THREE.MeshStandardMaterial({
        color: matColor,
        roughness: 0.2,
        metalness: 0.6,
      });
      const sphere = new THREE.Mesh(vertexGeom, mat);
      sphere.position.set(v.x, v.y, v.z);
      sphere.name = `vertex-${v.id}`;
      modelGroup.add(sphere);
    });

    // 2. Draw Edges (Solid vs Dashed)
    edges.forEach((edge) => {
      const p1 = vertexMap.get(edge.from);
      const p2 = vertexMap.get(edge.to);
      if (!p1 || !p2) return;

      if (edge.dashed) {
        // Hidden Dashed Line
        const geom = new THREE.BufferGeometry().setFromPoints([p1, p2]);
        const dashedColor = edge.category === 'cross_section' 
          ? (isWhitePaperMode ? '#b45309' : '#f59e0b') 
          : (isWhitePaperMode ? '#94a3b8' : '#64748b');

        const line = new THREE.Line(
          geom,
          new THREE.LineDashedMaterial({
            color: dashedColor,
            dashSize: 0.2,
            gapSize: 0.15,
            linewidth: 2,
          })
        );
        line.computeLineDistances();
        line.name = `edge-${edge.from}-${edge.to}`;
        modelGroup.add(line);
      } else {
        // Visible Solid Line
        const geom = new THREE.BufferGeometry().setFromPoints([p1, p2]);
        let lineColor = isWhitePaperMode ? '#0f172a' : '#f8fafc';
        if (edge.category === 'cross_section') {
          lineColor = isWhitePaperMode ? '#d97706' : '#f59e0b';
        } else if (edge.category === 'height') {
          lineColor = isWhitePaperMode ? '#059669' : '#10b981';
        }

        const line = new THREE.Line(
          geom,
          new THREE.LineBasicMaterial({
            color: lineColor,
            linewidth: 2.8,
          })
        );
        line.name = `edge-${edge.from}-${edge.to}`;
        modelGroup.add(line);
      }
    });

    // 3. Draw Semi-Transparent Faces
    if (faces && faces.length > 0) {
      faces.forEach((face) => {
        if (face.vertexIds.length < 3) return;
        const facePts = face.vertexIds
          .map((id) => vertexMap.get(id))
          .filter((p): p is THREE.Vector3 => Boolean(p));

        if (facePts.length < 3) return;

        const indices: number[] = [];
        for (let i = 1; i < facePts.length - 1; i++) {
          indices.push(0, i, i + 1);
        }

        const geom = new THREE.BufferGeometry();
        const positions: number[] = [];
        facePts.forEach((pt) => positions.push(pt.x, pt.y, pt.z));
        geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geom.setIndex(indices);
        geom.computeVertexNormals();

        const isCross = face.name.includes('Thiết diện') || face.vertexIds.includes('M');
        const faceColor = face.color || (isCross ? '#f59e0b' : (isWhitePaperMode ? '#38bdf8' : '#0284c7'));
        const faceOpacity = isWhitePaperMode ? (isCross ? 0.45 : 0.12) : (face.opacity || (isCross ? 0.55 : 0.15));

        const faceMat = new THREE.MeshStandardMaterial({
          color: faceColor,
          transparent: true,
          opacity: faceOpacity,
          side: THREE.DoubleSide,
          depthWrite: false,
          roughness: 0.3,
        });

        const mesh = new THREE.Mesh(geom, faceMat);
        mesh.name = `face-${face.name}`;
        facesGroup.add(mesh);
      });
    }

    // Animation & Render Loop
    let animationFrameId = 0;
    const tempVec = new THREE.Vector3();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (autoRotate && controlsRef.current) {
        controlsRef.current.autoRotate = true;
        controlsRef.current.autoRotateSpeed = 1.6;
      } else if (controlsRef.current) {
        controlsRef.current.autoRotate = false;
      }

      controls.update();
      renderer.render(scene, camera);

      // Project 3D vertex positions to 2D screen coordinates
      if (mountRef.current && camera) {
        const domRect = mountRef.current.getBoundingClientRect();
        const labels: Array<{ id: string; x: number; y: number; role?: string; visible: boolean }> = [];

        vertices.forEach((v) => {
          tempVec.set(v.x, v.y + yOffsetRef.current, v.z);
          tempVec.project(camera);

          const isBehind = tempVec.z > 1;
          const x = ((tempVec.x + 1) * domRect.width) / 2;
          const y = ((-tempVec.y + 1) * domRect.height) / 2;

          labels.push({
            id: v.id,
            x,
            y,
            role: v.role,
            visible: !isBehind && x >= -20 && x <= domRect.width + 20 && y >= -20 && y <= domRect.height + 20,
          });
        });

        setProjectedLabels(labels);
      }
    };

    animate();

    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      controls.dispose();
      if (container) {
        container.innerHTML = '';
      }
    };
  }, [data.title, isWhitePaperMode]);

  // Synchronize yOffset
  useEffect(() => {
    yOffsetRef.current = yOffset;
    if (dynamicGroupRef.current) {
      dynamicGroupRef.current.position.y = yOffset;
    }
    if (gridRef.current) {
      gridRef.current.position.y = -0.01 + yOffset;
    }
  }, [yOffset]);

  // Toggle Faces
  useEffect(() => {
    if (facesGroupRef.current) {
      facesGroupRef.current.visible = showFaces;
    }
  }, [showFaces]);

  // Toggle Grid
  useEffect(() => {
    if (gridRef.current) {
      gridRef.current.visible = showGrid;
    }
  }, [showGrid]);

  // Camera presets
  const handleCameraPreset = (preset: 'iso' | 'top' | 'front') => {
    if (!cameraRef.current || !controlsRef.current) return;
    setCameraPreset(preset);
    const camera = cameraRef.current;
    const controls = controlsRef.current;

    if (preset === 'iso') {
      camera.position.set(5.5, 3.8, 8.0);
      controls.target.set(0, 0.4 + yOffset, 0);
    } else if (preset === 'top') {
      camera.position.set(0.01, 10, 0.01);
      controls.target.set(0, yOffset, 0);
    } else if (preset === 'front') {
      camera.position.set(0, 1.8, 9);
      controls.target.set(0, 0.4 + yOffset, 0);
    }
    controls.update();
  };

  // Copy Canvas Image to Clipboard (Super convenient for teachers pasting into Word!)
  const handleCopyToClipboard = useCallback(async () => {
    if (!rendererRef.current) return;
    try {
      const canvas = rendererRef.current.domElement;
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]);
          setCopiedSuccess(true);
          setTimeout(() => setCopiedSuccess(false), 2500);
        } catch (clipErr) {
          console.warn('ClipboardItem write error:', clipErr);
          // Fallback download if clipboard item write not allowed by browser
          handleDownloadPng();
        }
      }, 'image/png');
    } catch (err) {
      console.error(err);
      alert('Không thể sao chép ảnh trực tiếp. Vui lòng bấm nút Tải ảnh PNG.');
    }
  }, []);

  // Download high-resolution PNG
  const handleDownloadPng = useCallback(() => {
    if (!rendererRef.current) return;
    const canvas = rendererRef.current.domElement;
    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `Hinh_Ve_${data.title.replace(/[^a-zA-Z0-9]/g, '_')}.png`;
    a.click();
  }, [data.title]);

  // Download SVG
  const handleDownloadSvg = useCallback(() => {
    if (!data.exportData?.svgCode) return;
    const blob = new Blob([data.exportData.svgCode], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Hinh_Ve_${data.title.replace(/[^a-zA-Z0-9]/g, '_')}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  }, [data.title, data.exportData?.svgCode]);

  return (
    <div className={`relative w-full h-[580px] rounded-2xl overflow-hidden border transition-colors shadow-2xl flex flex-col select-none ${
      isWhitePaperMode 
        ? 'bg-white border-slate-300 text-slate-800' 
        : 'bg-slate-950 border-slate-800 text-slate-100'
    }`}>
      {/* 3D WebGL Canvas Mount */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating 2D Screen Projected Vertex Labels */}
      {showLabels && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {projectedLabels.map(
            (label) =>
              label.visible && (
                <div
                  key={label.id}
                  style={{
                    left: `${label.x}px`,
                    top: `${label.y}px`,
                    transform: 'translate(-50%, -125%)',
                    transition: 'left 0.05s linear, top 0.05s linear',
                  }}
                  className="absolute flex items-center justify-center pointer-events-none z-10"
                >
                  <span
                    className={`px-1.5 py-0.5 rounded-md text-xs font-bold tracking-tight shadow-md border ${
                      label.role === 'apex'
                        ? 'bg-rose-600 text-white border-rose-400'
                        : label.role === 'midpoint' || label.role === 'cross_section'
                        ? 'bg-amber-500 text-white border-amber-300'
                        : label.role === 'top_base' || label.role === 'base_top'
                        ? 'bg-indigo-600 text-white border-indigo-400'
                        : isWhitePaperMode
                        ? 'bg-sky-50 text-sky-900 border-sky-400 shadow-sky-100'
                        : 'bg-slate-900/90 text-sky-300 border-sky-500/50'
                    }`}
                  >
                    {label.id}
                  </span>
                </div>
              )
          )}
        </div>
      )}

      {/* Top Left Header Badge */}
      <div className={`absolute top-3.5 left-3.5 z-10 flex items-center gap-2 backdrop-blur-md px-3 py-1.5 rounded-xl border shadow-md pointer-events-auto text-xs ${
        isWhitePaperMode
          ? 'bg-white/90 border-slate-200 text-slate-700'
          : 'bg-slate-900/90 border-slate-700/60 text-slate-200'
      }`}>
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
        <span className="font-bold tracking-wide">
          Hình học 3D • {data.model3D?.vertices.length || 0} Đỉnh • {data.model3D?.edges.length || 0} Cạnh
        </span>
        {data.model3D?.crossSection && (
          <span className="text-[11px] font-semibold bg-amber-500/15 text-amber-600 dark:text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-md ml-1">
            Thiết diện: {data.model3D.crossSection.polygonVertexIds.join('-')}
          </span>
        )}
      </div>

      {/* Top Right Quick Action Tools */}
      <div className="absolute top-3.5 right-3.5 z-10 flex items-center gap-1.5 flex-wrap justify-end pointer-events-auto">
        {/* Toggle White Paper Mode (Extremely useful for copy-pasting to exam papers/Word) */}
        <button
          onClick={() => setIsWhitePaperMode(!isWhitePaperMode)}
          title={isWhitePaperMode ? 'Chuyển sang nền tối (Dark mode)' : 'Chuyển sang nền giấy trắng (White paper - Để dán vào Word)'}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-semibold shadow-md backdrop-blur-md transition-all ${
            isWhitePaperMode
              ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border-amber-300'
              : 'bg-slate-900/90 hover:bg-slate-800 text-slate-200 border-slate-700'
          }`}
        >
          {isWhitePaperMode ? <Moon className="w-3.5 h-3.5 text-indigo-600" /> : <Sun className="w-3.5 h-3.5 text-amber-400" />}
          <span>{isWhitePaperMode ? 'Nền tối' : 'Giấy trắng (Dán Word)'}</span>
        </button>

        {/* Copy Image to Clipboard Button */}
        <button
          onClick={handleCopyToClipboard}
          title="Sao chép hình vẽ vào Clipboard để dán ngay (Ctrl+V) vào Microsoft Word hoặc PowerPoint"
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs font-bold shadow-md transition-all ${
            copiedSuccess
              ? 'bg-emerald-600 text-white border-emerald-500'
              : 'bg-sky-600 hover:bg-sky-500 text-white border-sky-400'
          }`}
        >
          {copiedSuccess ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copiedSuccess ? 'Đã sao chép ảnh!' : 'Chép vào Word'}</span>
        </button>

        {/* Download PNG */}
        <button
          onClick={handleDownloadPng}
          title="Tải ảnh PNG độ nét cao về máy tính"
          className={`p-1.5 rounded-xl border text-xs backdrop-blur-md transition-all ${
            isWhitePaperMode
              ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
              : 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 border-slate-700'
          }`}
        >
          <Camera className="w-3.5 h-3.5" />
        </button>

        {/* Download SVG */}
        {data.exportData?.svgCode && (
          <button
            onClick={handleDownloadSvg}
            title="Tải mã đồ họa vector SVG (chất lượng vô hạn khi phóng to)"
            className={`p-1.5 rounded-xl border text-xs backdrop-blur-md transition-all ${
              isWhitePaperMode
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                : 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 border-slate-700'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Floating Bottom View & Adjustment Toolbar */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 w-[96%] max-w-[860px] pointer-events-auto">
        <div className={`backdrop-blur-md rounded-2xl p-2.5 border shadow-2xl flex flex-wrap items-center justify-between gap-2.5 text-xs ${
          isWhitePaperMode
            ? 'bg-white/95 border-slate-300 text-slate-700'
            : 'bg-slate-900/95 border-slate-700/80 text-slate-200'
        }`}>
          {/* Camera View Angle Pills */}
          <div className="flex items-center gap-1">
            <span className="text-[11px] font-semibold text-slate-400 mr-1 hidden sm:inline">Góc nhìn:</span>
            <button
              onClick={() => handleCameraPreset('iso')}
              title="Góc nhìn phối cảnh chuẩn SGK"
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                cameraPreset === 'iso'
                  ? 'bg-sky-500 text-white shadow font-semibold'
                  : 'hover:bg-slate-800/40 text-slate-400 hover:text-slate-200'
              }`}
            >
              Phối cảnh SGK
            </button>
            <button
              onClick={() => handleCameraPreset('top')}
              title="Nhìn từ trên xuống (Mặt đáy)"
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                cameraPreset === 'top'
                  ? 'bg-sky-500 text-white shadow font-semibold'
                  : 'hover:bg-slate-800/40 text-slate-400 hover:text-slate-200'
              }`}
            >
              Mặt đáy
            </button>
            <button
              onClick={() => handleCameraPreset('front')}
              title="Nhìn chính diện"
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                cameraPreset === 'front'
                  ? 'bg-sky-500 text-white shadow font-semibold'
                  : 'hover:bg-slate-800/40 text-slate-400 hover:text-slate-200'
              }`}
            >
              Chính diện
            </button>
          </div>

          {/* Quick Adjustment Slider for Height Position */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-400 hidden md:inline">Vị trí:</span>
            <button
              onClick={() => setYOffset((y) => parseFloat(Math.max(-3.5, y - 0.3).toFixed(2)))}
              title="Hạ hình vẽ xuống thấp hơn"
              className="p-1 rounded bg-slate-800/20 hover:bg-slate-800/50 text-slate-400 hover:text-white"
            >
              <ArrowDown className="w-3.5 h-3.5" />
            </button>
            <input
              type="range"
              min={-3.0}
              max={0.5}
              step={0.1}
              value={yOffset}
              onChange={(e) => setYOffset(parseFloat(e.target.value))}
              className="w-20 accent-sky-500 cursor-pointer h-1.5 bg-slate-400/40 rounded-lg appearance-none"
              title="Kéo để nâng/hạ độ cao hình vẽ"
            />
            <button
              onClick={() => setYOffset((y) => parseFloat(Math.min(1.0, y + 0.3).toFixed(2)))}
              title="Nâng hình vẽ lên cao hơn"
              className="p-1 rounded bg-slate-800/20 hover:bg-slate-800/50 text-slate-400 hover:text-white"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Display Toggles */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setShowLabels(!showLabels)}
              title="Bật/Tắt nhãn chữ đỉnh (A, B, C, S...)"
              className={`px-2 py-1 rounded-lg text-[11px] font-medium border transition-colors ${
                showLabels
                  ? 'bg-sky-500/20 text-sky-400 border-sky-500/40'
                  : 'bg-transparent text-slate-400 border-transparent hover:bg-slate-800/30'
              }`}
            >
              Nhãn điểm
            </button>

            <button
              onClick={() => setShowFaces(!showFaces)}
              title="Bật/Tắt màu mặt diện"
              className={`px-2 py-1 rounded-lg text-[11px] font-medium border transition-colors ${
                showFaces
                  ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/40'
                  : 'bg-transparent text-slate-400 border-transparent hover:bg-slate-800/30'
              }`}
            >
              Mặt diện
            </button>

            <button
              onClick={() => setShowGrid(!showGrid)}
              title="Bật/Tắt lưới tọa độ đáy"
              className={`px-2 py-1 rounded-lg text-[11px] font-medium border transition-colors ${
                showGrid
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                  : 'bg-transparent text-slate-400 border-transparent hover:bg-slate-800/30'
              }`}
            >
              Lưới đáy
            </button>

            <button
              onClick={() => setAutoRotate(!autoRotate)}
              title="Bật/Tắt xoay tự động 360 độ"
              className={`p-1.5 rounded-lg border transition-colors ${
                autoRotate
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                  : 'bg-transparent text-slate-400 border-transparent hover:bg-slate-800/30'
              }`}
            >
              <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={() => {
                setYOffset(-1.3);
                handleCameraPreset('iso');
              }}
              title="Khôi phục lại góc nhìn mặc định"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/40 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Cross Section Slider (if present) */}
        {data.model3D?.crossSection && (
          <div className="mt-1.5 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-amber-500/30 flex items-center gap-3 text-xs text-amber-300">
            <Sliders className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="font-semibold shrink-0">
              {data.model3D.crossSection.sliderParam || 'Vị trí mặt cắt'}:
            </span>
            <input
              type="range"
              min={data.model3D.crossSection.minVal ?? 0.1}
              max={data.model3D.crossSection.maxVal ?? 0.9}
              step={0.05}
              value={crossSectionParam}
              onChange={(e) => setCrossSectionParam(parseFloat(e.target.value))}
              className="flex-1 accent-amber-500 cursor-pointer h-1.5 bg-slate-700 rounded-lg appearance-none"
            />
            <span className="font-mono text-slate-300 shrink-0">{crossSectionParam.toFixed(2)}</span>
          </div>
        )}
      </div>
    </div>
  );
};
