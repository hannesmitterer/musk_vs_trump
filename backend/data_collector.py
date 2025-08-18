"""
Data collection module for ingesting data from various sources:
FRED, YCharts, Michigan Sentiment, Our World in Data, Census, and OpenRank SDK.
"""

import logging
import asyncio
from datetime import datetime, timedelta
from typing import List, Dict, Optional, Any
import json
import os

import requests
try:
    import pandas as pd
except ImportError:
    pd = None
    
try:
    from fredapi import Fred
except ImportError:
    Fred = None
    
try:
    import yfinance as yf
except ImportError:
    yf = None

try:
    import httpx
except ImportError:
    httpx = None

from models import DataPoint, DataSource, SubjectType

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class DataCollector:
    """Main data collection orchestrator."""
    
    def __init__(self):
        """Initialize data collector with API clients."""
        # FRED API (Federal Reserve Economic Data)
        self.fred_api_key = os.getenv('FRED_API_KEY', 'demo_key')
        try:
            self.fred = Fred(api_key=self.fred_api_key)
        except:
            self.fred = None
            logger.warning("FRED API not available - using mock data")
        
        # HTTP client for various APIs (using requests for simplicity)
        self.http_client = None
        
        # Cache for reducing API calls
        self.cache = {}
        self.cache_duration = timedelta(hours=1)
    
    def _get_cache_key(self, source: str, params: Dict) -> str:
        """Generate cache key for API calls."""
        return f"{source}_{hash(str(sorted(params.items())))}"
    
    def _is_cache_valid(self, timestamp: datetime) -> bool:
        """Check if cached data is still valid."""
        return datetime.now() - timestamp < self.cache_duration
    
    async def collect_fred_data(self) -> List[DataPoint]:
        """Collect economic data from FRED."""
        logger.info("Collecting FRED economic data...")
        
        data_points = []
        
        # Key economic indicators that might affect reputation
        indicators = {
            'GDP': 'GDP',  # Gross Domestic Product
            'UNRATE': 'unemployment_rate',  # Unemployment Rate
            'CPIAUCSL': 'inflation',  # Consumer Price Index
            'DEXUSEU': 'dollar_euro_rate',  # Dollar-Euro Exchange Rate
            'DGS10': '10y_treasury',  # 10-Year Treasury Rate
        }
        
        if not self.fred:
            # Return mock FRED data
            for indicator, name in indicators.items():
                data_points.append(DataPoint(
                    timestamp=datetime.now(),
                    source=DataSource.FRED,
                    subject=SubjectType.MUSK,  # Economic data affects both
                    value=self.MOCK_FRED_BASE_VALUE + hash(indicator) % self.MOCK_FRED_VARIATION_RANGE,  # Mock value
                    metadata={'indicator': indicator, 'name': name}
                ))
            return data_points
        
        try:
            for indicator, name in indicators.items():
                cache_key = self._get_cache_key('fred', {'indicator': indicator})
                
                if cache_key in self.cache and self._is_cache_valid(self.cache[cache_key]['timestamp']):
                    data = self.cache[cache_key]['data']
                else:
                    # Get last 30 days of data
                    end_date = datetime.now()
                    start_date = end_date - timedelta(days=30)
                    
                    data = self.fred.get_data(indicator, start_date, end_date)
                    self.cache[cache_key] = {
                        'data': data,
                        'timestamp': datetime.now()
                    }
                
                # Convert to DataPoint objects
                for date, value in data.items() if hasattr(data, 'items') else []:
                    if pd and pd.notna(value):
                        # Economic indicators affect both subjects
                        for subject in [SubjectType.MUSK, SubjectType.TRUMP]:
                            timestamp = pd.to_datetime(date).to_pydatetime() if pd else datetime.now()
                            data_points.append(DataPoint(
                                timestamp=timestamp,
                                source=DataSource.FRED,
                                subject=subject,
                                value=float(value),
                                metadata={'indicator': indicator, 'name': name}
                            ))
                            
        except Exception as e:
            logger.error(f"Error collecting FRED data: {e}")
            
        return data_points
    
    async def collect_ycharts_data(self) -> List[DataPoint]:
        """Collect financial data from YCharts (using yfinance as proxy)."""
        logger.info("Collecting financial market data...")
        
        data_points = []
        
        # Stock symbols relevant to our subjects
        symbols = {
            'TSLA': SubjectType.MUSK,  # Tesla
            'TWTR': SubjectType.MUSK,  # Twitter (now X, may not exist)
            'DJT': SubjectType.TRUMP,  # Trump Media & Technology Group
            'SPY': SubjectType.MUSK,   # S&P 500 as general market indicator
        }
        
        try:
            if not yf:
                raise ImportError("yfinance not available")
                
            for symbol, subject in symbols.items():
                cache_key = self._get_cache_key('yahoo', {'symbol': symbol})
                
                if cache_key in self.cache and self._is_cache_valid(self.cache[cache_key]['timestamp']):
                    hist_data = self.cache[cache_key]['data']
                else:
                    ticker = yf.Ticker(symbol)
                    # Get last 30 days
                    hist_data = ticker.history(period="1mo")
                    self.cache[cache_key] = {
                        'data': hist_data,
                        'timestamp': datetime.now()
                    }
                
                # Convert to DataPoint objects
                if pd and hasattr(hist_data, 'iterrows'):
                    for date, row in hist_data.iterrows():
                        data_points.append(DataPoint(
                            timestamp=pd.to_datetime(date).to_pydatetime(),
                            source=DataSource.YCHARTS,
                            subject=subject,
                            value=float(row['Close']),
                            metadata={
                                'symbol': symbol,
                                'volume': float(row['Volume']),
                                'high': float(row['High']),
                                'low': float(row['Low'])
                            }
                        ))
                    
        except Exception as e:
            logger.error(f"Error collecting financial data: {e}")
            # Add mock financial data
            for symbol, subject in symbols.items():
                data_points.append(DataPoint(
                    timestamp=datetime.now(),
                    source=DataSource.YCHARTS,
                    subject=subject,
                    value=200.0 + hash(symbol) % 100,
                    metadata={'symbol': symbol, 'mock': True}
                ))
        
        return data_points
    
    async def collect_michigan_sentiment(self) -> List[DataPoint]:
        """Collect University of Michigan Consumer Sentiment data."""
        logger.info("Collecting Michigan Consumer Sentiment data...")
        
        data_points = []
        
        try:
            # Michigan Consumer Sentiment Index from FRED
            if self.fred:
                cache_key = self._get_cache_key('michigan', {'indicator': 'UMCSENT'})
                
                if cache_key in self.cache and self._is_cache_valid(self.cache[cache_key]['timestamp']):
                    data = self.cache[cache_key]['data']
                else:
                    end_date = datetime.now()
                    start_date = end_date - timedelta(days=365)  # Get 1 year of data
                    data = self.fred.get_data('UMCSENT', start_date, end_date)
                    self.cache[cache_key] = {
                        'data': data,
                        'timestamp': datetime.now()
                    }
                
                # Convert to DataPoint objects
                if pd and hasattr(data, 'items'):
                    for date, value in data.items():
                        if pd.notna(value):
                            # Consumer sentiment affects both subjects
                            for subject in [SubjectType.MUSK, SubjectType.TRUMP]:
                                data_points.append(DataPoint(
                                    timestamp=pd.to_datetime(date).to_pydatetime(),
                                    source=DataSource.MICHIGAN_SENTIMENT,
                                    subject=subject,
                                    value=float(value),
                                    metadata={'indicator': 'consumer_sentiment'}
                                ))
            else:
                # Mock Michigan sentiment data
                for i in range(30):
                    date = datetime.now() - timedelta(days=i)
                    sentiment_value = 90 + (hash(str(date)) % 20)  # 90-110 range
                    
                    for subject in [SubjectType.MUSK, SubjectType.TRUMP]:
                        data_points.append(DataPoint(
                            timestamp=date,
                            source=DataSource.MICHIGAN_SENTIMENT,
                            subject=subject,
                            value=float(sentiment_value),
                            metadata={'indicator': 'consumer_sentiment', 'mock': True}
                        ))
                        
        except Exception as e:
            logger.error(f"Error collecting Michigan sentiment data: {e}")
            
        return data_points
    
    async def collect_our_world_in_data(self) -> List[DataPoint]:
        """Collect data from Our World in Data."""
        logger.info("Collecting Our World in Data...")
        
        data_points = []
        
        # Mock data for various global indicators
        indicators = [
            'gdp_per_capita',
            'life_expectancy',
            'education_index',
            'democracy_index',
            'press_freedom',
        ]
        
        try:
            for indicator in indicators:
                # Mock data since Our World in Data requires specific dataset access
                for i in range(30):
                    date = datetime.now() - timedelta(days=i)
                    value = 50 + (hash(f"{indicator}_{date.day}") % 50)
                    
                    # These global indicators might affect both subjects differently
                    for subject in [SubjectType.MUSK, SubjectType.TRUMP]:
                        data_points.append(DataPoint(
                            timestamp=date,
                            source=DataSource.OUR_WORLD_IN_DATA,
                            subject=subject,
                            value=float(value),
                            metadata={'indicator': indicator, 'mock': True}
                        ))
                        
        except Exception as e:
            logger.error(f"Error collecting Our World in Data: {e}")
            
        return data_points
    
    async def collect_census_data(self) -> List[DataPoint]:
        """Collect US Census demographic and economic data."""
        logger.info("Collecting Census data...")
        
        data_points = []
        
        # Mock Census data (real implementation would use Census API)
        indicators = [
            'population_growth',
            'median_income',
            'unemployment_demographic',
            'education_attainment',
            'housing_costs',
        ]
        
        try:
            for indicator in indicators:
                # Simulate monthly data
                for i in range(12):
                    date = datetime.now().replace(day=1) - timedelta(days=30*i)
                    value = 40 + (hash(f"{indicator}_{i}") % 40)
                    
                    for subject in [SubjectType.MUSK, SubjectType.TRUMP]:
                        data_points.append(DataPoint(
                            timestamp=date,
                            source=DataSource.CENSUS,
                            subject=subject,
                            value=float(value),
                            metadata={'indicator': indicator, 'mock': True}
                        ))
                        
        except Exception as e:
            logger.error(f"Error collecting Census data: {e}")
            
        return data_points
    
    async def collect_openrank_data(self) -> List[DataPoint]:
        """Collect data from OpenRank SDK."""
        logger.info("Collecting OpenRank data...")
        
        data_points = []
        
        # Mock OpenRank trust and reputation data
        # Real implementation would integrate with OpenRank SDK
        try:
            subjects_data = {
                SubjectType.MUSK: {
                    'trust_score': 0.75,
                    'reputation_rank': 85,
                    'network_influence': 0.82,
                    'credibility_score': 0.68
                },
                SubjectType.TRUMP: {
                    'trust_score': 0.45,
                    'reputation_rank': 52,
                    'network_influence': 0.78,
                    'credibility_score': 0.41
                }
            }
            
            for subject, metrics in subjects_data.items():
                timestamp = datetime.now()
                for metric_name, value in metrics.items():
                    data_points.append(DataPoint(
                        timestamp=timestamp,
                        source=DataSource.OPENRANK,
                        subject=subject,
                        value=float(value * 100),  # Scale to 0-100
                        metadata={'metric': metric_name, 'mock': True}
                    ))
                    
        except Exception as e:
            logger.error(f"Error collecting OpenRank data: {e}")
            
        return data_points
    
    async def collect_all_data(self) -> Dict[DataSource, List[DataPoint]]:
        """Collect data from all sources."""
        logger.info("Starting comprehensive data collection...")
        
        # Collect from all sources concurrently
        tasks = [
            self.collect_fred_data(),
            self.collect_ycharts_data(), 
            self.collect_michigan_sentiment(),
            self.collect_our_world_in_data(),
            self.collect_census_data(),
            self.collect_openrank_data(),
        ]
        
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Organize results by source
        data_by_source = {
            DataSource.FRED: results[0] if not isinstance(results[0], Exception) else [],
            DataSource.YCHARTS: results[1] if not isinstance(results[1], Exception) else [],
            DataSource.MICHIGAN_SENTIMENT: results[2] if not isinstance(results[2], Exception) else [],
            DataSource.OUR_WORLD_IN_DATA: results[3] if not isinstance(results[3], Exception) else [],
            DataSource.CENSUS: results[4] if not isinstance(results[4], Exception) else [],
            DataSource.OPENRANK: results[5] if not isinstance(results[5], Exception) else [],
        }
        
        total_points = sum(len(points) for points in data_by_source.values())
        logger.info(f"Collected {total_points} total data points from all sources")
        
        return data_by_source
    
    async def close(self):
        """Clean up resources."""
        pass  # Nothing to clean up for now


async def main():
    """Test the data collector."""
    collector = DataCollector()
    
    try:
        all_data = await collector.collect_all_data()
        
        for source, data_points in all_data.items():
            print(f"\n{source.value}: {len(data_points)} data points")
            if data_points:
                sample = data_points[0]
                print(f"  Sample: {sample.subject.value} = {sample.value} at {sample.timestamp}")
                
    finally:
        await collector.close()


if __name__ == "__main__":
    asyncio.run(main())