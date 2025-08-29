// Mock data for the dashboard
const mockData = {
    currentMetrics: {
        musk: {
            score: 72.8,
            change: 1.5,
            sentiment: 'Positive',
            volume: '12.5K'
        },
        trump: {
            score: 68.2,
            change: -0.8,
            sentiment: 'Mixed',
            volume: '18.2K'
        }
    },
    reputationHistory: {
        dates: ['Jan 1', 'Jan 8', 'Jan 15', 'Jan 22', 'Jan 29', 'Feb 5', 'Feb 12', 'Feb 19', 'Feb 26', 'Mar 5'],
        musk: [70.2, 71.8, 69.5, 73.1, 72.4, 74.2, 71.9, 72.8, 73.5, 72.8],
        trump: [65.8, 67.2, 66.1, 68.9, 67.5, 69.1, 68.3, 67.8, 69.2, 68.2]
    },
    sentimentData: {
        musk: { positive: 45, neutral: 35, negative: 20 },
        trump: { positive: 35, neutral: 30, negative: 35 }
    },
    lastUpdated: new Date().toLocaleString()
};

// Chart.js configuration and initialization
let reputationChart;
let sentimentChart;

const chartColors = {
    musk: {
        primary: '#3b82f6',
        light: 'rgba(59, 130, 246, 0.2)',
        gradient: ['rgba(59, 130, 246, 0.8)', 'rgba(59, 130, 246, 0.2)']
    },
    trump: {
        primary: '#ef4444',
        light: 'rgba(239, 68, 68, 0.2)',
        gradient: ['rgba(239, 68, 68, 0.8)', 'rgba(239, 68, 68, 0.2)']
    }
};

// Initialize reputation timeline chart
function initReputationChart() {
    const ctx = document.getElementById('reputationChart');
    if (!ctx) return;

    const gradient = ctx.getContext('2d');
    const muskGradient = gradient.createLinearGradient(0, 0, 0, 400);
    muskGradient.addColorStop(0, chartColors.musk.gradient[0]);
    muskGradient.addColorStop(1, chartColors.musk.gradient[1]);

    const trumpGradient = gradient.createLinearGradient(0, 0, 0, 400);
    trumpGradient.addColorStop(0, chartColors.trump.gradient[0]);
    trumpGradient.addColorStop(1, chartColors.trump.gradient[1]);

    reputationChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: mockData.reputationHistory.dates,
            datasets: [{
                label: 'Elon Musk',
                data: mockData.reputationHistory.musk,
                borderColor: chartColors.musk.primary,
                backgroundColor: muskGradient,
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: chartColors.musk.primary,
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6
            }, {
                label: 'Donald Trump',
                data: mockData.reputationHistory.trump,
                borderColor: chartColors.trump.primary,
                backgroundColor: trumpGradient,
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: chartColors.trump.primary,
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    labels: { color: '#ffffff', font: { size: 14 } }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderWidth: 1
                }
            },
            scales: {
                x: {
                    ticks: { color: '#ffffff' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                },
                y: {
                    ticks: { color: '#ffffff' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    beginAtZero: false,
                    min: 60,
                    max: 80
                }
            },
            interaction: { intersect: false },
            animation: { duration: 1000, easing: 'easeOutQuart' }
        }
    });
}

// Initialize sentiment analysis chart
function initSentimentChart() {
    const ctx = document.getElementById('sentimentChart');
    if (!ctx) return;

    sentimentChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Positive', 'Neutral', 'Negative'],
            datasets: [{
                label: 'Elon Musk',
                data: [mockData.sentimentData.musk.positive, mockData.sentimentData.musk.neutral, mockData.sentimentData.musk.negative],
                backgroundColor: ['#10b981', '#6b7280', '#ef4444'],
                borderWidth: 0,
                cutout: '60%'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: { color: '#ffffff', font: { size: 12 } }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff'
                }
            },
            animation: { duration: 1000, easing: 'easeOutQuart' }
        }
    });
}

// Main application logic
class App {
    constructor() {
        this.updateInterval = null;
        this.isOnline = true;
        this.apiUrl = '/api/reputation'; // Use server API endpoint
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
            this.initCharts();
            
            // Load initial data
            this.loadData();
            
            // Update metrics display
            this.updateMetricsDisplay();
            
            // Set up real-time updates
            this.startRealTimeUpdates();
            
            // Set up event listeners
            this.setupEventListeners();
            
            // Update status
            this.updateStatus('Live data feed active');
            this.setOnlineStatus(true);
            
            console.log('App initialized successfully');
        } catch (error) {
            console.error('Error initializing app:', error);
            this.updateStatus('Error loading dashboard');
            this.setOnlineStatus(false);
        }
    }

    // Initialize charts
    initCharts() {
        initReputationChart();
        initSentimentChart();
    }

    // Load data from API or use mock data
    async loadData() {
        try {
            const response = await fetch(this.apiUrl);
            if (response.ok) {
                const apiData = await response.json();
                if (apiData.status === 'success') {
                    this.updateDataFromAPI(apiData);
                    console.log('API data loaded successfully');
                    return;
                }
            }
        } catch (error) {
            console.log('API not available, using mock data:', error.message);
        }
        
        // Use mock data as fallback
        this.updateMetricsDisplay();
        this.updateCharts();
    }

    // Update data from API response
    updateDataFromAPI(apiData) {
        // Update current metrics from API
        mockData.currentMetrics.musk.score = apiData.data.musk.score;
        mockData.currentMetrics.musk.change = apiData.data.musk.change;
        mockData.currentMetrics.trump.score = apiData.data.trump.score;
        mockData.currentMetrics.trump.change = apiData.data.trump.change;
        mockData.lastUpdated = new Date().toLocaleString();

        // Update display
        this.updateMetricsDisplay();
        this.updateCharts();
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

    // Update charts with current data
    updateCharts() {
        if (reputationChart) {
            reputationChart.data.datasets[0].data = mockData.reputationHistory.musk;
            reputationChart.data.datasets[1].data = mockData.reputationHistory.trump;
            reputationChart.update('none');
        }
        
        if (sentimentChart) {
            sentimentChart.data.datasets[0].data = [
                mockData.sentimentData.musk.positive,
                mockData.sentimentData.musk.neutral,
                mockData.sentimentData.musk.negative
            ];
            sentimentChart.update('none');
        }
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
            this.loadData();
        }, 30000);
    }

    // Update status indicator
    updateStatus(message) {
        const statusText = document.getElementById('statusText');
        if (statusText) {
            statusText.textContent = message;
        }
    }

    // Set online/offline status
    setOnlineStatus(isOnline) {
        this.isOnline = isOnline;
        const statusDot = document.getElementById('statusDot');
        if (statusDot) {
            statusDot.className = 'status-dot ' + (isOnline ? 'online' : 'offline');
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
            if (sentimentChart) sentimentChart.resize();
        });

        console.log('Event listeners set up');
    }

    // Pause updates when page is not visible
    pauseUpdates() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }

    // Resume updates when page becomes visible
    resumeUpdates() {
        if (!this.updateInterval) {
            this.startRealTimeUpdates();
        }
    }

    // Clean up resources
    destroy() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        if (reputationChart) reputationChart.destroy();
        if (sentimentChart) sentimentChart.destroy();
    }
}

// Initialize app when loaded
const app = new App();

// Make App available globally
window.App = App;