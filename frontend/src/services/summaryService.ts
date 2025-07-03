import { Chapter } from '@/types/pdf';
import { fetchRawPDFContent } from '@/api/pdfApi';
import { requestSummaryGenerationApi } from '@/api/summaryApi';
import { fetchPromptsApi } from '@/api/promptApi';

/**
 * Represents raw content for a chapter
 */
export interface RawChapterContent {
  chapter: Chapter;
  content: string;
}

/**
 * Fetches raw PDF content for a single chapter
 */
const fetchRawChapterContent = async (chapter: Chapter, file: File): Promise<string> => {
  try {
    const rawContent = await fetchRawPDFContent(
      file,
      chapter.start_page,
      chapter.end_page
    );
    return rawContent.text;
  } catch (error) {
    console.error(`Error fetching content for chapter "${chapter.title}":`, error);
    throw error;
  }
};

/**
 * Fetches raw PDF content for all selected chapters sequentially and returns an array
 * of chapter content objects
 */
const fetchAllChaptersRawContent = async (chapters: Chapter[], file: File): Promise<RawChapterContent[]> => {
  const chapterContents = [];
  
  // Process chapters sequentially
  for (const chapter of chapters) {
    const chapterContent = await fetchRawChapterContent(chapter, file);
    chapterContents.push({
      chapter,
      content: chapterContent
    });
  }
  return chapterContents;
};

/**
 * Fetches content for all provided chapters and returns them as an array
 * without generating a summary
 */
export const fetchRawChapterContents = async (chapters: Chapter[], file: File) => {
  try {
    const chapterContents = await fetchAllChaptersRawContent(chapters, file);
    return chapterContents;
  } catch (error) {
    console.error('Error fetching chapter contents:', error);
    throw error;
  }
};

/**
 * Fetches the summary prompt template
 */
export const fetchSummaryPrompt = async (): Promise<string> => {
  try {
    const prompts = await fetchPromptsApi();
    const summaryPrompt = prompts.find(p => p.name === 'Generate Summary')?.prompt || 
      'Generate Script';
    return summaryPrompt;
  } catch (error) {
    console.error('Error fetching summary prompt:', error);
    throw error;
  }
};

/**
 * Handles fetching chapter contents for a list of chapters from a PDF file
 * This function encapsulates the business logic previously in the SummaryContainer component
 */
export const fetchAndProcessChapterContents = async (chapters: Chapter[], pdfFile: File): Promise<RawChapterContent[]> => {
  try {
    if (!chapters.length || !pdfFile) {
      console.error('No chapters selected or PDF file not available for content fetching');
      return [];
    }
    
    console.log('Processing chapters in service:', chapters);
    
    // Fetch raw content for all selected chapters
    const contents = await fetchRawChapterContents(chapters, pdfFile);
    console.log(`Fetched content for ${contents.length} chapters`);
    
    return contents;
  } catch (error) {
    console.error('Error in fetchAndProcessChapterContents:', error);
    throw error;
  }
};

/**
 * Loads the summary prompt and handles loading state
 * Returns both the prompt and loading state
 */
export const loadSummaryPromptWithState = async (currentPrompt: string | null): Promise<{ prompt: string | null, isLoading: boolean }> => {
  // Skip if we already have the prompt
  if (currentPrompt) return { prompt: currentPrompt, isLoading: false };
  
  try {
    const prompt = await fetchSummaryPrompt();
    return { prompt, isLoading: false };
  } catch (error) {
    console.error('Error loading summary prompt:', error);
    return { prompt: null, isLoading: false };
  }
};

/**
 * Generates a summary for a single chapter's content
 * @param content The content to summarize
 * @param prompt Optional prompt to use for summarization. If not provided, will fetch the prompt.
 */
export const generateSummaryForContent = async (content: string, prompt?: string): Promise<string> => {
  try {
    // Use provided prompt or fetch it if not provided
    const summaryPrompt = prompt || await fetchSummaryPrompt();
    
    // Generate the summary
    const summaryResponse = await requestSummaryGenerationApi(content, summaryPrompt);
    
    return summaryResponse.summary;
  } catch (error) {
    console.error('Error generating summary:', error);
    throw error;
  }
};
