from app.services.openai_service import OpenAIService
from app.summary.models.summary_models import SummaryRequest, SummaryResponse
from app.models.requests import ChatRequest, Message
from app.core.config import Settings, get_settings

class SummaryService:
    def __init__(self, openai_service: OpenAIService = None, settings: Settings = None):
        self.settings = settings or get_settings()
        self.openai_service = openai_service or OpenAIService()

    async def generate_summary(self, request: SummaryRequest) -> SummaryResponse:
        """Generate a summary for the given text using the provided prompt"""
        try:
            # Create a chat request with the text and prompt
            messages = [
                Message(role="system", content="You are a helpful assistant that generates summaries based on provided instructions."),
                Message(role="user", content=f"Instructions for summarization:\n{request.prompt}\n\nText to summarize:\n{request.text}")
            ]
            chat_request = ChatRequest(
                messages=messages,
                model=self.settings.default_model,  # Use the configured model
                temperature=self.settings.temperature,
                max_tokens=self.settings.max_tokens
            )
            
            chat_response = self.openai_service.create_chat_completion(chat_request)
            
            # Extract the summary and append model information
            summary = chat_response.choices[0].message.content
            model_used = chat_response.model  # Get the actual model used from the response
            
            # Append model information to the summary
            summary_with_model = f"{summary}\n\nModel used: {model_used}"
            
            return SummaryResponse(summary=summary_with_model)
        except Exception as e:
            raise Exception(f"Failed to generate summary: {str(e)}")
