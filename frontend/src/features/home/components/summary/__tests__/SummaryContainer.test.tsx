import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SummaryContainer, SummaryContainerHandle } from '../SummaryContainer';
import { 
  fetchAndProcessChapterContents, 
  loadSummaryPromptWithState 
} from '@/services/summaryService';
import { Chapter } from '@/types/pdf';

// Mock the service functions
jest.mock('@/services/summaryService', () => ({
  fetchAndProcessChapterContents: jest.fn(),
  loadSummaryPromptWithState: jest.fn(),
}));

// Mock the SummaryItem component
jest.mock('../components/SummaryItem', () => ({
  SummaryItem: ({ chapterContent, onDelete }: { 
    chapterContent: any; 
    onDelete: (title: string) => void;
    summaryPrompt: string | null;
    isPromptLoading: boolean;
  }) => (
    <div data-testid="summary-item" data-title={chapterContent.chapter.title}>
      <h3>{chapterContent.chapter.title}</h3>
      <button 
        data-testid={`delete-${chapterContent.chapter.title}`} 
        onClick={() => onDelete(chapterContent.chapter.title)}
      >
        Delete
      </button>
    </div>
  ),
}));

describe('SummaryContainer', () => {
  const mockChapters: Chapter[] = [
    {
      title: 'Chapter 1',
      start_page: 1,
      end_page: 10,
      length: 10,
      sections: []
    },
    {
      title: 'Chapter 2',
      start_page: 11,
      end_page: 20,
      length: 10,
      sections: []
    }
  ];

  const mockFile = new File(['dummy content'], 'test.pdf', { type: 'application/pdf' });
  
  const mockChapterContents = [
    {
      chapter: mockChapters[0],
      content: 'Content for Chapter 1'
    },
    {
      chapter: mockChapters[1],
      content: 'Content for Chapter 2'
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock the service functions to return expected values
    (fetchAndProcessChapterContents as jest.Mock).mockResolvedValue(mockChapterContents);
    (loadSummaryPromptWithState as jest.Mock).mockResolvedValue({ 
      prompt: 'Test summary prompt', 
      isLoading: false 
    });
  });

  test('renders empty state when no chapter contents are available', async () => {
    await act(async () => {
      render(<SummaryContainer />);
    });
    
    expect(screen.getByText('Summaries')).toBeInTheDocument();
    expect(screen.getByText('No chapter contents fetched yet. Select chapters and click "Generate Summary".')).toBeInTheDocument();
  });

  test('loads summary prompt on mount', async () => {
    await act(async () => {
      render(<SummaryContainer />);
    });
    
    expect(loadSummaryPromptWithState).toHaveBeenCalled();
  });

  test('fetches chapter contents when fetchChapterContents is called', async () => {
    const containerRef = React.createRef<SummaryContainerHandle>();
    
    await act(async () => {
      render(
        <SummaryContainer 
          ref={containerRef} 
          pdfFile={mockFile} 
          selectedChapters={mockChapters} 
        />
      );
    });
    
    // Call the exposed method within act
    await act(async () => {
      await containerRef.current?.fetchChapterContents(mockChapters);
    });
    
    // Check that the service function was called with the right arguments
    expect(fetchAndProcessChapterContents).toHaveBeenCalledWith(mockChapters, mockFile);
    
    // After fetch completes, the chapter items should be rendered
    expect(screen.getByText('Chapter 1')).toBeInTheDocument();
    expect(screen.getByText('Chapter 2')).toBeInTheDocument();
  });

  test('deletes a chapter when delete button is clicked', async () => {
    const user = userEvent.setup();
    const containerRef = React.createRef<SummaryContainerHandle>();
    
    await act(async () => {
      render(
        <SummaryContainer 
          ref={containerRef} 
          pdfFile={mockFile} 
          selectedChapters={mockChapters} 
        />
      );
    });
    
    // First fetch the chapter contents
    await act(async () => {
      await containerRef.current?.fetchChapterContents(mockChapters);
    });
    
    // Verify items are rendered
    expect(screen.getByText('Chapter 1')).toBeInTheDocument();
    expect(screen.getByText('Chapter 2')).toBeInTheDocument();
    
    // Click the delete button for Chapter 1
    await act(async () => {
      await user.click(screen.getByTestId('delete-Chapter 1'));
    });
    
    // Chapter 1 should be removed, but Chapter 2 should still be there
    expect(screen.queryByText('Chapter 1')).not.toBeInTheDocument();
    expect(screen.getByText('Chapter 2')).toBeInTheDocument();
  });

  test('does not fetch chapter contents when no PDF file is available', async () => {
    const containerRef = React.createRef<SummaryContainerHandle>();
    
    await act(async () => {
      render(
        <SummaryContainer 
          ref={containerRef} 
          selectedChapters={mockChapters} 
        />
      );
    });
    
    // Call the exposed method
    await act(async () => {
      await containerRef.current?.fetchChapterContents(mockChapters);
    });
    
    // The service function should not be called
    expect(fetchAndProcessChapterContents).not.toHaveBeenCalled();
    
    // The empty state message should still be shown
    expect(screen.getByText('No chapter contents fetched yet. Select chapters and click "Generate Summary".')).toBeInTheDocument();
  });

  test('does not fetch chapter contents when no chapters are selected', async () => {
    const containerRef = React.createRef<SummaryContainerHandle>();
    
    await act(async () => {
      render(
        <SummaryContainer 
          ref={containerRef} 
          pdfFile={mockFile} 
        />
      );
    });
    
    // Call the exposed method with empty array
    await act(async () => {
      await containerRef.current?.fetchChapterContents([]);
    });
    
    // The service function should not be called
    expect(fetchAndProcessChapterContents).not.toHaveBeenCalled();
  });

  test('handles error during chapter content fetching', async () => {
    const containerRef = React.createRef<SummaryContainerHandle>();
    
    // Mock an error in the service function
    (fetchAndProcessChapterContents as jest.Mock).mockRejectedValue(new Error('Failed to fetch chapter contents'));
    
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    await act(async () => {
      render(
        <SummaryContainer 
          ref={containerRef} 
          pdfFile={mockFile} 
          selectedChapters={mockChapters} 
        />
      );
    });
    
    // Call the exposed method
    await act(async () => {
      await containerRef.current?.fetchChapterContents(mockChapters);
    });
    
    // Check that the error was logged
    expect(consoleSpy).toHaveBeenCalledWith(
      'Error fetching chapter contents:',
      expect.any(Error)
    );
    
    // The loading state should be reset
    expect(screen.queryByText('Generating summary...')).not.toBeInTheDocument();
    
    consoleSpy.mockRestore();
  });
});
