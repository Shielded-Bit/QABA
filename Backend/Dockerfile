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

# Install uv (Python packaging tool)
RUN curl -LsSf https://astral.sh/uv/install.sh | sh
ENV PATH="/root/.local/bin:${PATH}"

# Copy dependency metadata and install locked production deps
COPY qaba-api/pyproject.toml qaba-api/uv.lock ./
RUN uv sync --frozen --no-dev

COPY ./start_docker.sh /start_docker.sh
RUN chmod +x /start_docker.sh

# Copy project
COPY qaba-api/ .

# Ensure the project virtualenv is used for all commands
ENV PATH="/app/.venv/bin:${PATH}"

# Create necessary directories
RUN mkdir -p /app/staticfiles /app/media

# Collect static files
RUN python manage.py collectstatic --noinput

# Expose port
EXPOSE 8000

# Set default Django settings module
ENV DJANGO_SETTINGS_MODULE=core.settings.production

RUN python manage.py collectstatic --noinput || true

CMD ["/start_docker.sh"]
