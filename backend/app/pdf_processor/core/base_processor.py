from typing import Optional
import fitz
import os
from fastapi import UploadFile

class BasePDFProcessor:
    def __init__(self, temp_dir: str = "temp"):
        self.temp_dir = temp_dir
        os.makedirs(temp_dir, exist_ok=True)

    async def _save_temp_file(self, file: UploadFile) -> str:
        """Save uploaded file to temporary directory"""
        if not os.path.exists(self.temp_dir):
            os.makedirs(self.temp_dir)
            
        temp_file_path = os.path.join(self.temp_dir, f"temp_{file.filename}")
        content = await file.read()
        
        with open(temp_file_path, "wb") as temp_file:
            temp_file.write(content)
        
        return temp_file_path

    def _cleanup_temp_file(self, file_path: str) -> None:
        """Clean up temporary file"""
        if os.path.exists(file_path):
            os.remove(file_path)

    async def process_pdf(self, file: UploadFile) -> Optional[fitz.Document]:
        """Process PDF file and return fitz Document object"""
        temp_file_path = None
        try:
            temp_file_path = await self._save_temp_file(file)
            return fitz.open(temp_file_path)
        finally:
            if temp_file_path:
                self._cleanup_temp_file(temp_file_path)
