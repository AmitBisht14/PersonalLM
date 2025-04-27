'use client';

import { useState, useRef } from 'react';
import { Panel, PanelGroup, PanelResizeHandle, ImperativePanelHandle } from 'react-resizable-panels';
import { Sources } from './bodyComponents/Sources';
import { Chat } from './bodyComponents/Chat';
import { Studio } from './bodyComponents/Studio';
import { CollapsiblePanel } from './bodyComponents/CollapsiblePanel';

export function Body() {
  const [isSourcesCollapsed, setIsSourcesCollapsed] = useState(false);
  const [isStudioCollapsed, setIsStudioCollapsed] = useState(false);
  const sourcesRef = useRef<ImperativePanelHandle>(null);
  const studioRef = useRef<ImperativePanelHandle>(null);

  const handleSourcesCollapse = () => {
    if (!isSourcesCollapsed) {
      sourcesRef.current?.resize(0);
    } else {
      sourcesRef.current?.resize(25);
    }
    setIsSourcesCollapsed(!isSourcesCollapsed);
  };

  const handleStudioCollapse = () => {
    if (!isStudioCollapsed) {
      studioRef.current?.resize(0);
    } else {
      studioRef.current?.resize(25);
    }
    setIsStudioCollapsed(!isStudioCollapsed);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden bg-gray-900 text-gray-100">
      <PanelGroup direction="horizontal" className="w-full">
        <Panel 
          ref={sourcesRef}
          defaultSize={25} 
          minSize={0} 
          maxSize={40}
        >
          <CollapsiblePanel
            onCollapse={handleSourcesCollapse}
            isCollapsed={isSourcesCollapsed}
            direction="right"
          >
            <Sources 
              onCollapse={handleSourcesCollapse} 
              isCollapsed={isSourcesCollapsed} 
            />
          </CollapsiblePanel>
        </Panel>

        <PanelResizeHandle className="w-1 hover:w-2 bg-gray-700 transition-all" />

        <Panel 
          defaultSize={50} 
          minSize={20}
        >
          <Chat />
        </Panel>

        <PanelResizeHandle className="w-1 hover:w-2 bg-gray-700 transition-all" />

        <Panel 
          ref={studioRef}
          defaultSize={25} 
          minSize={0} 
          maxSize={40}
        >
          <CollapsiblePanel
            onCollapse={handleStudioCollapse}
            isCollapsed={isStudioCollapsed}
            direction="left"
          >
            <Studio 
              onCollapse={handleStudioCollapse} 
              isCollapsed={isStudioCollapsed} 
            />
          </CollapsiblePanel>
        </Panel>
      </PanelGroup>
    </div>
  );
}
