'use client';

import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Chapter } from '@/types/pdf';
import { SummaryItem } from './components/SummaryItem';
import { 
  RawChapterContent, 
  fetchAndProcessChapterContents, 
  loadSummaryPromptWithState 
} from '@/services/summaryService';

// Interface no longer needed as we're directly using RawChapterContent

interface SummaryContainerProps {
  pdfFile?: File;
  selectedChapters?: Chapter[];
}

export interface SummaryContainerHandle {
  fetchChapterContents: (chapters: Chapter[]) => void;
}

export const SummaryContainer = forwardRef<SummaryContainerHandle, SummaryContainerProps>((
  { pdfFile, selectedChapters = [] },
  ref
) => {
  const [chapterContents, setChapterContents] = useState<RawChapterContent[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [summaryPrompt, setSummaryPrompt] = useState<string | null>(null);
  const [isPromptLoading, setIsPromptLoading] = useState(false);

  // Fetch the summary prompt once when the component mounts
  useEffect(() => {
    const loadPrompt = async () => {
      setIsPromptLoading(true);
      const { prompt, isLoading } = await loadSummaryPromptWithState(summaryPrompt);
      setSummaryPrompt(prompt);
      setIsPromptLoading(isLoading);
    };

    loadPrompt();
  }, []);

  // Expose the fetchChapterContents function via ref
  useImperativeHandle(ref, () => ({
    fetchChapterContents
  }));

  const handleDeleteChapter = (title: string) => {
    setChapterContents(prevContents => prevContents.filter(item => item.chapter.title !== title));
  };

  const fetchChapterContents = async (chaptersToSummarize?: Chapter[]) => {
    try {
      // Use passed chapters if available, otherwise fall back to selectedChapters prop
      const chaptersToUse = chaptersToSummarize?.length ? chaptersToSummarize : selectedChapters;
      
      if (!chaptersToUse.length || !pdfFile) {
        console.error('No chapters selected or PDF file not available for content fetching');
        return;
      }
      
      // UI-related state update
      setIsGenerating(true);
      
      // Call the service function to handle the business logic
      const contents = await fetchAndProcessChapterContents(chaptersToUse, pdfFile);
      
      // Update state with new chapter contents - UI logic only
      setChapterContents(prevContents => {
        // Create a set of existing chapter titles for quick lookup
        const existingTitles = new Set(prevContents.map(item => item.chapter.title));
        
        // Filter out any new chapters that already exist in the list
        const newContents = contents.filter(item => !existingTitles.has(item.chapter.title));
        
        // Combine existing and new contents
        return [...prevContents, ...newContents];
      });
    } catch (error) {
      console.error('Error fetching chapter contents:', error);
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
                summaryPrompt={summaryPrompt}
                isPromptLoading={isPromptLoading}
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
