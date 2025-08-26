// Chart.js configuration and initialization
let reputationChart;
let sentimentChart;

// Chart colors
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
    if (typeof Chart === 'undefined') {
        console.warn('Chart.js not available - skipping chart initialization');
        document.getElementById('reputationChart').innerHTML = '<div style="text-align: center; padding: 50px; color: #666;">Chart.js loading... Please refresh if charts don\'t appear.</div>';
        return;
    }
    
    const ctx = document.getElementById('reputationChart').getContext('2d');
    
    // Create gradients
    const muskGradient = ctx.createLinearGradient(0, 0, 0, 400);
    muskGradient.addColorStop(0, chartColors.musk.gradient[0]);
    muskGradient.addColorStop(1, chartColors.musk.gradient[1]);
    
    const trumpGradient = ctx.createLinearGradient(0, 0, 0, 400);
    trumpGradient.addColorStop(0, chartColors.trump.gradient[0]);
    trumpGradient.addColorStop(1, chartColors.trump.gradient[1]);
    
    reputationChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: mockData.reputationHistory.dates,
            datasets: [
                {
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
                },
                {
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
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                intersect: false,
                mode: 'index'
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        font: {
                            size: 14,
                            weight: '600'
                        },
                        padding: 20
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleFont: {
                        size: 14,
                        weight: '600'
                    },
                    bodyFont: {
                        size: 13
                    },
                    padding: 12,
                    cornerRadius: 8,
                    displayColors: true,
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.parsed.y.toFixed(1)}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Date',
                        font: {
                            size: 12,
                            weight: '600'
                        }
                    },
                    grid: {
                        display: false
                    },
                    ticks: {
                        maxTicksLimit: 8,
                        callback: function(value, index, ticks) {
                            const date = new Date(this.getLabelForValue(value));
                            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                        }
                    }
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Reputation Score',
                        font: {
                            size: 12,
                            weight: '600'
                        }
                    },
                    min: 0,
                    max: 100,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                }
            }
        }
    });
}

// Initialize sentiment analysis chart
function initSentimentChart() {
    if (typeof Chart === 'undefined') {
        console.warn('Chart.js not available - skipping sentiment chart initialization');
        document.getElementById('sentimentChart').innerHTML = '<div style="text-align: center; padding: 50px; color: #666;">Chart.js loading... Please refresh if charts don\'t appear.</div>';
        return;
    }
    
    const ctx = document.getElementById('sentimentChart').getContext('2d');
    
    sentimentChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Positive', 'Neutral', 'Negative'],
            datasets: [
                {
                    label: 'Elon Musk',
                    data: [
                        mockData.sentimentData.musk.positive,
                        mockData.sentimentData.musk.neutral,
                        mockData.sentimentData.musk.negative
                    ],
                    backgroundColor: [
                        '#10b981',
                        '#6b7280',
                        '#ef4444'
                    ],
                    borderColor: '#ffffff',
                    borderWidth: 3
                },
                {
                    label: 'Donald Trump',
                    data: [
                        mockData.sentimentData.trump.positive,
                        mockData.sentimentData.trump.neutral,
                        mockData.sentimentData.trump.negative
                    ],
                    backgroundColor: [
                        '#10b981',
                        '#6b7280',
                        '#ef4444'
                    ],
                    borderColor: '#ffffff',
                    borderWidth: 3
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        font: {
                            size: 14,
                            weight: '600'
                        },
                        padding: 20
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleFont: {
                        size: 14,
                        weight: '600'
                    },
                    bodyFont: {
                        size: 13
                    },
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            const dataset = context.dataset;
                            const total = dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((context.parsed / total) * 100).toFixed(1);
                            return `${context.label}: ${percentage}%`;
                        }
                    }
                }
            },
            cutout: '50%',
            elements: {
                arc: {
                    hoverBorderWidth: 4
                }
            }
        }
    });
}

// Update charts with new data
function updateCharts() {
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
        sentimentChart.data.datasets[1].data = [
            mockData.sentimentData.trump.positive,
            mockData.sentimentData.trump.neutral,
            mockData.sentimentData.trump.negative
        ];
        sentimentChart.update('none');
    }
}

// Initialize all charts
function initCharts() {
    initReputationChart();
    initSentimentChart();
}

// Export functions for external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initCharts, updateCharts };
}