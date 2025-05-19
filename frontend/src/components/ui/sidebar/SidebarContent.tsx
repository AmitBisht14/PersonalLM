'use client';

import React, { ReactNode } from 'react';

interface SidebarContentProps {
  children: ReactNode;
}

export function SidebarContent({ children }: SidebarContentProps) {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-4">
        {children}
      </div>
    </div>
  );
}

export function SidebarSection({ children, title }: { children: ReactNode; title?: string }) {
  return (
    <div className="mb-4">
      {title && <h3 className="text-sm font-medium text-gray-300 mb-2">{title}</h3>}
      <div>{children}</div>
    </div>
  );
}

export function SidebarFooter({ children }: { children: ReactNode }) {
  return (
    <div className="border-t border-gray-700 p-4 bg-gray-800 mt-auto flex-shrink-0">
      {children}
    </div>
  );
}
