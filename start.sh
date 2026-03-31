#!/bin/bash
set -e

echo "Installing client dependencies..."
cd client
npm install

echo "Building React app..."
npm run build

echo "Installing server dependencies..."
cd ../server
npm install

echo "Starting server..."
npm start
