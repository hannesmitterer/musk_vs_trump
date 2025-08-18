-- SQL Schema for Musk vs Trump Reputation Tracker Database
-- This schema supports the storage of reputation data, sentiment analysis, and trust scores

-- Create database
CREATE DATABASE IF NOT EXISTS reputation_tracker;
USE reputation_tracker;

-- Data sources enumeration table
CREATE TABLE data_sources (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    api_endpoint VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert data sources
INSERT INTO data_sources (name, description) VALUES 
('FRED', 'Federal Reserve Economic Data'),
('YCharts', 'Financial market data'),
('Michigan Sentiment', 'University of Michigan Consumer Sentiment'),
('Our World in Data', 'Global development and social indicators'),
('Census', 'US Census demographic and economic data'),
('OpenRank', 'Trust and reputation network data'),
('Social Media', 'Social media sentiment analysis'),
('News', 'News article sentiment analysis');

-- Subjects being tracked
CREATE TABLE subjects (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    full_name VARCHAR(100),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert subjects
INSERT INTO subjects (name, full_name, description) VALUES 
('musk', 'Elon Musk', 'CEO of Tesla and SpaceX'),
('trump', 'Donald Trump', 'Former US President');

-- Raw data points from various sources
CREATE TABLE data_points (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    timestamp DATETIME NOT NULL,
    source_id INT NOT NULL,
    subject_id INT NOT NULL,
    value DECIMAL(10,4) NOT NULL,
    confidence DECIMAL(5,4),
    metadata JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (source_id) REFERENCES data_sources(id),
    FOREIGN KEY (subject_id) REFERENCES subjects(id),
    INDEX idx_timestamp_source (timestamp, source_id),
    INDEX idx_subject_timestamp (subject_id, timestamp)
);

-- Sentiment analysis results
CREATE TABLE sentiment_scores (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    timestamp DATETIME NOT NULL,
    subject_id INT NOT NULL,
    sentiment DECIMAL(5,4) NOT NULL, -- -1.0 to 1.0
    confidence DECIMAL(5,4) NOT NULL, -- 0.0 to 1.0
    source_text TEXT,
    source_type VARCHAR(50), -- 'news', 'social', etc.
    model_version VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (subject_id) REFERENCES subjects(id),
    INDEX idx_subject_timestamp (subject_id, timestamp),
    INDEX idx_sentiment_confidence (sentiment, confidence)
);

-- Trust scores from EigenTrust algorithm
CREATE TABLE trust_scores (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    timestamp DATETIME NOT NULL,
    subject_id INT NOT NULL,
    trust_score DECIMAL(8,6) NOT NULL, -- 0.0 to 1.0
    eigentrust_value DECIMAL(8,6),
    local_trust DECIMAL(8,6),
    pre_trust DECIMAL(8,6),
    algorithm_version VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (subject_id) REFERENCES subjects(id),
    INDEX idx_subject_timestamp (subject_id, timestamp)
);

-- Comprehensive reputation scores
CREATE TABLE reputation_scores (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    timestamp DATETIME NOT NULL,
    subject_id INT NOT NULL,
    overall_score DECIMAL(6,3) NOT NULL, -- 0.0 to 100.0
    sentiment_component DECIMAL(6,3),
    economic_component DECIMAL(6,3),
    social_component DECIMAL(6,3),
    trust_component DECIMAL(6,3),
    confidence_low DECIMAL(6,3),
    confidence_high DECIMAL(6,3),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (subject_id) REFERENCES subjects(id),
    INDEX idx_subject_timestamp (subject_id, timestamp),
    INDEX idx_overall_score (overall_score)
);

-- Published results for API consumption
CREATE TABLE published_results (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    timestamp DATETIME NOT NULL,
    musk_score DECIMAL(6,3),
    trump_score DECIMAL(6,3),
    reputation_difference DECIMAL(7,3),
    sentiment_difference DECIMAL(7,3),
    trust_difference DECIMAL(7,3),
    leader VARCHAR(10),
    confidence_gap DECIMAL(6,3),
    publish_urls JSON,
    data_freshness DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_timestamp (timestamp)
);

-- API access logs
CREATE TABLE api_logs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    endpoint VARCHAR(255),
    method VARCHAR(10),
    ip_address VARCHAR(45),
    user_agent TEXT,
    response_status INT,
    response_time_ms INT,
    timestamp DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_timestamp (timestamp),
    INDEX idx_endpoint (endpoint)
);

-- Data collection status and health checks
CREATE TABLE collection_status (
    id INT PRIMARY KEY AUTO_INCREMENT,
    source_id INT NOT NULL,
    last_successful_collection DATETIME,
    last_attempt DATETIME,
    status VARCHAR(20) DEFAULT 'pending', -- 'success', 'failed', 'pending'
    error_message TEXT,
    data_points_collected INT DEFAULT 0,
    next_scheduled_run DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (source_id) REFERENCES data_sources(id),
    UNIQUE KEY unique_source (source_id)
);

-- Initialize collection status for all sources
INSERT INTO collection_status (source_id, status) 
SELECT id, 'pending' FROM data_sources;

-- System configuration table
CREATE TABLE system_config (
    config_key VARCHAR(100) PRIMARY KEY,
    config_value TEXT,
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default configuration
INSERT INTO system_config (config_key, config_value, description) VALUES
('sentiment_weight', '0.25', 'Weight for sentiment component in reputation score'),
('economic_weight', '0.30', 'Weight for economic component in reputation score'),
('social_weight', '0.20', 'Weight for social component in reputation score'),
('trust_weight', '0.25', 'Weight for trust component in reputation score'),
('cache_duration_hours', '1', 'Cache duration for data collection in hours'),
('eigentrust_damping_factor', '0.85', 'Damping factor for EigenTrust algorithm'),
('eigentrust_max_iterations', '100', 'Maximum iterations for EigenTrust convergence'),
('refresh_interval_minutes', '30', 'Auto-refresh interval for dashboard in minutes');

-- Views for easier data access

-- Latest reputation scores for each subject
CREATE VIEW latest_reputation AS
SELECT 
    s.name as subject,
    s.full_name,
    rs.timestamp,
    rs.overall_score,
    rs.sentiment_component,
    rs.economic_component,
    rs.social_component,
    rs.trust_component,
    rs.confidence_low,
    rs.confidence_high
FROM reputation_scores rs
JOIN subjects s ON rs.subject_id = s.id
WHERE rs.id IN (
    SELECT MAX(id) 
    FROM reputation_scores 
    GROUP BY subject_id
);

-- Average sentiment by subject over last 24 hours
CREATE VIEW recent_sentiment AS
SELECT 
    s.name as subject,
    AVG(ss.sentiment) as avg_sentiment,
    AVG(ss.confidence) as avg_confidence,
    COUNT(*) as sample_count
FROM sentiment_scores ss
JOIN subjects s ON ss.subject_id = s.id
WHERE ss.timestamp >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
GROUP BY ss.subject_id, s.name;

-- Data collection health status
CREATE VIEW collection_health AS
SELECT 
    ds.name as source_name,
    cs.status,
    cs.last_successful_collection,
    cs.last_attempt,
    cs.data_points_collected,
    TIMESTAMPDIFF(MINUTE, cs.last_successful_collection, NOW()) as minutes_since_last_success,
    cs.error_message
FROM collection_status cs
JOIN data_sources ds ON cs.source_id = ds.id
ORDER BY cs.last_successful_collection DESC;

-- Reputation trends over time (daily aggregates)
CREATE VIEW reputation_trends AS
SELECT 
    s.name as subject,
    DATE(rs.timestamp) as date,
    AVG(rs.overall_score) as avg_score,
    MIN(rs.overall_score) as min_score,
    MAX(rs.overall_score) as max_score,
    COUNT(*) as sample_count
FROM reputation_scores rs
JOIN subjects s ON rs.subject_id = s.id
GROUP BY rs.subject_id, s.name, DATE(rs.timestamp)
ORDER BY date DESC, s.name;

-- Stored procedures for common operations

DELIMITER //

-- Get latest comparison between subjects
CREATE PROCEDURE GetLatestComparison()
BEGIN
    SELECT 
        musk.overall_score as musk_score,
        trump.overall_score as trump_score,
        (musk.overall_score - trump.overall_score) as score_difference,
        CASE 
            WHEN musk.overall_score > trump.overall_score THEN 'musk'
            ELSE 'trump'
        END as leader,
        musk.timestamp as last_updated
    FROM 
        (SELECT * FROM latest_reputation WHERE subject = 'musk') musk,
        (SELECT * FROM latest_reputation WHERE subject = 'trump') trump;
END //

-- Insert new reputation score
CREATE PROCEDURE InsertReputationScore(
    IN p_subject_name VARCHAR(50),
    IN p_timestamp DATETIME,
    IN p_overall_score DECIMAL(6,3),
    IN p_sentiment_component DECIMAL(6,3),
    IN p_economic_component DECIMAL(6,3),
    IN p_social_component DECIMAL(6,3),
    IN p_trust_component DECIMAL(6,3),
    IN p_confidence_low DECIMAL(6,3),
    IN p_confidence_high DECIMAL(6,3)
)
BEGIN
    DECLARE subject_id INT;
    
    SELECT id INTO subject_id FROM subjects WHERE name = p_subject_name;
    
    IF subject_id IS NOT NULL THEN
        INSERT INTO reputation_scores (
            timestamp, subject_id, overall_score, 
            sentiment_component, economic_component, 
            social_component, trust_component,
            confidence_low, confidence_high
        ) VALUES (
            p_timestamp, subject_id, p_overall_score,
            p_sentiment_component, p_economic_component,
            p_social_component, p_trust_component,
            p_confidence_low, p_confidence_high
        );
    END IF;
END //

-- Clean old data (keep last 90 days)
CREATE PROCEDURE CleanOldData()
BEGIN
    DECLARE cutoff_date DATETIME;
    SET cutoff_date = DATE_SUB(NOW(), INTERVAL 90 DAY);
    
    -- Clean old data points (keep last 90 days)
    DELETE FROM data_points WHERE timestamp < cutoff_date;
    DELETE FROM sentiment_scores WHERE timestamp < cutoff_date;
    DELETE FROM trust_scores WHERE timestamp < cutoff_date;
    DELETE FROM reputation_scores WHERE timestamp < cutoff_date;
    DELETE FROM api_logs WHERE timestamp < cutoff_date;
    
    -- Keep only last 30 days of published results
    DELETE FROM published_results 
    WHERE timestamp < DATE_SUB(NOW(), INTERVAL 30 DAY);
    
    SELECT 'Data cleanup completed' as status;
END //

DELIMITER ;

-- Create indexes for performance
CREATE INDEX idx_data_points_composite ON data_points(subject_id, source_id, timestamp);
CREATE INDEX idx_sentiment_composite ON sentiment_scores(subject_id, timestamp, confidence);
CREATE INDEX idx_reputation_composite ON reputation_scores(subject_id, timestamp, overall_score);

-- Create user for application access
CREATE USER IF NOT EXISTS 'reputation_app'@'%' IDENTIFIED BY 'secure_password_here';
GRANT SELECT, INSERT, UPDATE ON reputation_tracker.* TO 'reputation_app'@'%';
GRANT EXECUTE ON PROCEDURE reputation_tracker.GetLatestComparison TO 'reputation_app'@'%';
GRANT EXECUTE ON PROCEDURE reputation_tracker.InsertReputationScore TO 'reputation_app'@'%';

-- Create read-only user for dashboard access
CREATE USER IF NOT EXISTS 'reputation_readonly'@'%' IDENTIFIED BY 'readonly_password_here';
GRANT SELECT ON reputation_tracker.* TO 'reputation_readonly'@'%';

FLUSH PRIVILEGES;