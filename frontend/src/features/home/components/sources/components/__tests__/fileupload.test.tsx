import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FileUploadComponent } from '../fileupload';
import '@testing-library/jest-dom';

// Mock the CoreFileUpload component
jest.mock('@/components/ui/file-upload/FileUpload', () => ({
  FileUpload: ({ onFileSelect, onFileRemove }: { onFileSelect: (file: File) => void; onFileRemove: () => void }) => (
    <div data-testid="mock-file-upload">
      <button data-testid="select-file-button" onClick={() => onFileSelect(new File(['test'], 'test.pdf', { type: 'application/pdf' }))}>
        Select File
      </button>
      <button data-testid="remove-file-button" onClick={onFileRemove}>
        Remove File
      </button>
    </div>
  ),
}));

// Mock the Toast component
jest.mock('@/components/ui/toast/Toast', () => ({
  Toast: ({ type, message, onClose }: { type: string; message: string; onClose: () => void }) => (
    <div data-testid="mock-toast" data-type={type} data-message={message}>
      {message}
      <button data-testid="close-toast-button" onClick={onClose}>
        Close
      </button>
    </div>
  ),
  ToastType: {
    SUCCESS: 'success',
    ERROR: 'error',
    INFO: 'info',
  },
}));

describe('FileUploadComponent', () => {
  const mockProps = {
    onFileSelect: jest.fn(),
    onFileRemove: jest.fn(),
    loading: false,
    toast: null,
    onToastClose: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders file upload when no file is selected', () => {
    render(<FileUploadComponent {...mockProps} />);
    
    expect(screen.getByTestId('mock-file-upload')).toBeInTheDocument();
    expect(screen.getByTestId('select-file-button')).toBeInTheDocument();
  });

  test('displays selected file when a file is selected', async () => {
    const user = userEvent.setup();
    render(<FileUploadComponent {...mockProps} />);
    
    await user.click(screen.getByTestId('select-file-button'));
    
    expect(mockProps.onFileSelect).toHaveBeenCalled();
    expect(screen.getByText('test.pdf')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /remove/i })).toBeInTheDocument();
  });

  test('removes file when remove button is clicked', async () => {
    const user = userEvent.setup();
    render(<FileUploadComponent {...mockProps} />);
    
    // First select a file
    await user.click(screen.getByTestId('select-file-button'));
    
    // Then remove it
    await user.click(screen.getByRole('button', { name: /remove/i }));
    
    expect(mockProps.onFileRemove).toHaveBeenCalled();
    expect(screen.getByTestId('mock-file-upload')).toBeInTheDocument();
  });

  test('displays loading indicator when loading prop is true', () => {
    render(<FileUploadComponent {...mockProps} loading={true} />);
    
    expect(screen.getByText('Analyzing PDF...')).toBeInTheDocument();
  });

  test('displays toast when toast prop is provided', () => {
    // Cast the toast type to satisfy TypeScript
    const toastProps = {
      ...mockProps,
      toast: { type: 'error' as const, message: 'Error uploading file' },
    };
    
    render(<FileUploadComponent {...toastProps} />);
    
    expect(screen.getByTestId('mock-toast')).toBeInTheDocument();
    expect(screen.getByText('Error uploading file')).toBeInTheDocument();
  });

  test('calls onToastClose when toast close button is clicked', async () => {
    const user = userEvent.setup();
    const toastProps = {
      ...mockProps,
      toast: { type: 'error' as const, message: 'Error uploading file' },
    };
    
    render(<FileUploadComponent {...toastProps} />);
    
    await user.click(screen.getByTestId('close-toast-button'));
    
    expect(mockProps.onToastClose).toHaveBeenCalled();
  });
});
