'use client';

import { useState, useEffect } from 'react';
import { Chapter } from '@/types/pdf';

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
}

export function PDFViewer({ pdfFile, pdfStructure, selectedChapter }: PDFViewerProps) {
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
        const formData = new FormData();
        formData.append('file', pdfFile);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/pdf/content?start_page=${selectedChapter.start_page}&end_page=${selectedChapter.end_page || selectedChapter.start_page}`,
          {
            method: 'POST',
            body: formData,
          }
        );
        if (!res.ok) {
          throw new Error('Failed to fetch PDF content');
        }
        const data = await res.json();
        console.log('Received content:', data);
        setContent(data);
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
    <div className="h-full flex flex-col">
      <div className="p-4 flex-shrink-0 bg-gray-900">
        <h2 className="text-lg font-semibold text-white">{pdfStructure.filename}</h2>
        <div className="text-blue-300 text-sm mt-1">
          Chapter: {selectedChapter.title}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
        <div className="p-4 bg-gray-800">
          {loading && <div className="text-blue-300">Loading content...</div>}
          {error && <div className="text-red-300">{error}</div>}
          {content && !loading && !error && (
            <div className="space-y-8">
              {content.pages.map((page) => (
                <div key={page.page_number} className="pb-8 border-b border-gray-700 last:border-0">
                  <h3 className="text-blue-300 font-semibold mb-2">Page {page.page_number}</h3>
                  <div className="whitespace-pre-wrap text-gray-100">{page.text}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
