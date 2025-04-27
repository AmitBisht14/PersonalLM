from pydantic import BaseModel

class PDFInfo(BaseModel):
    filename: str
    total_pages: int
    title: str | None = None
    author: str | None = None
