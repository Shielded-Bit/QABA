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
EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = getenv("EMAIL_HOST")
EMAIL_PORT = int(getenv("EMAIL_PORT"))
EMAIL_USE_TLS = getenv("EMAIL_USE_TLS")
EMAIL_HOST_USER = getenv("EMAIL_HOST_USER")
EMAIL_HOST_PASSWORD = getenv("EMAIL_HOST_PASSWORD")
DEFAULT_FROM_EMAIL = getenv("DEFAULT_FROM_EMAIL")

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}
