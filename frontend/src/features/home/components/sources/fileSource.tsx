'use client';

import { useState } from 'react';
import { FileUploadComponent } from './components/fileupload';
import { ToastType } from '@/components/ui/toast/Toast';
import { Chapter } from '@/types/pdf';
import { FileStructure } from './components/fileStructure';
import { GenerateSummary } from './components/GenerateSummary';
import { analyzePdfStructure } from '@/services/pdfStructureService';
import { Sidebar } from '@/components/ui/sidebar/Sidebar';
import { SidebarContent, SidebarSection, SidebarFooter } from '@/components/ui/sidebar/SidebarContent';

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
  selectedPDF: SelectedPDFType | null;
  onChapterSelect: (chapters: Chapter[]) => void;
  onGenerateSummary?: (chapters: Chapter[]) => void;
}

export function FileSource({ 
  onCollapse, 
  isCollapsed, 
  onFileStructure, 
  selectedPDF, 
  onChapterSelect,
  onGenerateSummary
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
    if (selectedCheckboxes.length > 0 && onGenerateSummary) {
      onGenerateSummary(selectedCheckboxes);
    }
  };

  const handleMultiSelectChange = (chapters: Chapter[]) => {
    setSelectedCheckboxes(chapters);
  };

  return (
    <Sidebar
      isOpen={!isCollapsed}
      onToggle={onCollapse}
      title="Sources"
    >
      <SidebarContent>
        <SidebarSection title="Upload PDF">
          <FileUploadComponent
            onFileSelect={handleFileSelect}
            onFileRemove={handleFileRemove}
            loading={loading}
            toast={toast}
            onToastClose={() => setToast(null)}
          />
        </SidebarSection>
        
        {selectedPDF && (
          <SidebarSection>
            <FileStructure 
              structure={selectedPDF.structure}
              onChapterSelect={onChapterSelect}
              onMultiSelectChange={handleMultiSelectChange}
            />
          </SidebarSection>
        )}
      </SidebarContent>

      <SidebarFooter>
        <GenerateSummary 
          selectedChapters={selectedCheckboxes}
          onTestClick={handleTestClick}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
