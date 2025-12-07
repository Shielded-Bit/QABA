import pytest
from rest_framework import status


@pytest.mark.django_db
class TestContactFormView:
    """Tests for POST /api/v1/contact/"""

    url = "/api/v1/contact/"

    def test_contact_anonymous_success(self, api_client, mock_send_contact_form_email):
        """Test anonymous user can submit contact form."""
        response = api_client.post(
            self.url,
            {
                "name": "John Doe",
                "email": "john@test.com",
                "phone": "1234567890",
                "subject": "Test Subject",
                "message": "This is a test message.",
            },
            format="json",
        )
        assert response.status_code == status.HTTP_200_OK
        assert response.data["success"] is True

    def test_contact_anonymous_missing_name_fails(self, api_client):
        """Test anonymous user must provide name."""
        response = api_client.post(
            self.url,
            {
                "email": "john@test.com",
                "subject": "Test Subject",
                "message": "This is a test message.",
            },
            format="json",
        )
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_contact_anonymous_missing_email_fails(self, api_client):
        """Test anonymous user must provide email."""
        response = api_client.post(
            self.url,
            {
                "name": "John Doe",
                "subject": "Test Subject",
                "message": "This is a test message.",
            },
            format="json",
        )
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_contact_authenticated_success(
        self, auth_client, client_user, mock_send_contact_form_email
    ):
        """Test authenticated user can submit contact form without name/email."""
        client = auth_client(client_user)
        response = client.post(
            self.url,
            {
                "subject": "Test Subject",
                "message": "This is a test message from authenticated user.",
            },
            format="json",
        )
        assert response.status_code == status.HTTP_200_OK
        assert response.data["success"] is True

    def test_contact_missing_subject_fails(self, api_client):
        """Test contact form requires subject."""
        response = api_client.post(
            self.url,
            {
                "name": "John Doe",
                "email": "john@test.com",
                "message": "This is a test message.",
            },
            format="json",
        )
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_contact_missing_message_fails(self, api_client):
        """Test contact form requires message."""
        response = api_client.post(
            self.url,
            {
                "name": "John Doe",
                "email": "john@test.com",
                "subject": "Test Subject",
            },
            format="json",
        )
        assert response.status_code == status.HTTP_400_BAD_REQUEST
