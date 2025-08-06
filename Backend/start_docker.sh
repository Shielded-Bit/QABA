#!/bin/sh
set -e

echo "Running migrations..."
python3 manage.py migrate

echo "Creating superuser if needed..."
DJANGO_SUPERUSER_EMAIL=${SUPERUSER_EMAIL:-admin@qaba.com} \
DJANGO_SUPERUSER_PASSWORD=${SUPERUSER_PASSWORD:-admin123} \
python3 manage.py createsuperuser --noinput --username ${SUPERUSER_EMAIL:-admin@qaba.com} --email ${SUPERUSER_EMAIL:-admin@qaba.com} || echo "Superuser already exists"

echo "Starting application..."
exec "$@"