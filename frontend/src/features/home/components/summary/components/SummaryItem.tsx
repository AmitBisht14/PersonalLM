import { useRef, useState, useEffect, useCallback } from 'react';
import { PrintButton } from '@/components/ui/PrintButton';
import { printContent } from '@/services/print/printService';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { RawChapterContent, generateSummaryForContent } from '@/services/summaryService';

interface SummaryItemProps {
  chapterContent: RawChapterContent;
  onDelete?: (id: string) => void;
  summaryPrompt: string | null;
  isPromptLoading: boolean;
}

export function SummaryItem({ chapterContent, onDelete, summaryPrompt, isPromptLoading }: SummaryItemProps) {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [summary, setSummary] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const hasStartedGeneration = useRef(false);
  const summaryRef = useRef<HTMLDivElement>(null);
  
  // Define the generate summary function with useCallback to ensure stability
  const generateSummary = useCallback(async () => {
    // Skip if we already have a summary, are already loading, have started generation, or don't have the prompt yet
    if (summary || isLoading || hasStartedGeneration.current || !summaryPrompt || isPromptLoading) return;
    
    // Mark that we've started generation to prevent duplicate calls
    hasStartedGeneration.current = true;
    console.log('Starting summary generation for:', chapterContent.chapter.title);
    
    try {
      // Set loading state first
      setIsLoading(true);
      setError('');
      
      // Generate the summary using the prompt passed from parent
      const generatedSummary = await generateSummaryForContent(chapterContent.content, summaryPrompt);
      console.log('Summary generated successfully:', generatedSummary.substring(0, 50) + '...');
      
      // Update summary first, then set loading to false
      setSummary(generatedSummary);
      // Auto-expand when summary is ready
      setIsCollapsed(false);
      console.log('Summary set and item expanded');
    } catch (err) {
      console.error('Error generating summary:', err);
      setError('Failed to generate summary. Please try again.');
      // Reset the flag so we can try again
      hasStartedGeneration.current = false;
    } finally {
      // Ensure loading state is updated last
      setIsLoading(false);
      console.log('Loading state set to false');
    }
  }, [chapterContent.chapter.title, chapterContent.content, isLoading, isPromptLoading, setIsCollapsed, setIsLoading, setSummary, setError, summary, summaryPrompt]);
  
  // Effect to trigger summary generation when component mounts or dependencies change
  useEffect(() => {
    // Only generate summary if we have the necessary data and haven't already generated it
    if (!summary && !isLoading && !hasStartedGeneration.current && summaryPrompt && !isPromptLoading) {
      generateSummary();
    }
    
    // No cleanup needed as we're using useCallback for the function
  }, [generateSummary, summary, isLoading, summaryPrompt, isPromptLoading]);

  const handlePrint = () => {
    // If summary is available, print that; otherwise print raw content
    const contentToPrint = summary || chapterContent.content;
    printContent(contentToPrint, chapterContent.chapter.title);
  };

  const toggleCollapse = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    console.log('Item collapsed state toggled to:', newCollapsedState ? 'collapsed' : 'expanded');
  };

  return (
    <div className="bg-gray-800 rounded-lg mb-4 overflow-hidden">
      {/* Header with title and actions */}
      <div className="flex justify-between items-center p-3 bg-gray-700 cursor-pointer" onClick={toggleCollapse}>
        <div className="flex items-center gap-2">
          {isCollapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
          <h3 className="font-medium text-white">{chapterContent.chapter.title}</h3>
          <span className="text-xs text-gray-300 ml-2">
            Pages {chapterContent.chapter.start_page} - {chapterContent.chapter.end_page}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs ${isLoading ? 'text-yellow-400' : summary ? 'text-green-400' : 'text-gray-400'}`}>
            {isLoading ? 'Summary Generating...' : summary ? 'Summary Generated' : 'Raw Content'}
          </span>

          <button
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              handlePrint();
            }}
            className="flex items-center gap-1 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            title="Print"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 6 2 18 2 18 9"></polyline>
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
              <rect x="6" y="14" width="12" height="8"></rect>
            </svg>
          </button>
          {onDelete && (
            <button 
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                // Prevent event bubbling and prevent summary regeneration
                e.preventDefault();
                // Use the chapter title as an identifier since Chapter doesn't have an id property
                onDelete(chapterContent.chapter.title);
              }}
              className="text-red-400 hover:text-red-300 p-1 rounded-full hover:bg-gray-600"
              aria-label="Delete summary"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18"></path>
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
              </svg>
            </button>
          )}
        </div>
      </div>
      
      {/* Content area - collapsible */}
      {!isCollapsed && (
        <div className="p-4" ref={summaryRef}>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-6">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
              <p className="text-gray-400">Generating summary...</p>
            </div>
          ) : error ? (
            <div className="text-red-400 py-4">{error}</div>
          ) : summary ? (
            <div className="whitespace-pre-wrap text-gray-100">
              <h4 className="text-lg font-medium text-blue-400 mb-2">Summary</h4>
              {summary}
            </div>
          ) : (
            <div className="whitespace-pre-wrap text-gray-100">{chapterContent.content}</div>
          )}
        </div>
      )}
    </div>
  );
}
