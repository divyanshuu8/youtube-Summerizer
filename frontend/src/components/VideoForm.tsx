import { useState } from 'react';
import { Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function VideoForm() {
  const { isAuthenticated, openSignIn } = useAuth();
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [summary, setSummary] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      openSignIn();
      return;
    }

    setError('');
    setSummary('');
    
    if (!url) {
      setError('Please enter a YouTube URL');
      return;
    }

    try {
      setLoading(true);
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSummary('This is a placeholder summary. The actual API integration needs to be implemented.');
    } catch (err) {
      setError('Failed to get video summary. Please try again.');
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
            <div className="bg-gray-50 rounded-lg p-4 text-gray-700">
              {summary}
            </div>
          </div>
        )}
      </form>
    </div>
  );
}