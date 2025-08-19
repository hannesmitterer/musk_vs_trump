/**
 * Kernel Graph Visualizer - Main Application
 * Interactive graph visualization with D3.js
 */

class KernelGraphVisualizer {
    constructor() {
        this.data = null;
        this.simulation = null;
        this.svg = null;
        this.currentView = 'graph';
        this.currentLayout = 'force';
        this.zoom = null;
        this.width = 0;
        this.height = 0;
        
        // Configuration
        this.config = {
            apiUrl: 'http://localhost:5000/api/graph',
            nodeRadius: {
                min: 10,
                max: 25
            },
            linkWidth: {
                min: 1,
                max: 5
            },
            colors: {
                person: '#ff6b6b',
                company: '#4ecdc4', 
                platform: '#45b7d1',
                topic: '#96ceb4'
            }
        };

        this.init();
    }

    async init() {
        this.setupEventListeners();
        await this.loadData();
        this.initializeVisualization();
    }

    setupEventListeners() {
        // View switching
        document.getElementById('graphViewBtn').addEventListener('click', () => {
            this.switchView('graph');
        });
        
        document.getElementById('dataViewBtn').addEventListener('click', () => {
            this.switchView('data');
        });

        // Layout switching
        document.getElementById('layoutSelect').addEventListener('change', (e) => {
            this.changeLayout(e.target.value);
        });

        // Zoom controls
        document.getElementById('zoomInBtn').addEventListener('click', () => {
            this.zoomIn();
        });
        
        document.getElementById('zoomOutBtn').addEventListener('click', () => {
            this.zoomOut();
        });
        
        document.getElementById('resetZoomBtn').addEventListener('click', () => {
            this.resetZoom();
        });

        // Retry button
        document.getElementById('retryBtn').addEventListener('click', () => {
            this.loadData();
        });

        // Window resize
        window.addEventListener('resize', () => {
            this.resize();
        });
    }

    async loadData() {
        this.showLoading();
        
        try {
            const response = await fetch(this.config.apiUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            this.data = await response.json();
            this.hideLoading();
            this.updateConnectionStatus('connected');
            this.renderDataView();
            
            if (this.currentView === 'graph') {
                this.renderGraph();
            }
            
        } catch (error) {
            console.error('Error loading data:', error);
            this.showError(`Failed to load data: ${error.message}`);
            this.updateConnectionStatus('disconnected');
        }
    }

    showLoading() {
        document.getElementById('loading-indicator').style.display = 'block';
        document.getElementById('error-display').style.display = 'none';
        document.getElementById('graph-view').style.display = 'none';
        document.getElementById('data-view').style.display = 'none';
    }

    hideLoading() {
        document.getElementById('loading-indicator').style.display = 'none';
    }

    showError(message) {
        document.getElementById('error-message').textContent = message;
        document.getElementById('error-display').style.display = 'block';
        document.getElementById('loading-indicator').style.display = 'none';
    }

    updateConnectionStatus(status) {
        const statusElement = document.getElementById('connection-status');
        const statusClasses = ['status-connected', 'status-disconnected', 'status-connecting'];
        
        statusElement.classList.remove(...statusClasses);
        
        switch (status) {
            case 'connected':
                statusElement.textContent = 'Connected';
                statusElement.classList.add('status-connected');
                break;
            case 'disconnected':
                statusElement.textContent = 'Disconnected';
                statusElement.classList.add('status-disconnected');
                break;
            case 'connecting':
                statusElement.textContent = 'Connecting...';
                statusElement.classList.add('status-connecting');
                break;
        }
    }

    switchView(view) {
        this.currentView = view;
        
        // Update button states
        const graphBtn = document.getElementById('graphViewBtn');
        const dataBtn = document.getElementById('dataViewBtn');
        
        if (view === 'graph') {
            graphBtn.classList.add('active');
            dataBtn.classList.remove('active');
            document.getElementById('graph-view').style.display = 'block';
            document.getElementById('data-view').style.display = 'none';
            
            if (this.data) {
                this.renderGraph();
            }
        } else {
            dataBtn.classList.add('active');
            graphBtn.classList.remove('active');
            document.getElementById('graph-view').style.display = 'none';
            document.getElementById('data-view').style.display = 'block';
        }
    }

    initializeVisualization() {
        const container = document.getElementById('graph-svg-container');
        this.width = container.clientWidth;
        this.height = container.clientHeight;

        // Create SVG
        this.svg = d3.select('#graph-svg')
            .attr('width', this.width)
            .attr('height', this.height);

        // Setup zoom behavior
        this.zoom = d3.zoom()
            .scaleExtent([0.1, 3])
            .on('zoom', (event) => {
                this.svg.select('.zoom-group')
                    .attr('transform', event.transform);
            });

        this.svg.call(this.zoom);

        // Create zoom group
        this.svg.append('g')
            .attr('class', 'zoom-group');

        // Start with graph view
        this.switchView('graph');
    }

    renderGraph() {
        if (!this.data) return;

        const zoomGroup = this.svg.select('.zoom-group');
        zoomGroup.selectAll('*').remove();

        // Create links
        const links = zoomGroup.selectAll('.link')
            .data(this.data.edges)
            .enter().append('line')
            .attr('class', d => `link ${d.type}`)
            .attr('stroke-width', d => Math.max(1, d.weight * this.config.linkWidth.max))
            .on('mouseover', (event, d) => this.showTooltip(event, this.formatEdgeTooltip(d)))
            .on('mouseout', () => this.hideTooltip());

        // Create nodes
        const nodes = zoomGroup.selectAll('.node')
            .data(this.data.nodes)
            .enter().append('circle')
            .attr('class', d => `node ${d.type}`)
            .attr('r', d => this.config.nodeRadius.min + (d.influence * (this.config.nodeRadius.max - this.config.nodeRadius.min)))
            .on('mouseover', (event, d) => this.showTooltip(event, this.formatNodeTooltip(d)))
            .on('mouseout', () => this.hideTooltip());

        // Create labels
        const labels = zoomGroup.selectAll('.node-label')
            .data(this.data.nodes)
            .enter().append('text')
            .attr('class', 'node-label')
            .text(d => d.label);

        // Apply layout
        this.applyLayout(nodes, links, labels);
    }

    applyLayout(nodes, links, labels) {
        if (this.simulation) {
            this.simulation.stop();
        }

        switch (this.currentLayout) {
            case 'force':
                this.applyForceLayout(nodes, links, labels);
                break;
            case 'circular':
                this.applyCircularLayout(nodes, links, labels);
                break;
            case 'hierarchical':
                this.applyHierarchicalLayout(nodes, links, labels);
                break;
        }
    }

    applyForceLayout(nodes, links, labels) {
        this.simulation = d3.forceSimulation(this.data.nodes)
            .force('link', d3.forceLink(this.data.edges).id(d => d.id).distance(80).strength(0.3))
            .force('charge', d3.forceManyBody().strength(-200))
            .force('center', d3.forceCenter(this.width / 2, this.height / 2))
            .force('collision', d3.forceCollide().radius(d => this.config.nodeRadius.min + (d.influence * (this.config.nodeRadius.max - this.config.nodeRadius.min)) + 5));

        this.simulation.on('tick', () => {
            links
                .attr('x1', d => d.source.x)
                .attr('y1', d => d.source.y)
                .attr('x2', d => d.target.x)
                .attr('y2', d => d.target.y);

            nodes
                .attr('cx', d => d.x)
                .attr('cy', d => d.y);

            labels
                .attr('x', d => d.x)
                .attr('y', d => d.y + 5);
        });

        // Enable dragging
        nodes.call(d3.drag()
            .on('start', (event, d) => {
                if (!event.active) this.simulation.alphaTarget(0.3).restart();
                d.fx = d.x;
                d.fy = d.y;
            })
            .on('drag', (event, d) => {
                d.fx = event.x;
                d.fy = event.y;
            })
            .on('end', (event, d) => {
                if (!event.active) this.simulation.alphaTarget(0);
                d.fx = null;
                d.fy = null;
            }));
    }

    applyCircularLayout(nodes, links, labels) {
        const centerX = this.width / 2;
        const centerY = this.height / 2;
        const radius = Math.min(this.width, this.height) / 3;
        const nodeCount = this.data.nodes.length;

        this.data.nodes.forEach((node, i) => {
            const angle = (i / nodeCount) * 2 * Math.PI;
            node.x = centerX + radius * Math.cos(angle);
            node.y = centerY + radius * Math.sin(angle);
        });

        this.updatePositions(nodes, links, labels);
    }

    applyHierarchicalLayout(nodes, links, labels) {
        // Group nodes by type
        const types = ['person', 'company', 'platform', 'topic'];
        const levelHeight = this.height / (types.length + 1);
        
        types.forEach((type, levelIndex) => {
            const nodesOfType = this.data.nodes.filter(n => n.type === type);
            const levelY = levelHeight * (levelIndex + 1);
            const nodeWidth = this.width / (nodesOfType.length + 1);
            
            nodesOfType.forEach((node, nodeIndex) => {
                node.x = nodeWidth * (nodeIndex + 1);
                node.y = levelY;
            });
        });

        this.updatePositions(nodes, links, labels);
    }

    updatePositions(nodes, links, labels) {
        nodes
            .transition()
            .duration(750)
            .attr('cx', d => d.x)
            .attr('cy', d => d.y);

        labels
            .transition()
            .duration(750)
            .attr('x', d => d.x)
            .attr('y', d => d.y + 5);

        links
            .transition()
            .duration(750)
            .attr('x1', d => d.source.x || 0)
            .attr('y1', d => d.source.y || 0)
            .attr('x2', d => d.target.x || 0)
            .attr('y2', d => d.target.y || 0);
    }

    changeLayout(layout) {
        this.currentLayout = layout;
        if (this.data && this.currentView === 'graph') {
            this.renderGraph();
        }
    }

    formatNodeTooltip(node) {
        const sentimentText = node.sentiment > 0 ? '+' + node.sentiment.toFixed(2) : node.sentiment.toFixed(2);
        const sentimentClass = node.sentiment > 0 ? 'sentiment-positive' : (node.sentiment < 0 ? 'sentiment-negative' : 'sentiment-neutral');
        
        return `
            <div><strong>${node.label}</strong></div>
            <div>Type: ${node.type}</div>
            <div>Sentiment: <span class="${sentimentClass}">${sentimentText}</span></div>
            <div>Influence: ${node.influence.toFixed(2)}</div>
        `;
    }

    formatEdgeTooltip(edge) {
        const sourceNode = this.data.nodes.find(n => n.id === edge.source.id || n.id === edge.source);
        const targetNode = this.data.nodes.find(n => n.id === edge.target.id || n.id === edge.target);
        
        return `
            <div><strong>${sourceNode?.label || edge.source} → ${targetNode?.label || edge.target}</strong></div>
            <div>Type: ${edge.type}</div>
            <div>Weight: ${edge.weight.toFixed(2)}</div>
        `;
    }

    showTooltip(event, content) {
        const tooltip = d3.select('body').selectAll('.tooltip').data([0]);
        
        tooltip.enter()
            .append('div')
            .attr('class', 'tooltip')
            .merge(tooltip)
            .html(content)
            .style('left', (event.pageX + 10) + 'px')
            .style('top', (event.pageY - 10) + 'px')
            .style('opacity', 1);
    }

    hideTooltip() {
        d3.select('body').selectAll('.tooltip')
            .style('opacity', 0)
            .remove();
    }

    renderDataView() {
        if (!this.data) return;

        this.renderNodesTable();
        this.renderEdgesTable();
        this.renderMetadata();
    }

    renderNodesTable() {
        const tbody = document.getElementById('nodes-tbody');
        tbody.innerHTML = '';
        
        document.getElementById('node-count').textContent = this.data.nodes.length;

        this.data.nodes.forEach(node => {
            const row = tbody.insertRow();
            const sentimentClass = node.sentiment > 0 ? 'sentiment-positive' : (node.sentiment < 0 ? 'sentiment-negative' : 'sentiment-neutral');
            const sentimentText = node.sentiment > 0 ? '+' + node.sentiment.toFixed(2) : node.sentiment.toFixed(2);
            
            row.innerHTML = `
                <td><strong>${node.label}</strong></td>
                <td><span class="badge bg-secondary">${node.type}</span></td>
                <td><span class="${sentimentClass}">${sentimentText}</span></td>
                <td><div class="progress" style="height: 20px;">
                    <div class="progress-bar" role="progressbar" 
                         style="width: ${node.influence * 100}%"
                         aria-valuenow="${node.influence}" 
                         aria-valuemin="0" 
                         aria-valuemax="1">${node.influence.toFixed(2)}</div>
                </div></td>
            `;
        });
    }

    renderEdgesTable() {
        const tbody = document.getElementById('edges-tbody');
        tbody.innerHTML = '';
        
        document.getElementById('edge-count').textContent = this.data.edges.length;

        this.data.edges.forEach(edge => {
            const sourceNode = this.data.nodes.find(n => n.id === edge.source);
            const targetNode = this.data.nodes.find(n => n.id === edge.target);
            
            const row = tbody.insertRow();
            row.innerHTML = `
                <td>${sourceNode?.label || edge.source}</td>
                <td>${targetNode?.label || edge.target}</td>
                <td><span class="badge bg-info">${edge.type}</span></td>
                <td><div class="progress" style="height: 20px;">
                    <div class="progress-bar bg-success" role="progressbar" 
                         style="width: ${edge.weight * 100}%"
                         aria-valuenow="${edge.weight}" 
                         aria-valuemin="0" 
                         aria-valuemax="1">${edge.weight.toFixed(2)}</div>
                </div></td>
            `;
        });
    }

    renderMetadata() {
        const container = document.getElementById('metadata-container');
        const metadata = this.data.metadata;
        
        container.innerHTML = `
            <div class="row">
                <div class="col-md-3">
                    <div class="metadata-badge">
                        <div class="text-muted small">Title</div>
                        <div class="fw-bold">${metadata.title}</div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="metadata-badge">
                        <div class="text-muted small">Last Updated</div>
                        <div class="fw-bold">${metadata.last_updated}</div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="metadata-badge">
                        <div class="text-muted small">Nodes</div>
                        <div class="fw-bold">${metadata.node_count}</div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="metadata-badge">
                        <div class="text-muted small">Edges</div>
                        <div class="fw-bold">${metadata.edge_count}</div>
                    </div>
                </div>
                <div class="col-12 mt-3">
                    <div class="metadata-badge">
                        <div class="text-muted small">Description</div>
                        <div>${metadata.description}</div>
                    </div>
                </div>
            </div>
        `;
    }

    // Zoom controls
    zoomIn() {
        this.svg.transition().duration(200).call(
            this.zoom.scaleBy, 1.2
        );
    }

    zoomOut() {
        this.svg.transition().duration(200).call(
            this.zoom.scaleBy, 0.8
        );
    }

    resetZoom() {
        this.svg.transition().duration(500).call(
            this.zoom.transform,
            d3.zoomIdentity
        );
    }

    resize() {
        const container = document.getElementById('graph-svg-container');
        this.width = container.clientWidth;
        this.height = container.clientHeight;

        this.svg
            .attr('width', this.width)
            .attr('height', this.height);

        if (this.currentView === 'graph' && this.data) {
            this.renderGraph();
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new KernelGraphVisualizer();
});