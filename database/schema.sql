-- Database Schema for Musk vs Trump Reputation Tracker
-- SQLite compatible schema (can be adapted for PostgreSQL)

-- Reputation scores table - stores all reputation tracking data
CREATE TABLE IF NOT EXISTS reputation_scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    person VARCHAR(50) NOT NULL,  -- 'musk' or 'trump'
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    score REAL NOT NULL,  -- Main reputation score
    sentiment_score REAL,  -- Sentiment analysis score
    source VARCHAR(100),  -- Data source (twitter, news, etc.)
    source_id VARCHAR(200),  -- Unique identifier from source
    content TEXT,  -- Original content analyzed
    metadata TEXT,  -- JSON metadata
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    -- Indexes for performance
    FOREIGN KEY (person) REFERENCES persons(name)
);

-- AI models table - tracks loaded AI models and their performance
CREATE TABLE IF NOT EXISTS ai_models (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL,
    model_type VARCHAR(50),  -- 'sentiment', 'classification', etc.
    version VARCHAR(20),
    accuracy REAL,
    is_active BOOLEAN DEFAULT TRUE,
    config TEXT,  -- JSON configuration
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(name, version)
);

-- Data sources table - tracks configured data sources
CREATE TABLE IF NOT EXISTS data_sources (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    source_type VARCHAR(50),  -- 'social_media', 'news', 'forum'
    endpoint VARCHAR(200),
    is_active BOOLEAN DEFAULT TRUE,
    last_fetch DATETIME,
    config TEXT,  -- JSON configuration
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Persons table - reference table for tracked individuals
CREATE TABLE IF NOT EXISTS persons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    full_name VARCHAR(100),
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Analysis sessions table - tracks analysis runs and their results
CREATE TABLE IF NOT EXISTS analysis_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_type VARCHAR(50),  -- 'comparison', 'trend', 'sentiment'
    parameters TEXT,  -- JSON parameters used
    results TEXT,  -- JSON results
    started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    completed_at DATETIME,
    status VARCHAR(20) DEFAULT 'running'  -- 'running', 'completed', 'error'
);

-- Performance metrics table - tracks system performance over time
CREATE TABLE IF NOT EXISTS performance_metrics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    metric_type VARCHAR(50),  -- 'processing_time', 'accuracy', 'throughput'
    metric_value REAL,
    context VARCHAR(100),  -- What was being measured
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    metadata TEXT  -- Additional context as JSON
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_reputation_person_timestamp ON reputation_scores(person, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_reputation_source ON reputation_scores(source);
CREATE INDEX IF NOT EXISTS idx_reputation_timestamp ON reputation_scores(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_ai_models_active ON ai_models(is_active, model_type);
CREATE INDEX IF NOT EXISTS idx_data_sources_active ON data_sources(is_active, source_type);
CREATE INDEX IF NOT EXISTS idx_analysis_sessions_type ON analysis_sessions(session_type, started_at DESC);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_type ON performance_metrics(metric_type, timestamp DESC);

-- Insert default data
INSERT OR IGNORE INTO persons (name, full_name, description) VALUES 
('musk', 'Elon Musk', 'CEO of Tesla and SpaceX, entrepreneur and innovator'),
('trump', 'Donald Trump', 'Former President of the United States, businessman');

INSERT OR IGNORE INTO data_sources (name, source_type, endpoint, config) VALUES 
('mock_generator', 'mock', 'internal://mock', '{"enabled": true, "rate_limit": 1000}'),
('twitter_api', 'social_media', 'https://api.twitter.com/2/', '{"enabled": false, "rate_limit": 300}'),
('news_api', 'news', 'https://newsapi.org/v2/', '{"enabled": false, "rate_limit": 100}'),
('reddit_api', 'forum', 'https://www.reddit.com/api/', '{"enabled": false, "rate_limit": 60}');

INSERT OR IGNORE INTO ai_models (name, model_type, version, accuracy, config) VALUES 
('bert_sentiment', 'sentiment', '1.0', 0.92, '{"model_path": "deep_learning_drizzle/sentiment/bert_sentiment.py"}'),
('advanced_sentiment_scorer', 'sentiment', '1.0', 0.85, '{"algorithm_path": "builtin/sentiment_scorer.py"}'),
('reputation_trend_analyzer', 'trend_analysis', '1.0', 0.88, '{"algorithm_path": "builtin/reputation_analyzer.py"}'),
('comparative_analyzer', 'comparison', '1.0', 0.90, '{"algorithm_path": "builtin/comparative_analyzer.py"}');

-- Views for common queries
CREATE VIEW IF NOT EXISTS latest_scores AS
SELECT 
    person,
    score,
    sentiment_score,
    source,
    timestamp,
    ROW_NUMBER() OVER (PARTITION BY person ORDER BY timestamp DESC) as rank
FROM reputation_scores
WHERE timestamp >= date('now', '-30 days');

CREATE VIEW IF NOT EXISTS daily_averages AS
SELECT 
    person,
    date(timestamp) as date,
    AVG(score) as avg_score,
    AVG(sentiment_score) as avg_sentiment,
    COUNT(*) as data_points,
    MIN(score) as min_score,
    MAX(score) as max_score
FROM reputation_scores
WHERE timestamp >= date('now', '-30 days')
GROUP BY person, date(timestamp)
ORDER BY date DESC;

CREATE VIEW IF NOT EXISTS source_performance AS
SELECT 
    source,
    COUNT(*) as total_records,
    AVG(score) as avg_score,
    AVG(sentiment_score) as avg_sentiment,
    MIN(timestamp) as first_record,
    MAX(timestamp) as latest_record
FROM reputation_scores
WHERE timestamp >= date('now', '-7 days')
GROUP BY source
ORDER BY total_records DESC;

-- Triggers for automatic timestamp updates
CREATE TRIGGER IF NOT EXISTS update_ai_models_timestamp 
    AFTER UPDATE ON ai_models
    FOR EACH ROW
    WHEN OLD.updated_at = NEW.updated_at
BEGIN
    UPDATE ai_models SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_data_sources_timestamp 
    AFTER UPDATE ON data_sources
    FOR EACH ROW
    WHEN OLD.updated_at = NEW.updated_at
BEGIN
    UPDATE data_sources SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Example queries for reference:

-- Get latest reputation scores for both persons
-- SELECT person, score, timestamp FROM latest_scores WHERE rank <= 10;

-- Compare average scores over last 7 days
-- SELECT person, AVG(avg_score) as weekly_avg FROM daily_averages 
-- WHERE date >= date('now', '-7 days') GROUP BY person;

-- Get trend data for charting
-- SELECT date, person, avg_score FROM daily_averages 
-- WHERE date >= date('now', '-14 days') ORDER BY date, person;

-- Source reliability analysis
-- SELECT * FROM source_performance;