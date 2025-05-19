'use client';

import { useState, useEffect } from 'react';
import { Chapter } from '@/types/pdf';
import { fetchPDFContent } from '@/services/pdfService';
import { Sidebar } from '@/components/ui/sidebar/Sidebar';
import { SidebarContent, SidebarSection, SidebarFooter } from '@/components/ui/sidebar/SidebarContent';
import { FileText, BookOpen } from 'lucide-react';

interface PDFContent {
  filename: string;
  start_page: number;
  end_page: number;
  total_pages: number;
  pages: Array<{
    page_number: number;
    text: string;
  }>;
}

interface PDFViewerProps {
  pdfFile: File | null;
  pdfStructure: {
    filename: string;
    total_pages: number;
    chapters: Chapter[];
  } | null;
  selectedChapter: Chapter | null;
  isCollapsed?: boolean;
  onCollapse?: () => void;
}

export function PDFViewer({ 
  pdfFile, 
  pdfStructure, 
  selectedChapter,
  isCollapsed = false,
  onCollapse = () => {}
}: PDFViewerProps) {
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<PDFContent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedPage, setSelectedPage] = useState<number | null>(null);

  useEffect(() => {
    // Reset state when PDF file changes
    setContent(null);
    setError(null);
    setSelectedPage(null);
  }, [pdfFile]);

  useEffect(() => {
    // Load content when chapter changes
    const loadChapterContent = async () => {
      if (!pdfFile || !selectedChapter) return;
      
      setLoading(true);
      setError(null);
      try {
        // Only fetch formatted content
        const { content: formattedContent } = await fetchPDFContent(
          pdfFile, 
          selectedChapter.start_page, 
          selectedChapter.end_page || selectedChapter.start_page
        );
        console.log('Received content:', formattedContent);
        setContent(formattedContent);
        // Select the first page by default
        if (formattedContent && formattedContent.pages.length > 0) {
          setSelectedPage(formattedContent.pages[0].page_number);
        }
      } catch (err: any) {
        console.error('Error loading content:', err);
        setError(err.message || 'Error fetching PDF content');
      } finally {
        setLoading(false);
      }
    };

    loadChapterContent();
  }, [selectedChapter, pdfFile]);

  // Get the selected page content
  const selectedPageContent = content?.pages.find(page => page.page_number === selectedPage);

  // Empty UI when no PDF or chapter is selected
  if (!pdfFile || !pdfStructure || !selectedChapter) {
    return (
      <div className="flex h-full">
        <Sidebar
          isOpen={!isCollapsed}
          onToggle={onCollapse}
          title="PDF Viewer"
          position="right"
        >
          <SidebarContent>
            <div className="p-6 text-center text-gray-400">
              <p>No PDF selected</p>
              <p className="text-sm mt-2">Upload and select a PDF chapter to view content</p>
            </div>
          </SidebarContent>
          <SidebarFooter>
            <div className="text-xs text-gray-400 text-center">
              PDF Viewer
            </div>
          </SidebarFooter>
        </Sidebar>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      <Sidebar
        isOpen={!isCollapsed}
        onToggle={onCollapse}
        title="PDF Viewer"
        position="right"
      >
        <SidebarContent>
          <SidebarSection title={selectedChapter.title}>
            {loading && <div className="text-blue-400 p-4">Loading content...</div>}
            {error && <div className="text-red-400 p-4">{error}</div>}
            
            {!loading && !error && content && content.pages && (
              <div className="space-y-4 p-2">
                {content.pages.map((page) => (
                  <div 
                    key={page.page_number}
                    className={`p-3 rounded-md cursor-pointer transition-colors ${selectedPage === page.page_number ? 'bg-gray-700' : 'hover:bg-gray-700/50'}`}
                    onClick={() => setSelectedPage(page.page_number)}
                  >
                    <div className="text-xs text-gray-400 mb-1">Page {page.page_number}</div>
                    <div className="text-sm text-gray-300 line-clamp-3">
                      {page.text.length > 300 
                        ? `${page.text.substring(0, 300)}...` 
                        : page.text}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </SidebarSection>
        </SidebarContent>

        <SidebarFooter>
          <div className="text-xs text-gray-400 text-center">
            Viewing pages {selectedChapter.start_page} to {selectedChapter.end_page} of {pdfStructure.total_pages}
          </div>
        </SidebarFooter>
      </Sidebar>
    </div>
  );
}
