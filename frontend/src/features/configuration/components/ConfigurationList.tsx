interface ConfigurationListProps {
  onSelectItem?: (id: string) => void;
}

export function ConfigurationList({ onSelectItem }: ConfigurationListProps) {
  return (
    <div className="h-full bg-gray-800">
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">Configurations</h2>
        <div className="space-y-2">
          {/* Configuration list items will be added here */}
        </div>
      </div>
    </div>
  );
}
