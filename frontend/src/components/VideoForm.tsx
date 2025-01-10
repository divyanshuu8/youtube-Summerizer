import { useState } from "react";
import { Send } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export function VideoForm() {
  const { isAuthenticated, openSignIn } = useAuth();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState("");
  const [title, setTitle] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [bulletPoints, setBulletPoints] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      openSignIn();
      return;
    }

    setError("");
    setSummary("");
    setTitle("");
    setThumbnailUrl("");
    setBulletPoints([]);

    if (!url) {
      setError("Please enter a YouTube URL");
      return;
    }

    // Regular expression to match YouTube URLs and extract video ID
    const youtubeRegex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(youtubeRegex);

    if (!match) {
      setError("Please enter a valid YouTube URL");
      return;
    }

    // Extracted YouTube video ID
    const videoId = match[1];
    console.log("Video ID:", videoId);

    try {
      setLoading(true);

      // Make the API request to fetch video summary data
      const response = await fetch(
        `https://youtube-summerizer-lukd.onrender.com/get-captions/?video_id=${videoId}`,
        {
          method: "POST",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch video details");
      }
      const data = await response.json();

      // Store the fetched data in states
      setSummary(data.summary);
      setTitle(data.title);
      setThumbnailUrl(data.thumbnail_url);
      setBulletPoints(data.bullet_points);
      // Log the fetched data
      console.log("Fetched data:", data);
      console.log("Summary:", data.summary);
      console.log("Title:", data.title);
      console.log("Thumbnail URL:", data.thumbnail_url);
      console.log("Bullet Points:", data.bullet_points);
    } catch (err) {
      console.log(err);
      setError("Failed to get video summary. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 md:p-8">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
        YouTube Video Summarizer
      </h1>
      <p className="text-gray-600 mb-6">
        Enter a YouTube video URL to get an AI-generated summary
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="url"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            YouTube URL
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="url"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <Send size={18} />
                  <span>Summarize</span>
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg text-sm">
            {error}
          </div>
        )}

        {summary && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              Video Summary
            </h2>

            {/* Thumbnail and Title Section */}
            <div className="flex items-center space-x-4 mb-4">
              <img
                src={thumbnailUrl}
                alt="Thumbnail"
                className="w-40 h-auto rounded-lg object-cover"
              />
              <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            </div>

            {/* Summary and Bullet Points Section */}
            <div className="bg-gray-50 rounded-lg p-4 text-gray-700">
              <p className="mb-4">{summary}</p>

              {/* Bullet Points */}
              <ul className="list-disc pl-6 space-y-2">
                {bulletPoints.map((point, index) => (
                  <li key={index} className="text-gray-600">
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
