from os import getenv

from .base import *

# Production settings
DEBUG = getenv("DEBUG", "False") == "True"

# Hosts and CORS/CSRF
ALLOWED_HOSTS = [h for h in getenv("ALLOWED_HOSTS", "").split(",") if h]
CSRF_TRUSTED_ORIGINS = [o for o in getenv("CSRF_TRUSTED_ORIGINS", "").split(",") if o]
CORS_ALLOW_ALL_ORIGINS = False
CORS_ALLOWED_ORIGINS = [o for o in getenv("CORS_ALLOWED_ORIGINS", "").split(",") if o]

# Database configuration
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": getenv("DB_NAME"),
        "USER": getenv("DB_USER"),
        "PASSWORD": getenv("DB_PASSWORD"),
        "HOST": getenv("DB_HOST"),
        "PORT": getenv("DB_PORT"),
    }
}

# When behind a reverse proxy/ingress that terminates TLS, keep redirect off here
SECURE_SSL_REDIRECT = False
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
USE_TZ = True
USE_X_FORWARDED_HOST = True

# HSTS (enable when serving strictly over HTTPS)
SECURE_HSTS_SECONDS = int(getenv("SECURE_HSTS_SECONDS", "31536000"))
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True

# Content security
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_BROWSER_XSS_FILTER = True

# Cookie security
SESSION_COOKIE_SECURE = False
CSRF_COOKIE_SECURE = False

STATICFILES_STORAGE = "cloudinary_storage.storage.StaticHashedCloudinaryStorage"
