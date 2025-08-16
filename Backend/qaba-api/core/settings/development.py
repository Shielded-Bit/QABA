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

# Database Configuration: default to SQLite, allow switching to Postgres via env
if getenv("DB_ENGINE", "django.db.backends.sqlite3") == "django.db.backends.postgresql":
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.postgresql",
            "NAME": getenv("DB_NAME", "qaba_db"),
            "USER": getenv("DB_USER", "qaba_user"),
            "PASSWORD": getenv("DB_PASSWORD", "qaba_password"),
            "HOST": getenv("DB_HOST", "db"),
            "PORT": getenv("DB_PORT", "5432"),
        }
    }
else:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": BASE_DIR / "db.sqlite3",
        }
    }
