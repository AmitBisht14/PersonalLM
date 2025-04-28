import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface Section {
  title: string;
  page_number: number;
}

interface Chapter {
  title: string;
  start_page: number;
  end_page: number;
  length: number;
  sections: Section[];
}

interface PDFStructureProps {
  structure: {
    filename: string;
    total_pages: number;
    chapters: Chapter[];
  };
}

export function PDFStructure({ structure }: PDFStructureProps) {
  const pdfTitle = structure.filename && structure.filename.trim() !== '' ? structure.filename : 'Untitled PDF';
  const [openChapters, setOpenChapters] = useState<{ [idx: number]: boolean }>({});

  const toggleChapter = (idx: number) => {
    setOpenChapters((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="bg-gray-900 rounded-lg p-4 h-full min-h-0 overflow-y-auto">
      <h3 className="text-base font-bold text-white mb-2">PDF Structure</h3>
      <div className="text-xs text-gray-300 mb-2">Title: <span className="font-mono">{pdfTitle}</span></div>
      <div className="text-xs text-gray-300 mb-4">Total Pages: {structure.total_pages}</div>
      <div>
        {structure.chapters.map((chapter, idx) => (
          <div key={idx} className="mb-4 border-b border-gray-700 pb-2">
            <div className="flex items-center gap-2">
              {chapter.sections.length > 0 && (
                <button
                  className="text-xs text-blue-400 hover:text-blue-200 focus:outline-none"
                  onClick={() => toggleChapter(idx)}
                  title={openChapters[idx] ? 'Collapse sections' : 'Expand sections'}
                >
                  {openChapters[idx] ? (
                    <ChevronDown className="w-4 h-4 inline" />
                  ) : (
                    <ChevronRight className="w-4 h-4 inline" />
                  )}
                </button>
              )}
              <div
                className="font-semibold text-blue-300 text-base cursor-pointer hover:underline"
                onClick={() => alert(`Chapter Pages: ${chapter.start_page} - ${chapter.end_page}`)}
                title="Show chapter page range"
              >
                {chapter.title}
              </div>
            </div>
            <div className="text-xs text-gray-400">
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
