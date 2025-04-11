from django.contrib import admin

# Register your models here.
from django.utils.html import format_html
from django.utils.translation import gettext_lazy as _

from .models import Amenity, Favorite, Property, PropertyImage, PropertyVideo


@admin.register(Amenity)
class AmenityAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "code",
        "icon_display",
        "is_active",
        "property_count",
        "created_at",
    )
    list_filter = ("is_active", "created_at")
    search_fields = ("name",)
    list_editable = ("is_active",)
    ordering = ("name",)
    readonly_fields = ("created_at", "updated_at")

    fieldsets = (
        (None, {"fields": ("name",)}),
        (_("Display"), {"fields": ("icon", "is_active")}),
        (
            _("Timestamps"),
            {"fields": ("created_at", "updated_at"), "classes": ("collapse",)},
        ),
    )

    def icon_display(self, obj):
        if obj.icon:
            return format_html('<i class="{}" style="font-size: 18px;"></i>', obj.icon)
        return "-"

    icon_display.short_description = "Icon"

    def property_count(self, obj):
        return obj.properties.count()

    property_count.short_description = "Properties"


class PropertyImageInline(admin.TabularInline):
    model = PropertyImage
    extra = 0
    fields = ("image_preview", "image", "uploaded_at")
    readonly_fields = ("image_preview", "uploaded_at")

    def image_preview(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" width="150" height="100" style="object-fit: cover;" />',
                obj.image.url,
            )
        return "No image"

    image_preview.short_description = "Preview"


class PropertyVideoInline(admin.TabularInline):
    model = PropertyVideo
    extra = 0
    fields = ("video_preview", "video", "uploaded_at")
    readonly_fields = ("video_preview", "uploaded_at")

    def video_preview(self, obj):
        if obj.video:
            return format_html(
                '<video width="150" height="100" controls><source src="{}" type="video/mp4">Your browser does not support the video tag.</video>',
                obj.video.url,
            )
        return "No video"

    video_preview.short_description = "Preview"


class AmenitiesInline(admin.TabularInline):
    model = Property.amenities.through
    extra = 1
    verbose_name = "Property Amenity"
    verbose_name_plural = "Property Amenities"


@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    list_display = (
        "property_name",
        "property_type",
        "listing_type",
        "location",
        "price_display",
        "bedrooms",
        "bathrooms",
        "property_status",
        "listing_status",
        "image_count",
        "listed_by",
        "listed_date",
    )
    list_filter = (
        "property_type",
        "listing_type",
        "property_status",
        "listing_status",
        "listed_date",
        "amenities",
    )
    search_fields = (
        "property_name",
        "description",
        "location",
        "listed_by__email",
        "listed_by__first_name",
        "listed_by__last_name",
    )
    readonly_fields = ("listed_date",)
    inlines = [PropertyImageInline, PropertyVideoInline, AmenitiesInline]
    date_hierarchy = "listed_date"
    filter_horizontal = ("amenities",)  # Better UI for many-to-many relationships

    fieldsets = (
        (None, {"fields": ("property_name", "description", "listed_by")}),
        (
            _("Property Details"),
            {
                "fields": (
                    "property_type",
                    "listing_type",
                    "location",
                    "area_sqft",
                    "bedrooms",
                    "bathrooms",
                )
            },
        ),
        (_("Status"), {"fields": ("property_status", "listing_status")}),
        (
            _("Pricing"),
            {
                "fields": ("sale_price", "rent_price", "rent_frequency"),
                "description": "Enter sale price for sales listings, or rent price and frequency for rental listings.",
            },
        ),
        (_("Dates"), {"fields": ("listed_date",), "classes": ("collapse",)}),
    )

    def get_queryset(self, request):
        return super().get_queryset(request).select_related("listed_by")

    def price_display(self, obj):
        if obj.listing_type == "RENT" and obj.rent_price:
            frequency = (
                obj.get_rent_frequency_display() if obj.rent_frequency else "Monthly"
            )
            return f"${obj.rent_price:,} / {frequency}"
        elif obj.sale_price:
            return f"${obj.sale_price:,}"
        return "-"

    price_display.short_description = "Price"

    def image_count(self, obj):
        return obj.images.count()

    image_count.short_description = "Images"

    # Admin actions
    actions = [
        "approve_properties",
        "mark_as_available",
        "mark_as_sold",
        "mark_as_rented",
    ]

    @admin.action(description="Approve selected properties")
    def approve_properties(self, request, queryset):
        queryset.update(listing_status=Property.ListingStatus.APPROVED)
        self.message_user(request, f"{queryset.count()} properties were approved.")

    @admin.action(description="Mark selected properties as available")
    def mark_as_available(self, request, queryset):
        queryset.update(property_status=Property.PropertyStatus.AVAILABLE)
        self.message_user(
            request, f"{queryset.count()} properties were marked as available."
        )

    @admin.action(description="Mark selected properties as sold")
    def mark_as_sold(self, request, queryset):
        queryset.update(property_status=Property.PropertyStatus.SOLD)
        self.message_user(
            request, f"{queryset.count()} properties were marked as sold."
        )

    @admin.action(description="Mark selected properties as rented")
    def mark_as_rented(self, request, queryset):
        queryset.update(property_status=Property.PropertyStatus.RENTED)
        self.message_user(
            request, f"{queryset.count()} properties were marked as rented."
        )


@admin.register(PropertyImage)
class PropertyImageAdmin(admin.ModelAdmin):
    list_display = ("property_link", "image_preview", "uploaded_at")
    list_filter = ("uploaded_at",)
    search_fields = ("property__property_name",)
    readonly_fields = ("property_link", "image_preview", "uploaded_at")
    date_hierarchy = "uploaded_at"

    fieldsets = (
        (None, {"fields": ("property", "image", "image_preview")}),
        (_("Timestamps"), {"fields": ("uploaded_at",), "classes": ("collapse",)}),
    )

    def property_link(self, obj):
        if obj.property:
            return format_html(
                '<a href="{}">{}</a>',
                f"/admin/properties/property/{obj.property.id}/change/",
                obj.property.property_name,
            )
        return "-"

    property_link.short_description = "Property"

    def image_preview(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" width="200" height="150" style="object-fit: cover;" />',
                obj.image.url,
            )
        return "No image"

    image_preview.short_description = "Preview"

    def get_queryset(self, request):
        return super().get_queryset(request).select_related("property")


@admin.register(PropertyVideo)
class PropertyVideoAdmin(admin.ModelAdmin):
    list_display = ("property_link", "video_preview", "uploaded_at")
    list_filter = ("uploaded_at",)
    search_fields = ("property__property_name",)
    readonly_fields = ("property_link", "video_preview", "uploaded_at")
    date_hierarchy = "uploaded_at"

    fieldsets = (
        (None, {"fields": ("property", "video", "video_preview")}),
        (_("Timestamps"), {"fields": ("uploaded_at",), "classes": ("collapse",)}),
    )

    def property_link(self, obj):
        if obj.property:
            return format_html(
                '<a href="{}">{}</a>',
                f"/admin/properties/property/{obj.property.id}/change/",
                obj.property.property_name,
            )
        return "-"

    property_link.short_description = "Property"

    def video_preview(self, obj):
        if obj.video:
            return format_html(
                '<video width="200" height="150" controls>'
                + '<source src="{}" type="video/mp4">'
                + "Your browser does not support the video tag."
                + "</video>",
                obj.video.url,
            )
        return "No video"

    video_preview.short_description = "Preview"

    def get_queryset(self, request):
        return super().get_queryset(request).select_related("property")


@admin.register(Favorite)
class FavoriteAdmin(admin.ModelAdmin):
    list_display = ("user", "property_name", "created_at")
    list_filter = ("created_at",)
    search_fields = ("user__email", "property__property_name")
    date_hierarchy = "created_at"

    def property_name(self, obj):
        return obj.property.property_name

    property_name.short_description = "Property"
