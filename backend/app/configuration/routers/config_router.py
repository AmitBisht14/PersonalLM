from fastapi import APIRouter, HTTPException, status
from ..models.prompt_models import PromptRequest
from ..services.prompt_service import PromptService

router = APIRouter(
    prefix="/api/v1",
    tags=["configuration"]
)

prompt_service = PromptService()

@router.post("/prompts", status_code=status.HTTP_201_CREATED)
async def create_prompt(prompt_request: PromptRequest):
    """
    Create a new prompt or update an existing one.
    
    If a prompt with the same name already exists, it will be overwritten.
    """
    try:
        result = prompt_service.create_or_update_prompt(
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
            detail=f"Failed to save prompt: {str(e)}"
        )

@router.get("/prompts/{name}", status_code=status.HTTP_200_OK)
async def get_prompt(name: str):
    """
    Retrieve a prompt by name.
    """
    prompt = prompt_service.get_prompt(name)
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
