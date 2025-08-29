/**
 * ReputationGraph Component - Canvas 2D Version
 * Creates and manages a 2D visualization
 */
class ReputationGraph {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.canvas = null;
        this.ctx = null;
        this.animationId = null;
        this.data = null;
        this.animatedMuskHeight = 50;
        this.animatedTrumpHeight = 50;
        this.targetMuskHeight = 50;
        this.targetTrumpHeight = 50;
        
        this.init();
    }

    init() {
        console.log('🎨 Initializing 2D reputation graph...');
        
        // Create canvas
        this.canvas = document.createElement('canvas');
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        
        this.container.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');

        // Setup canvas
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas(), false);

        // Start animation
        this.animate();

        console.log('✅ 2D graph initialized successfully');
    }

    resizeCanvas() {
        const rect = this.container.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
    }

    updateData(data) {
        if (!data) return;

        this.data = data;
        
        // Convert scores (0-100) to heights
        const maxHeight = this.canvas.height * 0.5;
        this.targetMuskHeight = (data.musk.score / 100) * maxHeight;
        this.targetTrumpHeight = (data.trump.score / 100) * maxHeight;

        console.log(`📊 Graph updated - Musk: ${data.musk.score}%, Trump: ${data.trump.score}%`);
    }

    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());

        // Smooth animation
        const speed = 0.05;
        this.animatedMuskHeight += (this.targetMuskHeight - this.animatedMuskHeight) * speed;
        this.animatedTrumpHeight += (this.targetTrumpHeight - this.animatedTrumpHeight) * speed;

        this.draw();
    }

    draw() {
        const ctx = this.ctx;
        const width = this.canvas.width;
        const height = this.canvas.height;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Draw background
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, 'rgba(102, 126, 234, 0.1)');
        gradient.addColorStop(1, 'rgba(118, 75, 162, 0.1)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        // Draw bars
        const barWidth = width * 0.2;
        const baseY = height * 0.8;
        
        // Musk bar
        const muskX = width * 0.25;
        const muskHeight = this.animatedMuskHeight;
        ctx.fillStyle = '#1DA1F2';
        ctx.fillRect(muskX, baseY - muskHeight, barWidth, muskHeight);
        
        // Trump bar  
        const trumpX = width * 0.55;
        const trumpHeight = this.animatedTrumpHeight;
        ctx.fillStyle = '#FF4444';
        ctx.fillRect(trumpX, baseY - trumpHeight, barWidth, trumpHeight);

        // Draw labels
        if (this.data) {
            ctx.font = 'bold 16px Arial';
            ctx.textAlign = 'center';
            ctx.fillStyle = 'white';
            
            ctx.fillText('Elon Musk', muskX + barWidth/2, baseY + 30);
            ctx.fillText(`${this.data.musk.score.toFixed(1)}%`, muskX + barWidth/2, baseY + 50);
            
            ctx.fillText('Donald Trump', trumpX + barWidth/2, baseY + 30);
            ctx.fillText(`${this.data.trump.score.toFixed(1)}%`, trumpX + barWidth/2, baseY + 50);
        }
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        window.removeEventListener('resize', this.resizeCanvas);
        if (this.canvas && this.container) {
            this.container.removeChild(this.canvas);
        }
    }
}

// Make available globally
window.ReputationGraph = ReputationGraph;