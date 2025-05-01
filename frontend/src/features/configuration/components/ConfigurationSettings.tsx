interface ConfigurationSettingsProps {
  onSettingChange?: (setting: string, value: boolean) => void;
}

export function ConfigurationSettings({ onSettingChange }: ConfigurationSettingsProps) {
  return (
    <div className="h-full bg-gray-800">
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">Global Settings</h2>
        <div className="space-y-4">
          {/* Settings controls will be added here */}
        </div>
      </div>
    </div>
  );
}
