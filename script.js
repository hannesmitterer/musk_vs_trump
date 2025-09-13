// Musk vs Trump - 3D Reputation Graph
class ReputationGraph {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.dataPoints = [];
        this.animationId = null;
        this.currentPerson = 'musk';
        
        this.init();
        this.setupEventListeners();
        this.generateSampleData();
        this.animate();
    }
    
    init() {
        const container = document.getElementById('graph-canvas');
        const loadingIndicator = container.querySelector('.loading-indicator');
        
        // Scene setup
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0f172a);
        
        // Camera setup
        const aspect = container.clientWidth / container.clientHeight;
        this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
        this.camera.position.set(0, 5, 10);
        
        // Renderer setup
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true 
        });
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        // Controls setup
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.1;
        this.controls.enableZoom = true;
        this.controls.enablePan = false;
        this.controls.maxPolarAngle = Math.PI / 2;
        this.controls.minDistance = 5;
        this.controls.maxDistance = 20;
        
        // Lighting
        this.setupLighting();
        
        // Add renderer to DOM
        container.appendChild(this.renderer.domElement);
        
        // Hide loading indicator
        setTimeout(() => {
            if (loadingIndicator) {
                loadingIndicator.style.display = 'none';
            }
        }, 1000);
        
        // Handle resize
        window.addEventListener('resize', () => this.handleResize());
    }
    
    setupLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);
        
        // Directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 10, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 1024;
        directionalLight.shadow.mapSize.height = 1024;
        this.scene.add(directionalLight);
        
        // Point light for accent
        const pointLight = new THREE.PointLight(0x3b82f6, 0.5, 50);
        pointLight.position.set(0, 10, 0);
        this.scene.add(pointLight);
    }
    
    generateSampleData() {
        const data = {
            musk: this.generatePersonData('Elon Musk', 0x3b82f6),
            trump: this.generatePersonData('Donald Trump', 0xef4444),
            both: this.generateComparisonData()
        };
        
        this.allData = data;
        this.updateVisualization(this.currentPerson);
    }
    
    generatePersonData(name, color) {
        const points = [];
        const timePoints = 30; // 30 data points over time
        
        for (let i = 0; i < timePoints; i++) {
            const time = i / (timePoints - 1) * 10 - 5; // -5 to 5 range
            const sentiment = Math.sin(time * 0.5) * 0.3 + Math.random() * 0.4 - 0.2;
            const mentions = Math.abs(Math.cos(time * 0.3)) * 50 + Math.random() * 30;
            
            points.push({
                x: time,
                y: sentiment,
                z: mentions * 0.1,
                sentiment: sentiment,
                mentions: Math.round(mentions),
                color: color,
                name: name
            });
        }
        
        return points;
    }
    
    generateComparisonData() {
        const muskData = this.generatePersonData('Elon Musk', 0x3b82f6);
        const trumpData = this.generatePersonData('Donald Trump', 0xef4444);
        return [...muskData, ...trumpData];
    }
    
    updateVisualization(person) {
        // Clear existing objects (except lights)
        const objectsToRemove = [];
        this.scene.traverse((child) => {
            if (child.isMesh) {
                objectsToRemove.push(child);
            }
        });
        objectsToRemove.forEach(obj => this.scene.remove(obj));
        
        // Add coordinate system
        this.addCoordinateSystem();
        
        // Add data points
        const data = this.allData[person];
        this.createDataPoints(data);
        this.createConnectingLines(data);
        
        // Update stats
        this.updateStats(data);
    }
    
    addCoordinateSystem() {
        // X-axis (Time)
        const xGeometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(-6, 0, 0),
            new THREE.Vector3(6, 0, 0)
        ]);
        const xMaterial = new THREE.LineBasicMaterial({ color: 0x64748b });
        const xLine = new THREE.Line(xGeometry, xMaterial);
        this.scene.add(xLine);
        
        // Y-axis (Sentiment)
        const yGeometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0, -2, 0),
            new THREE.Vector3(0, 2, 0)
        ]);
        const yMaterial = new THREE.LineBasicMaterial({ color: 0x64748b });
        const yLine = new THREE.Line(yGeometry, yMaterial);
        this.scene.add(yLine);
        
        // Z-axis (Volume)
        const zGeometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 0, 5)
        ]);
        const zMaterial = new THREE.LineBasicMaterial({ color: 0x64748b });
        const zLine = new THREE.Line(zGeometry, zMaterial);
        this.scene.add(zLine);
        
        // Add axis labels (simple text geometry would be too complex, using simple markers)
        this.addAxisMarkers();
    }
    
    addAxisMarkers() {
        // Positive/Negative sentiment markers
        const positiveGeometry = new THREE.SphereGeometry(0.05, 8, 6);
        const positiveMaterial = new THREE.MeshLambertMaterial({ color: 0x10b981 });
        const positiveMarker = new THREE.Mesh(positiveGeometry, positiveMaterial);
        positiveMarker.position.set(0, 1.5, 0);
        this.scene.add(positiveMarker);
        
        const negativeGeometry = new THREE.SphereGeometry(0.05, 8, 6);
        const negativeMaterial = new THREE.MeshLambertMaterial({ color: 0xef4444 });
        const negativeMarker = new THREE.Mesh(negativeGeometry, negativeMaterial);
        negativeMarker.position.set(0, -1.5, 0);
        this.scene.add(negativeMarker);
    }
    
    createDataPoints(data) {
        const geometry = new THREE.SphereGeometry(0.1, 12, 8);
        
        data.forEach((point, index) => {
            const material = new THREE.MeshLambertMaterial({ 
                color: point.color,
                transparent: true,
                opacity: 0.8
            });
            
            const sphere = new THREE.Mesh(geometry, material);
            sphere.position.set(point.x, point.y, point.z);
            sphere.castShadow = true;
            sphere.userData = point;
            
            // Add subtle animation
            sphere.scale.setScalar(0);
            this.scene.add(sphere);
            
            // Animate in
            setTimeout(() => {
                this.animatePointIn(sphere);
            }, index * 50);
        });
    }
    
    createConnectingLines(data) {
        if (data.length < 2) return;
        
        // Group by person for comparison view
        const groupedData = {};
        data.forEach(point => {
            if (!groupedData[point.name]) groupedData[point.name] = [];
            groupedData[point.name].push(point);
        });
        
        Object.values(groupedData).forEach(personData => {
            if (personData.length < 2) return;
            
            const points = personData.map(p => new THREE.Vector3(p.x, p.y, p.z));
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const material = new THREE.LineBasicMaterial({ 
                color: personData[0].color,
                transparent: true,
                opacity: 0.6
            });
            
            const line = new THREE.Line(geometry, material);
            this.scene.add(line);
        });
    }
    
    animatePointIn(mesh) {
        const targetScale = 1 + Math.random() * 0.3;
        const animate = () => {
            const currentScale = mesh.scale.x;
            if (currentScale < targetScale) {
                mesh.scale.addScalar(0.05);
                requestAnimationFrame(animate);
            } else {
                mesh.scale.setScalar(targetScale);
            }
        };
        animate();
    }
    
    updateStats(data) {
        if (!data || data.length === 0) return;
        
        const totalMentions = data.reduce((sum, point) => sum + point.mentions, 0);
        const avgSentiment = data.reduce((sum, point) => sum + point.sentiment, 0) / data.length;
        const lastPoints = data.slice(-5);
        const recentAvg = lastPoints.reduce((sum, point) => sum + point.sentiment, 0) / lastPoints.length;
        const trend = recentAvg > avgSentiment ? 'Rising' : 'Falling';
        
        document.getElementById('total-mentions').textContent = totalMentions.toLocaleString();
        document.getElementById('sentiment-score').textContent = avgSentiment.toFixed(2);
        
        const trendElement = document.getElementById('trend-direction');
        trendElement.textContent = `${trend === 'Rising' ? '↗' : '↘'} ${trend}`;
        trendElement.className = `stat-number ${trend === 'Rising' ? 'trending-up' : 'trending-down'}`;
    }
    
    setupEventListeners() {
        // Control buttons
        document.querySelectorAll('.control-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Update active button
                document.querySelectorAll('.control-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                
                // Update visualization
                this.currentPerson = e.target.dataset.person;
                this.updateVisualization(this.currentPerson);
            });
        });
        
        // Mouse interaction for mobile
        this.addMobileInteractions();
    }
    
    addMobileInteractions() {
        let touchStart = null;
        
        this.renderer.domElement.addEventListener('touchstart', (e) => {
            touchStart = {
                x: e.touches[0].clientX,
                y: e.touches[0].clientY
            };
        }, { passive: true });
        
        this.renderer.domElement.addEventListener('touchmove', (e) => {
            if (!touchStart) return;
            
            const touchCurrent = {
                x: e.touches[0].clientX,
                y: e.touches[0].clientY
            };
            
            const deltaX = touchCurrent.x - touchStart.x;
            const deltaY = touchCurrent.y - touchStart.y;
            
            // Prevent default scrolling behavior
            if (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10) {
                e.preventDefault();
            }
        });
    }
    
    handleResize() {
        const container = document.getElementById('graph-canvas');
        const width = container.clientWidth;
        const height = container.clientHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }
    
    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());
        
        // Update controls
        this.controls.update();
        
        // Rotate data points slightly
        this.scene.traverse((child) => {
            if (child.isMesh && child.userData && child.userData.sentiment !== undefined) {
                child.rotation.y += 0.01;
            }
        });
        
        // Render scene
        this.renderer.render(this.scene, this.camera);
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        if (this.renderer) {
            this.renderer.dispose();
        }
        
        window.removeEventListener('resize', this.handleResize);
    }
}

// Mobile performance optimizations
function optimizeForMobile() {
    const isMobile = window.innerWidth < 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        // Reduce quality for better performance on mobile
        document.documentElement.style.setProperty('--mobile-optimized', 'true');
        
        // Add mobile-specific class
        document.body.classList.add('mobile-device');
        
        // Optimize Three.js settings
        if (window.THREE) {
            // These optimizations will be applied when the ReputationGraph is created
            console.log('Mobile device detected - applying performance optimizations');
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    optimizeForMobile();
    
    // Small delay to ensure Three.js is loaded
    setTimeout(() => {
        if (window.THREE && window.THREE.OrbitControls) {
            window.reputationGraph = new ReputationGraph();
        } else {
            console.error('Three.js not loaded properly');
            // Fallback: show error message
            const loadingIndicator = document.querySelector('.loading-indicator');
            if (loadingIndicator) {
                loadingIndicator.innerHTML = '<p>Error loading 3D visualization. Please refresh the page.</p>';
            }
        }
    }, 500);
});

// Handle page visibility change for performance
document.addEventListener('visibilitychange', () => {
    if (window.reputationGraph) {
        if (document.hidden) {
            // Pause animation when page is not visible
            if (window.reputationGraph.animationId) {
                cancelAnimationFrame(window.reputationGraph.animationId);
                window.reputationGraph.animationId = null;
            }
        } else {
            // Resume animation when page becomes visible
            if (!window.reputationGraph.animationId) {
                window.reputationGraph.animate();
            }
        }
    }
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (window.reputationGraph) {
        window.reputationGraph.destroy();
    }
});