import uuid

from apps.properties.models import Property
from apps.users.models import User
from django.db import models


class Transaction(models.Model):
    """Model to track all payment transactions"""

    class Status(models.TextChoices):
        SUCCESSFUL = "successful", "Successful"
        FAILED = "failed", "Failed"

    class PaymentType(models.TextChoices):
        PROPERTY_PURCHASE = "purchase", "Property Purchase"
        PROPERTY_RENT = "rent", "Property Rent"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="transactions"
    )
    property = models.ForeignKey(
        Property,
        on_delete=models.SET_NULL,
        related_name="transactions",
        null=True,
        blank=True,
    )
    payment_type = models.CharField(
        max_length=20, choices=PaymentType.choices, default=PaymentType.PROPERTY_RENT
    )
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default="NGN")
    reference = models.CharField(max_length=100, unique=True)
    tx_ref = models.CharField(max_length=100, unique=True)
    flw_ref = models.CharField(max_length=100, null=True, blank=True)
    status = models.CharField(
        max_length=10, choices=Status.choices, default=Status.FAILED
    )
    description = models.CharField(max_length=255, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        property_info = f" for {self.property.property_name}" if self.property else ""
        return f"{self.reference}{property_info} - {self.amount} {self.currency}"
