from pydantic import BaseModel
from typing import List

class PDFInfo(BaseModel):
    filename: str
    total_pages: int
    title: str | None = None
    author: str | None = None

class Section(BaseModel):
    title: str
    page_number: int

class Chapter(BaseModel):
    title: str
    start_page: int
    end_page: int | None = None
    length: int
    sections: List[Section] = []

class PDFStructure(BaseModel):
    filename: str
    total_pages: int
    chapters: List[Chapter]
