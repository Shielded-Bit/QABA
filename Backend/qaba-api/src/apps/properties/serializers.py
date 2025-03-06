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
            "property_name",
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
        if image and hasattr(image.image, "url"):
            return self.context["request"].build_absolute_uri(image.image.url)
        return None


class PropertyFeatureAmenityField(serializers.Field):
    def to_representation(self, value):
        features_dict = {}
        if value:
            for feature in Property.FeatureAmenity.choices:
                key = feature[0]
                features_dict[key] = {
                    "name": feature[1],
                    "is_available": key in value and value[key],
                }
        return features_dict

    def to_internal_value(self, data):
        if not isinstance(data, dict):
            raise serializers.ValidationError("Features must be a dictionary")

        # Validate that all keys belong to FeatureAmenity choices
        valid_keys = [choice[0] for choice in Property.FeatureAmenity.choices]
        for key in data.keys():
            if key not in valid_keys:
                raise serializers.ValidationError(
                    f"{key} is not a valid feature/amenity"
                )

        return data


class PropertyDetailSerializer(PropertyListSerializer):
    images = PropertyImageSerializer(many=True, read_only=True)
    rent_frequency_display = serializers.CharField(
        source="get_rent_frequency_display", read_only=True
    )
    features_amenities = PropertyFeatureAmenityField()

    class Meta(PropertyListSerializer.Meta):
        fields = PropertyListSerializer.Meta.fields + [
            "description",
            "images",
            "features_amenities",
            "rent_frequency",
            "rent_frequency_display",
            "rent_price",
        ]


class PropertyCreateSerializer(serializers.ModelSerializer):
    images = serializers.ListField(
        child=serializers.ImageField(), write_only=True, required=False
    )
    features_amenities = PropertyFeatureAmenityField(required=False)

    class Meta:
        model = Property
        fields = [
            "property_name",
            "description",
            "price",
            "property_type",
            "listing_type",
            "location",
            "bedrooms",
            "bathrooms",
            "area_sqft",
            "images",
            "features_amenities",
            "rent_frequency",
            "rent_price",
        ]

    def validate(self, attrs):
        # Validate that rent-related fields are provided for rental listings
        if attrs.get("listing_type") == Property.ListingType.RENT:
            if not attrs.get("rent_frequency"):
                raise serializers.ValidationError(
                    {"rent_frequency": "Rent frequency is required for rental listings"}
                )
            if not attrs.get("rent_price"):
                raise serializers.ValidationError(
                    {"rent_price": "Rent price is required for rental listings"}
                )
        return attrs

    def create(self, validated_data):
        images_data = validated_data.pop("images", [])

        property_instance = Property.objects.create(
            listed_by=self.context["request"].user, **validated_data
        )

        # Add images
        for image_data in images_data:
            PropertyImage.objects.create(property=property_instance, image=image_data)

        return property_instance


class PropertyUpdateSerializer(serializers.ModelSerializer):
    features_amenities = PropertyFeatureAmenityField(required=False)

    class Meta:
        model = Property
        fields = [
            "property_name",
            "description",
            "price",
            "property_type",
            "listing_type",
            "location",
            "status",
            "bedrooms",
            "bathrooms",
            "area_sqft",
            "features_amenities",
            "rent_frequency",
            "rent_price",
        ]
