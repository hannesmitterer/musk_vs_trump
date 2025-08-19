"""
Sample Flask app for musk_vs_trump backend
"""

from flask import Flask, jsonify
from flask_cors import CORS
import sys

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend access

@app.route('/')
def hello():
    return "Musk vs Trump Backend Server is running!"

@app.route('/health')
def health():
    return {"status": "healthy", "message": "Backend server is operational"}

# Sample kernel graph data representing relationships between entities
KERNEL_GRAPH_DATA = {
    "nodes": [
        {"id": "musk", "label": "Elon Musk", "type": "person", "sentiment": 0.3, "influence": 0.9},
        {"id": "trump", "label": "Donald Trump", "type": "person", "sentiment": -0.2, "influence": 0.8},
        {"id": "twitter", "label": "X (Twitter)", "type": "platform", "sentiment": 0.1, "influence": 0.7},
        {"id": "tesla", "label": "Tesla", "type": "company", "sentiment": 0.4, "influence": 0.6},
        {"id": "spacex", "label": "SpaceX", "type": "company", "sentiment": 0.5, "influence": 0.5},
        {"id": "politics", "label": "Politics", "type": "topic", "sentiment": -0.1, "influence": 0.8},
        {"id": "technology", "label": "Technology", "type": "topic", "sentiment": 0.3, "influence": 0.7},
        {"id": "media", "label": "Social Media", "type": "topic", "sentiment": 0.0, "influence": 0.9}
    ],
    "edges": [
        {"source": "musk", "target": "twitter", "weight": 0.9, "type": "ownership"},
        {"source": "musk", "target": "tesla", "weight": 0.8, "type": "leadership"},
        {"source": "musk", "target": "spacex", "weight": 0.9, "type": "leadership"},
        {"source": "musk", "target": "technology", "weight": 0.7, "type": "involvement"},
        {"source": "trump", "target": "politics", "weight": 0.9, "type": "involvement"},
        {"source": "trump", "target": "media", "weight": 0.6, "type": "influence"},
        {"source": "twitter", "target": "media", "weight": 0.8, "type": "platform"},
        {"source": "musk", "target": "politics", "weight": 0.4, "type": "involvement"},
        {"source": "trump", "target": "twitter", "weight": 0.3, "type": "usage"},
        {"source": "tesla", "target": "technology", "weight": 0.8, "type": "industry"},
        {"source": "spacex", "target": "technology", "weight": 0.9, "type": "industry"}
    ],
    "metadata": {
        "title": "Musk vs Trump Influence Network",
        "description": "Kernel graph showing relationships and influence patterns",
        "last_updated": "2024-01-15",
        "node_count": 8,
        "edge_count": 11
    }
}

@app.route('/api/graph')
def get_graph_data():
    """Return kernel graph data for visualization"""
    return jsonify(KERNEL_GRAPH_DATA)

@app.route('/api/graph/nodes')
def get_nodes():
    """Return only node data"""
    return jsonify(KERNEL_GRAPH_DATA["nodes"])

@app.route('/api/graph/edges')
def get_edges():
    """Return only edge data"""
    return jsonify(KERNEL_GRAPH_DATA["edges"])

if __name__ == '__main__':
    print("🌐 Musk vs Trump Backend Server starting...")
    print("Server will be available at: http://localhost:5000")
    print("Health check endpoint: http://localhost:5000/health")
    
    try:
        app.run(host='0.0.0.0', port=5000, debug=True)
    except KeyboardInterrupt:
        print("\n👋 Server stopped gracefully")
        sys.exit(0)