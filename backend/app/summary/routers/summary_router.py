from fastapi import APIRouter, HTTPException
from app.summary.models.summary_models import SummaryRequest, SummaryResponse
from app.summary.services.summary_service import SummaryService

router = APIRouter(prefix="/api/v1", tags=["summary"])

@router.post("/summary", response_model=SummaryResponse)
async def generate_summary(request: SummaryRequest):
    """
    Generate a summary for the provided text using the given prompt.
    
    Args:
        request: SummaryRequest containing the text to summarize and the prompt with instructions
        
    Returns:
        SummaryResponse containing the generated summary
    """
    try:
        summary_service = SummaryService()
        return await summary_service.generate_summary(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
