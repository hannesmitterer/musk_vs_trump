/**
 * JavaScript for Musk vs Trump Reputation Tracker Dashboard
 * Handles data loading, chart rendering, and UI updates
 */

class ReputationDashboard {
    constructor() {
        this.dataEndpoint = './reputation_data.json';
        this.refreshEndpoint = '/api/reputation/refresh';
        this.currentData = null;
        this.isLoading = false;
        
        // Chart colors
        this.muskColor = '#00d4aa';
        this.trumpColor = '#dc3545';
        
        this.init();
    }
    
    async init() {
        this.bindEventListeners();
        await this.loadData();
        this.startAutoRefresh();
    }
    
    bindEventListeners() {
        const refreshBtn = document.getElementById('refreshBtn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.refreshData());
        }
    }
    
    showLoading() {
        this.isLoading = true;
        const overlay = document.getElementById('loadingOverlay');
        const refreshBtn = document.getElementById('refreshBtn');
        
        if (overlay) overlay.classList.add('show');
        if (refreshBtn) {
            refreshBtn.disabled = true;
            refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
        }
    }
    
    hideLoading() {
        this.isLoading = false;
        const overlay = document.getElementById('loadingOverlay');
        const refreshBtn = document.getElementById('refreshBtn');
        
        if (overlay) overlay.classList.remove('show');
        if (refreshBtn) {
            refreshBtn.disabled = false;
            refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Refresh Data';
        }
    }
    
    async loadData() {
        try {
            this.showLoading();
            
            // Try to load from JSON file first (for static deployment)
            let response;
            try {
                response = await fetch(this.dataEndpoint);
            } catch (error) {
                console.warn('JSON file not found, using mock data');
                response = null;
            }
            
            if (response && response.ok) {
                this.currentData = await response.json();
            } else {
                // Use mock data for demonstration
                this.currentData = this.generateMockData();
            }
            
            this.updateDashboard();
            
        } catch (error) {
            console.error('Error loading data:', error);
            this.showError('Failed to load reputation data');
        } finally {
            this.hideLoading();
        }
    }
    
    async refreshData() {
        if (this.isLoading) return;
        
        try {
            // In a real deployment, this would trigger the backend analysis
            await this.loadData();
        } catch (error) {
            console.error('Error refreshing data:', error);
            this.showError('Failed to refresh data');
        }
    }
    
    generateMockData() {
        const timestamp = new Date().toISOString();
        
        // Generate realistic mock reputation scores
        const muskScore = 72.5 + (Math.random() - 0.5) * 10;
        const trumpScore = 58.3 + (Math.random() - 0.5) * 12;
        
        return {
            timestamp: timestamp,
            musk_reputation: {
                timestamp: timestamp,
                subject: 'musk',
                overall_score: muskScore,
                sentiment_component: 68.2 + (Math.random() - 0.5) * 8,
                economic_component: 78.9 + (Math.random() - 0.5) * 6,
                social_component: 65.1 + (Math.random() - 0.5) * 10,
                trust_component: 77.8 + (Math.random() - 0.5) * 8,
                confidence_interval: [muskScore - 5.2, muskScore + 5.2]
            },
            trump_reputation: {
                timestamp: timestamp,
                subject: 'trump',
                overall_score: trumpScore,
                sentiment_component: 52.1 + (Math.random() - 0.5) * 10,
                economic_component: 61.7 + (Math.random() - 0.5) * 8,
                social_component: 55.9 + (Math.random() - 0.5) * 12,
                trust_component: 63.2 + (Math.random() - 0.5) * 9,
                confidence_interval: [trumpScore - 6.1, trumpScore + 6.1]
            },
            comparison_metrics: {
                reputation_difference: muskScore - trumpScore,
                sentiment_difference: 16.1,
                trust_difference: 14.6,
                leader: muskScore > trumpScore ? 'musk' : 'trump',
                confidence_gap: Math.abs(muskScore - trumpScore)
            },
            publish_urls: [
                'https://hannesmitterer.github.io/musk_vs_trump/',
                'https://api.openrank.com/publish/musk_trump_reputation'
            ],
            data_freshness: timestamp
        };
    }
    
    updateDashboard() {
        if (!this.currentData) return;
        
        const { musk_reputation, trump_reputation, comparison_metrics } = this.currentData;
        
        // Update score cards
        this.updateScoreCard('musk', musk_reputation);
        this.updateScoreCard('trump', trump_reputation);
        
        // Update comparison metrics
        this.updateComparison(comparison_metrics);
        
        // Update last updated timestamp
        this.updateTimestamp(this.currentData.timestamp);
        
        // Render charts
        this.renderCharts();
    }
    
    updateScoreCard(subject, reputation) {
        const prefix = subject === 'musk' ? 'musk' : 'trump';
        
        this.updateValue(`${prefix}Score`, reputation.overall_score.toFixed(1));
        this.updateValue(`${prefix}Sentiment`, reputation.sentiment_component.toFixed(1));
        this.updateValue(`${prefix}Economic`, reputation.economic_component.toFixed(1));
        this.updateValue(`${prefix}Social`, reputation.social_component.toFixed(1));
        this.updateValue(`${prefix}Trust`, reputation.trust_component.toFixed(1));
        
        const ciElement = document.getElementById(`${prefix}CI`);
        if (ciElement && reputation.confidence_interval) {
            ciElement.textContent = `${reputation.confidence_interval[0].toFixed(1)} - ${reputation.confidence_interval[1].toFixed(1)}`;
        }
    }
    
    updateComparison(metrics) {
        this.updateValue('currentLeader', metrics.leader.charAt(0).toUpperCase() + metrics.leader.slice(1));
        this.updateValue('scoreDifference', `${Math.abs(metrics.reputation_difference).toFixed(1)} points`);
        this.updateValue('sentimentGap', `${Math.abs(metrics.sentiment_difference).toFixed(1)} points`);
        this.updateValue('trustGap', `${Math.abs(metrics.trust_difference).toFixed(1)} points`);
    }
    
    updateValue(elementId, value) {
        const element = document.getElementById(elementId);
        if (element) {
            element.classList.add('updating');
            setTimeout(() => {
                element.textContent = value;
                element.classList.remove('updating');
            }, 250);
        }
    }
    
    updateTimestamp(timestamp) {
        const element = document.getElementById('lastUpdated');
        if (element) {
            const date = new Date(timestamp);
            element.textContent = date.toLocaleString();
        }
    }
    
    renderCharts() {
        this.renderTimeSeriesChart();
        this.renderComponentChart();
        this.renderScatterChart();
    }
    
    renderTimeSeriesChart() {
        // Generate historical data for demonstration
        const days = 30;
        const dates = [];
        const muskScores = [];
        const trumpScores = [];
        
        const currentMusk = this.currentData.musk_reputation.overall_score;
        const currentTrump = this.currentData.trump_reputation.overall_score;
        
        for (let i = days; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            dates.push(date.toISOString().split('T')[0]);
            
            // Generate trending data with some randomness
            const progress = (days - i) / days;
            muskScores.push(currentMusk - 10 + progress * 10 + (Math.random() - 0.5) * 5);
            trumpScores.push(currentTrump - 8 + progress * 8 + (Math.random() - 0.5) * 6);
        }
        
        const trace1 = {
            x: dates,
            y: muskScores,
            type: 'scatter',
            mode: 'lines+markers',
            name: 'Elon Musk',
            line: { color: this.muskColor, width: 3 },
            marker: { color: this.muskColor, size: 6 }
        };
        
        const trace2 = {
            x: dates,
            y: trumpScores,
            type: 'scatter',
            mode: 'lines+markers',
            name: 'Donald Trump',
            line: { color: this.trumpColor, width: 3 },
            marker: { color: this.trumpColor, size: 6 }
        };
        
        const layout = {
            title: {
                text: 'Reputation Scores Over Time',
                font: { size: 16, family: 'Segoe UI' }
            },
            xaxis: { title: 'Date' },
            yaxis: { title: 'Reputation Score', range: [0, 100] },
            hovermode: 'x unified',
            showlegend: true,
            legend: { x: 0.02, y: 0.98 },
            margin: { l: 50, r: 20, t: 60, b: 50 }
        };
        
        Plotly.newPlot('timeSeriesChart', [trace1, trace2], layout, { responsive: true });
    }
    
    renderComponentChart() {
        const { musk_reputation, trump_reputation } = this.currentData;
        
        const components = ['Sentiment', 'Economic', 'Social', 'Trust'];
        const muskValues = [
            musk_reputation.sentiment_component,
            musk_reputation.economic_component,
            musk_reputation.social_component,
            musk_reputation.trust_component
        ];
        const trumpValues = [
            trump_reputation.sentiment_component,
            trump_reputation.economic_component,
            trump_reputation.social_component,
            trump_reputation.trust_component
        ];
        
        const trace1 = {
            x: components,
            y: muskValues,
            type: 'bar',
            name: 'Elon Musk',
            marker: { color: this.muskColor }
        };
        
        const trace2 = {
            x: components,
            y: trumpValues,
            type: 'bar',
            name: 'Donald Trump',
            marker: { color: this.trumpColor }
        };
        
        const layout = {
            title: {
                text: 'Component Comparison',
                font: { size: 16, family: 'Segoe UI' }
            },
            xaxis: { title: 'Components' },
            yaxis: { title: 'Score', range: [0, 100] },
            barmode: 'group',
            showlegend: true,
            margin: { l: 50, r: 20, t: 60, b: 50 }
        };
        
        Plotly.newPlot('componentChart', [trace1, trace2], layout, { responsive: true });
    }
    
    renderScatterChart() {
        const { musk_reputation, trump_reputation } = this.currentData;
        
        const trace1 = {
            x: [musk_reputation.trust_component],
            y: [musk_reputation.sentiment_component],
            mode: 'markers',
            type: 'scatter',
            name: 'Elon Musk',
            marker: {
                color: this.muskColor,
                size: musk_reputation.overall_score / 2, // Size based on overall score
                sizemode: 'diameter',
                sizemin: 15,
                line: { color: 'white', width: 2 }
            },
            text: [`Musk (${musk_reputation.overall_score.toFixed(1)})`],
            hovertemplate: '<b>%{text}</b><br>Trust: %{x:.1f}<br>Sentiment: %{y:.1f}<extra></extra>'
        };
        
        const trace2 = {
            x: [trump_reputation.trust_component],
            y: [trump_reputation.sentiment_component],
            mode: 'markers',
            type: 'scatter',
            name: 'Donald Trump',
            marker: {
                color: this.trumpColor,
                size: trump_reputation.overall_score / 2,
                sizemode: 'diameter',
                sizemin: 15,
                line: { color: 'white', width: 2 }
            },
            text: [`Trump (${trump_reputation.overall_score.toFixed(1)})`],
            hovertemplate: '<b>%{text}</b><br>Trust: %{x:.1f}<br>Sentiment: %{y:.1f}<extra></extra>'
        };
        
        const layout = {
            title: {
                text: 'Trust vs Sentiment Analysis',
                font: { size: 16, family: 'Segoe UI' }
            },
            xaxis: { title: 'Trust Component', range: [0, 100] },
            yaxis: { title: 'Sentiment Component', range: [0, 100] },
            showlegend: true,
            margin: { l: 50, r: 20, t: 60, b: 50 },
            annotations: [{
                text: 'Bubble size represents<br>overall reputation score',
                x: 0.02,
                y: 0.98,
                xref: 'paper',
                yref: 'paper',
                showarrow: false,
                font: { size: 10 },
                bgcolor: 'rgba(255,255,255,0.8)',
                bordercolor: '#ccc',
                borderwidth: 1
            }]
        };
        
        Plotly.newPlot('scatterChart', [trace1, trace2], layout, { responsive: true });
    }
    
    startAutoRefresh() {
        // Refresh data every 5 minutes
        setInterval(() => {
            if (!this.isLoading) {
                this.loadData();
            }
        }, 5 * 60 * 1000);
    }
    
    showError(message) {
        console.error(message);
        // Could show a toast notification or error modal here
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-danger alert-dismissible fade show position-fixed';
        alertDiv.style.top = '20px';
        alertDiv.style.right = '20px';
        alertDiv.style.zIndex = '9999';
        alertDiv.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i> ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        document.body.appendChild(alertDiv);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.parentNode.removeChild(alertDiv);
            }
        }, 5000);
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.reputationDashboard = new ReputationDashboard();
});

// Handle window resize for responsive charts
window.addEventListener('resize', () => {
    if (window.reputationDashboard && !window.reputationDashboard.isLoading) {
        setTimeout(() => {
            Plotly.Plots.resize('timeSeriesChart');
            Plotly.Plots.resize('componentChart');
            Plotly.Plots.resize('scatterChart');
        }, 100);
    }
});