from dataclasses import dataclass
from typing import Dict, List

@dataclass
class ModelConfig:
    """Configuration for a specific model"""
    name: str
    temperature: float
    description: str

# Available model configurations
MODEL_CONFIGS: Dict[str, ModelConfig] = {
    "gpt-3.5-turbo": ModelConfig(
        name="gpt-3.5-turbo",
        temperature=0.7,
        description="Fast and cost-effective model for most tasks"
    ),
    "gpt-4": ModelConfig(
        name="gpt-4",
        temperature=0.7,
        description="Most capable model for complex tasks"
    ),
    "gpt-3.5-turbo-creative": ModelConfig(
        name="gpt-3.5-turbo",
        temperature=0.9,
        description="Creative mode with higher temperature"
    ),
    "gpt-3.5-turbo-precise": ModelConfig(
        name="gpt-3.5-turbo",
        temperature=0.3,
        description="Precise mode with lower temperature"
    ),
}

# Default configuration
DEFAULT_MODEL = "gpt-3.5-turbo"
DEFAULT_TEMPERATURE = 0.7

def get_model_config(model_name: str) -> ModelConfig:
    """Get configuration for a specific model
    
    Args:
        model_name: Name of the model configuration to retrieve
        
    Returns:
        ModelConfig: Configuration for the specified model
        
    Raises:
        ValueError: If the model configuration doesn't exist
    """
    if model_name not in MODEL_CONFIGS:
        raise ValueError(f"Model configuration '{model_name}' not found")
    return MODEL_CONFIGS[model_name]

def list_available_models() -> List[str]:
    """Get list of available model configurations
    
    Returns:
        List[str]: List of available model configuration names
    """
    return list(MODEL_CONFIGS.keys()) 