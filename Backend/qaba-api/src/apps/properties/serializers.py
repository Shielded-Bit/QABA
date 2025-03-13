from apps.users.serializers import UserSerializer
from rest_framework import serializers
from drf_spectacular.utils import extend_schema_field
from drf_extra_fields.fields import Base64ImageField

from .models import Property, PropertyImage, PropertyVideo


class PropertyImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = PropertyImage
        fields = ["id", "image", "image_url", "uploaded_at"]

    def get_image_url(self, obj):
        if obj.image:
            return obj.image.url
        return None


class PropertyVideoSerializer(serializers.ModelSerializer):
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


class PropertyDetailSerializer(PropertyListSerializer):
    images = PropertyImageSerializer(many=True, read_only=True)
    video = PropertyVideoSerializer(read_only=True)
    rent_frequency_display = serializers.CharField(
        source="get_rent_frequency_display", read_only=True
    )

    class Meta(PropertyListSerializer.Meta):
        fields = PropertyListSerializer.Meta.fields + [
            "description",
            "images",
            "video",
            "rent_frequency",
            "rent_frequency_display",
            "rent_price",
        ]


class PropertyCreateSerializer(serializers.ModelSerializer):
    images = serializers.ListField(
        child=Base64ImageField(required=False),
        write_only=True,
        required=False,
        max_length=5,
        help_text="Upload up to 5 images for the property",
    )
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
            "listing_status",
            "location",
            "bedrooms",
            "bathrooms",
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
        # Validate that rent-related fields are provided for rental listings
        if attrs.get("listing_type") == Property.ListingType.RENT:
            if (
                not attrs.get("property_type") == Property.PropertyType.APARTMENT
                or attrs.get("property_type") == Property.PropertyType.HOUSE
            ):
                raise serializers.ValidationError(
                    {
                        "property_type": "Property type must be apartment or house for rental listings"
                    }
                )
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
            if not attrs.get("area_sqft"):
                raise serializers.ValidationError(
                    {"area_sqft": "Area sqft is required for land listings"}
                )

        return attrs

    def create(self, validated_data):
        images_data = validated_data.pop("images", [])
        video_data = validated_data.pop("video", None)

        property_instance = Property.objects.create(
            listed_by=self.context["request"].user, **validated_data
        )

        # Add images (up to 5)
        for image_data in images_data[:5]:
            PropertyImage.objects.create(property=property_instance, image=image_data)

        # Add video (if provided)
        if video_data:
            PropertyVideo.objects.create(property=property_instance, video=video_data)

        return property_instance


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
