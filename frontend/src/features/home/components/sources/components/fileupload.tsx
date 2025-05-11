import { useState } from 'react';
import { FileUpload as CoreFileUpload } from '@/components/ui/file-upload/FileUpload';
import { Toast, ToastType } from '@/components/ui/toast/Toast';
import { X } from 'lucide-react';

interface FileUploadComponentProps {
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
  loading: boolean;
  toast: { type: ToastType; message: string } | null;
  onToastClose: () => void;
}

export function FileUploadComponent({ onFileSelect, onFileRemove, loading, toast, onToastClose }: FileUploadComponentProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleSelect = (file: File) => {
    setSelectedFile(file);
    onFileSelect(file);
  };

  const handleRemove = () => {
    setSelectedFile(null);
    onFileRemove();
  };

  return (
    <div className="max-w-xl text-sm">
      {!selectedFile ? (
        <CoreFileUpload
          onFileSelect={handleSelect}
          onFileRemove={handleRemove}
        />
      ) : (
        <div className="flex items-center gap-3 bg-gray-800 rounded p-3 mt-2">
          <span className="text-green-400 font-mono truncate max-w-xs text-xs">{selectedFile.name}</span>
          <button
            onClick={handleRemove}
            className="p-1 hover:bg-gray-700 rounded-full"
            title="Remove file"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      )}
      {loading && <div className="mt-4 text-blue-400 text-xs">Analyzing PDF...</div>}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={onToastClose}
        />
      )}
    </div>
  );
}
