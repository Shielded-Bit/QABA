from .base import *
from os import getenv

# Development settings
DEBUG = True

# Allow all origins in development
CORS_ALLOW_ALL_ORIGINS = True

# Database Configuration
# Use PostgreSQL for Docker, SQLite for local development
if getenv("DB_HOST"):
    # Docker/Production database setup
    DATABASES = {
        "default": {
            "ENGINE": getenv("DB_ENGINE", "django.db.backends.postgresql"),
            "NAME": getenv("DB_NAME", "qaba_db"),
            "USER": getenv("DB_USER", "qaba_user"),
            "PASSWORD": getenv("DB_PASSWORD", "qaba_password"),
            "HOST": getenv("DB_HOST", "db"),
            "PORT": getenv("DB_PORT", "5432"),
        }
    }
else:
    # Local development with SQLite
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": BASE_DIR / "db.sqlite3",
        }
    }
