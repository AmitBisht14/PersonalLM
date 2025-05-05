import fitz
from fastapi import UploadFile, HTTPException
from typing import List
from ..models.pdf_models import PDFContent, PDFPageContent, PDFRawContent
from .base_pdf_service import BasePDFService
import logging

logger = logging.getLogger(__name__)

class PDFContentService(BasePDFService):
    @staticmethod
    async def extract_content(file: UploadFile, start_page: int, end_page: int) -> PDFContent:
        """
        Extract text from the specified page range of the PDF
        """
        if not file.filename.lower().endswith('.pdf'):
            raise HTTPException(status_code=400, detail="File must be a PDF")

        temp_file_path = None
        try:
            logger.info(f"Processing PDF {file.filename} pages {start_page} to {end_page}")
            temp_file_path = await BasePDFService.save_temp_file(file)
            doc = fitz.open(temp_file_path)
            total_pages = len(doc)
            
            # Validate page range
            if start_page < 1 or start_page > total_pages:
                raise HTTPException(
                    status_code=400,
                    detail=f"Start page must be between 1 and {total_pages}"
                )
            if end_page < start_page or end_page > total_pages:
                raise HTTPException(
                    status_code=400,
                    detail=f"End page must be between {start_page} and {total_pages}"
                )

            pages = []
            # Process each page in the range
            for page_num in range(start_page - 1, end_page):
                logger.info(f"Extracting text from page {page_num + 1}")
                page = doc[page_num]
                text_content = page.get_text()
                logger.info(f"Extracted {len(text_content)} characters from page {page_num + 1}")
                
                pages.append(PDFPageContent(
                    page_number=page_num + 1,
                    text=text_content
                ))

            content = PDFContent(
                filename=file.filename,
                start_page=start_page,
                end_page=end_page,
                total_pages=total_pages,
                pages=pages
            )
            
            doc.close()
            logger.info(f"Successfully processed PDF {file.filename}")
            return content

        except Exception as e:
            logger.error(f"Error processing PDF: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail=f"Error processing PDF: {str(e)}"
            )
        finally:
            if temp_file_path:
                # Clean up the temporary file
                await BasePDFService.cleanup_temp_file(temp_file_path)

    @staticmethod
    async def extract_raw_content(file: UploadFile, start_page: int, end_page: int) -> PDFRawContent:
        """
        Extract raw text from the specified page range of the PDF without page separation
        """
        if not file.filename.lower().endswith('.pdf'):
            raise HTTPException(status_code=400, detail="File must be a PDF")

        temp_file_path = None
        try:
            logger.info(f"Processing PDF {file.filename} pages {start_page} to {end_page}")
            temp_file_path = await BasePDFService.save_temp_file(file)
            doc = fitz.open(temp_file_path)
            total_pages = len(doc)
            
            # Validate page range
            if start_page < 1 or start_page > total_pages:
                raise HTTPException(
                    status_code=400,
                    detail=f"Start page must be between 1 and {total_pages}"
                )
            if end_page < start_page or end_page > total_pages:
                raise HTTPException(
                    status_code=400,
                    detail=f"End page must be between {start_page} and {total_pages}"
                )

            # Extract text from all pages in range and combine
            text_content = []
            for page_num in range(start_page - 1, end_page):
                logger.info(f"Extracting text from page {page_num + 1}")
                page = doc[page_num]
                page_text = page.get_text()
                # Clean up the text:
                # 1. Replace multiple spaces with single space
                # 2. Replace newlines and carriage returns with space
                # 3. Strip whitespace
                cleaned_text = ' '.join(page_text.split())
                text_content.append(cleaned_text)
                logger.info(f"Extracted {len(cleaned_text)} characters from page {page_num + 1}")

            # Join all pages with a single space
            final_text = ' '.join(text_content)

            return PDFRawContent(
                filename=file.filename,
                start_page=start_page,
                end_page=end_page,
                total_pages=total_pages,
                text=final_text
            )

        except Exception as e:
            logger.error(f"Error processing PDF: {str(e)}")
            raise HTTPException(status_code=500, detail=str(e))
        finally:
            if temp_file_path:
                BasePDFService.cleanup_temp_file(temp_file_path)
