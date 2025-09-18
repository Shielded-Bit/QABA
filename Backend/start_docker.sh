#!/bin/sh
set -e

echo "Running migrations..."
python3 manage.py migrate

SUPERUSER_EMAIL=${SUPERUSER_EMAIL:-admin@qaba.com}
SUPERUSER_PASSWORD=${SUPERUSER_PASSWORD:-admin123}
SUPERUSER_FIRST_NAME=${SUPERUSER_FIRST_NAME:-Admin}
SUPERUSER_LAST_NAME=${SUPERUSER_LAST_NAME:-User}

export DJANGO_SUPERUSER_EMAIL="$SUPERUSER_EMAIL"
export DJANGO_SUPERUSER_PASSWORD="$SUPERUSER_PASSWORD"
export DJANGO_SUPERUSER_FIRST_NAME="$SUPERUSER_FIRST_NAME"
export DJANGO_SUPERUSER_LAST_NAME="$SUPERUSER_LAST_NAME"

echo "Ensuring superuser ${DJANGO_SUPERUSER_EMAIL} exists..."
if python3 manage.py shell -c "from django.contrib.auth import get_user_model; import os, sys; User = get_user_model(); email = os.environ['DJANGO_SUPERUSER_EMAIL']; sys.exit(0 if User.objects.filter(email=email, is_superuser=True).exists() else 1)"; then
    echo "Superuser ${DJANGO_SUPERUSER_EMAIL} already present"
else
    echo "Creating superuser ${DJANGO_SUPERUSER_EMAIL}..."
    python3 manage.py shell <<'PY'
from django.contrib.auth import get_user_model
import os

User = get_user_model()
email = os.environ['DJANGO_SUPERUSER_EMAIL']
password = os.environ['DJANGO_SUPERUSER_PASSWORD']
first_name = os.environ.get('DJANGO_SUPERUSER_FIRST_NAME', 'Admin')
last_name = os.environ.get('DJANGO_SUPERUSER_LAST_NAME', 'User')

defaults = {
    'first_name': first_name,
    'last_name': last_name,
    'is_staff': True,
    'is_superuser': True,
    'is_active': True,
}

user_type_field = User._meta.get_field('user_type') if 'user_type' in [f.name for f in User._meta.get_fields()] else None
if user_type_field is not None:
    user_type_value = getattr(getattr(User, 'UserType', None), 'ADMIN', 'ADMIN')
    defaults['user_type'] = user_type_value

user, created = User.objects.get_or_create(email=email, defaults=defaults)

if not created:
    user.is_staff = True
    user.is_superuser = True
    user.is_active = True
    if not user.first_name:
        user.first_name = first_name
    if not user.last_name:
        user.last_name = last_name
    if user_type_field is not None:
        user_type_value = getattr(getattr(User, 'UserType', None), 'ADMIN', 'ADMIN')
        setattr(user, user_type_field.name, user_type_value)

if password:
    user.set_password(password)

user.save()
print(f"Superuser {email} ensured")
PY
fi

echo "Starting application..."
exec "$@"
