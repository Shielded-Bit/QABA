from django.urls import include, path, register_converter
from rest_framework_nested import routers

from .views import (
    AmenityView,
    CreatePropertyReviewView,
    FavoriteListView,
    FavoriteToggleView,
    ListPropertyReviewsView,
    PropertyDocumentDetailView,
    PropertyDocumentView,
    PropertyViewSet,
)


# Define a path converter for integer IDs
class IntConverter:
    regex = "[0-9]+"

    def to_python(self, value):
        return int(value)

    def to_url(self, value):
        return str(value)


# Register the converter
register_converter(IntConverter, "int")


router = routers.DefaultRouter()
router.register(r"properties", PropertyViewSet, basename="property")


properties_router = routers.NestedDefaultRouter(
    router, r"properties", lookup="property"
)


urlpatterns = [
    path("", include(router.urls)),
    path("", include(properties_router.urls)),
    path("amenities/", AmenityView.as_view(), name="amenities-list"),
    path("favorites/", FavoriteListView.as_view(), name="favorites-list"),
    path("favorites/toggle/", FavoriteToggleView.as_view(), name="favorites-toggle"),
    path(
        "properties/<uuid:property_id>/documents/",
        PropertyDocumentView.as_view(),
        name="property-documents",
    ),
    path(
        "properties/<uuid:property_id>/documents/<uuid:document_id>/",
        PropertyDocumentDetailView.as_view(),
        name="property-document-detail",
    ),
    path("reviews/create/", CreatePropertyReviewView.as_view(), name="create-review"),
    path(
        "reviews/property/<int:property_id>/",
        ListPropertyReviewsView.as_view(),
        name="property-reviews",
    ),
]
