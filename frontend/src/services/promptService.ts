const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface Prompt {
  id: string;
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

export async function updatePrompt(id: string, name: string, prompt: string): Promise<Prompt | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/prompts/${id}`, {
      method: 'PUT',
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
      throw new Error(errorData.detail || 'Failed to update prompt');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating prompt:', error);
    return null;
  }
}

export async function deletePrompt(id: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/prompts/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      mode: 'cors',
      credentials: 'include',
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to delete prompt');
    }

    return true;
  } catch (error) {
    console.error('Error deleting prompt:', error);
    return false;
  }
}
