'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { testOpenAIConnection } from '@/utils/api';
import { Toast, ToastType } from '@/components/ui/toast/Toast';

export function TestConnection() {
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ type: ToastType; message: string } | null>(null);

  const handleTest = async () => {
    setIsLoading(true);

    try {
      const result = await testOpenAIConnection();
      setToast({
        type: result.success ? 'success' : 'error',
        message: result.message,
      });
    } catch (error) {
      setToast({
        type: 'error',
        message: 'Failed to test connection',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={handleTest}
        disabled={isLoading}
        className={`px-4 py-2 rounded flex items-center gap-2 transition-colors ${
          isLoading
            ? 'bg-gray-600 cursor-not-allowed'
            : 'bg-gray-700 hover:bg-gray-600'
        } text-gray-200`}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
        Test OpenAI Connection
      </button>

      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}
