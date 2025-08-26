// Main application logic
class ReputationTracker {
    constructor() {
        this.updateInterval = null;
        this.isOnline = true;
        this.init();
    }

    // Initialize the application
    async init() {
        this.updateStatus('Initializing dashboard...');
        
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initApp());
        } else {
            this.initApp();
        }
    }

    // Initialize app after DOM is ready
    initApp() {
        try {
            // Initialize charts
            initCharts();
            
            // Update metrics display
            this.updateMetricsDisplay();
            
            // Set up real-time updates
            this.startRealTimeUpdates();
            
            // Set up event listeners
            this.setupEventListeners();
            
            // Update status
            this.updateStatus('Live data feed active');
            this.setOnlineStatus(true);
            
            console.log('Reputation Tracker initialized successfully');
        } catch (error) {
            console.error('Error initializing app:', error);
            this.updateStatus('Error loading dashboard');
            this.setOnlineStatus(false);
        }
    }

    // Update the metrics display
    updateMetricsDisplay() {
        const { musk, trump } = mockData.currentMetrics;
        
        // Update Musk metrics
        this.updateElement('muskScore', musk.score.toFixed(1));
        this.updateElement('muskChange', this.formatChange(musk.change));
        this.updateElement('muskSentiment', musk.sentiment);
        this.updateElement('muskVolume', musk.volume);
        
        // Update Trump metrics
        this.updateElement('trumpScore', trump.score.toFixed(1));
        this.updateElement('trumpChange', this.formatChange(trump.change));
        this.updateElement('trumpSentiment', trump.sentiment);
        this.updateElement('trumpVolume', trump.volume);
        
        // Update last updated timestamp
        this.updateElement('lastUpdated', mockData.lastUpdated);
        
        // Update change indicators
        this.updateChangeIndicator('muskChange', musk.change);
        this.updateChangeIndicator('trumpChange', trump.change);
    }

    // Format score change with appropriate sign
    formatChange(change) {
        const sign = change >= 0 ? '+' : '';
        return `${sign}${change.toFixed(1)}`;
    }

    // Update change indicator styling
    updateChangeIndicator(elementId, change) {
        const element = document.getElementById(elementId);
        if (element) {
            element.className = 'score-change ' + (change >= 0 ? 'positive' : 'negative');
        }
    }

    // Helper method to update element content
    updateElement(id, content) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = content;
        }
    }

    // Start real-time updates
    startRealTimeUpdates() {
        // Update every 30 seconds
        this.updateInterval = setInterval(() => {
            this.performUpdate();
        }, 30000);
        
        console.log('Real-time updates started (30s interval)');
    }

    // Perform data update
    async performUpdate() {
        try {
            // Simulate API call delay
            await this.sleep(200);
            
            // Update mock data
            updateMockData();
            
            // Update UI
            this.updateMetricsDisplay();
            updateCharts();
            
            this.setOnlineStatus(true);
            console.log('Data updated at:', new Date().toLocaleTimeString());
            
        } catch (error) {
            console.error('Update failed:', error);
            this.setOnlineStatus(false);
        }
    }

    // Update status indicator
    updateStatus(message) {
        const statusElement = document.getElementById('statusText');
        if (statusElement) {
            statusElement.textContent = message;
        }
    }

    // Set online/offline status
    setOnlineStatus(isOnline) {
        this.isOnline = isOnline;
        const statusDot = document.getElementById('statusDot');
        const statusText = document.getElementById('statusText');
        
        if (statusDot) {
            statusDot.style.background = isOnline ? '#4ade80' : '#ef4444';
        }
        
        if (statusText && isOnline) {
            statusText.textContent = 'Live data feed active';
        } else if (statusText) {
            statusText.textContent = 'Connection error';
        }
    }

    // Setup event listeners
    setupEventListeners() {
        // Handle page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseUpdates();
            } else {
                this.resumeUpdates();
            }
        });

        // Handle online/offline events
        window.addEventListener('online', () => {
            this.setOnlineStatus(true);
            this.resumeUpdates();
        });

        window.addEventListener('offline', () => {
            this.setOnlineStatus(false);
            this.pauseUpdates();
        });

        // Handle window resize for charts
        window.addEventListener('resize', () => {
            if (reputationChart) reputationChart.resize();
            if (window.reputationChart) window.reputationChart.resize();
            if (window.sentimentChart) window.sentimentChart.resize();
        });

        console.log('Event listeners set up');
    }

    // Pause updates when page is not visible
    pauseUpdates() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
            console.log('Updates paused');
        }
    }

    // Resume updates when page becomes visible
    resumeUpdates() {
        if (!this.updateInterval) {
            this.startRealTimeUpdates();
            this.performUpdate(); // Immediate update
            console.log('Updates resumed');
        }
    }

    // Utility function to simulate async delays
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Clean up when page unloads
    cleanup() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
    }
}

// Initialize app when page loads
let app;

// Start the application
document.addEventListener('DOMContentLoaded', () => {
    app = new ReputationTracker();
app = new ReputationTracker();

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (app) {
        app.cleanup();
    }
});

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ReputationTracker;
}