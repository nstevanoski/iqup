#!/bin/bash

# Install missing dependencies for DataTable and Forms
echo "Installing missing dependencies..."

# Install @hookform/resolvers for zod validation
npm install @hookform/resolvers@^3.9.1

echo "✅ Dependencies installed successfully!"
echo ""
echo "You can now run:"
echo "  npm run dev"
echo ""
echo "And visit http://localhost:3000/demo to see the DataTable and Forms in action!"
