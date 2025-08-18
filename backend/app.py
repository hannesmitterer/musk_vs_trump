"""
Flask backend for musk_vs_trump live sentiment race
"""

from flask import Flask, jsonify
from flask_cors import CORS
import sys
from sentiment_analyzer import sentiment_analyzer

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend access

@app.route('/')
def hello():
    return "Musk vs Trump Backend Server is running!"

@app.route('/health')
def health():
    return {"status": "healthy", "message": "Backend server is operational"}

@app.route('/api/race/leaderboard')
def get_leaderboard():
    """
    Get current leaderboard with sentiment-based scores for Musk and Trump
    Returns dynamic scores based on sentiment analysis
    """
    try:
        scores = sentiment_analyzer.get_live_scores()
        return jsonify({
            "status": "success",
            "leaderboard": scores
        })
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
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