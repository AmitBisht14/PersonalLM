'use client';

import { useRef, useState } from 'react';
import { FileSource } from './components/sources/fileSource';
import { SummaryContainer } from './components/summary/SummaryContainer';
import { Chapter } from '@/types/pdf';

export function Home() {
  const summaryContainerRef = useRef<any>(null);
  const [isSourcesCollapsed, setIsSourcesCollapsed] = useState(false);
  const [selectedPDF, setSelectedPDF] = useState<{ 
    file: File; 
    structure: { 
      filename: string; 
      total_pages: number; 
      chapters: Chapter[]; 
    }; 
  } | null>(null);
  const [selectedChapters, setSelectedChapters] = useState<Chapter[] | null>(null);

  const handleSourcesCollapse = () => {
    setIsSourcesCollapsed(!isSourcesCollapsed);
  };

  const handleFileStructure = (file: File | null, structure: { filename: string; total_pages: number; chapters: Chapter[] } | null) => {
    setSelectedPDF(file && structure ? { file, structure } : null);
    setSelectedChapters(null);
    // Don't clear summaries when changing files
  };

  const handleChapterSelect = (chapters: Chapter[]) => {
    setSelectedChapters(chapters.length > 0 ? chapters : null);
    // Don't clear summaries when selecting chapters
  };

  const chapterForViewer = selectedChapters && selectedChapters.length > 0 ? selectedChapters[0] : null;

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden bg-gray-900 text-gray-100">
      <FileSource 
        onCollapse={handleSourcesCollapse} 
        isCollapsed={isSourcesCollapsed}
        onFileStructure={handleFileStructure}
        selectedPDF={selectedPDF}
        onChapterSelect={handleChapterSelect}
        onGenerateSummary={(chapters) => {
          if (summaryContainerRef.current) {
            summaryContainerRef.current.fetchChapterContents(chapters);
          }
        }}
      />
      
      <div className="flex-1">
        <SummaryContainer 
          ref={summaryContainerRef}
          pdfFile={selectedPDF?.file}
        />
      </div>
    </div>
  );
}
