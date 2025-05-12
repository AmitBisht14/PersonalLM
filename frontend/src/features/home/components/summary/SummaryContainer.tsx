'use client';

import { useState, useEffect } from 'react';
import { SummaryItem } from './SummaryItem';

export interface SummaryData {
  id: string;
  title: string;
  content: string;
  timestamp: string;
}

interface SummaryContainerProps {
  initialSummaries?: SummaryData[];
}

export function SummaryContainer({ initialSummaries = [] }: SummaryContainerProps) {
  const [summaries, setSummaries] = useState<SummaryData[]>(initialSummaries);

  // Update summaries when initialSummaries prop changes
  useEffect(() => {
    setSummaries(initialSummaries);
  }, [initialSummaries]);

  const handleDeleteSummary = (id: string) => {
    setSummaries(prevSummaries => prevSummaries.filter(summary => summary.id !== id));
  };

  const addSummary = (newSummary: SummaryData) => {
    setSummaries(prevSummaries => [newSummary, ...prevSummaries]);
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
}
