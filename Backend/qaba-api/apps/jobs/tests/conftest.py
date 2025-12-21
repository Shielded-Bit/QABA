import pytest

from apps.jobs.models import Job, JobForm

pytest_plugins = ["apps.users.tests.conftest"]


@pytest.fixture(autouse=True)
def stub_cloudinary_upload_jobs(monkeypatch):
    """Avoid external Cloudinary calls when uploading CVs."""

    def _fake_upload(*args, **kwargs):
        return {
            "url": "http://example.com/mock",
            "secure_url": "http://example.com/mock",
            "public_id": "mock-id",
            "version": "1",
        }

    def _fake_pre_save(self, model_instance, add):
        value = getattr(model_instance, self.attname)
        if hasattr(value, "name"):
            return value.name
        return value or "mock-file"

    monkeypatch.setattr("cloudinary.uploader.upload_resource", _fake_upload)
    monkeypatch.setattr("cloudinary.uploader.upload", _fake_upload)
    monkeypatch.setattr("cloudinary.models.CloudinaryField.pre_save", _fake_pre_save, raising=False)
    return _fake_upload


@pytest.fixture
def create_job(db):
    """Factory to create jobs."""

    def _create(**kwargs):
        defaults = {
            "title": "Software Engineer",
            "type": Job.Type.FULL_TIME,
            "category": "Engineering",
            "location": "Remote",
            "pay_range": "Negotiable",
            "description": "Write code",
            "requirement": "Experience required",
            "status": Job.Status.ACTIVE,
        }
        defaults.update(kwargs)
        return Job.objects.create(**defaults)

    return _create


@pytest.fixture
def create_job_form(db, create_job):
    """Factory to create job applications."""

    def _create(**kwargs):
        job = kwargs.pop("job", None) or create_job()
        defaults = {
            "email": "applicant@test.com",
            "first_name": "App",
            "last_name": "Licant",
            "phone_number": "1234567890",
            "year_of_exp": 3,
            "degree": "BSc",
            "bio": "Experienced developer",
            "cv": "mock-file.pdf",
        }
        defaults.update(kwargs)
        return JobForm.objects.create(job=job, **defaults)

    return _create
