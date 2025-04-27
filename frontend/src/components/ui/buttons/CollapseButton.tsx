import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CollapseButtonProps {
  isCollapsed: boolean;
  onToggle: () => void;
  direction: 'left' | 'right';
}

export function CollapseButton({ isCollapsed, onToggle, direction }: CollapseButtonProps) {
  return (
    <button
      onClick={onToggle}
      className="absolute top-1/2 -translate-y-1/2 bg-gray-800 hover:bg-gray-700 text-gray-300 p-1 rounded-full z-10"
      style={{
        [direction]: '-12px',
      }}
    >
      {direction === 'left' ? (
        isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />
      ) : (
        isCollapsed ? <ChevronLeft size={16} /> : <ChevronRight size={16} />
      )}
    </button>
  );
}
