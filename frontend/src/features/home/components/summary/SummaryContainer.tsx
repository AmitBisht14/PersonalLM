'use client';

import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { SummaryItem } from './components/SummaryItem';
import { Chapter } from '@/types/pdf';
import { fetchRawPDFContent, fetchSummaryPromptTemplate, requestSummaryGeneration } from '@/api/pdfApi';

export interface SummaryData {
  id: string;
  title: string;
  content: string;
  timestamp: string;
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
    // Use passed chapters if available, otherwise fall back to selectedChapters prop
    const chaptersToUse = chaptersToSummarize?.length ? chaptersToSummarize : selectedChapters;
    
    if (!pdfFile || chaptersToUse.length === 0 || isGenerating) {
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // Step 1: Get the summary prompt template
      const summaryPrompt = await fetchSummaryPromptTemplate();
      
      // Step 2: Fetch raw content for each chapter
      const chapterContents = await Promise.all(
        chaptersToUse.map(chapter => 
          fetchRawPDFContent(pdfFile, chapter.start_page, chapter.end_page)
        )
      );
      
      // Step 3: Combine all chapter contents
      const combinedContent = chapterContents.join('\n\n');
      
      // Step 4: Generate summary using the prompt template and combined content
      const summaryResponse = await requestSummaryGeneration(combinedContent, summaryPrompt.content);
      
      // Step 5: Add the new summary to the list
      const newSummary: SummaryData = {
        id: Date.now().toString(),
        title: `Summary of ${chaptersToUse.length} chapter(s)`,
        content: summaryResponse.summary,
        timestamp: new Date().toISOString()
      };
      
      addSummary(newSummary);
      
      // Log completion information
      console.log('Summary generated successfully');
    } catch (error) {
      console.error('Error generating summary:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <section className="h-full p-4 flex flex-col">
      <div className="flex justify-between items-center mb-4 flex-shrink-0">
        <h2 className="text-xl font-semibold text-white">Summaries</h2>
        {isGenerating && (
          <div className="flex items-center text-blue-400">
            <svg className="animate-spin -ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Generating summary...</span>
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
