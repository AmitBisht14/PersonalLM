import { CollapseButton } from './CollapseButton';

interface StudioProps {
  onCollapse: () => void;
  isCollapsed: boolean;
}

export function Studio({ onCollapse, isCollapsed }: StudioProps) {
  return (
    <section className="h-full p-4">
      <h2 className="text-xl font-semibold mb-4 text-white">Studio</h2>
      {/* Add studio content here */}
    </section>
  );
}
