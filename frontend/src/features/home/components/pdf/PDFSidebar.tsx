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

interface PDFSidebarProps {
  pdfFile: File;
  pdfStructure: {
    filename: string;
    total_pages: number;
    chapters: Chapter[];
  };
  selectedChapter: Chapter;
  isCollapsed: boolean;
  onCollapse: () => void;
}

export function PDFSidebar({ 
  pdfFile, 
  pdfStructure, 
  selectedChapter, 
  isCollapsed, 
  onCollapse 
}: PDFSidebarProps) {
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<PDFContent | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Reset state when PDF file changes
    setContent(null);
    setError(null);
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
      } catch (err: any) {
        console.error('Error loading content:', err);
        setError(err.message || 'Error fetching PDF content');
      } finally {
        setLoading(false);
      }
    };

    loadChapterContent();
  }, [selectedChapter, pdfFile]);

  return (
    <Sidebar
      isOpen={!isCollapsed}
      onToggle={onCollapse}
      title="PDF Viewer"
    >
      <SidebarContent>
        <SidebarSection>
          <div className="bg-gray-800/50 rounded-md p-3 border border-gray-700 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-4 w-4 text-blue-500" />
              <h3 className="text-sm font-medium text-white">{pdfStructure.filename}</h3>
            </div>
            <div className="flex flex-col space-y-1 text-xs">
              <div className="flex items-center">
                <span className="text-gray-400 w-24">Total Pages:</span>
                <span className="text-gray-200">{pdfStructure.total_pages}</span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-400 w-24">Current Chapter:</span>
                <span className="text-blue-300 font-medium truncate">{selectedChapter.title}</span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-400 w-24">Page Range:</span>
                <span className="text-gray-200">{selectedChapter.start_page} - {selectedChapter.end_page}</span>
              </div>
            </div>
          </div>
        </SidebarSection>

        <SidebarSection title="Content">
          {loading && <div className="text-blue-400 text-sm">Loading content...</div>}
          {error && <div className="text-red-400 text-sm p-2 bg-red-900/20 rounded border border-red-800/50">{error}</div>}
          
          {content && !loading && !error && (
            <div className="space-y-4">
              {content.pages.map((page) => (
                <div key={page.page_number} className="border border-gray-700 rounded-md overflow-hidden bg-gray-800/30 hover:bg-gray-700/30 transition-colors">
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
  );
}
