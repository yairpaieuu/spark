const express = require('express');
const cors = require('cors');
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Create screenshots directory if it doesn't exist
const screenshotsDir = path.join(__dirname, 'screenshots');
fs.mkdir(screenshotsDir, { recursive: true });

async function captureScreenshot(url, siteName) {
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
    
    // Navigate to the URL
    await page.goto(url, { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    // Inject the overlay directly into the page before taking screenshot
    await page.evaluate((siteName) => {
      const overlay = document.createElement('div');
      overlay.style.position = 'fixed';
      overlay.style.top = '0';
      overlay.style.left = '0';
      overlay.style.width = '100%';
      overlay.style.height = '60px';
      overlay.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
      overlay.style.display = 'flex';
      overlay.style.alignItems = 'center';
      overlay.style.justifyContent = 'center';
      overlay.style.zIndex = '999999';
      overlay.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.3)';
      overlay.style.fontFamily = 'Arial, sans-serif';
      overlay.style.fontSize = '28px';
      overlay.style.fontWeight = 'bold';
      overlay.style.color = '#ffffff';
      overlay.textContent = siteName;
      document.body.prepend(overlay);
    }, siteName);
    
    // Take screenshot
    const screenshotBuffer = await page.screenshot({
      type: 'png',
      fullPage: false
    });
    
    await browser.close();
    browser = null;
    
    return screenshotBuffer;
    
  } catch (error) {
    if (browser) {
      await browser.close();
    }
    throw error;
  }
}

app.post('/api/screenshot', async (req, res) => {
  try {
    const { url, siteName } = req.body;
    
    if (!url || !siteName) {
      return res.status(400).json({ 
        error: 'Both url and siteName are required' 
      });
    }
    
    // Validate URL
    try {
      new URL(url);
    } catch (e) {
      return res.status(400).json({ 
        error: 'Invalid URL format' 
      });
    }
    
    console.log(`Generating screenshot for ${url} with site name "${siteName}"`);
    
    const screenshotBuffer = await captureScreenshot(url, siteName);
    
    // Send the image as base64
    const base64Image = screenshotBuffer.toString('base64');
    res.json({
      success: true,
      image: `data:image/png;base64,${base64Image}`,
      siteName,
      url
    });
    
  } catch (error) {
    console.error('Error generating screenshot:', error);
    res.status(500).json({ 
      error: 'Failed to generate screenshot',
      details: error.message 
    });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Screenshot API server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Screenshot endpoint: POST http://localhost:${PORT}/api/screenshot`);
});
