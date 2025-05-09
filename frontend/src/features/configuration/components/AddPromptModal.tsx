'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { createPrompt, updatePrompt, Prompt } from '@/services/promptService';

interface AddPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPromptAdded: (prompt: Prompt) => void;
  onPromptUpdated?: (prompt: Prompt) => void;
  editMode?: boolean;
  promptToEdit?: Prompt | null;
}

export function AddPromptModal({ 
  isOpen, 
  onClose, 
  onPromptAdded, 
  onPromptUpdated, 
  editMode = false,
  promptToEdit = null 
}: AddPromptModalProps) {
  const [newPromptName, setNewPromptName] = useState('');
  const [newPromptContent, setNewPromptContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Load prompt data when editing
  useEffect(() => {
    if (editMode && promptToEdit) {
      setNewPromptName(promptToEdit.name);
      setNewPromptContent(promptToEdit.prompt);
    } else if (!editMode) {
      // Reset form when opening in add mode
      setNewPromptName('');
      setNewPromptContent('');
    }
  }, [editMode, promptToEdit, isOpen]);

  const handleSavePrompt = async () => {
    if (!newPromptName.trim() || !newPromptContent.trim()) {
      setSubmitError('Name and prompt content are required');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      if (editMode && promptToEdit) {
        // Update existing prompt
        const result = await updatePrompt(promptToEdit.id, newPromptName, newPromptContent);
        if (result) {
          // Notify parent component about the updated prompt
          if (onPromptUpdated) {
            onPromptUpdated({
              id: promptToEdit.id,
              name: newPromptName,
              prompt: newPromptContent
            });
          }
          onClose();
        } else {
          setSubmitError('Failed to update prompt');
        }
      } else {
        // Create new prompt
        const result = await createPrompt(newPromptName, newPromptContent);
        if (result) {
          // Notify parent component about the new prompt
          onPromptAdded(result);
          // Reset form
          setNewPromptName('');
          setNewPromptContent('');
          onClose();
        } else {
          setSubmitError('Failed to create prompt');
        }
      }
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-xl mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{editMode ? 'Edit Prompt' : 'Add New Prompt'}</h3>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-700 rounded-full"
          >
            <X className="w-5 h-5 text-gray-400 hover:text-white" />
          </button>
        </div>

        {submitError && (
          <div className="bg-red-900/30 border border-red-800 text-red-300 px-4 py-2 rounded mb-4 text-sm">
            {submitError}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label htmlFor="promptName" className="block text-sm font-medium mb-1">
              Prompt Name
            </label>
            <input
              id="promptName"
              type="text"
              value={newPromptName}
              onChange={(e) => setNewPromptName(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter a name for this prompt"
            />
          </div>

          <div>
            <label htmlFor="promptContent" className="block text-sm font-medium mb-1">
              Prompt Content
            </label>
            <textarea
              id="promptContent"
              value={newPromptContent}
              onChange={(e) => setNewPromptContent(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm h-40 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter the prompt content"
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-600 rounded text-sm hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSavePrompt}
              disabled={isSubmitting}
              className={`px-4 py-2 bg-blue-500 text-white rounded text-sm flex items-center gap-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-600'} transition-colors`}
            >
              {isSubmitting ? 'Saving...' : (editMode ? 'Update Prompt' : 'Save Prompt')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
