from core.utils.permissions import IsAgentOrAdmin, IsOwnerOrReadOnly
from core.utils.response import APIResponse
from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import OpenApiParameter, extend_schema
from rest_framework import filters, generics, permissions, viewsets
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.views import APIView

from .models import Amenity, Favorite, Property, PropertyDocument, PropertyReview
from .permissions import IsClientOrAgent
from .serializers import (
    AmenitySerializer,
    FavoriteSerializer,
    PropertyCreateSerializer,
    PropertyDetailSerializer,
    PropertyDocumentSerializer,
    PropertyDocumentUploadSerializer,
    PropertyFavoriteToggleSerializer,
    PropertyListSerializer,
    PropertyReviewCreateSerializer,
    PropertyReviewSerializer,
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
        "property_status",
        "listing_status",
        "bedrooms",
        "bathrooms",
        "state",
        "city",
    ]
    search_fields = ["property_name", "description", "location", "state", "city"]
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
        if (
            self.request.user.is_authenticated
            and self.request.user.user_type == "AGENT"
        ):
            return queryset.filter(listed_by=self.request.user)

        # Filter by property status for non-agents
        if not self.request.user.is_staff and not (
            self.request.user.is_authenticated
            and self.request.user.user_type == "AGENT"
        ):
            queryset = queryset.filter(
                listing_status=Property.ListingStatus.APPROVED,
                property_status=Property.PropertyStatus.AVAILABLE,
            )

        return queryset

    @extend_schema(
        parameters=[
            OpenApiParameter(
                name="lister_type",
                type=str,
                location=OpenApiParameter.QUERY,
                description="Filter by lister type (LANDLOARD, AGENT)",
            ),
            OpenApiParameter(
                name="min_total",
                type=float,
                location=OpenApiParameter.QUERY,
                description="Minimum total price filter",
            ),
            OpenApiParameter(
                name="max_total",
                type=float,
                location=OpenApiParameter.QUERY,
                description="Maximum total price filter",
            ),
            OpenApiParameter(
                name="min_sale",
                type=float,
                location=OpenApiParameter.QUERY,
                description="Minimum price filter",
            ),
            OpenApiParameter(
                name="max_sale",
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
            OpenApiParameter(
                name="state",
                type=str,
                location=OpenApiParameter.QUERY,
                description="Filter by state",
            ),
            OpenApiParameter(
                name="city",
                type=str,
                location=OpenApiParameter.QUERY,
                description="Filter by city",
            ),
        ]
    )
    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        # Price range filtering
        lister_type = request.query_params.get("lister_type")
        min_total = request.query_params.get("min_total")
        max_total = request.query_params.get("max_total")
        min_price = request.query_params.get("min_sale")
        max_price = request.query_params.get("max_sale")
        min_rent = request.query_params.get("min_rent")
        max_rent = request.query_params.get("max_rent")

        if lister_type:
            queryset = queryset.filter(lister_type=lister_type)

        if min_total:
            try:
                min_total = float(min_total)
                queryset = queryset.filter(total_price__gte=min_total)
            except ValueError:
                pass

        if max_total:
            try:
                max_total = float(max_total)
                queryset = queryset.filter(total_price__lte=max_total)
            except ValueError:
                pass

        if min_price:
            queryset = queryset.filter(sale_price__gte=min_price)
        if max_price:
            queryset = queryset.filter(sale_price__lte=max_price)
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

    def retrieve(self, request, *args, **kwargs):
        """
        Retrieve a specific property with related properties based on city and state
        """
        instance = self.get_object()
        serializer = self.get_serializer(instance)

        related_properties = self._get_related_properties(instance)
        related_serializer = PropertyListSerializer(
            related_properties, many=True, context=self.get_serializer_context()
        )

        data = serializer.data
        data["related_properties"] = related_serializer.data

        return APIResponse.success(data=data)

    def _get_related_properties(self, instance):
        """
        Get 3 related properties, prioritizing properties in the same city,
        then properties in the same state
        """
        related_properties = Property.objects.none()

        base_queryset = self.get_queryset().exclude(id=instance.id)

        city_properties = base_queryset.filter(city=instance.city)

        if city_properties.count() >= 3:
            return city_properties.order_by("-listed_date")[:3]

        related_properties = city_properties

        remaining_slots = 3 - related_properties.count()

        if remaining_slots > 0 and instance.state:
            state_properties = base_queryset.filter(state=instance.state).exclude(
                id__in=related_properties.values_list("id", flat=True)
            )

            if state_properties.exists():
                related_properties = related_properties.union(
                    state_properties.order_by("-listed_date")[:remaining_slots]
                )

        remaining_slots = 3 - related_properties.count()
        if remaining_slots > 0:
            recent_properties = base_queryset.exclude(
                id__in=related_properties.values_list("id", flat=True)
            ).order_by("-listed_date")[:remaining_slots]

            if recent_properties.exists():
                related_properties = related_properties.union(recent_properties)

        return related_properties.order_by("-listed_date")[:3]


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


@extend_schema(tags=["Favorites"])
class FavoriteListView(generics.ListAPIView):
    """
    View to list all favorited properties for the current user
    """

    serializer_class = FavoriteSerializer
    permission_classes = [IsClientOrAgent]

    def get_queryset(self):
        return Favorite.objects.filter(user=self.request.user)

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return APIResponse.success(
            data=serializer.data, message="Favorites retrieved successfully"
        )


@extend_schema(tags=["Favorites"])
class FavoriteToggleView(APIView):
    """
    View to toggle favorite status for a property
    """

    permission_classes = (permissions.IsAuthenticated,)  # Update permissions if needed

    def post(self, request):
        serializer = PropertyFavoriteToggleSerializer(data=request.data)
        if serializer.is_valid():
            property_id = serializer.validated_data["property_id"]
            property_obj = get_object_or_404(Property, id=property_id)

            # Check if the property is already favorited
            favorite, created = Favorite.objects.get_or_create(
                user=request.user, property=property_obj
            )

            if not created:
                # If favorite already exists, delete it
                favorite.delete()
                return APIResponse.success(message="Property removed from favorites")

            return APIResponse.success(message="Property added to favorites")

        return APIResponse.bad_request(serializer.errors)


@extend_schema(tags=["Property Documents"])
class PropertyDocumentView(APIView):
    """
    Simple API for managing property documents
    """

    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request, property_id):
        """List all documents for a property"""
        property_obj = get_object_or_404(Property, id=property_id)

        # Determine which documents to show based on user permissions
        if request.user.is_staff or property_obj.listed_by == request.user:
            # Admins and property owners see all documents
            documents = PropertyDocument.objects.filter(property=property_obj)
        else:
            # Others only see verified documents
            documents = PropertyDocument.objects.filter(
                property=property_obj, is_verified=True
            )

        serializer = PropertyDocumentSerializer(documents, many=True)
        return APIResponse.success(
            data=serializer.data, message="Documents retrieved successfully"
        )

    @extend_schema(
        request=PropertyDocumentUploadSerializer,
        responses=PropertyDocumentSerializer,
        description="Upload a new document for a property",
    )
    def post(self, request, property_id):
        """Add a new document to a property"""
        property_obj = get_object_or_404(Property, id=property_id)

        # Only property owner or admin can add documents
        if not (request.user.is_staff or property_obj.listed_by == request.user):
            return APIResponse.forbidden(
                message="You don't have permission to add documents to this property"
            )

        serializer = PropertyDocumentUploadSerializer(data=request.data)
        if serializer.is_valid():
            document = serializer.save(property=property_obj, uploaded_by=request.user)

            return APIResponse.success(
                data=PropertyDocumentSerializer(document).data,
                message="Document added successfully",
            )

        return APIResponse.bad_request(serializer.errors)


@extend_schema(tags=["Property Documents"])
class PropertyDocumentDetailView(APIView):
    """
    API for managing a specific property document
    """

    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    @extend_schema(
        request=PropertyDocumentUploadSerializer,
        responses=PropertyDocumentSerializer,
        description="Update an existing document for a property",
    )
    def put(self, request, property_id, document_id):
        """Update a document"""
        property_obj = get_object_or_404(Property, id=property_id)
        document = get_object_or_404(
            PropertyDocument, id=document_id, property=property_obj
        )

        # Only the owner or admin can update documents
        if not (request.user.is_staff or property_obj.listed_by == request.user):
            return APIResponse.forbidden(
                message="You don't have permission to update this document"
            )

        serializer = PropertyDocumentUploadSerializer(
            document, data=request.data, partial=True
        )
        if serializer.is_valid():
            document = serializer.save()
            return APIResponse.success(
                data=PropertyDocumentSerializer(document).data,
                message="Document updated successfully",
            )

        return APIResponse.bad_request(serializer.errors)

    def delete(self, request, property_id, document_id):
        """Delete a document"""
        property_obj = get_object_or_404(Property, id=property_id)
        document = get_object_or_404(
            PropertyDocument, id=document_id, property=property_obj
        )

        # Only the owner or admin can delete documents
        if not (request.user.is_staff or property_obj.listed_by == request.user):
            return APIResponse.forbidden(
                message="You don't have permission to delete this document"
            )

        document.delete()
        return APIResponse.success(message="Document deleted successfully")


@extend_schema(tags=["Property Reviews"])
class CreatePropertyReviewView(generics.CreateAPIView):
    """Create a new property review"""

    serializer_class = PropertyReviewCreateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        review = serializer.save()

        return APIResponse.success(
            data=PropertyReviewSerializer(review).data,
            message="Review submitted successfully. It will be visible after admin approval.",
        )


@extend_schema(tags=["Property Reviews"])
class ListPropertyReviewsView(generics.ListAPIView):
    """List all approved reviews for a specific property"""

    serializer_class = PropertyReviewSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["rating"]

    def get_queryset(self):
        property_id = self.kwargs.get("property_id")
        return (
            PropertyReview.objects.filter(
                reviewed_property_id=property_id,
                status=PropertyReview.ReviewStatus.APPROVED,
            )
            .select_related("reviewer", "reviewed_property")
            .order_by("-created_at")
        )

    def list(self, request, *args, **kwargs):
        property_id = self.kwargs.get("property_id")

        property_obj = get_object_or_404(Property, id=property_id)

        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)

        total_reviews = queryset.count()
        average_rating = property_obj.average_rating

        return APIResponse.success(
            data={
                "reviews": serializer.data,
                "total_reviews": total_reviews,
                "average_rating": round(average_rating, 1) if average_rating else 0,
                "property_name": property_obj.property_name,
                "rating_breakdown": property_obj.rating_breakdown,
            },
            message="Reviews retrieved successfully",
        )
