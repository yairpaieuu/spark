# Quick Start Guide

## Prerequisites
- Node.js 16+ installed
- At least 2GB of free disk space

## Installation & Setup (5 minutes)

### 1. Install Backend Dependencies
```bash
cd backend
npm install
npx playwright install chromium
```

### 2. Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

## Running the Application

### Terminal 1 - Start Backend Server
```bash
cd backend
npm start
```
Server will start on http://localhost:3001

### Terminal 2 - Start Frontend Server
```bash
cd frontend
npm run dev
```
Frontend will start on http://localhost:5173

## Usage

1. Open http://localhost:5173 in your browser
2. Enter a website URL (e.g., `https://github.com`)
3. Enter a site name (e.g., `GitHub`)
4. Click "Generate Screenshot"
5. Wait 5-15 seconds for the screenshot to be generated
6. Click "Download Screenshot" to save the image

## Example URLs to Try
- http://localhost:3001/health (local health check)
- https://example.com (if external access is available)
- Any publicly accessible website URL

## Troubleshooting

### Port Already in Use
If port 3001 or 5173 is busy:
- Backend: `PORT=3002 npm start`
- Frontend: Vite will automatically suggest an alternative port

### Screenshot Generation Fails
- Ensure the target URL is accessible
- Check that Playwright browsers are installed: `npx playwright install chromium`
- Some websites may block headless browsers

### Network Issues
- If you're behind a proxy, configure it for npm and Playwright
- Ensure your firewall allows Node.js to make HTTP requests

## Production Deployment

### Build Frontend
```bash
cd frontend
npm run build
```
Output will be in `frontend/dist/`

### Serve Frontend with Backend
You can serve the built frontend files using Express or any static file server.

### Environment Variables
Create a `.env` file in the backend directory:
```
PORT=3001
```

## Support
For issues or questions, please refer to the main README.md file.
