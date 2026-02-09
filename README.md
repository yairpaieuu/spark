# Website Screenshot Generator

A full-stack React + Node.js application that generates website screenshots at a desktop viewport of 1280x1280px with a beautiful custom overlay displaying the site name.

## Features

- 📸 Capture website screenshots at 1280x1280px resolution
- 🎨 Beautiful gradient overlay with site name
- ⚡ Fast server-side rendering with Playwright
- 💾 Download generated screenshots
- 🎯 Simple and intuitive UI
- 🚀 RESTful API endpoint for programmatic access

## Tech Stack

### Frontend
- React 18
- CSS3 with gradient backgrounds
- Responsive design

### Backend
- Node.js with Express
- Playwright for browser automation and screenshot capture
- DOM manipulation for overlay injection
- CORS enabled for cross-origin requests

## Project Structure

```
spark/
├── backend/
│   ├── server.js           # Express server with screenshot API
│   ├── package.json        # Backend dependencies
│   └── screenshots/        # Generated screenshots directory (auto-created)
├── frontend/
│   ├── public/
│   │   └── index.html      # HTML template
│   ├── src/
│   │   ├── App.js          # Main React component
│   │   ├── App.css         # Application styles
│   │   ├── index.js        # React entry point
│   │   └── index.css       # Global styles
│   └── package.json        # Frontend dependencies
└── README.md               # This file
```

## Prerequisites

Before running the application, ensure you have the following installed:

- Node.js (v16 or higher)
- npm (v7 or higher)

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/yairpaieuu/spark.git
cd spark
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

This will install:
- Express (web framework)
- Playwright (browser automation and screenshot generation)
- CORS (cross-origin resource sharing)

**Note:** Playwright will automatically download the necessary browser binaries during installation. This may take a few minutes.

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

This will install:
- React and React DOM
- React Scripts (Create React App tooling)

## Running the Application

You need to run both the backend and frontend servers:

### Terminal 1: Start the Backend Server

```bash
cd backend
npm start
```

The backend API will start on `http://localhost:5000`

Available endpoints:
- `GET /health` - Health check endpoint
- `POST /api/screenshot` - Screenshot generation endpoint

### Terminal 2: Start the Frontend Development Server

```bash
cd frontend
npm start
```

The React app will start on `http://localhost:3000` and automatically open in your browser.

## Usage

1. Open your browser to `http://localhost:3000`
2. Enter the target website URL (e.g., `https://example.com`)
3. Enter a site name for the overlay (e.g., `Example Site`)
4. Click "Generate Screenshot"
5. Wait for the screenshot to be generated (usually 5-15 seconds)
6. View the screenshot with the custom overlay
7. Click "Download" to save the screenshot

## API Documentation

### POST /api/screenshot

Generate a screenshot with custom overlay.

**Request Body:**
```json
{
  "url": "https://example.com",
  "siteName": "Example Site"
}
```

**Response (Success):**
```json
{
  "success": true,
  "image": "data:image/png;base64,...",
  "siteName": "Example Site",
  "url": "https://example.com"
}
```

**Response (Error):**
```json
{
  "error": "Error message",
  "details": "Detailed error information"
}
```

**Example with cURL:**
```bash
curl -X POST http://localhost:5000/api/screenshot \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com", "siteName": "Example Site"}'
```

## Configuration

### Backend Configuration

Edit `backend/server.js` to customize:

- **Port:** Change `PORT` environment variable (default: 5000)
- **Viewport Size:** Modify the viewport dimensions in the `captureScreenshot` function
- **Overlay Style:** Customize gradient colors, font size, bar height in the DOM injection code via `page.evaluate()`
- **Timeout:** Adjust the `timeout` value for page navigation (default: 30000ms)

### Frontend Configuration

Edit `frontend/src/App.css` to customize:

- Colors and gradients
- Button styles
- Layout and spacing
- Responsive breakpoints

## Building for Production

### Build Frontend

```bash
cd frontend
npm run build
```

This creates an optimized production build in `frontend/build/`.

### Serve Frontend with Backend

You can serve the built frontend from the backend by adding this to `backend/server.js`:

```javascript
const path = require('path');

// Serve static files from React build
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});
```

Then start only the backend server, which will serve both API and frontend.

## Development

### Backend Development with Auto-reload

```bash
cd backend
npm run dev
```

Uses nodemon to automatically restart the server when files change.

### Frontend Development

React Scripts includes hot module reloading by default, so changes are reflected immediately.

## Troubleshooting

### Playwright Installation Issues

If Playwright fails to install browsers:

```bash
cd backend
npx playwright install chromium
```

### Port Already in Use

If port 5000 or 3000 is already in use:

**Backend:**
```bash
PORT=5001 npm start
```

**Frontend:** Edit `frontend/package.json` proxy to match backend port.

### CORS Issues

If you encounter CORS errors, ensure:
1. The backend CORS middleware is properly configured
2. The frontend proxy is pointing to the correct backend URL
3. Both servers are running

## Screenshots

The application generates screenshots with:
- 1280x1280px resolution
- Desktop viewport
- Beautiful gradient overlay bar at the top (60px height)
- Site name centered in the overlay
- Professional gradient background (purple to blue)
- Subtle shadow effect for depth

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

If you encounter any issues or have questions, please open an issue on GitHub.
