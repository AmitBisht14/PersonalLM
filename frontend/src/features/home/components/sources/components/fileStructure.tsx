'use client';

import { useState, ChangeEvent } from 'react';
import { ChevronDown, ChevronRight, FileText } from 'lucide-react';
import { Chapter } from '../../../../../types/pdf';

interface FileStructureProps {
  structure: {
    filename: string;
    total_pages: number;
    chapters: Chapter[];
  };
  onChapterSelect: (chapters: Chapter[]) => void; // Expects an array, even for single selection
  onMultiSelectChange?: (chapters: Chapter[]) => void; // For checkbox multi-selection
}

export function FileStructure({ structure, onChapterSelect, onMultiSelectChange }: FileStructureProps) {
  const pdfTitle = structure.filename && structure.filename.trim() !== '' ? structure.filename : 'Untitled PDF';
  const [openChapters, setOpenChapters] = useState<{ [idx: number]: boolean }>({});
  const [multiSelectedChapters, setMultiSelectedChapters] = useState<Chapter[]>([]); // For checkbox multi-selection and logging

  const toggleChapterSections = (idx: number, event: React.MouseEvent) => {
    event.stopPropagation();
    setOpenChapters((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  // Handles single chapter selection for primary action (e.g., viewing, summarizing)
  const handleChapterItemClick = (chapter: Chapter) => {
    console.log('FileStructure: Single chapter selected for action:', chapter);
    onChapterSelect([chapter]); // Pass as an array with one item
  };

  // Handles checkbox changes for multi-selection
  const handleCheckboxChange = (chapter: Chapter, isChecked: boolean) => {
    let updatedMultiSelectedChapters;
    if (isChecked) {
      updatedMultiSelectedChapters = [...multiSelectedChapters, chapter];
    } else {
      updatedMultiSelectedChapters = multiSelectedChapters.filter(
        (sc) => !(sc.title === chapter.title && sc.start_page === chapter.start_page)
      );
    }
    setMultiSelectedChapters(updatedMultiSelectedChapters);
    console.log('FileStructure: Currently multi-selected chapters:', updatedMultiSelectedChapters);
    
    // Notify parent component about multi-selection changes
    if (onMultiSelectChange) {
      onMultiSelectChange(updatedMultiSelectedChapters);
    }
  };

  return (
    <div className="rounded-md">
      <div className="flex items-center gap-2 mb-3">
        <FileText className="h-4 w-4 text-blue-500" />
        <h3 className="text-base font-semibold text-white">File Structure</h3>
      </div>
      
      <div className="bg-gray-800/50 rounded-md p-3 mb-3 border border-gray-700">
        <div className="flex flex-col space-y-1">
          <div className="flex items-center text-xs">
            <span className="text-gray-400 w-16">Title:</span>
            <span className="font-mono truncate max-w-[200px] inline-block text-gray-200" title={pdfTitle}>
              {pdfTitle}
            </span>
          </div>
          <div className="flex items-center text-xs">
            <span className="text-gray-400 w-16">Pages:</span>
            <span className="text-gray-200">{structure.total_pages}</span>
          </div>
        </div>
      </div>
      
      <div className="space-y-1.5">
        {structure.chapters.map((chapter, idx) => {
          // Checkbox state is based on multiSelectedChapters
          const isCheckedForMultiSelect = multiSelectedChapters.some(
            sc => sc.title === chapter.title && sc.start_page === chapter.start_page
          );
          
          return (
            <div 
              key={idx} 
              className={`
                border border-gray-700 rounded-md overflow-hidden 
                ${isCheckedForMultiSelect ? 'bg-gray-700/50' : 'bg-gray-800/30'} 
                hover:bg-gray-700/70 transition-colors
              `}
            >
              <div 
                className="p-2 cursor-pointer"
                onClick={() => handleChapterItemClick(chapter)}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-600 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-900"
                    checked={isCheckedForMultiSelect}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      e.stopPropagation();
                      handleCheckboxChange(chapter, e.target.checked);
                    }}
                    onClick={(e) => e.stopPropagation()}
                  />
                  {chapter.sections.length > 0 && (
                    <button
                      onClick={(e) => toggleChapterSections(idx, e)}
                      className="p-1 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      {openChapters[idx] ? 
                        <ChevronDown size={16} className="text-blue-400" /> : 
                        <ChevronRight size={16} className="text-blue-400" />
                      }
                    </button>
                  )}
                  <div className="font-medium text-blue-300 text-sm flex-grow truncate">
                    {chapter.title}
                  </div>
                </div>
                
                <div className="text-xs text-gray-400 mt-1 pl-10">
                  Pages: {chapter.start_page} - {chapter.end_page} 
                  <span className="ml-1 text-gray-500">(Length: {chapter.length})</span>
                </div>
                
                {chapter.sections.length > 0 && openChapters[idx] && (
                  <div className="mt-2 ml-10 bg-gray-800/50 p-2 rounded-md border border-gray-700/50">
                    <div className="font-medium text-green-400 text-xs mb-1">Sections:</div>
                    <ul className="space-y-1">
                      {chapter.sections.map((section, sidx) => (
                        <li key={sidx} className="text-xs flex items-center gap-1">
                          <span className="h-1 w-1 rounded-full bg-gray-500"></span>
                          <span className="text-gray-300">{section.title}</span>
                          <span className="text-gray-500 text-[10px]">Page {section.page_number}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
