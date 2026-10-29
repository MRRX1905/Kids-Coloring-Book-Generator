import React, { useRef, useState, useEffect } from "react";
import { Eraser, RotateCcw, Palette, Download, Sparkles } from "lucide-react";

interface InteractiveColoringCanvasProps {
  lineArtUrl: string;
  pageTitle: string;
  suggestedPalette?: string[];
  childName: string;
}

const CRAYON_COLORS = [
  { name: "Crayon Red", hex: "#EF4444" },
  { name: "Sunny Orange", hex: "#F97316" },
  { name: "Star Yellow", hex: "#FACC15" },
  { name: "Lime Zing", hex: "#84CC16" },
  { name: "Forest Green", hex: "#10B981" },
  { name: "Sky Blue", hex: "#38BDF8" },
  { name: "Ocean Navy", hex: "#3B82F6" },
  { name: "Cosmic Purple", hex: "#8B5CF6" },
  { name: "Bubblegum Pink", hex: "#EC4899" },
  { name: "Teddy Brown", hex: "#A16207" },
  { name: "Midnight Grey", hex: "#4B5563" },
  { name: "Bright White", hex: "#FFFFFF" },
];

export const InteractiveColoringCanvas: React.FC<InteractiveColoringCanvasProps> = ({
  lineArtUrl,
  pageTitle,
  suggestedPalette = [],
  childName,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>("#FACC15");
  const [brushSize, setBrushSize] = useState<number>(24);
  const [isEraser, setIsEraser] = useState<boolean>(false);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [history, setHistory] = useState<ImageData[]>([]);
  const baseImageRef = useRef<HTMLImageElement | null>(null);

  // Initialize and load image onto canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      baseImageRef.current = img;
      canvas.width = 800;
      canvas.height = 1000;

      // Draw white background
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw base line art
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const initialSnapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
      setHistory([initialSnapshot]);
    };
    img.src = lineArtUrl;
  }, [lineArtUrl]);

  // Redraw line art on top so colors never cover the thick black outlines!
  const redrawLineArtOnTop = () => {
    const canvas = canvasRef.current;
    if (!canvas || !baseImageRef.current) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Use multiply blending mode so black lines remain 100% visible on top of crayon strokes
    ctx.save();
    ctx.globalCompositeOperation = "multiply";
    ctx.drawImage(baseImageRef.current, 0, 0, canvas.width, canvas.height);
    ctx.restore();
  };

  const getCanvasCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if ("touches" in e) {
      const touch = e.touches[0];
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY,
      };
    } else {
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setIsDrawing(true);
    const { x, y } = getCanvasCoordinates(e);

    ctx.beginPath();
    ctx.moveTo(x, y);

    if (isEraser) {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = "#FFFFFF";
      ctx.fillStyle = "#FFFFFF";
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = selectedColor;
      ctx.fillStyle = selectedColor;
    }

    ctx.lineWidth = brushSize;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // Draw single dot if click without drag
    ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { x, y } = getCanvasCoordinates(e);

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    // Keep black outlines sharp and on top
    redrawLineArtOnTop();

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const current = ctx.getImageData(0, 0, canvas.width, canvas.height);
      setHistory((prev) => [...prev.slice(-10), current]);
    }
  };

  const clearColoring = () => {
    const canvas = canvasRef.current;
    if (!canvas || !baseImageRef.current) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(baseImageRef.current, 0, 0, canvas.width, canvas.height);
    setHistory([ctx.getImageData(0, 0, canvas.width, canvas.height)]);
  };

  const downloadColoredArtwork = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `${childName}_${pageTitle.replace(/\s+/g, "_")}_colored.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto">
      {/* Palette & Brush Controls */}
      <div className="w-full bg-amber-50/80 border-2 border-amber-200/90 rounded-2xl p-4 mb-4 shadow-sm backdrop-blur-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-amber-600" />
            <span className="font-bold text-sm text-amber-950 uppercase tracking-wide">
              Virtual Crayon Box
            </span>
            <span className="text-xs bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full font-medium">
              Black outlines stay on top!
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEraser(false)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                !isEraser
                  ? "bg-amber-600 text-white shadow-xs"
                  : "bg-white text-stone-700 hover:bg-amber-100"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" /> Crayon
            </button>
            <button
              onClick={() => setIsEraser(true)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                isEraser
                  ? "bg-rose-500 text-white shadow-xs"
                  : "bg-white text-stone-700 hover:bg-rose-50"
              }`}
            >
              <Eraser className="w-3.5 h-3.5" /> Eraser
            </button>
            <button
              onClick={clearColoring}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white text-stone-700 hover:bg-stone-100 transition-all flex items-center gap-1.5 border border-stone-200"
              title="Reset to pure black and white line art"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
            <button
              onClick={downloadColoredArtwork}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-all flex items-center gap-1.5 shadow-xs"
              title="Save colored picture"
            >
              <Download className="w-3.5 h-3.5" /> Save PNG
            </button>
          </div>
        </div>

        {/* Crayon Color Swatches */}
        <div className="flex flex-wrap items-center gap-2">
          {CRAYON_COLORS.map((c) => {
            const isSelected = !isEraser && selectedColor === c.hex;
            return (
              <button
                key={c.hex}
                onClick={() => {
                  setSelectedColor(c.hex);
                  setIsEraser(false);
                }}
                className={`relative w-8 h-8 rounded-full border-2 transition-transform transform hover:scale-110 active:scale-95 ${
                  isSelected
                    ? "ring-3 ring-amber-500 ring-offset-2 scale-110 border-white shadow-md"
                    : "border-stone-300 shadow-xs"
                }`}
                style={{ backgroundColor: c.hex }}
                title={c.name}
              />
            );
          })}

          {/* Brush thickness slider */}
          <div className="ml-auto flex items-center gap-2 bg-white px-3 py-1 rounded-xl border border-amber-200">
            <span className="text-xs text-stone-600 font-semibold">Tip:</span>
            <input
              type="range"
              min="8"
              max="48"
              value={brushSize}
              onChange={(e) => setBrushSize(parseInt(e.target.value, 10))}
              className="w-20 accent-amber-600 cursor-pointer"
            />
            <div
              className="rounded-full bg-stone-700"
              style={{ width: Math.max(6, brushSize / 2), height: Math.max(6, brushSize / 2) }}
            />
          </div>
        </div>
      </div>

      {/* Main Canvas with Paper Texture Effect */}
      <div className="relative w-full max-w-[640px] aspect-[4/5] bg-white rounded-2xl shadow-xl border-4 border-stone-800 overflow-hidden select-none touch-none">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-full object-contain cursor-crosshair"
        />
      </div>
    </div>
  );
};
