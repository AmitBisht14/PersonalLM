'use client';

import { useState } from 'react';
import { FileUpload } from '@/components/ui/file-upload/FileUpload';
import { Toast, ToastType } from '@/components/ui/toast/Toast';

export function Sources() {
  const [toast, setToast] = useState<{ type: ToastType; message: string } | null>(null);

  const handleFileSelect = async (file: File) => {
    // TODO: Implement file upload to backend
    console.log('Selected file:', file);
    setToast({
      type: 'success',
      message: `File "${file.name}" selected successfully`,
    });
  };

  const handleFileRemove = () => {
    // TODO: Implement file removal logic
    setToast({
      type: 'info',
      message: 'File removed',
    });
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Sources</h2>
      <div className="max-w-xl">
        <FileUpload
          onFileSelect={handleFileSelect}
          onFileRemove={handleFileRemove}
          maxSize={10}
        />
      </div>

      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
