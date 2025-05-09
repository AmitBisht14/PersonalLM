import fitz  # PyMuPDF's fitz module
from fastapi import UploadFile
from ..models.pdf_models import PDFInfo
from .base_pdf_service import BasePDFService

class PDFInfoService(BasePDFService):
    @staticmethod
    async def get_pdf_info(file: UploadFile) -> PDFInfo:
        """
        Get basic information about the PDF file
        """
        temp_file_path = await BasePDFService.save_temp_file(file)
        try:
            # Open and analyze PDF
            with fitz.open(temp_file_path) as doc:
                metadata = doc.metadata
                return PDFInfo(
                    filename=file.filename,
                    total_pages=len(doc),
                    title=metadata.get('title'),
                    author=metadata.get('author')
                )
        finally:
            BasePDFService.cleanup_temp_file(temp_file_path)
