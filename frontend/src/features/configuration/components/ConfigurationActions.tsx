interface ConfigurationActionsProps {
  selectedItemId?: string;
  onAction?: (action: 'add' | 'edit' | 'delete', id?: string) => void;
}

export function ConfigurationActions({ selectedItemId, onAction }: ConfigurationActionsProps) {
  return (
    <div className="h-full bg-gray-800">
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">Actions</h2>
        <div className="space-y-4">
          {/* Action buttons and forms will be added here */}
        </div>
      </div>
    </div>
  );
}
