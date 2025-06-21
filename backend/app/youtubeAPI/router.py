from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Optional

from app.youtubeAPI.models import VideoStatisticsRequest, VideoResponse, ErrorResponse
from app.youtubeAPI.service import YouTubeAPIService

# Create router
router = APIRouter(
    prefix="/api/youtube",
    tags=["youtube"],
    responses={
        404: {"model": ErrorResponse, "description": "Video not found"},
        400: {"model": ErrorResponse, "description": "Bad request"},
        500: {"model": ErrorResponse, "description": "Internal server error"},
    }
)


@router.get(
    "/video/{video_id}/statistics",
    response_model=VideoResponse,
    summary="Get YouTube video statistics",
    description="Fetch statistics and information for a YouTube video by its ID"
)
async def get_video_statistics(
    video_id: str,
    api_key: Optional[str] = Query(None, description="YouTube API key (optional if set in environment)")
) -> VideoResponse:
    """
    Get statistics for a YouTube video by its ID.
    
    - **video_id**: The YouTube video ID
    - **api_key**: Optional YouTube API key (can be set in environment variable)
    
    Returns video statistics including view count, like count, and basic video information.
    """
    return await YouTubeAPIService.get_video_statistics(video_id, api_key)


@router.post(
    "/video/statistics",
    response_model=VideoResponse,
    summary="Get YouTube video statistics (POST)",
    description="Fetch statistics and information for a YouTube video by its ID using POST method"
)
async def post_video_statistics(request: VideoStatisticsRequest) -> VideoResponse:
    """
    Get statistics for a YouTube video by its ID using POST method.
    
    - **request**: Request body containing video_id and optional api_key
    
    Returns video statistics including view count, like count, and basic video information.
    """
    return await YouTubeAPIService.get_video_statistics(request.video_id, request.api_key)
