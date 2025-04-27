from fastapi import APIRouter, HTTPException, status
from app.services.openai_service import OpenAIService
from app.models.requests import ChatRequest
from app.models.responses import BaseResponse, ChatResponse, ErrorResponse

router = APIRouter()
openai_service = OpenAIService()

@router.get("/test-openai", response_model=BaseResponse)
def test_openai():
    """Test if OpenAI API is accessible"""
    try:
        response = openai_service.test_connection()
        return BaseResponse(status="success", message=response)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=ErrorResponse(
                status="error",
                message="Failed to connect to OpenAI",
                error_code="OPENAI_CONNECTION_ERROR",
                details={"error": str(e)}
            ).model_dump()
        )

@router.post("/chat", response_model=ChatResponse)
def create_chat_completion(request: ChatRequest):
    """Create a chat completion"""
    try:
        response = openai_service.create_chat_completion(request)
        return ChatResponse(
            status="success",
            message="Chat completion successful",
            content=response.choices[0].message.content
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=ErrorResponse(
                status="error",
                message="Chat completion failed",
                error_code="CHAT_COMPLETION_ERROR",
                details={"error": str(e)}
            ).model_dump()
        )

@router.get("/validate-key", response_model=BaseResponse)
def validate_api_key():
    """Validate if the OpenAI API key is working"""
    is_valid = openai_service.validate_api_key()
    return BaseResponse(
        status="success" if is_valid else "error",
        message="API key is valid" if is_valid else "API key is invalid"
    )
