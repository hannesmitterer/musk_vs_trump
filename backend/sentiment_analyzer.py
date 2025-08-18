"""
Sentiment Analysis System for Musk vs Trump
Uses TextBlob for sentiment analysis and converts to race scores
"""

import random
import logging
from textblob import TextBlob

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class SentimentAnalyzer:
    """Analyzes sentiment and generates race scores for Musk vs Trump"""
    
    def __init__(self):
        # Sample texts for demonstration (in real implementation, these would come from Twitter API/news)
        self.musk_texts = [
            "Elon Musk's innovative approach to space exploration continues to inspire millions",
            "Tesla's latest breakthrough in battery technology is revolutionary",
            "SpaceX successfully launches another mission, pushing boundaries of space travel",
            "Musk's commitment to sustainable energy solutions shows great leadership",
            "Twitter's transformation under Musk brings new features and capabilities"
        ]
        
        self.trump_texts = [
            "Trump's strong economic policies during his presidency boosted American jobs",
            "His decisive leadership style resonates with millions of supporters",
            "Trump's focus on America First policies strengthened national priorities",
            "His business acumen brought practical solutions to government",
            "Trump's rallies continue to draw massive enthusiastic crowds"
        ]
    
    def analyze_sentiment(self, text):
        """
        Analyze sentiment of given text using TextBlob
        Returns polarity score between -1 (negative) and 1 (positive)
        """
        try:
            blob = TextBlob(text)
            polarity = blob.sentiment.polarity
            logger.info(f"Analyzed text: '{text[:50]}...' -> Polarity: {polarity:.2f}")
            return polarity
        except Exception as e:
            logger.error(f"Error analyzing sentiment: {e}")
            return 0.0
    
    def get_race_scores(self):
        """
        Get current race scores for Musk vs Trump based on sentiment analysis
        Returns dict with scores out of 100
        """
        try:
            # Analyze random sample texts (in real implementation, this would be live data)
            musk_text = random.choice(self.musk_texts)
            trump_text = random.choice(self.trump_texts)
            
            musk_sentiment = self.analyze_sentiment(musk_text)
            trump_sentiment = self.analyze_sentiment(trump_text)
            
            # Convert sentiment (-1 to 1) to race score (0 to 100)
            # Add some randomization to simulate dynamic real-world data
            base_score = 50  # neutral starting point
            sentiment_multiplier = 30  # max swing from sentiment
            random_factor = 20  # add some variability
            
            musk_score = base_score + (musk_sentiment * sentiment_multiplier) + random.uniform(-random_factor, random_factor)
            trump_score = base_score + (trump_sentiment * sentiment_multiplier) + random.uniform(-random_factor, random_factor)
            
            # Ensure scores stay within 0-100 range
            musk_score = max(0, min(100, musk_score))
            trump_score = max(0, min(100, trump_score))
            
            scores = {
                'musk_score': round(musk_score, 1),
                'trump_score': round(trump_score, 1),
                'musk_sentiment': round(musk_sentiment, 3),
                'trump_sentiment': round(trump_sentiment, 3),
                'musk_text_sample': musk_text[:100] + "..." if len(musk_text) > 100 else musk_text,
                'trump_text_sample': trump_text[:100] + "..." if len(trump_text) > 100 else trump_text
            }
            
            logger.info(f"Generated scores - Musk: {scores['musk_score']}, Trump: {scores['trump_score']}")
            return scores
            
        except Exception as e:
            logger.error(f"Error generating race scores: {e}")
            # Return default scores on error
            return {
                'musk_score': 50.0,
                'trump_score': 50.0,
                'musk_sentiment': 0.0,
                'trump_sentiment': 0.0,
                'musk_text_sample': "Error analyzing sentiment",
                'trump_text_sample': "Error analyzing sentiment"
            }

# Global analyzer instance
analyzer = SentimentAnalyzer()

def get_current_leaderboard():
    """Convenience function to get current leaderboard data"""
    return analyzer.get_race_scores()

if __name__ == "__main__":
    # Test the sentiment analyzer
    print("Testing Sentiment Analyzer...")
    scores = get_current_leaderboard()
    print(f"Current Scores: Musk: {scores['musk_score']}, Trump: {scores['trump_score']}")
    print(f"Musk sample: {scores['musk_text_sample']}")
    print(f"Trump sample: {scores['trump_text_sample']}")