#!/bin/bash
set -e

# If node_modules is missing or empty, install deps
if [ ! -d "node_modules" ] || [ "$(ls -A node_modules 2>/dev/null)" = "" ]; then
  echo "Installing dependencies..."
  npm install --silent
fi

# Ensure Prisma client is generated
if [ ! -d "node_modules/.prisma/client" ]; then
  echo "Generating Prisma client..."
  npx prisma generate
fi

# If dist doesn't exist, build the project (only for production/start)
if [ "$NODE_ENV" != "development" ]; then
  if [ ! -d "dist" ]; then
    echo "Building TypeScript..."
    npm run build
  fi
  echo "Starting app (production)..."
  exec node dist/index.js
else
  echo "NODE_ENV=development -> starting dev server with ts-node-dev"
  # Use ts-node-dev for hot-reload. Ensure it's installed in node_modules.
  exec npm run dev
fi
