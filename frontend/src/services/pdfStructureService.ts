import { analyzePdfStructureApi } from '../api/pdfApi';
import { Chapter } from '@/types/pdf';

export interface PdfStructure {
  filename: string;
  total_pages: number;
  chapters: Chapter[];
}

/**
 * Analyzes the structure of a PDF file
 */
export const analyzePdfStructure = async (file: File): Promise<PdfStructure> => {
  try {
    const data = await analyzePdfStructureApi(file);
    return data;
  } catch (error) {
    console.error('Error in PDF structure service:', error);
    throw error;
  }
};
