import { useState, useEffect, ReactNode } from 'react';
import { Chapter } from '../../types/pdf';

interface StudioProps {
  onCollapse: () => void;
  isCollapsed: boolean;
  selectedFile?: File;
  selectedChapter?: Chapter;
  children?: ReactNode;
}

export function Studio({ 
  onCollapse, 
  isCollapsed, 
  selectedFile, 
  selectedChapter,
  children 
}: StudioProps) {
  return (
    <section className="h-full p-4 overflow-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white">Studio</h2>
        <button
          onClick={onCollapse}
          className="text-white hover:text-gray-300"
        >
          {isCollapsed ? 'Expand' : 'Collapse'}
        </button>
      </div>

      {children}
    </section>
  );
}
