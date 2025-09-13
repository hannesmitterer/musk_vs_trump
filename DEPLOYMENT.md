# GitHub Pages Deployment Guide

This guide explains how to deploy the Musk vs Trump Reputation Tracker to GitHub Pages.

## Quick Setup

The `index.html` file in the repository root is already configured for GitHub Pages deployment. 

### Option 1: GitHub Pages with Mock Data (Easiest)

1. Go to your repository settings
2. Navigate to "Pages" section
3. Select "Deploy from a branch" 
4. Choose "main" branch and "/ (root)" folder
5. Save and wait for deployment

The site will work immediately with demo data and graceful offline fallback.

### Option 2: GitHub Pages with Live Backend

If you want to connect to a live backend API:

1. Deploy your backend server (e.g., using Heroku, Railway, or similar)
2. Update the backend URL in `index.html` around line 459:
   ```javascript
   this.apiUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
       ? 'http://localhost:5000/api/reputation'
       : 'https://YOUR-BACKEND-DOMAIN.com/api/reputation'; // Update this line
   ```
3. Commit and push the changes
4. Follow Option 1 steps above

## Features

✅ **Responsive Design** - Works on desktop and mobile  
✅ **Live Data** - Connects to backend API when available  
✅ **Offline Fallback** - Shows demo data when backend is unavailable  
✅ **Real-time Updates** - Automatically refreshes data every 30 seconds  
✅ **GitHub Pages Ready** - No build step required  

## Local Development

To test locally:

1. Start the backend server:
   ```bash
   cd backend
   pip install -r requirements.txt
   python app.py
   ```

2. Serve the frontend:
   ```bash
   python -m http.server 8080
   ```

3. Open http://localhost:8080

## Backend API

The frontend expects a JSON response from `/api/reputation` endpoint:

```json
{
  "status": "success",
  "data": {
    "musk": {
      "name": "Elon Musk",
      "score": 74.2,
      "trend": "up",
      "change": 2.1,
      "color": "#1DA1F2"
    },
    "trump": {
      "name": "Donald Trump",
      "score": 67.8,
      "trend": "down", 
      "change": 1.3,
      "color": "#FF4444"
    }
  }
}
```

## Customization

- **Colors**: Update CSS custom properties for `--accent-color`
- **Styling**: Modify the `<style>` section in `index.html`
- **Data**: Update mock data in the `displayMockData()` function
- **Features**: Add new sections by modifying the HTML structure

## Browser Support

- Chrome/Edge/Safari/Firefox (modern versions)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Internet Explorer 11+ (with some style limitations)