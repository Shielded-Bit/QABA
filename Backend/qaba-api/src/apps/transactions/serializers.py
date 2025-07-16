from apps.properties.models import Property
from rest_framework import serializers

from .models import Transaction


class TransactionSerializer(serializers.ModelSerializer):
    property_name = serializers.SerializerMethodField(read_only=True)
    property_address = serializers.SerializerMethodField(read_only=True)
    property_type_display = serializers.CharField(
        source="property_obj.get_property_type_display", read_only=True
    )
    payment_method_display = serializers.CharField(
        source="get_payment_method_display", read_only=True
    )
    status_display = serializers.CharField(source="get_status_display", read_only=True)
    verified_by_name = serializers.CharField(
        source="verified_by.get_full_name", read_only=True
    )
    needs_verification = serializers.BooleanField(read_only=True)
    is_offline_payment = serializers.BooleanField(read_only=True)

    class Meta:
        model = Transaction
        fields = [
            "id",
            "amount",
            "currency",
            "reference",
            "status",
            "status_display",
            "description",
            "created_at",
            "updated_at",
            "property_obj",
            "property_name",
            "property_address",
            "property_type_display",
            "payment_method",
            "payment_method_display",
            "payment_receipt",
            "verified_by_name",
            "verified_at",
            "needs_verification",
            "is_offline_payment",
        ]
        read_only_fields = [
            "id",
            "reference",
            "status",
            "created_at",
            "updated_at",
            "verified_by",
            "verified_at",
        ]

    def get_property_name(self, obj):
        if obj.property_obj:
            return obj.property_obj.property_name
        return None

    def get_property_address(self, obj):
        if obj.property_obj:
            return f"{obj.property_obj.property_name}, {obj.property_obj.location}"
        return None


class PropertyPaymentSerializer(serializers.Serializer):
    property_id = serializers.IntegerField(required=True)

    def validate(self, data):
        property_id = data.get("property_id")
        try:
            property_obj = Property.objects.get(id=property_id)
            if property_obj.property_status != Property.PropertyStatus.AVAILABLE:
                raise serializers.ValidationError(
                    f"Property is not available. Current status: {property_obj.get_property_status_display()}"
                )
        except Property.DoesNotExist:
            raise serializers.ValidationError("Property not found")

        return data


class OfflinePaymentSerializer(serializers.ModelSerializer):
    property_id = serializers.IntegerField(write_only=True)
    payment_receipt = serializers.FileField(
        write_only=True,
        required=True,
        help_text="Upload payment receipt for offline payments",
    )

    class Meta:
        model = Transaction
        fields = [
            "property_id",
            "payment_receipt",
        ]

    def validate_payment_receipt(self, value):
        if not value.name.lower().endswith((".jpg", ".jpeg", ".png", ".pdf")):
            raise serializers.ValidationError(
                "Payment receipt must be an image (JPG/PNG) or PDF file"
            )
        return value

    def validate(self, data):
        property_id = data.get("property_id")

        try:
            property_obj = Property.objects.get(id=property_id)
            if property_obj.property_status != Property.PropertyStatus.AVAILABLE:
                raise serializers.ValidationError(
                    f"Property is not available. Current status: {property_obj.get_property_status_display()}"
                )
        except Property.DoesNotExist:
            raise serializers.ValidationError("Property not found")

        user = self.context["request"].user
        existing_payment = Transaction.objects.filter(
            user=user,
            property_obj=property_obj,
            payment_method=Transaction.PaymentMethod.OFFLINE,
            status=Transaction.Status.PENDING,
        ).exists()

        if existing_payment:
            raise serializers.ValidationError(
                "You already have a pending offline payment for this property. "
                "Please wait for verification or contact support."
            )

        return data

    def create(self, validated_data):
        property_id = validated_data.pop("property_id")
        property_obj = Property.objects.get(id=property_id)
        user = self.context["request"].user

        if property_obj.listing_type == Property.ListingType.SALE:
            amount = property_obj.sale_price
            description = f"Offline purchase of {property_obj.property_name}"
        else:
            amount = property_obj.rent_price
            description = f"Offline rent payment for {property_obj.property_name}"

        import uuid

        reference = f"qaba-offline-{uuid.uuid4().hex[:10]}"
        tx_ref = f"offline-{uuid.uuid4().hex[:12]}"

        transaction = Transaction.objects.create(
            user=user,
            property_obj_id=property_obj.id,
            payment_method=Transaction.PaymentMethod.OFFLINE,
            amount=amount,
            reference=reference,
            tx_ref=tx_ref,
            status=Transaction.Status.PENDING,
            description=description,
            **validated_data,
        )

        return transaction
