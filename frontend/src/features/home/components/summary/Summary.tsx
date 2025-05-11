import { useRef } from 'react';
import { PrintButton } from '../../../../components/ui/PrintButton';
import { printContent } from '../../../../services/print/printService';

interface SummaryProps {
  summary: string | null;
}

export function Summary({ summary }: SummaryProps) {
  const summaryRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (!summary) return;
    printContent(summary, 'Generated Summary');
  };

  return (
    <section className="h-full p-4 flex flex-col">
      <div className="flex justify-between items-center mb-4 flex-shrink-0">
        <h2 className="text-xl font-semibold text-white">Summary</h2>
        {summary && <PrintButton onClick={handlePrint} />}
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
        <div className="bg-gray-800 rounded-lg p-4" ref={summaryRef}>
          {summary ? (
            <div className="whitespace-pre-wrap text-gray-100">{summary}</div>
          ) : (
            <div className="text-gray-400">No summary generated yet. Select a chapter and click "Generate Summary".</div>
          )}
        </div>
      </div>
    </section>
  );
}
