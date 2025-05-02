interface ConfigurationActionsProps {
  selectedItemId?: string;
  onAction?: (action: 'add' | 'edit' | 'delete', id?: string) => void;
}

export function ConfigurationActions({ selectedItemId, onAction }: ConfigurationActionsProps) {
  return (
    <div className="space-y-4 p-4">
      {/* Action buttons and forms will be added here */}
    </div>
  );
}
