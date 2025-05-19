'use client';

import React, { ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SidebarProps {
  children: ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  title: string;
}

export function Sidebar({ children, isOpen, onToggle, title }: SidebarProps) {
  return (
    <div 
      className={`
        flex flex-col border-r border-gray-700 bg-gray-800 transition-all duration-300 ease-in-out
        ${isOpen ? 'w-80' : 'w-12'}
        h-full
      `}
    >
      {isOpen ? (
        <>
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <h2 className="font-semibold text-lg text-white">{title}</h2>
            <button
              onClick={onToggle}
              className="p-1 rounded-md hover:bg-gray-700 hover:text-white transition-colors"
              aria-label="Close sidebar"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </>
      ) : (
        <div className="flex flex-col h-full">
          <div className="flex justify-center p-3 border-b border-gray-700">
            <button
              onClick={onToggle}
              className="p-1 rounded-md hover:bg-gray-700 text-blue-400 hover:text-blue-300 transition-colors"
              aria-label="Open sidebar"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="text-gray-500 text-xs uppercase tracking-wider font-medium" style={{ writingMode: 'vertical-lr', transform: 'rotate(180deg)' }}>
              {title}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
