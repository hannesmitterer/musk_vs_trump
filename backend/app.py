"""
Enhanced Flask app for musk_vs_trump backend with API endpoints
"""

from flask import Flask, jsonify
from flask_cors import CORS
import sys
import random
import time
from datetime import datetime, timedelta
import json

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend integration

# Store for logs (in production, use a proper database)
logs_store = []

def generate_reputation_data():
    """Generate mock reputation data for demonstration"""
    now = datetime.now()
    data_points = []
    
    # Generate 50 data points over the last hour
    for i in range(50):
        timestamp = now - timedelta(minutes=60-i)
        
        # Generate realistic sentiment and engagement data
        musk_sentiment = random.uniform(-0.5, 0.8)  # Generally more positive
        trump_sentiment = random.uniform(-0.6, 0.7)  # More volatile
        
        musk_engagement = random.uniform(60, 95)
        trump_engagement = random.uniform(50, 90)
        
        data_points.extend([
            {
                "person": "Elon Musk",
                "x": timestamp.isoformat(),
                "y": musk_sentiment,
                "z": musk_engagement,
                "timestamp": timestamp.isoformat()
            },
            {
                "person": "Donald Trump", 
                "x": timestamp.isoformat(),
                "y": trump_sentiment,
                "z": trump_engagement,
                "timestamp": timestamp.isoformat()
            }
        ])
        
        # Add log entries occasionally
        if i % 5 == 0:
            person = "Musk" if random.random() > 0.5 else "Trump"
            sentiment = musk_sentiment if person == "Musk" else trump_sentiment
            
            log_entry = {
                "timestamp": timestamp.isoformat(),
                "message": f"Sentiment analysis completed for {person} - {'Positive' if sentiment > 0 else 'Negative'} trend detected",
                "type": "info",
                "sentiment": round(sentiment, 3)
            }
            
            logs_store.append(log_entry)
    
    # Keep only the last 50 logs
    logs_store[:] = logs_store[-50:]
    
    return data_points

@app.route('/')
def hello():
    return "Musk vs Trump Backend Server is running!"

@app.route('/health')
def health():
    return {"status": "healthy", "message": "Backend server is operational"}

@app.route('/api/reputation')
def get_reputation_data():
    """API endpoint for reputation data"""
    try:
        data = generate_reputation_data()
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/logs')
def get_logs():
    """API endpoint for system logs"""
    try:
        # Add a new log entry for this request
        new_log = {
            "timestamp": datetime.now().isoformat(),
            "message": f"Reputation data requested - {len(logs_store)} total entries",
            "type": "info",
            "sentiment": None
        }
        logs_store.append(new_log)
        
        # Return the last 20 logs
        return jsonify(logs_store[-20:])
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/status')
def get_api_status():
    """API endpoint for system status"""
    return jsonify({
        "status": "operational",
        "timestamp": datetime.now().isoformat(),
        "endpoints": {
            "reputation": "/api/reputation",
            "logs": "/api/logs",
            "status": "/api/status"
        },
        "features": {
            "cors_enabled": True,
            "real_time_data": True,
            "3d_visualization": True
        }
    })

if __name__ == '__main__':
    print("🌐 Musk vs Trump Backend Server starting...")
    print("Server will be available at: http://localhost:5000")
    print("Health check endpoint: http://localhost:5000/health")
    
    try:
        app.run(host='0.0.0.0', port=5000, debug=True)
    except KeyboardInterrupt:
        print("\n👋 Server stopped gracefully")
        sys.exit(0)