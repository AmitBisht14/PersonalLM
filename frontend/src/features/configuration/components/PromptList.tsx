'use client';

import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { fetchPrompts, Prompt } from '@/services/promptService';
import { PromptItem } from './PromptItem';
import { AddPromptModal } from './AddPromptModal';

interface PromptListProps {
  onSettingChange?: (setting: string, value: boolean) => void;
}

export function PromptList({ onSettingChange }: PromptListProps) {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    const loadPrompts = async () => {
      setLoading(true);
      try {
        const data = await fetchPrompts();
        setPrompts(data);
        setError(null);
      } catch (err) {
        setError('Failed to load prompts');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadPrompts();
  }, []);

  const handleCopyPrompt = (prompt: string) => {
    navigator.clipboard.writeText(prompt);
    // Could add a toast notification here
  };

  const handleEditPrompt = (prompt: Prompt) => {
    // To be implemented
    console.log('Edit prompt:', prompt);
  };

  const handleDeletePrompt = (promptName: string) => {
    // To be implemented
    console.log('Delete prompt:', promptName);
  };

  const handlePromptAdded = (newPrompt: Prompt) => {
    setPrompts([...prompts, newPrompt]);
  };

  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-blue-500">Loading prompts...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Saved Prompts</h2>
        <button
          className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors"
          onClick={handleOpenAddModal}
        >
          <Plus className="w-4 h-4" />
          Add New
        </button>
      </div>

      {prompts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No prompts found. Create your first prompt to get started.
        </div>
      ) : (
        <div className="space-y-3">
          {prompts.map((prompt) => (
            <PromptItem
              key={prompt.name}
              prompt={prompt}
              onCopy={handleCopyPrompt}
              onEdit={handleEditPrompt}
              onDelete={handleDeletePrompt}
            />
          ))}
        </div>
      )}

      {/* Add New Prompt Modal */}
      <AddPromptModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onPromptAdded={handlePromptAdded}
      />
    </div>
  );
}
