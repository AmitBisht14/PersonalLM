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
    
    def create_or_update_prompt(self, name: str, prompt: str) -> Dict[str, str]:
        """Create a new prompt or update an existing one"""
        prompts = self.load_prompts()
        
        # Check if prompt already exists
        is_update = False
        for i, p in enumerate(prompts):
            if p.name == name:
                # Update existing prompt
                prompts[i] = PromptItem(name=name, prompt=prompt)
                is_update = True
                break
        
        # If not an update, add new prompt
        if not is_update:
            prompts.append(PromptItem(name=name, prompt=prompt))
        
        # Save all prompts back to the file
        self.save_prompts(prompts)
        
        # Return appropriate response
        if is_update:
            return {"status": "success", "message": f"Prompt '{name}' updated successfully"}
        else:
            return {"status": "success", "message": f"Prompt '{name}' created successfully"}
    
    def get_prompt(self, name: str) -> PromptItem:
        """Retrieve a prompt by name"""
        prompts = self.load_prompts()
        
        # Find prompt by name
        for prompt in prompts:
            if prompt.name == name:
                return prompt
        
        # If not found, return 404
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Prompt '{name}' not found"
        )
    
    def list_prompts(self) -> List[PromptItem]:
        """List all available prompts"""
        return self.load_prompts()
