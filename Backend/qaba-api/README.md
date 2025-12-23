# QABA Real Estate Platform — Backend API

Backend service for the QABA real-estate platform, built with Django and Django REST Framework. It powers authentication, property listings, payments, content, and operational tooling for agents, landlords, and clients.

## Tech Stack
- Django 5, Django REST Framework, SimpleJWT (JWT auth)
- PostgreSQL (production) / SQLite (local)
- Cloudinary for media/documents, Whitenoise for static assets
- Flutterwave for payments (online and offline flows)
- Microsoft Graph email for OTPs, notifications, and contact forms
- drf-spectacular for API schema and Swagger UI

## Project Layout
- `core/` – settings, URLs, utilities (responses, email, payments)
- `apps/users/` – custom user model, auth, profiles, referrals, survey meetings, contact forms
- `apps/properties/` – listings, media, documents, reviews, analytics, favorites
- `apps/transactions/` – payment and transaction ledger
- `apps/blogs/` – blog posts and tags
- `apps/jobs/` – career postings and applications
- `templates/email/` – transactional email templates

## Getting Started (Local)
Requirements: Python 3.11+, pip (or [uv](https://github.com/astral-sh/uv)), SQLite (default), optional Cloudinary account for media.

1) Clone and enter the project
```bash
git clone <repo-url>
cd Backend/qaba-api
```

2) Install dependencies (choose one)
```bash
# Using uv (fast, recommended)
uv sync

# Using pip
python -m venv .venv
source .venv/bin/activate
pip install -e ".[dev]"
```

3) Configure environment
Create a `.env` in `qaba-api/` (or export vars) for local defaults:
```
DEBUG=True
SECRET_KEY=dev-secret-key
ALLOWED_HOSTS=127.0.0.1,localhost
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:8000

# Optional integrations
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
FLW_SECRET_KEY=...
MICROSOFT_TENANT_ID=...
MICROSOFT_CLIENT_ID=...
MICROSOFT_CLIENT_SECRET=...
MICROSOFT_SENDER_EMAIL=...
GOOGLE_CLIENT_ID=...
```
The development settings use SQLite, serve files locally, and send emails to the console.

4) Run migrations and start the server
```bash
python manage.py migrate
python manage.py runserver
```
API base path: `http://localhost:8000/api/v1/`  
Docs/Swagger UI: `http://localhost:8000/docs/`  
Health check: `http://localhost:8000/health/`

5) Tests
```bash
pytest
```

## Additional Documentation
- Architecture and feature overview: `docs/ARCHITECTURE.md`

## Deployment Notes
- Use `core.settings.production` with PostgreSQL, Cloudinary static/media, and locked-down CORS/hosts.
- Run with a WSGI server such as `gunicorn core.wsgi:application`.
- Provide secrets for JWT, Flutterwave, Microsoft Graph email, and Cloudinary in the environment.
