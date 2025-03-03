from apps.users.serializers import UserSerializer
from rest_framework import serializers

from .models import Property, PropertyImage


class PropertyImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyImage
        fields = ["id", "image", "uploaded_at"]


class PropertyListSerializer(serializers.ModelSerializer):
    property_type_display = serializers.CharField(
        source="get_property_type_display", read_only=True
    )
    status_display = serializers.CharField(source="get_status_display", read_only=True)
    listing_type_display = serializers.CharField(
        source="get_listing_type_display", read_only=True
    )
    listed_by = UserSerializer(read_only=True)
    thumbnail = serializers.SerializerMethodField()

    class Meta:
        model = Property
        fields = [
            "id",
            "title",
            "price",
            "property_type",
            "property_type_display",
            "listing_type",
            "listing_type_display",
            "location",
            "status",
            "status_display",
            "bedrooms",
            "bathrooms",
            "area_sqft",
            "listed_date",
            "listed_by",
            "thumbnail",
        ]

    def get_thumbnail(self, obj):
        image = obj.images.first()
        if image:
            return self.context["request"].build_absolute_uri(image.image.url)
        return None


class PropertyDetailSerializer(PropertyListSerializer):
    images = PropertyImageSerializer(many=True, read_only=True)

    class Meta(PropertyListSerializer.Meta):
        fields = PropertyListSerializer.Meta.fields + ["description", "images"]


class PropertyCreateSerializer(serializers.ModelSerializer):
    images = serializers.ListField(
        child=serializers.ImageField(), write_only=True, required=False
    )

    class Meta:
        model = Property
        fields = [
            "title",
            "description",
            "price",
            "property_type",
            "listing_type",
            "location",
            "bedrooms",
            "bathrooms",
            "area_sqft",
            "images",
        ]

    def create(self, validated_data):
        images_data = validated_data.pop("images", [])
        property_instance = Property.objects.create(
            listed_by=self.context["request"].user, **validated_data
        )

        for image_data in images_data:
            PropertyImage.objects.create(property=property_instance, image=image_data)

        return property_instance


class PropertyUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Property
        fields = [
            "title",
            "description",
            "price",
            "property_type",
            "listing_type",
            "location",
            "status",
            "bedrooms",
            "bathrooms",
            "area_sqft",
        ]

    def validate_status(self, value):
        if (
            not self.context["request"].user.is_staff
            and value == Property.PropertyStatus.APPROVED
        ):
            raise serializers.ValidationError(
                "Only staff members can set property status to APPROVED"
            )
        return value
