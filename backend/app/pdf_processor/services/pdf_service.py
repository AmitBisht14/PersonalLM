import fitz
from fastapi import UploadFile
import os
from ..models.pdf_models import PDFInfo

class PDFService:
    @staticmethod
    async def get_pdf_info(file: UploadFile) -> PDFInfo:
        """
        Get basic information about the PDF file
        """
        # Create a temporary file to store the upload
        temp_file_path = f"temp_{file.filename}"
        try:
            # Save uploaded file temporarily
            content = await file.read()
            with open(temp_file_path, "wb") as temp_file:
                temp_file.write(content)
            
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
            # Clean up temporary file
            if os.path.exists(temp_file_path):
                os.remove(temp_file_path)
