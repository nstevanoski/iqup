#!/bin/bash

echo "Installing iQup Dashboard dependencies..."

# Check if npm is available
if command -v npm &> /dev/null; then
    echo "Using npm to install dependencies..."
    npm install
elif command -v pnpm &> /dev/null; then
    echo "Using pnpm to install dependencies..."
    pnpm install
elif command -v yarn &> /dev/null; then
    echo "Using yarn to install dependencies..."
    yarn install
else
    echo "Error: No package manager found. Please install Node.js and npm/pnpm/yarn."
    exit 1
fi

echo "Dependencies installed successfully!"
echo ""
echo "To start the development server, run:"
echo "  npm run dev"
echo "  or"
echo "  pnpm dev"
echo ""
echo "Then open http://localhost:3000 in your browser"
