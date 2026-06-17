import React, { useRef, useState, useEffect } from "react";
import { Paintbrush, Eraser, Trash, Download, Sparkles, Square, Circle, Minus } from "lucide-react";

export default function GemPaint() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [tool, setTool] = useState<"brush" | "pencil" | "eraser" | "line" | "rect" | "circle">("brush");
  const [color, setColor] = useState("#ff0000"); // Red default
  const [brushSize, setBrushSize] = useState<number>(4);
  const [isDrawing, setIsDrawing] = useState(false);
  const [snapshot, setSnapshot] = useState<ImageData | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const colors = [
    "#000000", "#7f7f7f", "#880015", "#ed1c24", "#ff7f27", "#fff200", "#22b14c", "#00a2e8", "#3f48cc", "#a349a4",
    "#ffffff", "#c3c3c3", "#b5e61d", "#ffaec9", "#ffc90e", "#efe4b0", "#b5e61d", "#7092be", "#c8bfe7", "#dfdfdf"
  ];

  // Initialize canvas size
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set dimensions to match a standard visual frame
    canvas.width = 600;
    canvas.height = 400;

    // Fill white background initially
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    // Account for styling scale
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const coords = getCoordinates(e);
    setIsDrawing(true);
    setMousePos(coords);

    // Take snapshot for shapes
    setSnapshot(ctx.getImageData(0, 0, canvas.width, canvas.height));

    if (tool === "brush" || tool === "pencil" || tool === "eraser") {
      ctx.beginPath();
      ctx.moveTo(coords.x, coords.y);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = tool === "eraser" ? "#ffffff" : color;
      ctx.lineWidth = tool === "pencil" ? 1.5 : brushSize;
      
      // Draw single point on click
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const coords = getCoordinates(e);

    if (tool === "brush" || tool === "pencil" || tool === "eraser") {
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();
    } else if (snapshot) {
      // For shapes, restore snapshot to avoid infinite drawing drag lines
      ctx.putImageData(snapshot, 0, 0);
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.fillStyle = "transparent";
      ctx.lineWidth = brushSize;

      if (tool === "line") {
        ctx.moveTo(mousePos.x, mousePos.y);
        ctx.lineTo(coords.x, coords.y);
        ctx.stroke();
      } else if (tool === "rect") {
        ctx.strokeRect(mousePos.x, mousePos.y, coords.x - mousePos.x, coords.y - mousePos.y);
      } else if (tool === "circle") {
        const radius = Math.sqrt(Math.pow(coords.x - mousePos.x, 2) + Math.pow(coords.y - mousePos.y, 2));
        ctx.arc(mousePos.x, mousePos.y, radius, 0, 2 * Math.PI);
        ctx.stroke();
      }
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    setSnapshot(null);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "gemstone_masterpiece.png";
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden text-black bg-[#c0c0c0]" id="app-paint">
      {/* Drawing Space Container with Retro MS Paint layout */}
      <div className="flex-1 flex flex-row min-h-0 relative select-none">
        
        {/* Tool Palette Left Panel */}
        <div className="w-14 shrink-0 bg-[#c0c0c0] border-r border-[#808080] py-2 flex flex-col items-center gap-1.5 px-1.5 shadow-sm">
          <button
            onClick={() => setTool("brush")}
            className={`w-9 h-9 flex items-center justify-center retro-border-outset hover:bg-[#dfdfdf] ${
              tool === "brush" ? "bg-[#e2e2e2] border-t-[#808080] border-l-[#808080] border-r-white border-b-white" : ""
            }`}
            title="Brush Tool"
          >
            <Paintbrush size={16} />
          </button>
          
          <button
            onClick={() => setTool("pencil")}
            className={`w-9 h-9 flex items-center justify-center retro-border-outset hover:bg-[#dfdfdf] ${
              tool === "pencil" ? "bg-[#e2e2e2] border-t-[#808080] border-l-[#808080] border-r-white border-b-white" : ""
            }`}
            title="Nostalgic Pencil"
          >
            <Sparkles size={16} className="text-amber-800" />
          </button>

          <button
            onClick={() => setTool("eraser")}
            className={`w-9 h-9 flex items-center justify-center retro-border-outset hover:bg-[#dfdfdf] ${
              tool === "eraser" ? "bg-[#e2e2e2] border-t-[#808080] border-l-[#808080] border-r-white border-b-white" : ""
            }`}
            title="Rubber Eraser"
          >
            <Eraser size={16} />
          </button>

          <button
            onClick={() => setTool("line")}
            className={`w-9 h-9 flex items-center justify-center retro-border-outset hover:bg-[#dfdfdf] ${
              tool === "line" ? "bg-[#e2e2e2] border-t-[#808080] border-l-[#808080] border-r-white border-b-white" : ""
            }`}
            title="Straight Line"
          >
            <Minus size={16} />
          </button>

          <button
            onClick={() => setTool("rect")}
            className={`w-9 h-9 flex items-center justify-center retro-border-outset hover:bg-[#dfdfdf] ${
              tool === "rect" ? "bg-[#e2e2e2] border-t-[#808080] border-l-[#808080] border-r-white border-b-white" : ""
            }`}
            title="Rectangle Tool"
          >
            <Square size={16} />
          </button>

          <button
            onClick={() => setTool("circle")}
            className={`w-9 h-9 flex items-center justify-center retro-border-outset hover:bg-[#dfdfdf] ${
              tool === "circle" ? "bg-[#e2e2e2] border-t-[#808080] border-l-[#808080] border-r-white border-b-white" : ""
            }`}
            title="Circle Tool"
          >
            <Circle size={16} />
          </button>

          <div className="h-[1px] bg-[#808080] w-full my-1.5" />

          {/* Core Controls */}
          <button
            onClick={clearCanvas}
            className="w-9 h-9 flex items-center justify-center retro-border-outset hover:!bg-[#f1cdcd]"
            title="Clear Masterpiece"
          >
            <Trash size={15} className="text-red-700" />
          </button>

          <button
            onClick={downloadImage}
            className="w-9 h-9 flex items-center justify-center retro-border-outset hover:!bg-[#cdf1d4]"
            title="Save PNG Artwork"
          >
            <Download size={15} className="text-green-800" />
          </button>
        </div>

        {/* Canvas Area */}
        <div ref={containerRef} className="flex-1 bg-[#808080] p-3 overflow-auto flex items-center justify-center relative">
          <div className="retro-border-inset bg-white p-[1px] shadow-lg">
            <canvas
              ref={canvasRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              style={{ width: "600px", height: "400px" }}
              className="block cursor-crosshair bg-white"
            />
          </div>
        </div>
      </div>

      {/* Palette bottom panel & brush sizes */}
      <div className="bg-[#c0c0c0] border-t border-[#808080] p-2 flex flex-col md:flex-row items-center justify-between gap-3 shrink-0">
        
        {/* Colors selector */}
        <div className="flex items-center gap-2">
          <div className="retro-border-inset w-10 h-10 p-[2px] flex items-center justify-center shrink-0" title="Active Mineral Tint">
            <div className="w-full h-full border border-gray-400" style={{ backgroundColor: color }} />
          </div>

          <div className="grid grid-cols-10 gap-1 bg-[#e0e0e0] border-top border-l border-[#808080] p-1 shadow-inner rounded-sm">
            {colors.map((c, i) => (
              <button
                key={i}
                onClick={() => setColor(c)}
                className={`w-5 h-5 rounded-sm border hover:scale-105 active:scale-95 transition-transform duration-75`}
                style={{ backgroundColor: c, borderColor: color === c ? "#000" : "#dfdfdf" }}
                title={`Select shade ${c}`}
              />
            ))}
          </div>
        </div>

        {/* Brush Size Adjustment */}
        <div className="flex items-center gap-2.5">
          <span className="text-[11px] font-sans font-bold">Brush Size:</span>
          <div className="flex items-center gap-1.5">
            {[2, 4, 8, 12, 18].map((size) => (
              <button
                key={size}
                onClick={() => setBrushSize(size)}
                className={`w-7 h-7 flex items-center justify-center retro-border-outset hover:bg-[#dfdfdf] ${
                  brushSize === size ? "bg-[#e2e2e2] border-t-[#808080] border-l-[#808080] border-r-white border-b-white" : ""
                }`}
              >
                <div
                  className="rounded-full bg-black shrink-0"
                  style={{ width: `${size / 1.5 + 2}px`, height: `${size / 1.5 + 2}px` }}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Technical display */}
        <div className="text-[10px] font-mono pr-2 text-gray-500 uppercase flex items-center gap-1.5">
          <span>GemPaint Canvas 3.0</span>
          <span>●</span>
          <span>RGB Core</span>
        </div>
      </div>
    </div>
  );
}
