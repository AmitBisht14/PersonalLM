'use client';

import { useState, ChangeEvent } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Chapter } from '../../../../../types/pdf';

interface FileStructureProps {
  structure: {
    filename: string;
    total_pages: number;
    chapters: Chapter[];
  };
  onChapterSelect: (chapters: Chapter[]) => void; // Expects an array, even for single selection
}

export function FileStructure({ structure, onChapterSelect }: FileStructureProps) {
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

  // Handles checkbox changes for multi-selection, primarily for logging
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
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 h-full min-h-0 overflow-y-auto">
      <h3 className="text-base font-bold text-white mb-2">File Structure</h3>
      <div className="text-xs text-gray-300 mb-2">Title: <span className="font-mono">{pdfTitle}</span></div>
      <div className="text-xs text-gray-300 mb-4">Total Pages: {structure.total_pages}</div>
      <div className="space-y-2">
        {structure.chapters.map((chapter, idx) => {
          // Checkbox state is based on multiSelectedChapters
          const isCheckedForMultiSelect = multiSelectedChapters.some(sc => sc.title === chapter.title && sc.start_page === chapter.start_page);
          
          return (
            <div 
              key={idx} 
              // Visual indication for active selection could be handled in Home.tsx based on its selectedChapters state if needed
              // For now, hover effect is generic.
              className={`border-b border-gray-700 pb-2 rounded p-2 transition-colors hover:bg-gray-600 group cursor-pointer`}
              onClick={() => handleChapterItemClick(chapter)} // Main click action for the chapter item
            >
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 cursor-pointer"
                  checked={isCheckedForMultiSelect}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    e.stopPropagation(); // Prevent div click (handleChapterItemClick)
                    handleCheckboxChange(chapter, e.target.checked);
                  }}
                  onClick={(e) => e.stopPropagation()} // Extra precaution for click propagation
                />
                {chapter.sections.length > 0 && (
                  <button
                    onClick={(e) => toggleChapterSections(idx, e)} // Renamed toggleChapter to toggleChapterSections
                    className="text-xs text-blue-400 hover:text-blue-200 focus:outline-none p-1"
                  >
                    {openChapters[idx] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>
                )}
                <div 
                  className="font-semibold text-blue-300 text-base flex-grow"
                  // Title click is now part of the parent div's click handler
                >
                  {chapter.title}
                </div>
              </div>
              <div className="text-xs text-gray-400 mt-1 pl-10"> {/* Adjusted indent for checkbox + expander */}
                Pages: {chapter.start_page} - {chapter.end_page} (Length: {chapter.length})
              </div>
              {chapter.sections.length > 0 && openChapters[idx] && (
                <div className="mt-2 ml-14"> {/* Further indent sections */}
                  <div className="font-semibold text-green-300 text-xs">Sections:</div>
                  <ul className="list-disc ml-6">
                    {chapter.sections.map((section, sidx) => (
                      <li key={sidx} className="text-xs text-gray-300">
                        {section.title} <span className="text-gray-500 text-[10px]" >(Page {section.page_number})</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
