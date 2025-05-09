'use client';

import { useState } from 'react';
import { PDFSource } from './fileupload';
import { ToastType } from '@/components/ui/toast/Toast';
import { Chapter } from '@/types/pdf';

interface FileSourceProps {
  onCollapse: () => void;
  isCollapsed: boolean;
  onFileStructure?: (file: File | null, structure: { filename: string; total_pages: number; chapters: Chapter[] } | null) => void;
}

export function FileSource({ onCollapse, isCollapsed, onFileStructure }: FileSourceProps) {
  const [toast, setToast] = useState<{ type: ToastType; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileSelect = async (file: File) => {
    setToast(null);
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/pdf/analyze/structure`, {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) {
        throw new Error('Failed to analyze PDF');
      }
      const data = await res.json();
      console.log('Received structure:', data);
      if (onFileStructure) {
        onFileStructure(file, data);
      }
      setToast({ type: 'success', message: `PDF analyzed successfully: ${data.filename}` });
    } catch (err: any) {
      console.error('Error analyzing PDF:', err);
      setToast({ type: 'error', message: err.message || 'Error analyzing PDF' });
      if (onFileStructure) {
        onFileStructure(null, null);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFileRemove = () => {
    if (onFileStructure) {
      onFileStructure(null, null);
    }
    setToast({
      type: 'info',
      message: 'File removed',
    });
  };

  return (
    <div className="flex flex-col min-h-0">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4 text-white">Sources</h2>
        <PDFSource
          onFileSelect={handleFileSelect}
          onFileRemove={handleFileRemove}
          loading={loading}
          toast={toast}
          onToastClose={() => setToast(null)}
        />
      </div>
    </div>
  );
}
