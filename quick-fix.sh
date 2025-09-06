#!/bin/bash

echo "🔧 Quick Fix: Installing missing @hookform/resolvers dependency..."
echo ""

# Check if npm is available
if command -v npm &> /dev/null; then
    echo "✅ npm found, installing dependency..."
    npm install @hookform/resolvers@^3.9.1
    echo ""
    echo "✅ Installation complete!"
    echo ""
    echo "🚀 You can now run:"
    echo "  npm run dev"
    echo ""
    echo "📱 Then visit http://localhost:3000/demo to see the DataTable and Forms!"
else
    echo "❌ npm not found. Please install Node.js and npm first."
    echo ""
    echo "📋 Manual installation steps:"
    echo "1. Install Node.js from https://nodejs.org/"
    echo "2. Run: npm install @hookform/resolvers@^3.9.1"
    echo "3. Run: npm run dev"
    echo "4. Visit: http://localhost:3000/demo"
fi
