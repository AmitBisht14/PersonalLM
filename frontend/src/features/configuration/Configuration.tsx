'use client';

import { useState } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { ConfigurationSettings } from './components/ConfigurationSettings';
import { ConfigurationList } from './components/ConfigurationList';
import { ConfigurationActions } from './components/ConfigurationActions';
import { CollapsiblePanel } from '@/components/ui/panels/CollapsiblePanel';

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
          <PanelGroup direction="horizontal">
            <Panel defaultSize={25} minSize={15}>
              <CollapsiblePanel
                onCollapse={handleSettingsCollapse}
                isCollapsed={isSettingsCollapsed}
                direction="right"
              >
                <ConfigurationSettings onSettingChange={handleSettingChange} />
              </CollapsiblePanel>
            </Panel>

            <PanelResizeHandle className="w-1 hover:w-2 bg-gray-700 transition-all" />

            <Panel defaultSize={50} minSize={30}>
              <ConfigurationList onSelectItem={setSelectedItemId} />
            </Panel>

            <PanelResizeHandle className="w-1 hover:w-2 bg-gray-700 transition-all" />

            <Panel defaultSize={25} minSize={15}>
              <CollapsiblePanel
                onCollapse={handleActionsCollapse}
                isCollapsed={isActionsCollapsed}
                direction="left"
              >
                <ConfigurationActions 
                  selectedItemId={selectedItemId}
                  onAction={handleConfigAction}
                />
              </CollapsiblePanel>
            </Panel>
          </PanelGroup>
        </div>
      </div>
    </div>
  );
}
