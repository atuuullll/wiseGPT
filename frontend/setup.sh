#!/bin/bash
# Quick setup script for Linux/macOS

echo "========================================"
echo "🎨 LLM Content Generator Frontend Setup"
echo "========================================"
echo ""

# Check if Node.js is installed
echo "Checking for Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "✅ Node.js found: $NODE_VERSION"
else
    echo "❌ Node.js not found!"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check npm
echo "Checking for npm..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo "✅ npm found: v$NPM_VERSION"
else
    echo "❌ npm not found!"
    exit 1
fi

echo ""
echo "Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Setup completed successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Make sure your Flask backend is running:"
    echo "   python server.py"
    echo ""
    echo "2. Start the development server:"
    echo "   npm run dev"
    echo ""
    echo "3. Open your browser and visit:"
    echo "   http://localhost:3000"
    echo ""
else
    echo "❌ Setup failed!"
    exit 1
fi
