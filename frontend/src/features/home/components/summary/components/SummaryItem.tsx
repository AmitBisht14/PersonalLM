import { useRef, useState } from 'react';
import { PrintButton } from '@/components/ui/PrintButton';
import { printContent } from '@/services/print/printService';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { RawChapterContent } from '@/services/summaryService';

interface SummaryItemProps {
  chapterContent: RawChapterContent;
  onDelete?: (id: string) => void;
}

export function SummaryItem({ chapterContent, onDelete }: SummaryItemProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    printContent(chapterContent.content, chapterContent.chapter.title);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
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
          <span className="text-xs text-gray-400">{new Date().toLocaleTimeString()}</span>
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
          <div className="whitespace-pre-wrap text-gray-100">{chapterContent.content}</div>
        </div>
      )}
    </div>
  );
}
