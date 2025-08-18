"""
PyWinAssistant Interface Module
Creates interface modules for loading reputation scores and processing 
with deep learning/AI algorithms, suitable for integration in @a-real-ai/pywinassistant
"""
import json
import logging
from typing import Dict, List, Optional, Any, Tuple, Callable
from datetime import datetime, timedelta
import numpy as np

from models import ReputationScore, db_manager
from deep_learning_integration import DeepLearningDrizzleIntegration
from ai_algorithms_loader import AIAlgorithmsLoader

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class PyWinAssistantInterface:
    """
    Main interface class for pywinassistant integration
    Provides standardized methods for reputation processing and AI analysis
    """
    
    def __init__(self):
        self.dl_integration = DeepLearningDrizzleIntegration()
        self.ai_loader = AIAlgorithmsLoader()
        self.db_session = db_manager.get_session()
        
        # Load default algorithms
        self._setup_default_algorithms()
    
    def _setup_default_algorithms(self):
        """Setup default AI algorithms for immediate use"""
        try:
            self.sentiment_algo = self.ai_loader.load_builtin_algorithm('sentiment_scorer')
            self.trend_algo = self.ai_loader.load_builtin_algorithm('reputation_analyzer')
            self.comparison_algo = self.ai_loader.load_builtin_algorithm('comparative_analyzer')
            logger.info("Default algorithms loaded successfully")
        except Exception as e:
            logger.error(f"Error loading default algorithms: {str(e)}")
    
    def get_reputation_scores(self, person: str = None, 
                            start_date: datetime = None, 
                            end_date: datetime = None,
                            limit: int = 100) -> List[Dict[str, Any]]:
        """
        Get reputation scores from database
        Compatible with pywinassistant data loading patterns
        """
        try:
            query = self.db_session.query(ReputationScore)
            
            if person:
                query = query.filter(ReputationScore.person == person.lower())
            
            if start_date:
                query = query.filter(ReputationScore.timestamp >= start_date)
            
            if end_date:
                query = query.filter(ReputationScore.timestamp <= end_date)
            
            query = query.order_by(ReputationScore.timestamp.desc()).limit(limit)
            
            results = query.all()
            return [result.to_dict() for result in results]
            
        except Exception as e:
            logger.error(f"Error retrieving reputation scores: {str(e)}")
            return []
    
    def process_text_data(self, texts: List[str], person: str = None) -> Dict[str, Any]:
        """
        Process text data through AI algorithms
        Returns comprehensive analysis suitable for pywinassistant consumption
        """
        if not texts:
            return {'error': 'No text data provided'}
        
        try:
            # Deep learning sentiment analysis
            dl_results = self.dl_integration.analyze_sentiment_batch(texts)
            
            # AI algorithm scoring
            sentiment_scores = []
            if self.sentiment_algo:
                sentiment_scores = self.sentiment_algo.score(texts)
            
            # Feature extraction
            features = self.dl_integration.get_feature_extraction(texts)
            
            # Compile results
            processed_data = {
                'metadata': {
                    'person': person,
                    'processed_at': datetime.utcnow().isoformat(),
                    'text_count': len(texts),
                    'processing_methods': ['deep_learning', 'ai_algorithms', 'feature_extraction']
                },
                'deep_learning_results': dl_results,
                'ai_algorithm_scores': sentiment_scores,
                'feature_matrix': features.tolist(),
                'summary': {
                    'avg_sentiment_dl': np.mean([r['sentiment_score'] for r in dl_results]),
                    'avg_sentiment_ai': np.mean(sentiment_scores) if sentiment_scores else 0.0,
                    'text_features_dim': features.shape[1] if features.size > 0 else 0
                }
            }
            
            return processed_data
            
        except Exception as e:
            logger.error(f"Error processing text data: {str(e)}")
            return {'error': str(e)}
    
    def analyze_reputation_trend(self, person: str, days: int = 30) -> Dict[str, Any]:
        """
        Analyze reputation trend for a person over specified days
        Provides trend analysis compatible with pywinassistant reporting
        """
        try:
            # Get recent scores
            end_date = datetime.utcnow()
            start_date = end_date - timedelta(days=days)
            
            scores_data = self.get_reputation_scores(
                person=person,
                start_date=start_date,
                end_date=end_date,
                limit=1000
            )
            
            if not scores_data:
                return {'error': f'No data found for {person} in the last {days} days'}
            
            # Extract score values and timestamps
            scores = [item['score'] for item in scores_data]
            sentiment_scores = [item['sentiment_score'] for item in scores_data if item['sentiment_score']]
            timestamps = [item['timestamp'] for item in scores_data]
            
            # Run trend analysis
            trend_analysis = {}
            if self.trend_algo and scores:
                trend_analysis = self.trend_algo.analyze_trend(scores)
                
                # Add predictions
                predictions = self.trend_algo.predict_future(scores, periods=7)
                trend_analysis['predictions'] = predictions
            
            # Compile comprehensive analysis
            analysis = {
                'person': person,
                'period': f"{days} days",
                'data_points': len(scores_data),
                'score_range': {
                    'min': min(scores) if scores else 0,
                    'max': max(scores) if scores else 0,
                    'avg': np.mean(scores) if scores else 0
                },
                'sentiment_range': {
                    'min': min(sentiment_scores) if sentiment_scores else 0,
                    'max': max(sentiment_scores) if sentiment_scores else 0,
                    'avg': np.mean(sentiment_scores) if sentiment_scores else 0
                },
                'trend_analysis': trend_analysis,
                'timestamps': {
                    'first': timestamps[-1] if timestamps else None,  # Oldest (query is desc)
                    'last': timestamps[0] if timestamps else None     # Newest
                },
                'analyzed_at': datetime.utcnow().isoformat()
            }
            
            return analysis
            
        except Exception as e:
            logger.error(f"Error analyzing reputation trend: {str(e)}")
            return {'error': str(e)}
    
    def compare_reputations(self, person1: str, person2: str, days: int = 30) -> Dict[str, Any]:
        """
        Compare reputations between two people
        Provides comparison analysis for pywinassistant decision making
        """
        try:
            # Get data for both people
            end_date = datetime.utcnow()
            start_date = end_date - timedelta(days=days)
            
            person1_data = self.get_reputation_scores(person1, start_date, end_date, 1000)
            person2_data = self.get_reputation_scores(person2, start_date, end_date, 1000)
            
            if not person1_data or not person2_data:
                return {'error': 'Insufficient data for comparison'}
            
            # Extract scores
            person1_scores = [item['score'] for item in person1_data]
            person2_scores = [item['score'] for item in person2_data]
            
            # Run comparison algorithm
            comparison = {}
            if self.comparison_algo:
                comparison = self.comparison_algo.compare_entities(
                    person1_scores, person2_scores, person1, person2
                )
            
            # Add additional analysis
            comparison['analysis_period'] = f"{days} days"
            comparison['data_freshness'] = {
                person1: person1_data[0]['timestamp'] if person1_data else None,
                person2: person2_data[0]['timestamp'] if person2_data else None
            }
            comparison['analyzed_at'] = datetime.utcnow().isoformat()
            
            return comparison
            
        except Exception as e:
            logger.error(f"Error comparing reputations: {str(e)}")
            return {'error': str(e)}
    
    def get_ai_insights(self, person: str = None, analysis_type: str = 'comprehensive') -> Dict[str, Any]:
        """
        Get AI-powered insights for pywinassistant consumption
        Provides actionable intelligence and recommendations
        """
        try:
            insights = {
                'analysis_type': analysis_type,
                'person': person,
                'generated_at': datetime.utcnow().isoformat(),
                'insights': [],
                'recommendations': [],
                'confidence_scores': {}
            }
            
            if analysis_type == 'comprehensive':
                # Get recent trend analysis
                if person:
                    trend_data = self.analyze_reputation_trend(person, days=14)
                    if 'trend_analysis' in trend_data:
                        trend = trend_data['trend_analysis']
                        
                        insights['insights'].append({
                            'type': 'trend',
                            'message': f"{person}'s reputation is {trend.get('trend', 'unknown')}",
                            'confidence': trend.get('confidence', 0.5),
                            'data': trend
                        })
                        
                        # Generate recommendations based on trend
                        if trend.get('trend') == 'declining':
                            insights['recommendations'].append({
                                'priority': 'high',
                                'action': 'monitor_negative_sentiment',
                                'description': f"Monitor negative sentiment sources for {person}"
                            })
                        elif trend.get('trend') == 'improving':
                            insights['recommendations'].append({
                                'priority': 'medium',
                                'action': 'capitalize_positive_momentum',
                                'description': f"Capitalize on positive momentum for {person}"
                            })
                
                # Get comparison insights for both major figures
                if not person:
                    comparison = self.compare_reputations('musk', 'trump', days=7)
                    if 'winner' in comparison:
                        insights['insights'].append({
                            'type': 'comparison',
                            'message': f"Current leader: {comparison['winner']} with margin {comparison.get('margin', 0):.3f}",
                            'confidence': comparison.get('confidence', 0.5),
                            'data': comparison
                        })
            
            # Add algorithm status insights
            loaded_algos = self.ai_loader.get_loaded_algorithms()
            insights['ai_capabilities'] = {
                'loaded_algorithms': list(loaded_algos.keys()),
                'deep_learning_models': self.dl_integration.get_available_models(),
                'processing_ready': len(loaded_algos) > 0
            }
            
            return insights
            
        except Exception as e:
            logger.error(f"Error generating AI insights: {str(e)}")
            return {'error': str(e)}
    
    def export_for_pywinassistant(self, format_type: str = 'json') -> str:
        """
        Export data and analysis in format suitable for pywinassistant integration
        """
        try:
            export_data = {
                'export_info': {
                    'format': format_type,
                    'exported_at': datetime.utcnow().isoformat(),
                    'source': 'musk_vs_trump_reputation_tracker'
                },
                'capabilities': {
                    'sentiment_analysis': True,
                    'trend_analysis': True,
                    'comparative_analysis': True,
                    'deep_learning_integration': True,
                    'ai_algorithms': True
                },
                'available_methods': [
                    'get_reputation_scores',
                    'process_text_data', 
                    'analyze_reputation_trend',
                    'compare_reputations',
                    'get_ai_insights'
                ],
                'recent_insights': self.get_ai_insights(),
                'sample_data': {
                    'musk_recent': self.get_reputation_scores('musk', limit=5),
                    'trump_recent': self.get_reputation_scores('trump', limit=5)
                }
            }
            
            if format_type == 'json':
                return json.dumps(export_data, indent=2, default=str)
            else:
                return str(export_data)
                
        except Exception as e:
            logger.error(f"Error exporting data: {str(e)}")
            return json.dumps({'error': str(e)})


class PyWinAssistantPlugin:
    """
    Plugin class specifically designed for pywinassistant integration
    Follows pywinassistant plugin patterns and conventions
    """
    
    def __init__(self):
        self.name = "Musk vs Trump Reputation Tracker"
        self.version = "1.0.0"
        self.description = "AI-powered reputation tracking and analysis for Elon Musk vs Donald Trump"
        self.interface = PyWinAssistantInterface()
    
    def get_plugin_info(self) -> Dict[str, Any]:
        """Get plugin information for pywinassistant registration"""
        return {
            'name': self.name,
            'version': self.version,
            'description': self.description,
            'author': 'AI Reputation Tracker',
            'capabilities': [
                'reputation_scoring',
                'sentiment_analysis',
                'trend_prediction',
                'comparative_analysis',
                'ai_insights'
            ],
            'api_methods': [
                'get_current_leader',
                'get_reputation_summary',
                'predict_trends',
                'analyze_sentiment',
                'get_insights'
            ]
        }
    
    def get_current_leader(self) -> Dict[str, Any]:
        """Get current reputation leader - main pywinassistant query method"""
        comparison = self.interface.compare_reputations('musk', 'trump', days=7)
        
        if 'winner' in comparison:
            return {
                'leader': comparison['winner'],
                'margin': comparison.get('margin', 0),
                'confidence': comparison.get('confidence', 0.5),
                'last_updated': datetime.utcnow().isoformat()
            }
        else:
            return {'leader': 'unknown', 'error': 'Insufficient data'}
    
    def get_reputation_summary(self, person: str) -> Dict[str, Any]:
        """Get reputation summary for a specific person"""
        return self.interface.analyze_reputation_trend(person, days=14)
    
    def predict_trends(self, person: str, days: int = 7) -> Dict[str, Any]:
        """Predict reputation trends"""
        analysis = self.interface.analyze_reputation_trend(person, days=30)
        if 'trend_analysis' in analysis and 'predictions' in analysis['trend_analysis']:
            return {
                'person': person,
                'predictions': analysis['trend_analysis']['predictions'],
                'prediction_days': days,
                'confidence': analysis['trend_analysis'].get('confidence', 0.5)
            }
        return {'error': 'Unable to generate predictions'}
    
    def analyze_sentiment(self, texts: List[str]) -> Dict[str, Any]:
        """Analyze sentiment of provided texts"""
        return self.interface.process_text_data(texts)
    
    def get_insights(self) -> Dict[str, Any]:
        """Get comprehensive AI insights"""
        return self.interface.get_ai_insights()


# Utility functions for direct pywinassistant integration
def create_pywinassistant_interface() -> PyWinAssistantInterface:
    """Create interface instance for pywinassistant"""
    return PyWinAssistantInterface()


def create_pywinassistant_plugin() -> PyWinAssistantPlugin:
    """Create plugin instance for pywinassistant"""
    return PyWinAssistantPlugin()


# Example usage and testing
if __name__ == "__main__":
    # Test the interface
    interface = PyWinAssistantInterface()
    
    print("Testing PyWinAssistant Interface...")
    
    # Test text processing
    sample_texts = [
        "Elon Musk's latest Tesla announcement is groundbreaking!",
        "Trump's policy decision received mixed reactions.",
        "Both leaders continue to influence public opinion."
    ]
    
    processed = interface.process_text_data(sample_texts, person="test")
    print(f"Processed {len(sample_texts)} texts")
    print(f"Average DL sentiment: {processed['summary']['avg_sentiment_dl']:.3f}")
    
    # Test plugin
    plugin = PyWinAssistantPlugin()
    print(f"\\nPlugin: {plugin.name} v{plugin.version}")
    
    insights = plugin.get_insights()
    print(f"Generated {len(insights.get('insights', []))} insights")
    print(f"AI capabilities: {insights['ai_capabilities']['processing_ready']}")