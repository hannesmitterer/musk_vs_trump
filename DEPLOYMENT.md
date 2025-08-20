# Deployment Guide - Musk vs Trump AI Reputation Tracker

This guide provides step-by-step instructions for deploying the enhanced backend server with live social media reputation tracking capabilities.

## 📋 Prerequisites

- **Python 3.x** (tested with Python 3.8+)
- **pip** (Python package manager)
- **Git** (for cloning the repository)
- **Internet connection** (for API calls and package installation)

## 🚀 Quick Deployment (Automated)

### Option 1: Shell Script (Recommended)
```bash
# Clone the repository
git clone https://github.com/hannesmitterer/musk_vs_trump.git
cd musk_vs_trump/backend

# Run automated setup script
chmod +x start_backend.sh
./start_backend.sh
```

### Option 2: Makefile
```bash
# Clone the repository  
git clone https://github.com/hannesmitterer/musk_vs_trump.git
cd musk_vs_trump/backend

# Setup and start server
make setup
make start-server
```

## 🔧 Manual Deployment

If you prefer manual setup or need to troubleshoot:

### Step 1: Clone Repository
```bash
git clone https://github.com/hannesmitterer/musk_vs_trump.git
cd musk_vs_trump/backend
```

### Step 2: Install Dependencies
```bash
# Install Python dependencies
pip3 install -r requirements.txt

# Verify installation
python3 -c "import flask, requests, flask_cors; print('✅ All dependencies installed successfully!')"
```

### Step 3: Initialize Database
```bash
# Initialize database tables
python3 -c "import db_manager; db_manager.create_tables()"
```

### Step 4: Start the Server
```bash
# Start the Flask development server
python3 app.py
```

The server will start on `http://localhost:5000`

## 🌐 Available Endpoints

Once deployed, your backend server will provide the following endpoints:

### Core Endpoints
- `GET /` - Server status check
- `GET /health` - Detailed health information

### Reputation Analysis Endpoints
- `GET /api/reputation/musk` - Get Elon Musk's reputation score
- `GET /api/reputation/trump` - Get Donald Trump's reputation score  
- `GET /api/reputation/compare` - Compare both reputation scores
- `GET /api/trending` - Get trending topics
- `GET /api/status` - Get API usage status

### Query Parameters
All reputation endpoints support:
- `limit` (int, default: 20, max: 100) - Number of mentions to analyze
- `time_range` (string, default: "24h") - Time range for data collection

### Example API Calls
```bash
# Basic reputation check
curl http://localhost:5000/api/reputation/musk

# Reputation with custom parameters
curl "http://localhost:5000/api/reputation/trump?limit=50&time_range=7d"

# Compare both personalities
curl http://localhost:5000/api/reputation/compare

# Get trending topics
curl http://localhost:5000/api/trending

# Check API status
curl http://localhost:5000/api/status
```

## 📊 API Response Format

### Reputation Endpoint Response
```json
{
  "person": "musk",
  "reputation_data": {
    "total_mentions": 5,
    "positive_mentions": 3,
    "negative_mentions": 2,
    "neutral_mentions": 0,
    "reputation_score": 60.0,
    "sentiment_distribution": {
      "positive": 60.0,
      "negative": 40.0,
      "neutral": 0.0
    },
    "analysis_timestamp": "2024-01-15T10:30:00.000Z",
    "data_source": "mock_data_for_demo"
  },
  "request_info": {
    "limit": 20,
    "time_range": "24h",
    "api_credits_used": 1
  }
}
```

### Compare Endpoint Response
```json
{
  "comparison_results": {
    "comparison": {
      "Elon Musk": {
        "reputation_score": 60.0,
        "total_mentions": 5,
        "sentiment_distribution": {"positive": 60.0, "negative": 40.0, "neutral": 0.0}
      },
      "Donald Trump": {
        "reputation_score": 45.0,
        "total_mentions": 5,
        "sentiment_distribution": {"positive": 40.0, "negative": 60.0, "neutral": 0.0}
      }
    },
    "winner": "Elon Musk",
    "score_difference": 15.0
  }
}
```

## 🔧 Production Deployment Options

### Option 1: Local Production Server
```bash
# Install production WSGI server
pip3 install gunicorn

# Start with Gunicorn (production-ready)
cd backend
gunicorn --bind 0.0.0.0:5000 --workers 4 app:app
```

### Option 2: Docker Deployment
```bash
# Create Dockerfile in backend directory
cat > Dockerfile << EOF
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 5000

CMD ["python", "app.py"]
EOF

# Build and run Docker container
docker build -t musk-trump-backend .
docker run -p 5000:5000 musk-trump-backend
```

### Option 3: Cloud Deployment (Heroku)
```bash
# Create Procfile for Heroku
echo "web: gunicorn app:app" > Procfile

# Deploy to Heroku
heroku create musk-trump-tracker
git add .
git commit -m "Deploy backend"
git push heroku main
```

## 🧪 Testing the Deployment

### Basic Health Check
```bash
# Test server is running
curl http://localhost:5000/
# Expected: "Musk vs Trump Backend Server is running!"

# Test health endpoint
curl http://localhost:5000/health
# Expected: {"status": "healthy", "message": "Backend server is operational"}
```

### Test New Reputation Endpoints
```bash
# Test Musk reputation
curl http://localhost:5000/api/reputation/musk
# Should return JSON with reputation score and sentiment analysis

# Test comparison
curl http://localhost:5000/api/reputation/compare  
# Should return comparison between Musk and Trump

# Test trending topics
curl http://localhost:5000/api/trending
# Should return trending hashtags and topics
```

## 🐛 Troubleshooting

### Common Issues and Solutions

#### Issue: "Module not found" errors
```bash
# Solution: Ensure all dependencies are installed
cd backend
pip3 install -r requirements.txt
```

#### Issue: "Permission denied" on start_backend.sh
```bash
# Solution: Make script executable
chmod +x start_backend.sh
```

#### Issue: "Port 5000 already in use"
```bash
# Solution: Kill existing process or change port
pkill -f "python.*app.py"
# OR edit app.py and change port number
```

#### Issue: API endpoints return 500 errors
```bash
# Solution: Check Python import paths
cd backend
python3 -c "import data_collector, sentiment_analyzer; print('✅ Imports working')"
```

#### Issue: CORS errors from frontend
The backend now includes CORS support via `flask-cors`. If you still get CORS errors:
```bash
# Verify flask-cors is installed
pip3 install flask-cors
```

## 📈 Performance Monitoring

### Monitor API Usage
```bash
# Check API status endpoint
curl http://localhost:5000/api/status
```

### Log Analysis
```bash
# View Flask logs (if running in background)
tail -f nohup.out

# For production debugging
gunicorn --access-logfile - --error-logfile - app:app
```

## 🔐 Security Considerations

### For Production Deployment:

1. **Environment Variables**: Set Flask to production mode
   ```bash
   export FLASK_ENV=production
   export FLASK_DEBUG=False
   ```

2. **API Keys**: In production, configure real Social Searcher API keys
   ```bash
   export SOCIAL_SEARCHER_API_KEY="your_real_api_key"
   ```

3. **Rate Limiting**: Consider implementing rate limiting for API endpoints

4. **HTTPS**: Use HTTPS in production with proper SSL certificates

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Verify all prerequisites are met
3. Ensure internet connectivity for API calls
4. Check server logs for detailed error messages

## 🔄 Updates and Maintenance

### Updating the Application
```bash
# Pull latest changes
git pull origin main

# Reinstall dependencies (if requirements.txt changed)
pip3 install -r requirements.txt

# Restart server
./start_backend.sh
```

### Database Maintenance
```bash
# Reinitialize database if needed
python3 -c "import db_manager; db_manager.create_tables()"
```

---

**🎉 Congratulations!** Your Musk vs Trump AI Reputation Tracker backend is now deployed and ready to track live social media reputation scores!