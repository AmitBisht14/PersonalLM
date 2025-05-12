import { PDFContent } from '../types/pdf';
import { 
  fetchFormattedPDFContent, 
  fetchRawPDFContent,
  fetchSummaryPromptTemplate,
  requestSummaryGeneration
} from '../api/pdfApi';

/**
 * Fetches both formatted and raw content from a PDF for the specified page range
 */
export const fetchPDFContent = async (
  file: File,
  startPage: number,
  endPage: number
): Promise<{ content: PDFContent; rawContent: string }> => {
  try {
    // Make both requests simultaneously
    const [content, rawContentResponse] = await Promise.all([
      fetchFormattedPDFContent(file, startPage, endPage),
      fetchRawPDFContent(file, startPage, endPage)
    ]);

    return {
      content,
      rawContent: rawContentResponse.text
    };
  } catch (error) {
    // Re-throw the error - it's already been handled by the API layer
    throw error;
  }
};

/**
 * Fetches the summary prompt template
 */
export const fetchSummaryPrompt = async (): Promise<{ prompt: string }> => {
  try {
    const summaryPrompt = await fetchSummaryPromptTemplate();
    return { prompt: summaryPrompt.prompt };
  } catch (error) {
    // Re-throw the error - it's already been handled by the API layer
    throw error;
  }
};

/**
 * Generates a summary of the provided text using the specified prompt
 */
export const generateSummary = async (text: string, prompt: string): Promise<string> => {
  try {
    const result = await requestSummaryGeneration(text, prompt);
    return result.summary;
  } catch (error) {
    // Re-throw the error - it's already been handled by the API layer
    throw error;
  }
};