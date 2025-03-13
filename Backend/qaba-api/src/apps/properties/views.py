from core.utils.permissions import IsAgentOrAdmin, IsOwnerOrReadOnly
from core.utils.response import APIResponse
from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import OpenApiParameter, extend_schema, extend_schema_view
from rest_framework import filters, permissions, viewsets
from rest_framework.parsers import FormParser, MultiPartParser


from .models import Property, PropertyImage, PropertyVideo
from .serializers import (
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
    ordering_fields = ["sale_price", "listed_date", "bedrooms", "area_sqft", "rent_price"]
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
            queryset = queryset.filter(status=Property.ListingStatus.APPROVED)

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


@extend_schema(tags=["Property Images"])
@extend_schema_view(
    list=extend_schema(
        parameters=[
            OpenApiParameter(
                name="property_pk",
                type=int,
                location=OpenApiParameter.PATH,
                description="ID of the property",
            ),
        ]
    ),
    retrieve=extend_schema(
        parameters=[
            OpenApiParameter(
                name="property_pk",
                type=int,
                location=OpenApiParameter.PATH,
                description="ID of the property",
            ),
            OpenApiParameter(
                name="id",
                type=int,
                location=OpenApiParameter.PATH,
                description="ID of the property image",
            ),
        ]
    ),
    create=extend_schema(
        parameters=[
            OpenApiParameter(
                name="property_pk",
                type=int,
                location=OpenApiParameter.PATH,
                description="ID of the property",
            ),
        ]
    ),
    update=extend_schema(
        parameters=[
            OpenApiParameter(
                name="property_pk",
                type=int,
                location=OpenApiParameter.PATH,
                description="ID of the property",
            ),
            OpenApiParameter(
                name="id",
                type=int,
                location=OpenApiParameter.PATH,
                description="ID of the property image",
            ),
        ]
    ),
    partial_update=extend_schema(
        parameters=[
            OpenApiParameter(
                name="property_pk",
                type=int,
                location=OpenApiParameter.PATH,
                description="ID of the property",
            ),
            OpenApiParameter(
                name="id",
                type=int,
                location=OpenApiParameter.PATH,
                description="ID of the property image",
            ),
        ]
    ),
    destroy=extend_schema(
        parameters=[
            OpenApiParameter(
                name="property_pk",
                type=int,
                location=OpenApiParameter.PATH,
                description="ID of the property",
            ),
            OpenApiParameter(
                name="id",
                type=int,
                location=OpenApiParameter.PATH,
                description="ID of the property image",
            ),
        ]
    ),
)
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
        property = Property.objects.get(pk=self.kwargs["property_pk"])
        if property.listed_by != self.request.user and not self.request.user.is_staff:
            raise permissions.PermissionDenied(
                "You don't have permission to add images to this property"
            )

        # Check if property already has 5 images
        if PropertyImage.objects.filter(property=property).count() >= 5:
            raise permissions.PermissionDenied(
                "This property already has the maximum of 5 images"
            )

        serializer.save(property_id=self.kwargs["property_pk"])


@extend_schema(tags=["Property Videos"])
@extend_schema_view(
    list=extend_schema(
        parameters=[
            OpenApiParameter(
                name="property_pk",
                type=int,
                location=OpenApiParameter.PATH,
                description="ID of the property",
            ),
        ]
    ),
    retrieve=extend_schema(
        parameters=[
            OpenApiParameter(
                name="property_pk",
                type=int,
                location=OpenApiParameter.PATH,
                description="ID of the property",
            ),
            OpenApiParameter(
                name="id",
                type=int,
                location=OpenApiParameter.PATH,
                description="ID of the property video",
            ),
        ]
    ),
    create=extend_schema(
        parameters=[
            OpenApiParameter(
                name="property_pk",
                type=int,
                location=OpenApiParameter.PATH,
                description="ID of the property",
            ),
        ]
    ),
    update=extend_schema(
        parameters=[
            OpenApiParameter(
                name="property_pk",
                type=int,
                location=OpenApiParameter.PATH,
                description="ID of the property",
            ),
            OpenApiParameter(
                name="id",
                type=int,
                location=OpenApiParameter.PATH,
                description="ID of the property video",
            ),
        ]
    ),
    partial_update=extend_schema(
        parameters=[
            OpenApiParameter(
                name="property_pk",
                type=int,
                location=OpenApiParameter.PATH,
                description="ID of the property",
            ),
            OpenApiParameter(
                name="id",
                type=int,
                location=OpenApiParameter.PATH,
                description="ID of the property video",
            ),
        ]
    ),
    destroy=extend_schema(
        parameters=[
            OpenApiParameter(
                name="property_pk",
                type=int,
                location=OpenApiParameter.PATH,
                description="ID of the property",
            ),
            OpenApiParameter(
                name="id",
                type=int,
                location=OpenApiParameter.PATH,
                description="ID of the property video",
            ),
        ]
    ),
)
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
            raise permissions.PermissionDenied(
                "You don't have permission to add a video to this property"
            )

        # Check if property already has a video
        if PropertyVideo.objects.filter(property=property).exists():
            raise permissions.PermissionDenied(
                "This property already has a video. Delete the existing video first."
            )

        serializer.save(property_id=self.kwargs["property_pk"])
