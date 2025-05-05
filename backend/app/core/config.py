from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    app_name: str = "PersonalLM API"
    openai_api_key: str
    default_model: str = "gpt-4"  # Fixed typo in model name
    max_tokens: int = 4096
    temperature: float = 0.7
    frontend_url: str = "http://localhost:3000"

    class Config:
        env_file = ".env"

@lru_cache()
def get_settings() -> Settings:
    return Settings()
