import { useState } from 'react'
import './App.css'

function App() {
  const [url, setUrl] = useState('')
  const [siteName, setSiteName] = useState('')
  const [loading, setLoading] = useState(false)
  const [screenshot, setScreenshot] = useState(null)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!url || !siteName) {
      setError('Please provide both URL and site name')
      return
    }

    setLoading(true)
    setError(null)
    setScreenshot(null)

    try {
      const response = await fetch('http://localhost:3001/api/screenshot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, siteName }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate screenshot')
      }

      const blob = await response.blob()
      const imageUrl = URL.createObjectURL(blob)
      setScreenshot(imageUrl)
    } catch (err) {
      setError(err.message)
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <header className="header">
        <h1>📸 Website Screenshot Generator</h1>
        <p className="subtitle">Generate beautiful screenshots with custom overlays</p>
      </header>

      <div className="content">
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label htmlFor="url">Website URL</label>
            <input
              id="url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="siteName">Site Name</label>
            <input
              id="siteName"
              type="text"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              placeholder="My Awesome Website"
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="submit-button" disabled={loading}>
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
          <div className="error">
            <strong>Error:</strong> {error}
          </div>
        )}

        {screenshot && (
          <div className="screenshot-container">
            <h2>Your Screenshot</h2>
            <img src={screenshot} alt="Generated screenshot" className="screenshot" />
            <a 
              href={screenshot} 
              download={`${siteName.replace(/\s+/g, '-')}-screenshot.png`}
              className="download-button"
            >
              Download Screenshot
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
