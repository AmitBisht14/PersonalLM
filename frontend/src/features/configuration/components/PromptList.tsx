'use client';

import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { fetchPrompts, deletePrompt, Prompt } from '@/services/promptService';
import { PromptItem } from './PromptItem';
import { AddPromptModal } from './AddPromptModal';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';

interface PromptListProps {
  onSettingChange?: (setting: string, value: boolean) => void;
}

export function PromptList({ onSettingChange }: PromptListProps) {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [promptToDelete, setPromptToDelete] = useState<{id: string; name: string} | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [promptToEdit, setPromptToEdit] = useState<Prompt | null>(null);

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
    setPromptToEdit(prompt);
    setIsEditMode(true);
    setIsAddModalOpen(true);
  };

  const handleDeletePrompt = (promptId: string, promptName: string) => {
    setPromptToDelete({ id: promptId, name: promptName });
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!promptToDelete) return;
    
    setIsDeleting(true);
    try {
      const success = await deletePrompt(promptToDelete.id);
      if (success) {
        // Remove the deleted prompt from the list
        setPrompts(prompts.filter(p => p.id !== promptToDelete.id));
        setIsDeleteModalOpen(false);
        setPromptToDelete(null);
      } else {
        // Handle error
        console.error('Failed to delete prompt');
      }
    } catch (err) {
      console.error('Error deleting prompt:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setPromptToDelete(null);
  };

  const handlePromptAdded = (newPrompt: Prompt) => {
    setPrompts([...prompts, newPrompt]);
  };

  const handlePromptUpdated = (updatedPrompt: Prompt) => {
    // Update the prompt in the list
    setPrompts(prompts.map(p => p.id === updatedPrompt.id ? updatedPrompt : p));
  };

  const handleOpenAddModal = () => {
    setIsEditMode(false);
    setPromptToEdit(null);
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    setIsEditMode(false);
    setPromptToEdit(null);
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

      {/* Add/Edit Prompt Modal */}
      <AddPromptModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onPromptAdded={handlePromptAdded}
        onPromptUpdated={handlePromptUpdated}
        editMode={isEditMode}
        promptToEdit={promptToEdit}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        promptName={promptToDelete?.name || ''}
        isDeleting={isDeleting}
      />
    </div>
  );
}
