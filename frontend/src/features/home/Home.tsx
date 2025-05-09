'use client';

import { useRef, useState } from 'react';
import { ImperativePanelHandle } from 'react-resizable-panels';
import { Sources } from './components/sources/components/Sources';
import { Summary } from './components/summary/Summary';
import { Chapter } from '@/types/pdf';
import { PDFViewer } from './components/pdf/PDFViewer';
import { PDFStructure } from './components/sources/components/PDFStructure';
import { PanelLayout } from '@/components/layout/PanelLayout';

export function Body() {
  const sourcesRef = useRef<ImperativePanelHandle>(null);
  const studioRef = useRef<ImperativePanelHandle>(null);
  const [isSourcesCollapsed, setIsSourcesCollapsed] = useState(false);
  const [isStudioCollapsed, setIsStudioCollapsed] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [selectedPDF, setSelectedPDF] = useState<{ 
    file: File; 
    structure: { 
      filename: string; 
      total_pages: number; 
      chapters: Chapter[]; 
    }; 
  } | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);

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

  const handlePDFStructure = (file: File | null, structure: { filename: string; total_pages: number; chapters: Chapter[] } | null) => {
    setSelectedPDF(file && structure ? { file, structure } : null);
    setSelectedChapter(null);
    setSummary(null);
  };

  const handleChapterSelect = (chapter: Chapter) => {
    setSelectedChapter(chapter);
    setSummary(null);
  };

  const handleSummaryGenerated = (newSummary: string) => {
    setSummary(newSummary);
  };

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
              <Sources 
                onCollapse={handleSourcesCollapse} 
                isCollapsed={isSourcesCollapsed}
                onPDFStructure={handlePDFStructure}
              />
              {selectedPDF && (
                <div className="mt-4 flex-1 min-h-0">
                  <PDFStructure 
                    structure={selectedPDF.structure}
                    onChapterSelect={handleChapterSelect}
                  />
                </div>
              )}
            </div>
          )
        }}
        centerPanel={{
          defaultSize: 50,
          minSize: 20,
          children: <Summary summary={summary} />
        }}
        rightPanel={{
          ref: studioRef,
          defaultSize: 25,
          minSize: 0,
          maxSize: 40,
          isCollapsed: isStudioCollapsed,
          onCollapse: handleStudioCollapse,
          collapseDirection: 'left',
          children: selectedPDF && selectedChapter ? (
            <div id="pdf-content-viewer" className="h-full overflow-hidden">
              <PDFViewer 
                pdfFile={selectedPDF.file}
                pdfStructure={selectedPDF.structure}
                selectedChapter={selectedChapter}
                onSummaryGenerated={handleSummaryGenerated}
              />
            </div>
          ) : null
        }}
      />
    </div>
  );
}
