from cloudinary.models import CloudinaryField
from django.conf import settings
from django.db import models
from django.utils.translation import gettext_lazy as _


class Amenity(models.Model):
    name = models.CharField(max_length=100, unique=True)
    code = models.CharField(max_length=50, unique=True)
    icon = models.CharField(
        max_length=50, blank=True, null=True, help_text="CSS icon class or code"
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Amenity"
        verbose_name_plural = "Amenities"
        ordering = ["name"]

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        # Ensure code is uppercase and uses underscores
        self.code = self.name.upper().replace(" ", "_")
        super().save(*args, **kwargs)


class Property(models.Model):
    class PropertyType(models.TextChoices):
        HOUSE = "HOUSE", "House"
        APARTMENT = "APARTMENT", "Apartment"
        LAND = "LAND", "Land"

    class ListingType(models.TextChoices):
        SALE = "SALE", "Sale"
        RENT = "RENT", "Rent"

    class PropertyStatus(models.TextChoices):
        AVAILABLE = "AVAILABLE", "Available"
        SOLD = "SOLD", "Sold"
        RENTED = "RENTED", "Rented"

    class ListingStatus(models.TextChoices):
        DRAFT = "DRAFT", "Draft"
        APPROVED = "APPROVED", "Approved"
        PENDING = "PENDING", "Pending"
        DECLINED = "DECLINED", "Declined"

    class RentFrequency(models.TextChoices):
        MONTHLY = "MONTHLY", "Monthly"
        YEARLY = "YEARLY", "Yearly"

    # Basic property fields
    property_name = models.CharField(max_length=255)
    description = models.TextField()
    property_type = models.CharField(max_length=20, choices=PropertyType.choices)
    listing_type = models.CharField(max_length=10, choices=ListingType.choices)
    location = models.CharField(max_length=255)
    property_status = models.CharField(
        max_length=10, choices=PropertyStatus.choices, default=PropertyStatus.AVAILABLE
    )
    listing_status = models.CharField(
        max_length=10, choices=ListingStatus.choices, default=ListingStatus.DRAFT
    )
    bedrooms = models.PositiveIntegerField(null=True, blank=True)
    bathrooms = models.PositiveIntegerField(null=True, blank=True)
    area_sqft = models.FloatField(null=True, blank=True)
    listed_date = models.DateTimeField(auto_now_add=True)
    amenities = models.ManyToManyField(
        Amenity,
        related_name="properties",
        blank=True,
        help_text=_("Amenities available with this property"),
    )

    # Only Agent or Admin can create properties
    listed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="properties",
        limit_choices_to={"user_type__in": ["ADMIN", "AGENT"]},
    )

    rent_frequency = models.CharField(
        max_length=10,
        choices=RentFrequency.choices,
        null=True,
        blank=True,
        help_text="Frequency of rent payment (applicable for rental listings)",
    )
    rent_price = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Rent price (applicable for rental listings)",
    )
    sale_price = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Sale price (applicable for sale listings)",
    )

    def has_amenity(self, amenity):
        """Check if property has a specific amenity"""
        return amenity in self.amenities

    def __str__(self):
        return f"{self.property_name} - {self.location} ({self.get_property_type_display()})"
    
    class Meta:
        verbose_name = "Property"
        verbose_name_plural = "Properties"
        ordering = ["-listed_date"]


class PropertyImage(models.Model):
    property = models.ForeignKey(
        Property, on_delete=models.CASCADE, related_name="images"
    )
    image = CloudinaryField(
        "image",
        folder=settings.CLOUDINARY_FOLDERS.get("property_images"),
        transformation={
            "quality": "auto:good",
            "crop": "limit",
            "width": 1920,
            "height": 1080,
        },
        format="webp",
        resource_type="image",
        help_text=_("Upload an image of the property"),
    )
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Image for {self.property.property_name}"


class PropertyVideo(models.Model):
    property = models.OneToOneField(
        Property, on_delete=models.CASCADE, related_name="video"
    )
    video = CloudinaryField(
        "video",
        folder=settings.CLOUDINARY_FOLDERS.get("property_videos"),
        resource_type="video",
        transformation={"quality": "auto:good", "format": "mp4"},
        help_text=_("Upload a video of the property (max 1 video per property)"),
    )
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Video for {self.property.property_name}"
