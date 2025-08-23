# Musk vs Trump - AI Reputation Tracker

🚀 **Live Demo**: [Visit the deployed site](https://hannesmitterer.github.io/musk_vs_trump/)

This project tracks and analyzes the reputation of public figures through AI-powered sentiment analysis.

## 🌟 Features

- 🗳️ **Interactive Voting System** - Vote for Musk or Trump with real-time results
- 📊 **Live Progress Bars** - Visual representation of voting results
- 🤖 **AI Sentiment Analysis** - Simulated reputation scoring with trends
- 📱 **Mobile-First Design** - Fully responsive across all devices
- 🚀 **One-Click Deployment** - Deploy your own version instantly
- 💾 **Vote Persistence** - Votes saved locally with spam prevention
- ℹ️ **Interactive Modals** - Rich information dialogs
- 🔄 **Reset Functionality** - Clear all data with confirmation

## 🚀 Quick Deploy

### GitHub Pages (Recommended)
1. **Fork this repository**
2. **Enable GitHub Pages**:
   - Go to repository Settings → Pages
   - Select "Deploy from a branch"
   - Choose "main" branch and "/ (root)" folder
   - Click Save
3. **Access your site** at: `https://YOUR_USERNAME.github.io/musk_vs_trump/`

### Netlify One-Click Deploy
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/hannesmitterer/musk_vs_trump)

### Manual Deployment
1. Download the repository
2. Upload `index.html`, `style.css`, and `script.js` to your web hosting
3. Ensure the files are in the root directory
4. Visit your domain

## 💻 Local Development

### Option 1: Simple HTTP Server (Recommended)
```bash
# Clone the repository
git clone https://github.com/hannesmitterer/musk_vs_trump.git
cd musk_vs_trump

# Start a local server (Python 3)
python3 -m http.server 8000

# Or use Node.js
npx serve .

# Visit http://localhost:8000
```

### Option 2: Direct File Opening
You can also open `index.html` directly in your browser, though some features work better with a local server.

## 🛠️ Technical Stack

- **Frontend**: Pure HTML5, CSS3, JavaScript (ES6+)
- **Styling**: CSS Grid, Flexbox, CSS Variables
- **Storage**: LocalStorage for vote persistence
- **Deployment**: GitHub Pages, Netlify
- **No Build Tools**: Zero dependencies, runs anywhere

## 📁 Project Structure

```
/
├── index.html      # Main HTML page
├── style.css       # All styles and responsive design
├── script.js       # JavaScript functionality and voting logic
├── .nojekyll       # GitHub Pages configuration
├── README.md       # This documentation
└── backend/        # Python Flask API (optional)
    ├── app.py
    ├── requirements.txt
    └── ...
```

## 🔧 Backend API (Optional)

The site works completely standalone, but you can optionally integrate with the Python Flask backend for enhanced features:

### Backend Setup

### Automated Setup (Recommended)

The backend includes two automation options for easy setup:

#### Option 1: Shell Script
```bash
cd backend
./start_backend.sh
```

#### Option 2: Makefile
```bash
cd backend
make setup  # Complete setup and start server
# OR run individual steps:
make install-deps  # Install dependencies only
make init-db       # Initialize database only
make start-server  # Start server only
make help          # Show available commands
```

Both automation methods will:
1. 🐍 **Install Python dependencies** from `requirements.txt`
2. 🗄️ **Initialize the database** using `db_manager.create_tables()`
3. 🌐 **Start the backend server** with `python app.py`

### Manual Setup

If you prefer to set up the backend manually:

1. **Install dependencies:**
   ```bash
   cd backend
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

## 🎯 Key Features Explained

### Voting System
- **Real-time Updates**: Vote counts update instantly with smooth animations
- **Spam Prevention**: 5-minute cooldown between votes per browser
- **Progress Visualization**: Dynamic progress bars show percentage breakdown
- **Local Persistence**: Votes saved in browser localStorage

### Mobile Experience  
- **Mobile Detection**: Automatic mobile deploy banner for mobile users
- **Responsive Design**: Optimized layouts for phones, tablets, and desktop
- **Touch-Friendly**: Large tap targets and smooth interactions

### AI Sentiment Simulation
- **Dynamic Scores**: Sentiment scores update every 30 seconds
- **Trend Indicators**: Visual arrows show reputation trending up/down
- **Realistic Ranges**: Scores fluctuate within believable ranges

## 🔧 Customization

### Modify Candidates
Edit `index.html` and `script.js` to change:
- Candidate names and emojis
- Vote button text
- Progress bar colors

### Styling
Customize `style.css`:
- Color scheme (CSS variables at top)
- Layout and spacing
- Animation timing

### Functionality
Extend `script.js`:
- Add more candidates
- Integrate real APIs
- Add social sharing
- Enhanced analytics

## 🚀 Deployment Options

### GitHub Pages (Free & Easy)
1. Fork repository
2. Enable Pages in Settings
3. Site live at `username.github.io/musk_vs_trump`

### Netlify (Advanced Features)
- Custom domains
- Form handling
- Edge functions
- Deploy previews

### Other Platforms
Works on any static hosting:
- Vercel, Surge.sh, Firebase Hosting
- Amazon S3, Azure Static Web Apps
- Traditional web hosting

## ❓ Troubleshooting

### Site Not Loading
- Ensure `index.html`, `style.css`, and `script.js` are in the same directory
- Check browser console for JavaScript errors
- Try using a local HTTP server instead of opening files directly

### Votes Not Saving
- Check if localStorage is enabled in your browser
- Clear browser cache and try again
- Votes are saved per-browser, not across devices

### Mobile Issues
- Ensure viewport meta tag is present in HTML
- Test on actual mobile devices, not just desktop browser resize
- Check touch event handlers in JavaScript

### GitHub Pages
- Ensure repository is public or you have GitHub Pro
- Check that `.nojekyll` file exists in repository root
- Wait a few minutes for changes to propagate

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Test thoroughly on multiple devices
5. Commit: `git commit -m 'Add amazing feature'`
6. Push: `git push origin feature/amazing-feature`  
7. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Inspired by the need for transparent public discourse tracking
- Built with modern web standards for maximum compatibility
- Designed for easy deployment and customization

---

🌟 **Star this repo** if you found it useful! | 🐛 **Report bugs** via Issues | 💡 **Suggest features** via Discussions