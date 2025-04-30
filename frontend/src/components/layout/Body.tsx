'use client';

import { useRef, useState } from 'react';
import { Panel, PanelGroup, PanelResizeHandle, ImperativePanelHandle } from 'react-resizable-panels';
import { Sources } from '@/features/sources/Sources';
import { Chat } from '@/features/chat/Chat';
import { CollapsiblePanel } from '@/components/ui/panels/CollapsiblePanel';
import { Chapter } from '@/types/pdf';
import { PDFViewer } from '@/features/pdf/PDFViewer';
import { PDFStructure } from '@/features/sources/PDFStructure';

export function Body() {
  const sourcesRef = useRef<ImperativePanelHandle>(null);
  const studioRef = useRef<ImperativePanelHandle>(null);
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
  };

  const handleChapterSelect = (chapter: Chapter) => {
    setSelectedChapter(chapter);
    const viewer = document.getElementById('pdf-content-viewer');
    viewer?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden bg-gray-900 text-gray-100">
      <PanelGroup direction="horizontal" className="w-full">
        <Panel 
          ref={sourcesRef}
          defaultSize={25} 
          minSize={0} 
          maxSize={40}
        >
          <CollapsiblePanel
            onCollapse={handleSourcesCollapse}
            isCollapsed={isSourcesCollapsed}
            direction="right"
          >
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
          </CollapsiblePanel>
        </Panel>

        <PanelResizeHandle className="w-1 hover:w-2 bg-gray-700 transition-all" />

        <Panel 
          defaultSize={50} 
          minSize={20}
        >
          <Chat />
        </Panel>

        <PanelResizeHandle className="w-1 hover:w-2 bg-gray-700 transition-all" />

        <Panel 
          ref={studioRef}
          defaultSize={25} 
          minSize={0} 
          maxSize={40}
        >
          <CollapsiblePanel
            onCollapse={handleStudioCollapse}
            isCollapsed={isStudioCollapsed}
            direction="left"
          >
            {selectedPDF && selectedChapter && (
              <div id="pdf-content-viewer">
                <PDFViewer 
                  pdfFile={selectedPDF.file}
                  pdfStructure={selectedPDF.structure}
                  selectedChapter={selectedChapter}
                />
              </div>
            )}
          </CollapsiblePanel>
        </Panel>
      </PanelGroup>
    </div>
  );
}
