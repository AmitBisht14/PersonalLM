from pydantic import BaseModel

class SummaryRequest(BaseModel):
    text: str
    prompt: str

class SummaryResponse(BaseModel):
    summary: str
