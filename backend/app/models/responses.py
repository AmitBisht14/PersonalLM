from pydantic import BaseModel

class BaseResponse(BaseModel):
    status: str
    message: str

class ChatResponse(BaseResponse):
    conversation_id: str | None = None
    content: str

class ErrorResponse(BaseResponse):
    error_code: str | None = None
    details: dict | None = None
