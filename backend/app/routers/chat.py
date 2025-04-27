from fastapi import APIRouter, HTTPException
from app.services.openai_service import OpenAIService

router = APIRouter()
openai_service = OpenAIService()

@router.get("/test-openai")
def test_openai():
    """Test if OpenAI API is accessible"""
    try:
        response = openai_service.test_connection()
        return {"status": "success", "message": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
