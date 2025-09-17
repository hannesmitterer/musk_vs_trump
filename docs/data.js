// Mock data for Musk vs Trump reputation tracking
// This data represents what would come from the backend API

// Generate dates for the specified number of days
function generateDates(days = 90) {
    const dates = [];
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
}

// Generate realistic reputation scores with some volatility and trends
function generateReputationScores(baseScore, volatility = 5, days = 90, trendDirection = 0) {
    const scores = [];
    let currentScore = baseScore + (Math.random() - 0.5) * 10; // Start with some variation
    
    for (let i = 0; i < days; i++) {
        // Add some random walk with mean reversion
        const change = (Math.random() - 0.5) * volatility;
        const meanReversion = (baseScore - currentScore) * 0.05;
        const trend = trendDirection * (i / days) * 2; // Gradual trend over time
        
        currentScore += change + meanReversion + trend;
        
        // Keep scores within reasonable bounds
        currentScore = Math.max(0, Math.min(100, currentScore));
        scores.push(Math.round(currentScore * 10) / 10);
    }
    
    return scores;
}

// Mock data structure
const mockData = {
    // Current metrics
    currentMetrics: {
        musk: {
            score: 72.3,
            change: +2.1,
            sentiment: "Positive",
            volume: "14.2K mentions"
        },
        trump: {
            score: 65.8,
            change: -1.4,
            sentiment: "Mixed",
            volume: "18.7K mentions"
        }
    },
    
    // Historical reputation data (3 months)
    reputationHistory: {
        dates: generateDates(90),
        musk: generateReputationScores(72, 8, 90, 1), // Slight upward trend
        trump: generateReputationScores(66, 10, 90, -0.5) // Slight downward trend
    },
    
    // Sentiment breakdown data
    sentimentData: {
        musk: {
            positive: 45.2,
            neutral: 32.1,
            negative: 22.7
        },
        trump: {
            positive: 38.4,
            neutral: 29.8,
            negative: 31.8
        }
    },
    
    // Additional metrics for potential future use
    additionalMetrics: {
        totalMentions: 32900,
        trendingTopics: [
            { topic: "SpaceX Launch", sentiment: "positive", mentions: 4200 },
            { topic: "Tesla Stock", sentiment: "mixed", mentions: 3100 },
            { topic: "Twitter Changes", sentiment: "negative", mentions: 2800 },
            { topic: "Legal Issues", sentiment: "negative", mentions: 5400 },
            { topic: "Campaign Rally", sentiment: "mixed", mentions: 4100 }
        ],
        comparisonMetrics: {
            mediaPresence: { musk: 68, trump: 85 },
            publicApproval: { musk: 54, trump: 47 },
            controversyIndex: { musk: 32, trump: 78 }
        }
    },
    
    lastUpdated: new Date().toLocaleString()
};

// Simulate real-time updates
function updateMockData() {
    const now = new Date();
    
    // Update current scores with small random changes
    mockData.currentMetrics.musk.score += (Math.random() - 0.5) * 0.5;
    mockData.currentMetrics.trump.score += (Math.random() - 0.5) * 0.5;
    
    // Keep scores in bounds
    mockData.currentMetrics.musk.score = Math.max(0, Math.min(100, mockData.currentMetrics.musk.score));
    mockData.currentMetrics.trump.score = Math.max(0, Math.min(100, mockData.currentMetrics.trump.score));
    
    // Round to one decimal
    mockData.currentMetrics.musk.score = Math.round(mockData.currentMetrics.musk.score * 10) / 10;
    mockData.currentMetrics.trump.score = Math.round(mockData.currentMetrics.trump.score * 10) / 10;
    
    // Update mention volumes with realistic fluctuation
    const muskBase = 14200;
    const trumpBase = 18700;
    
    const muskVolume = muskBase + Math.floor((Math.random() - 0.5) * 2000);
    const trumpVolume = trumpBase + Math.floor((Math.random() - 0.5) * 3000);
    
    mockData.currentMetrics.musk.volume = `${(muskVolume / 1000).toFixed(1)}K mentions`;
    mockData.currentMetrics.trump.volume = `${(trumpVolume / 1000).toFixed(1)}K mentions`;
    
    // Update timestamp
    mockData.lastUpdated = now.toLocaleString();
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { mockData, updateMockData };
}