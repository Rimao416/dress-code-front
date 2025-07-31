"use client"
import React, { useState, useEffect, useRef, useCallback, ReactNode } from 'react';

interface UseDragBottomSheetProps {
  isOpen: boolean;
  onSnapLevel?: (level: number) => void;
  snapLevels?: number[];
}

interface UseDragBottomSheetReturn {
  currentLevel: number;
  isDragging: boolean;
  containerRef: React.RefObject<HTMLDivElement | null>;
  setLevel: (level: number) => void;
  handlers: {
    onTouchStart: (e: React.TouchEvent) => void;
    onMouseDown: (e: React.MouseEvent) => void;
  };
}

interface BottomSheetProps {
  isOpen: boolean;
  onClose?: () => void;
  children: ReactNode;
  snapLevels?: number[];
  initialLevel?: number;
  className?: string;
  overlayClassName?: string;
  handleClassName?: string;
  showHandle?: boolean;
  closeOnOverlayClick?: boolean;
  maxHeight?: string;
}

// Hook personnalisé pour gérer le drag du bottom sheet
const useDragBottomSheet = ({
  isOpen,
  onSnapLevel,
  snapLevels = [0, 0.25, 0.5, 1]
}: UseDragBottomSheetProps): UseDragBottomSheetReturn => {
  const [currentLevel, setCurrentLevel] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [startY, setStartY] = useState<number>(0);
  const [startLevel, setStartLevel] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const getClosestSnapLevel = useCallback((level: number): number => {
    return snapLevels.reduce((prev, curr) =>
      Math.abs(curr - level) < Math.abs(prev - level) ? curr : prev
    );
  }, [snapLevels]);

  const handleTouchStart = useCallback((e: React.TouchEvent): void => {
    if (!isOpen) return;
    setIsDragging(true);
    setStartY(e.touches[0].clientY);
    setStartLevel(currentLevel);
  }, [isOpen, currentLevel]);

  const handleTouchMove = useCallback((e: TouchEvent): void => {
    if (!isDragging || !containerRef.current) return;
   
    const currentY = e.touches[0].clientY;
    const deltaY = startY - currentY;
    const containerHeight = window.innerHeight;
    const deltaLevel = deltaY / containerHeight;
   
    const newLevel = Math.max(0, Math.min(1, startLevel + deltaLevel));
    setCurrentLevel(newLevel);
  }, [isDragging, startY, startLevel]);

  const handleTouchEnd = useCallback((): void => {
    if (!isDragging) return;
    setIsDragging(false);
   
    const snappedLevel = getClosestSnapLevel(currentLevel);
    setCurrentLevel(snappedLevel);
   
    if (onSnapLevel) {
      onSnapLevel(snappedLevel);
    }
  }, [isDragging, currentLevel, getClosestSnapLevel, onSnapLevel]);

  const handleMouseStart = useCallback((e: React.MouseEvent): void => {
    if (!isOpen) return;
    setIsDragging(true);
    setStartY(e.clientY);
    setStartLevel(currentLevel);
    e.preventDefault();
  }, [isOpen, currentLevel]);

  const handleMouseMove = useCallback((e: MouseEvent): void => {
    if (!isDragging || !containerRef.current) return;
   
    const currentY = e.clientY;
    const deltaY = startY - currentY;
    const containerHeight = window.innerHeight;
    const deltaLevel = deltaY / containerHeight;
   
    const newLevel = Math.max(0, Math.min(1, startLevel + deltaLevel));
    setCurrentLevel(newLevel);
  }, [isDragging, startY, startLevel]);

  const handleMouseEnd = useCallback((): void => {
    if (!isDragging) return;
    setIsDragging(false);
   
    const snappedLevel = getClosestSnapLevel(currentLevel);
    setCurrentLevel(snappedLevel);
   
    if (onSnapLevel) {
      onSnapLevel(snappedLevel);
    }
  }, [isDragging, currentLevel, getClosestSnapLevel, onSnapLevel]);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseEnd);
     
      return () => {
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseEnd);
      };
    }
  }, [isDragging, handleTouchMove, handleTouchEnd, handleMouseMove, handleMouseEnd]);

  const setLevel = useCallback((level: number): void => {
    const snappedLevel = getClosestSnapLevel(level);
    setCurrentLevel(snappedLevel);
    if (onSnapLevel) {
      onSnapLevel(snappedLevel);
    }
  }, [getClosestSnapLevel, onSnapLevel]);

  return {
    currentLevel,
    isDragging,
    containerRef,
    setLevel,
    handlers: {
      onTouchStart: handleTouchStart,
      onMouseDown: handleMouseStart,
    }
  };
};

// Composant BottomSheet réutilisable
const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  children,
  snapLevels = [0, 0.25, 0.5, 1],
  initialLevel = 0.5,
  className = '',
  overlayClassName = '',
  handleClassName = '',
  showHandle = true,
  closeOnOverlayClick = true,
  maxHeight = '100vh'
}) => {
  const handleSnapLevel = useCallback((level: number): void => {
    if (level === 0 && onClose) {
      onClose();
    }
  }, [onClose]);

  const { currentLevel, isDragging, containerRef, setLevel, handlers } = useDragBottomSheet({
    isOpen,
    onSnapLevel: handleSnapLevel,
    snapLevels
  });

  // Synchroniser le niveau initial
  useEffect(() => {
    if (isOpen && currentLevel === 0) {
      setLevel(initialLevel);
    }
  }, [isOpen, initialLevel, setLevel, currentLevel]);

  // Calculer la position du bottom sheet
  const getTransform = (): string => {
    if (!isOpen && currentLevel === 0) {
      return 'translateY(100%)';
    }
    const percentage = (1 - currentLevel) * 100;
    return `translateY(${percentage}%)`;
  };

  // Calculer la hauteur basée sur le niveau
  const getHeight = (): string => {
    return `${currentLevel * 100}vh`;
  };

  if (!isOpen && currentLevel === 0) {
    return null;
  }

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 transition-opacity duration-300 z-40 ${
          isOpen && currentLevel > 0 ? 'opacity-100' : 'opacity-0 pointer-events-none'
        } ${overlayClassName}`}
        onClick={closeOnOverlayClick ? onClose : undefined}
      />
     
      {/* Bottom Sheet Container */}
      <div
        ref={containerRef}
        className={`fixed inset-x-0 bottom-0 z-50 transition-transform duration-300 ease-out ${
          isDragging ? 'duration-0' : ''
        } ${className}`}
        style={{
          transform: getTransform(),
          height: getHeight()
        }}
      >
        {/* Contenu du Bottom Sheet */}
        <div className="relative bg-white rounded-t-3xl shadow-2xl h-full flex flex-col overflow-hidden">
          {/* Handle pour glisser */}
          {showHandle && (
            <div
              className={`flex-shrink-0 flex justify-center py-3 bg-white rounded-t-3xl cursor-grab active:cursor-grabbing ${handleClassName}`}
              {...handlers}
            >
              <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
            </div>
          )}
         
          {/* Contenu avec scroll */}
          <div className="flex-1 overflow-y-auto overscroll-contain">
            <div className="min-h-full">
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BottomSheet;