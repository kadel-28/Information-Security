#!/bin/bash
set -e

echo "Installing server dependencies..."
cd server
npm install

echo "Starting server..."
npm start
