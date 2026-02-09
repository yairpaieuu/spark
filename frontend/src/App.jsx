import { useState } from 'react'
import './App.css'

function App() {
  const [url, setUrl] = useState('')
  const [siteName, setSiteName] = useState('')
  const [loading, setLoading] = useState(false)
  const [screenshot, setScreenshot] = useState(null)
  const [error, setError] = useState(null)

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setScreenshot(null)

    try {
      const response = await fetch(`${API_URL}/api/screenshot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, siteName }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate screenshot')
      }

      setScreenshot(data.image)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    if (!screenshot) return

    const link = document.createElement('a')
    link.href = screenshot
    link.download = `${siteName.replace(/\s+/g, '_')}_screenshot.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1 className="title">🌐 Website Screenshot Generator</h1>
          <p className="subtitle">
            Generate beautiful screenshots with custom overlays
          </p>
        </header>

        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label htmlFor="url" className="label">
              Website URL
            </label>
            <input
              id="url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              required
              className="input"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="siteName" className="label">
              Site Name (for overlay)
            </label>
            <input
              id="siteName"
              type="text"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              placeholder="My Awesome Website"
              required
              className="input"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="button button-primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Generating Screenshot...
              </>
            ) : (
              '📸 Generate Screenshot'
            )}
          </button>
        </form>

        {error && (
          <div className="error">
            <strong>Error:</strong> {error}
          </div>
        )}

        {screenshot && (
          <div className="result">
            <h2 className="result-title">Your Screenshot</h2>
            <div className="screenshot-container">
              <img
                src={screenshot}
                alt={`Screenshot of ${siteName}`}
                className="screenshot"
              />
            </div>
            <button
              onClick={handleDownload}
              className="button button-secondary"
            >
              💾 Download Screenshot
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
