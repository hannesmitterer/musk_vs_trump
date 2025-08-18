"""
Sentiment analysis module using Transformers for social media and news data.
"""

import logging
from datetime import datetime
from typing import List, Dict, Optional, Tuple
import re

try:
    from transformers import pipeline, AutoTokenizer, AutoModelForSequenceClassification
    import torch
    TRANSFORMERS_AVAILABLE = True
except ImportError:
    TRANSFORMERS_AVAILABLE = False
    torch = None
import requests
from models import SentimentScore, SubjectType, DataSource

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class SentimentAnalyzer:
    """Sentiment analysis using pre-trained transformer models."""
    
    def __init__(self):
        """Initialize sentiment analysis pipeline."""
        if not TRANSFORMERS_AVAILABLE:
            logger.warning("Transformers not available, using mock sentiment analysis")
            self.sentiment_pipeline = None
            return
            
        self.device = 0 if torch and torch.cuda.is_available() else -1
        logger.info(f"Using device: {'GPU' if self.device == 0 else 'CPU'}")
        
        # Load sentiment analysis model
        model_name = "cardiffnlp/twitter-roberta-base-sentiment-latest"
        try:
            self.sentiment_pipeline = pipeline(
                "sentiment-analysis", 
                model=model_name,
                device=self.device,
                return_all_scores=True
            )
            logger.info(f"Loaded sentiment model: {model_name}")
        except Exception as e:
            logger.warning(f"Failed to load {model_name}, falling back to default model")
            try:
                self.sentiment_pipeline = pipeline(
                    "sentiment-analysis",
                    device=self.device,
                    return_all_scores=True
                )
            except Exception as e2:
                logger.warning(f"Failed to load any model, using mock analysis: {e2}")
                self.sentiment_pipeline = None
    
    def preprocess_text(self, text: str) -> str:
        """Clean and preprocess text for sentiment analysis."""
        # Remove URLs
        text = re.sub(r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+', '', text)
        
        # Remove mentions and hashtags (but keep the content)
        text = re.sub(r'[@#]\w+', '', text)
        
        # Remove extra whitespace
        text = ' '.join(text.split())
        
        return text.strip()
    
    def extract_subject(self, text: str) -> List[SubjectType]:
        """Identify which subjects (Musk/Trump) are mentioned in the text."""
        text_lower = text.lower()
        subjects = []
        
        # Musk keywords
        musk_keywords = ['musk', 'elon', 'tesla', 'spacex', 'twitter', 'x.com', 'neuralink']
        if any(keyword in text_lower for keyword in musk_keywords):
            subjects.append(SubjectType.MUSK)
        
        # Trump keywords  
        trump_keywords = ['trump', 'donald', 'potus', 'president trump', 'mar-a-lago']
        if any(keyword in text_lower for keyword in trump_keywords):
            subjects.append(SubjectType.TRUMP)
            
        return subjects
    
    def analyze_sentiment(self, text: str) -> Tuple[float, float]:
        """
        Analyze sentiment of text.
        
        Returns:
            Tuple of (sentiment_score, confidence)
            sentiment_score: -1.0 (negative) to 1.0 (positive)
            confidence: 0.0 to 1.0
        """
        if not text or len(text.strip()) == 0:
            return 0.0, 0.0
            
        processed_text = self.preprocess_text(text)
        if not processed_text:
            return 0.0, 0.0
        
        # Use mock sentiment analysis if transformers not available
        if not self.sentiment_pipeline:
            # Mock sentiment based on text content
            text_lower = processed_text.lower()
            positive_words = ['good', 'great', 'amazing', 'excellent', 'success', 'revolutionary']
            negative_words = ['bad', 'terrible', 'awful', 'fail', 'disappointing', 'controversial']
            
            pos_count = sum(1 for word in positive_words if word in text_lower)
            neg_count = sum(1 for word in negative_words if word in text_lower)
            
            if pos_count > neg_count:
                return 0.7, 0.8
            elif neg_count > pos_count:
                return -0.6, 0.8
            else:
                return 0.1, 0.5
            
        try:
            results = self.sentiment_pipeline(processed_text)
            
            # Convert results to sentiment score
            if isinstance(results[0], list):
                results = results[0]
                
            sentiment_score = 0.0
            confidence = 0.0
            
            for result in results:
                label = result['label'].upper()
                score = result['score']
                
                if 'POSITIVE' in label:
                    sentiment_score += score
                    confidence = max(confidence, score)
                elif 'NEGATIVE' in label:
                    sentiment_score -= score  
                    confidence = max(confidence, score)
                # NEUTRAL contributes 0 to sentiment_score
                    
            # Normalize sentiment score to [-1, 1]
            sentiment_score = max(-1.0, min(1.0, sentiment_score))
            
            return sentiment_score, confidence
            
        except Exception as e:
            logger.error(f"Error analyzing sentiment: {e}")
            return 0.0, 0.0
    
    def analyze_social_media_data(self, posts: List[Dict]) -> List[SentimentScore]:
        """Analyze sentiment for social media posts."""
        sentiment_scores = []
        
        for post in posts:
            text = post.get('text', '') or post.get('content', '')
            timestamp = post.get('timestamp', datetime.now())
            
            if isinstance(timestamp, str):
                try:
                    timestamp = datetime.fromisoformat(timestamp.replace('Z', '+00:00'))
                except:
                    timestamp = datetime.now()
            
            subjects = self.extract_subject(text)
            sentiment, confidence = self.analyze_sentiment(text)
            
            for subject in subjects:
                score = SentimentScore(
                    timestamp=timestamp,
                    subject=subject,
                    sentiment=sentiment,
                    confidence=confidence,
                    source_text=text[:200] + "..." if len(text) > 200 else text,
                    source_type="social_media"
                )
                sentiment_scores.append(score)
                
        return sentiment_scores
    
    def analyze_news_data(self, articles: List[Dict]) -> List[SentimentScore]:
        """Analyze sentiment for news articles."""
        sentiment_scores = []
        
        for article in articles:
            # Use title + summary/description for sentiment analysis
            title = article.get('title', '')
            description = article.get('description', '') or article.get('summary', '')
            text = f"{title}. {description}".strip()
            
            timestamp = article.get('published_at', datetime.now())
            if isinstance(timestamp, str):
                try:
                    timestamp = datetime.fromisoformat(timestamp.replace('Z', '+00:00'))
                except:
                    timestamp = datetime.now()
            
            subjects = self.extract_subject(text)
            sentiment, confidence = self.analyze_sentiment(text)
            
            for subject in subjects:
                score = SentimentScore(
                    timestamp=timestamp,
                    subject=subject,
                    sentiment=sentiment,
                    confidence=confidence,
                    source_text=text[:200] + "..." if len(text) > 200 else text,
                    source_type="news"
                )
                sentiment_scores.append(score)
                
        return sentiment_scores
    
    def get_aggregated_sentiment(self, scores: List[SentimentScore], 
                               subject: SubjectType, 
                               hours: int = 24) -> Tuple[float, float, int]:
        """
        Get aggregated sentiment for a subject over the last N hours.
        
        Returns:
            Tuple of (avg_sentiment, avg_confidence, count)
        """
        now = datetime.now()
        cutoff_time = now.replace(hour=now.hour - hours) if hours < 24 else now.replace(day=now.day - 1)
        
        relevant_scores = [
            score for score in scores 
            if score.subject == subject and score.timestamp >= cutoff_time
        ]
        
        if not relevant_scores:
            return 0.0, 0.0, 0
            
        # Weight by confidence
        weighted_sentiment = sum(score.sentiment * score.confidence for score in relevant_scores)
        total_confidence = sum(score.confidence for score in relevant_scores)
        
        avg_sentiment = weighted_sentiment / total_confidence if total_confidence > 0 else 0.0
        avg_confidence = total_confidence / len(relevant_scores)
        
        return avg_sentiment, avg_confidence, len(relevant_scores)


# Mock data functions for testing
def get_mock_social_media_data() -> List[Dict]:
    """Generate mock social media data for testing."""
    return [
        {
            'text': 'Elon Musk is revolutionizing the space industry with SpaceX! Amazing achievements.',
            'timestamp': datetime.now().isoformat(),
            'platform': 'twitter'
        },
        {
            'text': 'Trump continues to be a polarizing figure in American politics.',
            'timestamp': datetime.now().isoformat(),
            'platform': 'facebook'
        },
        {
            'text': 'Tesla stock is performing really well under Musk leadership',
            'timestamp': datetime.now().isoformat(),
            'platform': 'reddit'
        }
    ]


def get_mock_news_data() -> List[Dict]:
    """Generate mock news data for testing."""
    return [
        {
            'title': 'SpaceX Successfully Launches Another Mission',
            'description': 'Elon Musk company achieves another milestone in space exploration',
            'published_at': datetime.now().isoformat(),
            'source': 'TechNews'
        },
        {
            'title': 'Political Rally Draws Large Crowd',
            'description': 'Former President Trump addresses supporters at latest campaign event',
            'published_at': datetime.now().isoformat(),
            'source': 'NewsChannel'
        }
    ]


if __name__ == "__main__":
    # Test the sentiment analyzer
    analyzer = SentimentAnalyzer()
    
    # Test with mock data
    social_data = get_mock_social_media_data()
    news_data = get_mock_news_data()
    
    social_scores = analyzer.analyze_social_media_data(social_data)
    news_scores = analyzer.analyze_news_data(news_data)
    
    print(f"Analyzed {len(social_scores)} social media sentiments")
    print(f"Analyzed {len(news_scores)} news sentiments")
    
    for score in social_scores + news_scores:
        print(f"{score.subject.value}: {score.sentiment:.3f} (confidence: {score.confidence:.3f})")