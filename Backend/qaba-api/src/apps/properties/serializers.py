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


class PropertyDetailSerializer(PropertyListSerializer):
    images = PropertyImageSerializer(many=True, read_only=True)
    video = PropertyVideoSerializer(read_only=True)
    rent_frequency_display = serializers.CharField(
        source="get_rent_frequency_display", read_only=True
    )
    amenities = AmenitySerializer(many=True, read_only=True)
    documents = PropertyDocumentSerializer(many=True, read_only=True)

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
        ]

    def get_documents(self, obj):
        request = self.context.get("request")
        if not request or not request.user.is_authenticated:
            # For unauthenticated users, return no documents
            return []

        # For staff or property owner, return all documents
        if request.user.is_staff or obj.listed_by == request.user:
            documents = obj.documents.all()
        else:
            # For other authenticated users, return only verified documents
            documents = obj.documents.filter(is_verified=True)

        return PropertyDocumentSerializer(documents, many=True).data


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
    amenities_ids = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True,
        required=False,
        help_text="List of amenity IDs for this property",
    )

    # Add documents field
    documents = serializers.ListField(
        child=serializers.FileField(), write_only=True, required=False
    )
    # Add document metadata
    document_types = serializers.ListField(
        child=serializers.ChoiceField(choices=PropertyDocument.DocumentType.choices),
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
            "submit_for_review",
            "location",
            "bedrooms",
            "bathrooms",
            "amenities_ids",
            "area_sqft",
            "images",
            "video",
            "rent_frequency",
            "rent_price",
            "documents",
            "document_types",
        ]

    def validate_images(self, value):
        if len(value) > 5:
            raise serializers.ValidationError("You can upload a maximum of 5 images.")
        return value

    def validate(self, attrs):
        if attrs.get("listing_type") == Property.ListingType.RENT:
            if not attrs.get("rent_frequency"):
                raise serializers.ValidationError(
                    {"rent_frequency": "Rent frequency is required for rental listings"}
                )
            if not attrs.get("rent_price"):
                raise serializers.ValidationError(
                    {"rent_price": "Rent price is required for rental listings"}
                )
        if attrs.get("listing_type") == Property.ListingType.SALE:
            if not attrs.get("sale_price"):
                raise serializers.ValidationError(
                    {"sale_price": "Sale price is required for sale listings"}
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
        admin_user = User.objects.filter(user_type=User.UserType.ADMIN).first()
        if not admin_user:
            raise serializers.ValidationError({"admin_user": "Admin user not found"})
        Notification.objects.create(
            user=admin_user,
            message=f"New property '{property_instance.property_name}' is pending review.",
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
            "location",
            "property_status",
            "listing_status",
            "bedrooms",
            "bathrooms",
            "area_sqft",
            "video",
            "rent_frequency",
            "rent_price",
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
        # Get file extension
        ext = value.name.split(".")[-1].lower()

        # List of allowed file extensions
        allowed_extensions = ["pdf", "doc", "docx", "jpg", "jpeg", "png"]

        if ext not in allowed_extensions:
            raise serializers.ValidationError(
                f"Unsupported file type. Allowed types: {', '.join(allowed_extensions)}"
            )

        # Check file size (limit to 10MB)
        if value.size > 10 * 1024 * 1024:
            raise serializers.ValidationError("File size cannot exceed 10MB")

        return value
