#!/bin/bash
set -e

echo "================================"
echo "Building Algorithm Visualizer"
echo "================================"

echo ""
echo "Step 1: Installing client dependencies..."
cd client
npm install --legacy-peer-deps

echo ""
echo "Step 2: Building React app..."
CI=false npm run build
if [ ! -d "build" ]; then
  echo "❌ Build failed! No build folder created."
  exit 1
fi
echo "✅ React build completed"

echo ""
echo "Step 3: Installing server dependencies..."
cd ../server
npm install

echo ""
echo "Step 4: Starting server..."
npm start
