from pydantic import BaseModel, validator
import re

class PromptRequest(BaseModel):
    name: str
    prompt: str
    
    @validator('name')
    def validate_name(cls, v):
        # Check if name is non-empty
        if not v or v.isspace():
            raise ValueError("name cannot be empty")
        
        # Check if name is filesystem-safe - allow more characters but still ensure safety
        # Disallow characters that are problematic for filesystems: / \ : * ? " < > |
        if re.search(r'[/\\:*?"<>|]', v):
            raise ValueError("name contains invalid characters. Avoid: / \\ : * ? \" < > |")
        
        return v
    
    @validator('prompt')
    def validate_prompt(cls, v):
        # Check if prompt is non-empty
        if not v or v.isspace():
            raise ValueError("prompt cannot be empty")
        
        return v

class PromptItem(BaseModel):
    name: str
    prompt: str
