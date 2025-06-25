from apps.users.models import Notification, User
from apps.users.serializers import UserSerializer
from django.conf import settings
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from drf_spectacular.utils import extend_schema_field
from rest_framework import serializers

from .models import (
    Amenity,
    Favorite,
    Property,
    PropertyDocument,
    PropertyImage,
    PropertyReview,
    PropertyVideo,
)


class PropertyImageSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(write_only=True)
    image_url = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = PropertyImage
        fields = ["id", "image", "image_url", "uploaded_at"]

    def get_image_url(self, obj):
        if obj.image:
            return obj.image.url
        return None


class PropertyVideoSerializer(serializers.ModelSerializer):
    video = serializers.FileField(write_only=True)
    video_url = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = PropertyVideo
        fields = ["id", "video", "video_url", "uploaded_at"]

    def get_video_url(self, obj):
        if obj.video:
            return obj.video.url
        return None


class PropertyDocumentSerializer(serializers.ModelSerializer):
    document_type_display = serializers.CharField(
        source="get_document_type_display", read_only=True
    )
    file_url = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = PropertyDocument
        fields = [
            "id",
            "document_type",
            "document_type_display",
            "file_url",
            "is_verified",
            "uploaded_at",
        ]
        read_only_fields = ["is_verified", "uploaded_at"]

    def get_file_url(self, obj):
        if obj.file:
            return obj.file.url
        return None


class PropertyListSerializer(serializers.ModelSerializer):
    is_favorited = serializers.SerializerMethodField()

    property_type_display = serializers.CharField(
        source="get_property_type_display", read_only=True
    )
    listing_type_display = serializers.CharField(
        source="get_listing_type_display", read_only=True
    )
    property_status_display = serializers.CharField(
        source="get_property_status_display", read_only=True
    )
    listing_status_display = serializers.CharField(
        source="get_listing_status_display", read_only=True
    )
    lister_type_display = serializers.CharField(
        source="get_lister_type_display", read_only=True
    )

    listed_by = UserSerializer(read_only=True)
    thumbnail = serializers.SerializerMethodField()

    class Meta:
        model = Property
        fields = [
            "id",
            "property_name",
            "sale_price",
            "rent_price",
            "rent_frequency",
            "property_type",
            "property_type_display",
            "listing_type",
            "listing_type_display",
            "location",
            "state",
            "city",
            "property_status",
            "property_status_display",
            "listing_status",
            "listing_status_display",
            "listing_status_display",
            "lister_type",
            "lister_type_display",
            "bedrooms",
            "bathrooms",
            "area_sqft",
            "listed_date",
            "listed_by",
            "thumbnail",
            "is_favorited",
        ]

    @extend_schema_field(serializers.URLField(allow_null=True))
    def get_thumbnail(self, obj):
        image = obj.images.first()
        if image and hasattr(image.image, "url"):
            return self.context["request"].build_absolute_uri(image.image.url)
        return None

    @extend_schema_field(serializers.BooleanField())
    def get_is_favorited(self, obj):
        request = self.context.get("request", None)
        if request and request.user.is_authenticated and request.user.is_client:
            return obj.favorited_by.filter(user=request.user).exists()
        return False


class AmenitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Amenity
        fields = ["id", "name", "icon"]


class AmenityListField(serializers.ListField):
    """
    Custom field for amenity IDs with validation
    Handles both regular integer lists and comma-separated strings in a list
    """

    def __init__(self, **kwargs):
        child = serializers.CharField()  # Change to CharField to handle string input
        kwargs["child"] = child
        kwargs["write_only"] = True
        kwargs["required"] = False
        kwargs["help_text"] = "List of amenity IDs for this property"
        super().__init__(**kwargs)

    def to_internal_value(self, data):
        processed_data = []

        for item in data:
            if isinstance(item, str) and "," in item:
                parts = item.split(",")
                processed_data.extend([part.strip() for part in parts if part.strip()])
            else:
                processed_data.append(item)

        try:
            # Convert all values to integers
            values = [int(val) for val in processed_data if val]
        except (ValueError, TypeError):
            raise serializers.ValidationError(
                "Amenity IDs must be integers or comma-separated integers"
            )

        valid_amenity_ids = set(
            Amenity.objects.filter(is_active=True).values_list("id", flat=True)
        )
        invalid_ids = [
            amenity_id for amenity_id in values if amenity_id not in valid_amenity_ids
        ]

        if invalid_ids:
            raise serializers.ValidationError(
                f"Invalid amenity IDs: {', '.join(map(str, invalid_ids))}. "
                f"Please provide valid amenity IDs."
            )

        return values


class PropertyCreateSerializer(serializers.ModelSerializer):
    images = serializers.ListField(
        child=serializers.ImageField(),
        write_only=True,
        required=False,
        help_text="Upload up to 5 images for the property",
    )
    video = serializers.FileField(
        write_only=True,
        required=False,
        help_text="Upload a video for the property (optional)",
    )
    submit_for_review = serializers.BooleanField(
        default=False,
        help_text="Submit the property for review by the admin",
    )

    amenities_ids = AmenityListField()

    # Add documents field
    documents = serializers.ListField(
        child=serializers.FileField(), write_only=True, required=False
    )
    # Add document metadata
    document_types = serializers.ListField(
        child=serializers.CharField(),
        required=False,
        write_only=True,
    )

    class Meta:
        model = Property
        fields = [
            "property_name",
            "description",
            "sale_price",
            "property_type",
            "listing_type",
            "lister_type",
            "submit_for_review",
            "location",
            "state",
            "city",
            "bedrooms",
            "bathrooms",
            "amenities_ids",
            "area_sqft",
            "images",
            "video",
            "rent_frequency",
            "rent_price",
            "agent_commission",
            "qaba_fee",
            "total_price",
            "documents",
            "document_types",
        ]

    def validate_images(self, value):
        if len(value) > 5:
            raise serializers.ValidationError("You can upload a maximum of 5 images.")
        return value

    def validate_document_types(self, value):
        allowed_types = PropertyDocument.DocumentType
        for doc_type in value:
            if doc_type not in allowed_types:
                raise serializers.ValidationError(
                    f"Invalid document type: {doc_type}. Allowed types: {', '.join([t.name for t in allowed_types])}"
                )
        return value

    def validate(self, attrs):
        listing_type = attrs.get("listing_type")
        sale_price = attrs.get("sale_price")
        rent_price = attrs.get("rent_price")
        rent_frequency = attrs.get("rent_frequency")
        lister_type = attrs.get("lister_type")

        if listing_type == Property.ListingType.RENT:
            if not all([rent_price, rent_frequency]):
                raise serializers.ValidationError(
                    {
                        "rent_price": "Rent price and frequency are required for rental listings"
                    }
                )

        if listing_type == Property.ListingType.SALE:
            if not sale_price:
                raise serializers.ValidationError(
                    {"sale_price": "Sale price is required for sale listings"}
                )
        if lister_type == Property.ListerType.AGENT:
            if not attrs.get("agent_commission"):
                raise serializers.ValidationError(
                    {
                        "agent_commission": "Agent commission is required for agent listings"
                    }
                )

        # Validate document metadata if documents are provided
        documents = attrs.get("documents", [])
        document_types = attrs.get("document_types", [])

        if documents and document_types and len(documents) != len(document_types):
            raise serializers.ValidationError(
                {"document_types": "You must provide a type for each document"}
            )

        # Check document file types
        for doc in documents:
            ext = doc.name.split(".")[-1].lower()
            allowed_extensions = ["pdf", "doc", "docx", "jpg", "jpeg", "png"]

            if ext not in allowed_extensions:
                raise serializers.ValidationError(
                    {
                        "documents": f"Unsupported file type: {ext}. Allowed types: {', '.join(allowed_extensions)}"
                    }
                )

            # Check file size (limit to 10MB)
            if doc.size > 10 * 1024 * 1024:
                raise serializers.ValidationError(
                    {"documents": f"File '{doc.name}' exceeds the maximum size of 10MB"}
                )

        return attrs

    def create(self, validated_data):
        images_data = validated_data.pop("images", [])
        video_data = validated_data.pop("video", None)
        submit_for_review = validated_data.pop("submit_for_review", False)
        amenities_ids = validated_data.pop("amenities_ids", [])
        documents_data = validated_data.pop("documents", [])
        document_types = validated_data.pop("document_types", [])

        if submit_for_review:
            validated_data["listing_status"] = Property.ListingStatus.PENDING

        property_instance = Property.objects.create(
            listed_by=self.context["request"].user, **validated_data
        )

        # Add amenities
        if amenities_ids:
            property_instance.amenities.set(amenities_ids)

        # Handle images and video as before
        if images_data:
            for image_data in images_data[:5]:
                PropertyImage.objects.create(
                    property=property_instance, image=image_data
                )

        if video_data:
            PropertyVideo.objects.create(property=property_instance, video=video_data)

        for i, document in enumerate(documents_data):
            if i < len(document_types):
                PropertyDocument.objects.create(
                    property=property_instance,
                    document_type=document_types[i]
                    if i < len(document_types)
                    else PropertyDocument.DocumentType.OTHER,
                    file=document,
                    uploaded_by=self.context["request"].user,
                )

        # Handle notifications as before
        if submit_for_review:
            self._send_admin_review_notification_email(property_instance)
            self._create_review_notification(property_instance)

        return property_instance

    def _create_review_notification(self, property_instance):
        """Create notifications for all admin users about new property submission"""
        admin_users = User.objects.filter(user_type=User.UserType.ADMIN)

        if not admin_users.exists():
            raise serializers.ValidationError({"admin_user": "No admin users found"})

        for admin_user in admin_users:
            Notification.objects.create(
                user=admin_user,
                title="New Property Pending Review",
                message=f"New property '{property_instance.property_name}' by {property_instance.listed_by.get_full_name()} is pending review.",
                notification_type="property_review_required",
                metadata={
                    "property_id": str(property_instance.id),
                    "property_name": property_instance.property_name,
                    "submitted_by": property_instance.listed_by.get_full_name(),
                    "lister_type": property_instance.listed_by.get_user_type_display(),
                    "location": property_instance.location,
                },
            )

    def _send_admin_review_notification_email(self, property_instance):
        admin_users = User.objects.filter(user_type=User.UserType.ADMIN)

        if admin_users.exists():
            admin_emails = [user.email for user in admin_users if user.email]

            if admin_emails:
                subject = (
                    f"New Property Pending Review: {property_instance.property_name}"
                )
                html_message = render_to_string(
                    "email/admin_property_review_notification.html",
                    {
                        "property_name": property_instance.property_name,
                        "location": property_instance.location,
                        "listed_by": property_instance.listed_by.get_full_name(),
                    },
                )
                plain_message = strip_tags(html_message)

                try:
                    send_mail(
                        subject=subject,
                        message=plain_message,
                        html_message=html_message,
                        from_email=settings.DEFAULT_FROM_EMAIL,
                        recipient_list=admin_emails,
                    )
                except Exception as e:
                    print(f"Error sending email: {e}")
                    raise serializers.ValidationError(
                        {"email": "Error sending email to admin users"}
                    )


class PropertyUpdateSerializer(serializers.ModelSerializer):
    video = serializers.FileField(
        write_only=True,
        required=False,
        help_text="Upload a video for the property (optional)",
    )

    class Meta:
        model = Property
        fields = [
            "property_name",
            "description",
            "sale_price",
            "property_type",
            "listing_type",
            "lister_type",
            "location",
            "state",
            "city",
            "property_status",
            "listing_status",
            "bedrooms",
            "bathrooms",
            "area_sqft",
            "video",
            "rent_frequency",
            "rent_price",
            "agent_commission",
            "qaba_fee",
            "total_price",
        ]

    def update(self, instance, validated_data):
        video_data = validated_data.pop("video", None)

        # Update the property instance
        instance = super().update(instance, validated_data)

        # Update video if provided
        if video_data:
            # Delete existing video if any
            PropertyVideo.objects.filter(property=instance).delete()
            # Create new video
            PropertyVideo.objects.create(property=instance, video=video_data)

        return instance


class FavoriteSerializer(serializers.ModelSerializer):
    property = PropertyListSerializer(read_only=True)

    class Meta:
        model = Favorite
        fields = ["id", "property", "created_at"]
        read_only_fields = ["user"]


class PropertyFavoriteToggleSerializer(serializers.Serializer):
    property_id = serializers.IntegerField()


class PropertyDocumentUploadSerializer(serializers.ModelSerializer):
    file = serializers.FileField(write_only=True)

    class Meta:
        model = PropertyDocument
        fields = ["document_type", "file"]

    def validate_file(self, value):
        ext = value.name.split(".")[-1].lower()

        allowed_extensions = ["pdf", "doc", "docx", "jpg", "jpeg", "png"]

        if ext not in allowed_extensions:
            raise serializers.ValidationError(
                f"Unsupported file type. Allowed types: {', '.join(allowed_extensions)}"
            )

        if value.size > 10 * 1024 * 1024:
            raise serializers.ValidationError("File size cannot exceed 10MB")

        return value


class PropertyReviewSerializer(serializers.ModelSerializer):
    reviewer_name = serializers.CharField(
        source="reviewer.get_full_name", read_only=True
    )
    reviewer_type = serializers.CharField(
        source="reviewer.get_user_type_display", read_only=True
    )
    property_name = serializers.CharField(
        source="reviewed_property.property_name", read_only=True
    )

    class Meta:
        model = PropertyReview
        fields = [
            "id",
            "reviewed_property",
            "property_name",
            "reviewer",
            "reviewer_name",
            "reviewer_type",
            "rating",
            "comment",
            "status",
            "created_at",
            "approved_by",
        ]
        read_only_fields = ["reviewer", "status", "approved_by"]

    def validate_rating(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError("Rating must be between 1 and 5")
        return value

    def validate(self, attrs):
        # Check if user is trying to review their own property
        request = self.context.get("request")
        property_obj = attrs.get("reviewed_property")

        if request and property_obj and property_obj.listed_by == request.user:
            raise serializers.ValidationError("You cannot review your own property")

        return attrs


class PropertyReviewCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyReview
        fields = ["reviewed_property", "rating", "comment"]

    def validate_rating(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError("Rating must be between 1 and 5")
        return value

    def validate_reviewed_property(self, value):
        # Ensure property exists and is approved
        if value.listing_status != Property.ListingStatus.APPROVED:
            raise serializers.ValidationError("You can only review approved properties")
        return value

    def validate(self, attrs):
        request = self.context.get("request")
        property_obj = attrs.get("reviewed_property")

        # Check if user is trying to review their own property
        if property_obj.listed_by == request.user:
            raise serializers.ValidationError("You cannot review your own property")

        # Check if user has already reviewed this property
        if PropertyReview.objects.filter(
            reviewed_property=property_obj, reviewer=request.user
        ).exists():
            raise serializers.ValidationError("You have already reviewed this property")

        return attrs

    def create(self, validated_data):
        validated_data["reviewer"] = self.context["request"].user
        review = PropertyReview.objects.create(**validated_data)

        # Create notification for admin users
        self._create_review_notification(review)

        return review

    def _create_review_notification(self, review):
        """Create notifications for admin users about new review submission"""
        from apps.users.models import Notification, User

        admin_users = User.objects.filter(user_type=User.UserType.ADMIN)

        for admin_user in admin_users:
            Notification.objects.create(
                user=admin_user,
                title="New Property Review Pending Approval",
                message=f"New review for '{review.reviewed_property.property_name}' by {review.reviewer.get_full_name()} is pending approval.",
                notification_type="review_approval_required",
                metadata={
                    "review_id": str(review.id),
                    "property_id": str(review.reviewed_property.id),
                    "property_name": review.reviewed_property.property_name,
                    "reviewer_name": review.reviewer.get_full_name(),
                    "rating": review.rating,
                },
            )


class PropertyDetailSerializer(PropertyListSerializer):
    images = PropertyImageSerializer(many=True, read_only=True)
    video = PropertyVideoSerializer(read_only=True)
    rent_frequency_display = serializers.CharField(
        source="get_rent_frequency_display", read_only=True
    )
    amenities = AmenitySerializer(many=True, read_only=True)
    documents = PropertyDocumentSerializer(many=True, read_only=True)
    listed_by_name = serializers.CharField(
        source="listed_by.get_full_name", read_only=True
    )
    reviews = PropertyReviewSerializer(
        many=True,
        read_only=True,
        source='reviews.filter(status="APPROVED")',
    )
    average_rating = serializers.ReadOnlyField()
    total_reviews = serializers.ReadOnlyField()
    rating_breakdown = serializers.ReadOnlyField()

    class Meta(PropertyListSerializer.Meta):
        fields = PropertyListSerializer.Meta.fields + [
            "amenities",
            "description",
            "images",
            "video",
            "rent_frequency",
            "rent_frequency_display",
            "rent_price",
            "documents",
            "agent_commission",
            "qaba_fee",
            "total_price",
            "listed_by_name",
            "reviews",
            "average_rating",
            "total_reviews",
            "rating_breakdown",
        ]

    def get_documents(self, obj):
        request = self.context.get("request")
        if not request or not request.user.is_authenticated:
            return []

        if request.user.is_staff or obj.listed_by == request.user:
            documents = obj.documents.all()
        else:
            documents = obj.documents.filter(is_verified=True)

        return PropertyDocumentSerializer(documents, many=True).data
