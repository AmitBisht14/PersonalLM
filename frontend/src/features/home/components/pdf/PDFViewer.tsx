'use client';

import { useState } from 'react';
import { Chapter } from '@/types/pdf';
import { PDFSidebar } from './PDFSidebar';

interface PDFViewerProps {
  pdfFile: File;
  pdfStructure: {
    filename: string;
    total_pages: number;
    chapters: Chapter[];
  };
  selectedChapter: Chapter;
  isCollapsed?: boolean;
  onCollapse?: () => void;
}

export function PDFViewer({ 
  pdfFile, 
  pdfStructure, 
  selectedChapter,
  isCollapsed = false,
  onCollapse = () => {}
}: PDFViewerProps) {
  const [showSidebar, setShowSidebar] = useState(true);

  const handleSidebarToggle = () => {
    if (onCollapse) {
      onCollapse();
    } else {
      setShowSidebar(!showSidebar);
    }
  };

  return (
    <div className="h-full flex">
      <PDFSidebar
        pdfFile={pdfFile}
        pdfStructure={pdfStructure}
        selectedChapter={selectedChapter}
        isCollapsed={isCollapsed || !showSidebar}
        onCollapse={handleSidebarToggle}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-4 flex-shrink-0 bg-gray-900 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">{selectedChapter.title}</h2>
          <div className="text-xs text-gray-400 mt-1">
            Pages {selectedChapter.start_page} - {selectedChapter.end_page}
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 p-6 bg-gray-800">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-invert prose-lg">
              <div className="whitespace-pre-wrap">
                {/* Content will be loaded in the sidebar, this is just the reading view */}
                <div className="text-gray-300 text-center py-8">
                  <p>Select a page from the sidebar to view its content here.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
