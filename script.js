// Musk vs Trump - AI Reputation Tracker
// Static JavaScript implementation for GitHub Pages

class ReputationTracker {
    constructor() {
        this.votes = this.loadVotes();
        this.init();
    }

    init() {
        this.setupMobileDetection();
        this.updateVoteDisplay();
        this.setupEventListeners();
        console.log('🚀 Musk vs Trump Reputation Tracker loaded');
    }

    // Mobile detection and deploy banner
    setupMobileDetection() {
        const isMobile = /Mobi|Android/i.test(navigator.userAgent);
        const deployBanner = document.getElementById('mobile-deploy-banner');
        
        if (isMobile && deployBanner) {
            deployBanner.classList.remove('hidden');
        }
    }

    // Load votes from localStorage
    loadVotes() {
        const stored = localStorage.getItem('muskVsTrumpVotes');
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                console.warn('Failed to parse stored votes:', e);
            }
        }
        
        return {
            musk: 0,
            trump: 0,
            userVoted: null,
            lastVoteTime: null
        };
    }

    // Save votes to localStorage
    saveVotes() {
        try {
            localStorage.setItem('muskVsTrumpVotes', JSON.stringify(this.votes));
        } catch (e) {
            console.warn('Failed to save votes:', e);
        }
    }

    // Cast a vote
    vote(candidate) {
        // Prevent spam voting (1 vote per 5 minutes)
        const now = Date.now();
        const cooldownMs = 5 * 60 * 1000; // 5 minutes
        
        if (this.votes.lastVoteTime && (now - this.votes.lastVoteTime) < cooldownMs) {
            const remainingMs = cooldownMs - (now - this.votes.lastVoteTime);
            const remainingMin = Math.ceil(remainingMs / 60000);
            this.showNotification(`⏱️ Please wait ${remainingMin} more minute(s) before voting again`, 'warning');
            return;
        }

        // Cast the vote
        if (candidate === 'musk') {
            this.votes.musk++;
        } else if (candidate === 'trump') {
            this.votes.trump++;
        }

        this.votes.userVoted = candidate;
        this.votes.lastVoteTime = now;
        this.saveVotes();
        this.updateVoteDisplay();
        
        // Show success feedback
        this.showVoteSuccess(candidate);
        this.showNotification(`🗳️ Vote cast for ${candidate === 'musk' ? 'Elon Musk' : 'Donald Trump'}!`, 'success');
    }

    // Update vote display
    updateVoteDisplay() {
        const muskVotes = this.votes.musk;
        const trumpVotes = this.votes.trump;
        const totalVotes = muskVotes + trumpVotes;

        // Update vote counts
        document.getElementById('musk-votes').textContent = muskVotes;
        document.getElementById('trump-votes').textContent = trumpVotes;
        document.getElementById('total-votes').textContent = totalVotes;

        // Update progress bars
        if (totalVotes > 0) {
            const muskPercent = (muskVotes / totalVotes) * 100;
            const trumpPercent = (trumpVotes / totalVotes) * 100;

            const muskBar = document.getElementById('musk-bar');
            const trumpBar = document.getElementById('trump-bar');

            muskBar.style.width = `${muskPercent}%`;
            trumpBar.style.width = `${trumpPercent}%`;

            // Show percentages in bars if they're large enough
            if (muskPercent > 15) {
                muskBar.textContent = `${Math.round(muskPercent)}%`;
            } else {
                muskBar.textContent = '';
            }

            if (trumpPercent > 15) {
                trumpBar.textContent = `${Math.round(trumpPercent)}%`;
            } else {
                trumpBar.textContent = '';
            }
        }

        // Disable vote button if user already voted recently
        this.updateVoteButtons();
    }

    // Update vote button states
    updateVoteButtons() {
        const now = Date.now();
        const cooldownMs = 5 * 60 * 1000; // 5 minutes
        const canVote = !this.votes.lastVoteTime || (now - this.votes.lastVoteTime) >= cooldownMs;

        const voteButtons = document.querySelectorAll('.vote-btn');
        voteButtons.forEach(btn => {
            btn.disabled = !canVote;
            if (!canVote) {
                const remainingMs = cooldownMs - (now - this.votes.lastVoteTime);
                const remainingMin = Math.ceil(remainingMs / 60000);
                btn.textContent = `Wait ${remainingMin}m`;
            } else {
                const candidate = btn.getAttribute('data-candidate');
                btn.textContent = `Vote for ${candidate === 'musk' ? 'Musk' : 'Trump'}`;
            }
        });

        // Update button text countdown every second if on cooldown
        if (!canVote) {
            setTimeout(() => this.updateVoteButtons(), 1000);
        }
    }

    // Show vote success animation
    showVoteSuccess(candidate) {
        const candidateCard = document.querySelector(`[data-candidate="${candidate}"]`).closest('.candidate-card');
        candidateCard.classList.add('vote-success');
        setTimeout(() => {
            candidateCard.classList.remove('vote-success');
        }, 300);
    }

    // Reset all votes
    resetVotes() {
        if (confirm('🔄 Are you sure you want to reset all votes? This cannot be undone.')) {
            this.votes = {
                musk: 0,
                trump: 0,
                userVoted: null,
                lastVoteTime: null
            };
            this.saveVotes();
            this.updateVoteDisplay();
            this.showNotification('🔄 All votes have been reset!', 'info');
        }
    }

    // Show notification
    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existing = document.querySelector('.notification');
        if (existing) {
            existing.remove();
        }

        // Create notification
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Add styles
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '1rem 2rem',
            borderRadius: '8px',
            color: 'white',
            fontWeight: 'bold',
            zIndex: '3000',
            maxWidth: '400px',
            opacity: '0',
            transform: 'translateX(100%)',
            transition: 'all 0.3s ease'
        });

        // Set background color based on type
        const colors = {
            success: '#28a745',
            warning: '#ffc107',
            info: '#17a2b8',
            error: '#dc3545'
        };
        notification.style.background = colors[type] || colors.info;

        // Add to page
        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 10);

        // Remove after 4 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }

    // Setup event listeners
    setupEventListeners() {
        // Handle escape key for modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideAbout();
            }
        });

        // Handle clicks outside modal
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.hideAbout();
            }
        });
    }

    // Show about modal
    showAbout() {
        const modal = document.getElementById('about-modal');
        if (modal) {
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }
    }

    // Hide about modal
    hideAbout() {
        const modal = document.getElementById('about-modal');
        if (modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }
    }

    // Simulate API call for reputation data (placeholder)
    async simulateApiCall() {
        // This would normally call the Flask backend
        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Mock sentiment data
            return {
                musk: {
                    sentiment: 75 + Math.random() * 10 - 5, // 70-80%
                    trend: Math.random() > 0.5 ? 'up' : 'down'
                },
                trump: {
                    sentiment: 68 + Math.random() * 10 - 5, // 63-73%
                    trend: Math.random() > 0.5 ? 'up' : 'down'
                }
            };
        } catch (error) {
            console.warn('API simulation failed:', error);
            return null;
        }
    }

    // Update sentiment scores (placeholder functionality)
    async updateSentimentScores() {
        const data = await this.simulateApiCall();
        if (data) {
            // Update Musk sentiment
            const muskScore = document.querySelector('#musk-sentiment .score');
            const muskTrend = document.querySelector('#musk-sentiment .trend');
            if (muskScore) muskScore.textContent = `${Math.round(data.musk.sentiment)}%`;
            if (muskTrend) {
                muskTrend.textContent = data.musk.trend === 'up' ? '↗' : '↘';
                muskTrend.className = `trend ${data.musk.trend === 'up' ? 'positive' : 'negative'}`;
            }

            // Update Trump sentiment
            const trumpScore = document.querySelector('#trump-sentiment .score');
            const trumpTrend = document.querySelector('#trump-sentiment .trend');
            if (trumpScore) trumpScore.textContent = `${Math.round(data.trump.sentiment)}%`;
            if (trumpTrend) {
                trumpTrend.textContent = data.trump.trend === 'up' ? '↗' : '↘';
                trumpTrend.className = `trend ${data.trump.trend === 'up' ? 'positive' : 'negative'}`;
            }
        }
    }
}

// Global functions for HTML onclick handlers
let tracker;

function vote(candidate) {
    if (tracker) {
        tracker.vote(candidate);
    }
}

function resetVotes() {
    if (tracker) {
        tracker.resetVotes();
    }
}

function showAbout() {
    if (tracker) {
        tracker.showAbout();
    }
}

function hideAbout() {
    if (tracker) {
        tracker.hideAbout();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    tracker = new ReputationTracker();
    
    // Update sentiment scores every 30 seconds (simulated)
    setInterval(() => {
        if (tracker) {
            tracker.updateSentimentScores();
        }
    }, 30000);
    
    // Initial sentiment update
    setTimeout(() => {
        if (tracker) {
            tracker.updateSentimentScores();
        }
    }, 2000);
});

// Handle page visibility for better performance
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && tracker) {
        // Update display when page becomes visible
        tracker.updateVoteDisplay();
        tracker.updateSentimentScores();
    }
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ReputationTracker;
}