#!/usr/bin/env bash
# exit on error
set -o errexit

echo "Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

echo "Collecting static files..."
python manage.py collectstatic --no-input

echo "Running database migrations..."
python manage.py migrate

echo "Loading initial data (if fixtures exist)..."
if [ -f "fixtures/initial_data.json" ]; then
    python manage.py loaddata fixtures/initial_data.json --ignorenonexistent
    echo "✓ Initial data loaded"
else
    echo "⚠ No fixtures found, skipping data load"
fi

echo "Building knowledge base for RAG chatbot..."
python manage.py build_knowledge_base

echo "Build completed successfully!"
