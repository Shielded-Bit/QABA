import pytest
from django.core.files.uploadedfile import SimpleUploadedFile

from apps.properties.models import Amenity, Property, PropertyDocument

pytest_plugins = ["apps.users.tests.conftest"]


@pytest.fixture(autouse=True)
def stub_cloudinary_upload(monkeypatch):
    """Prevent outbound Cloudinary calls during tests."""

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
    monkeypatch.setattr(
        "apps.properties.serializers.PropertyDocumentSerializer.get_file_url",
        lambda self, obj: "http://example.com/mock-file",
        raising=False,
    )
    return _fake_upload


@pytest.fixture
def amenity(db):
    """Create a default amenity for properties."""
    return Amenity.objects.create(name="Swimming Pool")


@pytest.fixture
def create_property(db, agent_user, amenity):
    """Factory to create a property with sensible defaults."""

    def _create_property(**kwargs):
        defaults = {
            "property_name": "Test Property",
            "description": "A nice place to live",
            "property_type": Property.PropertyType.HOUSE,
            "listing_type": Property.ListingType.SALE,
            "location": "123 Test Street",
            "state": "Test State",
            "city": "Test City",
            "sale_price": 150000,
            "listing_status": Property.ListingStatus.APPROVED,
            "property_status": Property.PropertyStatus.AVAILABLE,
            "listed_by": agent_user,
        }
        defaults.update(kwargs)
        property_obj = Property.objects.create(**defaults)

        if "amenities" in kwargs:
            property_obj.amenities.set(kwargs["amenities"])
        else:
            property_obj.amenities.add(amenity)

        return property_obj

    return _create_property


@pytest.fixture
def uploaded_file_factory():
    """Return a factory that builds small in-memory uploaded files."""

    def _build(name="document.pdf", content=b"dummy content"):
        return SimpleUploadedFile(
            name,
            content,
            content_type="application/pdf",
        )

    return _build


@pytest.fixture
def create_document(db, uploaded_file_factory):
    """Factory to create property documents."""

    def _create_document(property_obj, uploaded_by, **kwargs):
        filename = kwargs.pop("filename", "document.pdf")
        file_obj = uploaded_file_factory(name=filename)
        defaults = {
            "document_type": PropertyDocument.DocumentType.DEED,
            "file": file_obj,
            "is_verified": False,
        }
        defaults.update(kwargs)
        return PropertyDocument.objects.create(
            property=property_obj,
            uploaded_by=uploaded_by,
            **defaults,
        )

    return _create_document
