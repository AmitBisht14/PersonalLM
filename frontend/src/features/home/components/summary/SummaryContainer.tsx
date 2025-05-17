'use client';

import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Chapter } from '@/types/pdf';
import { SummaryItem } from './components/SummaryItem';
import { fetchRawChapterContents, RawChapterContent } from '@/services/summaryService';

// Interface no longer needed as we're directly using RawChapterContent

interface SummaryContainerProps {
  pdfFile?: File;
  selectedChapters?: Chapter[];
}

export interface SummaryContainerHandle {
  generateSummary: (chapters: Chapter[]) => void;
}

export const SummaryContainer = forwardRef<SummaryContainerHandle, SummaryContainerProps>((
  { pdfFile, selectedChapters = [] },
  ref
) => {
  const [chapterContents, setChapterContents] = useState<RawChapterContent[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // No longer needed as we're not accepting initialSummaries

  // Expose the generateSummary function via ref
  useImperativeHandle(ref, () => ({
    generateSummary
  }));

  const handleDeleteChapter = (title: string) => {
    setChapterContents(prevContents => prevContents.filter(item => item.chapter.title !== title));
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
      
      // Update state with the fetched raw chapter contents
      setChapterContents(allChapterRawContent);
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
        {chapterContents.length > 0 ? (
          <div>
            {chapterContents.map((chapterContent, index) => (
              <SummaryItem
                key={`${chapterContent.chapter.title}-${index}`}
                chapterContent={chapterContent}
                onDelete={handleDeleteChapter}
              />
            ))}
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg p-4 text-gray-400">
            No chapter contents fetched yet. Select chapters and click "Generate Summary".
          </div>
        )}
      </div>
    </section>
  );
});
