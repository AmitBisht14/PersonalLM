import os
from typing import Optional
from dotenv import load_dotenv
from openai import OpenAI

class OpenAIClient:
    """A simple wrapper for testing OpenAI API connection"""
    
    def __init__(self, api_key: Optional[str] = None):
        """Initialize the OpenAI client with API key"""
        load_dotenv()
        self.api_key = api_key or os.getenv('OPENAI_API_KEY')
        if not self.api_key:
            raise ValueError("No API key provided. Set OPENAI_API_KEY in .env file")
        self.client = OpenAI(api_key=self.api_key)
    
    def test_connection(self) -> str:
        """Test the OpenAI connection with a simple prompt"""
        try:
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": "Hello! Please respond with a short greeting."}],
                temperature=0.7
            )
            return response.choices[0].message.content
        except Exception as e:
            raise Exception(f"Failed to connect to OpenAI API: {str(e)}")

# Example usage
def main():
    try:
        # Create client instance
        client = OpenAIClient()
        
        # Test connection
        response = client.test_connection()
        print("OpenAI connection test response:", response)
            
    except Exception as e:
        print(f"Error in main: {str(e)}")

if __name__ == "__main__":
    main() 