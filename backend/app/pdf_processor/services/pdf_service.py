import fitz
from fastapi import UploadFile
import os
import re
from typing import List, Tuple
from ..models.pdf_models import PDFInfo, PDFStructure, Chapter, Section

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

    @staticmethod
    async def analyze_structure(file: UploadFile) -> PDFStructure:
        """
        Analyze PDF structure to extract chapters and sections
        """
        temp_file_path = f"temp_{file.filename}"
        try:
            # Save uploaded file temporarily
            content = await file.read()
            with open(temp_file_path, "wb") as temp_file:
                temp_file.write(content)
            
            # Open and analyze PDF
            with fitz.open(temp_file_path) as doc:
                # First try to get structure from table of contents
                toc = doc.get_toc()
                if toc:
                    return PDFService._analyze_from_toc(doc, file.filename, toc)
                
                # If no TOC, analyze using content analysis
                return PDFService._analyze_from_content(doc, file.filename)
                
        finally:
            # Clean up temporary file
            if os.path.exists(temp_file_path):
                os.remove(temp_file_path)

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
                        if (PDFService._is_chapter_heading(text, font_size, is_bold, chapter_patterns)):
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
                              PDFService._is_section_heading(text, font_size, is_bold, section_patterns)):
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
        return (
            any(re.match(pattern, text.lower()) for pattern in patterns)
            and font_size >= 14  # Larger font
            and is_bold  # Usually bold
            and len(text.split()) < 10  # Not too long
        )

    @staticmethod
    def _is_section_heading(text: str, font_size: float, is_bold: bool, patterns: List[str]) -> bool:
        """
        Determine if text is likely a section heading
        """
        return (
            any(re.match(pattern, text) for pattern in patterns)
            and font_size >= 12  # Medium-large font
            and len(text.split()) < 12  # Not too long
        )
