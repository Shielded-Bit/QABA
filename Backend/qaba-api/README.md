# README.md

# Django Real Estate API

This project is a backend API for a real estate platform built using Django and Django REST Framework. It provides endpoints for managing users and properties.

## Project Structure

```
django-real-estate-api
├── src
│   ├── manage.py
│   ├── core
│   │   ├── __init__.py
│   │   ├── settings
│   │   │   ├── __init__.py
│   │   │   ├── base.py
│   │   │   ├── development.py
│   │   │   └── production.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── apps
│   │   ├── users
│   │   │   ├── __init__.py
│   │   │   ├── models.py
│   │   │   ├── serializers.py
│   │   │   ├── urls.py
│   │   │   └── views.py
│   │   ├── properties
│   │   │   ├── __init__.py
│   │   │   ├── models.py
│   │   │   ├── serializers.py
│   │   │   ├── urls.py
│   │   │   └── views.py
│   ├── tests
│   │   └── __init__.py
├── requirements
│   ├── base.txt
│   ├── development.txt
│   └── production.txt
├── .env.example
├── .gitignore
└── README.md
```

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd django-real-estate-api
   ```

2. **Create a virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements/base.txt
   ```

4. **Set up environment variables:**
   Copy `.env.example` to `.env` and fill in the required values.

5. **Run migrations:**
   ```bash
   python src/manage.py migrate
   ```

6. **Run the development server:**
   ```bash
   python src/manage.py runserver
   ```

## Usage

- The API provides endpoints for user registration, authentication, and property management.
- Refer to the API documentation for detailed usage instructions.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.