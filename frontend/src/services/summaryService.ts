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
 * Generates a summary for a single chapter's content
 */
export const generateSummaryForContent = async (content: string): Promise<string> => {
  try {
    // Fetch the summary prompt template
    const prompts = await fetchPromptsApi();
    const summaryPrompt = prompts.find(p => p.name === 'summary_prompt')?.prompt || 
      'Please summarize the following content:';
    
    // Generate the summary
    const summaryResponse = await requestSummaryGenerationApi(content, summaryPrompt);
    
    return summaryResponse.summary;
  } catch (error) {
    console.error('Error generating summary:', error);
    throw error;
  }
};
