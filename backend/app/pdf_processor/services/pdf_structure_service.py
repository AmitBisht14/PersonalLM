import fitz
from fastapi import UploadFile, HTTPException
from typing import List, Dict, Any
from ..models.pdf_models import PDFStructure, Chapter, Section
from .base_pdf_service import BasePDFService
import logging

logger = logging.getLogger(__name__)

class PDFStructureService(BasePDFService):
    @staticmethod
    async def analyze_structure(file: UploadFile) -> PDFStructure:
        """
        Analyze PDF structure to extract chapters and sections
        """
        if not file.filename.lower().endswith('.pdf'):
            raise HTTPException(status_code=400, detail="File must be a PDF")

        temp_file_path = None
        try:
            logger.info(f"Analyzing structure of PDF {file.filename}")
            temp_file_path = await BasePDFService.save_temp_file(file)
            doc = fitz.open(temp_file_path)
            total_pages = len(doc)
            
            # Try to get TOC (table of contents)
            toc = doc.get_toc()
            chapters: List[Chapter] = []
            
            if toc:
                logger.info("Found table of contents")
                current_chapter = None
                current_sections: List[Section] = []
                
                for level, title, page in toc:
                    if level == 1:  # Chapter
                        if current_chapter:
                            # Set end page of previous chapter
                            current_chapter.end_page = page - 1
                            current_chapter.length = current_chapter.end_page - current_chapter.start_page + 1
                            chapters.append(current_chapter)
                        
                        current_chapter = Chapter(
                            title=title,
                            start_page=page,
                            end_page=None,
                            length=0,
                            sections=[]
                        )
                        current_sections = []
                    elif level == 2 and current_chapter:  # Section
                        current_sections.append(Section(
                            title=title,
                            page_number=page
                        ))
                
                if current_chapter:
                    # Handle the last chapter
                    current_chapter.end_page = total_pages
                    current_chapter.length = current_chapter.end_page - current_chapter.start_page + 1
                    current_chapter.sections = current_sections
                    chapters.append(current_chapter)
            else:
                logger.info("No table of contents found, analyzing content")
                # If no TOC, try to analyze content
                # This is a simplified example - you might want to implement more sophisticated content analysis
                chapters = [Chapter(
                    title="Main Content",
                    start_page=1,
                    end_page=total_pages,
                    length=total_pages,
                    sections=[]
                )]

            structure = PDFStructure(
                filename=file.filename,
                total_pages=total_pages,
                chapters=chapters
            )
            
            doc.close()
            logger.info(f"Successfully analyzed PDF structure for {file.filename}")
            return structure

        except Exception as e:
            logger.error(f"Error analyzing PDF structure: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail=f"Error analyzing PDF structure: {str(e)}"
            )
        finally:
            if temp_file_path:
                # Clean up the temporary file
                await BasePDFService.cleanup_temp_file(temp_file_path)
