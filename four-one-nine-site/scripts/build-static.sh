#!/bin/bash

# Static Build Script
# This script builds a static version of the frontend
# 
# Prerequisites:
# - MongoDB running locally
# - Payload dev server running on port 3000 (pnpm dev)
#
# Usage:
# 1. Start Payload: pnpm dev
# 2. In another terminal: ./scripts/build-static.sh

echo "🚀 Building static site..."
echo "Make sure Payload dev server is running (pnpm dev)"

# Set environment for static export
export STATIC_EXPORT=true

# Build the site
pnpm cross-env NODE_OPTIONS=--no-deprecation STATIC_EXPORT=true next build

echo "✅ Static build complete!"
echo "📁 Output is in the 'out' directory"
echo ""
echo "To deploy:"
echo "1. Upload contents of 'out/' to your static host"
echo "2. Keep Payload running on a separate server for the admin panel"