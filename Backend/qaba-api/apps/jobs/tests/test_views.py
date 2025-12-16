import pytest
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework import status

from apps.jobs.models import Job, JobForm


@pytest.mark.django_db
def test_job_list_returns_active_only(api_client, create_job):
    """List endpoint should return only active jobs."""
    active = create_job(title="Active Role")
    create_job(title="Inactive Role", status=Job.Status.INACTIVE)

    response = api_client.get("/api/v1/jobs/")

    assert response.status_code == status.HTTP_200_OK
    titles = [item["title"] for item in response.data]
    assert titles == ["Active Role"]
    assert all(item["status"] == Job.Status.ACTIVE for item in response.data)


@pytest.mark.django_db
def test_job_application_create_success(api_client, create_job):
    """Posting a job application should create JobForm and return 201."""
    job = create_job()
    cv = SimpleUploadedFile("cv.pdf", b"dummy", content_type="application/pdf")
    payload = {
        "email": "candidate@test.com",
        "first_name": "Jane",
        "last_name": "Doe",
        "phone_number": "5551234",
        "year_of_exp": 5,
        "degree": "MSc",
        "bio": "Motivated engineer",
        "cv": cv,
    }

    response = api_client.post(
        f"/api/v1/jobs/{job.id}/applications/",
        data=payload,
        format="multipart",
    )

    assert response.status_code == status.HTTP_201_CREATED
    assert JobForm.objects.filter(job=job, email="candidate@test.com").exists()
    assert response.data["message"] == "Job application submitted successfully"


@pytest.mark.django_db
def test_job_application_not_found(api_client):
    """Applying to a non-existent job should return 404."""
    response = api_client.post(
        "/api/v1/jobs/999/applications/",
        data={"email": "test@test.com"},
        format="multipart",
    )

    assert response.status_code == status.HTTP_404_NOT_FOUND
