import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { PDFViewer } from '../PDFViewer';
import { fetchPDFContent } from '@/services/pdfService';
import { Chapter } from '@/types/pdf';

// Mock the service function
jest.mock('@/services/pdfService', () => ({
  fetchPDFContent: jest.fn(),
}));

describe('PDFViewer', () => {
  const mockFile = new File(['dummy content'], 'test.pdf', { type: 'application/pdf' });
  
  const mockChapter: Chapter = {
    title: 'Test Chapter',
    start_page: 1,
    end_page: 3,
    length: 3,
    sections: []
  };
  
  const mockPdfStructure = {
    filename: 'test.pdf',
    total_pages: 10,
    chapters: [mockChapter]
  };
  
  const mockPdfContent = {
    filename: 'test.pdf',
    start_page: 1,
    end_page: 3,
    total_pages: 10,
    pages: [
      {
        page_number: 1,
        text: 'Content for page 1'
      },
      {
        page_number: 2,
        text: 'Content for page 2'
      },
      {
        page_number: 3,
        text: 'Content for page 3'
      }
    ]
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock the service function to return expected value
    (fetchPDFContent as jest.Mock).mockResolvedValue({
      content: mockPdfContent
    });
    
    // Silence console.log and console.error during tests
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  
  afterEach(() => {
    // Restore console mocks
    jest.restoreAllMocks();
  });

  test('renders chapter title', async () => {
    render(
      <PDFViewer 
        pdfFile={mockFile} 
        pdfStructure={mockPdfStructure} 
        selectedChapter={mockChapter} 
      />
    );
    
    expect(screen.getByText('Chapter: Test Chapter')).toBeInTheDocument();
    
    // Wait for all async operations to complete
    await waitFor(() => {
      expect(fetchPDFContent).toHaveBeenCalled();
    });
  });

  test('shows loading state while fetching content', async () => {
    // Mock a delay in the fetch function
    (fetchPDFContent as jest.Mock).mockImplementation(() => {
      return new Promise(resolve => {
        setTimeout(() => resolve({ content: mockPdfContent }), 100);
      });
    });
    
    render(
      <PDFViewer 
        pdfFile={mockFile} 
        pdfStructure={mockPdfStructure} 
        selectedChapter={mockChapter} 
      />
    );
    
    // Check for loading state
    expect(screen.getByText('Loading content...')).toBeInTheDocument();
    
    // Wait for the async operation to complete
    await waitFor(() => {
      expect(fetchPDFContent).toHaveBeenCalled();
    });
  });

  test('displays PDF content after loading', async () => {
    render(
      <PDFViewer 
        pdfFile={mockFile} 
        pdfStructure={mockPdfStructure} 
        selectedChapter={mockChapter} 
      />
    );
    
    // Wait for content to load
    await waitFor(() => {
      expect(screen.getByText('Page 1')).toBeInTheDocument();
    });
    
    // Check that all page content is displayed
    expect(screen.getByText('Content for page 1')).toBeInTheDocument();
    expect(screen.getByText('Content for page 2')).toBeInTheDocument();
    expect(screen.getByText('Content for page 3')).toBeInTheDocument();
  });

  test('handles error during content loading', async () => {
    // Mock an error in the fetch function
    (fetchPDFContent as jest.Mock).mockRejectedValue(new Error('Failed to fetch PDF content'));
    
    render(
      <PDFViewer 
        pdfFile={mockFile} 
        pdfStructure={mockPdfStructure} 
        selectedChapter={mockChapter} 
      />
    );
    
    // Wait for error to be displayed
    await waitFor(() => {
      expect(screen.getByText('Failed to fetch PDF content')).toBeInTheDocument();
    });
  });

  test('resets content when PDF file changes', async () => {
    const { rerender } = render(
      <PDFViewer 
        pdfFile={mockFile} 
        pdfStructure={mockPdfStructure} 
        selectedChapter={mockChapter} 
      />
    );
    
    // Wait for the first render to complete
    await waitFor(() => {
      expect(fetchPDFContent).toHaveBeenCalled();
    });
    
    // Create a new file
    const newFile = new File(['new content'], 'new.pdf', { type: 'application/pdf' });
    
    // Rerender with the new file
    rerender(
      <PDFViewer 
        pdfFile={newFile} 
        pdfStructure={mockPdfStructure} 
        selectedChapter={mockChapter} 
      />
    );
    
    // Wait for the second render to complete
    await waitFor(() => {
      // The fetchPDFContent function should be called again
      expect(fetchPDFContent).toHaveBeenCalledTimes(2);
    });
  });

  test('fetches content when selected chapter changes', async () => {
    const { rerender } = render(
      <PDFViewer 
        pdfFile={mockFile} 
        pdfStructure={mockPdfStructure} 
        selectedChapter={mockChapter} 
      />
    );
    
    // Wait for the first render to complete
    await waitFor(() => {
      expect(fetchPDFContent).toHaveBeenCalled();
    });
    
    // Create a new chapter
    const newChapter: Chapter = {
      title: 'New Chapter',
      start_page: 4,
      end_page: 5,
      length: 2,
      sections: []
    };
    
    // Rerender with the new chapter
    rerender(
      <PDFViewer 
        pdfFile={mockFile} 
        pdfStructure={mockPdfStructure} 
        selectedChapter={newChapter} 
      />
    );
    
    // Wait for the second render to complete
    await waitFor(() => {
      // The fetchPDFContent function should be called again with the new chapter's page range
      expect(fetchPDFContent).toHaveBeenCalledWith(mockFile, 4, 5);
    });
  });
});
