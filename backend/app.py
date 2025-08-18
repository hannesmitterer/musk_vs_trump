from flask import Flask, jsonify, request
import logging
import os
from db_manager import get_connection

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)

@app.route('/', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'AI Reputation Tracker Backend',
        'version': '1.0.0'
    })

@app.route('/api/reputation/<person>', methods=['GET'])
def get_reputation(person):
    """Get reputation data for a person"""
    try:
        conn = get_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT sentiment_score, timestamp, source, content 
            FROM reputation_data 
            WHERE person = ? 
            ORDER BY timestamp DESC 
            LIMIT 100
        ''', (person,))
        
        data = cursor.fetchall()
        conn.close()
        
        reputation_data = []
        for row in data:
            reputation_data.append({
                'sentiment_score': row[0],
                'timestamp': row[1],
                'source': row[2],
                'content': row[3]
            })
        
        return jsonify({
            'person': person,
            'data': reputation_data,
            'count': len(reputation_data)
        })
        
    except Exception as e:
        logger.error(f"Error fetching reputation data: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/summary/<person>', methods=['GET'])
def get_summary(person):
    """Get summary statistics for a person"""
    try:
        conn = get_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT avg_sentiment, total_mentions, date 
            FROM summary_stats 
            WHERE person = ? 
            ORDER BY date DESC 
            LIMIT 30
        ''', (person,))
        
        data = cursor.fetchall()
        conn.close()
        
        summary_data = []
        for row in data:
            summary_data.append({
                'avg_sentiment': row[0],
                'total_mentions': row[1],
                'date': row[2]
            })
        
        return jsonify({
            'person': person,
            'summary': summary_data
        })
        
    except Exception as e:
        logger.error(f"Error fetching summary data: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    logger.info("Starting AI Reputation Tracker Backend...")
    app.run(host='0.0.0.0', port=5000, debug=True)