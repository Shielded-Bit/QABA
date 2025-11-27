import pytest
from rest_framework import status


@pytest.mark.django_db
class TestNotificationListView:
    """Tests for GET /api/v1/notifications/"""

    url = "/api/v1/notifications/"

    def test_list_notifications_success(
        self, auth_client, client_user, create_notification
    ):
        """Test user can list their notifications."""
        # Create some notifications for the user
        create_notification(client_user, message="Notification 1")
        create_notification(client_user, message="Notification 2")

        client = auth_client(client_user)
        response = client.get(self.url)
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 2

    def test_list_notifications_empty(self, auth_client, client_user):
        """Test user with no notifications gets empty list."""
        client = auth_client(client_user)
        response = client.get(self.url)
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 0

    def test_list_notifications_only_own(
        self, auth_client, client_user, agent_user, create_notification
    ):
        """Test user only sees their own notifications."""
        # Create notifications for different users
        create_notification(client_user, message="Client notification")
        create_notification(agent_user, message="Agent notification")

        client = auth_client(client_user)
        response = client.get(self.url)
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 1

    def test_list_notifications_unauthenticated(self, api_client):
        """Test unauthenticated user cannot access notifications."""
        response = api_client.get(self.url)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
class TestNotificationMarkReadView:
    """Tests for PUT /api/v1/notifications/<pk>/read/"""

    def test_mark_notification_read_success(
        self, auth_client, client_user, create_notification
    ):
        """Test user can mark notification as read."""
        notification = create_notification(client_user, is_read=False)
        url = f"/api/v1/notifications/{notification.id}/read/"

        client = auth_client(client_user)
        response = client.put(url)
        assert response.status_code == status.HTTP_200_OK
        assert response.data["success"] is True

        # Verify notification is marked as read
        notification.refresh_from_db()
        assert notification.is_read is True

    def test_mark_notification_not_found(self, auth_client, client_user):
        """Test marking non-existent notification returns 404."""
        url = "/api/v1/notifications/99999/read/"
        client = auth_client(client_user)
        response = client.put(url)
        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_mark_other_user_notification_forbidden(
        self, auth_client, client_user, agent_user, create_notification
    ):
        """Test user cannot mark another user's notification as read."""
        notification = create_notification(agent_user, is_read=False)
        url = f"/api/v1/notifications/{notification.id}/read/"

        client = auth_client(client_user)
        response = client.put(url)
        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_mark_notification_unauthenticated(
        self, api_client, client_user, create_notification
    ):
        """Test unauthenticated user cannot mark notification."""
        notification = create_notification(client_user)
        url = f"/api/v1/notifications/{notification.id}/read/"
        response = api_client.put(url)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
