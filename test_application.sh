#!/bin/bash

# Test script to verify the kernel graph application
echo "🧪 Testing Kernel Graph Application..."

# Check if required files exist
echo "📂 Checking file structure..."
required_files=(
    "backend/app.py"
    "backend/db_manager.py" 
    "backend/requirements.txt"
    "frontend/index.html"
    "frontend/app.js"
    "frontend/styles.css"
)

for file in "${required_files[@]}"; do
    if [[ -f "$file" ]]; then
        echo "✅ $file exists"
    else
        echo "❌ $file missing"
        exit 1
    fi
done

# Test backend installation
echo "🐍 Testing backend setup..."
cd backend

# Install dependencies
pip3 install -r requirements.txt > /dev/null 2>&1
if [[ $? -eq 0 ]]; then
    echo "✅ Dependencies installed"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Initialize database
python3 -c "import db_manager; db_manager.create_tables()" > /dev/null 2>&1
if [[ $? -eq 0 ]]; then
    echo "✅ Database initialized"
else
    echo "❌ Database initialization failed"
    exit 1
fi

# Start backend server in background
echo "🌐 Starting backend server..."
python3 app.py &
BACKEND_PID=$!

# Wait for server to start
sleep 3

# Test API endpoints
echo "🔍 Testing API endpoints..."
api_endpoints=(
    "http://localhost:5000/health"
    "http://localhost:5000/api/graph"
    "http://localhost:5000/api/graph/nodes"
    "http://localhost:5000/api/graph/edges"
)

for endpoint in "${api_endpoints[@]}"; do
    response=$(curl -s -o /dev/null -w "%{http_code}" "$endpoint")
    if [[ "$response" == "200" ]]; then
        echo "✅ $endpoint responds with 200"
    else
        echo "❌ $endpoint failed (HTTP $response)"
        kill $BACKEND_PID
        exit 1
    fi
done

# Test data structure
echo "📊 Testing data structure..."
node_count=$(curl -s http://localhost:5000/api/graph/nodes | python3 -c "import sys, json; data=json.load(sys.stdin); print(len(data))")
edge_count=$(curl -s http://localhost:5000/api/graph/edges | python3 -c "import sys, json; data=json.load(sys.stdin); print(len(data))")

echo "📈 Found $node_count nodes and $edge_count edges"

if [[ $node_count -gt 0 && $edge_count -gt 0 ]]; then
    echo "✅ Graph data is valid"
else
    echo "❌ Invalid graph data"
    kill $BACKEND_PID
    exit 1
fi

# Clean up
kill $BACKEND_PID
echo "🧹 Backend server stopped"

# Test frontend files
echo "🎨 Testing frontend structure..."
cd ../frontend

# Check HTML structure
if grep -q "Kernel Graph Visualizer" index.html; then
    echo "✅ HTML structure valid"
else
    echo "❌ HTML structure invalid"
    exit 1
fi

# Check JavaScript structure
if grep -q "KernelGraphVisualizer" app.js; then
    echo "✅ JavaScript structure valid"
else
    echo "❌ JavaScript structure invalid"
    exit 1
fi

# Check CSS structure
if grep -q "graph-container" styles.css; then
    echo "✅ CSS structure valid"
else
    echo "❌ CSS structure invalid"
    exit 1
fi

echo ""
echo "🎉 All tests passed!"
echo "🚀 Application is ready for deployment"
echo ""
echo "Next steps:"
echo "  1. Start backend: cd backend && ./start_backend.sh"
echo "  2. Start frontend: cd frontend && python3 -m http.server 8080"
echo "  3. Open http://localhost:8080 in your browser"