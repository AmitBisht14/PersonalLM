import axios from 'axios';
import { PDFContent } from '../types/pdf';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const fetchPDFContent = async (
  file: File,
  startPage: number,
  endPage: number
): Promise<PDFContent> => {
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
      throw new Error(`Failed to fetch PDF content: ${message}`);
    }
    throw error;
  }
};
