'use client';

import { useState } from 'react';
import { PDFSource } from './PDFSource';
import { PDFStructure } from './PDFStructure';
import { ToastType } from '@/components/ui/toast/Toast';

interface SourcesProps {
  onCollapse: () => void;
  isCollapsed: boolean;
}

interface Section {
  title: string;
  page_number: number;
}

interface Chapter {
  title: string;
  start_page: number;
  end_page: number;
  length: number;
  sections: Section[];
}

interface PDFStructureType {
  filename: string;
  total_pages: number;
  chapters: Chapter[];
}

export function Sources({ onCollapse, isCollapsed }: SourcesProps) {
  const [toast, setToast] = useState<{ type: ToastType; message: string } | null>(null);
  const [pdfStructure, setPdfStructure] = useState<PDFStructureType | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileSelect = async (file: File) => {
    setToast(null);
    setLoading(true);
    setPdfStructure(null);
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
      setPdfStructure(data);
      setToast({ type: 'success', message: `PDF analyzed successfully: ${data.filename}` });
    } catch (err: any) {
      setToast({ type: 'error', message: err.message || 'Error analyzing PDF' });
    } finally {
      setLoading(false);
    }
  };

  const handleFileRemove = () => {
    setPdfStructure(null);
    setToast({
      type: 'info',
      message: 'File removed',
    });
  };

  return (
    <section className="h-full flex flex-col p-4 text-sm overflow-hidden min-h-0">
      <h2 className="text-lg font-semibold mb-4 text-white">Sources</h2>
      <PDFSource
        onFileSelect={handleFileSelect}
        onFileRemove={handleFileRemove}
        loading={loading}
        toast={toast}
        onToastClose={() => setToast(null)}
      />
      {pdfStructure && (
        <div className="flex-1 min-h-0">
          <PDFStructure structure={pdfStructure} />
        </div>
      )}
    </section>
  );
}
