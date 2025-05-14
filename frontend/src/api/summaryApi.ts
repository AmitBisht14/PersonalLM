import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Sends a request to generate a summary based on text and prompt
 */
export const requestSummaryGenerationApi = async (text: string, prompt: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/v1/summary`, {
      text,
      prompt
    });
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.detail || error.message;
      throw new Error(`Failed to generate summary: ${message}`);
    }
    throw error;
  }
};
