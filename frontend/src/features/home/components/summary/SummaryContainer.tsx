'use client';

import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { SummaryItem } from './components/SummaryItem';
import { Chapter } from '@/types/pdf';

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

  const generateSummary = (chaptersToSummarize?: Chapter[]) => {
    // Use passed chapters if available, otherwise fall back to selectedChapters prop
    const chaptersToUse = chaptersToSummarize?.length ? chaptersToSummarize : selectedChapters;
    
    // Log the selected chapter information
    console.log('Selected chapters received in SummaryContainer:', chaptersToUse);
    console.log('Chapter details:');
    chaptersToUse.forEach((chapter, index) => {
      console.log(`Chapter ${index + 1}: ${chapter.title}, Pages: ${chapter.start_page}-${chapter.end_page}`);
    });
    
    // Calculate total pages
    const totalPages = chaptersToUse.reduce((sum, chapter) => {
      return sum + (chapter.end_page - chapter.start_page + 1);
    }, 0);
    console.log(`Total pages selected: ${totalPages}`);
  };

  return (
    <section className="h-full p-4 flex flex-col">
      <div className="flex justify-between items-center mb-4 flex-shrink-0">
        <h2 className="text-xl font-semibold text-white">Summaries</h2>
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
