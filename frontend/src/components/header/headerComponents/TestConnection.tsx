'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

export function TestConnection() {
  const [isLoading, setIsLoading] = useState(false);

  const testConnection = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/v1/test-openai');
      const data = await response.json();
      
      if (response.ok) {
        toast.success(data.message);
      } else {
        toast.error(data.detail || 'Failed to test OpenAI connection');
      }
    } catch (error) {
      toast.error('Failed to connect to the backend server');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={testConnection}
      disabled={isLoading}
      className={`
        relative inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-600 border-2 border-indigo-600 rounded-lg hover:text-white group hover:bg-indigo-600 transition-colors
        ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      <span className="relative">
        {isLoading ? 'Testing...' : 'Test OpenAI Connection'}
      </span>
    </button>
  );
}
