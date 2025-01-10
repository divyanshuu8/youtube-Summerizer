from fastapi import FastAPI, HTTPException, Query
from youtube_transcript_api import YouTubeTranscriptApi, TranscriptsDisabled, NoTranscriptFound, VideoUnavailable
from fastapi.responses import JSONResponse
import google.generativeai as genai
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import requests

# Load environment variables from .env file
load_dotenv()

app = FastAPI()

# List of allowed origins (allow all origins in this case)
origins = [
    "*",  # Allow all origins
]

# Add CORS middleware to the app
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods
    allow_headers=["*"],  # Allows all headers
)

# Initialize Gemini (or OpenAI) API key from environment variable
api_key = os.getenv("GEMINI_API_KEY")
youtube_api_key = os.getenv("YOUTUBE_API_KEY")  # YouTube API key for fetching video details
if api_key is None or youtube_api_key is None:
    raise HTTPException(status_code=500, detail="API key(s) not found in environment variables.")

genai.configure(api_key=api_key)

def clean_response(response_text: str):
    """
    Clean up the response by removing unnecessary characters (e.g., asterisks).
    
    Args:
        response_text (str): The raw response text from Gemini.
        
    Returns:
        str: The cleaned response text.
    """
    cleaned_text = response_text.replace("*", "").strip()
    return cleaned_text

def remove_escape_characters(text: str):
    """
    Remove escape characters like backslashes before quotes and replace with single quotes.
    
    Args:
        text (str): The text to be cleaned.
        
    Returns:
        str: The cleaned text with quotes replaced by single quotes.
    """
    return text.replace('\\"', "'").strip()

def summarize_with_gemini(transcript_text: str):
    """
    Use Gemini (or OpenAI) to generate a summary and key bullet points from the transcript text.

    Args:
        transcript_text (str): The complete text of the transcript.

    Returns:
        dict: A dictionary containing a summary and key bullet points.
    """
    try:
        model = genai.GenerativeModel("gemini-1.5-flash")  # Specify Gemini model
        response = model.generate_content(
            f"Summarize this YouTube transcript in 60 words and provide '10 important bullet points:'\n\n{transcript_text}"
        )
        cleaned_content = clean_response(response.text)

        # Split content into summary and bullet points
        summary_end = cleaned_content.find("\n")
        summary = cleaned_content[:summary_end].strip()  
        
        bullet_points_section = cleaned_content[summary_end:].strip()
        bullet_points_start = bullet_points_section.find("10 Important Bullet Points:")
        
        if bullet_points_start != -1:
            bullet_points_text = bullet_points_section[bullet_points_start + len("10 Important Bullet Points:"):].strip()
            bullet_points = [point.strip() for point in bullet_points_text.split("\n") if point.strip()]
        else:
            bullet_points = []

        # Remove escape characters
        cleaned_summary = remove_escape_characters(summary)
        cleaned_bullet_points = [remove_escape_characters(point) for point in bullet_points]

        return {
            "summary": cleaned_summary,
            "bullet_points": cleaned_bullet_points
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error during Gemini summarization: {str(e)}")

def get_video_details(video_id: str):
    """
    Fetch the title and thumbnail URL of a YouTube video using the YouTube Data API.
    
    Args:
        video_id (str): The ID of the YouTube video.

    Returns:
        dict: A dictionary containing the video title and thumbnail URL.
    """
    url = f"https://www.googleapis.com/youtube/v3/videos?part=snippet&id={video_id}&key={youtube_api_key}"
    response = requests.get(url)
    data = response.json()

    if 'items' in data and len(data['items']) > 0:
        title = data['items'][0]['snippet']['title']
        thumbnail_url = data['items'][0]['snippet']['thumbnails']['high']['url']
        return {"title": title, "thumbnail_url": thumbnail_url}
    else:
        raise HTTPException(status_code=404, detail="Video not found.")

@app.get("/captions/")
async def get_captions(video_id: str):
    try:
        # Fetch the transcript using the video_id
        transcript = YouTubeTranscriptApi.get_transcript(video_id)

        # Format the captions as a list of text blocks
        captions = [entry['text'] for entry in transcript]

        return {"video_id": video_id, "captions": captions}

    except VideoUnavailable:
        # Video is unavailable or doesn't exist
        raise HTTPException(status_code=404, detail="Video is unavailable or doesn't exist.")
    except TranscriptsDisabled:
        # Captions are disabled for the video
        raise HTTPException(status_code=404, detail="Captions are disabled for this video.")
    except NoTranscriptFound:
        # No transcript found for the video
        raise HTTPException(status_code=404, detail="No transcript available for this video.")
    except Exception as e:
        # Catch any other exceptions and return a 500 error
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

@app.get("/get-captions/")
async def get_captions(video_id: str = Query(..., description="The YouTube video ID to fetch captions for"), language: str = "en"):
    """
    Fetch captions for a given YouTube video, summarize them, and extract key bullet points.

    Args:
        video_id (str): The YouTube video ID.
        language (str): Language code for the captions (default is 'en').

    Returns:
        JSON response containing the full transcript, summary, key bullet points, title, and thumbnail.
    """
    try:
        # Fetch captions for the given video ID
        transcript = YouTubeTranscriptApi.get_transcript(video_id, languages=[language])

        # Extract the text parts and join them with spaces
        text_only = " ".join([item["text"] for item in transcript])

        # Fetch video title and thumbnail URL
        video_details = get_video_details(video_id)

        # Summarize and generate bullet points
        gemini_result = summarize_with_gemini(text_only)

        return {
            "video_id": video_id,
            "language": language,
            "title": video_details["title"],
            "thumbnail_url": video_details["thumbnail_url"],
            "summary": gemini_result["summary"],
            "bullet_points": gemini_result["bullet_points"]
        }
    except TranscriptsDisabled:
        raise HTTPException(status_code=404, detail="Captions are disabled for this video.")
    except NoTranscriptFound:
        raise HTTPException(status_code=404, detail="No transcript found for this video.")
    except VideoUnavailable:
        raise HTTPException(status_code=404, detail="The video is unavailable.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")

@app.get("/get-captions-simple/")
async def get_captions_simple(video_id: str = Query(..., description="The YouTube video ID to fetch captions for"), language: str = "en"):
    """
    Fetch captions for a given YouTube video, summarize them, and extract key bullet points.
    This route does not fetch the video title or thumbnail.
    """
    try:
        # Fetch captions for the given video ID
        transcript = YouTubeTranscriptApi.get_transcript(video_id, languages=[language])

        # Extract the text parts and join them with spaces
        text_only = " ".join([item["text"] for item in transcript])

        # Summarize and generate bullet points
        gemini_result = summarize_with_gemini(text_only)

        return {
            "video_id": video_id,
            "language": language,
            "summary": gemini_result["summary"],
            "bullet_points": gemini_result["bullet_points"]
        }
    except TranscriptsDisabled:
        raise HTTPException(status_code=404, detail="Captions are disabled for this video.")
    except NoTranscriptFound:
        raise HTTPException(status_code=404, detail="No transcript found for this video.")
    except VideoUnavailable:
        raise HTTPException(status_code=404, detail="The video is unavailable.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")

if __name__ == "__main__":
    import uvicorn

    # Use the port from the environment variable or default to 8000
    port = int(os.getenv("PORT", 8006))
    uvicorn.run(app, host="0.0.0.0", port=port)