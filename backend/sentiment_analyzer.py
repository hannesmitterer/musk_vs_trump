import re
import logging
from typing import Dict, List

logger = logging.getLogger(__name__)

class SentimentAnalyzer:
    """Simple sentiment analyzer using keyword-based approach"""
    
    def __init__(self):
        # Simple keyword-based sentiment scoring
        self.positive_words = [
            'good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic',
            'positive', 'success', 'win', 'best', 'love', 'like', 'awesome'
        ]
        
        self.negative_words = [
            'bad', 'terrible', 'awful', 'horrible', 'worst', 'hate', 'dislike',
            'negative', 'fail', 'lose', 'poor', 'disappointing', 'sad'
        ]
    
    def analyze_sentiment(self, text: str) -> float:
        """
        Analyze sentiment of text and return score between -1 and 1
        -1 = very negative, 0 = neutral, 1 = very positive
        """
        if not text:
            return 0.0
        
        # Convert to lowercase and split into words
        words = re.findall(r'\b\w+\b', text.lower())
        
        positive_count = sum(1 for word in words if word in self.positive_words)
        negative_count = sum(1 for word in words if word in self.negative_words)
        
        total_sentiment_words = positive_count + negative_count
        
        if total_sentiment_words == 0:
            return 0.0
        
        # Calculate sentiment score
        sentiment_score = (positive_count - negative_count) / total_sentiment_words
        
        # Normalize to -1 to 1 range
        return max(-1.0, min(1.0, sentiment_score))
    
    def analyze_batch(self, texts: List[str]) -> List[float]:
        """Analyze sentiment for multiple texts"""
        return [self.analyze_sentiment(text) for text in texts]
    
    def get_sentiment_summary(self, texts: List[str]) -> Dict:
        """Get summary statistics for a batch of texts"""
        scores = self.analyze_batch(texts)
        
        if not scores:
            return {'avg_sentiment': 0.0, 'count': 0, 'positive': 0, 'negative': 0, 'neutral': 0}
        
        avg_sentiment = sum(scores) / len(scores)
        positive = sum(1 for score in scores if score > 0.1)
        negative = sum(1 for score in scores if score < -0.1)
        neutral = len(scores) - positive - negative
        
        return {
            'avg_sentiment': round(avg_sentiment, 3),
            'count': len(scores),
            'positive': positive,
            'negative': negative,
            'neutral': neutral
        }

if __name__ == "__main__":
    analyzer = SentimentAnalyzer()
    
    # Test the analyzer
    test_texts = [
        "Elon Musk is doing great work with Tesla and SpaceX!",
        "I really dislike Trump's policies and approach.",
        "The weather is nice today.",
        "This is absolutely terrible and awful."
    ]
    
    for text in test_texts:
        score = analyzer.analyze_sentiment(text)
        print(f"Text: {text}")
        print(f"Sentiment: {score}\n")