"""
Sample Flask app for musk_vs_trump backend
"""

from flask import Flask, jsonify
from flask_cors import CORS
import sys
import logging
from sentiment_analyzer import get_current_leaderboard

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.route('/')
def hello():
    return "Musk vs Trump Backend Server is running!"

@app.route('/health')
def health():
    return {"status": "healthy", "message": "Backend server is operational"}

@app.route('/api/race/leaderboard')
def race_leaderboard():
    """
    API endpoint for live sentiment-based race leaderboard
    Returns current scores for Musk vs Trump based on sentiment analysis
    """
    try:
        scores = get_current_leaderboard()
        response = {
            "status": "success",
            "data": {
                "musk": {
                    "name": "Elon Musk",
                    "score": scores['musk_score'],
                    "sentiment": scores['musk_sentiment'],
                    "sample_text": scores['musk_text_sample']
                },
                "trump": {
                    "name": "Donald Trump", 
                    "score": scores['trump_score'],
                    "sentiment": scores['trump_sentiment'],
                    "sample_text": scores['trump_text_sample']
                }
            },
            "timestamp": "live",
            "update_interval": 10
        }
        logger.info(f"Leaderboard API called - Musk: {scores['musk_score']}, Trump: {scores['trump_score']}")
        return jsonify(response)
    except Exception as e:
        logger.error(f"Error in leaderboard API: {e}")
        return jsonify({
            "status": "error",
            "message": "Failed to get leaderboard data",
            "data": {
                "musk": {"name": "Elon Musk", "score": 50.0, "sentiment": 0.0},
                "trump": {"name": "Donald Trump", "score": 50.0, "sentiment": 0.0}
            }
        }), 500

if __name__ == '__main__':
    print("🌐 Musk vs Trump Backend Server starting...")
    print("Server will be available at: http://localhost:5000")
    print("Health check endpoint: http://localhost:5000/health")
    
    try:
        app.run(host='0.0.0.0', port=5000, debug=True)
    except KeyboardInterrupt:
        print("\n👋 Server stopped gracefully")
        sys.exit(0)