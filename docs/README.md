# Musk vs Trump - AI Reputation Tracker Dashboard

A lightweight, responsive web dashboard for tracking and visualizing reputation metrics for Elon Musk and Donald Trump through AI-powered sentiment analysis.

🌐 **Live Demo**: [View on GitHub Pages](https://hannesmitterer.github.io/musk_vs_trump/)

## Features

- **Real-time Reputation Scoring**: Live tracking of reputation metrics for both figures
- **Interactive Charts**: Time-series visualization using Chart.js
- **Sentiment Analysis**: Breakdown of positive, neutral, and negative sentiment
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Live Data Updates**: Automatic refresh every 30 seconds
- **Performance Optimized**: Lightweight and fast-loading

## File Structure

```
docs/
├── index.html      # Main HTML page
├── styles.css      # Responsive CSS styles
├── app.js          # Main application logic
├── charts.js       # Chart.js configuration and management
├── data.js         # Mock data and data management
└── README.md       # This documentation
```

## Data Visualization

The dashboard displays several key metrics:

### 1. Current Reputation Scores
- Real-time scores for both Musk and Trump (0-100 scale)
- Score change indicators (positive/negative)
- Current sentiment classification
- Mention volume from social media and news

### 2. Reputation Timeline
- 30-day historical trend comparison
- Interactive line chart with hover details
- Gradient fills for visual appeal
- Responsive design for all screen sizes

### 3. Sentiment Breakdown
- Pie charts showing positive/neutral/negative sentiment distribution
- Percentage breakdowns with hover tooltips
- Comparative view between both figures

## Updating Data

### Current Implementation (Mock Data)
The current implementation uses mock data generated in `data.js`. To update the data:

1. **Modify Mock Data Structure**:
   ```javascript
   // In data.js, update the mockData object
   mockData.currentMetrics.musk.score = 75.2;
   mockData.currentMetrics.trump.score = 68.1;
   ```

2. **Update Historical Data**:
   ```javascript
   // Add new data points to reputation history
   mockData.reputationHistory.dates.push('2024-01-15');
   mockData.reputationHistory.musk.push(75.2);
   mockData.reputationHistory.trump.push(68.1);
   ```

### Future Implementation (Live Data)

To connect to live data sources:

1. **API Integration**:
   ```javascript
   // Replace mock data with API calls in app.js
   async performUpdate() {
       try {
           const response = await fetch('/api/reputation-data');
           const liveData = await response.json();
           this.updateMetricsDisplay(liveData);
       } catch (error) {
           console.error('API update failed:', error);
       }
   }
   ```

2. **Backend Connection**:
   - Connect to the Flask backend at `http://localhost:5000`
   - Create endpoints for reputation data, sentiment analysis
   - Implement real-time data collection from social media APIs

3. **Data Format**:
   ```javascript
   // Expected API response format
   {
       "currentMetrics": {
           "musk": { "score": 72.3, "change": 2.1, "sentiment": "Positive", "volume": "14.2K" },
           "trump": { "score": 65.8, "change": -1.4, "sentiment": "Mixed", "volume": "18.7K" }
       },
       "reputationHistory": {
           "dates": ["2024-01-01", "2024-01-02", ...],
           "musk": [70.1, 71.2, 72.3, ...],
           "trump": [67.2, 66.8, 65.8, ...]
       },
       "sentimentData": {
           "musk": { "positive": 45.2, "neutral": 32.1, "negative": 22.7 },
           "trump": { "positive": 38.4, "neutral": 29.8, "negative": 31.8 }
       },
       "lastUpdated": "2024-01-15T10:30:00Z"
   }
   ```

## GitHub Pages Deployment

### Automatic Deployment
1. The site is automatically deployed from the `docs/` folder
2. Any push to the main branch triggers a new deployment
3. Changes are typically live within 2-3 minutes

### Manual Deployment Setup
1. Go to repository Settings → Pages
2. Set source to "Deploy from a branch"
3. Select branch: `main` and folder: `/docs`
4. Save settings

### Custom Domain (Optional)
1. Add a `CNAME` file to the `docs/` folder:
   ```
   your-custom-domain.com
   ```
2. Configure DNS settings with your domain provider
3. Enable HTTPS in repository settings

## Development

### Local Development
1. **Simple HTTP Server**:
   ```bash
   cd docs
   python3 -m http.server 8000
   # Visit http://localhost:8000
   ```

2. **Live Server (VS Code)**:
   - Install "Live Server" extension
   - Right-click `index.html` → "Open with Live Server"

### Testing
- Test responsiveness using browser dev tools
- Verify charts render correctly on different screen sizes
- Check performance using browser Performance tab

### Performance Optimization
- Charts are rendered using Canvas API for optimal performance
- CSS uses hardware acceleration where possible
- JavaScript uses efficient DOM manipulation
- Images and assets are optimized for web

## Browser Compatibility

- **Supported**: Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
- **Features Used**: 
  - CSS Grid and Flexbox for layout
  - Canvas API for charts
  - Fetch API for future data loading
  - CSS Custom Properties (CSS Variables)

## Customization

### Colors and Theming
Edit CSS variables in `styles.css`:
```css
:root {
    --musk-color: #3b82f6;
    --trump-color: #ef4444;
    --background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

### Chart Configuration
Modify chart settings in `charts.js`:
```javascript
// Update chart colors, animations, tooltips, etc.
const chartColors = {
    musk: { primary: '#3b82f6', light: 'rgba(59, 130, 246, 0.2)' },
    trump: { primary: '#ef4444', light: 'rgba(239, 68, 68, 0.2)' }
};
```

### Update Intervals
Change data refresh rate in `app.js`:
```javascript
// Update every 30 seconds (30000ms)
this.updateInterval = setInterval(() => {
    this.performUpdate();
}, 30000);
```

## License

This project is part of the Musk vs Trump AI Reputation Tracker repository.

## Contributing

1. Fork the repository
2. Make changes to files in the `docs/` directory
3. Test locally using a simple HTTP server
4. Submit a pull request

For backend integration or data source questions, refer to the main repository documentation.