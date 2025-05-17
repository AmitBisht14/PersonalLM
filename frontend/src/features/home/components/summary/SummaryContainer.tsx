'use client';

import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Chapter } from '@/types/pdf';
import { SummaryItem } from './components/SummaryItem';
import { fetchRawChapterContents, ChapterContent } from '@/services/summaryService';

export interface SummaryData {
  id: string;
  title: string;
  content: string;
  timestamp: string;
  pageCount?: number;
  chapterCount?: number;
  chapterContents?: ChapterContent[];
}

interface SummaryContainerProps {
  initialSummaries?: SummaryData[];
  pdfFile?: File;
  selectedChapters?: Chapter[];
}

export interface SummaryContainerHandle {
  generateSummary: (chapters: Chapter[]) => void;
}

export const SummaryContainer = forwardRef<SummaryContainerHandle, SummaryContainerProps>((
  { initialSummaries = [], pdfFile, selectedChapters = [] },
  ref
) => {
  const [summaries, setSummaries] = useState<SummaryData[]>(initialSummaries);
  const [isGenerating, setIsGenerating] = useState(false);

  // Update summaries when initialSummaries prop changes
  useEffect(() => {
    setSummaries(initialSummaries);
  }, [initialSummaries]);

  // Expose the generateSummary function via ref
  useImperativeHandle(ref, () => ({
    generateSummary
  }));

  const handleDeleteSummary = (id: string) => {
    setSummaries(prevSummaries => prevSummaries.filter(summary => summary.id !== id));
  };

  const addSummary = (newSummary: SummaryData) => {
    setSummaries(prevSummaries => [newSummary, ...prevSummaries]);
  };

  const generateSummary = async (chaptersToSummarize?: Chapter[]) => {
    try {
      // Use passed chapters if available, otherwise fall back to selectedChapters prop
      const chaptersToUse = chaptersToSummarize?.length ? chaptersToSummarize : selectedChapters;
      
      if (!chaptersToUse.length || !pdfFile) {
        console.error('No chapters selected or PDF file not available for summary generation');
        return;
      }
      
      // Log the selected chapter information
      console.log('Selected chapters received in SummaryContainer:', chaptersToUse);
      
      // Set loading state
      setIsGenerating(true);
      
      // Fetch chapter contents using the service
      const allChapterRawContent = await fetchRawChapterContents(chaptersToUse, pdfFile);
      console.log('allChapterRawContent', allChapterRawContent);
      // addSummary(newSummary);
    } catch (error) {
      console.error('Error in generateSummary:', error);
      // Handle error appropriately - could add error state or notification here
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <section className="h-full p-4 flex flex-col">
      <div className="flex justify-between items-center mb-4 flex-shrink-0">
        <h2 className="text-xl font-semibold text-white">Summaries</h2>
        {isGenerating && (
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500 mr-2"></div>
            <span className="text-sm text-gray-300">Generating summary...</span>
          </div>
        )}
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
        {summaries.length > 0 ? (
          <div>
            {summaries.map(summary => (
              <SummaryItem
                key={summary.id}
                id={summary.id}
                title={summary.title}
                content={summary.content}
                timestamp={summary.timestamp}
                pageCount={summary.pageCount}
                chapterCount={summary.chapterCount}
                onDelete={handleDeleteSummary}
              />
            ))}
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg p-4 text-gray-400">
            No summaries generated yet. Select chapters and click "Generate Summary".
          </div>
        )}
      </div>
    </section>
  );
});
