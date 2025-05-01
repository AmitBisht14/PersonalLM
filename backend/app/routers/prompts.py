from fastapi import APIRouter, HTTPException, status
from fastapi.responses import JSONResponse
from pydantic import BaseModel, validator
import os
import json
from pathlib import Path
import re
from typing import Dict, List, Optional

router = APIRouter(prefix="/api/v1", tags=["prompts"])

# Define the data model for prompt requests
class PromptRequest(BaseModel):
    name: str
    prompt: str
    
    @validator('name')
    def validate_name(cls, v):
        # Check if name is non-empty
        if not v or v.isspace():
            raise ValueError("name cannot be empty")
        
        # Check if name is filesystem-safe - allow more characters but still ensure safety
        # Disallow characters that are problematic for filesystems: / \ : * ? " < > |
        if re.search(r'[/\\:*?"<>|]', v):
            raise ValueError("name contains invalid characters. Avoid: / \\ : * ? \" < > |")
        
        return v
    
    @validator('prompt')
    def validate_prompt(cls, v):
        # Check if prompt is non-empty
        if not v or v.isspace():
            raise ValueError("prompt cannot be empty")
        
        return v

# Define the data model for stored prompts
class PromptItem(BaseModel):
    name: str
    prompt: str

# Ensure the prompts directory exists
def ensure_prompts_dir():
    prompts_dir = Path(__file__).parent.parent.parent / "data" / "prompts"
    prompts_dir.mkdir(parents=True, exist_ok=True)
    return prompts_dir

# Get the path for the prompts file
def get_prompts_file_path():
    prompts_dir = ensure_prompts_dir()
    return prompts_dir / "prompts.json"

# Load all prompts from the file
def load_prompts() -> List[PromptItem]:
    file_path = get_prompts_file_path()
    
    if not file_path.exists():
        return []
    
    try:
        with open(file_path, "r") as f:
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

# Save all prompts to the file
def save_prompts(prompts: List[PromptItem]):
    file_path = get_prompts_file_path()
    
    try:
        # Convert to list of dictionaries for JSON serialization
        prompts_data = [prompt.dict() for prompt in prompts]
        
        with open(file_path, "w") as f:
            json.dump(prompts_data, f, indent=2)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save prompts file: {str(e)}"
        )

@router.post("/prompts", status_code=status.HTTP_201_CREATED)
async def create_prompt(prompt_request: PromptRequest):
    """
    Create a new prompt or update an existing one.
    
    If a prompt with the same name already exists, it will be overwritten.
    """
    try:
        # Load existing prompts
        prompts = load_prompts()
        
        # Check if prompt already exists
        is_update = False
        for i, prompt in enumerate(prompts):
            if prompt.name == prompt_request.name:
                # Update existing prompt
                prompts[i] = PromptItem(name=prompt_request.name, prompt=prompt_request.prompt)
                is_update = True
                break
        
        # If not an update, add new prompt
        if not is_update:
            prompts.append(PromptItem(name=prompt_request.name, prompt=prompt_request.prompt))
        
        # Save all prompts back to the file
        save_prompts(prompts)
        
        # Return appropriate response
        if is_update:
            return {"status": "success", "message": f"Prompt '{prompt_request.name}' updated successfully"}
        else:
            return {"status": "success", "message": f"Prompt '{prompt_request.name}' created successfully"}
            
    except Exception as e:
        # Handle any errors
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save prompt: {str(e)}"
        )

@router.get("/prompts/{name}", status_code=status.HTTP_200_OK)
async def get_prompt(name: str):
    """
    Retrieve a prompt by name.
    """
    prompts = load_prompts()
    
    # Find prompt by name
    for prompt in prompts:
        if prompt.name == name:
            return prompt.dict()
    
    # If not found, return 404
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Prompt '{name}' not found"
    )

@router.get("/prompts", status_code=status.HTTP_200_OK)
async def list_prompts():
    """
    List all available prompts.
    """
    prompts = load_prompts()
    
    # Convert to list of dictionaries for JSON response
    result = [prompt.dict() for prompt in prompts]
    
    return result
