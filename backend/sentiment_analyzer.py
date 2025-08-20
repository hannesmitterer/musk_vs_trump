"""
AI-powered sentiment analyzer for musk_vs_trump project
Analyzes social media sentiment for public figures using various techniques
"""

import re
import json
from typing import Dict, List, Tuple, Optional
from datetime import datetime

class SentimentAnalyzer:
    """
    Sentiment analyzer that processes social media mentions and calculates reputation scores
    """
    
    def __init__(self):
        # Simple keyword-based sentiment scoring (in real implementation would use ML models)
        self.positive_keywords = [
            'good', 'great', 'excellent', 'amazing', 'awesome', 'brilliant', 'fantastic',
            'love', 'like', 'admire', 'respect', 'support', 'genius', 'leader',
            'innovative', 'visionary', 'inspiring', 'successful', 'impressive'
        ]
        
        self.negative_keywords = [
            'bad', 'terrible', 'awful', 'horrible', 'hate', 'dislike', 'worst',
            'failure', 'disaster', 'corrupt', 'liar', 'fraud', 'scam', 'dangerous',
            'irresponsible', 'incompetent', 'disappointing', 'wrong', 'stupid'
        ]
        
        self.neutral_keywords = [
            'said', 'mentioned', 'announced', 'stated', 'reported', 'according',
            'news', 'today', 'yesterday', 'will', 'should', 'could', 'might'
        ]

    def analyze_text(self, text: str) -> Dict[str, float]:
        """
        Analyze sentiment of a given text
        
        Args:
            text (str): Text to analyze
            
        Returns:
            Dict containing sentiment scores and classification
        """
        if not text or not isinstance(text, str):
            return self._get_neutral_result()
            
        text_lower = text.lower()
        words = re.findall(r'\b\w+\b', text_lower)
        
        positive_score = 0
        negative_score = 0
        neutral_score = 0
        
        for word in words:
            if word in self.positive_keywords:
                positive_score += 1
            elif word in self.negative_keywords:
                negative_score += 1
            elif word in self.neutral_keywords:
                neutral_score += 1
        
        total_sentiment_words = positive_score + negative_score + neutral_score
        
        if total_sentiment_words == 0:
            return self._get_neutral_result()
        
        # Normalize scores
        positive_ratio = positive_score / total_sentiment_words
        negative_ratio = negative_score / total_sentiment_words
        neutral_ratio = neutral_score / total_sentiment_words
        
        # Calculate overall sentiment
        sentiment_score = (positive_score - negative_score) / max(len(words), 1)
        
        # Classify sentiment
        if sentiment_score > 0.1:
            classification = "positive"
        elif sentiment_score < -0.1:
            classification = "negative"
        else:
            classification = "neutral"
            
        return {
            "sentiment_score": round(sentiment_score, 3),
            "classification": classification,
            "positive_ratio": round(positive_ratio, 3),
            "negative_ratio": round(negative_ratio, 3),
            "neutral_ratio": round(neutral_ratio, 3),
            "confidence": min(round(total_sentiment_words / len(words), 3), 1.0)
        }

    def analyze_mentions(self, mentions: List[Dict]) -> Dict[str, any]:
        """
        Analyze sentiment of multiple social media mentions
        
        Args:
            mentions: List of mention objects with 'text' field
            
        Returns:
            Dict containing aggregated sentiment analysis
        """
        if not mentions:
            return self._get_empty_analysis_result()
            
        individual_analyses = []
        total_positive = 0
        total_negative = 0
        total_neutral = 0
        
        for mention in mentions:
            text = mention.get('text', '')
            analysis = self.analyze_text(text)
            individual_analyses.append({
                **mention,
                'sentiment_analysis': analysis
            })
            
            if analysis['classification'] == 'positive':
                total_positive += 1
            elif analysis['classification'] == 'negative':
                total_negative += 1
            else:
                total_neutral += 1
        
        total_mentions = len(mentions)
        
        # Calculate overall reputation score (0-100 scale)
        reputation_score = max(0, min(100, 
            50 + ((total_positive - total_negative) / total_mentions) * 50
        ))
        
        return {
            "total_mentions": total_mentions,
            "positive_mentions": total_positive,
            "negative_mentions": total_negative,
            "neutral_mentions": total_neutral,
            "reputation_score": round(reputation_score, 1),
            "sentiment_distribution": {
                "positive": round(total_positive / total_mentions * 100, 1),
                "negative": round(total_negative / total_mentions * 100, 1),
                "neutral": round(total_neutral / total_mentions * 100, 1)
            },
            "analyzed_mentions": individual_analyses,
            "analysis_timestamp": datetime.utcnow().isoformat()
        }
    
    def compare_reputations(self, person1_data: Dict, person2_data: Dict, 
                          person1_name: str = "Person 1", person2_name: str = "Person 2") -> Dict:
        """
        Compare reputation scores between two people
        
        Args:
            person1_data: Sentiment analysis data for person 1
            person2_data: Sentiment analysis data for person 2  
            person1_name: Name of person 1
            person2_name: Name of person 2
            
        Returns:
            Dict containing comparison results
        """
        return {
            "comparison": {
                person1_name: {
                    "reputation_score": person1_data.get("reputation_score", 0),
                    "total_mentions": person1_data.get("total_mentions", 0),
                    "sentiment_distribution": person1_data.get("sentiment_distribution", {})
                },
                person2_name: {
                    "reputation_score": person2_data.get("reputation_score", 0),
                    "total_mentions": person2_data.get("total_mentions", 0),
                    "sentiment_distribution": person2_data.get("sentiment_distribution", {})
                }
            },
            "winner": person1_name if person1_data.get("reputation_score", 0) > person2_data.get("reputation_score", 0) else person2_name,
            "score_difference": abs(person1_data.get("reputation_score", 0) - person2_data.get("reputation_score", 0)),
            "analysis_timestamp": datetime.utcnow().isoformat()
        }
    
    def _get_neutral_result(self) -> Dict[str, float]:
        """Return neutral sentiment result"""
        return {
            "sentiment_score": 0.0,
            "classification": "neutral",
            "positive_ratio": 0.0,
            "negative_ratio": 0.0,
            "neutral_ratio": 1.0,
            "confidence": 0.0
        }
    
    def _get_empty_analysis_result(self) -> Dict[str, any]:
        """Return empty analysis result"""
        return {
            "total_mentions": 0,
            "positive_mentions": 0,
            "negative_mentions": 0,
            "neutral_mentions": 0,
            "reputation_score": 50.0,
            "sentiment_distribution": {
                "positive": 0.0,
                "negative": 0.0,
                "neutral": 0.0
            },
            "analyzed_mentions": [],
            "analysis_timestamp": datetime.utcnow().isoformat()
        }


# Global analyzer instance
sentiment_analyzer = SentimentAnalyzer()