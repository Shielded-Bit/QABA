from .base import *
from os import getenv

# Development settings
DEBUG = True

# Allow all origins in development
CORS_ALLOW_ALL_ORIGINS = True

# Database Configuration
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}
