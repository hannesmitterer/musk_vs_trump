"""
Sample Flask app for musk_vs_trump backend
"""

from flask import Flask, jsonify
from flask_cors import CORS
import sys
import random
import time

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend-backend communication

@app.route('/')
def hello():
    return "Musk vs Trump Backend Server is running!"

@app.route('/health')
def health():
    return {"status": "healthy", "message": "Backend server is operational"}

@app.route('/api/reputation')
def reputation():
    """
    API endpoint that provides live reputation scores for Musk and Trump.
    Returns JSON with reputation data including scores, trends, and timestamps.
    """
    # Generate realistic-looking reputation data
    # In a real implementation, this would come from AI sentiment analysis
    current_time = int(time.time() * 1000)  # Current timestamp in milliseconds
    
    # Generate some realistic score variations (0-100 scale)
    musk_base_score = 72
    trump_base_score = 68
    
    # Add some random variation to simulate real-time changes
    musk_variation = random.uniform(-5, 5)
    trump_variation = random.uniform(-5, 5)
    
    musk_score = max(0, min(100, musk_base_score + musk_variation))
    trump_score = max(0, min(100, trump_base_score + trump_variation))
    
    reputation_data = {
        "timestamp": current_time,
        "data": {
            "musk": {
                "name": "Elon Musk",
                "score": round(musk_score, 1),
                "trend": "up" if musk_variation > 0 else "down",
                "change": round(abs(musk_variation), 1),
                "color": "#1DA1F2"  # Twitter blue
            },
            "trump": {
                "name": "Donald Trump",
                "score": round(trump_score, 1),
                "trend": "up" if trump_variation > 0 else "down", 
                "change": round(abs(trump_variation), 1),
                "color": "#FF4444"  # Red
            }
        },
        "status": "success",
        "message": "Live reputation data retrieved successfully"
    }
    
    return jsonify(reputation_data)

if __name__ == '__main__':
    print("🌐 Musk vs Trump Backend Server starting...")
    print("Server will be available at: http://localhost:5000")
    print("Health check endpoint: http://localhost:5000/health")
    
    try:
        app.run(host='0.0.0.0', port=5000, debug=True)
    except KeyboardInterrupt:
        print("\n👋 Server stopped gracefully")
        sys.exit(0)