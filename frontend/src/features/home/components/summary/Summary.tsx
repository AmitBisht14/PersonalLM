import { useEffect, useState } from 'react';
import { SummaryContainer, SummaryData } from './SummaryContainer';

interface SummaryProps {
  summary: string | null;
}

/**
 * Legacy Summary component that wraps the new SummaryContainer for backward compatibility
 */
export function Summary({ summary }: SummaryProps) {
  const [summaries, setSummaries] = useState<SummaryData[]>([]);
  
  // When summary prop changes, add it as a new summary if it's not null
  useEffect(() => {
    if (summary) {
      const newSummary: SummaryData = {
        id: Date.now().toString(),
        title: 'Generated Summary',
        content: summary,
        timestamp: new Date().toLocaleString(),
      };
      setSummaries([newSummary]);
    }
  }, [summary]);

  return <SummaryContainer initialSummaries={summaries} />;
}
