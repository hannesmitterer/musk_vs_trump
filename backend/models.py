"""
Data models for the AI-powered reputation tracker.
"""

from dataclasses import dataclass
from datetime import datetime
from typing import List, Dict, Optional, Any
from enum import Enum


class DataSource(Enum):
    """Available data sources for reputation tracking."""
    FRED = "fred"
    YCHARTS = "ycharts" 
    MICHIGAN_SENTIMENT = "michigan_sentiment"
    OUR_WORLD_IN_DATA = "our_world_in_data"
    CENSUS = "census"
    OPENRANK = "openrank"
    SOCIAL_MEDIA = "social_media"
    NEWS = "news"


class SubjectType(Enum):
    """Subjects being tracked."""
    MUSK = "musk"
    TRUMP = "trump"


@dataclass
class DataPoint:
    """Represents a single data point from any source."""
    timestamp: datetime
    source: DataSource
    subject: SubjectType
    value: float
    metadata: Optional[Dict[str, Any]] = None
    confidence: Optional[float] = None


@dataclass
class SentimentScore:
    """Sentiment analysis results."""
    timestamp: datetime
    subject: SubjectType
    sentiment: float  # -1.0 to 1.0
    confidence: float  # 0.0 to 1.0
    source_text: str
    source_type: str  # "news", "social", etc.


@dataclass
class TrustScore:
    """Trust score from EigenTrust algorithm."""
    timestamp: datetime
    subject: SubjectType
    trust_score: float  # 0.0 to 1.0
    eigentrust_value: float
    local_trust: float
    pre_trust: float


@dataclass
class ReputationScore:
    """Combined reputation score."""
    timestamp: datetime
    subject: SubjectType
    overall_score: float  # 0.0 to 100.0
    sentiment_component: float
    economic_component: float
    social_component: float
    trust_component: float
    confidence_interval: tuple  # (low, high)


@dataclass
class PublishedResult:
    """Results ready for publishing."""
    timestamp: datetime
    musk_reputation: ReputationScore
    trump_reputation: ReputationScore
    comparison_metrics: Dict[str, float]
    publish_urls: List[str]
    data_freshness: datetime