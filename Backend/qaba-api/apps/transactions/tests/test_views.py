import pytest
from django.conf import settings
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework import status

from apps.properties.models import Property
from apps.transactions.models import Transaction


@pytest.mark.django_db
def test_initiate_property_payment_success(
    auth_client, agent_user, create_property, mocker
):
    """Initiating payment should create a pending transaction and return link."""
    property_obj = create_property(
        listed_by=agent_user,
        listing_type=Property.ListingType.SALE,
        sale_price=250000,
    )
    mock_init = mocker.patch(
        "apps.transactions.views.initialize_payment",
        return_value={
            "success": True,
            "tx_ref": "tx-12345",
            "payment_link": "https://pay.test/link",
            "flw_ref": "flw-1",
        },
    )

    response = auth_client(agent_user).post(
        "/api/v1/initiate-property-payment/",
        {"property_id": property_obj.id},
        format="json",
    )

    assert response.status_code == status.HTTP_200_OK
    mock_init.assert_called_once()

    transaction = Transaction.objects.get(tx_ref="tx-12345")
    assert transaction.amount == property_obj.sale_price
    assert transaction.status == Transaction.Status.PENDING
    assert response.data["data"]["payment_link"] == "https://pay.test/link"


@pytest.mark.django_db
def test_initiate_payment_rejects_unavailable_property(
    auth_client, agent_user, create_property, mocker
):
    property_obj = create_property(
        listed_by=agent_user,
        property_status=Property.PropertyStatus.SOLD,
    )
    mocker.patch(
        "apps.transactions.views.initialize_payment",
        return_value={"success": True, "tx_ref": "tx-123", "payment_link": "link"},
    )

    response = auth_client(agent_user).post(
        "/api/v1/initiate-property-payment/",
        {"property_id": property_obj.id},
        format="json",
    )

    assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
def test_offline_payment_success(
    auth_client,
    client_user,
    create_property,
    mocker,
):
    """Submitting offline payment should create pending offline transaction."""
    property_obj = create_property(
        listing_type=Property.ListingType.SALE,
        sale_price=300000,
        total_price=300000,
    )
    mocker.patch(
        "core.utils.send_email.send_offline_payment_notification",
        return_value={"success": True},
    )
    receipt = SimpleUploadedFile("receipt.pdf", b"receipt", content_type="application/pdf")

    response = auth_client(client_user).post(
        "/api/v1/offline-payment/",
        {"property_id": property_obj.id, "payment_receipt": receipt},
        format="multipart",
    )

    assert response.status_code == status.HTTP_200_OK
    transaction = Transaction.objects.get(property_obj=property_obj)
    assert transaction.payment_method == Transaction.PaymentMethod.OFFLINE
    assert transaction.status == Transaction.Status.PENDING
    assert transaction.needs_verification is True


@pytest.mark.django_db
def test_offline_payment_rejects_duplicate_pending(
    auth_client, client_user, create_property, create_transaction
):
    property_obj = create_property(
        listing_type=Property.ListingType.SALE, total_price=120000, sale_price=120000
    )
    create_transaction(
        user=client_user,
        property_obj=property_obj,
        payment_method=Transaction.PaymentMethod.OFFLINE,
        status=Transaction.Status.PENDING,
    )

    receipt = SimpleUploadedFile("receipt.pdf", b"receipt", content_type="application/pdf")
    response = auth_client(client_user).post(
        "/api/v1/offline-payment/",
        {"property_id": property_obj.id, "payment_receipt": receipt},
        format="multipart",
    )

    assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
def test_offline_payment_invalid_receipt_extension(
    auth_client, client_user, create_property
):
    property_obj = create_property(
        listing_type=Property.ListingType.SALE, total_price=100000, sale_price=100000
    )
    bad_receipt = SimpleUploadedFile("receipt.txt", b"bad", content_type="text/plain")

    response = auth_client(client_user).post(
        "/api/v1/offline-payment/",
        {"property_id": property_obj.id, "payment_receipt": bad_receipt},
        format="multipart",
    )

    assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
def test_verify_payment_success_updates_property(
    auth_client, client_user, create_transaction, mocker
):
    transaction = create_transaction(
        user=client_user,
        payment_method=Transaction.PaymentMethod.ONLINE,
        status=Transaction.Status.PENDING,
    )
    mocker.patch(
        "apps.transactions.views.verify_payment",
        return_value={"success": True, "status": "successful"},
    )

    response = auth_client(client_user).get(
        f"/api/v1/verify-payment/{transaction.tx_ref}/"
    )

    transaction.refresh_from_db()
    property_obj = transaction.property_obj

    assert response.status_code == status.HTTP_200_OK
    assert transaction.status == Transaction.Status.SUCCESSFUL
    if property_obj.listing_type == Property.ListingType.SALE:
        assert property_obj.property_status == Property.PropertyStatus.SOLD
    else:
        assert property_obj.property_status == Property.PropertyStatus.RENTED


@pytest.mark.django_db
def test_verify_payment_already_successful(auth_client, client_user, create_transaction):
    transaction = create_transaction(
        user=client_user,
        status=Transaction.Status.SUCCESSFUL,
    )

    response = auth_client(client_user).get(
        f"/api/v1/verify-payment/{transaction.tx_ref}/"
    )

    assert response.status_code == status.HTTP_200_OK
    assert response.data["message"] == "Transaction already successful"


@pytest.mark.django_db
def test_transaction_list_filters_by_status_and_method(
    auth_client, client_user, create_transaction, create_user
):
    successful = create_transaction(
        user=client_user,
        status=Transaction.Status.SUCCESSFUL,
        payment_method=Transaction.PaymentMethod.ONLINE,
    )
    create_transaction(
        user=client_user,
        status=Transaction.Status.PENDING,
        payment_method=Transaction.PaymentMethod.OFFLINE,
    )
    other_user = create_user("otheruser@test.com", user_type="CLIENT")
    create_transaction(
        user=other_user,
        status=Transaction.Status.SUCCESSFUL,
        payment_method=Transaction.PaymentMethod.ONLINE,
    )

    response = auth_client(client_user).get(
        "/api/v1/history/?status=successful&payment_method=online"
    )

    assert response.status_code == status.HTTP_200_OK
    ids = {tx["id"] for tx in response.data["data"]}
    assert str(successful.id) in ids
    assert len(ids) == 1


@pytest.mark.django_db
def test_flutterwave_webhook_updates_transaction(
    api_client, settings, create_transaction, create_property
):
    settings.FLUTTERWAVE_SECRET_HASH = "test-secret"
    property_obj = create_property(listing_type=Property.ListingType.RENT)
    transaction = create_transaction(
        tx_ref="tx-webhook",
        status=Transaction.Status.PENDING,
        property_obj=property_obj,
    )
    payload = {
        "event": "charge.completed",
        "data": {"tx_ref": "tx-webhook", "status": "successful"},
    }

    response = api_client.post(
        "/api/v1/webhooks/flutterwave/",
        data=payload,
        format="json",
        HTTP_VERIF_HASH="test-secret",
    )

    assert response.status_code == status.HTTP_200_OK
    transaction.refresh_from_db()
    property_obj = transaction.property_obj

    assert transaction.status == Transaction.Status.SUCCESSFUL
    assert property_obj.property_status == Property.PropertyStatus.RENTED


@pytest.mark.django_db
def test_flutterwave_webhook_missing_signature(api_client):
    response = api_client.post("/api/v1/webhooks/flutterwave/", data={"event": "charge.completed"})
    assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
def test_flutterwave_webhook_invalid_signature(api_client):
    response = api_client.post(
        "/api/v1/webhooks/flutterwave/",
        data={"event": "charge.completed"},
        HTTP_VERIF_HASH="invalid",
    )
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
