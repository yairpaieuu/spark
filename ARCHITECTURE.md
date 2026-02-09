# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         User Browser                         │
│                    (http://localhost:5173)                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              React Frontend (Vite)                    │  │
│  │  - URL Input Form                                     │  │
│  │  - Site Name Input                                    │  │
│  │  - Screenshot Display                                 │  │
│  │  - Download Button                                    │  │
│  └────────────────┬─────────────────────────────────────┘  │
└───────────────────┼─────────────────────────────────────────┘
                    │ HTTP POST Request
                    │ {url, siteName}
                    ▼
┌─────────────────────────────────────────────────────────────┐
│             Node.js Backend (Express)                        │
│              (http://localhost:3001)                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  /api/screenshot Endpoint                             │  │
│  │  1. Receive URL and Site Name                         │  │
│  │  2. Launch Playwright Browser                         │  │
│  │  3. Navigate to URL                                   │  │
│  │  4. Inject Custom Overlay                             │  │
│  │  5. Capture Screenshot (1280x1280)                    │  │
│  │  6. Return PNG Image                                  │  │
│  └──────────────────┬───────────────────────────────────┘  │
└────────────────────┼────────────────────────────────────────┘
                     │
                     ▼
          ┌────────────────────┐
          │   Playwright        │
          │   Chromium Engine   │
          │  (Headless Browser) │
          └────────────────────┘
```

## Request Flow

### 1. User Interaction
- User opens React app in browser
- Enters target website URL
- Enters custom site name for overlay
- Clicks "Generate Screenshot" button

### 2. Frontend Processing
- Validates form inputs
- Shows loading state with spinner
- Sends POST request to backend API
- Receives PNG image as blob
- Displays screenshot in UI
- Provides download functionality

### 3. Backend Processing
```javascript
POST /api/screenshot
  ├─ Validate request body (url, siteName)
  ├─ Launch Chromium browser
  │   └─ Headless mode
  │   └─ 1280x1280 viewport
  ├─ Navigate to target URL
  │   └─ Wait for networkidle
  │   └─ 30 second timeout
  ├─ Inject custom overlay
  │   └─ Create DOM elements
  │   └─ Style with gradient
  │   └─ Add site name and URL
  ├─ Wait for rendering (500ms)
  ├─ Capture screenshot
  │   └─ PNG format
  │   └─ Viewport only (not full page)
  ├─ Close browser
  └─ Return image buffer
```

## Component Architecture

### Frontend Components

```
App.jsx (Main Component)
├─ State Management
│   ├─ url (string)
│   ├─ siteName (string)
│   ├─ loading (boolean)
│   ├─ screenshot (blob URL)
│   └─ error (string)
│
├─ UI Elements
│   ├─ Header
│   │   ├─ Title
│   │   └─ Subtitle
│   │
│   ├─ Form
│   │   ├─ URL Input
│   │   ├─ Site Name Input
│   │   └─ Submit Button
│   │
│   ├─ Error Display
│   │
│   └─ Screenshot Section
│       ├─ Preview Image
│       └─ Download Button
│
└─ Event Handlers
    ├─ handleSubmit()
    │   ├─ Validate inputs
    │   ├─ Make API call
    │   ├─ Handle response
    │   └─ Update state
    │
    └─ Download functionality
        └─ Browser download API
```

### Backend Architecture

```
server.js
├─ Express Setup
│   ├─ CORS middleware
│   ├─ JSON parser
│   └─ Port configuration
│
├─ Endpoints
│   ├─ GET /health
│   │   └─ Health check
│   │
│   └─ POST /api/screenshot
│       ├─ Input validation
│       ├─ Browser automation
│       │   ├─ Launch browser
│       │   ├─ Create context
│       │   ├─ Open page
│       │   ├─ Navigate
│       │   ├─ Inject overlay
│       │   └─ Screenshot
│       │
│       ├─ Error handling
│       └─ Response formatting
│
└─ Playwright Integration
    └─ Chromium browser
```

## Data Flow

### Screenshot Generation Flow

```
[User Input]
    ↓
[Frontend Validation]
    ↓
[API Request]
    ↓
[Backend Validation]
    ↓
[Launch Browser] → [Chromium Engine]
    ↓
[Load Target Page] ← [Target Website]
    ↓
[Inject Overlay]
    ↓
[Wait for Render]
    ↓
[Capture Screenshot]
    ↓
[Close Browser]
    ↓
[Return PNG Buffer]
    ↓
[Frontend Receives Blob]
    ↓
[Display Image]
    ↓
[Download Option]
```

## Technology Stack Details

### Frontend Technologies
- **React 19**: UI framework
- **Vite 7.2**: Build tool with Rolldown
- **CSS3**: Styling with gradients, flexbox, transitions
- **Fetch API**: HTTP requests to backend

### Backend Technologies
- **Node.js 18+**: Runtime environment
- **Express 4.18**: Web server framework
- **Playwright 1.40**: Browser automation
- **CORS 2.8**: Cross-origin resource sharing

### Screenshot Technology
- **Chromium**: Headless browser engine
- **DOM Injection**: Overlay rendering technique
- **PNG Format**: Screenshot output format
- **1280x1280px**: Fixed viewport size

## Performance Considerations

### Frontend Performance
- Lazy loading of screenshot images
- Optimistic UI updates
- Error boundary handling
- Responsive design with CSS

### Backend Performance
- Single browser instance per request
- Automatic cleanup on errors
- Network idle detection
- Timeout protection (30s)

### Optimization Opportunities
- Browser instance pooling
- Screenshot caching
- Image compression
- CDN for static assets

## Security Features

### Input Validation
- URL format validation
- Site name length limits
- Malicious URL detection

### CORS Configuration
- Allowed origins whitelist
- Secure headers
- Method restrictions

### Browser Security
- Sandboxed browser execution
- No-sandbox flag for Docker
- Isolated contexts per request

### Error Handling
- Safe error messages
- No stack trace exposure
- Browser cleanup on errors

## Scalability

### Horizontal Scaling
- Stateless design
- Load balancer compatible
- Container-ready architecture

### Vertical Scaling
- Browser resource management
- Memory cleanup
- CPU-bound operations

### Bottlenecks
- Browser launch time (~2s)
- Page load time (varies)
- Screenshot capture (~1s)

## Deployment Options

1. **Development**: Dual terminal (frontend + backend)
2. **Docker**: Containerized with docker-compose
3. **Cloud**: Deploy to AWS, Azure, or GCP
4. **Serverless**: Adapt for Lambda/Cloud Functions

## Monitoring & Logging

### Key Metrics
- Screenshot generation time
- Success/failure rate
- Browser memory usage
- API response times

### Logging Points
- Request received
- Browser launched
- Page loaded
- Screenshot captured
- Request completed
- Errors at any stage

## Future Enhancements

### Potential Features
- Multiple viewport sizes
- Full-page screenshots
- Custom overlay templates
- Screenshot history
- Batch processing
- Authentication
- Rate limiting
- Screenshot annotations
- PDF export
- Custom fonts in overlay
- Video recording
- Mobile device emulation

### Technical Improvements
- Browser instance pooling
- Redis caching
- Queue-based processing
- WebSocket progress updates
- S3 storage integration
- CDN distribution
