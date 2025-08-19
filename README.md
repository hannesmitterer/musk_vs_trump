# Musk vs Trump - Kernel Graph Visualization

This project provides an interactive web application for visualizing kernel graph data representing influence networks and relationships between public figures, companies, and topics.

## 🚀 Live Demo

**Website**: [View Live Demo](https://hannesmitterer.github.io/musk_vs_trump) *(if deployed)*

## ✨ Features

### 🎯 Interactive Graph Visualization
- **D3.js-powered visualization** with force-directed, circular, and hierarchical layouts
- **Interactive controls**: Zoom, pan, drag nodes, hover tooltips
- **Color-coded entities**: Different node types (persons, companies, platforms, topics)
- **Relationship mapping**: Visual representation of connections and influences

### 📊 Data Views
- **Toggle between graph and data views** for comprehensive analysis
- **Numeric tables** showing detailed node and edge information
- **Sentiment analysis** with color-coded indicators
- **Influence metrics** displayed as progress bars
- **Real-time data** fetched from REST API

### 📱 Responsive Design
- **Mobile-friendly** interface that works on all devices
- **Bootstrap-based** responsive layout
- **Touch controls** for mobile graph interaction

## 🏗️ Architecture

```
├── backend/                    # Flask REST API
│   ├── app.py                 # API endpoints with sample kernel graph data
│   ├── db_manager.py          # Database utilities
│   ├── requirements.txt       # Python dependencies
│   └── start_backend.sh       # Automation script
├── frontend/                   # Interactive web application
│   ├── index.html            # Main application page
│   ├── app.js                # JavaScript visualization logic
│   ├── styles.css            # Custom styling
│   └── README.md             # Frontend documentation
└── .github/workflows/         # GitHub Pages deployment
    └── deploy.yml            # Auto-deployment configuration
```

## 🚀 Quick Start

### 1. Backend Setup (Flask API)

#### Automated Setup (Recommended)
```bash
cd backend
./start_backend.sh  # Complete setup and server start
```

#### Manual Setup
```bash
cd backend
pip3 install -r requirements.txt
python3 -c "import db_manager; db_manager.create_tables()"
python3 app.py  # Server starts on http://localhost:5000
```

### 2. Frontend Setup (Web Application)

#### Local Development
```bash
cd frontend
python3 -m http.server 8080  # Serve on http://localhost:8080
```

#### GitHub Pages Deployment
1. Enable GitHub Pages in repository settings
2. GitHub Actions will auto-deploy the frontend
3. Update API URL in `app.js` for production

## 🎮 Usage

### Graph Visualization
1. **Start the backend**: `cd backend && ./start_backend.sh`
2. **Open frontend**: Navigate to `http://localhost:8080`
3. **Interact with the graph**:
   - Toggle between Graph and Data views
   - Change layouts (Force, Circular, Hierarchical)
   - Zoom, pan, and drag nodes
   - Hover over nodes and edges for details

### API Endpoints
- `GET /api/graph` - Complete kernel graph data
- `GET /api/graph/nodes` - Node data only
- `GET /api/graph/edges` - Edge data only
- `GET /health` - Health check

## 🗂️ Data Structure

The kernel graph represents relationships between entities:

### Nodes
- **Persons**: Elon Musk, Donald Trump
- **Companies**: Tesla, SpaceX
- **Platforms**: X (Twitter)
- **Topics**: Politics, Technology, Social Media

### Relationships
- **Ownership**: Direct control relationships
- **Leadership**: Management and direction
- **Involvement**: Participation and engagement
- **Influence**: Impact and effect patterns

## 🛠️ Development
   pip3 install -r requirements.txt
   ```

2. **Initialize the database:**
   ```bash
   python3 -c "import db_manager; db_manager.create_tables()"
   ```

3. **Start the server:**
   ```bash
   python3 app.py
   ```

## Prerequisites

- Python 3.x
- pip (Python package manager)

## Development

### Backend Development

The backend includes two automation options:

#### Shell Script (`start_backend.sh`)
- ✅ Error handling and validation
- ⚠️ Informative warnings for missing files
- 🚀 Automatic dependency management
- 🔄 Database initialization
- 📝 Clear logging and status messages

#### Makefile
- 🎯 Granular control with individual targets
- 🧹 Cleanup utilities (`make clean`)
- 📋 Help documentation (`make help`)
- 🔧 Flexible build automation

### Adding New Dependencies

1. Add your package to `backend/requirements.txt`
2. Run `./start_backend.sh` to automatically install new dependencies

## Troubleshooting

- **Python not found**: Ensure Python 3.x is installed and available in your PATH
- **Permission denied**: Make sure `start_backend.sh` is executable (`chmod +x start_backend.sh`)
- **Module import errors**: Verify all dependencies are installed via `requirements.txt`
- **Database errors**: Ensure `db_manager.py` exists and has a `create_tables()` function

## License

[Add your license information here]