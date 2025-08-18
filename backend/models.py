"""
Models for the Musk vs Trump Reputation Tracker
"""
from sqlalchemy import Column, Integer, String, Float, DateTime, Text, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from datetime import datetime
from typing import Optional, Dict, Any
import json

Base = declarative_base()


class ReputationScore(Base):
    """Model for storing reputation scores"""
    __tablename__ = 'reputation_scores'
    
    id = Column(Integer, primary_key=True)
    person = Column(String(50), nullable=False)  # 'musk' or 'trump'
    timestamp = Column(DateTime, default=datetime.utcnow)
    score = Column(Float, nullable=False)
    sentiment_score = Column(Float)
    source = Column(String(100))  # twitter, news, etc.
    source_id = Column(String(200))
    content = Column(Text)
    meta_data = Column(Text)  # JSON string for additional data
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert model to dictionary"""
        return {
            'id': self.id,
            'person': self.person,
            'timestamp': self.timestamp.isoformat() if self.timestamp else None,
            'score': self.score,
            'sentiment_score': self.sentiment_score,
            'source': self.source,
            'source_id': self.source_id,
            'content': self.content,
            'metadata': json.loads(self.meta_data) if self.meta_data else {}
        }


class AIModel(Base):
    """Model for tracking AI models and their performance"""
    __tablename__ = 'ai_models'
    
    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    model_type = Column(String(50))  # 'sentiment', 'classification', etc.
    version = Column(String(20))
    accuracy = Column(Float)
    is_active = Column(Boolean, default=True)
    config = Column(Text)  # JSON configuration
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class DataSource(Base):
    """Model for tracking data sources"""
    __tablename__ = 'data_sources'
    
    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    source_type = Column(String(50))  # 'social_media', 'news', 'forum'
    endpoint = Column(String(200))
    is_active = Column(Boolean, default=True)
    last_fetch = Column(DateTime)
    config = Column(Text)  # JSON configuration


class DatabaseManager:
    """Database connection and session management"""
    
    def __init__(self, database_url: str = "sqlite:///reputation_tracker.db"):
        self.engine = create_engine(database_url)
        self.SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=self.engine)
        
    def create_tables(self):
        """Create all tables"""
        Base.metadata.create_all(bind=self.engine)
        
    def get_session(self):
        """Get database session"""
        return self.SessionLocal()
        
    def close(self):
        """Close database connection"""
        self.engine.dispose()


# Global database instance
db_manager = DatabaseManager()