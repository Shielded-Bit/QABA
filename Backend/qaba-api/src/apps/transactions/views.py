import uuid

from apps.properties.models import Property
from core.utils.flutterwave import initialize_payment, verify_payment
from core.utils.response import APIResponse
from django.shortcuts import get_object_or_404
from drf_spectacular.utils import extend_schema
from rest_framework import permissions
from rest_framework.views import APIView

from .models import Transaction
from .serializers import PropertyPaymentSerializer, TransactionSerializer


@extend_schema(tags=["Transactions"])
class InitiatePropertyPaymentView(APIView):
    """View to initiate a property payment with Flutterwave"""

    permission_classes = (permissions.IsAuthenticated,)

    @extend_schema(
        request=PropertyPaymentSerializer, responses={200: TransactionSerializer}
    )
    def post(self, request):
        serializer = PropertyPaymentSerializer(data=request.data)

        if serializer.is_valid():
            property_id = serializer.validated_data["property_id"]
            payment_type = serializer.validated_data["payment_type"]

            # Get the property
            property_obj = Property.objects.get(id=property_id)

            # Determine amount based on payment type
            if payment_type == Transaction.PaymentType.PROPERTY_PURCHASE:
                amount = property_obj.sale_price
                description = f"Purchase of {property_obj.property_name}"
            elif payment_type == Transaction.PaymentType.PROPERTY_RENT:
                amount = property_obj.rent_price
                description = f"Rent for {property_obj.property_name} ({property_obj.get_rent_frequency_display()})"
            else:
                return APIResponse.bad_request(message="Invalid payment type")

            # Generate reference
            reference = f"qaba-{uuid.uuid4().hex[:10]}"

            # Initialize payment with Flutterwave
            payment_data = initialize_payment(
                user=request.user, amount=amount, description=description
            )

            if payment_data["success"]:
                # Create transaction record
                transaction = Transaction.objects.create(
                    user=request.user,
                    property=property_obj,
                    payment_type=payment_type,
                    amount=amount,
                    reference=reference,
                    tx_ref=payment_data["tx_ref"],
                    flw_ref=payment_data.get("flw_ref"),
                    description=description,
                )

                return APIResponse.success(
                    data={
                        "transaction": TransactionSerializer(transaction).data,
                        "payment_link": payment_data["payment_link"],
                    },
                    message="Payment initiated successfully",
                )

            return APIResponse.bad_request(
                message=f"Failed to initiate payment: {payment_data.get('error')}"
            )

        return APIResponse.bad_request(serializer.errors)


@extend_schema(tags=["Transactions"])
class VerifyPaymentView(APIView):
    """View to verify a payment with Flutterwave"""

    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, tx_ref):
        # Get the transaction
        transaction = get_object_or_404(Transaction, tx_ref=tx_ref, user=request.user)

        # Skip verification if already successful
        if transaction.status == Transaction.Status.SUCCESSFUL:
            return APIResponse.success(
                data=TransactionSerializer(transaction).data,
                message="Transaction already successful",
            )

        # Verify with Flutterwave
        verification = verify_payment(tx_ref)

        if verification["success"]:
            # Update transaction status based on verification
            flw_status = verification.get("status", "").lower()

            if flw_status == "successful":
                transaction.status = Transaction.Status.SUCCESSFUL

                # If this is a property transaction, update property status
                if transaction.property and transaction.payment_type:
                    property_obj = transaction.property

                    if (
                        transaction.payment_type
                        is Transaction.PaymentType.PROPERTY_PURCHASE
                    ):
                        property_obj.property_status = Property.PropertyStatus.SOLD
                        property_obj.save()

                    elif (
                        transaction.payment_type
                        is Transaction.PaymentType.PROPERTY_RENT
                    ):
                        property_obj.property_status = Property.PropertyStatus.RENTED
                        property_obj.save()

                transaction.save()

                return APIResponse.success(
                    data=TransactionSerializer(transaction).data,
                    message="Payment successful",
                )

            # Any non-successful status is treated as failed
            transaction.status = Transaction.Status.FAILED
            transaction.save()

            return APIResponse.bad_request(
                data=TransactionSerializer(transaction).data,
                message="Payment failed",
            )

        # Verification call failed - treat as transaction failure
        return APIResponse.bad_request(
            message=f"Payment verification failed: {verification.get('error')}",
            data=TransactionSerializer(transaction).data,
        )


@extend_schema(tags=["Transactions"])
class TransactionListView(APIView):
    """View to list all transactions for the current user"""

    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        transactions = Transaction.objects.filter(user=request.user).order_by(
            "-created_at"
        )
        serializer = TransactionSerializer(transactions, many=True)

        return APIResponse.success(
            data=serializer.data, message="Transactions retrieved successfully"
        )
