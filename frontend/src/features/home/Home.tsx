'use client';

import { useRef, useState } from 'react';
import { ImperativePanelHandle } from 'react-resizable-panels';
import { FileSource } from './components/sources/fileSource';
import { SummaryContainer } from './components/summary/SummaryContainer';
import { Chapter } from '@/types/pdf';
import { PDFViewer } from './components/pdf/PDFViewer';
import { PanelLayout } from '@/components/layout/PanelLayout';

export function Home() {
  const studioRef = useRef<ImperativePanelHandle>(null);
  const summaryContainerRef = useRef<any>(null);
  const [isSourcesCollapsed, setIsSourcesCollapsed] = useState(false);
  const [isStudioCollapsed, setIsStudioCollapsed] = useState(false);
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

  const handleStudioCollapse = () => {
    if (!isStudioCollapsed) {
      studioRef.current?.resize(0);
    } else {
      studioRef.current?.resize(40);
    }
    setIsStudioCollapsed(!isStudioCollapsed);
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
      
      <div className="flex-1 flex">
        <PanelLayout
          centerPanel={{
            defaultSize: 60,
            minSize: 30,
            children: <SummaryContainer 
              ref={summaryContainerRef}
              pdfFile={selectedPDF?.file}
            />
          }}
          rightPanel={{
            ref: studioRef,
            defaultSize: 40,
            minSize: 0,
            maxSize: 70,
            isCollapsed: isStudioCollapsed,
            onCollapse: handleStudioCollapse,
            collapseDirection: 'left',
            children: selectedPDF && chapterForViewer ? (
              <div id="pdf-content-viewer" className="h-full overflow-hidden">
                <PDFViewer 
                  pdfFile={selectedPDF.file}
                  pdfStructure={selectedPDF.structure}
                  selectedChapter={chapterForViewer}
                />
              </div>
            ) : null
          }}
        />
      </div>
    </div>
  );
}
