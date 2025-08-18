# Musk vs Trump: AI-Powered Reputation Tracker

An advanced AI-powered reputation tracking system that analyzes and compares the public reputation of Elon Musk and Donald Trump using multiple data sources, sentiment analysis, and trust algorithms.

## 🚀 Features

- **Multi-Source Data Ingestion**: FRED, YCharts, Michigan Sentiment, Our World in Data, Census, OpenRank SDK
- **AI Sentiment Analysis**: Advanced sentiment analysis using Transformers on social media and news data
- **EigenTrust Algorithm**: Trust score computation using the EigenTrust algorithm via OpenRank SDK
- **Real-time Dashboard**: Interactive web dashboard with Plotly.js visualizations
- **GitHub Pages Ready**: Static frontend deployable to GitHub Pages
- **Comprehensive Metrics**: Sentiment, Economic, Social, and Trust components

## 📊 Dashboard Features

- **Live Reputation Scores**: Real-time scores for both Musk and Trump (0-100 scale)
- **Component Breakdown**: Detailed analysis of sentiment, economic, social, and trust factors
- **Time Series Analysis**: Historical reputation trends over time
- **Comparative Analytics**: Head-to-head comparison with key metrics
- **Interactive Charts**: Plotly.js-powered responsive visualizations
- **Auto-refresh**: Automatic data updates every 5 minutes

## 🏗️ Architecture

```
/musk_vs_trump
├── backend/                 # Python backend services
│   ├── app.py              # Main application and Flask API
│   ├── models.py           # Data models and structures
│   ├── data_collector.py   # Multi-source data ingestion
│   └── sentiment_analyzer.py # AI sentiment analysis
├── frontend/               # Static dashboard for GitHub Pages
│   ├── index.html         # Main dashboard interface
│   ├── style.css          # Custom CSS styling
│   └── script.js          # Dashboard JavaScript logic
├── data/                  # Data storage and outputs
│   └── reputation_data.json # Latest reputation scores
├── database/              # Database schema (optional)
│   └── schema.sql         # SQL schema for data storage
└── requirements.txt       # Python dependencies
```

## 🛠️ Installation

### Backend Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/hannesmitterer/musk_vs_trump.git
   cd musk_vs_trump
   ```

2. **Create a virtual environment**:
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables** (optional):
   ```bash
   export FRED_API_KEY="your_fred_api_key_here"
   export OPENRANK_API_KEY="your_openrank_api_key_here"
   ```

### Frontend Setup

The frontend is a static web application that can be deployed directly to GitHub Pages or any web server.

## 🚀 Usage

### Running the Backend Analysis

1. **Run a single analysis**:
   ```bash
   cd backend
   python app.py
   ```

2. **Start the Flask API server**:
   ```bash
   python app.py server
   ```

3. **API Endpoints**:
   - `GET /` - Health check
   - `GET /api/reputation/latest` - Get latest reputation scores
   - `POST /api/reputation/refresh` - Trigger new analysis

### Deploying Frontend to GitHub Pages

1. **Enable GitHub Pages** in your repository settings
2. **Set source to** `/frontend` directory or configure GitHub Actions
3. **Access your dashboard** at `https://yourusername.github.io/musk_vs_trump/`

### Example OpenRank SDK Usage

```python
from models import DataSource, SubjectType, DataPoint
from data_collector import DataCollector

# Initialize data collector
collector = DataCollector()

# Collect OpenRank trust data
async def get_openrank_data():
    openrank_data = await collector.collect_openrank_data()
    
    for data_point in openrank_data:
        print(f"{data_point.subject.value}: {data_point.value} "
              f"({data_point.metadata.get('metric')})")

# Run EigenTrust algorithm
from app import EigenTrustCalculator

trust_calc = EigenTrustCalculator()
trust_scores = trust_calc.compute_trust_scores(data_points)

for score in trust_scores:
    print(f"{score.subject.value} trust score: {score.trust_score:.3f}")
```

## 📊 Data Sources

### Economic & Financial Data
- **FRED (Federal Reserve Economic Data)**: GDP, unemployment, inflation, interest rates
- **YCharts/Yahoo Finance**: Stock prices (TSLA, DJT), market indicators
- **Michigan Consumer Sentiment**: Consumer confidence and sentiment indices

### Social & Demographic Data
- **Our World in Data**: Global development indicators, democracy indices
- **US Census**: Population demographics, income data, housing statistics

### Trust & Reputation Data
- **OpenRank SDK**: Trust networks, reputation scores, credibility metrics
- **Social Media**: Twitter, Facebook, Reddit sentiment analysis
- **News Sources**: Article sentiment and coverage analysis

## 🤖 AI Components

### Sentiment Analysis Pipeline

```python
from sentiment_analyzer import SentimentAnalyzer

analyzer = SentimentAnalyzer()

# Analyze social media posts
social_data = [
    {'text': 'Elon Musk is revolutionizing space travel!', 'timestamp': '2024-01-01T12:00:00Z'}
]
sentiments = analyzer.analyze_social_media_data(social_data)

# Get aggregated sentiment
avg_sentiment, confidence, count = analyzer.get_aggregated_sentiment(
    sentiments, SubjectType.MUSK, hours=24
)
```

### EigenTrust Implementation

```python
from app import EigenTrustCalculator
import numpy as np

trust_calc = EigenTrustCalculator()

# Build trust matrix from data
trust_matrix = trust_calc.build_trust_matrix(data_points)

# Calculate EigenTrust scores
pre_trust = np.array([0.6, 0.4])  # Initial trust values
eigentrust_scores = trust_calc.calculate_eigentrust(trust_matrix, pre_trust)
```

## 📈 Reputation Score Calculation

The overall reputation score (0-100) is calculated as a weighted average of four components:

- **Sentiment Component (25%)**: AI-analyzed sentiment from social media and news
- **Economic Component (30%)**: Financial performance and economic indicators  
- **Social Component (20%)**: Social media engagement and demographic factors
- **Trust Component (25%)**: EigenTrust-calculated trust scores from network analysis

```python
reputation_score = (
    0.25 * sentiment_component +
    0.30 * economic_component +
    0.20 * social_component +
    0.25 * trust_component
)
```

## 🔧 API Reference

### Data Collection APIs

```python
# Collect all data sources
all_data = await collector.collect_all_data()

# Individual source collection
fred_data = await collector.collect_fred_data()
financial_data = await collector.collect_ycharts_data()
sentiment_data = await collector.collect_michigan_sentiment()
social_data = await collector.collect_our_world_in_data()
census_data = await collector.collect_census_data()
openrank_data = await collector.collect_openrank_data()
```

### Reputation Analysis

```python
from app import ReputationTracker

tracker = ReputationTracker()
result = await tracker.run_full_analysis()

print(f"Musk Score: {result.musk_reputation.overall_score:.1f}")
print(f"Trump Score: {result.trump_reputation.overall_score:.1f}")
print(f"Leader: {result.comparison_metrics['leader']}")
```

## 📝 Configuration

### Environment Variables

```bash
# Optional API keys for enhanced data collection
FRED_API_KEY=your_fred_api_key
OPENRANK_API_KEY=your_openrank_api_key
TWITTER_BEARER_TOKEN=your_twitter_token
NEWS_API_KEY=your_news_api_key

# Flask configuration
FLASK_ENV=production
FLASK_PORT=5000
```

### Data Collection Settings

```python
# Customize data collection in data_collector.py
class DataCollector:
    def __init__(self):
        self.cache_duration = timedelta(hours=1)  # Cache duration
        self.http_timeout = 30.0  # HTTP timeout in seconds
```

## 🚀 Deployment

### GitHub Pages Deployment

1. **Push your code** to the main branch
2. **Enable GitHub Pages** in repository settings
3. **Set source** to `/` (root) or `/docs` directory  
4. **Configure custom domain** (optional)

The frontend will automatically load data from `data/reputation_data.json`.

### Backend Deployment Options

- **Heroku**: Use the included `Procfile` for easy deployment
- **AWS Lambda**: Serverless function for periodic analysis
- **Docker**: Containerized deployment with included `Dockerfile`
- **VPS/Cloud Server**: Traditional server deployment

### Automated Updates

Set up GitHub Actions to run analysis periodically:

```yaml
name: Update Reputation Data
on:
  schedule:
    - cron: '0 */6 * * *'  # Every 6 hours
  workflow_dispatch:

jobs:
  update-data:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Set up Python
        uses: actions/setup-python@v2
        with:
          python-version: 3.12
      - name: Install dependencies
        run: pip install -r requirements.txt
      - name: Run analysis
        run: cd backend && python app.py
      - name: Commit results
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add data/reputation_data.json
          git commit -m "Update reputation data" || exit 0
          git push
```

## 🧪 Testing

### Run Backend Tests

```bash
# Test data collection
python -m backend.data_collector

# Test sentiment analysis
python -m backend.sentiment_analyzer

# Test full analysis pipeline
python -m backend.app
```

### Frontend Testing

Open `frontend/index.html` in a web browser or serve with:

```bash
# Using Python's built-in server
cd frontend
python -m http.server 8000
```

## 📊 Sample Output

The system generates comprehensive reputation data:

```json
{
  "timestamp": "2024-01-01T12:00:00Z",
  "musk_reputation": {
    "overall_score": 72.5,
    "sentiment_component": 68.2,
    "economic_component": 78.9,
    "social_component": 65.1,
    "trust_component": 77.8,
    "confidence_interval": [67.3, 77.7]
  },
  "trump_reputation": {
    "overall_score": 58.3,
    "sentiment_component": 52.1,
    "economic_component": 61.7,
    "social_component": 55.9,
    "trust_component": 63.2,
    "confidence_interval": [52.2, 64.4]
  },
  "comparison_metrics": {
    "reputation_difference": 14.2,
    "leader": "musk",
    "confidence_gap": 14.2
  }
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenRank SDK** for trust and reputation algorithms
- **Hugging Face Transformers** for sentiment analysis models
- **FRED, YCharts, and other data providers** for economic and financial data
- **Plotly.js** for interactive visualizations
- **Bootstrap** for responsive UI components

## 📞 Support

For questions and support:

- 📧 Email: support@example.com
- 💬 Issues: [GitHub Issues](https://github.com/hannesmitterer/musk_vs_trump/issues)
- 📖 Documentation: [Wiki](https://github.com/hannesmitterer/musk_vs_trump/wiki)

---

**Disclaimer**: This project is for educational and research purposes. Reputation scores are algorithmic calculations and should not be considered as definitive assessments of any individual's actual reputation or character.