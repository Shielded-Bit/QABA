import uuid

from apps.properties.models import Property
from apps.users.models import User
from cloudinary.models import CloudinaryField
from django.db import models


class Transaction(models.Model):
    """Model to track all payment transactions"""

    class Status(models.TextChoices):
        SUCCESSFUL = "successful", "Successful"
        FAILED = "failed", "Failed"
        PENDING = "pending", "Pending"  # For offline payments awaiting verification

    class PaymentMethod(models.TextChoices):
        ONLINE = "online", "Online Payment"
        OFFLINE = "offline", "Offline Payment"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="transactions"
    )
    property_obj = models.ForeignKey(
        Property,
        on_delete=models.SET_NULL,
        related_name="transactions",
        null=True,
        blank=True,
    )
    payment_method = models.CharField(
        max_length=10, choices=PaymentMethod.choices, default=PaymentMethod.ONLINE
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

    payment_receipt = CloudinaryField(
        "payment_receipts",
        null=True,
        blank=True,
        help_text="Upload payment receipt for offline payments",
    )
    verified_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="verified_transactions",
        help_text="Admin who verified the offline payment",
    )
    verified_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["user", "status"]),
            models.Index(fields=["property_obj"]),
            models.Index(fields=["payment_method", "status"]),
        ]

    def __str__(self):
        property_info = (
            f" for {self.property_obj.property_name}" if self.property_obj else ""
        )
        method = f" ({self.get_payment_method_display()})"
        return (
            f"{self.reference}{property_info}{method} - {self.amount} {self.currency}"
        )

    @property
    def is_offline_payment(self):
        return self.payment_method == self.PaymentMethod.OFFLINE

    @property
    def needs_verification(self):
        return self.is_offline_payment and self.status == self.Status.PENDING

    @property
    def property_type(self):
        """Get the property type if property_obj is set"""
        if self.property_obj:
            return self.property_obj.property_type
        return None
