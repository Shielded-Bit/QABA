import pytest
from datetime import date, time, timedelta

from django.utils import timezone
from rest_framework import status


@pytest.mark.django_db
class TestPropertySurveyMeetingCreateView:
    """Tests for POST /api/v1/survey-meetings/create/"""

    url = "/api/v1/survey-meetings/create/"

    @pytest.fixture
    def mock_property(self, mocker):
        """Mock property for survey meeting tests."""
        mock_property_obj = mocker.MagicMock()
        mock_property_obj.id = 1
        mock_property_obj.listing_status = "APPROVED"
        mock_property_obj.property_name = "Test Property"
        mock_property_obj.location = "Test Location"
        mock_property_obj.listed_by = mocker.MagicMock()
        mock_property_obj.listed_by.get_full_name.return_value = "Agent Name"
        mock_property_obj.listed_by.email = "agent@test.com"

        # Mock Property.objects.get
        mocker.patch(
            "apps.properties.models.Property.objects.get",
            return_value=mock_property_obj,
        )
        return mock_property_obj

    def test_create_survey_meeting_success(
        self,
        auth_client,
        client_user,
        mock_property,
        mock_send_survey_meeting_notification,
    ):
        """Test authenticated user can create a survey meeting."""
        future_date = (timezone.now() + timedelta(days=7)).date()
        client = auth_client(client_user)
        response = client.post(
            self.url,
            {
                "property_id": "1",
                "scheduled_date": future_date.isoformat(),
                "scheduled_time": "10:00:00",
                "message": "I would like to view this property.",
            },
            format="json",
        )
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data["success"] is True

    def test_create_survey_meeting_past_date_fails(
        self, auth_client, client_user, mock_property
    ):
        """Test survey meeting with past date fails."""
        past_date = (timezone.now() - timedelta(days=1)).date()
        client = auth_client(client_user)
        response = client.post(
            self.url,
            {
                "property_id": "1",
                "scheduled_date": past_date.isoformat(),
                "scheduled_time": "10:00:00",
            },
            format="json",
        )
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_create_survey_meeting_outside_business_hours_fails(
        self, auth_client, client_user, mock_property
    ):
        """Test survey meeting outside business hours (9AM-6PM) fails."""
        future_date = (timezone.now() + timedelta(days=7)).date()
        client = auth_client(client_user)
        response = client.post(
            self.url,
            {
                "property_id": "1",
                "scheduled_date": future_date.isoformat(),
                "scheduled_time": "07:00:00",  # Before 9 AM
            },
            format="json",
        )
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_create_survey_meeting_too_far_future_fails(
        self, auth_client, client_user, mock_property
    ):
        """Test survey meeting more than 6 months in future fails."""
        far_future_date = (timezone.now() + timedelta(days=200)).date()
        client = auth_client(client_user)
        response = client.post(
            self.url,
            {
                "property_id": "1",
                "scheduled_date": far_future_date.isoformat(),
                "scheduled_time": "10:00:00",
            },
            format="json",
        )
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_create_survey_meeting_unauthenticated(self, api_client):
        """Test unauthenticated user cannot create survey meeting."""
        future_date = (timezone.now() + timedelta(days=7)).date()
        response = api_client.post(
            self.url,
            {
                "property_id": "1",
                "scheduled_date": future_date.isoformat(),
                "scheduled_time": "10:00:00",
            },
            format="json",
        )
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_create_survey_meeting_nonexistent_property_fails(
        self, auth_client, client_user, mocker
    ):
        """Test survey meeting for non-existent property fails."""
        from apps.properties.models import Property

        mocker.patch(
            "apps.properties.models.Property.objects.get",
            side_effect=Property.DoesNotExist,
        )

        future_date = (timezone.now() + timedelta(days=7)).date()
        client = auth_client(client_user)
        response = client.post(
            self.url,
            {
                "property_id": "99999",
                "scheduled_date": future_date.isoformat(),
                "scheduled_time": "10:00:00",
            },
            format="json",
        )
        assert response.status_code == status.HTTP_400_BAD_REQUEST
