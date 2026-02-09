# Website Screenshot Generator 📸

A modern React + Node.js application that generates website screenshots with beautiful custom overlays. Screenshots are captured at a 1280x1280px desktop viewport with a customizable top bar displaying the site name.

## Features

- 🎨 Beautiful gradient UI with responsive design
- 📸 High-quality website screenshots using Playwright
- 🎯 Custom overlay with site name and URL
- 💾 Download screenshots as PNG files
- ⚡ Fast and reliable screenshot generation
- 🔒 CORS-enabled API for secure cross-origin requests

## Project Structure

```
spark/
├── backend/          # Node.js Express server
│   ├── server.js     # Main server with screenshot API
│   └── package.json  # Backend dependencies
├── frontend/         # React application
│   ├── src/
│   │   ├── App.jsx   # Main React component
│   │   ├── App.css   # Application styles
│   │   └── ...
│   └── package.json  # Frontend dependencies
└── README.md         # This file
```

## Prerequisites

- Node.js 16+ and npm
- At least 2GB of free disk space (for Playwright browsers)

## Installation

### 1. Install Backend Dependencies

```bash
cd backend
npm install
```

This will install:
- Express (web server)
- Playwright (browser automation for screenshots)
- CORS (cross-origin resource sharing)

### 2. Install Playwright Browsers

After installing backend dependencies, Playwright needs to download browser binaries:

```bash
cd backend
npx playwright install chromium
```

### 3. Install Frontend Dependencies

```bash
cd frontend
npm install
```

## Running the Application

You need to run both the backend and frontend servers.

### Start the Backend Server

```bash
cd backend
npm start
```

The backend server will start on `http://localhost:3001`

For development with auto-reload:
```bash
npm run dev
```

### Start the Frontend Development Server

In a new terminal:

```bash
cd frontend
npm run dev
```

The frontend will start on `http://localhost:5173` (or another port if 5173 is busy)

## Usage

1. Open your browser and navigate to `http://localhost:5173`
2. Enter the target website URL (e.g., `https://example.com`)
3. Enter a site name for the overlay (e.g., "My Awesome Website")
4. Click "Generate Screenshot"
5. Wait for the screenshot to be generated (usually 5-15 seconds)
6. Download the screenshot using the "Download Screenshot" button

## API Documentation

### POST /api/screenshot

Generates a screenshot of a website with a custom overlay.

**Request Body:**
```json
{
  "url": "https://example.com",
  "siteName": "Example Site"
}
```

**Response:**
- Content-Type: `image/png`
- Body: PNG image data

**Error Response:**
```json
{
  "error": "Error message",
  "message": "Detailed error description"
}
```

## Building for Production

### Backend
The backend doesn't require a build step. Simply use:
```bash
npm start
```

### Frontend
Build the frontend for production:

```bash
cd frontend
npm run build
```

This creates an optimized production build in the `frontend/dist` directory.

To preview the production build:
```bash
npm run preview
```

## Configuration

### Backend Configuration

The backend server can be configured via environment variables:

- `PORT`: Server port (default: 3001)

Create a `.env` file in the backend directory:
```
PORT=3001
```

### Frontend Configuration

Update the API URL in `frontend/src/App.jsx` if deploying to a different domain:

```javascript
const response = await fetch('YOUR_BACKEND_URL/api/screenshot', {
  // ...
})
```

## Screenshot Engine Details

The application uses **Playwright** with the following configuration:

- **Browser**: Chromium (headless mode)
- **Viewport**: 1280x1280px
- **Scale Factor**: 1x
- **Wait Strategy**: Network idle (ensures all resources are loaded)
- **Timeout**: 30 seconds

### Overlay Specifications

- **Bar Height**: 60px
- **Background**: Gradient from indigo to purple with 95% opacity
- **Font**: Bold Arial, 28px for site name
- **Secondary Text**: 14px for URL display
- **Shadow**: Subtle shadow with 10px blur for depth
- **Implementation**: DOM injection technique (no native dependencies)

## Troubleshooting

### Port Already in Use
If you see "port already in use" errors:
- Change the backend port in `backend/server.js` or use `PORT=3002 npm start`
- The frontend will auto-assign a different port if 5173 is busy

### Playwright Installation Issues
If Playwright browsers fail to install:
```bash
cd backend
npx playwright install-deps  # Install system dependencies
npx playwright install chromium
```

### Screenshot Fails
- Ensure the target URL is accessible and doesn't block automated browsers
- Check that the URL includes the protocol (http:// or https://)
- Some sites may have anti-bot protection that blocks headless browsers

## Dependencies

### Backend
- express: ^4.18.2
- cors: ^2.8.5
- playwright: ^1.40.0

### Frontend
- react: ^19.2.0
- react-dom: ^19.2.0
- vite: ^7.2.5 (rolldown-vite)

## License

ISC

## Contributing

Feel free to submit issues and enhancement requests!
