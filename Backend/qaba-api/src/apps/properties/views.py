from apps.users.models import Notification
from core.utils.permissions import IsAgentOrAdmin, IsOwnerOrReadOnly
from core.utils.response import APIResponse
from django.conf import settings
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import OpenApiParameter, extend_schema
from rest_framework import filters, permissions, serializers, viewsets
from rest_framework.decorators import action
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.views import APIView

from .models import Amenity, Property, PropertyImage, PropertyVideo
from .serializers import (
    AmenitySerializer,
    PropertyCreateSerializer,
    PropertyDetailSerializer,
    PropertyImageSerializer,
    PropertyListSerializer,
    PropertyUpdateSerializer,
    PropertyVideoSerializer,
)


@extend_schema(tags=["Properties"])
class PropertyViewSet(viewsets.ModelViewSet):
    queryset = Property.objects.all()
    parser_classes = (MultiPartParser, FormParser)
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    filterset_fields = [
        "property_type",
        "listing_type",
        "property_status",
        "listing_status",
        "bedrooms",
        "bathrooms",
    ]
    search_fields = ["property_name", "description", "location"]
    ordering_fields = [
        "sale_price",
        "listed_date",
        "bedrooms",
        "area_sqft",
        "rent_price",
    ]
    ordering = ["-listed_date"]

    def get_permissions(self):
        if self.action in ["create"]:
            permission_classes = [IsAgentOrAdmin]
        elif self.action in ["update", "partial_update", "destroy"]:
            permission_classes = [IsOwnerOrReadOnly]
        else:
            permission_classes = [permissions.AllowAny]
        return [permission() for permission in permission_classes]

    def get_serializer_class(self):
        if self.action == "list":
            return PropertyListSerializer
        elif self.action == "create":
            return PropertyCreateSerializer
        elif self.action in ["update", "partial_update"]:
            return PropertyUpdateSerializer
        return PropertyDetailSerializer

    def get_queryset(self):
        queryset = super().get_queryset()

        # Filter by user type
        if self.request.user.is_authenticated:
            user_type = self.request.query_params.get("user_type")
            if user_type == "agent" and self.request.user.user_type == "AGENT":
                return queryset.filter(listed_by=self.request.user)

        # Filter by property status for non-agents
        if not self.request.user.is_staff and not (
            self.request.user.is_authenticated
            and self.request.user.user_type == "AGENT"
        ):
            queryset = queryset.filter(listing_status=Property.ListingStatus.APPROVED)

        return queryset

    @extend_schema(
        parameters=[
            OpenApiParameter(
                name="min_price",
                type=float,
                location=OpenApiParameter.QUERY,
                description="Minimum price filter",
            ),
            OpenApiParameter(
                name="max_price",
                type=float,
                location=OpenApiParameter.QUERY,
                description="Maximum price filter",
            ),
            OpenApiParameter(
                name="min_rent",
                type=float,
                location=OpenApiParameter.QUERY,
                description="Minimum rent price filter (for rental listings)",
            ),
            OpenApiParameter(
                name="max_rent",
                type=float,
                location=OpenApiParameter.QUERY,
                description="Maximum rent price filter (for rental listings)",
            ),
        ]
    )
    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        # Price range filtering
        min_price = request.query_params.get("min_price")
        max_price = request.query_params.get("max_price")
        min_rent = request.query_params.get("min_rent")
        max_rent = request.query_params.get("max_rent")

        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)
        if min_rent:
            queryset = queryset.filter(rent_price__gte=min_rent)
        if max_rent:
            queryset = queryset.filter(rent_price__lte=max_rent)

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return APIResponse.success(data=serializer.data)

    @action(
        detail=True,
        methods=["POST"],
        url_path="review",
        permission_classes=[permissions.IsAdminUser],
    )
    def review_property(self, request, pk=None):
        property_instance = self.get_object()

        if property_instance.listing_status != Property.ListingStatus.PENDING:
            return APIResponse.bad_request("Property is not pending review")

        decision = request.data.get("decision", "").upper()
        if decision not in ["APPROVED", "DECLINED"]:
            return APIResponse.bad_request("Invalid decision")

        property_instance.listing_status = decision
        property_instance.save()

        self._send_owner_review_notification_email(property_instance, decision)

        return APIResponse.success(
            data=PropertyDetailSerializer(
                property_instance, context={"request": request}
            ).data,
            message=f"Property has been {decision.lower()}",
        )

    def _create_review_notification(self, property_instance):
        owner = property_instance.listed_by
        Notification.objects.create(
            user=owner,
            message=f"Your property listing '{property_instance.property_name}' is pending review.",
        )

    def _send_owner_review_notification_email(self, property_instance, decision):
        owner = property_instance.listed_by

        if owner.email:
            subject = f"Property Listing {decision.title()}: {property_instance.property_name}"

            # Render the HTML template
            html_message = render_to_string(
                "email/owner_property_review_notification.html",
                {
                    "decision": decision.lower(),
                    "decision_title": (
                        "Congratulations"
                        if decision == "APPROVED"
                        else "Your property listing has been declined"
                    ),
                    "property_name": property_instance.property_name,
                    "location": property_instance.location,
                },
            )
            plain_message = strip_tags(html_message)
            try:
                send_mail(
                    subject=subject,
                    message=plain_message,
                    html_message=html_message,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[owner.email],
                )
            except Exception:
                raise serializers.ValidationError(
                    {"email": "Error sending email to admin users"}
                )


@extend_schema(tags=["Property Images"])
class PropertyImageViewSet(viewsets.ModelViewSet):
    serializer_class = PropertyImageSerializer
    parser_classes = (MultiPartParser, FormParser)

    def get_queryset(self):
        return PropertyImage.objects.filter(property_id=self.kwargs["property_pk"])

    def get_permissions(self):
        if self.action in ["create"]:
            permission_classes = [IsAgentOrAdmin]
        elif self.action in ["destroy"]:
            permission_classes = [IsOwnerOrReadOnly]
        else:
            permission_classes = [permissions.AllowAny]
        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        try:
            property = Property.objects.get(pk=self.kwargs["property_pk"])
        except Property.DoesNotExist:
            return APIResponse.not_found("Property not found")
        if property.listed_by != self.request.user and not self.request.user.is_staff:
            return APIResponse.forbidden(
                "You don't have permission to add images to this property"
            )

        if PropertyImage.objects.filter(property=property).count() >= 5:
            return APIResponse.bad_request("This property already has 5 images")

        serializer.save(property_id=self.kwargs["property_pk"])


@extend_schema(tags=["Property Videos"])
class PropertyVideoViewSet(viewsets.ModelViewSet):
    serializer_class = PropertyVideoSerializer
    parser_classes = (MultiPartParser, FormParser)

    def get_queryset(self):
        return PropertyVideo.objects.filter(property_id=self.kwargs["property_pk"])

    def get_permissions(self):
        if self.action in ["create"]:
            permission_classes = [IsAgentOrAdmin]
        elif self.action in ["destroy"]:
            permission_classes = [IsOwnerOrReadOnly]
        else:
            permission_classes = [permissions.AllowAny]
        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        property = Property.objects.get(pk=self.kwargs["property_pk"])
        if property.listed_by != self.request.user and not self.request.user.is_staff:
            return APIResponse.forbidden(
                "You don't have permission to add videos to this property"
            )

        if PropertyVideo.objects.filter(property=property).exists():
            return APIResponse.bad_request("This property already has a video")

        serializer.save(property_id=self.kwargs["property_pk"])


# Add this view to your existing views
@extend_schema(tags=["Amenities"])
class AmenityView(APIView):
    permission_classes = [permissions.AllowAny]

    @extend_schema(
        responses=AmenitySerializer(many=True),
        description="Retrieve a list of all amenities",
    )
    def get(self, request):
        amenities = Amenity.objects.filter(is_active=True)
        serializer = AmenitySerializer(amenities, many=True)

        return APIResponse.success(
            data=serializer.data, message="Amenities retrieved successfully"
        )
