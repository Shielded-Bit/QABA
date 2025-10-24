from apps.users.models import Notification, User
from apps.users.serializers import UserSerializer
from core.utils.send_email import send_email
from django.conf import settings
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


class AmenitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Amenity
        fields = ["id", "name", "icon"]


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

    listed_by = UserSerializer(read_only=True)
    thumbnail = serializers.SerializerMethodField()
    amenities = AmenitySerializer(many=True, read_only=True)

    class Meta:
        model = Property
        fields = [
            "id",
            "property_name",
            "slug",
            "sale_price",
            "rent_price",
            "rent_frequency",
            "service_charge",
            "caution_fee",
            "legal_fee",
            "total_price",
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
            "bedrooms",
            "bathrooms",
            "area_sqft",
            "listed_date",
            "listed_by",
            "thumbnail",
            "is_favorited",
            "amenities",
            "is_verified",
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

    documents = serializers.ListField(
        child=serializers.FileField(), write_only=True, required=False
    )
    document_types = serializers.ListField(
        child=serializers.CharField(),
        required=False,
        write_only=True,
    )

    class Meta:
        model = Property
        fields = [
            "property_name",
            "slug",
            "description",
            "sale_price",
            "property_type",
            "listing_type",
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
            "service_charge",
            "caution_fee",
            "legal_fee",
            "total_price",
            "agent_commission",
            "qaba_fee",
            "documents",
            "document_types",
        ]
        read_only_fields = ["agent_commission", "qaba_fee", "slug"]

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
        request = self.context.get("request")
        lister_type = request.user.user_type
        service_charge = attrs.get("service_charge")
        caution_fee = attrs.get("caution_fee")
        legal_fee = attrs.get("legal_fee")

        if service_charge is not None and service_charge < 0:
            raise serializers.ValidationError(
                {"service_charge": "Service charge cannot be negative"}
            )
        if caution_fee is not None and caution_fee < 0:
            raise serializers.ValidationError(
                {"caution_fee": "Caution fee cannot be negative"}
            )
        if legal_fee is not None and legal_fee < 0:
            raise serializers.ValidationError(
                {"legal_fee": "Legal fee cannot be negative"}
            )

        service_charge_value = (
            float(service_charge) if service_charge is not None else 0.0
        )
        caution_fee_value = float(caution_fee) if caution_fee is not None else 0.0
        legal_fee_value = float(legal_fee) if legal_fee is not None else 0.0

        if listing_type == Property.ListingType.RENT:
            if not all([rent_price, rent_frequency]):
                raise serializers.ValidationError(
                    {
                        "rent_price": "Rent price and frequency are required for rental listings"
                    }
                )
            if rent_price <= 0:
                raise serializers.ValidationError(
                    {"rent_price": "Rent price must be positive"}
                )
            qaba_fee = round(float(rent_price) * settings.QABA_RENT_PERCENTAGE, 2)
            agent_commission = 0
            if lister_type == User.UserType.AGENT:
                agent_commission = round(
                    float(rent_price) * settings.AGENT_RENT_COMMISSION_PERCENTAGE, 2
                )
            total_price = round(
                float(rent_price)
                + qaba_fee
                + agent_commission
                + service_charge_value
                + caution_fee_value
                + legal_fee_value,
                2,
            )
            submitted_total = attrs.get("total_price")
            if submitted_total is not None and total_price != submitted_total:
                raise serializers.ValidationError(
                    {
                        "total_price": f"Total price is not correct. Expected {total_price}, got {submitted_total}"
                    }
                )
            attrs["qaba_fee"] = qaba_fee
            attrs["agent_commission"] = agent_commission
            attrs["total_price"] = total_price

        if listing_type == Property.ListingType.SALE:
            if not sale_price:
                raise serializers.ValidationError(
                    {"sale_price": "Sale price is required for sale listings"}
                )
            if sale_price <= 0:
                raise serializers.ValidationError(
                    {"sale_price": "Sale price must be positive"}
                )
            qaba_fee = round(float(sale_price) * settings.QABA_SALE_PERCENTAGE, 2)
            agent_commission = 0
            if lister_type == User.UserType.AGENT:
                agent_commission = round(
                    float(sale_price) * settings.AGENT_SALE_COMMISSION_PERCENTAGE, 2
                )
            total_price = round(
                float(sale_price)
                + qaba_fee
                + agent_commission
                + service_charge_value
                + caution_fee_value
                + legal_fee_value,
                2,
            )
            submitted_total = attrs.get("total_price")
            if submitted_total is not None and total_price != submitted_total:
                raise serializers.ValidationError(
                    {
                        "total_price": f"Total price is not correct. Expected {total_price}, got {submitted_total}"
                    }
                )
            attrs["qaba_fee"] = qaba_fee
            attrs["agent_commission"] = agent_commission
            attrs["total_price"] = total_price

        documents = attrs.get("documents", [])
        document_types = attrs.get("document_types", [])

        if documents and document_types and len(documents) != len(document_types):
            raise serializers.ValidationError(
                {"document_types": "You must provide a type for each document"}
            )

        for doc in documents:
            ext = doc.name.split(".")[-1].lower()
            allowed_extensions = ["pdf", "doc", "docx", "jpg", "jpeg", "png"]

            if ext not in allowed_extensions:
                raise serializers.ValidationError(
                    {
                        "documents": f"Unsupported file type: {ext}. Allowed types: {', '.join(allowed_extensions)}"
                    }
                )

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

        if amenities_ids:
            property_instance.amenities.set(amenities_ids)

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
                    document_type=(
                        document_types[i]
                        if i < len(document_types)
                        else PropertyDocument.DocumentType.OTHER
                    ),
                    file=document,
                    uploaded_by=self.context["request"].user,
                )

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

                try:
                    send_email(
                        subject=subject,
                        recipients=admin_emails,
                        template_name="admin_property_review_notification",
                        context={
                            "property_name": property_instance.property_name,
                            "location": property_instance.location,
                            "listed_by": property_instance.listed_by.get_full_name(),
                        },
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
            "slug",
            "description",
            "sale_price",
            "property_type",
            "listing_type",
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
            "service_charge",
            "caution_fee",
            "legal_fee",
            "total_price",
            "agent_commission",
            "qaba_fee",
        ]
        read_only_fields = ["agent_commission", "qaba_fee", "slug"]

    def validate(self, attrs):
        request = self.context.get("request")
        listing_type = attrs.get(
            "listing_type", getattr(self.instance, "listing_type", None)
        )
        rent_price = attrs.get("rent_price")
        sale_price = attrs.get("sale_price")
        lister_type = request.user.user_type
        service_charge_value = None
        caution_fee_value = None
        legal_fee_value = None

        if "service_charge" in attrs:
            service_charge = attrs["service_charge"]
            if service_charge is not None and service_charge < 0:
                raise serializers.ValidationError(
                    {"service_charge": "Service charge cannot be negative"}
                )
            service_charge_value = (
                float(service_charge) if service_charge is not None else 0.0
            )
        else:
            existing_service = getattr(self.instance, "service_charge", None)
            service_charge_value = (
                float(existing_service) if existing_service is not None else 0.0
            )

        if "caution_fee" in attrs:
            caution_fee = attrs["caution_fee"]
            if caution_fee is not None and caution_fee < 0:
                raise serializers.ValidationError(
                    {"caution_fee": "Caution fee cannot be negative"}
                )
            caution_fee_value = float(caution_fee) if caution_fee is not None else 0.0
        else:
            existing_caution = getattr(self.instance, "caution_fee", None)
            caution_fee_value = (
                float(existing_caution) if existing_caution is not None else 0.0
            )

        if "legal_fee" in attrs:
            legal_fee = attrs["legal_fee"]
            if legal_fee is not None and legal_fee < 0:
                raise serializers.ValidationError(
                    {"legal_fee": "Legal fee cannot be negative"}
                )
            legal_fee_value = float(legal_fee) if legal_fee is not None else 0.0
        else:
            existing_legal = getattr(self.instance, "legal_fee", None)
            legal_fee_value = (
                float(existing_legal) if existing_legal is not None else 0.0
            )

        current_rent_price = (
            float(rent_price)
            if rent_price is not None
            else (
                float(getattr(self.instance, "rent_price"))
                if getattr(self.instance, "rent_price", None) is not None
                else None
            )
        )
        current_sale_price = (
            float(sale_price)
            if sale_price is not None
            else (
                float(getattr(self.instance, "sale_price"))
                if getattr(self.instance, "sale_price", None) is not None
                else None
            )
        )

        if listing_type == Property.ListingType.RENT and current_rent_price is not None:
            if rent_price is not None and rent_price <= 0:
                raise serializers.ValidationError(
                    {"rent_price": "Rent price must be positive"}
                )
            qaba_fee = round(
                float(current_rent_price) * settings.QABA_RENT_PERCENTAGE, 2
            )
            agent_commission = 0
            if lister_type == User.UserType.AGENT:
                agent_commission = round(
                    float(current_rent_price)
                    * settings.AGENT_RENT_COMMISSION_PERCENTAGE,
                    2,
                )
            total_price = round(
                float(current_rent_price)
                + qaba_fee
                + agent_commission
                + service_charge_value
                + caution_fee_value
                + legal_fee_value,
                2,
            )
            submitted_total = attrs.get("total_price")
            if submitted_total is not None and total_price != submitted_total:
                raise serializers.ValidationError(
                    {
                        "total_price": f"Total price is not correct. Expected {total_price}, got {submitted_total}"
                    }
                )
            attrs["qaba_fee"] = qaba_fee
            attrs["agent_commission"] = agent_commission
            attrs["total_price"] = total_price
        elif (
            listing_type == Property.ListingType.SALE and current_sale_price is not None
        ):
            if sale_price is not None and sale_price <= 0:
                raise serializers.ValidationError(
                    {"sale_price": "Sale price must be positive"}
                )
            qaba_fee = round(
                float(current_sale_price) * settings.QABA_SALE_PERCENTAGE, 2
            )
            agent_commission = 0
            if lister_type == User.UserType.AGENT:
                agent_commission = round(
                    float(current_sale_price)
                    * settings.AGENT_SALE_COMMISSION_PERCENTAGE,
                    2,
                )
            total_price = round(
                float(current_sale_price)
                + qaba_fee
                + agent_commission
                + service_charge_value
                + caution_fee_value
                + legal_fee_value,
                2,
            )
            submitted_total = attrs.get("total_price")
            if submitted_total is not None and total_price != submitted_total:
                raise serializers.ValidationError(
                    {
                        "total_price": f"Total price is not correct. Expected {total_price}, got {submitted_total}"
                    }
                )
            attrs["qaba_fee"] = qaba_fee
            attrs["agent_commission"] = agent_commission
            attrs["total_price"] = total_price
        return attrs

    def update(self, instance, validated_data):
        video_data = validated_data.pop("video", None)

        instance = super().update(instance, validated_data)

        if video_data:
            PropertyVideo.objects.filter(property=instance).delete()
            PropertyVideo.objects.create(property=instance, video=video_data)

        return instance


class FavoriteSerializer(serializers.ModelSerializer):
    property = PropertyListSerializer(read_only=True)

    class Meta:
        model = Favorite
        fields = ["id", "property", "created_at"]
        read_only_fields = ["user"]


class PropertyFavoriteToggleSerializer(serializers.Serializer):
    property_id = serializers.UUIDField()


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

        if property_obj.listed_by == request.user:
            raise serializers.ValidationError("You cannot review your own property")

        if PropertyReview.objects.filter(
            reviewed_property=property_obj, reviewer=request.user
        ).exists():
            raise serializers.ValidationError("You have already reviewed this property")

        return attrs

    def create(self, validated_data):
        validated_data["reviewer"] = self.context["request"].user
        review = PropertyReview.objects.create(**validated_data)

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
            "service_charge",
            "caution_fee",
            "legal_fee",
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


class AgentPropertyAnalyticsSerializer(serializers.Serializer):
    """Serializer for agent property analytics"""

    period = serializers.CharField(read_only=True)
    total_properties = serializers.IntegerField(read_only=True)
    sold_properties = serializers.IntegerField(read_only=True)
    rented_properties = serializers.IntegerField(read_only=True)
    pending_properties = serializers.IntegerField(read_only=True)
    published_properties = serializers.IntegerField(read_only=True)
    total_revenue = serializers.DecimalField(
        max_digits=12, decimal_places=2, read_only=True
    )
