import React, { useState, useEffect, useRef } from "react";
import { X, Minus, Square, Minimize2, ChevronRight } from "lucide-react";
import { WindowItem } from "../types";

interface RetroWindowProps {
  windowState: WindowItem;
  activeWindowId: string | null;
  onFocus: (id: string) => void;
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onMaximize: (id: string) => void;
  onDrag: (id: string, x: number, y: number) => void;
  onResize?: (id: string, width: number, height: number) => void;
  children: React.ReactNode;
  menuItems?: {
    label: string;
    items: { label: string; action: () => void }[];
  }[];
  statusBarContent?: string;
  icon?: React.ReactNode;
}

export default function RetroWindow({
  windowState,
  activeWindowId,
  onFocus,
  onClose,
  onMinimize,
  onMaximize,
  onDrag,
  onResize,
  children,
  menuItems,
  statusBarContent,
  icon,
}: RetroWindowProps) {
  const { id, title, x, y, width, height, isMaximized, isOpen, isMinimized, zIndex, minWidth = 280, minHeight = 220 } = windowState;
  
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [activeMenu, setActiveMenu] = useState<number | null>(null);

  const dragStartRef = useRef({ x: 0, y: 0, winX: 0, winY: 0 });
  const resizeStartRef = useRef({ x: 0, y: 0, winW: 0, winH: 0 });
  const menuRef = useRef<HTMLDivElement>(null);

  const isActive = activeWindowId === id;

  // Handle clicking outside active menu to close it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Window Drag logic
  const handleTitleBarMouseDown = (e: React.MouseEvent) => {
    if (isMaximized) return;
    onFocus(id);
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      winX: x,
      winY: y,
    };
    e.preventDefault();
  };

  // Window Resize logic
  const handleResizeMouseDown = (e: React.MouseEvent) => {
    if (isMaximized) return;
    onFocus(id);
    setIsResizing(true);
    resizeStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      winW: width,
      winH: height,
    };
    e.preventDefault();
    e.stopPropagation();
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const dx = e.clientX - dragStartRef.current.x;
        const dy = e.clientY - dragStartRef.current.y;
        
        // Prevent windows from being dragged entirely off screen
        const nextX = Math.max(-width + 50, Math.min(window.innerWidth - 30, dragStartRef.current.winX + dx));
        const nextY = Math.max(0, Math.min(window.innerHeight - 50, dragStartRef.current.winY + dy));
        
        onDrag(id, nextX, nextY);
      }

      if (isResizing && onResize) {
        const dx = e.clientX - resizeStartRef.current.x;
        const dy = e.clientY - resizeStartRef.current.y;
        
        const nextW = Math.max(minWidth, resizeStartRef.current.winW + dx);
        const nextH = Math.max(minHeight, resizeStartRef.current.winH + dy);
        
        onResize(id, nextW, nextH);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, isResizing, id, x, y, width, height, isMaximized, minWidth, minHeight, onDrag, onResize]);

  if (!isOpen || isMinimized) return null;

  const style: React.CSSProperties = isMaximized
    ? {
        position: "absolute",
        left: 0,
        top: 0,
        width: "100%",
        height: "calc(100% - 40px)", // Taskbar is 40px
        zIndex,
      }
    : {
        position: "absolute",
        left: x,
        top: y,
        width,
        height,
        zIndex,
      };

  return (
    <div
      id={`win-${id}`}
      style={style}
      onClick={() => onFocus(id)}
      className="retro-border-outset flex flex-col p-[3px] select-none text-black text-sm outline-none"
    >
      {/* Title Bar */}
      <div
        onMouseDown={handleTitleBarMouseDown}
        onDoubleClick={() => onMaximize(id)}
        className={`retro-titlebar flex items-center justify-between p-1 pl-2 cursor-default ${isActive ? "" : "inactive"}`}
      >
        <div className="flex items-center gap-1.5 font-bold select-none truncate pr-2">
          {icon && <div className="w-4 h-4 flex items-center justify-center shrink-0">{icon}</div>}
          <span className="truncate">{title}</span>
        </div>

        {/* Window Controls */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => onMinimize(id)}
            className="retro-button w-[18px] h-[16px] !p-0 flex items-center justify-center font-bold"
            title="Minimize"
          >
            <Minus size={10} strokeWidth={3} className="translate-y-[2px]" />
          </button>
          
          <button
            onClick={() => onMaximize(id)}
            className="retro-button w-[18px] h-[16px] !p-0 flex items-center justify-center font-bold"
            title={isMaximized ? "Restore" : "Maximize"}
          >
            {isMaximized ? (
              <Minimize2 size={10} strokeWidth={2.5} />
            ) : (
              <Square size={8} strokeWidth={3} />
            )}
          </button>

          <button
            onClick={() => onClose(id)}
            className="retro-button w-[18px] h-[16px] !p-0 flex items-center justify-center font-extrabold !bg-[#c0c0c0] hover:!bg-[#e6a8a8]"
            title="Close"
          >
            <X size={10} strokeWidth={3.5} />
          </button>
        </div>
      </div>

      {/* Menu Bar (If available) */}
      {menuItems && menuItems.length > 0 && (
        <div ref={menuRef} className="flex items-center gap-1 px-1 py-1.5 border-b border-[#808080] text-xs bg-[#c0c0c0] relative z-20">
          {menuItems.map((menu, idx) => (
            <div key={idx} className="relative">
              <button
                onClick={() => setActiveMenu(activeMenu === idx ? null : idx)}
                className={`px-2 py-0.5 hover:bg-[#000080] hover:text-white rounded cursor-default ${
                  activeMenu === idx ? "bg-[#000080] text-white" : "text-black"
                }`}
              >
                {menu.label}
              </button>
              {activeMenu === idx && (
                <div className="absolute left-0 top-full mt-1 bg-[#c0c0c0] retro-border-outset min-w-[120px] z-30 p-1 flex flex-col">
                  {menu.items.map((sub, sIdx) => (
                    <button
                      key={sIdx}
                      onClick={() => {
                        sub.action();
                        setActiveMenu(null);
                      }}
                      className="text-left w-full px-4 py-1 hover:bg-[#000080] hover:text-white font-sans text-xs flex items-center justify-between"
                    >
                      <span>{sub.label}</span>
                      <ChevronRight size={10} className="opacity-40" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Main Client Content */}
      <div className="flex-1 min-h-0 bg-[#c0c0c0] flex flex-col relative overflow-hidden">
        {children}
      </div>

      {/* Status Bar */}
      {statusBarContent && (
        <div className="retro-border-inset mt-[3px] py-1 px-2 text-xs bg-[#c0c0c0] font-sans flex items-center justify-between shrink-0 select-none text-gray-700">
          <span className="truncate">{statusBarContent}</span>
          <span className="text-[10px] font-mono tracking-wider">gemstoneOS SECURE</span>
        </div>
      )}

      {/* Resize Handle (Bottom Right Corner) */}
      {!isMaximized && onResize && (
        <div
          onMouseDown={handleResizeMouseDown}
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize flex items-end justify-end pointer-events-auto"
        >
          <svg width="10" height="10" viewBox="0 0 10 10" className="opacity-60 select-none">
            <line x1="8" y1="2" x2="2" y2="8" stroke="#808080" strokeWidth="1" />
            <line x1="8" y1="4" x2="4" y2="8" stroke="#808080" strokeWidth="1" />
            <line x1="8" y1="6" x2="6" y2="8" stroke="#808080" strokeWidth="1" />
            
            <line x1="9" y1="3" x2="3" y2="9" stroke="white" strokeWidth="1" />
            <line x1="9" y1="5" x2="5" y2="9" stroke="white" strokeWidth="1" />
            <line x1="9" y1="7" x2="7" y2="9" stroke="white" strokeWidth="1" />
          </svg>
        </div>
      )}
    </div>
  );
}
