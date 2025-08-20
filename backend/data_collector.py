"""
Data collector for musk_vs_trump project
Simulates Social Searcher API integration for fetching social media mentions
"""

import requests
import json
import random
from typing import Dict, List, Optional
from datetime import datetime, timedelta
import time

class SocialMediaDataCollector:
    """
    Collects social media data from various sources
    In production, this would integrate with Social Searcher API
    For demo purposes, includes realistic mock data
    """
    
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or "demo_api_key"
        self.base_url = "https://api.social-searcher.com"
        
        # Mock data for demonstration
        self.mock_musk_mentions = [
            {
                "id": "tweet_1",
                "text": "Elon Musk is a visionary leader driving innovation in space and electric vehicles. Truly inspiring work at Tesla and SpaceX!",
                "platform": "twitter",
                "author": "tech_enthusiast_2024",
                "timestamp": (datetime.utcnow() - timedelta(hours=2)).isoformat(),
                "engagement": {"likes": 245, "retweets": 89, "replies": 34}
            },
            {
                "id": "post_2", 
                "text": "Not a fan of Musk's latest decisions. His management style seems erratic and unprofessional lately.",
                "platform": "facebook",
                "author": "business_critic",
                "timestamp": (datetime.utcnow() - timedelta(hours=5)).isoformat(),
                "engagement": {"likes": 78, "shares": 12, "comments": 67}
            },
            {
                "id": "reddit_3",
                "text": "Tesla's new model is amazing! Musk really knows how to innovate. The future is electric!",
                "platform": "reddit",
                "author": "electric_future",
                "timestamp": (datetime.utcnow() - timedelta(hours=8)).isoformat(),
                "engagement": {"upvotes": 456, "downvotes": 23, "comments": 89}
            },
            {
                "id": "tweet_4",
                "text": "Musk mentioned plans for Mars colonization in today's interview. Brilliant scientist and entrepreneur.",
                "platform": "twitter", 
                "author": "space_news_daily",
                "timestamp": (datetime.utcnow() - timedelta(hours=12)).isoformat(),
                "engagement": {"likes": 1234, "retweets": 567, "replies": 234}
            },
            {
                "id": "insta_5",
                "text": "Disappointing to see Musk's recent controversial statements. Expected better leadership from someone so influential.",
                "platform": "instagram",
                "author": "social_observer",
                "timestamp": (datetime.utcnow() - timedelta(hours=18)).isoformat(),
                "engagement": {"likes": 156, "comments": 45}
            }
        ]
        
        self.mock_trump_mentions = [
            {
                "id": "tweet_10",
                "text": "Trump's policies on economy were actually quite effective. Strong leadership during challenging times.",
                "platform": "twitter",
                "author": "economic_analyst",
                "timestamp": (datetime.utcnow() - timedelta(hours=1)).isoformat(),
                "engagement": {"likes": 567, "retweets": 234, "replies": 123}
            },
            {
                "id": "facebook_11",
                "text": "Can't believe Trump is running again. His presidency was a complete disaster for democracy and institutions.",
                "platform": "facebook",
                "author": "democracy_watchdog",
                "timestamp": (datetime.utcnow() - timedelta(hours=4)).isoformat(),
                "engagement": {"likes": 890, "shares": 456, "comments": 234}
            },
            {
                "id": "reddit_12",
                "text": "Trump announced his latest campaign rally. Whatever your politics, he knows how to draw a crowd.",
                "platform": "reddit",
                "author": "political_observer", 
                "timestamp": (datetime.utcnow() - timedelta(hours=7)).isoformat(),
                "engagement": {"upvotes": 234, "downvotes": 156, "comments": 78}
            },
            {
                "id": "tweet_13",
                "text": "Love him or hate him, Trump changed American politics forever. His influence is undeniable.",
                "platform": "twitter",
                "author": "politics_student",
                "timestamp": (datetime.utcnow() - timedelta(hours=10)).isoformat(),
                "engagement": {"likes": 345, "retweets": 123, "replies": 89}
            },
            {
                "id": "youtube_14",
                "text": "Trump's latest interview was terrible. Completely avoided answering important questions about policy.",
                "platform": "youtube",
                "author": "news_commentator",
                "timestamp": (datetime.utcnow() - timedelta(hours=15)).isoformat(),
                "engagement": {"likes": 445, "dislikes": 234, "comments": 567}
            }
        ]

    def fetch_mentions(self, person_name: str, limit: int = 20, time_range: str = "24h") -> Dict[str, any]:
        """
        Fetch social media mentions for a specific person
        
        Args:
            person_name: Name of the person to search for
            limit: Maximum number of mentions to fetch
            time_range: Time range for search (24h, 7d, 30d)
            
        Returns:
            Dict containing mentions and metadata
        """
        try:
            # In production, this would make actual API calls
            # return self._fetch_from_social_searcher_api(person_name, limit, time_range)
            
            # For demo, return mock data
            return self._get_mock_mentions(person_name, limit)
            
        except Exception as e:
            print(f"Error fetching mentions for {person_name}: {str(e)}")
            return self._get_empty_result(person_name)

    def _fetch_from_social_searcher_api(self, person_name: str, limit: int, time_range: str) -> Dict[str, any]:
        """
        Fetch data from actual Social Searcher API (production implementation)
        This method shows how the real API integration would work
        """
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        params = {
            "q": person_name,
            "type": "social",
            "limit": limit,
            "time_range": time_range,
            "include_sentiment": True,
            "platforms": ["twitter", "facebook", "instagram", "youtube", "reddit"]
        }
        
        response = requests.get(
            f"{self.base_url}/v2/search",
            headers=headers,
            params=params,
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            return {
                "person": person_name,
                "mentions": data.get("posts", []),
                "total_found": data.get("total", 0),
                "api_credits_used": data.get("credits_used", 1),
                "search_timestamp": datetime.utcnow().isoformat(),
                "source": "social_searcher_api"
            }
        else:
            raise Exception(f"API request failed with status {response.status_code}: {response.text}")

    def _get_mock_mentions(self, person_name: str, limit: int) -> Dict[str, any]:
        """
        Get mock mentions for demonstration purposes
        """
        person_lower = person_name.lower()
        
        if "musk" in person_lower or "elon" in person_lower:
            mentions = self.mock_musk_mentions.copy()
        elif "trump" in person_lower or "donald" in person_lower:
            mentions = self.mock_trump_mentions.copy()
        else:
            # Generate generic mentions for unknown persons
            mentions = self._generate_generic_mentions(person_name)
        
        # Randomize order and limit results
        random.shuffle(mentions)
        mentions = mentions[:min(limit, len(mentions))]
        
        # Add some random variation to engagement numbers
        for mention in mentions:
            if "engagement" in mention:
                for key in mention["engagement"]:
                    mention["engagement"][key] = int(mention["engagement"][key] * random.uniform(0.8, 1.2))
        
        return {
            "person": person_name,
            "mentions": mentions,
            "total_found": len(mentions),
            "api_credits_used": 1,
            "search_timestamp": datetime.utcnow().isoformat(),
            "source": "mock_data_for_demo"
        }

    def _generate_generic_mentions(self, person_name: str) -> List[Dict]:
        """Generate generic mentions for unknown persons"""
        templates = [
            f"{person_name} announced new plans today. Interesting developments ahead.",
            f"Not sure what to think about {person_name}'s latest statement. Mixed feelings.",
            f"{person_name} is trending on social media. People have strong opinions.",
            f"Great interview with {person_name} yesterday. Very insightful discussion.",
            f"Disappointed with {person_name}'s recent decisions. Expected better."
        ]
        
        mentions = []
        for i, template in enumerate(templates):
            mentions.append({
                "id": f"generic_{i+1}",
                "text": template,
                "platform": random.choice(["twitter", "facebook", "reddit"]),
                "author": f"user_{random.randint(1000, 9999)}",
                "timestamp": (datetime.utcnow() - timedelta(hours=random.randint(1, 24))).isoformat(),
                "engagement": {"likes": random.randint(10, 100), "shares": random.randint(1, 20)}
            })
        
        return mentions

    def _get_empty_result(self, person_name: str) -> Dict[str, any]:
        """Return empty result when no data is available"""
        return {
            "person": person_name,
            "mentions": [],
            "total_found": 0,
            "api_credits_used": 0,
            "search_timestamp": datetime.utcnow().isoformat(),
            "source": "error_fallback",
            "error": "No data available"
        }

    def get_trending_topics(self) -> Dict[str, List[str]]:
        """
        Get trending topics related to the tracked personalities
        """
        return {
            "musk_trending": [
                "#Tesla", "#SpaceX", "#ElonMusk", "#Mars", "#ElectricVehicles",
                "#Innovation", "#Technology", "#Starship", "#AI"
            ],
            "trump_trending": [
                "#Trump2024", "#Politics", "#MAGA", "#Election", "#DonaldTrump",
                "#Campaign", "#America", "#Republican", "#News"
            ],
            "general_trending": [
                "#SocialMedia", "#Breaking", "#Politics", "#Technology", "#Business"
            ],
            "last_updated": datetime.utcnow().isoformat()
        }

    def get_api_status(self) -> Dict[str, any]:
        """
        Get API status and usage information
        """
        return {
            "status": "operational",
            "api_version": "2.0",
            "daily_credits_used": random.randint(50, 200),
            "daily_credits_limit": 1000,
            "rate_limit": "100 requests per minute",
            "last_request": datetime.utcnow().isoformat(),
            "supported_platforms": ["twitter", "facebook", "instagram", "youtube", "reddit", "tiktok"]
        }


# Global collector instance
data_collector = SocialMediaDataCollector()