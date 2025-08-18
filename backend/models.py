import sqlite3
from db_manager import get_connection

class ReputationModel:
    """Model for handling reputation data"""
    
    def __init__(self):
        self.conn = get_connection()
    
    def add_reputation_data(self, person, sentiment_score, source, content):
        """Add new reputation data entry"""
        cursor = self.conn.cursor()
        cursor.execute('''
            INSERT INTO reputation_data (person, sentiment_score, source, content)
            VALUES (?, ?, ?, ?)
        ''', (person, sentiment_score, source, content))
        self.conn.commit()
        return cursor.lastrowid
    
    def get_reputation_data(self, person, limit=100):
        """Get reputation data for a person"""
        cursor = self.conn.cursor()
        cursor.execute('''
            SELECT * FROM reputation_data 
            WHERE person = ? 
            ORDER BY timestamp DESC 
            LIMIT ?
        ''', (person, limit))
        return cursor.fetchall()
    
    def update_summary_stats(self, person, avg_sentiment, total_mentions):
        """Update or insert summary statistics"""
        cursor = self.conn.cursor()
        cursor.execute('''
            INSERT OR REPLACE INTO summary_stats 
            (person, avg_sentiment, total_mentions) 
            VALUES (?, ?, ?)
        ''', (person, avg_sentiment, total_mentions))
        self.conn.commit()
    
    def close(self):
        """Close database connection"""
        if self.conn:
            self.conn.close()