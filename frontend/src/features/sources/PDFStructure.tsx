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
  return (
    <div className="mt-6 bg-gray-900 rounded-lg p-4 max-h-[60vh] overflow-y-auto">
      <h3 className="text-lg font-bold text-white mb-2">PDF Structure</h3>
      <div className="text-gray-300 mb-2">Filename: <span className="font-mono">{structure.filename}</span></div>
      <div className="text-gray-300 mb-4">Total Pages: {structure.total_pages}</div>
      <div>
        {structure.chapters.map((chapter, idx) => (
          <div key={idx} className="mb-4 border-b border-gray-700 pb-2">
            <div className="font-semibold text-blue-300">
              Chapter: {chapter.title}
            </div>
            <div className="text-gray-400 text-sm">
              Pages: {chapter.start_page} - {chapter.end_page} (Length: {chapter.length})
            </div>
            {chapter.sections.length > 0 && (
              <div className="mt-2 ml-4">
                <div className="font-semibold text-green-300">Sections:</div>
                <ul className="list-disc ml-6">
                  {chapter.sections.map((section, sidx) => (
                    <li key={sidx} className="text-gray-300">
                      {section.title} <span className="text-gray-500 text-xs">(Page {section.page_number})</span>
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
