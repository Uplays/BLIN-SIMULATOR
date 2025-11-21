import React, { useRef, useState, useEffect, useCallback } from 'react';
import GlassCard from './GlassCard';
import { useOS } from '../contexts/OSContext'; // Import useOS

interface WidgetProps {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  children: React.ReactNode;
  onDragEnd: (x: number, y: number) => void;
  className?: string; // Optional custom class for the GlassCard
}

const Widget: React.FC<WidgetProps> = ({
  id,
  x, y, width, height, zIndex,
  children,
  onDragEnd,
  className,
}) => {
  const widgetRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const { focusWidget } = useOS(); // Use focusWidget from context

  const handleDragStart = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - (widgetRef.current?.getBoundingClientRect().left || x),
      y: e.clientY - (widgetRef.current?.getBoundingClientRect().top || y),
    });
    focusWidget(id); // Focus the widget when dragging starts
  }, [x, y, focusWidget, id]);

  const handleDrag = useCallback((e: MouseEvent) => {
    if (!isDragging || !widgetRef.current) return;
    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;

    // Boundary checks for widgets
    const boundedX = Math.max(0, Math.min(newX, window.innerWidth - widgetRef.current.offsetWidth));
    const boundedY = Math.max(0, Math.min(newY, window.innerHeight - widgetRef.current.offsetHeight - 80)); // -80 for dock space

    onDragEnd(boundedX, boundedY);
  }, [isDragging, dragOffset, onDragEnd]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleDrag);
      document.addEventListener('mouseup', handleDragEnd);
    } else {
      document.removeEventListener('mousemove', handleDrag);
      document.removeEventListener('mouseup', handleDragEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleDrag);
      document.removeEventListener('mouseup', handleDragEnd);
    };
  }, [isDragging, handleDrag, handleDragEnd]);

  const widgetStyle: React.CSSProperties = {
    top: y,
    left: x,
    width: width,
    height: height,
    zIndex: zIndex,
    cursor: isDragging ? 'grabbing' : 'grab',
  };

  return (
    <GlassCard
      ref={widgetRef}
      className={`
        absolute flex flex-col pointer-events-auto
        ${isDragging ? 'opacity-90' : ''}
        ${className}
      `}
      style={widgetStyle}
      onMouseDown={handleDragStart}
    >
      {children}
    </GlassCard>
  );
};

export default Widget;