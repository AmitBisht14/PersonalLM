'use client';

import { Copy, Pencil, Trash2 } from 'lucide-react';
import { Prompt } from '@/services/promptService';

interface PromptItemProps {
  prompt: Prompt;
  onCopy: (prompt: string) => void;
  onEdit: (prompt: Prompt) => void;
  onDelete: (promptId: string, promptName: string) => void;
}

export function PromptItem({ prompt, onCopy, onEdit, onDelete }: PromptItemProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-3 hover:bg-gray-700 transition-colors">
      <div className="flex justify-between items-start">
        <h3 className="font-medium text-white">{prompt.name}</h3>
        <div className="flex gap-2">
          <button 
            onClick={() => onCopy(prompt.prompt)}
            className="p-1 hover:bg-gray-600 rounded"
            title="Copy prompt"
          >
            <Copy className="w-4 h-4 text-gray-400 hover:text-white" />
          </button>
          <button 
            onClick={() => onEdit(prompt)}
            className="p-1 hover:bg-gray-600 rounded"
            title="Edit prompt"
          >
            <Pencil className="w-4 h-4 text-gray-400 hover:text-white" />
          </button>
          <button 
            onClick={() => onDelete(prompt.id, prompt.name)}
            className="p-1 hover:bg-gray-600 rounded"
            title="Delete prompt"
          >
            <Trash2 className="w-4 h-4 text-gray-400 hover:text-white" />
          </button>
        </div>
      </div>
      <p className="text-sm text-gray-400 mt-2 line-clamp-3 whitespace-pre-wrap">
        {prompt.prompt}
      </p>
    </div>
  );
}
