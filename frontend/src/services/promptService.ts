import { 
  PromptData,
  fetchPromptsApi, 
  createPromptApi, 
  updatePromptApi, 
  deletePromptApi 
} from '../api/promptApi';

export interface Prompt extends PromptData {}

/**
 * Fetches all available prompts
 */
export async function fetchPrompts(): Promise<Prompt[]> {
  try {
    return await fetchPromptsApi();
  } catch (error) {
    console.error('Error fetching prompts:', error);
    return [];
  }
}

/**
 * Creates a new prompt with the given name and content
 */
export async function createPrompt(name: string, prompt: string): Promise<Prompt | null> {
  try {
    return await createPromptApi(name, prompt);
  } catch (error) {
    console.error('Error creating prompt:', error);
    return null;
  }
}

/**
 * Updates an existing prompt
 */
export async function updatePrompt(id: string, name: string, prompt: string): Promise<Prompt | null> {
  try {
    return await updatePromptApi(id, name, prompt);
  } catch (error) {
    console.error('Error updating prompt:', error);
    return null;
  }
}

/**
 * Deletes a prompt by ID
 */
export async function deletePrompt(id: string): Promise<boolean> {
  try {
    return await deletePromptApi(id);
  } catch (error) {
    console.error('Error deleting prompt:', error);
    return false;
  }
}
