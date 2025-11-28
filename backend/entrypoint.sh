#!/bin/bash
set -e

echo "Reinstalling esbuild for Linux..."
npm rebuild esbuild

if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install --silent
fi

echo "Generating Prisma client..."
npx prisma generate

echo "Applying migrations..."
npx prisma migrate deploy

echo "Starting dev server with nodemon (hot reload)..."
exec npm run dev:watch
