import httpx
import os
from typing import Dict, Any, Optional
from fastapi import HTTPException

from app.youtubeAPI.models import VideoResponse, VideoStatistics, VideoSnippet


class YouTubeAPIService:
    """Service for interacting with the YouTube API."""
    
    BASE_URL = "https://www.googleapis.com/youtube/v3"
    
    @staticmethod
    async def get_video_statistics(video_id: str, api_key: Optional[str] = None) -> VideoResponse:
        """
        Fetch statistics for a YouTube video by its ID.
        
        Args:
            video_id: The YouTube video ID
            api_key: YouTube API key (optional if set in environment)
            
        Returns:
            VideoResponse object containing video statistics and information
            
        Raises:
            HTTPException: If the API request fails or returns an error
        """
        # Use provided API key or fall back to environment variable
        youtube_api_key = api_key or os.environ.get("YOUTUBE_API_KEY")
        
        if not youtube_api_key:
            raise HTTPException(
                status_code=400,
                detail="YouTube API key is required. Either provide it in the request or set the YOUTUBE_API_KEY environment variable."
            )
        
        # Construct the API URL
        url = f"{YouTubeAPIService.BASE_URL}/videos"
        
        # Set up the query parameters
        params = {
            "id": video_id,
            "key": youtube_api_key,
            "part": "statistics,snippet",
        }
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(url, params=params)
                response.raise_for_status()
                data = response.json()
                
                # Check if video exists
                if not data.get("items"):
                    raise HTTPException(
                        status_code=404,
                        detail=f"Video with ID {video_id} not found"
                    )
                
                # Extract the video data
                video_data = data["items"][0]
                
                # Extract statistics
                stats_data = video_data.get("statistics", {})
                statistics = VideoStatistics(
                    view_count=int(stats_data.get("viewCount", 0)),
                    like_count=int(stats_data.get("likeCount", 0)),
                    comment_count=int(stats_data.get("commentCount", 0)),
                    favorite_count=int(stats_data.get("favoriteCount", 0))
                )
                
                # Extract snippet information
                snippet_data = video_data.get("snippet", {})
                thumbnails = snippet_data.get("thumbnails", {})
                default_thumbnail = thumbnails.get("default", {}).get("url") if thumbnails else None
                
                snippet = VideoSnippet(
                    title=snippet_data.get("title", ""),
                    description=snippet_data.get("description", ""),
                    published_at=snippet_data.get("publishedAt", ""),
                    channel_title=snippet_data.get("channelTitle", ""),
                    tags=snippet_data.get("tags"),
                    thumbnail_url=default_thumbnail
                )
                
                # Create and return the response
                return VideoResponse(
                    video_id=video_id,
                    statistics=statistics,
                    snippet=snippet,
                    raw_data=video_data
                )
                
        except httpx.HTTPStatusError as e:
            # Handle HTTP errors
            error_detail = f"YouTube API error: {e.response.text}" if hasattr(e, 'response') else str(e)
            raise HTTPException(
                status_code=e.response.status_code if hasattr(e, 'response') else 500,
                detail=error_detail
            )
        except Exception as e:
            # Handle other errors
            raise HTTPException(
                status_code=500,
                detail=f"Error fetching video statistics: {str(e)}"
            )
