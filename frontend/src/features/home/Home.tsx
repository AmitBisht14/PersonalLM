'use client';

import { useRef, useState } from 'react';
import { ImperativePanelHandle } from 'react-resizable-panels';
import { FileSource } from './components/sources/fileSource';
import { SummaryContainer, SummaryData } from './components/summary/SummaryContainer';
import { Chapter } from '@/types/pdf';
import { PDFViewer } from './components/pdf/PDFViewer';
import { PanelLayout } from '@/components/layout/PanelLayout';

export function Home() {
  const sourcesRef = useRef<ImperativePanelHandle>(null);
  const studioRef = useRef<ImperativePanelHandle>(null);
  const summaryContainerRef = useRef<any>(null);
  const [isSourcesCollapsed, setIsSourcesCollapsed] = useState(false);
  const [isStudioCollapsed, setIsStudioCollapsed] = useState(false);
  const [summaries, setSummaries] = useState<SummaryData[]>([]);
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
    if (!isSourcesCollapsed) {
      sourcesRef.current?.resize(0);
    } else {
      sourcesRef.current?.resize(25);
    }
    setIsSourcesCollapsed(!isSourcesCollapsed);
  };

  const handleStudioCollapse = () => {
    if (!isStudioCollapsed) {
      studioRef.current?.resize(0);
    } else {
      studioRef.current?.resize(25);
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

  const handleSummaryGenerated = (newSummary: string) => {
    // Create a new summary with metadata
    const summaryData: SummaryData = {
      id: Date.now().toString(),
      title: selectedChapters && selectedChapters.length > 0 
        ? `Summary of ${selectedChapters.length} chapter(s)` 
        : 'New Summary',
      content: newSummary,
      timestamp: new Date().toLocaleString(),
    };
    
    // Add the new summary to the list
    setSummaries(prev => [summaryData, ...prev]);
  };

  const chapterForViewer = selectedChapters && selectedChapters.length > 0 ? selectedChapters[0] : null;

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden bg-gray-900 text-gray-100">
      <PanelLayout
        leftPanel={{
          ref: sourcesRef,
          defaultSize: 25,
          minSize: 0,
          maxSize: 40,
          isCollapsed: isSourcesCollapsed,
          onCollapse: handleSourcesCollapse,
          collapseDirection: 'right',
          children: (
            <div className="flex flex-col h-full">
              <FileSource 
                onCollapse={handleSourcesCollapse} 
                isCollapsed={isSourcesCollapsed}
                onFileStructure={handleFileStructure}
                selectedPDF={selectedPDF}
                onChapterSelect={handleChapterSelect}
                onGenerateSummary={(chapters) => {
                  if (summaryContainerRef.current) {
                    summaryContainerRef.current.generateSummary(chapters);
                  }
                }}
              />
            </div>
          )
        }}
        centerPanel={{
          defaultSize: 50,
          minSize: 20,
          children: <SummaryContainer 
            ref={summaryContainerRef}
            initialSummaries={summaries} 
            pdfFile={selectedPDF?.file}
          />
        }}
        rightPanel={{
          ref: studioRef,
          defaultSize: 25,
          minSize: 0,
          maxSize: 40,
          isCollapsed: isStudioCollapsed,
          onCollapse: handleStudioCollapse,
          collapseDirection: 'left',
          children: selectedPDF && chapterForViewer ? (
            <div id="pdf-content-viewer" className="h-full overflow-hidden">
              <PDFViewer 
                pdfFile={selectedPDF.file}
                pdfStructure={selectedPDF.structure}
                selectedChapter={chapterForViewer}
                onSummaryGenerated={handleSummaryGenerated}
              />
            </div>
          ) : null
        }}
      />
    </div>
  );
}
