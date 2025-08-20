# Netlify Deployment Guide

This repository contains a fully interactive homepage with a 3D graph for the Musk vs Trump AI Reputation Tracker, optimized for Netlify deployment and mobile devices.

## 🚀 Quick Deploy to Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/hannesmitterer/musk_vs_trump)

### Manual Deployment Steps

1. **Fork or clone this repository**
2. **Connect to Netlify:**
   - Log in to [Netlify](https://app.netlify.com)
   - Click "New site from Git"
   - Choose your Git provider and select this repository
3. **Configure build settings:**
   - Build command: (leave empty)
   - Publish directory: `.` (root directory)
   - The `netlify.toml` file will handle all configuration automatically

## 📱 Features

- **Mobile-First Design:** Fully responsive and optimized for mobile devices
- **3D Interactive Graph:** Real-time reputation visualization using Three.js
- **Progressive Web App:** Can be installed on mobile devices
- **Performance Optimized:** Lightweight assets and efficient rendering
- **Cross-Browser Compatible:** Works on all modern browsers

## 🛠️ Technical Stack

- **Frontend:** Plain HTML5, CSS3, JavaScript (ES6+)
- **3D Graphics:** Three.js library loaded from CDN
- **Styling:** CSS Grid, Flexbox, CSS Custom Properties
- **Deployment:** Netlify with automatic optimization
- **Mobile Support:** Touch gestures, responsive design, PWA features

## 📊 Interactive 3D Graph

The homepage features a fully interactive 3D graph that displays:
- **Real-time sentiment analysis** (Y-axis)
- **Time series data** (X-axis)
- **Mention volume** (Z-axis)
- **Person comparison** (Musk vs Trump vs Both)

### Graph Controls
- **Mobile:** Touch to rotate, pinch to zoom
- **Desktop:** Click and drag to rotate, scroll to zoom
- **Buttons:** Switch between Musk, Trump, or comparison view

## 📱 Mobile Optimizations

- **Responsive Design:** Adapts to all screen sizes
- **Touch-Friendly Controls:** Large touch targets (44px minimum)
- **Performance:** Reduced particle count on mobile devices
- **Battery Optimization:** Animation pausing when page is hidden
- **Network-Aware:** Efficient asset loading

## ⚙️ Configuration

The `netlify.toml` file includes:
- **Security headers** for production deployment
- **Caching strategies** for optimal performance
- **Redirect rules** for SPA behavior
- **Asset optimization** (minification, bundling)

## 🔧 Local Development

To test locally:

```bash
# Start a local server
python3 -m http.server 8080
# or
npx serve .

# Visit http://localhost:8080
```

## 📈 Performance Features

- **Lazy Loading:** 3D scene loads progressively
- **Efficient Rendering:** RequestAnimationFrame optimization
- **Mobile Detection:** Automatic quality adjustment
- **Memory Management:** Proper cleanup on page unload

## 🌐 Browser Support

- Chrome 60+ (recommended)
- Firefox 55+
- Safari 12+
- Edge 79+
- Mobile browsers with WebGL support

## 📋 Deployment Checklist

- [x] Mobile-responsive design
- [x] 3D graph with Three.js
- [x] Netlify configuration (netlify.toml)
- [x] PWA manifest
- [x] Performance optimizations
- [x] Cross-browser compatibility
- [x] Touch gesture support
- [x] Accessibility features

## 🚨 Troubleshooting

### Common Issues

1. **3D graph not loading:**
   - Ensure WebGL is enabled in browser
   - Check browser console for errors
   - Verify Three.js CDN is accessible

2. **Mobile performance issues:**
   - Reduce browser zoom level
   - Close other browser tabs
   - Ensure device has sufficient RAM

3. **Touch controls not working:**
   - Verify touch events are enabled
   - Check for JavaScript errors
   - Ensure proper viewport meta tag

## 📝 Environment Variables (Optional)

For advanced configuration in Netlify dashboard:
- `ENVIRONMENT`: Set to "production" for production optimizations
- `DEBUG_MODE`: Set to "true" for additional logging

## 🔄 Continuous Deployment

Changes pushed to the main branch will automatically trigger:
1. Netlify build process
2. Asset optimization
3. Security header injection
4. Global CDN distribution

The site will be live at `https://your-site-name.netlify.app` within minutes of deployment.