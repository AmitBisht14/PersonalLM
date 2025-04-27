from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import chat

app = FastAPI(title="PersonalLM API", description="Simple API to test OpenAI connectivity")

# Configure CORS
origins = [
    "http://localhost:3000",    # Next.js dev server
    "http://127.0.0.1:3000",
    "http://localhost:8000",    # FastAPI server
    "http://127.0.0.1:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Include routers
app.include_router(chat.router, prefix="/api/v1", tags=["openai"])

@app.get("/")
async def root():
    return {"message": "Welcome to PersonalLM API"}
