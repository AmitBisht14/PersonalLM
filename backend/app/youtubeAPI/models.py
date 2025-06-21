from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any


class VideoStatisticsRequest(BaseModel):
    """Request model for fetching YouTube video statistics."""
    video_id: str = Field(..., description="YouTube video ID")
    api_key: Optional[str] = Field(None, description="YouTube API key (optional if set in environment)")


class VideoStatistics(BaseModel):
    """Model for YouTube video statistics."""
    view_count: int = Field(0, description="Number of views")
    like_count: int = Field(0, description="Number of likes")
    comment_count: int = Field(0, description="Number of comments")
    favorite_count: int = Field(0, description="Number of times favorited")


class VideoSnippet(BaseModel):
    """Model for YouTube video snippet information."""
    title: str = Field("", description="Video title")
    description: str = Field("", description="Video description")
    published_at: str = Field("", description="Publication date")
    channel_title: str = Field("", description="Channel title")
    tags: Optional[List[str]] = Field(None, description="Video tags")
    thumbnail_url: Optional[str] = Field(None, description="URL of the default thumbnail")


class VideoResponse(BaseModel):
    """Response model for YouTube video information."""
    video_id: str = Field(..., description="YouTube video ID")
    statistics: VideoStatistics = Field(..., description="Video statistics")
    snippet: VideoSnippet = Field(..., description="Video snippet information")
    raw_data: Optional[Dict[str, Any]] = Field(None, description="Raw API response data")


class ErrorResponse(BaseModel):
    """Error response model."""
    error: str = Field(..., description="Error message")
    details: Optional[str] = Field(None, description="Additional error details")
