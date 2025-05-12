'use client';

import { useState } from 'react';
import { FileUploadComponent } from './fileupload';
import { ToastType } from '@/components/ui/toast/Toast';
import { Chapter } from '@/types/pdf';
import { FileStructure } from './fileStructure'; // Import FileStructure
import { analyzePdfStructure } from '@/services/pdfStructureService';

interface SelectedPDFType {
  file: File;
  structure: {
    filename: string;
    total_pages: number;
    chapters: Chapter[];
  };
}

interface FileSourceProps {
  onCollapse: () => void;
  isCollapsed: boolean;
  onFileStructure?: (file: File | null, structure: { filename: string; total_pages: number; chapters: Chapter[] } | null) => void;
  selectedPDF: SelectedPDFType | null; // Add selectedPDF prop
  onChapterSelect: (chapters: Chapter[]) => void; // Add onChapterSelect prop
}

export function FileSource({ 
  onCollapse, 
  isCollapsed, 
  onFileStructure, 
  selectedPDF, 
  onChapterSelect 
}: FileSourceProps) {
  const [toast, setToast] = useState<{ type: ToastType; message: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState<Chapter[]>([]);

  const handleFileSelect = async (file: File) => {
    setToast(null);
    setLoading(true);
    try {
      const data = await analyzePdfStructure(file);
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

  const handleTestClick = () => {
    console.log('Test button clicked with selected chapters:', selectedCheckboxes);
    // Add your test functionality here
    setToast({
      type: 'info',
      message: `Test button clicked with ${selectedCheckboxes.length} selected chapter(s)!`,
    });
  };

  const handleMultiSelectChange = (chapters: Chapter[]) => {
    setSelectedCheckboxes(chapters);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header - fixed height */}
      <div className="flex justify-between items-center p-4 border-b border-gray-700 flex-shrink-0">
        <h2 className="text-lg font-semibold text-white">Sources</h2>
        <button 
          onClick={onCollapse} 
          className="p-1.5 hover:bg-gray-700 rounded-md text-gray-400 hover:text-white transition-colors"
          aria-label="Collapse Sources Panel"
        >
          {/* Use the correct icon based on isCollapsed state */}
          {isCollapsed ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6"/>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6"/>
            </svg>
          )}
        </button>
      </div>

      {/* Scrollable content area - takes remaining height */}
      <div className="flex-grow overflow-y-auto p-4">
        {/* Upload component - fixed height */}
        <div className="mb-4">
          <FileUploadComponent
            onFileSelect={handleFileSelect}
            onFileRemove={handleFileRemove}
            loading={loading}
            toast={toast}
            onToastClose={() => setToast(null)}
          />
        </div>
        
        {/* FileStructure - will expand naturally */}
        {selectedPDF && (
          <div>
            <FileStructure 
              structure={selectedPDF.structure}
              onChapterSelect={onChapterSelect}
              onMultiSelectChange={handleMultiSelectChange}
            />
          </div>
        )}
      </div>

      {/* Footer - fixed height */}
      <div className="flex justify-center items-center p-3 border-t border-gray-700 flex-shrink-0 bg-gray-800">
        <button 
          onClick={handleTestClick}
          disabled={selectedCheckboxes.length === 0}
          className={`px-4 py-2 ${selectedCheckboxes.length > 0 ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-600 cursor-not-allowed'} text-white rounded-md transition-colors shadow-sm`}
        >
          Test
        </button>
      </div>
    </div>
  );
}
