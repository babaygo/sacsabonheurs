#!/bin/bash
set -e

if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install --silent
fi

if [ ! -d "src/generated/prisma" ]; then
    echo "Generating Prisma client..."
    npx prisma generate
fi

echo "Starting dev server with tsx..."
exec npm run dev
