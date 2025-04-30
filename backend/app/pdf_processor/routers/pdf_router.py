from fastapi import APIRouter, UploadFile, File, HTTPException, Query
from ..services.pdf_info_service import PDFInfoService
from ..services.pdf_structure_service import PDFStructureService
from ..services.pdf_content_service import PDFContentService
from ..models.pdf_models import PDFInfo, PDFStructure, PDFContent

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
    
    pdf_service = PDFInfoService()
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
    
    pdf_service = PDFStructureService()
    structure = await pdf_service.analyze_structure(file)
    return structure

@router.post("/content", response_model=PDFContent)
async def get_pdf_content(
    file: UploadFile = File(...),
    start_page: int = Query(..., gt=0, description="Start page number (1-based)"),
    end_page: int = Query(..., gt=0, description="End page number (1-based)")
) -> PDFContent:
    """
    Extract content (text and images) from the specified page range of a PDF file.
    The content maintains formatting and layout information for proper display.
    
    Returns:
    - Text blocks with formatting (font, size, color, etc.)
    - Images as base64 with position and dimensions
    - All content blocks sorted in reading order
    """
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    
    if end_page < start_page:
        raise HTTPException(status_code=400, detail="End page must be greater than or equal to start page")
    
    pdf_service = PDFContentService()
    content = await pdf_service.extract_content(file, start_page, end_page)
    return content
