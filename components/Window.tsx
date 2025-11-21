import React, { useRef, useState, useEffect, useCallback } from 'react';
import GlassCard from './GlassCard';
import { useOS } from '../contexts/OSContext';

interface WindowProps {
  id: string;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  minimized: boolean;
  maximized: boolean;
  zIndex: number;
  children: React.ReactNode;
  onFocus: () => void;
  onClose: () => void;
  onDragEnd: (x: number, y: number) => void;
  onResizeEnd: (x: number, y: number, width: number, height: number) => void;
}

const Window: React.FC<WindowProps> = ({
  id,
  title,
  x, y, width, height,
  minimized, maximized, zIndex,
  children,
  onFocus,
  onClose,
  onDragEnd,
  onResizeEnd,
}) => {
  const windowRef = useRef<HTMLDivElement>(null);
  const { minimizeWindow, maximizeWindow } = useOS();

  // --- Drag functionality ---
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleDragStart = useCallback((e: React.MouseEvent) => {
    if (maximized) return; // Cannot drag when maximized
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - (windowRef.current?.getBoundingClientRect().left || x),
      y: e.clientY - (windowRef.current?.getBoundingClientRect().top || y),
    });
    onFocus(); // Focus window on drag start
  }, [maximized, x, y, onFocus]);

  const handleDrag = useCallback((e: MouseEvent) => {
    if (!isDragging || !windowRef.current) return;
    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;

    // Prevent dragging off screen
    const boundedX = Math.max(0, Math.min(newX, window.innerWidth - windowRef.current.offsetWidth));
    const boundedY = Math.max(0, Math.min(newY, window.innerHeight - windowRef.current.offsetHeight - 50)); // -50 for dock space

    onDragEnd(boundedX, boundedY);
  }, [isDragging, dragOffset, onDragEnd]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // --- Resize functionality ---
  const [isResizing, setIsResizing] = useState(false);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });

  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    if (maximized) return; // Cannot resize when maximized
    e.stopPropagation(); // Prevent drag from firing
    setIsResizing(true);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: windowRef.current?.offsetWidth || width,
      height: windowRef.current?.offsetHeight || height,
    });
    onFocus(); // Focus window on resize start
  }, [maximized, width, height, onFocus]);

  const handleResize = useCallback((e: MouseEvent) => {
    if (!isResizing || !windowRef.current) return;

    const newWidth = Math.max(300, resizeStart.width + (e.clientX - resizeStart.x));
    const newHeight = Math.max(200, resizeStart.height + (e.clientY - resizeStart.y));

    // Prevent resizing beyond screen bounds
    const boundedWidth = Math.min(newWidth, window.innerWidth - x);
    const boundedHeight = Math.min(newHeight, window.innerHeight - y - 50); // -50 for dock

    onResizeEnd(x, y, boundedWidth, boundedHeight);
  }, [isResizing, resizeStart, x, y, onResizeEnd]);

  const handleResizeEnd = useCallback(() => {
    setIsResizing(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleDrag);
      document.addEventListener('mouseup', handleDragEnd);
    } else {
      document.removeEventListener('mousemove', handleDrag);
      document.removeEventListener('mouseup', handleDragEnd);
    }
    if (isResizing) {
      document.addEventListener('mousemove', handleResize);
      document.addEventListener('mouseup', handleResizeEnd);
    } else {
      document.removeEventListener('mousemove', handleResize);
      document.removeEventListener('mouseup', handleResizeEnd);
    };

    return () => {
      document.removeEventListener('mousemove', handleDrag);
      document.removeEventListener('mouseup', handleDragEnd);
      document.removeEventListener('mousemove', handleResize);
      document.removeEventListener('mouseup', handleResizeEnd);
    };
  }, [isDragging, isResizing, handleDrag, handleDragEnd, handleResize, handleResizeEnd]);


  if (minimized) {
    return null; // Don't render if minimized
  }

  const windowStyle: React.CSSProperties = maximized
    ? {
        top: 0, left: 0, width: '100vw', height: '100vh',
        zIndex: zIndex,
      }
    : {
        top: y, left: x, width: width, height: height,
        zIndex: zIndex,
      };

  return (
    <GlassCard
      ref={windowRef}
      className={`
        absolute flex flex-col pointer-events-auto
        ${maximized ? 'rounded-none' : 'rounded-2xl'}
        ${isDragging || isResizing ? 'cursor-grabbing' : 'cursor-default'}
        ${maximized ? '' : 'min-w-[300px] min-h-[200px]'}
      `}
      style={windowStyle}
      onMouseDown={onFocus} // Focus on any click within the window
    >
      {/* Title Bar */}
      <div
        className={`
          flex items-center justify-between p-3 rounded-t-2xl flex-shrink-0
          bg-white/10 backdrop-blur-sm border-b border-white/20
          ${maximized ? 'cursor-default' : 'cursor-grab'}
        `}
        onMouseDown={handleDragStart}
      >
        <span className="text-lg font-semibold text-white truncate flex-grow mr-4">{title}</span>
        <div className="flex space-x-2">
          <button
            onClick={() => minimizeWindow(id)}
            className="w-5 h-5 rounded-full bg-yellow-500 hover:bg-yellow-600 flex items-center justify-center text-xs text-black"
            aria-label="Minimize"
          >
            &#x2014; {/* Minus symbol */}
          </button>
          <button
            onClick={() => maximizeWindow(id)}
            className="w-5 h-5 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center text-xs text-black"
            aria-label="Maximize"
          >
            &#x25A1; {/* Square symbol */}
          </button>
          <button
            onClick={onClose}
            className="w-5 h-5 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-xs text-black"
            aria-label="Close"
          >
            &#x2715; {/* X symbol */}
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-grow overflow-hidden custom-scrollbar">
        {children}
      </div>

      {/* Resize Handle (bottom-right corner) */}
      {!maximized && (
        <div
          className="absolute -bottom-2 -right-2 w-5 h-5 bg-white/20 rounded-full cursor-se-resize opacity-0 hover:opacity-100 transition-opacity duration-200"
          onMouseDown={handleResizeStart}
          aria-label="Resize window"
        ></div>
      )}
    </GlassCard>
  );
};

export default Window;