'use client';

import { useState } from 'react';
import { ConfigurationSettings } from './components/ConfigurationSettings';
import { ConfigurationList } from './components/ConfigurationList';
import { ConfigurationActions } from './components/ConfigurationActions';
import { PanelLayout } from '@/components/layout/PanelLayout';

export function Configuration() {
  const [selectedItemId, setSelectedItemId] = useState<string>();
  const [isSettingsCollapsed, setIsSettingsCollapsed] = useState(false);
  const [isActionsCollapsed, setIsActionsCollapsed] = useState(false);

  const handleSettingChange = (setting: string, value: boolean) => {
    // Handle setting changes
    console.log('Setting changed:', setting, value);
  };

  const handleConfigAction = (action: 'add' | 'edit' | 'delete', id?: string) => {
    // Handle configuration actions
    console.log('Action:', action, 'ID:', id);
  };

  const handleSettingsCollapse = () => setIsSettingsCollapsed(!isSettingsCollapsed);
  const handleActionsCollapse = () => setIsActionsCollapsed(!isActionsCollapsed);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="h-[calc(100vh-4rem)] max-w-screen-2xl mx-auto py-8">
        <h1 className="text-2xl font-bold mb-8 px-4">Configuration</h1>
        <div className="h-[calc(100%-5rem)]">
          <PanelLayout
            leftPanel={{
              defaultSize: 25,
              minSize: 15,
              isCollapsed: isSettingsCollapsed,
              onCollapse: handleSettingsCollapse,
              collapseDirection: 'right',
              title: 'Global Settings',
              children: <ConfigurationSettings onSettingChange={handleSettingChange} />
            }}
            centerPanel={{
              defaultSize: 50,
              minSize: 30,
              title: 'Configurations',
              children: <ConfigurationList onSelectItem={setSelectedItemId} />
            }}
            rightPanel={{
              defaultSize: 25,
              minSize: 15,
              isCollapsed: isActionsCollapsed,
              onCollapse: handleActionsCollapse,
              collapseDirection: 'left',
              title: 'Actions',
              children: (
                <ConfigurationActions 
                  selectedItemId={selectedItemId}
                  onAction={handleConfigAction}
                />
              )
            }}
          />
        </div>
      </div>
    </div>
  );
}
