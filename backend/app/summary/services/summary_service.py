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
                Message(role="system", content="You are a seasoned podcast scriptwriter creating fun, emotional, structured podcast scripts for 'Two mics, One Vibe' in HEnglish. Follow all formatting, tone, and structural cues strictly\nI want you to act as a dialogue writter for the podcast. This podcast has conversation between A guy and his girlfriend who read something and had a discussion on that topic\nOne of the voice is an exciting voice (Name: Celine(Girlfriend))\nAnother voice brings depth and intrigue. (Name: Jesse(Boyfriend))\nStrictly follow this: Each person will speak for at least for 15-20seconds and then other person will start speaking, which means in a 5minutes script switching of speaker should happen 8 times maximum. For expressions use these tags [laughs], [laughs harder], [starts laughing], [wheezing], [whispers], [sighs], [exhales], [sarcastic], [curious], [excited], [crying], [snorts], [mischievously]\n"),
                Message(role="user", content=f"Instructions for scriptwriter:\n{request.prompt}\nContent for generating script:\n{request.text}")
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
