import sqlite3
import os
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

DATABASE_PATH = os.path.join(os.path.dirname(__file__), '..', 'database', 'reputation.db')

def create_tables():
    """
    Initialize the database by creating necessary tables.
    This function is called during the automated setup process.
    """
    try:
        # Ensure database directory exists
        db_dir = os.path.dirname(DATABASE_PATH)
        if not os.path.exists(db_dir):
            os.makedirs(db_dir)
            logger.info(f"Created database directory: {db_dir}")
        
        conn = sqlite3.connect(DATABASE_PATH)
        cursor = conn.cursor()
        
        # Create reputation_data table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS reputation_data (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                person TEXT NOT NULL,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                sentiment_score REAL,
                source TEXT,
                content TEXT
            )
        ''')
        
        # Create summary_stats table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS summary_stats (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                person TEXT NOT NULL,
                date DATE DEFAULT (date('now')),
                avg_sentiment REAL,
                total_mentions INTEGER
            )
        ''')
        
        conn.commit()
        conn.close()
        
        logger.info("Database tables created successfully")
        print("✓ Database initialized successfully")
        return True
        
    except Exception as e:
        logger.error(f"Error creating database tables: {str(e)}")
        print(f"✗ Database initialization failed: {str(e)}")
        return False

def get_connection():
    """Get database connection"""
    return sqlite3.connect(DATABASE_PATH)

if __name__ == "__main__":
    create_tables()