from fastapi import APIRouter, UploadFile, File, HTTPException
from ..services.pdf_service import PDFService
from ..models.pdf_models import PDFInfo, PDFStructure

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
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    
    pdf_service = PDFService()
    info = await pdf_service.get_pdf_info(file)
    return info

@router.post("/analyze/structure", response_model=PDFStructure)
async def analyze_pdf_structure(
    file: UploadFile = File(...)
) -> PDFStructure:
    """
    Analyze PDF structure to extract:
    - Chapters (with page ranges and lengths)
    - Sections within each chapter
    
    The analysis is done using two methods:
    1. First tries to extract from PDF's table of contents (most accurate)
    2. If no TOC exists, analyzes content using text formatting and patterns
    """
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    
    pdf_service = PDFService()
    structure = await pdf_service.analyze_structure(file)
    return structure
