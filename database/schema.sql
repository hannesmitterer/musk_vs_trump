-- AI Reputation Tracker Database Schema
-- This file documents the database structure created by db_manager.py

-- Table for storing individual reputation data points
CREATE TABLE IF NOT EXISTS reputation_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    person TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    sentiment_score REAL,
    source TEXT,
    content TEXT
);

-- Table for storing daily summary statistics
CREATE TABLE IF NOT EXISTS summary_stats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    person TEXT NOT NULL,
    date DATE DEFAULT (date('now')),
    avg_sentiment REAL,
    total_mentions INTEGER
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_reputation_person ON reputation_data(person);
CREATE INDEX IF NOT EXISTS idx_reputation_timestamp ON reputation_data(timestamp);
CREATE INDEX IF NOT EXISTS idx_summary_person ON summary_stats(person);
CREATE INDEX IF NOT EXISTS idx_summary_date ON summary_stats(date);