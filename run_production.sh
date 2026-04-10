#!/bin/bash

# Production startup script for LLM Content Generator API

set -e

# Source environment variables
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
fi

# Determine number of workers based on CPU cores
WORKERS=${WORKERS:-$(($(nproc) * 2 + 1))}
THREADS=${THREADS:-2}

echo "=========================================="
echo "LLM Content Generator - Production Startup"
echo "=========================================="
echo "Workers: $WORKERS"
echo "Threads per worker: $THREADS"
echo "Environment: production"
echo "==========================================="

# Run migrations/setup if needed (placeholder for future use)
# python manage.py migrate

# Start Gunicorn
exec gunicorn \
    --workers=$WORKERS \
    --threads=$THREADS \
    --worker-class=gthread \
    --worker-tmp-dir=/dev/shm \
    --bind=0.0.0.0:5000 \
    --timeout=120 \
    --access-logfile=- \
    --error-logfile=- \
    --log-level=info \
    --keep-alive=5 \
    server:app
