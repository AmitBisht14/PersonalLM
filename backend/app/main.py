from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import chat

app = FastAPI(title="PersonalLM API", description="Simple API to test OpenAI connectivity")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(chat.router, prefix="/api/v1", tags=["openai"])

@app.get("/")
async def root():
    return {"message": "Welcome to PersonalLM API"}
