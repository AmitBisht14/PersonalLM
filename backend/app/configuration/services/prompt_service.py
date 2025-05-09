from fastapi import HTTPException, status
import json
from pathlib import Path
from typing import List, Dict

from ..models.prompt_models import PromptItem

class PromptService:
    def __init__(self):
        self.prompts_dir = self._ensure_prompts_dir()
        self.prompts_file_path = self.prompts_dir / "prompts.json"
    
    def _ensure_prompts_dir(self) -> Path:
        """Ensure the prompts directory exists"""
        prompts_dir = Path(__file__).parent.parent.parent.parent / "data" / "prompts"
        prompts_dir.mkdir(parents=True, exist_ok=True)
        return prompts_dir
    
    def load_prompts(self) -> List[PromptItem]:
        """Load all prompts from the file"""
        if not self.prompts_file_path.exists():
            return []
        
        try:
            with open(self.prompts_file_path, "r") as f:
                data = json.load(f)
                
                # Handle existing data format (dict) and convert to list if needed
                if isinstance(data, dict):
                    return [PromptItem(name=name, prompt=prompt) for name, prompt in data.items()]
                elif isinstance(data, list):
                    return [PromptItem(**item) for item in data]
                else:
                    return []
        except json.JSONDecodeError:
            # If the file exists but is not valid JSON, return an empty list
            return []
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to read prompts file: {str(e)}"
            )
    
    def save_prompts(self, prompts: List[PromptItem]) -> None:
        """Save all prompts to the file"""
        try:
            # Convert to list of dictionaries for JSON serialization
            prompts_data = [prompt.dict() for prompt in prompts]
            
            with open(self.prompts_file_path, "w") as f:
                json.dump(prompts_data, f, indent=2)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to save prompts file: {str(e)}"
            )
    
    def create_or_update_prompt(self, name: str, prompt: str, prompt_id: str = None) -> Dict[str, str]:
        """Create a new prompt or update an existing one"""
        prompts = self.load_prompts()
        
        # Check if prompt already exists
        is_update = False
        for i, p in enumerate(prompts):
            if prompt_id and p.id == prompt_id:
                # Update existing prompt by ID
                prompts[i] = PromptItem(id=p.id, name=name, prompt=prompt)
                is_update = True
                break
            elif not prompt_id and p.name == name:
                # Update existing prompt by name (legacy support)
                prompts[i] = PromptItem(id=p.id, name=name, prompt=prompt)
                is_update = True
                break
        
        # If not an update, add new prompt
        if not is_update:
            new_prompt = PromptItem(name=name, prompt=prompt)
            if prompt_id:
                new_prompt.id = prompt_id
            prompts.append(new_prompt)
        
        # Save all prompts back to the file
        self.save_prompts(prompts)
        
        # Return appropriate response
        if is_update:
            return {"status": "success", "message": f"Prompt '{name}' updated successfully"}
        else:
            return {"status": "success", "message": f"Prompt '{name}' created successfully"}
    
    def get_prompt(self, name: str = None, prompt_id: str = None) -> PromptItem:
        """Retrieve a prompt by name or ID"""
        prompts = self.load_prompts()
        
        # Find prompt by ID (preferred) or name
        for prompt in prompts:
            if prompt_id and prompt.id == prompt_id:
                return prompt
            elif name and prompt.name == name and not prompt_id:
                return prompt
        
        # If not found, return 404
        error_detail = f"Prompt not found"
        if name:
            error_detail = f"Prompt '{name}' not found"
        elif prompt_id:
            error_detail = f"Prompt with ID '{prompt_id}' not found"
            
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=error_detail
        )
    
    def list_prompts(self) -> List[PromptItem]:
        """List all available prompts"""
        return self.load_prompts()
        
    def update_prompt(self, prompt_id: str, name: str, prompt: str) -> Dict[str, str]:
        """Update an existing prompt by ID"""
        prompts = self.load_prompts()
        
        # Find prompt by ID
        for i, p in enumerate(prompts):
            if p.id == prompt_id:
                # Update existing prompt
                prompts[i] = PromptItem(id=prompt_id, name=name, prompt=prompt)
                self.save_prompts(prompts)
                return {"status": "success", "message": f"Prompt '{name}' updated successfully"}
        
        # If not found, return 404
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Prompt with ID '{prompt_id}' not found"
        )
    
    def delete_prompt(self, prompt_id: str) -> Dict[str, str]:
        """Delete a prompt by ID"""
        prompts = self.load_prompts()
        
        # Find prompt by ID
        for i, p in enumerate(prompts):
            if p.id == prompt_id:
                # Get the name for the response message
                name = p.name
                # Remove the prompt
                prompts.pop(i)
                self.save_prompts(prompts)
                return {"status": "success", "message": f"Prompt '{name}' deleted successfully"}
        
        # If not found, return 404
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Prompt with ID '{prompt_id}' not found"
        )
