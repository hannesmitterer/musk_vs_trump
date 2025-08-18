# Musk vs Trump: AI-Powered Reputation Tracker

A comprehensive, AI-driven reputation tracking system that compares public sentiment and reputation scores between Elon Musk and Donald Trump using advanced deep learning models and artificial intelligence algorithms.

## 🚀 Features

### Deep Learning Integration
- **@kmario23/deep-learning-drizzle Integration**: Advanced sentiment analysis using BERT and other deep learning models
- **Feature Extraction**: Multi-dimensional feature extraction from text data
- **Custom Model Support**: Utility functions for loading and using custom models

### AI Algorithms Loader
- **Dynamic Algorithm Loading**: Import and use algorithms from artificial-intelligence-algorithms repositories
- **Experimental Scoring**: Support for various AI scoring methodologies
- **Built-in Algorithms**: Sentiment scoring, reputation analysis, and comparative analysis

### PyWinAssistant Interface
- **Seamless Integration**: Ready-to-use interface for @a-real-ai/pywinassistant
- **Standardized API**: Compatible with pywinassistant plugin architecture
- **Real-time Processing**: Live reputation score processing and analysis

### Frontend Dashboard
- **GitHub Pages Ready**: Responsive web dashboard for public deployment
- **Interactive Visualizations**: Real-time charts and graphs using Chart.js
- **Comprehensive Analytics**: Trend analysis, comparisons, and AI insights

## 📋 Table of Contents

1. [Installation](#installation)
2. [Quick Start](#quick-start)
3. [Backend Setup](#backend-setup)
4. [Frontend Setup](#frontend-setup)
5. [AI Integrations](#ai-integrations)
6. [PyWinAssistant Integration](#pywinassistant-integration)
7. [API Documentation](#api-documentation)
8. [Deployment](#deployment)
9. [Extending the System](#extending-the-system)
10. [Troubleshooting](#troubleshooting)

## 🛠 Installation

### Prerequisites
- Python 3.8+
- Node.js 16+
- Git

### Clone Repository
```bash
git clone https://github.com/hannesmitterer/musk_vs_trump.git
cd musk_vs_trump
```

## ⚡ Quick Start

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Initialize database
python -c "from models import db_manager; db_manager.create_tables()"

# Start the backend server
python app.py
```

### Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install Node.js dependencies
npm install

# Start development server
npm start
```

### Initialize with Demo Data
```bash
# Make a POST request to initialize demo data
curl -X POST http://localhost:5000/api/demo/init
```

Access the dashboard at `http://localhost:3000`

## 🧠 Backend Setup

### Core Components

#### 1. Models (`models.py`)
```python
from models import db_manager, ReputationScore

# Initialize database
db_manager.create_tables()

# Create reputation score
score = ReputationScore(
    person='musk',
    score=0.75,
    sentiment_score=0.8,
    source='twitter',
    content='Great innovation from Tesla!'
)
```

#### 2. Deep Learning Integration (`deep_learning_integration.py`)
```python
from deep_learning_integration import DeepLearningDrizzleIntegration

# Initialize deep learning integration
dl_integration = DeepLearningDrizzleIntegration()

# Load sentiment model
model = dl_integration.load_sentiment_model('bert_sentiment')

# Analyze sentiment
results = dl_integration.analyze_sentiment_batch([
    "Elon Musk's latest innovation is groundbreaking!",
    "Trump's policy announcement received mixed reactions."
])
```

#### 3. AI Algorithms Loader (`ai_algorithms_loader.py`)
```python
from ai_algorithms_loader import AIAlgorithmsLoader

# Initialize loader
loader = AIAlgorithmsLoader()

# Load built-in sentiment algorithm
sentiment_algo = loader.load_builtin_algorithm('sentiment_scorer')

# Use algorithm
scores = sentiment_algo.score(["Great work!", "This is terrible"])
```

#### 4. PyWinAssistant Interface (`pywinassistant_interface.py`)
```python
from pywinassistant_interface import PyWinAssistantInterface

# Create interface
interface = PyWinAssistantInterface()

# Get reputation scores
scores = interface.get_reputation_scores('musk', limit=100)

# Analyze trends
analysis = interface.analyze_reputation_trend('trump', days=30)
```

### Environment Configuration

Create a `.env` file in the backend directory:
```env
FLASK_DEBUG=True
SECRET_KEY=your-secret-key-here
DATABASE_URL=sqlite:///reputation_tracker.db
```

## 🎨 Frontend Setup

### Project Structure
```
frontend/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── App.js          # Main application component
│   ├── ReputationGraph.js  # Chart visualization component
│   └── index.js        # Entry point
├── package.json
└── README.md
```

### Custom Styling
The frontend includes comprehensive CSS styling with:
- Gradient backgrounds
- Responsive design
- Interactive animations
- Bootstrap integration
- Chart.js visualizations

### Configuration
Update the API base URL in `src/App.js`:
```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
```

## 🤖 AI Integrations

### Deep Learning Models

#### Available Models
- `bert_sentiment`: BERT-based sentiment analysis
- `lstm_sentiment`: LSTM neural network
- `transformer_sentiment`: Transformer-based analysis
- `cnn_sentiment`: Convolutional neural network

#### Usage Example
```python
from deep_learning_integration import quick_sentiment_analysis

# Quick sentiment analysis
result = quick_sentiment_analysis("This innovation is amazing!")
print(f"Sentiment: {result['combined']['combined_label']}")
print(f"Score: {result['combined']['combined_score']:.3f}")
```

### AI Algorithms

#### Built-in Algorithms
1. **Sentiment Scorer**: Advanced sentiment scoring with weighted word analysis
2. **Reputation Trend Analyzer**: Trend analysis and future prediction
3. **Comparative Analyzer**: Multi-entity comparison capabilities

#### Custom Algorithm Integration
```python
# Load custom algorithm
loader = AIAlgorithmsLoader()
algorithm = loader.load_algorithm('/path/to/custom_algorithm.py')

# Use algorithm
results = loader.run_algorithm('custom_algorithm', 'analyze', data)
```

## 🔌 PyWinAssistant Integration

### Plugin Interface
```python
from pywinassistant_interface import PyWinAssistantPlugin

# Create plugin
plugin = PyWinAssistantPlugin()

# Get plugin info
info = plugin.get_plugin_info()

# Get current leader
leader = plugin.get_current_leader()
print(f"Current leader: {leader['leader']}")
```

### Available Methods
- `get_current_leader()`: Get reputation leader
- `get_reputation_summary(person)`: Detailed reputation analysis
- `predict_trends(person, days)`: Future trend predictions
- `analyze_sentiment(texts)`: Batch sentiment analysis
- `get_insights()`: AI-powered insights

### Integration Example
```python
# In your pywinassistant application
from musk_vs_trump.backend.pywinassistant_interface import create_pywinassistant_plugin

plugin = create_pywinassistant_plugin()

# Use in pywinassistant workflows
current_winner = plugin.get_current_leader()
insights = plugin.get_insights()
```

## 📚 API Documentation

### Base URL
```
Local Development: http://localhost:5000
Production: https://your-domain.com
```

### Endpoints

#### Health Check
```http
GET /health
```
Returns system health status and component information.

#### Reputation Scores
```http
GET /api/reputation/{person}?days=7&limit=100
```
Get reputation scores for a person.

#### Sentiment Analysis
```http
POST /api/sentiment/analyze
Content-Type: application/json

{
  "text": "Sample text to analyze",
  "person": "musk" (optional)
}
```

#### Data Collection
```http
POST /api/collect/run
Content-Type: application/json

{
  "persons": ["musk", "trump"],
  "sources": ["mock"]
}
```

#### Comparison
```http
GET /api/compare?days=7
```
Compare reputations between Musk and Trump.

#### AI Insights
```http
GET /api/ai/insights?person=musk&type=comprehensive
```

#### PyWinAssistant Endpoints
```http
GET /api/pywinassistant/leader
GET /api/pywinassistant/summary/{person}
GET /api/pywinassistant/predict/{person}?days=7
GET /api/pywinassistant/export
```

### Response Format
```json
{
  "status": "success",
  "data": {
    // Response data
  },
  "timestamp": "2024-01-01T12:00:00Z"
}
```

## 🚀 Deployment

### GitHub Pages Deployment

1. **Configure GitHub Pages**:
   - Go to repository Settings > Pages
   - Select source: GitHub Actions
   - The frontend will be automatically deployed

2. **Build and Deploy Frontend**:
```bash
cd frontend
npm run build
npm run deploy
```

3. **Manual Deployment**:
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '16'
    
    - name: Install and Build
      run: |
        cd frontend
        npm install
        npm run build
    
    - name: Deploy
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./frontend/build
```

### Backend Deployment Options

#### Heroku
```bash
# Install Heroku CLI
# Create Procfile in backend directory:
echo "web: gunicorn app:app" > backend/Procfile

# Deploy
heroku create musk-trump-tracker
git subtree push --prefix backend heroku main
```

#### Docker
```dockerfile
# Dockerfile for backend
FROM python:3.9-slim

WORKDIR /app
COPY backend/ .
RUN pip install -r requirements.txt

EXPOSE 5000
CMD ["python", "app.py"]
```

### Environment Variables
Set these environment variables for production:
```env
FLASK_ENV=production
SECRET_KEY=your-production-secret-key
DATABASE_URL=your-production-database-url
CORS_ORIGINS=https://your-frontend-domain.com
```

## 🔧 Extending the System

### Adding New Data Sources

1. **Implement Data Source**:
```python
def _collect_custom_source_data(self, person: str, limit: int) -> List[DataPoint]:
    # Your custom data collection logic
    data_points = []
    # ... collect data
    return data_points
```

2. **Register in DataCollector**:
```python
self.sources['custom_source'] = {'enabled': True, 'rate_limit': 100}
```

### Adding New AI Algorithms

1. **Create Algorithm File**:
```python
class CustomAnalyzer:
    def __init__(self):
        self.name = "Custom Analyzer"
        self.version = "1.0"
    
    def analyze(self, data, **kwargs):
        # Your analysis logic
        return results
    
    def get_info(self):
        return {
            'name': self.name,
            'version': self.version,
            'description': 'Custom analysis algorithm'
        }
```

2. **Load Algorithm**:
```python
loader = AIAlgorithmsLoader()
algorithm = loader.load_algorithm('/path/to/custom_analyzer.py')
```

### Adding New Frontend Components

1. **Create Component**:
```jsx
function CustomComponent({ data }) {
  return (
    <div className="custom-component">
      {/* Your component JSX */}
    </div>
  );
}
```

2. **Add to App.js**:
```jsx
import CustomComponent from './CustomComponent';

// Use in render method
<CustomComponent data={dashboardData.custom} />
```

### PyWinAssistant Extensions

1. **Add New Plugin Methods**:
```python
def custom_analysis(self, parameters):
    """Custom analysis method for pywinassistant"""
    # Your custom logic
    return results
```

2. **Update Plugin Info**:
```python
def get_plugin_info(self):
    return {
        'name': self.name,
        'capabilities': [..., 'custom_analysis'],
        'api_methods': [..., 'custom_analysis']
    }
```

## 🔍 Troubleshooting

### Common Issues

#### Backend Issues

**Database Connection Error**:
```bash
# Solution: Initialize database
python -c "from models import db_manager; db_manager.create_tables()"
```

**Module Import Error**:
```bash
# Solution: Check Python path
export PYTHONPATH="${PYTHONPATH}:/path/to/backend"
```

**Port Already in Use**:
```bash
# Solution: Change port or kill existing process
lsof -ti:5000 | xargs kill -9
# Or change port in app.py
```

#### Frontend Issues

**API Connection Error**:
- Check backend is running on port 5000
- Update API_BASE_URL in App.js
- Check CORS configuration

**Build Errors**:
```bash
# Solution: Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Chart Not Displaying**:
- Check data format in ReputationGraph.js
- Ensure Chart.js is properly loaded
- Check browser console for errors

#### Data Collection Issues

**No Data Available**:
```bash
# Solution: Initialize demo data
curl -X POST http://localhost:5000/api/demo/init
```

**Slow Performance**:
- Check database indexes
- Optimize query limits
- Consider data cleanup

### Debugging Tips

1. **Enable Debug Mode**:
```env
FLASK_DEBUG=True
```

2. **Check Logs**:
```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

3. **Test Components Individually**:
```python
# Test sentiment analyzer
from sentiment_analyzer import quick_sentiment_analysis
result = quick_sentiment_analysis("Test text")
print(result)
```

4. **Monitor API Endpoints**:
```bash
# Test API endpoints
curl http://localhost:5000/health
curl http://localhost:5000/api/demo/dashboard
```

## 📈 Performance Optimization

### Backend Optimization
- Implement database connection pooling
- Add Redis caching for frequent queries
- Use async processing for data collection
- Implement API rate limiting

### Frontend Optimization
- Code splitting with React.lazy
- Implement data caching
- Optimize chart rendering
- Add service worker for offline support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Add tests if applicable
5. Commit changes: `git commit -m 'Add feature'`
6. Push to branch: `git push origin feature-name`
7. Submit a pull request

## 📄 License

This project is licensed under the MIT License. See LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check troubleshooting guide above
- Review API documentation

## 🔮 Future Enhancements

- Real-time WebSocket updates
- Machine learning model training interface
- Advanced analytics dashboard
- Multi-language support
- Mobile app integration
- Historical data analysis tools
- Custom alert system
- Integration with more social media platforms

---

**Ready for Production**: This system is fully prepared for deployment and integration with existing AI assistants and reputation tracking workflows.