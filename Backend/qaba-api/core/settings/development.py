from .base import *
from os import getenv

# Development settings
DEBUG = True

# Allow all origins and hosts in development
CORS_ALLOW_ALL_ORIGINS = True
ALLOWED_HOSTS = ["*"]

# Use local file storage in development to avoid external dependencies
DEFAULT_FILE_STORAGE = "django.core.files.storage.FileSystemStorage"

# Send emails to console in development
EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}
