# Spark - Website Screenshot Generator

A full-stack React + Node.js application that generates beautiful website screenshots with custom overlays. The app captures websites at a desktop viewport of 1280x1280px and adds a stylish top bar with the site name.

## Features

- 🎨 Beautiful, modern UI built with React and Vite
- 📸 Server-side screenshot generation using Playwright
- 🎯 Custom viewport size (1280x1280px)
- ✨ Gradient overlay with site name
- 💾 Download screenshots directly
- 🚀 Fast and responsive

## Project Structure

```
spark/
├── client/                # React frontend (Vite)
│   ├── src/
│   │   ├── App.jsx       # Main React component
│   │   ├── App.css       # Component styles
│   │   ├── index.css     # Global styles
│   │   └── main.jsx      # Entry point
│   └── package.json
├── server/                # Node.js backend (Express + Playwright)
│   ├── server.js         # Express server with screenshot API
│   ├── package.json
│   └── screenshots/      # Generated screenshots (auto-created)
└── README.md
```

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/yairpaieuu/spark.git
cd spark
```

### 2. Install server dependencies

```bash
cd server
npm install
```

This will install:
- Express.js (web server)
- Playwright (screenshot engine)
- CORS (cross-origin support)

Playwright will automatically download the necessary browser binaries during installation.

### 3. Install client dependencies

```bash
cd ../client
npm install
```

This will install:
- React
- Vite (build tool)
- Other frontend dependencies

## Running the Application

You need to run both the server and client simultaneously.

### Terminal 1: Start the Backend Server

```bash
cd server
npm start
```

The server will start on `http://localhost:3001`

For development with auto-reload:
```bash
npm run dev
```

### Terminal 2: Start the Frontend

```bash
cd client
npm run dev
```

The client will start on `http://localhost:5173` (or another port if 5173 is busy)

## Usage

1. Open your browser and navigate to `http://localhost:5173`
2. Enter a valid website URL (e.g., `https://example.com`)
3. Enter a site name that will appear in the overlay
4. Click "Generate Screenshot"
5. Wait for the screenshot to be generated
6. View and download your screenshot!

## API Endpoints

### POST `/api/screenshot`

Generates a screenshot of the specified URL with a custom overlay.

**Request Body:**
```json
{
  "url": "https://example.com",
  "siteName": "My Awesome Site"
}
```

**Response:**
```json
{
  "success": true,
  "screenshotUrl": "/screenshots/screenshot-1234567890.png",
  "filename": "screenshot-1234567890.png"
}
```

### GET `/api/health`

Health check endpoint to verify the server is running.

**Response:**
```json
{
  "status": "ok",
  "message": "Server is running"
}
```

## Configuration

### Viewport Size

The default viewport is 1280x1280px. To change it, edit `server/server.js`:

```javascript
const context = await browser.newContext({
  viewport: { width: 1280, height: 1280 }
});
```

### Overlay Styling

The overlay bar can be customized in `server/server.js` in the `page.evaluate()` section:

```javascript
overlay.style.cssText = `
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  // ... customize styles here
`;
```

### Port Configuration

- **Server Port:** Set via environment variable `PORT` or defaults to 3001
- **Client Port:** Configured in `client/vite.config.js`

To change the server port:
```bash
PORT=4000 npm start
```

## Building for Production

### Build the Client

```bash
cd client
npm run build
```

This creates an optimized production build in `client/dist/`.

### Serving in Production

You can serve the built client with the Express server:

```bash
cd server
# Add static serving to server.js
npm start
```

Or use a separate web server like Nginx to serve the static files.

## Troubleshooting

### Playwright Installation Issues

If Playwright browsers aren't downloading correctly:

```bash
cd server
npx playwright install chromium
```

### CORS Issues

Make sure the server is running on port 3001 and the client is making requests to the correct URL. Check `client/src/App.jsx` for the `API_URL` constant.

### Port Already in Use

If port 3001 or 5173 is already in use, you can:
- Stop the process using that port
- Change the port in the respective configuration

## Technologies Used

### Frontend
- **React** - UI library
- **Vite** - Build tool and dev server
- **CSS3** - Styling with gradients and animations

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **Playwright** - Browser automation and screenshots
- **CORS** - Cross-origin resource sharing

## License

ISC

## Contributing

Feel free to submit issues and pull requests!

