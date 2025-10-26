#!/bin/bash
set -e

echo "Installing dependencies if needed..."
npm install --silent

echo "Generating Prisma client..."
npx prisma generate

echo "Starting dev server with ts-node-dev..."
exec npm run dev
