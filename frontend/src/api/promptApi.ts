import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface PromptData {
  id: string;
  name: string;
  prompt: string;
}

/**
 * Fetches all prompts from the API
 */
export const fetchPromptsApi = async (): Promise<PromptData[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/v1/prompts`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.detail || error.message;
      throw new Error(`Failed to fetch prompts: ${message}`);
    }
    throw error;
  }
};

/**
 * Creates a new prompt
 */
export const createPromptApi = async (name: string, prompt: string): Promise<PromptData> => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/v1/prompts`,
      { name, prompt },
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.detail || error.message;
      throw new Error(`Failed to create prompt: ${message}`);
    }
    throw error;
  }
};

/**
 * Updates an existing prompt
 */
export const updatePromptApi = async (id: string, name: string, prompt: string): Promise<PromptData> => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/api/v1/prompts/${id}`,
      { name, prompt },
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.detail || error.message;
      throw new Error(`Failed to update prompt: ${message}`);
    }
    throw error;
  }
};

/**
 * Deletes a prompt by ID
 */
export const deletePromptApi = async (id: string): Promise<boolean> => {
  try {
    await axios.delete(`${API_BASE_URL}/api/v1/prompts/${id}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    return true;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.detail || error.message;
      throw new Error(`Failed to delete prompt: ${message}`);
    }
    throw error;
  }
};