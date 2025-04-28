import fitz
from fastapi import UploadFile
from typing import List, Tuple
from ..models.pdf_models import PDFStructure, Chapter, Section
from .base_pdf_service import BasePDFService

class PDFStructureService(BasePDFService):
    @staticmethod
    async def analyze_structure(file: UploadFile) -> PDFStructure:
        """
        Analyze PDF structure to extract chapters and sections
        """
        temp_file_path = await BasePDFService.save_temp_file(file)
        try:
            # Open and analyze PDF
            with fitz.open(temp_file_path) as doc:
                # First try to get structure from table of contents
                toc = doc.get_toc()
                if toc:
                    return PDFStructureService._analyze_from_toc(doc, file.filename, toc)
                
                # If no TOC, analyze using content analysis
                return PDFStructureService._analyze_from_content(doc, file.filename)
        finally:
            BasePDFService.cleanup_temp_file(temp_file_path)

    @staticmethod
    def _analyze_from_toc(doc: fitz.Document, filename: str, toc: List[Tuple[int, str, int]]) -> PDFStructure:
        """
        Extract structure from PDF's table of contents
        """
        chapters = []
        current_chapter = None
        
        for level, title, page in toc:
            if level == 1:  # Chapter
                if current_chapter:
                    current_chapter.end_page = page - 1
                    current_chapter.length = current_chapter.end_page - current_chapter.start_page + 1
                
                current_chapter = Chapter(
                    title=title,
                    start_page=page,
                    sections=[],
                    length=1  # Initial length, will be updated when we find the end page
                )
                chapters.append(current_chapter)
            
            elif level == 2 and current_chapter:  # Section
                section = Section(title=title, page_number=page)
                current_chapter.sections.append(section)

        # Set end page for last chapter
        if current_chapter and len(chapters) > 0:
            current_chapter.end_page = len(doc)
            current_chapter.length = current_chapter.end_page - current_chapter.start_page + 1

        # Handle case where there's only one chapter
        if len(chapters) == 1:
            chapters[0].end_page = len(doc)
            chapters[0].length = chapters[0].end_page - chapters[0].start_page + 1

        # If no chapters were found, create a default chapter
        if not chapters:
            chapters.append(Chapter(
                title="Main Content",
                start_page=1,
                end_page=len(doc),
                length=len(doc),
                sections=[]
            ))

        return PDFStructure(
            filename=filename,
            total_pages=len(doc),
            chapters=chapters
        )

    @staticmethod
    def _analyze_from_content(doc: fitz.Document, filename: str) -> PDFStructure:
        """
        Extract structure by analyzing PDF content when no TOC is available
        """
        chapters = []
        current_chapter = None
        
        # Common chapter patterns
        chapter_patterns = [
            r'^chapter\s+\d+[\.\s]',
            r'^\d+\.\s+[A-Z]',
            r'^[IVX]+\.\s+[A-Z]'
        ]
        
        # Common section patterns
        section_patterns = [
            r'^\d+\.\d+\s+[A-Z]',
            r'^[A-Z]\.\s+[A-Z]'
        ]

        for page_num in range(len(doc)):
            page = doc[page_num]
            blocks = page.get_text("dict")["blocks"]
            
            for block in blocks:
                if "lines" not in block:
                    continue
                
                for line in block["lines"]:
                    for span in line["spans"]:
                        text = span["text"].strip()
                        font_size = span["size"]
                        is_bold = "Bold" in span["font"].lower()
                        
                        # Check for chapter heading
                        if (PDFStructureService._is_chapter_heading(text, font_size, is_bold, chapter_patterns)):
                            if current_chapter:
                                current_chapter.end_page = page_num
                                current_chapter.length = current_chapter.end_page - current_chapter.start_page + 1
                            
                            current_chapter = Chapter(
                                title=text,
                                start_page=page_num + 1,
                                end_page=None,
                                length=1,  # Initial length, will be updated when we find the end page
                                sections=[]
                            )
                            chapters.append(current_chapter)
                            break
                        
                        # Check for section heading
                        elif (current_chapter and 
                              PDFStructureService._is_section_heading(text, font_size, is_bold, section_patterns)):
                            section = Section(
                                title=text,
                                page_number=page_num + 1
                            )
                            current_chapter.sections.append(section)

        # Set end page for last chapter
        if current_chapter and len(chapters) > 0:
            current_chapter.end_page = len(doc)
            current_chapter.length = current_chapter.end_page - current_chapter.start_page + 1

        # If no chapters were found, create a default chapter
        if not chapters:
            chapters.append(Chapter(
                title="Main Content",
                start_page=1,
                end_page=len(doc),
                length=len(doc),
                sections=[]
            ))

        return PDFStructure(
            filename=filename,
            total_pages=len(doc),
            chapters=chapters
        )

    @staticmethod
    def _is_chapter_heading(text: str, font_size: float, is_bold: bool, patterns: List[str]) -> bool:
        """
        Determine if text is likely a chapter heading
        """
        # Check if text matches any chapter pattern
        if any(re.match(pattern, text.lower()) for pattern in patterns):
            return True
        
        # Consider text formatting
        if is_bold and font_size >= 14:
            return True
            
        return False

    @staticmethod
    def _is_section_heading(text: str, font_size: float, is_bold: bool, patterns: List[str]) -> bool:
        """
        Determine if text is likely a section heading
        """
        # Check if text matches any section pattern
        if any(re.match(pattern, text.lower()) for pattern in patterns):
            return True
        
        # Consider text formatting
        if (is_bold and 12 <= font_size < 14) or font_size >= 12:
            return True
            
        return False
