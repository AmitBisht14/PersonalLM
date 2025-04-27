from fastapi import APIRouter, UploadFile, File
from ..services.pdf_service import PDFService
from ..models.pdf_models import PDFInfo

router = APIRouter(
    prefix="/pdf",
    tags=["pdf"]
)

@router.post("/analyze", response_model=PDFInfo)
async def analyze_pdf(
    file: UploadFile = File(...)
) -> PDFInfo:
    """
    Upload and analyze a PDF file to get basic information:
    - filename
    - total pages
    - title (if available)
    - author (if available)
    """
    if not file.filename.lower().endswith('.pdf'):
        return {"error": "Only PDF files are allowed"}
    
    pdf_service = PDFService()
    info = await pdf_service.get_pdf_info(file)
    return info
