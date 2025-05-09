'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Chapter } from '../../../../../types/pdf';

interface FileStructureProps {
  structure: {
    filename: string;
    total_pages: number;
    chapters: Chapter[];
  };
  onChapterSelect: (chapter: Chapter) => void;
}

export function FileStructure({ structure, onChapterSelect }: FileStructureProps) {
  const pdfTitle = structure.filename && structure.filename.trim() !== '' ? structure.filename : 'Untitled PDF';
  const [openChapters, setOpenChapters] = useState<{ [idx: number]: boolean }>({});

  const toggleChapter = (idx: number, event: React.MouseEvent) => {
    event.stopPropagation();
    setOpenChapters((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleChapterClick = (chapter: Chapter) => {
    console.log('FileStructure: Chapter clicked:', chapter);
    onChapterSelect(chapter);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 h-full min-h-0 overflow-y-auto">
      <h3 className="text-base font-bold text-white mb-2">File Structure</h3>
      <div className="text-xs text-gray-300 mb-2">Title: <span className="font-mono">{pdfTitle}</span></div>
      <div className="text-xs text-gray-300 mb-4">Total Pages: {structure.total_pages}</div>
      <div className="space-y-2">
        {structure.chapters.map((chapter, idx) => (
          <div 
            key={idx} 
            className="border-b border-gray-700 pb-2 cursor-pointer hover:bg-gray-700 rounded p-2 transition-colors"
            onClick={() => handleChapterClick(chapter)}
          >
            <div className="flex items-center gap-2">
              {chapter.sections.length > 0 && (
                <button
                  onClick={(e) => toggleChapter(idx, e)}
                  className="text-xs text-blue-400 hover:text-blue-200 focus:outline-none"
                >
                  {openChapters[idx] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>
              )}
              <div className="font-semibold text-blue-300 text-base">
                {chapter.title}
              </div>
            </div>
            <div className="text-xs text-gray-400 mt-1">
              Pages: {chapter.start_page} - {chapter.end_page} (Length: {chapter.length})
            </div>
            {chapter.sections.length > 0 && openChapters[idx] && (
              <div className="mt-2 ml-4">
                <div className="font-semibold text-green-300 text-xs">Sections:</div>
                <ul className="list-disc ml-6">
                  {chapter.sections.map((section, sidx) => (
                    <li key={sidx} className="text-xs text-gray-300">
                      {section.title} <span className="text-gray-500 text-[10px]">(Page {section.page_number})</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
