import { PDFContent } from '../types/pdf';
import { fetchFormattedPDFContent } from '../api/pdfApi';

/**
 * Fetches formatted content from a PDF for the specified page range
 */
export const fetchPDFContent = async (
  file: File,
  startPage: number,
  endPage: number
): Promise<{ content: PDFContent }> => {
  try {
    // Fetch only the formatted content
    const content = await fetchFormattedPDFContent(file, startPage, endPage);

    return { content };
  } catch (error) {
    // Re-throw the error - it's already been handled by the API layer
    throw error;
  }
};