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
  pdfFile: File;
  pdfStructure: {
    filename: string;
    total_pages: number;
    chapters: Chapter[];
  };
  selectedChapter: Chapter;
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

  return (
    <div className="h-full flex">
      <Sidebar
        isOpen={!isCollapsed}
        onToggle={onCollapse}
        title="PDF Viewer"
      >
        <SidebarContent>
          <SidebarSection>
            <span className="text-blue-300 font-medium truncate">{selectedChapter.title}</span>
          </SidebarSection>
          <SidebarSection>
            {loading && <div className="text-blue-400 text-sm">Loading content...</div>}
            {error && <div className="text-red-400 text-sm p-2 bg-red-900/20 rounded border border-red-800/50">{error}</div>}
            
            {content && !loading && !error && (
              <div className="space-y-4">
                {content.pages.map((page) => (
                  <div 
                    key={page.page_number} 
                    className={`border border-gray-700 rounded-md overflow-hidden ${selectedPage === page.page_number ? 'bg-gray-700/50' : 'bg-gray-800/30'} hover:bg-gray-700/30 transition-colors cursor-pointer`}
                    onClick={() => setSelectedPage(page.page_number)}
                  >
                    <div className="flex items-center gap-2 p-2 border-b border-gray-700 bg-gray-800/50">
                      <BookOpen className="h-4 w-4 text-blue-400" />
                      <h4 className="text-xs font-medium text-blue-300">Page {page.page_number}</h4>
                    </div>
                    <div className="p-3 text-xs text-gray-300 whitespace-pre-wrap max-h-48 overflow-y-auto">
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
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-4 flex-shrink-0 bg-gray-900 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">{selectedChapter.title}</h2>
          {selectedPageContent && (
            <div className="text-xs text-gray-400 mt-1">
              Page {selectedPageContent.page_number} of {selectedChapter.end_page - selectedChapter.start_page + 1}
            </div>
          )}
        </div>
        
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 p-6 bg-gray-800">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-invert prose-lg">
              {loading && <div className="text-blue-400">Loading content...</div>}
              {error && <div className="text-red-400 p-4 bg-red-900/20 rounded border border-red-800/50">{error}</div>}
              
              {!loading && !error && selectedPageContent ? (
                <div className="whitespace-pre-wrap">
                  {selectedPageContent.text}
                </div>
              ) : (
                <div className="text-gray-300 text-center py-8">
                  <p>Select a page from the sidebar to view its content here.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
