#!/bin/bash
set -e

if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install --silent
fi

if [ ! -d "node_modules/.prisma/client" ]; then
    echo "Generating Prisma client..."
    npx prisma generate
fi

echo "Starting dev server with ts-node-dev..."
exec npm run dev
