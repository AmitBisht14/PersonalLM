from fastapi import UploadFile
import os

class BasePDFService:
    @staticmethod
    async def save_temp_file(file: UploadFile) -> str:
        """
        Save uploaded file temporarily and return the path
        """
        temp_file_path = f"temp_{file.filename}"
        content = await file.read()
        with open(temp_file_path, "wb") as temp_file:
            temp_file.write(content)
        return temp_file_path

    @staticmethod
    def cleanup_temp_file(temp_file_path: str) -> None:
        """
        Clean up temporary file
        """
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)
