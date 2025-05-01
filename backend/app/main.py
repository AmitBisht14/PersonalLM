from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.routers import chat, prompts
from app.pdf_processor.routers import pdf_router
from app.core.config import get_settings
from app.models.responses import ErrorResponse

settings = get_settings()

app = FastAPI(
    title=settings.app_name,
    description="API for interacting with OpenAI's GPT models"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(chat.router, prefix="/api/v1", tags=["chat"])
app.include_router(pdf_router.router)
app.include_router(prompts.router)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Global exception handler for unhandled exceptions"""
    error_response = ErrorResponse(
        status="error",
        message="An unexpected error occurred",
        error_code="INTERNAL_SERVER_ERROR",
        details={"error": str(exc)}
    )
    return JSONResponse(
        status_code=500,
        content=error_response.model_dump()
    )

@app.get("/")
async def root():
    """Root endpoint"""
    return {"message": f"Welcome to {settings.app_name}"}
