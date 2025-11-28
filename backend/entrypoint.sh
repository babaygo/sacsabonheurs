#!/bin/bash
set -e

if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm ci --silent
fi

if [ ! -d "src/generated/prisma" ]; then
    echo "Generating Prisma client..."
    npx prisma generate
fi

echo "Starting dev server with nodemon (hot reload)..."
exec npm run dev:watch
