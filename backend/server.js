const express = require('express');
const cors = require('cors');
const { chromium } = require('playwright');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Screenshot endpoint
app.post('/api/screenshot', async (req, res) => {
  const { url, siteName } = req.body;

  if (!url || !siteName) {
    return res.status(400).json({ error: 'URL and site name are required' });
  }

  let browser;
  try {
    // Launch browser
    browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const context = await browser.newContext({
      viewport: { width: 1280, height: 1280 },
      deviceScaleFactor: 1,
    });

    const page = await context.newPage();

    // Navigate to URL
    await page.goto(url, {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    // Inject the overlay bar into the page
    await page.evaluate(({ siteName, url }) => {
      // Create overlay container
      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 60px;
        background: linear-gradient(135deg, rgba(99, 102, 241, 0.95) 0%, rgba(168, 85, 247, 0.95) 100%);
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        z-index: 2147483647;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 30px;
        box-sizing: border-box;
      `;

      // Add site name
      const nameElement = document.createElement('div');
      nameElement.textContent = siteName;
      nameElement.style.cssText = `
        color: white;
        font-family: Arial, sans-serif;
        font-size: 28px;
        font-weight: bold;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
      `;
      overlay.appendChild(nameElement);

      // Add URL
      const urlElement = document.createElement('div');
      const displayUrl = url.length > 80 ? url.substring(0, 80) + '...' : url;
      urlElement.textContent = displayUrl;
      urlElement.style.cssText = `
        color: rgba(255, 255, 255, 0.8);
        font-family: Arial, sans-serif;
        font-size: 14px;
        text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
      `;
      overlay.appendChild(urlElement);

      document.body.appendChild(overlay);
    }, { siteName, url });

    // Wait a moment for the overlay to render
    await page.waitForTimeout(500);

    // Take screenshot
    const screenshot = await page.screenshot({
      type: 'png',
      fullPage: false
    });

    await browser.close();

    // Send the image
    res.set('Content-Type', 'image/png');
    res.send(screenshot);

  } catch (error) {
    console.error('Screenshot error:', error);
    if (browser) {
      await browser.close();
    }
    res.status(500).json({ 
      error: 'Failed to generate screenshot', 
      message: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Screenshot service running on port ${PORT}`);
});
