from .base import *

# Development settings
DEBUG = True

ALLOWED_HOSTS = ["localhost", "127.0.0.1"]

# Database configuration for development
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}

# Static files (CSS, JavaScript, Images)
STATIC_URL = "/static/"

# Additional development-specific settings can be added here
