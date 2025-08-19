# Frontend - Kernel Graph Visualization

This directory contains a fully interactive web application for visualizing kernel graph data in both numeric and visual formats.

## Features

### 🎯 Core Functionality
- **Interactive Graph Visualization**: Uses D3.js for dynamic, interactive graph rendering
- **Dual View Modes**: Toggle between visual graph and numeric data table views
- **Multiple Layout Options**: Force-directed, circular, and hierarchical layouts
- **Real-time Data**: Fetches live data from the backend API

### 🎨 Visualization Features
- **Node Types**: Different colors and sizes for persons, companies, platforms, and topics
- **Edge Relationships**: Color-coded connections showing different relationship types
- **Interactive Controls**: Zoom, pan, drag nodes, and hover tooltips
- **Responsive Design**: Works on desktop, tablet, and mobile devices

### 📊 Data Display
- **Numeric Tables**: Sortable tables showing node and edge data
- **Sentiment Analysis**: Color-coded sentiment indicators
- **Influence Metrics**: Visual progress bars for influence scores
- **Metadata Panel**: Graph statistics and information

## Quick Start

### Local Development
1. **Start the Backend Server**:
   ```bash
   cd ../backend
   ./start_backend.sh
   ```

2. **Open the Frontend**:
   ```bash
   cd ../frontend
   # Open index.html in your browser or serve with a local server
   python3 -m http.server 8080
   ```

3. **Access the Application**:
   Open `http://localhost:8080` in your browser

### GitHub Pages Deployment

This frontend is designed to be deployment-ready for GitHub Pages:

1. **Enable GitHub Pages** in your repository settings
2. **Set source** to the `main` branch `/frontend` folder
3. **Update API URL** in `app.js` for production:
   ```javascript
   apiUrl: 'https://your-backend-domain.com/api/graph'
   ```

## File Structure

```
frontend/
├── index.html          # Main HTML page
├── app.js             # JavaScript application logic
├── styles.css         # Custom CSS styles
└── README.md         # This file
```

## Dependencies

All dependencies are loaded via CDN:
- **Bootstrap 5.3.0**: Responsive UI framework
- **D3.js v7**: Data visualization library
- **Font Awesome 6.4.0**: Icons

## Configuration

### API Configuration
The application connects to the backend API. Update the `apiUrl` in `app.js`:

```javascript
config: {
    apiUrl: 'http://localhost:5000/api/graph',  // Development
    // apiUrl: 'https://your-production-api.com/api/graph',  // Production
}
```

### Graph Settings
Customize visualization parameters in the `config` object:
- `nodeRadius`: Min/max node sizes
- `linkWidth`: Min/max edge thickness
- `colors`: Color scheme for node types

## Usage Guide

### Graph View Controls
- **Layout Selector**: Choose between Force, Circular, or Hierarchical layouts
- **Zoom Controls**: Zoom in/out or reset zoom level
- **Node Interaction**: Drag nodes, hover for tooltips
- **Pan**: Click and drag empty space to pan

### Data View Features
- **Nodes Table**: Shows all entities with sentiment and influence scores
- **Edges Table**: Displays all relationships with weights
- **Metadata Panel**: Graph statistics and information

### Mobile Support
- Responsive design adapts to different screen sizes
- Touch-friendly controls for mobile devices
- Optimized layout for portrait and landscape orientations

## Customization

### Adding New Node Types
1. Update the `colors` config in `app.js`
2. Add corresponding CSS classes in `styles.css`
3. Update the legend in `index.html`

### Styling
- Modify `styles.css` for visual customizations
- Update Bootstrap classes in `index.html` for layout changes
- Adjust D3.js parameters in `app.js` for behavior modifications

## Browser Support
- Modern browsers with ES6+ support
- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance
- Optimized for graphs with up to 100 nodes
- Lazy loading and efficient rendering
- Responsive to window resize events
- Smooth animations and transitions

## Troubleshooting

### Common Issues
1. **CORS Errors**: Ensure backend has CORS enabled and frontend is served from a web server
2. **Data Not Loading**: Check API URL configuration and backend server status
3. **Visualization Issues**: Verify D3.js is loading correctly from CDN

### Development Tips
- Use browser developer tools to debug
- Check console for JavaScript errors
- Verify network requests to API endpoints
- Test responsive design with device emulation