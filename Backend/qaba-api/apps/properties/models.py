import uuid

from cloudinary.models import CloudinaryField
from django.conf import settings
from django.db import models
from django.utils.text import slugify
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
        SELF_CONTAIN = "SELF_CONTAIN", "Self Contain"
        DUPLEX = "DUPLEX", "Duplex"
        SEMI_DETACHED = "SEMI_DETACHED", "Semi Detached"
        FULL_DETACHED = "FULL_DETACHED", "Full Detached"
        ONE_BEDROOM_FLAT = "ONE_BEDROOM_FLAT", "One Bedroom Flat"
        TWO_BEDROOM_FLAT = "TWO_BEDROOM_FLAT", "Two Bedroom Flat"
        THREE_BEDROOM_FLAT = "THREE_BEDROOM_FLAT", "Three Bedroom Flat"
        FOUR_BEDROOM_FLAT = "FOUR_BEDROOM_FLAT", "Four Bedroom Flat"
        WAREHOUSE = "WAREHOUSE", "Warehouse"
        EMPTY_LAND = "EMPTY_LAND", "Empty Land"
        LAND_WITH_BUILDING = "LAND_WITH_BUILDING", "Land with Building"

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

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    property_name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True, null=True)
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
    state = models.CharField(
        max_length=100,
        help_text="State where the property is located",
        null=True,
        blank=True,
    )
    city = models.CharField(
        max_length=100,
        help_text="City where the property is located",
        null=True,
        blank=True,
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

    listed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="properties",
        limit_choices_to={"user_type__in": ["ADMIN", "AGENT", "LANDLORD"]},
    )

    rent_frequency = models.CharField(
        max_length=10,
        choices=RentFrequency.choices,
        null=True,
        blank=True,
        help_text="Frequency of rent payment (applicable for rental listings)",
    )
    rent_price = models.FloatField(
        null=True,
        blank=True,
        help_text="Rent price (applicable for rental listings)",
    )
    agent_commission = models.FloatField(
        null=True,
        blank=True,
        help_text="Agent commission percentage",
    )
    qaba_fee = models.FloatField(
        null=True,
        blank=True,
        help_text="Qaba fee percentage",
    )
    service_charge = models.FloatField(
        null=True,
        blank=True,
        help_text="Optional service charge applied to the property",
    )
    caution_fee = models.FloatField(
        null=True,
        blank=True,
        help_text="Optional caution fee required for the property",
    )
    legal_fee = models.FloatField(
        null=True,
        blank=True,
        help_text="Optional legal fee applied to the property",
    )
    total_price = models.FloatField(
        null=True,
        blank=True,
        help_text="Total price",
    )
    sale_price = models.FloatField(
        null=True,
        blank=True,
        help_text="Sale price",
    )
    is_verified = models.BooleanField(
        default=False, help_text="Indicates if the property has been verified by admin"
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

    @property
    def average_rating(self):
        """Calculate average rating from approved reviews"""
        approved_reviews = self.reviews.filter(
            status=PropertyReview.ReviewStatus.APPROVED
        )
        if approved_reviews.exists():
            return approved_reviews.aggregate(avg_rating=models.Avg("rating"))[
                "avg_rating"
            ]
        return 0

    @property
    def total_reviews(self):
        """Get total count of approved reviews"""
        return self.reviews.filter(status=PropertyReview.ReviewStatus.APPROVED).count()

    @property
    def rating_breakdown(self):
        """Get breakdown of ratings"""
        approved_reviews = self.reviews.filter(
            status=PropertyReview.ReviewStatus.APPROVED
        )
        breakdown = {}
        for i in range(1, 6):
            breakdown[f"{i}_star"] = approved_reviews.filter(rating=i).count()
        return breakdown

    @property
    def lister_type(self):
        """Get the type of lister"""
        return self.listed_by.user_type

    def save(self, *args, **kwargs):
        base_slug = slugify(self.property_name) or "property"

        if not self.slug or not str(self.slug).startswith(base_slug):
            self.slug = self._generate_unique_slug(base_slug)

        super().save(*args, **kwargs)

    def _generate_unique_slug(self, base_slug):
        """Generate a unique slug based on the property name"""
        slug = base_slug
        counter = 1

        while Property.objects.exclude(pk=self.pk).filter(slug=slug).exists():
            slug = f"{base_slug}-{counter}"
            counter += 1

        return slug


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


class Favorite(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="favorites",
    )
    property = models.ForeignKey(
        Property, on_delete=models.CASCADE, related_name="favorited_by"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Favorite Property"
        verbose_name_plural = "Favorite Properties"
        unique_together = ["user", "property"]
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user.email} favorited {self.property.property_name}"


class PropertyDocument(models.Model):
    """Model for property documents"""

    class DocumentType(models.TextChoices):
        DEED = "DEED", "Deed"
        TITLE = "TITLE", "Title Certificate"
        PERMIT = "PERMIT", "Building Permit"
        SURVEY = "SURVEY", "Survey Plan"
        LAND_USE = "LAND_USE", "Land Use Approval"
        TAX = "TAX", "Tax Receipt"
        FLOOR_PLAN = "FLOOR_PLAN", "Floor Plan"
        UTILITY = "UTILITY", "Utility Bills"
        OTHER = "OTHER", "Other Document"

    property = models.ForeignKey(
        Property, on_delete=models.CASCADE, related_name="documents"
    )
    document_type = models.CharField(
        max_length=20, choices=DocumentType.choices, default=DocumentType.OTHER
    )
    file = CloudinaryField(
        "document",
        folder=settings.CLOUDINARY_FOLDERS.get(
            "property_documents", "property_documents"
        ),
        resource_type="auto",
        help_text=_("Upload a document for the property (PDF, DOC, etc.)"),
    )
    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        related_name="uploaded_documents",
        null=True,
    )
    is_verified = models.BooleanField(
        default=False, help_text="Indicates if the document has been verified by admin"
    )
    uploaded_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Property Document"
        verbose_name_plural = "Property Documents"
        ordering = ["-uploaded_at"]

    def __str__(self):
        return f"{self.get_document_type_display()} - {self.property.property_name}"


class PropertyReview(models.Model):
    class Rating(models.IntegerChoices):
        ONE_STAR = 1, "1 Star"
        TWO_STARS = 2, "2 Stars"
        THREE_STARS = 3, "3 Stars"
        FOUR_STARS = 4, "4 Stars"
        FIVE_STARS = 5, "5 Stars"

    class ReviewStatus(models.TextChoices):
        PENDING = "PENDING", "Pending Review"
        APPROVED = "APPROVED", "Approved"
        REJECTED = "REJECTED", "Rejected"

    reviewed_property = models.ForeignKey(
        Property, on_delete=models.CASCADE, related_name="reviews"
    )
    reviewer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="property_reviews",
    )
    rating = models.IntegerField(
        choices=Rating.choices, help_text="Rating from 1 to 5 stars"
    )
    comment = models.TextField(help_text="Review comment")
    status = models.CharField(
        max_length=10, choices=ReviewStatus.choices, default=ReviewStatus.PENDING
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    approved_at = models.DateTimeField(null=True, blank=True)
    approved_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="approved_reviews",
    )

    class Meta:
        unique_together = ["reviewed_property", "reviewer"]  # Update this too
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.reviewer.get_full_name()} - {self.reviewed_property.property_name} ({self.rating} stars)"

    @property
    def is_approved(self):
        return self.status == self.ReviewStatus.APPROVED
