'use client';

import { Chapter } from '@/types/pdf';
import { FileText } from 'lucide-react';

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
    <div className="flex flex-col p-3 border-t border-gray-700 flex-shrink-0 bg-gray-800">
      {/* Selected chapters summary */}
      {selectedChapters.length > 0 && (
        <div className="w-full mb-3 p-2 bg-gray-700 rounded-md text-xs text-gray-300">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1 text-blue-300 font-semibold">
              <FileText size={14} />
              <span>Selected Content ({selectedChapters.length} item{selectedChapters.length !== 1 ? 's' : ''})</span>
            </div>
            <div className="text-green-300 font-semibold">
              Total Pages: {totalPages}
            </div>
          </div>
          <div className="mt-2">
            {selectedChapters.map((chapter, index) => (
              <div key={index} className="flex justify-between py-1 border-b border-gray-600 last:border-0">
                <span className="truncate flex-1">{chapter.title}</span>
                <span className="text-gray-400 ml-2">Pages {chapter.start_page}-{chapter.end_page}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Generate button */}
      <div className="flex justify-center items-center">
        <button 
          onClick={onTestClick}
          disabled={isDisabled}
          className={`px-4 py-2 ${!isDisabled ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-600 cursor-not-allowed'} text-white rounded-md transition-colors shadow-sm`}
        >
          Generate Summary
        </button>
      </div>
    </div>
  );
}
