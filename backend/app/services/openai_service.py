from typing import List
from openai import OpenAI
from openai.types.chat import ChatCompletion
from app.core.config import get_settings
from app.models.requests import ChatRequest, Message

class OpenAIService:
    def __init__(self):
        settings = get_settings()
        self.client = OpenAI(api_key=settings.openai_api_key)
        self.default_model = settings.default_model
        self.max_tokens = settings.max_tokens
        self.temperature = settings.temperature

    def test_connection(self) -> str:
        """Test the connection to OpenAI API"""
        try:
            response = self.client.chat.completions.create(
                model=self.default_model,
                messages=[
                    {"role": "user", "content": "Say 'OpenAI connection is working!'"}
                ]
            )
            return response.choices[0].message.content
        except Exception as e:
            raise Exception(f"OpenAI connection failed: {str(e)}")

    def create_chat_completion(self, request: ChatRequest) -> ChatCompletion:
        """Create a chat completion using OpenAI API"""
        try:
            response = self.client.chat.completions.create(
                model=request.model or self.default_model,
                messages=[msg.model_dump() for msg in request.messages],
                temperature=request.temperature or self.temperature,
                max_tokens=request.max_tokens or self.max_tokens,
            )
            return response
        except Exception as e:
            raise Exception(f"Chat completion failed: {str(e)}")

    def validate_api_key(self) -> bool:
        """Validate if the API key is working"""
        try:
            self.test_connection()
            return True
        except:
            return False
