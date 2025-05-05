from app.services.openai_service import OpenAIService
from app.summary.models.summary_models import SummaryRequest, SummaryResponse
from app.models.requests import ChatRequest, Message

class SummaryService:
    def __init__(self):
        self.openai_service = OpenAIService()

    async def generate_summary(self, request: SummaryRequest) -> SummaryResponse:
        """Generate a summary for the given text using the provided prompt"""
        try:
            # Create a chat request with the text and prompt
            messages = [
                Message(role="system", content="You are a helpful assistant that generates summaries based on provided instructions."),
                Message(role="user", content=f"Instructions for summarization:\n{request.prompt}\n\nText to summarize:\n{request.text}")
            ]
            chat_request = ChatRequest(messages=messages)
            
            chat_response = self.openai_service.create_chat_completion(chat_request)
            
            # Extract the summary from the response
            summary = chat_response.choices[0].message.content
            
            return SummaryResponse(summary=summary)
        except Exception as e:
            raise Exception(f"Failed to generate summary: {str(e)}")
