import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PromoBannerProps {
  messages: string[];
  currentIndex: number;
  onNext: () => void;
  onPrev: () => void;
  shouldApplyScrolledStyle: boolean;
}

export const PromoBanner: React.FC<PromoBannerProps> = ({
  messages,
  currentIndex,
  onNext,
  onPrev,
  shouldApplyScrolledStyle,
}) => {
  return (
    <div
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        shouldApplyScrolledStyle
          ? 'bg-stone-50 border-b border-stone-200'
          : 'bg-white/5 backdrop-blur-md border-b border-white/10'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-9">
          <button
            onClick={onPrev}
            className={`p-1 rounded-full transition-all duration-200 ${
              shouldApplyScrolledStyle
                ? 'text-neutral-600 hover:text-red-900 hover:bg-stone-100'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <ChevronLeft className="h-3 w-3" />
          </button>
          <div className="flex-1 text-center">
            <span
              className={`text-xs tracking-wide transition-colors duration-300 ${
                shouldApplyScrolledStyle ? 'text-neutral-700' : 'text-white/90'
              }`}
            >
              {messages[currentIndex]}
            </span>
          </div>
          <button
            onClick={onNext}
            className={`p-1 rounded-full transition-all duration-200 ${
              shouldApplyScrolledStyle
                ? 'text-neutral-600 hover:text-red-900 hover:bg-stone-100'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <ChevronRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
