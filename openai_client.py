import os
from typing import Optional
from dotenv import load_dotenv
from openai import OpenAI
from openai_config import get_model_config, DEFAULT_MODEL, DEFAULT_TEMPERATURE

class OpenAIClient:
    """A configurable wrapper for OpenAI API"""
    
    def __init__(
        self, 
        api_key: Optional[str] = None,
        model_config: Optional[str] = None,
        default_message: Optional[str] = None
    ):
        """Initialize the OpenAI client with configurable parameters
        
        Args:
            api_key: OpenAI API key. If not provided, will be read from .env file
            model_config: Name of the model configuration to use. If not provided, will be read from .env file
            default_message: Default message to use. If not provided, will be read from .env file
        """
        load_dotenv()
        self.api_key = api_key or os.getenv('OPENAI_API_KEY')
        if not self.api_key:
            raise ValueError("No API key provided. Set OPENAI_API_KEY in .env file")
        
        # Get model configuration
        config_name = model_config or os.getenv('OPENAI_MODEL_CONFIG', DEFAULT_MODEL)
        self.model_config = get_model_config(config_name)
        
        self.default_message = default_message or os.getenv('OPENAI_DEFAULT_MESSAGE', 'Hello! Please respond with a short greeting.')
        self.client = OpenAI(api_key=self.api_key)
    
    def get_completion(
        self, 
        message: Optional[str] = None,
        model_config: Optional[str] = None
    ) -> str:
        """Get a completion from OpenAI API
        
        Args:
            message: The message to send. If not provided, uses default_message
            model_config: Name of the model configuration to use. If not provided, uses default configuration
            
        Returns:
            str: The completion response from OpenAI
        """
        try:
            # Get model configuration
            config = self.model_config
            if model_config:
                config = get_model_config(model_config)
            
            response = self.client.chat.completions.create(
                model=config.name,
                messages=[{"role": "user", "content": message or self.default_message}],
                temperature=config.temperature
            )
            return response.choices[0].message.content
        except Exception as e:
            raise Exception(f"Failed to connect to OpenAI API: {str(e)}")

# Example usage
def main():
    try:
        # Create client instance with default configuration
        client = OpenAIClient()
        
        # Test connection with default settings
        response = client.get_completion()
        print("OpenAI connection test response:", response)
                           
    except Exception as e:
        print(f"Error in main: {str(e)}")

if __name__ == "__main__":
    main() 