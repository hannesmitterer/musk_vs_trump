/**
 * Main Application Component
 * Manages the overall application state and orchestrates data fetching and display
 */
class App {
    constructor() {
        this.graph = null;
        this.data = null;
        this.updateInterval = null;
        this.apiUrl = 'http://localhost:5000/api/reputation';
    }

    /**
     * Initialize the application
     */
    async init() {
        console.log('🚀 Initializing Musk vs Trump Reputation Tracker...');
        
        try {
            // Initialize the 3D graph
            this.graph = new ReputationGraph('canvas-container');
            
            // Load initial data
            await this.loadData();
            
            // Start periodic updates
            this.startPeriodicUpdates();
            
            console.log('✅ Application initialized successfully');
        } catch (error) {
            console.error('❌ Error initializing application:', error);
            this.showError();
        }
    }

    /**
     * Load reputation data from the backend API
     */
    async loadData() {
        try {
            const response = await fetch(this.apiUrl);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.status !== 'success') {
                throw new Error('API returned error status');
            }

            this.data = data;
            this.updateDisplay();
            
        } catch (error) {
            console.error('Error loading data:', error);
            // Try to use mock data for development
            this.loadMockData();
        }
    }

    /**
     * Load mock data for development/testing
     */
    loadMockData() {
        console.log('📊 Using mock data for development');
        this.data = {
            timestamp: Date.now(),
            data: {
                musk: {
                    name: "Elon Musk",
                    score: 75.3,
                    trend: "up",
                    change: 2.1,
                    color: "#1DA1F2"
                },
                trump: {
                    name: "Donald Trump", 
                    score: 68.7,
                    trend: "down",
                    change: 1.4,
                    color: "#FF4444"
                }
            },
            status: "success",
            message: "Mock data loaded successfully"
        };
        
        this.updateDisplay();
    }

    /**
     * Update the display with current data
     */
    updateDisplay() {
        if (!this.data) return;

        // Hide loading, show content
        document.getElementById('loading').style.display = 'none';
        document.getElementById('error').style.display = 'none';
        document.getElementById('scores').style.display = 'flex';

        // Update score cards
        this.updateScoreCards();
        
        // Update 3D graph
        if (this.graph) {
            this.graph.updateData(this.data.data);
        }
    }

    /**
     * Update the score cards in the UI
     */
    updateScoreCards() {
        const scoresContainer = document.getElementById('scores');
        const { musk, trump } = this.data.data;
        
        scoresContainer.innerHTML = `
            <div class="score-card" style="border-left: 4px solid ${musk.color}">
                <h3>${musk.name}</h3>
                <div class="score-value">${musk.score}%</div>
                <div class="score-trend ${musk.trend === 'up' ? 'trend-up' : 'trend-down'}">
                    ${musk.trend === 'up' ? '↗' : '↘'} ${musk.change}%
                </div>
            </div>
            <div class="score-card" style="border-left: 4px solid ${trump.color}">
                <h3>${trump.name}</h3>
                <div class="score-value">${trump.score}%</div>
                <div class="score-trend ${trump.trend === 'up' ? 'trend-up' : 'trend-down'}">
                    ${trump.trend === 'up' ? '↗' : '↘'} ${trump.change}%
                </div>
            </div>
        `;
    }

    /**
     * Start periodic data updates
     */
    startPeriodicUpdates() {
        // Update every 10 seconds
        this.updateInterval = setInterval(() => {
            this.loadData();
        }, 10000);
    }

    /**
     * Show error message
     */
    showError() {
        document.getElementById('loading').style.display = 'none';
        document.getElementById('scores').style.display = 'none';
        document.getElementById('error').style.display = 'flex';
    }

    /**
     * Clean up resources
     */
    destroy() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        
        if (this.graph) {
            this.graph.destroy();
        }
    }
}

// Make App available globally
window.App = App;