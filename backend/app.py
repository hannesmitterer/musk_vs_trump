"""
Main application for the AI-powered reputation tracker.
Orchestrates data collection, sentiment analysis, trust computation, and publishing.
"""

import asyncio
import json
import logging
import os
from datetime import datetime, timedelta
from typing import Dict, List, Optional
from pathlib import Path

import numpy as np
from flask import Flask, jsonify, render_template
import structlog

from models import (
    DataPoint, DataSource, SubjectType, SentimentScore, 
    TrustScore, ReputationScore, PublishedResult
)
from data_collector import DataCollector
from sentiment_analyzer import SentimentAnalyzer

# Configure structured logging
structlog.configure(
    processors=[
        structlog.stdlib.filter_by_level,
        structlog.stdlib.add_log_level,
        structlog.stdlib.PositionalArgumentsFormatter(),
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.StackInfoRenderer(),
        structlog.processors.format_exc_info,
        structlog.processors.JSONRenderer()
    ],
    wrapper_class=structlog.stdlib.BoundLogger,
    logger_factory=structlog.stdlib.LoggerFactory(),
    cache_logger_on_first_use=True,
)

logger = structlog.get_logger()


class EigenTrustCalculator:
    """Calculate trust scores using EigenTrust algorithm."""
    
    def __init__(self):
        self.damping_factor = 0.85
        self.max_iterations = 100
        self.tolerance = 1e-6
    
    def build_trust_matrix(self, data_points: List[DataPoint]) -> np.ndarray:
        """Build local trust matrix from data points."""
        # Mock implementation - real version would analyze relationships
        # between data sources and subjects
        
        # Create a 2x2 matrix for Musk vs Trump
        trust_matrix = np.array([
            [0.5, 0.3],  # Musk's trust relationships
            [0.4, 0.6],  # Trump's trust relationships  
        ])
        
        # Normalize rows to sum to 1
        row_sums = trust_matrix.sum(axis=1, keepdims=True)
        trust_matrix = np.divide(trust_matrix, row_sums, 
                               out=np.zeros_like(trust_matrix), 
                               where=row_sums!=0)
        
        return trust_matrix
    
    def calculate_eigentrust(self, trust_matrix: np.ndarray, 
                           pre_trust: np.ndarray) -> np.ndarray:
        """Calculate EigenTrust scores using power iteration."""
        n = trust_matrix.shape[0]
        trust_scores = pre_trust.copy()
        
        for iteration in range(self.max_iterations):
            new_scores = (1 - self.damping_factor) * pre_trust + \
                        self.damping_factor * trust_matrix.T @ trust_scores
            
            # Check for convergence
            if np.linalg.norm(new_scores - trust_scores) < self.tolerance:
                logger.info(f"EigenTrust converged after {iteration} iterations")
                break
                
            trust_scores = new_scores
            
        return trust_scores
    
    def compute_trust_scores(self, data_points: List[DataPoint]) -> List[TrustScore]:
        """Compute trust scores for all subjects."""
        trust_matrix = self.build_trust_matrix(data_points)
        
        # Initial pre-trust values (can be adjusted based on historical data)
        pre_trust = np.array([0.6, 0.4])  # Musk, Trump
        
        eigentrust_scores = self.calculate_eigentrust(trust_matrix, pre_trust)
        
        timestamp = datetime.now()
        trust_scores = []
        
        subjects = [SubjectType.MUSK, SubjectType.TRUMP]
        for i, subject in enumerate(subjects):
            trust_score = TrustScore(
                timestamp=timestamp,
                subject=subject,
                trust_score=float(eigentrust_scores[i]),
                eigentrust_value=float(eigentrust_scores[i]),
                local_trust=float(trust_matrix[i].mean()),
                pre_trust=float(pre_trust[i])
            )
            trust_scores.append(trust_score)
            
        return trust_scores


class ReputationCalculator:
    """Calculate comprehensive reputation scores."""
    
    def __init__(self):
        # Weights for different components (sum to 1.0)
        self.weights = {
            'sentiment': 0.25,
            'economic': 0.30,
            'social': 0.20,
            'trust': 0.25
        }
    
    def calculate_sentiment_component(self, sentiment_scores: List[SentimentScore], 
                                    subject: SubjectType) -> float:
        """Calculate sentiment component of reputation score."""
        subject_scores = [s for s in sentiment_scores if s.subject == subject]
        
        if not subject_scores:
            return 50.0  # Neutral
            
        # Weight recent scores more heavily
        now = datetime.now()
        weighted_sum = 0.0
        weight_total = 0.0
        
        for score in subject_scores:
            # More recent = higher weight
            hours_ago = (now - score.timestamp).total_seconds() / 3600
            time_weight = np.exp(-hours_ago / 24)  # Decay over 24 hours
            
            weight = score.confidence * time_weight
            # Convert sentiment from [-1, 1] to [0, 100]
            sentiment_normalized = (score.sentiment + 1) * 50
            
            weighted_sum += sentiment_normalized * weight
            weight_total += weight
            
        return weighted_sum / weight_total if weight_total > 0 else 50.0
    
    def calculate_economic_component(self, data_points: List[DataPoint], 
                                   subject: SubjectType) -> float:
        """Calculate economic component of reputation score."""
        # Focus on financial and economic indicators
        economic_sources = [DataSource.FRED, DataSource.YCHARTS, 
                           DataSource.MICHIGAN_SENTIMENT]
        
        economic_points = [
            p for p in data_points 
            if p.subject == subject and p.source in economic_sources
        ]
        
        if not economic_points:
            return 50.0
            
        # Calculate performance relative to historical average
        values = [p.value for p in economic_points]
        recent_avg = np.mean(values[-7:]) if len(values) >= 7 else np.mean(values)
        historical_avg = np.mean(values)
        
        # Normalize to 0-100 scale
        if historical_avg == 0:
            return 50.0
            
        performance_ratio = recent_avg / historical_avg
        # Convert to 0-100 scale where 1.0 ratio = 50 points
        economic_score = 50 * performance_ratio
        
        return max(0, min(100, economic_score))
    
    def calculate_social_component(self, data_points: List[DataPoint], 
                                 subject: SubjectType) -> float:
        """Calculate social component of reputation score."""
        # Focus on social and demographic indicators
        social_sources = [DataSource.OUR_WORLD_IN_DATA, DataSource.CENSUS]
        
        social_points = [
            p for p in data_points 
            if p.subject == subject and p.source in social_sources
        ]
        
        if not social_points:
            return 50.0
            
        # Simple average of normalized values
        values = [p.value for p in social_points]
        # Assume values are already in reasonable range, normalize to 0-100
        social_score = np.mean(values)
        
        return max(0, min(100, social_score))
    
    def calculate_trust_component(self, trust_scores: List[TrustScore], 
                                subject: SubjectType) -> float:
        """Calculate trust component of reputation score."""
        subject_scores = [t for t in trust_scores if t.subject == subject]
        
        if not subject_scores:
            return 50.0
            
        # Use most recent trust score
        latest_score = max(subject_scores, key=lambda x: x.timestamp)
        # Convert to 0-100 scale
        return latest_score.trust_score * 100
    
    def calculate_reputation_score(self, data_points: List[DataPoint],
                                 sentiment_scores: List[SentimentScore],
                                 trust_scores: List[TrustScore],
                                 subject: SubjectType) -> ReputationScore:
        """Calculate comprehensive reputation score."""
        
        sentiment_comp = self.calculate_sentiment_component(sentiment_scores, subject)
        economic_comp = self.calculate_economic_component(data_points, subject)
        social_comp = self.calculate_social_component(data_points, subject)
        trust_comp = self.calculate_trust_component(trust_scores, subject)
        
        # Calculate weighted overall score
        overall_score = (
            self.weights['sentiment'] * sentiment_comp +
            self.weights['economic'] * economic_comp +
            self.weights['social'] * social_comp +
            self.weights['trust'] * trust_comp
        )
        
        # Calculate confidence interval (mock implementation)
        std_dev = 5.0  # Assume ±5 points standard deviation
        confidence_interval = (
            max(0, overall_score - 1.96 * std_dev),
            min(100, overall_score + 1.96 * std_dev)
        )
        
        return ReputationScore(
            timestamp=datetime.now(),
            subject=subject,
            overall_score=overall_score,
            sentiment_component=sentiment_comp,
            economic_component=economic_comp,
            social_component=social_comp,
            trust_component=trust_comp,
            confidence_interval=confidence_interval
        )


class ReputationTracker:
    """Main orchestrator for the reputation tracking system."""
    
    def __init__(self):
        self.data_collector = DataCollector()
        self.sentiment_analyzer = SentimentAnalyzer()
        self.trust_calculator = EigenTrustCalculator()
        self.reputation_calculator = ReputationCalculator()
        
        # Ensure data directory exists
        data_dir_env = os.environ.get('DATA_DIR')
        if data_dir_env:
            self.data_dir = Path(data_dir_env)
        else:
            # Default to 'data' directory relative to this file
            self.data_dir = Path(__file__).parent / 'data'
        self.data_dir.mkdir(exist_ok=True)
    
    async def run_full_analysis(self) -> PublishedResult:
        """Run complete reputation analysis pipeline."""
        logger.info("Starting full reputation analysis")
        
        # Step 1: Collect data from all sources
        logger.info("Collecting data from all sources")
        all_data = await self.data_collector.collect_all_data()
        
        # Flatten data points
        all_data_points = []
        for source_data in all_data.values():
            all_data_points.extend(source_data)
        
        logger.info(f"Collected {len(all_data_points)} total data points")
        
        # Step 2: Analyze sentiment from social/news data
        logger.info("Analyzing sentiment from social media and news")
        from sentiment_analyzer import get_mock_social_media_data, get_mock_news_data
        
        social_data = get_mock_social_media_data()
        news_data = get_mock_news_data()
        
        social_sentiments = self.sentiment_analyzer.analyze_social_media_data(social_data)
        news_sentiments = self.sentiment_analyzer.analyze_news_data(news_data)
        
        all_sentiments = social_sentiments + news_sentiments
        logger.info(f"Analyzed {len(all_sentiments)} sentiment scores")
        
        # Step 3: Calculate trust scores using EigenTrust
        logger.info("Computing trust scores with EigenTrust")
        trust_scores = self.trust_calculator.compute_trust_scores(all_data_points)
        
        # Step 4: Calculate comprehensive reputation scores
        logger.info("Calculating comprehensive reputation scores")
        musk_reputation = self.reputation_calculator.calculate_reputation_score(
            all_data_points, all_sentiments, trust_scores, SubjectType.MUSK
        )
        trump_reputation = self.reputation_calculator.calculate_reputation_score(
            all_data_points, all_sentiments, trust_scores, SubjectType.TRUMP
        )
        
        # Step 5: Generate comparison metrics
        comparison_metrics = {
            'reputation_difference': musk_reputation.overall_score - trump_reputation.overall_score,
            'sentiment_difference': musk_reputation.sentiment_component - trump_reputation.sentiment_component,
            'trust_difference': musk_reputation.trust_component - trump_reputation.trust_component,
            'leader': 'musk' if musk_reputation.overall_score > trump_reputation.overall_score else 'trump',
            'confidence_gap': abs(musk_reputation.overall_score - trump_reputation.overall_score)
        }
        
        # Step 6: Create published result
        result = PublishedResult(
            timestamp=datetime.now(),
            musk_reputation=musk_reputation,
            trump_reputation=trump_reputation,
            comparison_metrics=comparison_metrics,
            publish_urls=[
                f"https://hannesmitterer.github.io/musk_vs_trump/",
                f"https://api.openrank.com/publish/musk_trump_reputation"
            ],
            data_freshness=datetime.now()
        )
        
        # Step 7: Save results to JSON
        await self.save_results(result)
        
        logger.info("Reputation analysis complete", 
                   musk_score=musk_reputation.overall_score,
                   trump_score=trump_reputation.overall_score,
                   leader=comparison_metrics['leader'])
        
        return result
    
    async def save_results(self, result: PublishedResult):
        """Save results to JSON file for frontend consumption."""
        output_file = self.data_dir / 'reputation_data.json'
        
        # Convert dataclasses to dict for JSON serialization
        def serialize_dataclass(obj):
            if hasattr(obj, '__dataclass_fields__'):
                return {k: serialize_dataclass(v) for k, v in obj.__dict__.items()}
            elif isinstance(obj, datetime):
                return obj.isoformat()
            elif isinstance(obj, SubjectType):
                return obj.value
            elif isinstance(obj, tuple):
                return list(obj)
            else:
                return obj
        
        data = serialize_dataclass(result)
        
        with open(output_file, 'w') as f:
            json.dump(data, f, indent=2)
            
        logger.info(f"Results saved to {output_file}")
    
    async def close(self):
        """Clean up resources."""
        await self.data_collector.close()


# Flask app for API endpoints
app = Flask(__name__)
tracker = None


@app.route('/')
def index():
    """Health check endpoint."""
    return jsonify({
        'status': 'active',
        'service': 'Musk vs Trump Reputation Tracker',
        'timestamp': datetime.now().isoformat()
    })


@app.route('/api/reputation/latest')
def get_latest_reputation():
    """Get latest reputation scores."""
    try:
        data_path = os.environ.get('REPUTATION_DATA_PATH', 'data/reputation_data.json')
        data_file = Path(data_path)
        if data_file.exists():
            with open(data_file) as f:
                data = json.load(f)
            return jsonify(data)
        else:
            return jsonify({'error': 'No data available'}), 404
    except Exception as e:
        logger.error(f"Error serving reputation data: {e}", exc_info=True)
        return jsonify({'error': 'An internal error has occurred.'}), 500


@app.route('/api/reputation/refresh', methods=['POST'])
async def refresh_reputation():
    """Trigger reputation analysis refresh."""
    global tracker
    try:
        if not tracker:
            tracker = ReputationTracker()
        
        result = await tracker.run_full_analysis()
        return jsonify({'status': 'success', 'timestamp': result.timestamp.isoformat()})
    except Exception as e:
        logger.error(f"Error refreshing reputation data: {e}")
        return jsonify({'error': str(e)}), 500


async def main():
    """Main entry point for running analysis."""
    tracker = ReputationTracker()
    
    try:
        result = await tracker.run_full_analysis()
        print(f"\nReputation Analysis Complete!")
        print(f"Musk Score: {result.musk_reputation.overall_score:.1f}")
        print(f"Trump Score: {result.trump_reputation.overall_score:.1f}")
        print(f"Leader: {result.comparison_metrics['leader'].title()}")
        print(f"Results saved to: data/reputation_data.json")
        
    finally:
        await tracker.close()


if __name__ == "__main__":
    if len(os.sys.argv) > 1 and os.sys.argv[1] == "server":
        # Run Flask server
        app.run(host='0.0.0.0', port=5000, debug=True)
    else:
        # Run analysis
        asyncio.run(main())