import { useState } from 'react'
import './App.css'

const API_URL = 'http://localhost:3001';

function App() {
  const [url, setUrl] = useState('');
  const [siteName, setSiteName] = useState('');
  const [loading, setLoading] = useState(false);
  const [screenshotUrl, setScreenshotUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setScreenshotUrl('');

    try {
      const response = await fetch(`${API_URL}/api/screenshot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, siteName }),
      });

      const data = await response.json();

      if (response.ok) {
        setScreenshotUrl(`${API_URL}${data.screenshotUrl}`);
      } else {
        setError(data.error || 'Failed to generate screenshot');
      }
    } catch (err) {
      setError('Failed to connect to server. Make sure the server is running on port 3001.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <div className="container">
        <h1 className="title">📸 Website Screenshot Generator</h1>
        <p className="subtitle">
          Generate beautiful website screenshots with custom overlays
        </p>

        <form onSubmit={handleSubmit} className="form">
          <div className="input-group">
            <label htmlFor="url">Website URL</label>
            <input
              type="url"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              required
              disabled={loading}
            />
          </div>

          <div className="input-group">
            <label htmlFor="siteName">Site Name</label>
            <input
              type="text"
              id="siteName"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              placeholder="My Awesome Website"
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Generating...' : 'Generate Screenshot'}
          </button>
        </form>

        {error && (
          <div className="error">
            <strong>Error:</strong> {error}
          </div>
        )}

        {screenshotUrl && (
          <div className="screenshot-container">
            <h2>Generated Screenshot</h2>
            <div className="screenshot-wrapper">
              <img src={screenshotUrl} alt="Website screenshot" />
            </div>
            <a 
              href={screenshotUrl} 
              download 
              className="download-btn"
            >
              Download Screenshot
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
