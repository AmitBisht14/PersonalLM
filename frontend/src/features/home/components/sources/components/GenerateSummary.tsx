'use client';

import { Chapter } from '@/types/pdf';
import { FileText, BookOpen, ChevronRight } from 'lucide-react';

interface GenerateSummaryProps {
  selectedChapters: Chapter[];
  onTestClick: () => void;
}

export function GenerateSummary({ 
  selectedChapters, 
  onTestClick 
}: GenerateSummaryProps) {
  const isDisabled = selectedChapters.length === 0;
  
  // Calculate total pages selected
  const totalPages = selectedChapters.reduce((sum, chapter) => {
    return sum + (chapter.end_page - chapter.start_page + 1);
  }, 0);
  
  return (
    <div className="flex flex-col w-full">
      {/* Selected chapters summary */}
      {selectedChapters.length > 0 && (
        <div className="w-full mb-4 rounded-md border border-gray-700 overflow-hidden">
          <div className="bg-gray-800/70 p-2 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-blue-400 font-medium text-xs">
                <FileText size={14} />
                <span>Selected Content ({selectedChapters.length} item{selectedChapters.length !== 1 ? 's' : ''})</span>
              </div>
              <div className="text-green-400 font-medium text-xs">
                Total Pages: {totalPages}
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800/40 max-h-40 overflow-y-auto">
            {selectedChapters.map((chapter, index) => (
              <div 
                key={index} 
                className="flex justify-between py-1.5 px-2 text-xs border-b border-gray-700/50 last:border-0 hover:bg-gray-700/30"
              >
                <div className="flex items-center gap-1.5 truncate flex-1">
                  <BookOpen size={12} className="text-gray-400 flex-shrink-0" />
                  <span className="truncate text-gray-200">{chapter.title}</span>
                </div>
                <span className="text-gray-400 ml-2 flex-shrink-0">Pages {chapter.start_page}-{chapter.end_page}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Generate button */}
      <button 
        onClick={onTestClick}
        disabled={isDisabled}
        className={`
          w-full py-2.5 px-4 rounded-md font-medium text-sm flex items-center justify-center gap-1.5
          ${!isDisabled 
            ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-sm' 
            : 'bg-gray-700 text-gray-400 cursor-not-allowed'} 
          transition-colors
        `}
      >
        Generate Summary
        {!isDisabled && <ChevronRight size={16} className="ml-1" />}
      </button>
    </div>
  );
}
