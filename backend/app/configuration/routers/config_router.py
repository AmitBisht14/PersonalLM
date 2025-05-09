from fastapi import APIRouter, HTTPException, status, Path
from ..models.prompt_models import PromptRequest, PromptItem
from ..services.prompt_service import PromptService
from typing import List, Dict

router = APIRouter(
    prefix="/api/v1",
    tags=["configuration"]
)

prompt_service = PromptService()

@router.post("/prompts", status_code=status.HTTP_201_CREATED)
async def create_prompt(prompt_request: PromptRequest):
    """
    Create a new prompt.
    """
    try:
        result = prompt_service.create_or_update_prompt(
            name=prompt_request.name,
            prompt=prompt_request.prompt,
            prompt_id=prompt_request.id
        )
        return result
    except Exception as e:
        # Handle any errors
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save prompt: {str(e)}"
        )

@router.get("/prompts/{prompt_id}", status_code=status.HTTP_200_OK)
async def get_prompt(prompt_id: str = Path(..., description="The ID of the prompt to retrieve")):
    """
    Retrieve a prompt by ID.
    """
    prompt = prompt_service.get_prompt(prompt_id=prompt_id)
    return prompt.dict()

@router.get("/prompts", status_code=status.HTTP_200_OK)
async def list_prompts():
    """
    List all available prompts.
    """
    prompts = prompt_service.list_prompts()
    
    # Convert to list of dictionaries for JSON response
    result = [prompt.dict() for prompt in prompts]
    
    return result

@router.put("/prompts/{prompt_id}", status_code=status.HTTP_200_OK)
async def update_prompt(prompt_request: PromptRequest, prompt_id: str = Path(..., description="The ID of the prompt to update")):
    """
    Update an existing prompt by ID.
    """
    try:
        result = prompt_service.update_prompt(
            prompt_id=prompt_id,
            name=prompt_request.name,
            prompt=prompt_request.prompt
        )
        return result
    except Exception as e:
        # Handle any errors
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update prompt: {str(e)}"
        )

@router.delete("/prompts/{prompt_id}", status_code=status.HTTP_200_OK)
async def delete_prompt(prompt_id: str = Path(..., description="The ID of the prompt to delete")):
    """
    Delete a prompt by ID.
    """
    try:
        result = prompt_service.delete_prompt(prompt_id=prompt_id)
        return result
    except Exception as e:
        # Handle any errors
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete prompt: {str(e)}"
        )
