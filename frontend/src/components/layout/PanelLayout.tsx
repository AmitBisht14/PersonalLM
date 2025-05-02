'use client';

import { ReactNode } from 'react';
import { Panel, PanelGroup, PanelResizeHandle, ImperativePanelHandle } from 'react-resizable-panels';
import { CollapsiblePanel } from '@/components/ui/panels/CollapsiblePanel';

export interface PanelConfig {
  ref?: React.RefObject<ImperativePanelHandle | null>;
  defaultSize: number;
  minSize: number;
  maxSize?: number;
  children: ReactNode;
  isCollapsed?: boolean;
  onCollapse?: () => void;
  collapseDirection?: 'left' | 'right';
  title?: string;
}

interface PanelLayoutProps {
  direction?: 'horizontal' | 'vertical';
  className?: string;
  leftPanel?: PanelConfig;
  centerPanel: PanelConfig;
  rightPanel?: PanelConfig;
}

export function PanelLayout({
  direction = 'horizontal',
  className = '',
  leftPanel,
  centerPanel,
  rightPanel
}: PanelLayoutProps) {
  return (
    <PanelGroup direction={direction} className={`w-full ${className}`}>
      {leftPanel && (
        <>
          <Panel
            ref={leftPanel.ref}
            defaultSize={leftPanel.defaultSize}
            minSize={leftPanel.minSize}
            maxSize={leftPanel.maxSize}
          >
            {leftPanel.onCollapse ? (
              <CollapsiblePanel
                onCollapse={leftPanel.onCollapse}
                isCollapsed={leftPanel.isCollapsed || false}
                direction={leftPanel.collapseDirection || 'right'}
              >
                <div className="flex flex-col h-full">
                  {leftPanel.title && (
                    <h2 className="text-xl font-semibold p-4">{leftPanel.title}</h2>
                  )}
                  {leftPanel.children}
                </div>
              </CollapsiblePanel>
            ) : (
              <div className="flex flex-col h-full">
                {leftPanel.title && (
                  <h2 className="text-xl font-semibold p-4">{leftPanel.title}</h2>
                )}
                {leftPanel.children}
              </div>
            )}
          </Panel>
          <PanelResizeHandle className="w-1 hover:w-2 bg-gray-700 transition-all" />
        </>
      )}

      <Panel
        ref={centerPanel.ref}
        defaultSize={centerPanel.defaultSize}
        minSize={centerPanel.minSize}
        maxSize={centerPanel.maxSize}
      >
        {centerPanel.onCollapse ? (
          <CollapsiblePanel
            onCollapse={centerPanel.onCollapse}
            isCollapsed={centerPanel.isCollapsed || false}
            direction={centerPanel.collapseDirection || 'left'}
          >
            <div className="flex flex-col h-full">
              {centerPanel.title && (
                <h2 className="text-xl font-semibold p-4">{centerPanel.title}</h2>
              )}
              {centerPanel.children}
            </div>
          </CollapsiblePanel>
        ) : (
          <div className="flex flex-col h-full">
            {centerPanel.title && (
              <h2 className="text-xl font-semibold p-4">{centerPanel.title}</h2>
            )}
            {centerPanel.children}
          </div>
        )}
      </Panel>

      {rightPanel && (
        <>
          <PanelResizeHandle className="w-1 hover:w-2 bg-gray-700 transition-all" />
          <Panel
            ref={rightPanel.ref}
            defaultSize={rightPanel.defaultSize}
            minSize={rightPanel.minSize}
            maxSize={rightPanel.maxSize}
          >
            {rightPanel.onCollapse ? (
              <CollapsiblePanel
                onCollapse={rightPanel.onCollapse}
                isCollapsed={rightPanel.isCollapsed || false}
                direction={rightPanel.collapseDirection || 'left'}
              >
                <div className="flex flex-col h-full">
                  {rightPanel.title && (
                    <h2 className="text-xl font-semibold p-4">{rightPanel.title}</h2>
                  )}
                  {rightPanel.children}
                </div>
              </CollapsiblePanel>
            ) : (
              <div className="flex flex-col h-full">
                {rightPanel.title && (
                  <h2 className="text-xl font-semibold p-4">{rightPanel.title}</h2>
                )}
                {rightPanel.children}
              </div>
            )}
          </Panel>
        </>
      )}
    </PanelGroup>
  );
}
