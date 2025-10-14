from datetime import timedelta
from os import getenv
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent.parent

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = getenv("SECRET_KEY", "your-default-secret-key")
SECRET_KEY_FALLBACKS = getenv("SECRET_KEY_FALLBACKS", "").split(",")

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = getenv("DEBUG", "False") == "True"

STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"


# Static files (CSS, JavaScript, Images)
STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
STATICFILES_DIRS = [BASE_DIR / "static"]

# Media files
MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

ALLOWED_HOSTS = getenv("ALLOWED_HOSTS", "127.0.0.1").split(",")

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

AUTH_USER_MODEL = "users.User"

# Pricing configuration
def _get_percentage(env_name: str, default: str) -> float:
    raw_value = getenv(env_name, default)
    try:
        value = float(raw_value)
    except (TypeError, ValueError):
        value = float(default)
    return value / 100 if value > 1 else value


QABA_RENT_PERCENTAGE = _get_percentage("QABA_RENT_PERCENTAGE", "0.05")
AGENT_RENT_COMMISSION_PERCENTAGE = _get_percentage(
    "AGENT_RENT_COMMISSION_PERCENTAGE", "0.10"
)
QABA_SALE_PERCENTAGE = _get_percentage("QABA_SALE_PERCENTAGE", "0.05")
AGENT_SALE_COMMISSION_PERCENTAGE = _get_percentage(
    "AGENT_SALE_COMMISSION_PERCENTAGE", "0.10"
)

# Application definition
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    # Third-party apps
    "corsheaders",  # Add this line
    "django_otp",
    "django_otp.plugins.otp_static",
    "django_otp.plugins.otp_totp",
    "two_factor",
    "rest_framework",  # Django REST framework
    "rest_framework_simplejwt",  # Django REST framework JWT
    "drf_spectacular",  # drf-spectacular
    "cloudinary",  # Cloudinary
    "cloudinary_storage",  # Cloudinary Storage
    # Local apps
    "apps.users",  # Custom user app
    "apps.properties",  # Properties app
    "apps.transactions",  # Transactions app
    "apps.blogs",
    "apps.jobs",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django_otp.middleware.OTPMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "core.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "core.wsgi.application"

PASSWORD_RESET_TIMEOUT = int(getenv("PASSWORD_RESET_TIMEOUT", 3600))

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]

# Internationalization
LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_L10N = True
USE_TZ = True

REST_FRAMEWORK = {
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated",
    ],
    "EXCEPTION_HANDLER": "core.utils.exception_handler.custom_exception_handler",
}

# drf-spectacular settings
SPECTACULAR_SETTINGS = {
    "TITLE": "QABA API",
    "DESCRIPTION": "QABA Real Estate Platform API documentation",
    "VERSION": "1.0.0",
    "SERVE_INCLUDE_SCHEMA": False,
    "AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "SWAGGER_UI_SETTINGS": {
        "persistAuthorization": True,
    },
    "UPLOAD_FILES_USING_FORM": True,
    "COMPONENT_SPLIT_REQUEST": True,
}

# JWT Settings
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(
        hours=int(getenv("ACCESS_TOKEN_LIFETIME", "24"))
    ),
    "REFRESH_TOKEN_LIFETIME": timedelta(
        days=int(getenv("REFRESH_TOKEN_LIFETIME", "30"))
    ),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
    "AUTH_HEADER_TYPES": ("Bearer",),
}

AUTHENTICATION_BACKENDS = [
    "core.utils.email_backend.EmailBackend",
    "django.contrib.auth.backends.ModelBackend",
]

LOGIN_URL = "two_factor:login"
LOGIN_REDIRECT_URL = "admin:index"

OTP_TOTP_ISSUER = getenv("OTP_TOTP_ISSUER", "QABA Admin")

TWO_FACTOR_PATCH_ADMIN = True

FRONTEND_URL = getenv("FRONTEND_URL", "http://localhost:3000")
BACKEND_URL = getenv("BACKEND_URL", "http://localhost:8000")

MICROSOFT_TENANT_ID = getenv("MICROSOFT_TENANT_ID", "")
MICROSOFT_CLIENT_ID = getenv("MICROSOFT_CLIENT_ID", "")
MICROSOFT_CLIENT_SECRET = getenv("MICROSOFT_CLIENT_SECRET", "")
MICROSOFT_SENDER_EMAIL = getenv("MICROSOFT_SENDER_EMAIL", getenv("DEFAULT_FROM_EMAIL", ""))
MICROSOFT_GRAPH_SCOPE = getenv(
    "MICROSOFT_GRAPH_SCOPE", "https://graph.microsoft.com/.default"
)
DEFAULT_FROM_EMAIL = getenv("DEFAULT_FROM_EMAIL", "")

GOOGLE_CLIENT_ID = getenv("GOOGLE_CLIENT_ID", "").strip()

CORS_ALLOW_CREDENTIALS = True
# Security Headers
CORS_ALLOW_METHODS = [
    "DELETE",
    "GET",
    "OPTIONS",
    "PATCH",
    "POST",
    "PUT",
]

CORS_ALLOW_HEADERS = [
    "accept",
    "accept-encoding",
    "authorization",
    "content-type",
    "dnt",
    "origin",
    "user-agent",
    "x-csrftoken",
    "x-requested-with",
]


# Set default file storage to Cloudinary for media files
DEFAULT_FILE_STORAGE = "cloudinary_storage.storage.MediaCloudinaryStorage"

# Use specific storage classes for different types of media
CLOUDINARY_STORAGE = {
    "CLOUD_NAME": getenv("CLOUDINARY_CLOUD_NAME", ""),
    "API_KEY": getenv("CLOUDINARY_API_KEY", ""),
    "API_SECRET": getenv("CLOUDINARY_API_SECRET", ""),
    "STATICFILES_MANIFEST_ROOT": STATIC_ROOT,
    # Folder settings for different media types
    "MEDIA_TAG": "media",
    "STATIC_TAG": "static",
}

# Set specific folders for different types of media
CLOUDINARY_FOLDERS = {
    "user_profiles": "qaba/users/profiles",
    "property_images": "qaba/properties/images",
    "property_videos": "qaba/properties/videos",
    "job_applications": "qaba/jobs/applications",
}

FLW_SECRET_KEY = getenv("FLW_SECRET_KEY", "your-default-secret-key")
PAYMENT_REDIRECT_URL = getenv("PAYMENT_REDIRECT_URL", "http://localhost:3000")
FLUTTERWAVE_SECRET_HASH = getenv("FLUTTERWAVE_SECRET_HASH", "your-default-secret-hash")
