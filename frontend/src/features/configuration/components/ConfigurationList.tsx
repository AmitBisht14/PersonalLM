interface ConfigurationListProps {
  onSelectItem?: (id: string) => void;
}

export function ConfigurationList({ onSelectItem }: ConfigurationListProps) {
  return (
    <div className="space-y-2 p-4">
      {/* Configuration list items will be added here */}
    </div>
  );
}
