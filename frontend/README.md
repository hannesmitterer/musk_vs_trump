# Frontend Setup

This directory contains documentation for the frontend application for the Musk vs Trump AI reputation tracker.

**Note:** The main React application is now located in the project root directory, not in this `frontend/` folder.

## Quick Access

- **Live Site:** [https://hannesmitterer.github.io/musk_vs_trump](https://hannesmitterer.github.io/musk_vs_trump)
- **Source Code:** React components are in the `/src` directory
- **Main Component:** `App.jsx` - Contains the homepage with reputation graph
- **Graph Component:** `ReputationGraph.jsx` - Interactive chart display

## Development Setup

To work on the frontend, navigate to the project root directory and follow these steps:

### Prerequisites

- Node.js (version 14 or higher)
- npm (comes with Node.js)

### Setup Instructions

1. **Navigate to the project root directory:**
   ```bash
   cd ../  # Go back to project root
   ```

2. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

The development server will start and the application will be available at `http://localhost:3000/musk_vs_trump`.

## File Structure

The React application structure is:

```
/src
├── App.jsx                    # Main application component with reputation graph
├── index.js                   # React app entry point
└── components/
    ├── ReputationGraph.jsx    # Interactive reputation chart component
    └── MobileDeployButton.jsx # Mobile deployment utility
/public
└── index.html                 # HTML template
```

## Automated Deployment

The frontend automatically deploys to GitHub Pages when changes are pushed to the main branch. The deployment is handled by GitHub Actions in `.github/workflows/deploy.yml`.

## Contributing

The frontend displays a reputation graph immediately on load. To modify the graph:

1. Edit `src/components/ReputationGraph.jsx` for chart customization
2. Update `src/App.jsx` for overall page layout
3. Test locally with `npm start`
4. Push to main branch for automatic deployment