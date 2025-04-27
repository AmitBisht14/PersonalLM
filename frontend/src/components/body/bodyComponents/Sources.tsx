import { CollapseButton } from './CollapseButton';

interface SourcesProps {
  onCollapse: () => void;
  isCollapsed: boolean;
}

export function Sources({ onCollapse, isCollapsed }: SourcesProps) {
  return (
    <section className="h-full p-4">
      <h2 className="text-xl font-semibold mb-4 text-white">Sources</h2>
      {/* Add sources content here */}
    </section>
  );
}
