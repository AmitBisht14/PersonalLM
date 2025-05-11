import { FiPrinter } from 'react-icons/fi';

interface PrintButtonProps {
  onClick: () => void;
  className?: string;
}

/**
 * Reusable print button component with printer icon
 */
export function PrintButton({ onClick, className = '' }: PrintButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors ${className}`}
      title="Print"
    >
      <FiPrinter size={16} />
      <span>Print</span>
    </button>
  );
}
