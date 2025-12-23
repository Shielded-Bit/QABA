# QABA Backend Architecture

This document explains how the QABA real-estate backend is structured, what each module does, and how the main workflows run. It is written for non-technical stakeholders who need a clear view of the system and its capabilities.

## Platform Overview
- Django 5 + Django REST Framework API serving all client applications.
- PostgreSQL in production (SQLite for local development).
- JWT-based authentication with optional Google sign-in; two-factor enforced for the Django admin.
- Media and document storage on Cloudinary (local filesystem in development).
- Payment processing via Flutterwave with webhooks and manual offline verification.
- Microsoft Graph for outbound email (OTP, notifications, contact forms, receipts).
- Auto-generated API docs at `/docs` (Swagger UI) and `/schema` (OpenAPI JSON).

## Runtime & Configuration
- **Settings profiles**: `core.settings.development` (debug, SQLite, console email, local files) and `core.settings.production` (PostgreSQL, Cloudinary static/media, security headers).
- **URLs**: Health check at `/health/`; API mounted at `/api/v1/`; admin (2FA protected) at `/admin/`.
- **Static/Media**: Whitenoise serves static assets; media and large uploads go to Cloudinary with per-domain folders (`users`, `properties`, `jobs`).
- **CORS**: Locked down in production via `CORS_ALLOWED_ORIGINS`; fully open in development.

## Domain Modules & Capabilities
### Users & Accounts (`apps.users`)
- Custom email-first user model with roles: Admin, Client, Agent, Landlord.
- Auth flows: email/password with JWT (access/refresh), Google OAuth sign-in, logout/blacklist, token refresh.
- Email verification and password reset via OTP codes; Microsoft Graph delivers templated emails.
- Profiles per role (client/agent/landlord/admin) with Cloudinary-hosted avatars.
- Referrals tracking (marketing source), notifications store, and contact form submission that emails admins and optionally confirms to the sender.
- Property survey meetings: clients schedule property viewings; system prevents duplicate active bookings per property, emails client/ops, and tracks status (pending/confirmed/cancelled/etc.).
- Two-factor authentication for staff/admin via `django-otp`/`django-two-factor-auth` on the admin site.

### Properties & Listings (`apps.properties`)
- Property listings with typed inventory (sale/rent), status (available/sold/rented), and publishing states (draft/pending/approved/declined).
- Automatic `slug` and human-readable `property_id` generation for shareable URLs.
- Media: multiple images, single video, and structured document uploads (deeds, permits, survey plans, etc.) with verification flags.
- Rich listing data: amenities, location (state/city), pricing (sale, rent + frequency, service/caution/legal fees), verification flag, and ownership metadata (lister vs. owner).
- Search & discovery: filter by type/listing/status/bed/bath/location, price ranges, free-text search, ordering, and related property suggestions on detail view.
- User engagement: favorites, property reviews with admin approval, and analytics dashboards for agents (monthly/yearly volume, revenue, publish vs. pending, sold/rented counts).

### Payments & Transactions (`apps.transactions`)
- Online payments through Flutterwave: API initiates payment, redirects user, and stores a pending transaction.
- Webhook handling to confirm payments and update property availability (sold/rented) on success; retries verification endpoint available.
- Offline payments: users upload receipts; transactions remain pending until an admin verifies them, with audit fields for verifier and timestamp.
- Transaction ledger supports filtering by status and payment method, storing references for reconciliation.

### Content (`apps.blogs` and `apps.jobs`)
- **Blogs**: tagged posts with draft/published/archived states, featured flag, cover images, and estimated reading time.
- **Jobs**: career listings with types (full-time/part-time/internship), locations, categories, and applicant submissions (CV uploads to Cloudinary).

## Cross-Cutting Concerns
- **API responses & errors**: centralized helpers in `core.utils.response` and a custom DRF exception handler ensure consistent payloads.
- **Permissions**: JWT auth by default; granular role checks for listing creation, document management, analytics, and survey scheduling.
- **Validation & safety**: server-side uniqueness constraints (reviews, favorites, survey meetings), and data guards in serializers/models (e.g., property existence, scheduled times in the future).
- **Observability**: lightweight `/health/` endpoint for uptime probes.

## Key Workflows (How It Runs)
1) **User onboarding & verification**
   - Registration (role-scoped) issues OTP email; account stays inactive until verified.
   - Google sign-in creates or reactivates a verified account and backfills profile photos when available.
   - JWT tokens power API access; refresh/blacklist endpoints manage sessions.
2) **Listing lifecycle**
   - Agents/Landlords/Admins create listings with media; system generates `slug` and `property_id`.
   - Listings start as draft/pending; approved listings become publicly visible and filterable. Verification flag and document uploads support due diligence.
   - Reviews submitted by clients are moderated before being shown; ratings roll up to averages and breakdowns on each property.
3) **Payments**
   - Online: initiate payment → user pays via Flutterwave → webhook confirms → property status flips to sold/rented and transaction is marked successful.
   - Offline: user uploads receipt → transaction pending → admin verification sets status and (optionally) updates property availability.
4) **Engagement & support**
   - Favorites let clients save listings.
   - Contact form emails ops with optional property context and confirms receipt to the sender.
   - Survey meetings coordinate on-site visits, notify both client and admin, and prevent duplicate active bookings.
5) **Content & hiring**
   - Blogs and job posts are managed via APIs/admin; job applications carry uploaded CVs and applicant details.

## Deployment Notes
- Default WSGI entrypoint: `core.wsgi.application`; gunicorn recommended in production.
- Environment essentials: database credentials, `SECRET_KEY`, JWT lifetimes, CORS/ALLOWED_HOSTS, Cloudinary keys, Flutterwave keys/hashes, Microsoft Graph credentials, and frontend/backends URLs for links in emails.
- Static build artifacts served by Whitenoise (dev) or Cloudinary (prod); media always persisted to Cloudinary in production.
