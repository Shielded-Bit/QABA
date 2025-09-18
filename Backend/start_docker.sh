#!/bin/sh
set -e

echo "Running migrations..."
python3 manage.py migrate

SUPERUSER_EMAIL=${SUPERUSER_EMAIL:-admin@qaba.com}
SUPERUSER_PASSWORD=${SUPERUSER_PASSWORD:-admin123}

export DJANGO_SUPERUSER_EMAIL="$SUPERUSER_EMAIL"
export DJANGO_SUPERUSER_PASSWORD="$SUPERUSER_PASSWORD"

echo "Ensuring superuser ${DJANGO_SUPERUSER_EMAIL} exists..."
if python3 manage.py shell -c "from django.contrib.auth import get_user_model; import os, sys; User = get_user_model(); email = os.environ['DJANGO_SUPERUSER_EMAIL']; sys.exit(0 if User.objects.filter(email=email, is_superuser=True).exists() else 1)"; then
    echo "Superuser ${DJANGO_SUPERUSER_EMAIL} already present"
else
    echo "Creating superuser ${DJANGO_SUPERUSER_EMAIL}..."
    python3 manage.py createsuperuser --noinput --username "$DJANGO_SUPERUSER_EMAIL" --email "$DJANGO_SUPERUSER_EMAIL"
fi

echo "Starting application..."
exec "$@"
