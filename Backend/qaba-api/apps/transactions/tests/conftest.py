import uuid

import pytest

from apps.transactions.models import Transaction

pytest_plugins = ["apps.users.tests.conftest", "apps.properties.tests.conftest"]


@pytest.fixture(autouse=True)
def stub_cloudinary_upload_transactions(monkeypatch):
    """Ensure Cloudinary uploads are stubbed in transaction tests."""

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
def create_transaction(db, create_property, client_user):
    """Factory to create transactions linked to a property."""

    def _create_transaction(**kwargs):
        property_obj = kwargs.pop("property_obj", None)
        if property_obj is None:
            property_kwargs = kwargs.pop("property_kwargs", {})
            property_obj = create_property(**property_kwargs)
        defaults = {
            "user": kwargs.pop("user", client_user),
            "property_obj": property_obj,
            "payment_method": Transaction.PaymentMethod.ONLINE,
            "amount": kwargs.pop(
                "amount",
                property_obj.sale_price or property_obj.total_price or 100000,
            ),
            "reference": kwargs.pop("reference", f"ref-{uuid.uuid4().hex[:8]}"),
            "tx_ref": kwargs.pop("tx_ref", f"tx-{uuid.uuid4().hex[:8]}"),
            "status": kwargs.pop("status", Transaction.Status.PENDING),
            "description": kwargs.pop("description", "Test transaction"),
        }
        defaults.update(kwargs)
        return Transaction.objects.create(**defaults)

    return _create_transaction
