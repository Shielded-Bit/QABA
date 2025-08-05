# Use Python 3.11 slim image
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    DEBIAN_FRONTEND=noninteractive

# Set work directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY qaba-api/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY ./start_docker.sh /start_docker.sh
RUN chmod +x /start_docker.sh

# Copy project
COPY qaba-api/ .

# Create necessary directories
RUN mkdir -p /app/staticfiles /app/media

# Collect static files
RUN python manage.py collectstatic --noinput

# Expose port
EXPOSE 8000

# Set default Django settings module
ENV DJANGO_SETTINGS_MODULE=core.settings.production

RUN python manage.py collectstatic --noinput || true
