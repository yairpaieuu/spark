import React, { useState } from 'react';
import './App.css';

function App() {
  const [url, setUrl] = useState('');
  const [siteName, setSiteName] = useState('');
  const [screenshot, setScreenshot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setScreenshot(null);

    try {
      const response = await fetch('/api/screenshot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, siteName }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate screenshot');
      }

      setScreenshot(data.image);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!screenshot) return;

    const link = document.createElement('a');
    link.href = screenshot;
    link.download = `${siteName.replace(/\s+/g, '-').toLowerCase()}-screenshot.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="App">
      <div className="container">
        <header className="header">
          <h1>🖼️ Website Screenshot Generator</h1>
          <p className="subtitle">Capture beautiful website screenshots with custom overlay</p>
        </header>

        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="url">Website URL</label>
            <input
              type="url"
              id="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="siteName">Site Name (for overlay)</label>
            <input
              type="text"
              id="siteName"
              placeholder="Example Site"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner"></span>
                Generating...
              </>
            ) : (
              'Generate Screenshot'
            )}
          </button>
        </form>

        {error && (
          <div className="error-message">
            <strong>Error:</strong> {error}
          </div>
        )}

        {screenshot && (
          <div className="screenshot-container">
            <div className="screenshot-header">
              <h2>Screenshot Preview</h2>
              <button onClick={handleDownload} className="btn-download">
                📥 Download
              </button>
            </div>
            <div className="screenshot-wrapper">
              <img src={screenshot} alt="Generated screenshot" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
