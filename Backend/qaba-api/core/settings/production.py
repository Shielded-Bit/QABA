from os import getenv

from .base import *

# Production settings
DEBUG = getenv("DEBUG", "False") == "True"

# Hosts and CORS/CSRF
ALLOWED_HOSTS = [h for h in getenv("ALLOWED_HOSTS", "").split(",") if h]
CSRF_TRUSTED_ORIGINS = [o for o in getenv("CSRF_TRUSTED_ORIGINS", "").split(",") if o]

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

# CORS Settings
CORS_ALLOW_ALL_ORIGINS = False
CORS_ALLOWED_ORIGINS = [o for o in getenv("CORS_ALLOWED_ORIGINS", "").split(",") if o]
CORS_ALLOWED_ORIGIN_REGEXES = []

# Security settings
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True

# Respect X-Forwarded-Proto when behind a reverse proxy (e.g., Nginx Proxy Manager)
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")

# Additional security headers
SECURE_HSTS_SECONDS = 31536000  # 1 year
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True

EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = getenv("EMAIL_HOST")
EMAIL_PORT = int(getenv("EMAIL_PORT", 587))
EMAIL_USE_TLS = getenv("EMAIL_USE_TLS", "True") == "True"
EMAIL_HOST_USER = getenv("EMAIL_HOST_USER")
EMAIL_HOST_PASSWORD = getenv("EMAIL_HOST_PASSWORD")
DEFAULT_FROM_EMAIL = getenv("DEFAULT_FROM_EMAIL")

STATICFILES_STORAGE = "cloudinary_storage.storage.StaticHashedCloudinaryStorage"
