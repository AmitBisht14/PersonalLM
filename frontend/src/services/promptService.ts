const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface Prompt {
  name: string;
  prompt: string;
}

export async function fetchPrompts(): Promise<Prompt[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/prompts`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      mode: 'cors',
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch prompts');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching prompts:', error);
    return [];
  }
}

export async function createPrompt(name: string, prompt: string): Promise<Prompt | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/prompts`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      mode: 'cors',
      credentials: 'include',
      body: JSON.stringify({ name, prompt }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to create prompt');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating prompt:', error);
    return null;
  }
}

// Additional functions for future implementation
export async function updatePrompt(name: string, prompt: string): Promise<Prompt | null> {
  // Implementation will be similar to createPrompt
  return null;
}

export async function deletePrompt(name: string): Promise<boolean> {
  // Implementation for deleting a prompt
  return false;
}
