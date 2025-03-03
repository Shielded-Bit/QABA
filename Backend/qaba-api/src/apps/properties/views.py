from core.utils.permissions import IsAgentOrAdmin, IsOwnerOrReadOnly
from core.utils.response import APIResponse
from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import OpenApiParameter, extend_schema
from rest_framework import filters, permissions, viewsets
from rest_framework.parsers import FormParser, MultiPartParser

from .models import Property, PropertyImage
from .serializers import (
    PropertyCreateSerializer,
    PropertyDetailSerializer,
    PropertyImageSerializer,
    PropertyListSerializer,
    PropertyUpdateSerializer,
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
        "status",
        "bedrooms",
        "bathrooms",
    ]
    search_fields = ["title", "description", "location"]
    ordering_fields = ["price", "listed_date", "bedrooms", "area_sqft"]
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

    def perform_create(self, serializer):
        serializer.save(listed_by=self.request.user)

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
        ]
    )
    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        # Price range filtering
        min_price = request.query_params.get("min_price")
        max_price = request.query_params.get("max_price")

        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return APIResponse.success(data=serializer.data)


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
        property = Property.objects.get(pk=self.kwargs["property_pk"])
        if property.listed_by != self.request.user and not self.request.user.is_staff:
            raise permissions.PermissionDenied(
                "You don't have permission to add images to this property"
            )
        serializer.save(property_id=self.kwargs["property_pk"])
