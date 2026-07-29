#!/bin/sh
set -e

echo "Waiting for database and syncing schema..."
ATTEMPTS=0
until npx prisma db push --accept-data-loss --skip-generate || [ $ATTEMPTS -eq 10 ]; do
  ATTEMPTS=$((ATTEMPTS+1))
  echo "Database not ready yet, retrying in 5s... (attempt $ATTEMPTS/10)"
  sleep 5
done

echo "Starting server..."
exec node src/server.js
