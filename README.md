# Screenshot Generator Application

A full-stack React + Node.js application that generates beautiful website screenshots with custom overlay bars. The application captures screenshots at a desktop viewport of 1280x1280px and adds a stylish top bar with the site name, icon, and timestamp.

## Features

- 🌐 Capture screenshots of any website at 1280x1280px resolution
- 🎨 Beautiful gradient overlay with site name and timestamp
- 📸 Modern React UI for easy screenshot generation
- 💾 Download screenshots directly from the browser
- ⚡ Fast screenshot generation using Playwright
- 🎯 RESTful API for screenshot generation

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **Playwright** - Headless browser automation for screenshots with DOM-based overlay injection
- **CORS** - Cross-origin resource sharing

### Frontend
- **React** - UI framework
- **Vite** - Build tool and dev server
- **Modern CSS** - Beautiful gradient UI design

## Project Structure

```
/
├── backend/
│   ├── server.js          # Express server with screenshot API
│   ├── package.json       # Backend dependencies
│   └── node_modules/      # Backend packages (after install)
├── frontend/
│   ├── src/
│   │   ├── App.jsx        # Main React component
│   │   ├── App.css        # Component styles
│   │   ├── index.css      # Global styles
│   │   └── main.jsx       # React entry point
│   ├── public/            # Static assets
│   ├── index.html         # HTML template
│   ├── package.json       # Frontend dependencies
│   ├── vite.config.js     # Vite configuration
│   └── node_modules/      # Frontend packages (after install)
└── README.md              # This file
```

## Installation

### Prerequisites
- Node.js 18 or higher
- npm or yarn package manager

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Install Playwright browsers:
```bash
npx playwright install chromium
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies (if not already installed):
```bash
npm install
```

## Running the Application

### Start the Backend Server

From the `backend` directory:

```bash
npm start
```

The API server will start on `http://localhost:5000`

For development with auto-restart:
```bash
npm run dev
```

### Start the Frontend Development Server

From the `frontend` directory:

```bash
npm run dev
```

The React app will start on `http://localhost:5173`

## Usage

1. Open your browser and navigate to `http://localhost:5173`
2. Enter the **Website URL** you want to screenshot (e.g., `https://example.com`)
3. Enter a **Site Name** for the overlay (e.g., "My Awesome Website")
4. Click **"📸 Generate Screenshot"**
5. Wait for the screenshot to be generated (may take a few seconds)
6. View the screenshot with the beautiful overlay
7. Click **"💾 Download Screenshot"** to save the image

## API Documentation

### POST `/api/screenshot`

Generate a screenshot with an overlay.

**Request Body:**
```json
{
  "url": "https://example.com",
  "siteName": "Example Website"
}
```

**Response (Success):**
```json
{
  "success": true,
  "image": "data:image/png;base64,iVBORw0KG...",
  "message": "Screenshot generated successfully"
}
```

**Response (Error):**
```json
{
  "error": "Failed to generate screenshot",
  "details": "Error message here"
}
```

### GET `/api/health`

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "message": "Screenshot API is running"
}
```

## Configuration

### Backend Configuration

The backend server port can be configured via environment variable:
```bash
PORT=5000 npm start
```

### Frontend Configuration

Create a `.env` file in the `frontend` directory to configure the API URL:
```
VITE_API_URL=http://localhost:5000
```

## Building for Production

### Backend

The backend doesn't require a build step. Simply ensure dependencies are installed and run:
```bash
npm start
```

### Frontend

Build the frontend for production:
```bash
cd frontend
npm run build
```

The built files will be in the `frontend/dist` directory. You can preview the production build:
```bash
npm run preview
```

## Screenshot Features

The generated screenshots include:

1. **Full page capture** at 1280x1280px viewport
2. **Gradient overlay bar** with beautiful purple-to-pink gradient
3. **Site name** prominently displayed with an icon
4. **Timestamp** showing when the screenshot was taken
5. **Subtle shadow** effect below the overlay bar
6. **High-quality PNG** format for download

## Troubleshooting

### Backend Issues

- **Playwright installation fails**: Try running `npx playwright install chromium` manually
- **Port already in use**: Change the PORT environment variable
- **Screenshot timeout**: Some websites may take longer to load; the timeout is set to 30 seconds

### Frontend Issues

- **Cannot connect to backend**: Ensure the backend is running on port 5000
- **CORS errors**: The backend has CORS enabled; check the console for specific errors
- **Build fails**: Ensure all dependencies are installed with `npm install`

## License

ISC

## Contributing

Feel free to submit issues and enhancement requests!
