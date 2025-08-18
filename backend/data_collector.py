"""
Data Collector Module
Collects data from various sources for reputation tracking
"""
import os
import logging
import requests
import time
import json
from typing import Dict, List, Optional, Any, Tuple
from datetime import datetime, timedelta
from dataclasses import dataclass
import random

from models import ReputationScore, db_manager
from sentiment_analyzer import AdvancedSentimentAnalyzer

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@dataclass
class DataPoint:
    """Data structure for collected data points"""
    content: str
    source: str
    source_id: str
    person: str
    timestamp: datetime
    metadata: Dict[str, Any]


class MockDataGenerator:
    """
    Generates mock data for demonstration and testing purposes
    In production, this would be replaced with actual API integrations
    """
    
    def __init__(self):
        self.musk_topics = [
            "Tesla stock performance", "SpaceX launch", "Neuralink progress",
            "Twitter acquisition", "AI development", "Electric vehicle innovation",
            "Mars mission", "Hyperloop technology", "Solar energy", "Autonomous driving"
        ]
        
        self.trump_topics = [
            "Political rally", "Social media post", "Policy announcement",
            "Legal proceedings", "Business dealings", "Media interview",
            "Campaign event", "Political endorsement", "Trade policy", "Immigration policy"
        ]
        
        self.sentiment_patterns = {
            'positive': ["great", "excellent", "amazing", "successful", "innovative", "brilliant"],
            'negative': ["terrible", "disappointing", "controversial", "failed", "problematic", "concerning"],
            'neutral': ["announced", "reported", "stated", "discussed", "mentioned", "indicated"]
        }
    
    def generate_mock_content(self, person: str, sentiment_type: str = 'mixed') -> str:
        """Generate mock content for a person with specified sentiment"""
        topics = self.musk_topics if person.lower() == 'musk' else self.trump_topics
        topic = random.choice(topics)
        
        if sentiment_type == 'mixed':
            sentiment_type = random.choice(['positive', 'negative', 'neutral'])
        
        sentiment_words = self.sentiment_patterns[sentiment_type]
        sentiment_word = random.choice(sentiment_words)
        
        templates = [
            f"{person}'s {topic} was {sentiment_word} according to recent reports.",
            f"Latest news about {person}: {topic} shows {sentiment_word} results.",
            f"{person} {sentiment_word} in recent {topic} developments.",
            f"Analysis of {person}'s {topic} reveals {sentiment_word} outcomes."
        ]
        
        return random.choice(templates)
    
    def generate_batch_data(self, person: str, count: int = 10, 
                          time_range_days: int = 7) -> List[DataPoint]:
        """Generate batch of mock data points"""
        data_points = []
        
        for i in range(count):
            # Generate timestamp within time range
            days_ago = random.uniform(0, time_range_days)
            timestamp = datetime.utcnow() - timedelta(days=days_ago)
            
            # Generate content
            content = self.generate_mock_content(person)
            
            # Create data point
            data_point = DataPoint(
                content=content,
                source=random.choice(['twitter', 'news', 'reddit', 'youtube']),
                source_id=f"mock_{int(time.time())}_{i}",
                person=person.lower(),
                timestamp=timestamp,
                metadata={
                    'generated': True,
                    'generator': 'MockDataGenerator',
                    'batch_id': f"batch_{int(time.time())}",
                    'engagement': random.randint(10, 10000),
                    'platform': random.choice(['twitter', 'facebook', 'instagram', 'linkedin'])
                }
            )
            
            data_points.append(data_point)
        
        return data_points


class DataCollector:
    """
    Main data collection orchestrator
    Coordinates data collection from various sources and processes it
    """
    
    def __init__(self):
        self.sentiment_analyzer = AdvancedSentimentAnalyzer()
        self.mock_generator = MockDataGenerator()
        self.db_session = db_manager.get_session()
        
        # Data source configurations
        self.sources = {
            'twitter': {'enabled': False, 'rate_limit': 300},  # Twitter API rate limits
            'news': {'enabled': True, 'rate_limit': 100},
            'reddit': {'enabled': False, 'rate_limit': 60},
            'mock': {'enabled': True, 'rate_limit': 1000}  # Mock data for testing
        }
    
    def collect_data(self, person: str, source: str = 'all', limit: int = 50) -> List[DataPoint]:
        """
        Collect data for a specific person from specified sources
        """
        try:
            collected_data = []
            
            if source == 'all':
                enabled_sources = [src for src, config in self.sources.items() if config['enabled']]
            else:
                enabled_sources = [source] if source in self.sources else []
            
            for src in enabled_sources:
                try:
                    if src == 'mock':
                        data = self._collect_mock_data(person, limit // len(enabled_sources))
                    elif src == 'twitter':
                        data = self._collect_twitter_data(person, limit // len(enabled_sources))
                    elif src == 'news':
                        data = self._collect_news_data(person, limit // len(enabled_sources))
                    elif src == 'reddit':
                        data = self._collect_reddit_data(person, limit // len(enabled_sources))
                    else:
                        continue
                        
                    collected_data.extend(data)
                    logger.info(f"Collected {len(data)} data points from {src} for {person}")
                    
                except Exception as e:
                    logger.error(f"Error collecting from {src}: {str(e)}")
                    continue
            
            return collected_data
            
        except Exception as e:
            logger.error(f"Error in data collection: {str(e)}")
            return []
    
    def _collect_mock_data(self, person: str, limit: int) -> List[DataPoint]:
        """Collect mock data for testing and demonstration"""
        return self.mock_generator.generate_batch_data(person, min(limit, 20), 7)
    
    def _collect_twitter_data(self, person: str, limit: int) -> List[DataPoint]:
        """
        Collect data from Twitter API
        Note: This is a placeholder - would require actual Twitter API integration
        """
        # In a real implementation, this would use Twitter API
        logger.info(f"Twitter API collection not implemented - using mock data")
        return self._collect_mock_data(person, limit)
    
    def _collect_news_data(self, person: str, limit: int) -> List[DataPoint]:
        """
        Collect data from news APIs
        Note: This is a placeholder - would require actual news API integration
        """
        # In a real implementation, this would use NewsAPI or similar
        logger.info(f"News API collection not implemented - using mock data")
        return self._collect_mock_data(person, limit)
    
    def _collect_reddit_data(self, person: str, limit: int) -> List[DataPoint]:
        """
        Collect data from Reddit API
        Note: This is a placeholder - would require actual Reddit API integration
        """
        # In a real implementation, this would use Reddit API
        logger.info(f"Reddit API collection not implemented - using mock data")
        return self._collect_mock_data(person, limit)
    
    def process_and_store_data(self, data_points: List[DataPoint]) -> Dict[str, Any]:
        """
        Process collected data through sentiment analysis and store in database
        """
        try:
            processed_count = 0
            error_count = 0
            processing_results = []
            
            for data_point in data_points:
                try:
                    # Analyze sentiment
                    sentiment_result = self.sentiment_analyzer.analyze_text(data_point.content)
                    
                    if 'error' in sentiment_result:
                        error_count += 1
                        continue
                    
                    # Extract sentiment score
                    combined_analysis = sentiment_result.get('combined', {})
                    sentiment_score = combined_analysis.get('combined_score', 0.0)
                    confidence = combined_analysis.get('confidence', 0.5)
                    
                    # Calculate reputation score (weighted sentiment)
                    reputation_score = sentiment_score * confidence
                    
                    # Create database record
                    reputation_record = ReputationScore(
                        person=data_point.person,
                        timestamp=data_point.timestamp,
                        score=reputation_score,
                        sentiment_score=sentiment_score,
                        source=data_point.source,
                        source_id=data_point.source_id,
                        content=data_point.content,
                        meta_data=json.dumps({
                            **data_point.metadata,
                            'sentiment_analysis': combined_analysis,
                            'processing_timestamp': datetime.utcnow().isoformat()
                        })
                    )
                    
                    # Add to database session
                    self.db_session.add(reputation_record)
                    processed_count += 1
                    
                    processing_results.append({
                        'content_preview': data_point.content[:50] + "...",
                        'sentiment_score': sentiment_score,
                        'reputation_score': reputation_score,
                        'source': data_point.source
                    })
                    
                except Exception as e:
                    logger.error(f"Error processing data point: {str(e)}")
                    error_count += 1
                    continue
            
            # Commit to database
            self.db_session.commit()
            
            results = {
                'processed_count': processed_count,
                'error_count': error_count,
                'total_attempted': len(data_points),
                'success_rate': processed_count / len(data_points) if data_points else 0,
                'processing_timestamp': datetime.utcnow().isoformat(),
                'sample_results': processing_results[:5]  # First 5 results as sample
            }
            
            logger.info(f"Processed and stored {processed_count} data points with {error_count} errors")
            return results
            
        except Exception as e:
            logger.error(f"Error in data processing and storage: {str(e)}")
            self.db_session.rollback()
            return {'error': str(e)}
    
    def run_collection_cycle(self, persons: List[str] = None, sources: List[str] = None) -> Dict[str, Any]:
        """
        Run a complete data collection cycle for specified persons and sources
        """
        if persons is None:
            persons = ['musk', 'trump']
        
        if sources is None:
            sources = ['all']
        
        cycle_results = {
            'cycle_started': datetime.utcnow().isoformat(),
            'persons': persons,
            'sources': sources,
            'results': {}
        }
        
        try:
            for person in persons:
                person_results = {}
                
                for source in sources:
                    # Collect data
                    collected_data = self.collect_data(person, source, limit=25)
                    
                    # Process and store
                    processing_results = self.process_and_store_data(collected_data)
                    
                    person_results[source] = {
                        'collected_count': len(collected_data),
                        'processing_results': processing_results
                    }
                
                cycle_results['results'][person] = person_results
            
            cycle_results['cycle_completed'] = datetime.utcnow().isoformat()
            cycle_results['success'] = True
            
            logger.info("Data collection cycle completed successfully")
            return cycle_results
            
        except Exception as e:
            logger.error(f"Error in collection cycle: {str(e)}")
            cycle_results['error'] = str(e)
            cycle_results['success'] = False
            return cycle_results
    
    def get_collection_stats(self, days: int = 7) -> Dict[str, Any]:
        """Get statistics about recent data collection"""
        try:
            end_date = datetime.utcnow()
            start_date = end_date - timedelta(days=days)
            
            # Query recent records
            query = self.db_session.query(ReputationScore).filter(
                ReputationScore.timestamp >= start_date
            )
            
            all_records = query.all()
            musk_records = [r for r in all_records if r.person == 'musk']
            trump_records = [r for r in all_records if r.person == 'trump']
            
            # Calculate statistics
            stats = {
                'period': f"{days} days",
                'total_records': len(all_records),
                'by_person': {
                    'musk': {
                        'count': len(musk_records),
                        'avg_score': sum(r.score for r in musk_records) / len(musk_records) if musk_records else 0,
                        'sources': list(set(r.source for r in musk_records))
                    },
                    'trump': {
                        'count': len(trump_records),
                        'avg_score': sum(r.score for r in trump_records) / len(trump_records) if trump_records else 0,
                        'sources': list(set(r.source for r in trump_records))
                    }
                },
                'sources_active': list(set(r.source for r in all_records)),
                'data_freshness': {
                    'latest_timestamp': max(r.timestamp for r in all_records).isoformat() if all_records else None,
                    'oldest_timestamp': min(r.timestamp for r in all_records).isoformat() if all_records else None
                },
                'generated_at': datetime.utcnow().isoformat()
            }
            
            return stats
            
        except Exception as e:
            logger.error(f"Error generating collection stats: {str(e)}")
            return {'error': str(e)}
    
    def cleanup_old_data(self, days_to_keep: int = 30) -> Dict[str, Any]:
        """Clean up old data records"""
        try:
            cutoff_date = datetime.utcnow() - timedelta(days=days_to_keep)
            
            # Count records to be deleted
            old_records = self.db_session.query(ReputationScore).filter(
                ReputationScore.timestamp < cutoff_date
            )
            
            delete_count = old_records.count()
            
            # Delete old records
            old_records.delete()
            self.db_session.commit()
            
            result = {
                'deleted_count': delete_count,
                'cutoff_date': cutoff_date.isoformat(),
                'days_kept': days_to_keep,
                'cleanup_timestamp': datetime.utcnow().isoformat()
            }
            
            logger.info(f"Cleaned up {delete_count} old records older than {days_to_keep} days")
            return result
            
        except Exception as e:
            logger.error(f"Error cleaning up old data: {str(e)}")
            self.db_session.rollback()
            return {'error': str(e)}


# Utility functions for easy data collection
def quick_data_collection(person: str, count: int = 20) -> Dict[str, Any]:
    """Quick data collection for a person"""
    collector = DataCollector()
    data = collector.collect_data(person, 'mock', count)
    return collector.process_and_store_data(data)


def run_full_collection() -> Dict[str, Any]:
    """Run full data collection for both persons"""
    collector = DataCollector()
    return collector.run_collection_cycle()


# Example usage and testing
if __name__ == "__main__":
    # Initialize database
    db_manager.create_tables()
    
    collector = DataCollector()
    
    print("Running data collection test...")
    
    # Test data collection
    test_data = collector.collect_data('musk', 'mock', 5)
    print(f"Collected {len(test_data)} mock data points")
    
    # Test processing and storage
    processing_results = collector.process_and_store_data(test_data)
    print(f"Processing results: {processing_results.get('processed_count', 0)} processed, {processing_results.get('error_count', 0)} errors")
    
    # Test full cycle
    cycle_results = collector.run_collection_cycle(['musk'], ['mock'])
    print(f"Collection cycle completed: {cycle_results.get('success', False)}")
    
    # Get stats
    stats = collector.get_collection_stats(1)  # Last day
    print(f"Collection stats: {stats.get('total_records', 0)} total records")