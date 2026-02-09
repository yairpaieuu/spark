const express = require('express');
const cors = require('cors');
const { chromium } = require('playwright');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Endpoint to generate screenshot
app.post('/api/screenshot', async (req, res) => {
  const { url, siteName } = req.body;

  if (!url || !siteName) {
    return res.status(400).json({ error: 'URL and site name are required' });
  }

  let browser;
  try {
    // Launch browser
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      viewport: { width: 1280, height: 1280 }
    });
    const page = await context.newPage();

    // Navigate to URL with timeout
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });

    // Inject overlay HTML before taking screenshot
    await page.evaluate(({ siteName }) => {
      // Create overlay bar
      const overlay = document.createElement('div');
      overlay.id = 'screenshot-overlay';
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: 60px;
        background: linear-gradient(135deg, rgba(99, 102, 241, 0.95) 0%, rgba(139, 92, 246, 0.95) 100%);
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 20px;
        z-index: 999999;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif;
      `;

      // Create left section with icon and site name
      const leftSection = document.createElement('div');
      leftSection.style.cssText = `
        display: flex;
        align-items: center;
        gap: 15px;
      `;

      const icon = document.createElement('span');
      icon.textContent = '🌐';
      icon.style.cssText = `
        font-size: 32px;
      `;

      const title = document.createElement('span');
      title.textContent = siteName;
      title.style.cssText = `
        color: white;
        font-size: 28px;
        font-weight: bold;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      `;

      leftSection.appendChild(icon);
      leftSection.appendChild(title);

      // Create right section with timestamp
      const rightSection = document.createElement('div');
      const timestamp = document.createElement('span');
      const now = new Date();
      timestamp.textContent = now.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      timestamp.style.cssText = `
        color: rgba(255, 255, 255, 0.9);
        font-size: 14px;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
      `;
      rightSection.appendChild(timestamp);

      overlay.appendChild(leftSection);
      overlay.appendChild(rightSection);

      // Insert at the beginning of body
      document.body.insertBefore(overlay, document.body.firstChild);

      // Shift content down to avoid overlap
      const style = document.createElement('style');
      style.textContent = `
        body { margin-top: 60px !important; }
      `;
      document.head.appendChild(style);
    }, { siteName });

    // Wait a moment for the overlay to render
    await page.waitForTimeout(500);

    // Take screenshot
    const screenshotBuffer = await page.screenshot({ type: 'png', fullPage: false });

    // Close browser
    await browser.close();
    browser = null;

    // Send image as base64
    const base64Image = screenshotBuffer.toString('base64');
    res.json({ 
      success: true, 
      image: `data:image/png;base64,${base64Image}`,
      message: 'Screenshot generated successfully'
    });

  } catch (error) {
    console.error('Screenshot error:', error);
    if (browser) {
      await browser.close();
    }
    res.status(500).json({ 
      error: 'Failed to generate screenshot', 
      details: error.message 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Screenshot API is running' });
});

app.listen(PORT, () => {
  console.log(`Screenshot API server running on port ${PORT}`);
});
