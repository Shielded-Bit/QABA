from apps.users.models import Notification, User
from apps.users.serializers import UserSerializer
from django.conf import settings
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from drf_spectacular.utils import extend_schema_field
from rest_framework import serializers

from .models import Property, PropertyImage, PropertyVideo


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


class PropertyListSerializer(serializers.ModelSerializer):
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
        ]

    @extend_schema_field(serializers.URLField(allow_null=True))
    def get_thumbnail(self, obj):
        image = obj.images.first()
        if image and hasattr(image.image, "url"):
            return self.context["request"].build_absolute_uri(image.image.url)
        return None


class AmenitiesField(serializers.ListField):
    """Custom field to handle amenities list"""

    def to_representation(self, value):
        if not value:
            return []

        result = []
        amenity_choices = dict(Property.Amenities.choices)
        for amenity in value:
            if amenity in amenity_choices or amenity in amenity_choices.values():
                result.append(amenity_choices[amenity.upper()])
        return result

    def to_internal_value(self, data):
        if not isinstance(data, list):
            raise serializers.ValidationError("Amenities must be a list")

        amenities_list = data[0].split(",") if isinstance(data[0], str) else data

        valid_amenities = [choice[0] for choice in Property.Amenities.choices]
        for item in amenities_list:
            if item not in valid_amenities:
                raise serializers.ValidationError(f"'{item}' is not a valid amenity")

        return amenities_list


class PropertyDetailSerializer(PropertyListSerializer):
    images = PropertyImageSerializer(many=True, read_only=True)
    video = PropertyVideoSerializer(read_only=True)
    rent_frequency_display = serializers.CharField(
        source="get_rent_frequency_display", read_only=True
    )
    amenities = AmenitiesField()

    class Meta(PropertyListSerializer.Meta):
        fields = PropertyListSerializer.Meta.fields + [
            "amenities",
            "description",
            "images",
            "video",
            "rent_frequency",
            "rent_frequency_display",
            "rent_price",
        ]


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
    amenities = AmenitiesField(
        write_only=True,
        required=False,
        help_text="List of amenities available in the property",
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
            "amenities",
            "area_sqft",
            "images",
            "video",
            "rent_frequency",
            "rent_price",
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

        return attrs

    def create(self, validated_data):
        images_data = validated_data.pop("images", [])
        video_data = validated_data.pop("video", None)
        submit_for_review = validated_data.pop("submit_for_review", False)

        if submit_for_review:
            validated_data["listing_status"] = Property.ListingStatus.PENDING

        property_instance = Property.objects.create(
            listed_by=self.context["request"].user, **validated_data
        )

        if images_data:
            for image_data in images_data[:5]:
                PropertyImage.objects.create(
                    property=property_instance, image=image_data
                )

        if video_data:
            PropertyVideo.objects.create(property=property_instance, video=video_data)

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
