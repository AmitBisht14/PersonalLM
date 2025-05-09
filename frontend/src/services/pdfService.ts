import axios from 'axios';
import { PDFContent } from '../types/pdf';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const fetchPDFContent = async (
  file: File,
  startPage: number,
  endPage: number
): Promise<{ content: PDFContent; rawContent: string }> => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    // Make both requests simultaneously
    const [contentResponse, rawContentResponse] = await Promise.all([
      axios.post(
        `${API_BASE_URL}/pdf/content?start_page=${startPage}&end_page=${endPage}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      ),
      axios.post(
        `${API_BASE_URL}/pdf/content-raw?start_page=${startPage}&end_page=${endPage}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )
    ]);

    return {
      content: contentResponse.data,
      rawContent: rawContentResponse.data.text
    };
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.detail || error.message;
      throw new Error(`Failed to fetch PDF content: ${message}`);
    }
    throw error;
  }
};

export const fetchSummaryPrompt = async (): Promise<{ prompt: string }> => {
  try {
    // First try to get all prompts
    const response = await axios.get(`${API_BASE_URL}/api/v1/prompts`);
    
    // Find the prompt with name "Generate Summary"
    const summaryPrompt = response.data.find((p: any) => p.name === "Generate Summary");
    
    if (!summaryPrompt) {
      throw new Error("Summary prompt not found");
    }
    
    // Return the prompt content
    return { prompt: summaryPrompt.prompt };
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.detail || error.message;
      throw new Error(`Failed to fetch summary prompt: ${message}`);
    }
    throw error;
  }
};

export const generateSummary = async (text: string, prompt: string): Promise<string> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/v1/summary`, {
      text,
      prompt
    });
    return response.data.summary;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.detail || error.message;
      throw new Error(`Failed to generate summary: ${message}`);
    }
    throw error;
  }
};
