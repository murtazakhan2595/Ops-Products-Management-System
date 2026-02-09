#!/bin/sh
set -e

echo "==> Running database migrations..."
pnpm exec prisma db push --skip-generate

echo "==> Starting server..."
exec node dist/server.js
