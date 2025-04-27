import { CollapseButton } from './CollapseButton';

interface CollapsiblePanelProps {
  children: React.ReactNode;
  onCollapse: () => void;
  isCollapsed: boolean;
  direction: 'left' | 'right';
}

export function CollapsiblePanel({ children, onCollapse, isCollapsed, direction }: CollapsiblePanelProps) {
  return (
    <div className="h-full relative">
      <div className="h-full">
        {children}
      </div>
      <div className={`absolute top-0 ${direction === 'left' ? '-right-3' : '-left-3'} h-full flex items-center z-50`}>
        <CollapseButton
          isCollapsed={isCollapsed}
          onToggle={onCollapse}
          direction={direction}
        />
      </div>
    </div>
  );
}
