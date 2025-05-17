import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Fetches formatted PDF content for the specified page range
 */
export const fetchFormattedPDFContent = async (
  file: File,
  startPage: number,
  endPage: number
) => {
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    const response = await axios.post(
      `${API_BASE_URL}/pdf/content?start_page=${startPage}&end_page=${endPage}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.detail || error.message;
      throw new Error(`Failed to fetch formatted PDF content: ${message}`);
    }
    throw error;
  }
};

/**
 * Fetches raw text content from PDF for the specified page range
 */
export const fetchRawPDFContent = async (
  file: File,
  startPage: number,
  endPage: number
) => {
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    const response = await axios.post(
      `${API_BASE_URL}/pdf/content-raw?start_page=${startPage}&end_page=${endPage}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.detail || error.message;
      throw new Error(`Failed to fetch raw PDF content: ${message}`);
    }
    throw error;
  }
};

/**
 * Analyzes the structure of a PDF file
 */
export const analyzePdfStructureApi = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    const response = await axios.post(
      `${API_BASE_URL}/pdf/analyze/structure`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.detail || error.message;
      throw new Error(`Failed to analyze PDF structure: ${message}`);
    }
    throw error;
  }
};