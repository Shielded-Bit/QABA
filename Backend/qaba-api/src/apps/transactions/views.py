import uuid

from apps.properties.models import Property
from core.utils.flutterwave import initialize_payment, verify_payment
from core.utils.response import APIResponse
from django.shortcuts import get_object_or_404
from drf_spectacular.utils import extend_schema
from rest_framework import permissions, status
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.views import APIView

from .models import Transaction
from .serializers import (
    OfflinePaymentSerializer,
    PropertyPaymentSerializer,
    TransactionSerializer,
)


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

            property_obj = Property.objects.get(id=property_id)

            if payment_type == Transaction.PaymentType.PROPERTY_PURCHASE:
                amount = property_obj.sale_price
                description = f"Purchase of {property_obj.property_name}"
            elif payment_type == Transaction.PaymentType.PROPERTY_RENT:
                amount = property_obj.rent_price
                description = f"Rent for {property_obj.property_name} ({property_obj.get_rent_frequency_display()})"
            else:
                return APIResponse.bad_request(message="Invalid payment type")

            reference = f"qaba-{uuid.uuid4().hex[:10]}"

            payment_data = initialize_payment(
                user=request.user, amount=amount, description=description
            )

            if payment_data["success"]:
                # Create transaction record
                transaction = Transaction.objects.create(
                    user=request.user,
                    property=property_obj,
                    payment_type=payment_type,
                    payment_method=Transaction.PaymentMethod.ONLINE,
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

        return APIResponse.bad_request(
            message="Invalid data provided", errors=serializer.errors
        )


@extend_schema(tags=["Transactions"])
class OfflinePaymentView(APIView):
    """View to submit offline payment with receipt"""

    permission_classes = (permissions.IsAuthenticated,)
    parser_classes = (MultiPartParser, FormParser)

    @extend_schema(
        request=OfflinePaymentSerializer, responses={201: TransactionSerializer}
    )
    def post(self, request):
        serializer = OfflinePaymentSerializer(
            data=request.data, context={"request": request}
        )

        if serializer.is_valid():
            try:
                transaction = serializer.save()

                try:
                    from core.utils.send_email import send_offline_payment_notification

                    send_offline_payment_notification(transaction)
                except Exception as e:
                    import logging

                    logger = logging.getLogger(__name__)
                    logger.error(
                        f"Failed to send offline payment notification: {str(e)}"
                    )

                return APIResponse.success(
                    data=TransactionSerializer(transaction).data,
                    message="Offline payment submitted successfully. It will be verified by our team.",
                    status_code=status.HTTP_201_CREATED,
                )

            except Exception:
                return APIResponse.server_error(
                    message="Failed to process offline payment. Please try again."
                )

        return APIResponse.bad_request(
            message="Invalid data provided", errors=serializer.errors
        )


@extend_schema(tags=["Transactions"])
class VerifyPaymentView(APIView):
    """View to verify a payment with Flutterwave"""

    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, tx_ref):
        transaction = get_object_or_404(Transaction, tx_ref=tx_ref, user=request.user)

        if transaction.status == Transaction.Status.SUCCESSFUL:
            return APIResponse.success(
                data=TransactionSerializer(transaction).data,
                message="Transaction already successful",
            )

        if transaction.payment_method == Transaction.PaymentMethod.OFFLINE:
            return APIResponse.bad_request(
                message="Offline payments are verified manually by admins",
                data=TransactionSerializer(transaction).data,
            )

        verification = verify_payment(tx_ref)

        if verification["success"]:
            flw_status = verification.get("status", "").lower()

            if flw_status == "successful":
                transaction.status = Transaction.Status.SUCCESSFUL

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

            transaction.status = Transaction.Status.FAILED
            transaction.save()

            return APIResponse.bad_request(
                data=TransactionSerializer(transaction).data,
                message="Payment failed",
            )

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

        status_filter = request.query_params.get("status", None)
        if status_filter:
            transactions = transactions.filter(status=status_filter)

        method_filter = request.query_params.get("payment_method", None)
        if method_filter:
            transactions = transactions.filter(payment_method=method_filter)

        type_filter = request.query_params.get("payment_type", None)
        if type_filter:
            transactions = transactions.filter(payment_type=type_filter)

        serializer = TransactionSerializer(transactions, many=True)

        return APIResponse.success(
            data=serializer.data, message="Transactions retrieved successfully"
        )
