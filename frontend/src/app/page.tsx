'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

export default function Home() {
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
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm flex">
        <button
          onClick={testConnection}
          disabled={isLoading}
          className={`
            relative inline-flex items-center px-8 py-3 overflow-hidden text-lg font-medium text-indigo-600 border-2 border-indigo-600 rounded-lg hover:text-white group hover:bg-gray-50
            ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <span className="absolute left-0 block w-full h-0 transition-all bg-indigo-600 opacity-100 group-hover:h-full top-1/2 group-hover:top-0 duration-400 ease"></span>
          <span className="absolute right-0 flex items-center justify-start w-10 h-10 duration-300 transform translate-x-full group-hover:translate-x-0 ease">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </span>
          <span className="relative">
            {isLoading ? 'Testing...' : 'Test OpenAI Connection'}
          </span>
        </button>
      </div>
    </main>
  );
}
