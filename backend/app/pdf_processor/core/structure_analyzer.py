from typing import List, Tuple
import re
import fitz
from ..models.pdf_models import Chapter, Section, PDFStructure

class PDFStructureAnalyzer:
    # Common patterns for chapter and section detection
    CHAPTER_PATTERNS = [
        r'^chapter\s+\d+[\.\s]',
        r'^\d+\.\s+[A-Z]',
        r'^[IVX]+\.\s+[A-Z]'
    ]
    
    SECTION_PATTERNS = [
        r'^\d+\.\d+\s+[A-Z]',
        r'^[A-Z]\.\s+[A-Z]'
    ]

    @staticmethod
    def analyze_from_toc(doc: fitz.Document, filename: str, toc: List[Tuple[int, str, int]]) -> PDFStructure:
        """Extract structure from PDF's table of contents"""
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
                    length=1  # Initial length, will be updated
                )
                chapters.append(current_chapter)
            
            elif level == 2 and current_chapter:  # Section
                section = Section(title=title, page_number=page)
                current_chapter.sections.append(section)

        PDFStructureAnalyzer._finalize_chapters(doc, chapters)
        return PDFStructure(filename=filename, total_pages=len(doc), chapters=chapters)

    @staticmethod
    def analyze_from_content(doc: fitz.Document, filename: str) -> PDFStructure:
        """Extract structure by analyzing PDF content"""
        chapters = []
        current_chapter = None
        
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
                        if PDFStructureAnalyzer._is_chapter_heading(text, font_size, is_bold):
                            if current_chapter:
                                current_chapter.end_page = page_num
                                current_chapter.length = current_chapter.end_page - current_chapter.start_page + 1
                            
                            current_chapter = Chapter(
                                title=text,
                                start_page=page_num + 1,
                                end_page=None,
                                length=1,
                                sections=[]
                            )
                            chapters.append(current_chapter)
                            break
                        
                        # Check for section heading
                        elif current_chapter and PDFStructureAnalyzer._is_section_heading(text, font_size, is_bold):
                            section = Section(
                                title=text,
                                page_number=page_num + 1
                            )
                            current_chapter.sections.append(section)

        PDFStructureAnalyzer._finalize_chapters(doc, chapters)
        return PDFStructure(filename=filename, total_pages=len(doc), chapters=chapters)

    @staticmethod
    def _finalize_chapters(doc: fitz.Document, chapters: List[Chapter]) -> None:
        """Finalize chapter information and handle edge cases"""
        if not chapters:
            # Create default chapter for PDFs without clear structure
            chapters.append(Chapter(
                title="Main Content",
                start_page=1,
                end_page=len(doc),
                length=len(doc),
                sections=[]
            ))
            return

        # Update last chapter
        if len(chapters) > 0:
            last_chapter = chapters[-1]
            last_chapter.end_page = len(doc)
            last_chapter.length = last_chapter.end_page - last_chapter.start_page + 1

        # Handle single chapter case
        if len(chapters) == 1:
            chapters[0].end_page = len(doc)
            chapters[0].length = chapters[0].end_page - chapters[0].start_page + 1

    @staticmethod
    def _is_chapter_heading(text: str, font_size: float, is_bold: bool) -> bool:
        """Determine if text is likely a chapter heading"""
        return (
            any(re.match(pattern, text.lower()) for pattern in PDFStructureAnalyzer.CHAPTER_PATTERNS)
            and font_size >= 14  # Larger font
            and is_bold  # Usually bold
            and len(text.split()) < 10  # Not too long
        )

    @staticmethod
    def _is_section_heading(text: str, font_size: float, is_bold: bool) -> bool:
        """Determine if text is likely a section heading"""
        return (
            any(re.match(pattern, text) for pattern in PDFStructureAnalyzer.SECTION_PATTERNS)
            and font_size >= 12  # Medium-large font
            and len(text.split()) < 12  # Not too long
        )
