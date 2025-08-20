"""
Flask app for musk_vs_trump backend with AI-powered sentiment analysis
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
import sys
from datetime import datetime

# Import our custom modules
from data_collector import data_collector
from sentiment_analyzer import sentiment_analyzer

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend integration

@app.route('/')
def hello():
    return "Musk vs Trump Backend Server is running!"

@app.route('/health')
def health():
    return {"status": "healthy", "message": "Backend server is operational"}

@app.route('/api/reputation/<person>', methods=['GET'])
def get_reputation(person):
    """
    Get reputation score for a specific person (musk or trump)
    """
    try:
        # Validate person parameter
        person_lower = person.lower()
        if person_lower not in ['musk', 'trump', 'elon', 'donald']:
            return jsonify({
                "error": "Invalid person. Supported: musk, trump, elon, donald",
                "status": "error"
            }), 400
        
        # Get query parameters
        limit = request.args.get('limit', 20, type=int)
        time_range = request.args.get('time_range', '24h')
        
        # Limit the number of mentions to prevent overload
        limit = min(limit, 100)
        
        # Fetch social media mentions
        mentions_data = data_collector.fetch_mentions(person, limit=limit, time_range=time_range)
        
        # Analyze sentiment
        sentiment_analysis = sentiment_analyzer.analyze_mentions(mentions_data.get('mentions', []))
        
        # Combine results
        result = {
            "person": person,
            "reputation_data": {
                **sentiment_analysis,
                "data_source": mentions_data.get('source', 'unknown'),
                "search_timestamp": mentions_data.get('search_timestamp'),
                "total_mentions_found": mentions_data.get('total_found', 0)
            },
            "request_info": {
                "limit": limit,
                "time_range": time_range,
                "api_credits_used": mentions_data.get('api_credits_used', 0)
            }
        }
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({
            "error": f"Failed to get reputation data: {str(e)}",
            "status": "error"
        }), 500

@app.route('/api/reputation/compare', methods=['GET'])
def compare_reputations():
    """
    Compare reputation scores between Musk and Trump
    """
    try:
        # Get query parameters
        limit = request.args.get('limit', 20, type=int)
        time_range = request.args.get('time_range', '24h')
        limit = min(limit, 100)
        
        # Fetch data for both personalities
        musk_mentions = data_collector.fetch_mentions('Elon Musk', limit=limit, time_range=time_range)
        trump_mentions = data_collector.fetch_mentions('Donald Trump', limit=limit, time_range=time_range)
        
        # Analyze sentiment for both
        musk_analysis = sentiment_analyzer.analyze_mentions(musk_mentions.get('mentions', []))
        trump_analysis = sentiment_analyzer.analyze_mentions(trump_mentions.get('mentions', []))
        
        # Compare reputations
        comparison = sentiment_analyzer.compare_reputations(
            musk_analysis, trump_analysis, "Elon Musk", "Donald Trump"
        )
        
        result = {
            "comparison_results": comparison,
            "detailed_analysis": {
                "musk": {
                    **musk_analysis,
                    "data_source": musk_mentions.get('source', 'unknown')
                },
                "trump": {
                    **trump_analysis,
                    "data_source": trump_mentions.get('source', 'unknown')
                }
            },
            "request_info": {
                "limit": limit,
                "time_range": time_range,
                "total_api_credits_used": (
                    musk_mentions.get('api_credits_used', 0) + 
                    trump_mentions.get('api_credits_used', 0)
                )
            }
        }
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({
            "error": f"Failed to compare reputations: {str(e)}",
            "status": "error"
        }), 500

@app.route('/api/trending', methods=['GET'])
def get_trending():
    """
    Get trending topics related to Musk and Trump
    """
    try:
        trending_data = data_collector.get_trending_topics()
        return jsonify(trending_data)
    except Exception as e:
        return jsonify({
            "error": f"Failed to get trending topics: {str(e)}",
            "status": "error"
        }), 500

@app.route('/api/status', methods=['GET'])
def get_api_status():
    """
    Get API status and usage information
    """
    try:
        status_data = data_collector.get_api_status()
        status_data['server_timestamp'] = datetime.utcnow().isoformat()
        return jsonify(status_data)
    except Exception as e:
        return jsonify({
            "error": f"Failed to get API status: {str(e)}",
            "status": "error"
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