"""
Sentiment Analyzer Module
Advanced sentiment analysis using deep learning integration and AI algorithms
"""
import logging
from typing import Dict, List, Optional, Any, Tuple
from datetime import datetime
import numpy as np

from deep_learning_integration import DeepLearningDrizzleIntegration
from ai_algorithms_loader import AIAlgorithmsLoader

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class AdvancedSentimentAnalyzer:
    """
    Advanced sentiment analyzer combining multiple AI approaches
    Integrates deep learning models and AI algorithms for robust analysis
    """
    
    def __init__(self):
        self.dl_integration = DeepLearningDrizzleIntegration()
        self.ai_loader = AIAlgorithmsLoader()
        self.sentiment_algorithm = None
        self._initialize_components()
    
    def _initialize_components(self):
        """Initialize sentiment analysis components"""
        try:
            # Load sentiment analysis algorithm
            self.sentiment_algorithm = self.ai_loader.load_builtin_algorithm('sentiment_scorer')
            
            # Load deep learning sentiment model
            self.dl_model = self.dl_integration.load_sentiment_model('bert_sentiment')
            
            logger.info("Sentiment analyzer components initialized successfully")
            
        except Exception as e:
            logger.error(f"Error initializing sentiment analyzer: {str(e)}")
    
    def analyze_text(self, text: str) -> Dict[str, Any]:
        """
        Analyze sentiment of a single text using multiple approaches
        """
        if not text or not text.strip():
            return {
                'text': text,
                'error': 'Empty text provided',
                'timestamp': datetime.utcnow().isoformat()
            }
        
        try:
            results = {
                'text': text,
                'timestamp': datetime.utcnow().isoformat(),
                'analysis': {}
            }
            
            # Deep learning analysis
            if self.dl_model:
                dl_result = self.dl_integration.analyze_sentiment_single(text)
                results['analysis']['deep_learning'] = dl_result
            
            # AI algorithm analysis
            if self.sentiment_algorithm:
                ai_score = self.sentiment_algorithm.score([text])[0]
                results['analysis']['ai_algorithm'] = {
                    'sentiment_score': ai_score,
                    'label': self._score_to_label(ai_score)
                }
            
            # Combined analysis
            results['combined'] = self._combine_analyses(results['analysis'])
            
            return results
            
        except Exception as e:
            logger.error(f"Error analyzing text sentiment: {str(e)}")
            return {
                'text': text,
                'error': str(e),
                'timestamp': datetime.utcnow().isoformat()
            }
    
    def analyze_batch(self, texts: List[str]) -> List[Dict[str, Any]]:
        """
        Analyze sentiment of multiple texts efficiently
        """
        if not texts:
            return []
        
        try:
            results = []
            
            # Batch deep learning analysis
            dl_results = {}
            if self.dl_model:
                dl_batch_results = self.dl_integration.analyze_sentiment_batch(texts)
                dl_results = {result['text']: result for result in dl_batch_results}
            
            # Batch AI algorithm analysis
            ai_scores = {}
            if self.sentiment_algorithm:
                ai_batch_scores = self.sentiment_algorithm.score(texts)
                ai_scores = {text: score for text, score in zip(texts, ai_batch_scores)}
            
            # Combine results for each text
            for text in texts:
                analysis = {}
                
                if text in dl_results:
                    analysis['deep_learning'] = dl_results[text]
                
                if text in ai_scores:
                    analysis['ai_algorithm'] = {
                        'sentiment_score': ai_scores[text],
                        'label': self._score_to_label(ai_scores[text])
                    }
                
                result = {
                    'text': text,
                    'timestamp': datetime.utcnow().isoformat(),
                    'analysis': analysis,
                    'combined': self._combine_analyses(analysis)
                }
                
                results.append(result)
            
            return results
            
        except Exception as e:
            logger.error(f"Error in batch sentiment analysis: {str(e)}")
            return [{'text': text, 'error': str(e)} for text in texts]
    
    def _score_to_label(self, score: float) -> str:
        """Convert numerical sentiment score to label"""
        if score > 0.1:
            return 'positive'
        elif score < -0.1:
            return 'negative'
        else:
            return 'neutral'
    
    def _combine_analyses(self, analyses: Dict[str, Any]) -> Dict[str, Any]:
        """
        Combine multiple sentiment analyses into a unified result
        """
        if not analyses:
            return {'error': 'No analyses to combine'}
        
        scores = []
        confidences = []
        
        # Extract scores and confidences from different methods
        if 'deep_learning' in analyses:
            dl_analysis = analyses['deep_learning']
            if 'sentiment_score' in dl_analysis:
                scores.append(dl_analysis['sentiment_score'])
            if 'confidence' in dl_analysis:
                confidences.append(dl_analysis['confidence'])
        
        if 'ai_algorithm' in analyses:
            ai_analysis = analyses['ai_algorithm']
            if 'sentiment_score' in ai_analysis:
                scores.append(ai_analysis['sentiment_score'])
                confidences.append(0.75)  # Default confidence for AI algorithm
        
        if not scores:
            return {'error': 'No valid scores found'}
        
        # Calculate combined metrics
        combined_score = np.mean(scores)
        combined_confidence = np.mean(confidences) if confidences else 0.5
        score_variance = np.var(scores) if len(scores) > 1 else 0.0
        
        # Determine agreement level
        agreement = 'high' if score_variance < 0.1 else 'medium' if score_variance < 0.3 else 'low'
        
        return {
            'combined_score': combined_score,
            'combined_label': self._score_to_label(combined_score),
            'confidence': combined_confidence,
            'score_variance': score_variance,
            'agreement_level': agreement,
            'method_count': len(scores)
        }
    
    def get_reputation_impact(self, text: str, person: str) -> Dict[str, Any]:
        """
        Analyze how text content impacts a person's reputation
        """
        sentiment_result = self.analyze_text(text)
        
        if 'error' in sentiment_result:
            return sentiment_result
        
        try:
            # Calculate reputation impact based on sentiment and content
            combined = sentiment_result.get('combined', {})
            sentiment_score = combined.get('combined_score', 0.0)
            confidence = combined.get('confidence', 0.5)
            
            # Amplify impact based on content characteristics
            text_lower = text.lower()
            person_lower = person.lower()
            
            # Impact modifiers
            impact_multiplier = 1.0
            
            # Check if person is directly mentioned
            if person_lower in text_lower:
                impact_multiplier *= 1.5
            
            # Check for strong language
            strong_words = ['scandal', 'controversy', 'amazing', 'terrible', 'brilliant', 'disaster']
            strong_word_count = sum(word in text_lower for word in strong_words)
            impact_multiplier *= (1.0 + strong_word_count * 0.2)
            
            # Check for social media indicators
            if any(indicator in text for indicator in ['@', '#', 'RT', 'retweet']):
                impact_multiplier *= 1.3
            
            # Calculate final reputation impact
            reputation_impact = sentiment_score * impact_multiplier * confidence
            
            result = {
                'person': person,
                'text': text,
                'sentiment_analysis': sentiment_result,
                'reputation_impact': {
                    'impact_score': reputation_impact,
                    'impact_multiplier': impact_multiplier,
                    'base_sentiment': sentiment_score,
                    'confidence': confidence,
                    'impact_level': self._get_impact_level(abs(reputation_impact))
                },
                'analysis_timestamp': datetime.utcnow().isoformat()
            }
            
            return result
            
        except Exception as e:
            logger.error(f"Error calculating reputation impact: {str(e)}")
            return {'error': str(e)}
    
    def _get_impact_level(self, impact_score: float) -> str:
        """Determine impact level based on score magnitude"""
        if impact_score > 0.7:
            return 'high'
        elif impact_score > 0.3:
            return 'medium'
        elif impact_score > 0.1:
            return 'low'
        else:
            return 'minimal'
    
    def analyze_comparative_sentiment(self, musk_texts: List[str], trump_texts: List[str]) -> Dict[str, Any]:
        """
        Compare sentiment between Musk and Trump related texts
        """
        try:
            # Analyze both sets of texts
            musk_results = self.analyze_batch(musk_texts)
            trump_results = self.analyze_batch(trump_texts)
            
            # Extract combined scores
            musk_scores = [r.get('combined', {}).get('combined_score', 0.0) for r in musk_results]
            trump_scores = [r.get('combined', {}).get('combined_score', 0.0) for r in trump_results]
            
            # Calculate comparative metrics
            musk_avg = np.mean(musk_scores) if musk_scores else 0.0
            trump_avg = np.mean(trump_scores) if trump_scores else 0.0
            
            musk_std = np.std(musk_scores) if len(musk_scores) > 1 else 0.0
            trump_std = np.std(trump_scores) if len(trump_scores) > 1 else 0.0
            
            # Determine leader and margin
            if musk_avg > trump_avg:
                leader = 'musk'
                margin = musk_avg - trump_avg
            elif trump_avg > musk_avg:
                leader = 'trump'
                margin = trump_avg - musk_avg
            else:
                leader = 'tie'
                margin = 0.0
            
            comparison = {
                'analysis_timestamp': datetime.utcnow().isoformat(),
                'data_summary': {
                    'musk_texts': len(musk_texts),
                    'trump_texts': len(trump_texts),
                    'total_analyzed': len(musk_texts) + len(trump_texts)
                },
                'sentiment_scores': {
                    'musk': {
                        'average': musk_avg,
                        'std_dev': musk_std,
                        'scores': musk_scores
                    },
                    'trump': {
                        'average': trump_avg,
                        'std_dev': trump_std,
                        'scores': trump_scores
                    }
                },
                'comparison': {
                    'leader': leader,
                    'margin': margin,
                    'margin_percentage': (margin / max(abs(musk_avg), abs(trump_avg), 0.01)) * 100,
                    'confidence': min(0.9, (len(musk_texts) + len(trump_texts)) / 100)
                },
                'detailed_results': {
                    'musk_analysis': musk_results,
                    'trump_analysis': trump_results
                }
            }
            
            return comparison
            
        except Exception as e:
            logger.error(f"Error in comparative sentiment analysis: {str(e)}")
            return {'error': str(e)}
    
    def get_analyzer_status(self) -> Dict[str, Any]:
        """Get status of sentiment analyzer components"""
        return {
            'deep_learning_loaded': self.dl_model is not None,
            'ai_algorithm_loaded': self.sentiment_algorithm is not None,
            'available_models': self.dl_integration.get_available_models(),
            'loaded_algorithms': list(self.ai_loader.get_loaded_algorithms().keys()),
            'ready': self.dl_model is not None or self.sentiment_algorithm is not None
        }


# Utility functions for easy sentiment analysis
def quick_sentiment_analysis(text: str) -> Dict[str, Any]:
    """Quick sentiment analysis for single text"""
    analyzer = AdvancedSentimentAnalyzer()
    return analyzer.analyze_text(text)


def analyze_reputation_impact(text: str, person: str) -> Dict[str, Any]:
    """Quick reputation impact analysis"""
    analyzer = AdvancedSentimentAnalyzer()
    return analyzer.get_reputation_impact(text, person)


def compare_sentiment(musk_texts: List[str], trump_texts: List[str]) -> Dict[str, Any]:
    """Quick comparative sentiment analysis"""
    analyzer = AdvancedSentimentAnalyzer()
    return analyzer.analyze_comparative_sentiment(musk_texts, trump_texts)


# Example usage and testing
if __name__ == "__main__":
    analyzer = AdvancedSentimentAnalyzer()
    
    print("Sentiment Analyzer Status:")
    status = analyzer.get_analyzer_status()
    for key, value in status.items():
        print(f"  {key}: {value}")
    
    # Test single text analysis
    test_text = "Elon Musk's latest innovation with Tesla is absolutely groundbreaking and revolutionary!"
    result = analyzer.analyze_text(test_text)
    
    print(f"\\nSingle Text Analysis:")
    print(f"Text: {test_text}")
    if 'combined' in result:
        combined = result['combined']
        print(f"Sentiment: {combined.get('combined_label', 'unknown')}")
        print(f"Score: {combined.get('combined_score', 0.0):.3f}")
        print(f"Confidence: {combined.get('confidence', 0.0):.3f}")
    
    # Test reputation impact
    impact = analyzer.get_reputation_impact(test_text, "musk")
    if 'reputation_impact' in impact:
        rep_impact = impact['reputation_impact']
        print(f"\\nReputation Impact:")
        print(f"Impact Score: {rep_impact.get('impact_score', 0.0):.3f}")
        print(f"Impact Level: {rep_impact.get('impact_level', 'unknown')}")
    
    # Test batch analysis
    test_texts = [
        "Trump's policy decision was well-received by supporters",
        "Musk's SpaceX mission achieved another milestone", 
        "Both leaders face ongoing challenges"
    ]
    
    batch_results = analyzer.analyze_batch(test_texts)
    print(f"\\nBatch Analysis Results ({len(batch_results)} texts):")
    for i, result in enumerate(batch_results):
        if 'combined' in result:
            combined = result['combined']
            print(f"  Text {i+1}: {combined.get('combined_label', 'unknown')} ({combined.get('combined_score', 0.0):.2f})")