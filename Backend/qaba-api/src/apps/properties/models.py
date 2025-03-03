from django.conf import settings
from django.db import models


class Property(models.Model):
    class PropertyType(models.TextChoices):
        HOUSE = "HOUSE", "House"
        APARTMENT = "APARTMENT", "Apartment"
        LAND = "LAND", "Land"

    class PropertyStatus(models.TextChoices):
        AVAILABLE = "AVAILABLE", "Available"
        PENDING = "PENDING", "Pending"
        SOLD = "SOLD", "Sold"
        RENTED = "RENTED", "Rented"
        APPROVED = "APPROVED", "Approved"
        DECLINED = "DECLINED", "Declined"
        DRAFT = "DRAFT", "Draft"

    class ListingType(models.TextChoices):
        SALE = "SALE", "Sale"
        RENT = "RENT", "Rent"

    title = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=12, decimal_places=2)
    property_type = models.CharField(max_length=20, choices=PropertyType.choices)
    listing_type = models.CharField(max_length=10, choices=ListingType.choices)
    location = models.CharField(max_length=255)
    status = models.CharField(
        max_length=10, choices=PropertyStatus.choices, default=PropertyStatus.DRAFT
    )
    bedrooms = models.PositiveIntegerField(null=True, blank=True)
    bathrooms = models.PositiveIntegerField(null=True, blank=True)
    area_sqft = models.FloatField(null=True, blank=True)
    listed_date = models.DateTimeField(auto_now_add=True)

    # Only Agent or Admin can create properties
    listed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="properties",
        limit_choices_to={"user_type__in": ["ADMIN", "AGENT"]},
    )

    def __str__(self):
        return f"{self.title} - {self.location} ({self.get_property_type_display()})"


class PropertyImage(models.Model):
    property = models.ForeignKey(
        Property, on_delete=models.CASCADE, related_name="images"
    )
    image = models.ImageField(upload_to="property_images/")
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Image for {self.property.title}"
