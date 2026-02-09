const express = require('express');
const cors = require('cors');
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Ensure screenshots directory exists
const screenshotsDir = path.join(__dirname, 'screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir);
}

// Serve static screenshots
app.use('/screenshots', express.static(screenshotsDir));

// Screenshot endpoint
app.post('/api/screenshot', async (req, res) => {
  const { url, siteName } = req.body;

  if (!url || !siteName) {
    return res.status(400).json({ error: 'URL and site name are required' });
  }

  let browser;
  try {
    console.log(`Generating screenshot for ${url} with site name: ${siteName}`);
    
    // Launch browser
    browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const context = await browser.newContext({
      viewport: { width: 1280, height: 1280 }
    });

    const page = await context.newPage();

    // Navigate to the URL
    await page.goto(url, { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });

    // Add overlay with site name
    await page.evaluate((siteName) => {
      const overlay = document.createElement('div');
      overlay.id = 'screenshot-overlay';
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: 60px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        font-size: 24px;
        font-weight: 600;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 999999;
        letter-spacing: 0.5px;
      `;
      overlay.textContent = siteName;
      document.body.prepend(overlay);

      // Push content down
      const style = document.createElement('style');
      style.textContent = `
        body { 
          margin-top: 60px !important; 
        }
      `;
      document.head.appendChild(style);
    }, siteName);

    // Wait for overlay to be visible
    await page.waitForSelector('#screenshot-overlay', { state: 'visible' });

    // Take screenshot
    const timestamp = Date.now();
    const filename = `screenshot-${timestamp}.png`;
    const screenshotPath = path.join(screenshotsDir, filename);

    await page.screenshot({
      path: screenshotPath,
      fullPage: false
    });

    await browser.close();

    // Return the URL to access the screenshot
    const screenshotUrl = `/screenshots/${filename}`;
    
    console.log(`Screenshot saved: ${filename}`);
    
    res.json({
      success: true,
      screenshotUrl,
      filename
    });

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

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Screenshot server running on port ${PORT}`);
});
