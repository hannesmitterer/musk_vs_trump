"""
Sentiment analyzer for musk_vs_trump project using TextBlob
"""

import random
import time
from textblob import TextBlob
from typing import Dict, List, Tuple


class SentimentAnalyzer:
    def __init__(self):
        # Sample text data for demo purposes
        # In a real implementation, this would fetch from Twitter/news APIs
        self.sample_texts = {
            "musk": [
                "Elon Musk announces breakthrough in sustainable energy technology",
                "Tesla's latest innovation is revolutionary and game-changing",
                "SpaceX successful mission brings us closer to Mars colonization",
                "Musk's vision for the future inspires millions worldwide",
                "Another amazing achievement from the Tesla team",
                "Critics question Musk's ambitious timeline for new projects",
                "Controversial statements from Musk spark heated debate",
                "Tesla faces challenges in meeting production targets"
            ],
            "trump": [
                "Trump's rally energizes supporters across the nation",
                "Strong economic policies lead to business growth",
                "Trump's leadership brings positive change to America",
                "Supporters praise Trump's commitment to national security",
                "Historic achievements in international diplomacy",
                "Trump's policies face criticism from opposition leaders",
                "Controversial decisions create political tensions",
                "Critics express concerns about recent policy changes"
            ]
        }
    
    def get_random_text_sample(self, person: str) -> str:
        """Get a random text sample for the specified person"""
        if person.lower() in self.sample_texts:
            return random.choice(self.sample_texts[person.lower()])
        return ""
    
    def analyze_sentiment(self, text: str) -> float:
        """
        Analyze sentiment of text using TextBlob
        Returns polarity score between -1 (negative) and 1 (positive)
        """
        if not text:
            return 0.0
        
        blob = TextBlob(text)
        return blob.sentiment.polarity
    
    def get_live_scores(self) -> Dict[str, float]:
        """
        Get current sentiment scores for both Musk and Trump
        In a real implementation, this would analyze recent social media posts/news
        """
        musk_text = self.get_random_text_sample("musk")
        trump_text = self.get_random_text_sample("trump")
        
        musk_sentiment = self.analyze_sentiment(musk_text)
        trump_sentiment = self.analyze_sentiment(trump_text)
        
        # Convert sentiment (-1 to 1) to race position scores (0 to 100)
        # Adding some randomness to make it more dynamic
        musk_score = max(0, min(100, (musk_sentiment + 1) * 50 + random.uniform(-10, 10)))
        trump_score = max(0, min(100, (trump_sentiment + 1) * 50 + random.uniform(-10, 10)))
        
        return {
            "musk": {
                "score": round(musk_score, 1),
                "sentiment": round(musk_sentiment, 3),
                "text_sample": musk_text
            },
            "trump": {
                "score": round(trump_score, 1),
                "sentiment": round(trump_sentiment, 3),
                "text_sample": trump_text
            },
            "timestamp": int(time.time())
        }


# Create a global instance for use in Flask app
sentiment_analyzer = SentimentAnalyzer()


if __name__ == "__main__":
    # Test the sentiment analyzer
    analyzer = SentimentAnalyzer()
    
    print("🧠 Testing Sentiment Analyzer...")
    
    # Test individual sentiment analysis
    test_texts = [
        "This is amazing and wonderful!",
        "This is terrible and awful.",
        "This is okay, nothing special."
    ]
    
    for text in test_texts:
        sentiment = analyzer.analyze_sentiment(text)
        print(f"Text: '{text}' -> Sentiment: {sentiment}")
    
    print("\n📊 Live Scores Demo:")
    for i in range(3):
        scores = analyzer.get_live_scores()
        print(f"\nRound {i+1}:")
        print(f"Musk: {scores['musk']['score']} (sentiment: {scores['musk']['sentiment']})")
        print(f"Trump: {scores['trump']['score']} (sentiment: {scores['trump']['sentiment']})")
        time.sleep(1)