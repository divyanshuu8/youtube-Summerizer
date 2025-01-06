const express = require("express");
const axios = require("axios");

const app = express();
const port = 5000;

// Replace with your API key
const apiKey = "AIzaSyD8BEHvvRzvpyAiTgX4Q5w740GCjU8oTig";

// Function to get video captions (IDs)
const getCaptions = async (videoId) => {
  try {
    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/captions",
      {
        params: {
          part: "snippet",
          videoId: videoId,
          key: apiKey,
        },
      }
    );

    // Check if there are captions available
    if (response.data.items.length === 0) {
      return "No captions found for this video.";
    }

    // Extract and return caption IDs
    const captionIds = response.data.items.map((item) => item.id);
    return captionIds;
  } catch (error) {
    console.error("Error fetching captions:", error);
    return "An error occurred while fetching captions.";
  }
};

// Function to get caption text by captionId
const getCaptionText = async (captionId) => {
  try {
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/captions/${captionId}`,
      {
        params: {
          tfmt: "ttml", // or "srv1", "srv2", "srv3" for different formats
          key: apiKey,
        },
      }
    );

    // Return the caption text
    return response.data;
  } catch (error) {
    console.error("Error fetching caption text:", error);
    return "An error occurred while fetching caption text.";
  }
};

// Endpoint to get caption IDs for a video
app.get("/captions/:videoId", async (req, res) => {
  const { videoId } = req.params;

  const captions = await getCaptions(videoId);

  res.json(captions);
});

// Endpoint to get caption text by ID
app.get("/caption/:captionId", async (req, res) => {
  const { captionId } = req.params;

  const captionText = await getCaptionText(captionId);

  res.send(captionText); // Sends the raw caption data (in TTML format)
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
