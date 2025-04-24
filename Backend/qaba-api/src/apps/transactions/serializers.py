from apps.properties.models import Property
from rest_framework import serializers

from .models import Transaction


class TransactionSerializer(serializers.ModelSerializer):
    property_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Transaction
        fields = [
            "id",
            "amount",
            "currency",
            "reference",
            "status",
            "description",
            "created_at",
            "property",
            "property_name",
            "payment_type",
        ]
        read_only_fields = [
            "id",
            "reference",
            "status",
            "created_at",
            "amount",
            "property_name",
        ]

    def get_property_name(self, obj):
        if obj.property:
            return obj.property.property_name
        return None


class PropertyPaymentSerializer(serializers.Serializer):
    property_id = serializers.IntegerField(required=True)
    payment_type = serializers.ChoiceField(
        choices=Transaction.PaymentType.choices,
        default=Transaction.PaymentType.PROPERTY_PURCHASE,
    )

    def validate_property_id(self, value):
        try:
            property_obj = Property.objects.get(id=value)

            # Check if property is available
            if property_obj.property_status != Property.PropertyStatus.AVAILABLE:
                raise serializers.ValidationError(
                    f"Property is not available. Current status: {property_obj.get_property_status_display()}"
                )

            return value
        except Property.DoesNotExist:
            raise serializers.ValidationError("Property not found")

    def validate(self, data):
        property_id = data.get("property_id")
        payment_type = data.get("payment_type")

        property_obj = Property.objects.get(id=property_id)

        # Validate payment type matches property listing type
        if (
            payment_type == Transaction.PaymentType.PROPERTY_PURCHASE
            and property_obj.listing_type != Property.ListingType.SALE
        ):
            raise serializers.ValidationError(
                "Cannot purchase a property that is not for sale"
            )

        if (
            payment_type == Transaction.PaymentType.PROPERTY_RENT
            and property_obj.listing_type != Property.ListingType.RENT
        ):
            raise serializers.ValidationError(
                "Cannot rent a property that is not for rent"
            )

        # Check if payment amount is available
        if (
            payment_type == Transaction.PaymentType.PROPERTY_PURCHASE
            and not property_obj.sale_price
        ):
            raise serializers.ValidationError(
                "Property does not have a valid sale price"
            )

        if (
            payment_type == Transaction.PaymentType.PROPERTY_RENT
            and not property_obj.rent_price
        ):
            raise serializers.ValidationError(
                "Property does not have a valid rent price"
            )

        return data
