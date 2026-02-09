const express = require('express');
const cors = require('cors');
const { chromium } = require('playwright');
const { createCanvas, loadImage } = require('canvas');
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
    
    // Take screenshot
    const screenshotBuffer = await page.screenshot({
      type: 'png',
      fullPage: false
    });
    
    await browser.close();
    browser = null;
    
    // Create canvas for overlay
    const canvas = createCanvas(1280, 1280);
    const ctx = canvas.getContext('2d');
    
    // Load the screenshot onto canvas
    const screenshotImg = await loadImage(screenshotBuffer);
    ctx.drawImage(screenshotImg, 0, 0);
    
    // Draw top bar overlay
    const barHeight = 60;
    const gradient = ctx.createLinearGradient(0, 0, 1280, 0);
    gradient.addColorStop(0, '#667eea');
    gradient.addColorStop(1, '#764ba2');
    
    // Draw semi-transparent bar
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1280, barHeight);
    
    // Add subtle shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 2;
    ctx.fillRect(0, 0, 1280, barHeight);
    ctx.shadowColor = 'transparent';
    
    // Draw site name text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(siteName, 640, barHeight / 2);
    
    // Convert canvas to buffer
    const finalBuffer = canvas.toBuffer('image/png');
    
    return finalBuffer;
    
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
