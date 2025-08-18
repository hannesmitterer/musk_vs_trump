"""
Main Flask Application for Musk vs Trump Reputation Tracker
Provides REST API for all reputation tracking functionality
"""
import os
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime, timedelta
import json

from models import db_manager, ReputationScore
from sentiment_analyzer import AdvancedSentimentAnalyzer
from data_collector import DataCollector
from deep_learning_integration import DeepLearningDrizzleIntegration
from ai_algorithms_loader import AIAlgorithmsLoader
from pywinassistant_interface import PyWinAssistantInterface, PyWinAssistantPlugin

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')

# Enable CORS for all routes (needed for frontend)
CORS(app)

# Initialize components
try:
    db_manager.create_tables()
    sentiment_analyzer = AdvancedSentimentAnalyzer()
    data_collector = DataCollector()
    dl_integration = DeepLearningDrizzleIntegration()
    ai_loader = AIAlgorithmsLoader()
    pywin_interface = PyWinAssistantInterface()
    pywin_plugin = PyWinAssistantPlugin()
    
    logger.info("All components initialized successfully")
except Exception as e:
    logger.error(f"Error initializing components: {str(e)}")


@app.route('/')
def home():
    """Home endpoint with API information"""
    return jsonify({
        'name': 'Musk vs Trump Reputation Tracker API',
        'version': '1.0.0',
        'description': 'AI-powered reputation tracking with deep learning integration',
        'endpoints': {
            'health': '/health',
            'reputation': '/api/reputation',
            'sentiment': '/api/sentiment',
            'collect': '/api/collect',
            'compare': '/api/compare',
            'ai_insights': '/api/ai/insights',
            'pywinassistant': '/api/pywinassistant'
        },
        'status': 'active',
        'timestamp': datetime.utcnow().isoformat()
    })


@app.route('/health')
def health_check():
    """Health check endpoint"""
    try:
        # Test database connection
        db_session = db_manager.get_session()
        db_session.execute('SELECT 1')
        db_session.close()
        
        # Check component status
        status = {
            'status': 'healthy',
            'timestamp': datetime.utcnow().isoformat(),
            'components': {
                'database': 'connected',
                'sentiment_analyzer': 'loaded' if sentiment_analyzer.get_analyzer_status()['ready'] else 'error',
                'data_collector': 'active',
                'deep_learning': 'loaded',
                'ai_algorithms': 'loaded',
                'pywinassistant': 'ready'
            }
        }
        
        return jsonify(status)
        
    except Exception as e:
        return jsonify({
            'status': 'unhealthy',
            'error': str(e),
            'timestamp': datetime.utcnow().isoformat()
        }), 500


@app.route('/api/reputation/<person>')
@app.route('/api/reputation')
def get_reputation(person=None):
    """Get reputation scores for a person"""
    try:
        # Query parameters
        days = request.args.get('days', 7, type=int)
        limit = request.args.get('limit', 100, type=int)
        
        # Date range
        end_date = datetime.utcnow()
        start_date = end_date - timedelta(days=days)
        
        # Get reputation data
        scores = pywin_interface.get_reputation_scores(
            person=person,
            start_date=start_date,
            end_date=end_date,
            limit=limit
        )
        
        response = {
            'person': person,
            'period': f'{days} days',
            'count': len(scores),
            'scores': scores,
            'retrieved_at': datetime.utcnow().isoformat()
        }
        
        if scores:
            # Add summary statistics
            score_values = [s['score'] for s in scores if s['score'] is not None]
            if score_values:
                response['summary'] = {
                    'average_score': sum(score_values) / len(score_values),
                    'min_score': min(score_values),
                    'max_score': max(score_values),
                    'latest_score': score_values[0] if score_values else None
                }
        
        return jsonify(response)
        
    except Exception as e:
        logger.error(f"Error in get_reputation: {str(e)}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/sentiment/analyze', methods=['POST'])
def analyze_sentiment():
    """Analyze sentiment of provided text"""
    try:
        data = request.get_json()
        
        if not data or 'text' not in data:
            return jsonify({'error': 'Text field is required'}), 400
        
        text = data['text']
        person = data.get('person')
        
        if isinstance(text, str):
            # Single text analysis
            if person:
                result = sentiment_analyzer.get_reputation_impact(text, person)
            else:
                result = sentiment_analyzer.analyze_text(text)
        elif isinstance(text, list):
            # Batch analysis
            result = sentiment_analyzer.analyze_batch(text)
        else:
            return jsonify({'error': 'Text must be string or list of strings'}), 400
        
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Error in analyze_sentiment: {str(e)}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/collect/run', methods=['POST'])
def run_data_collection():
    """Run data collection cycle"""
    try:
        data = request.get_json() or {}
        
        persons = data.get('persons', ['musk', 'trump'])
        sources = data.get('sources', ['mock'])  # Default to mock for demo
        
        # Run collection cycle
        results = data_collector.run_collection_cycle(persons, sources)
        
        return jsonify(results)
        
    except Exception as e:
        logger.error(f"Error in run_data_collection: {str(e)}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/collect/stats')
def get_collection_stats():
    """Get data collection statistics"""
    try:
        days = request.args.get('days', 7, type=int)
        stats = data_collector.get_collection_stats(days)
        return jsonify(stats)
        
    except Exception as e:
        logger.error(f"Error in get_collection_stats: {str(e)}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/compare')
def compare_reputations():
    """Compare reputations between Musk and Trump"""
    try:
        days = request.args.get('days', 7, type=int)
        
        comparison = pywin_interface.compare_reputations('musk', 'trump', days)
        
        return jsonify(comparison)
        
    except Exception as e:
        logger.error(f"Error in compare_reputations: {str(e)}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/trend/<person>')
def get_trend_analysis(person):
    """Get trend analysis for a person"""
    try:
        days = request.args.get('days', 30, type=int)
        
        analysis = pywin_interface.analyze_reputation_trend(person, days)
        
        return jsonify(analysis)
        
    except Exception as e:
        logger.error(f"Error in get_trend_analysis: {str(e)}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/ai/insights')
def get_ai_insights():
    """Get AI-powered insights"""
    try:
        person = request.args.get('person')
        analysis_type = request.args.get('type', 'comprehensive')
        
        insights = pywin_interface.get_ai_insights(person, analysis_type)
        
        return jsonify(insights)
        
    except Exception as e:
        logger.error(f"Error in get_ai_insights: {str(e)}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/ai/models')
def get_ai_models():
    """Get information about available AI models and algorithms"""
    try:
        models_info = {
            'deep_learning_models': dl_integration.get_available_models(),
            'loaded_algorithms': ai_loader.get_loaded_algorithms(),
            'sentiment_analyzer_status': sentiment_analyzer.get_analyzer_status(),
            'retrieved_at': datetime.utcnow().isoformat()
        }
        
        return jsonify(models_info)
        
    except Exception as e:
        logger.error(f"Error in get_ai_models: {str(e)}")
        return jsonify({'error': str(e)}), 500


# PyWinAssistant API endpoints
@app.route('/api/pywinassistant/info')
def pywinassistant_info():
    """Get PyWinAssistant plugin information"""
    try:
        return jsonify(pywin_plugin.get_plugin_info())
        
    except Exception as e:
        logger.error(f"Error in pywinassistant_info: {str(e)}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/pywinassistant/leader')
def get_current_leader():
    """Get current reputation leader (PyWinAssistant compatible)"""
    try:
        return jsonify(pywin_plugin.get_current_leader())
        
    except Exception as e:
        logger.error(f"Error in get_current_leader: {str(e)}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/pywinassistant/summary/<person>')
def get_reputation_summary(person):
    """Get reputation summary (PyWinAssistant compatible)"""
    try:
        return jsonify(pywin_plugin.get_reputation_summary(person))
        
    except Exception as e:
        logger.error(f"Error in get_reputation_summary: {str(e)}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/pywinassistant/predict/<person>')
def predict_trends(person):
    """Predict reputation trends (PyWinAssistant compatible)"""
    try:
        days = request.args.get('days', 7, type=int)
        return jsonify(pywin_plugin.predict_trends(person, days))
        
    except Exception as e:
        logger.error(f"Error in predict_trends: {str(e)}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/pywinassistant/export')
def export_for_pywinassistant():
    """Export data for PyWinAssistant integration"""
    try:
        format_type = request.args.get('format', 'json')
        export_data = pywin_interface.export_for_pywinassistant(format_type)
        
        return export_data, 200, {'Content-Type': 'application/json'}
        
    except Exception as e:
        logger.error(f"Error in export_for_pywinassistant: {str(e)}")
        return jsonify({'error': str(e)}), 500


# Data initialization and demo endpoints
@app.route('/api/demo/init', methods=['POST'])
def initialize_demo_data():
    """Initialize demo data for testing"""
    try:
        # Run data collection to populate database
        results = data_collector.run_collection_cycle(['musk', 'trump'], ['mock'])
        
        # Get summary stats
        stats = data_collector.get_collection_stats(1)
        
        response = {
            'demo_initialized': True,
            'collection_results': results,
            'current_stats': stats,
            'initialized_at': datetime.utcnow().isoformat()
        }
        
        return jsonify(response)
        
    except Exception as e:
        logger.error(f"Error in initialize_demo_data: {str(e)}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/demo/dashboard')
def get_dashboard_data():
    """Get comprehensive dashboard data for frontend"""
    try:
        # Get recent comparison
        comparison = pywin_interface.compare_reputations('musk', 'trump', 7)
        
        # Get individual trends
        musk_trend = pywin_interface.analyze_reputation_trend('musk', 14)
        trump_trend = pywin_interface.analyze_reputation_trend('trump', 14)
        
        # Get AI insights
        insights = pywin_interface.get_ai_insights()
        
        # Get recent scores for both
        musk_scores = pywin_interface.get_reputation_scores('musk', limit=50)
        trump_scores = pywin_interface.get_reputation_scores('trump', limit=50)
        
        dashboard_data = {
            'comparison': comparison,
            'trends': {
                'musk': musk_trend,
                'trump': trump_trend
            },
            'insights': insights,
            'recent_scores': {
                'musk': musk_scores[:20],  # Last 20 scores
                'trump': trump_scores[:20]
            },
            'generated_at': datetime.utcnow().isoformat()
        }
        
        return jsonify(dashboard_data)
        
    except Exception as e:
        logger.error(f"Error in get_dashboard_data: {str(e)}")
        return jsonify({'error': str(e)}), 500


@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    return jsonify({'error': 'Endpoint not found'}), 404


@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors"""
    return jsonify({'error': 'Internal server error'}), 500


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'
    
    logger.info(f"Starting Musk vs Trump Reputation Tracker API on port {port}")
    logger.info(f"Debug mode: {debug}")
    
    app.run(host='0.0.0.0', port=port, debug=debug)