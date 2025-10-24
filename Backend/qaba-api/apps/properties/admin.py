from datetime import timezone

from apps.users.models import Notification
from core.utils.send_email import send_email
from django.contrib import admin
from django.http import HttpResponseRedirect
from django.urls import reverse

# Register your models here.
from django.utils.html import format_html
from django.utils.translation import gettext_lazy as _
from requests import request

from .models import (
    Amenity,
    Favorite,
    Property,
    PropertyDocument,
    PropertyImage,
    PropertyReview,
    PropertyVideo,
)


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


class PropertyDocumentInline(admin.TabularInline):
    model = PropertyDocument
    extra = 0
    fields = (
        "document_type",
        "file_preview",
        "uploaded_by",
        "is_verified",
        "uploaded_at",
    )
    readonly_fields = ("file_preview", "uploaded_by", "uploaded_at")

    def file_preview(self, obj):
        if obj.file:
            file_url = obj.file.url
            if file_url.lower().endswith(("jpg", "jpeg", "png", "gif")):
                return format_html(
                    '<img src="{}" width="100" height="100" style="object-fit: cover;" />',
                    file_url,
                )
            return format_html(
                '<a href="{}" target="_blank">View Document</a>', file_url
            )
        return "No file"

    file_preview.short_description = "Preview"


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
        "state",
        "city",
        "listed_date",
        "amenities",
    )
    search_fields = (
        "property_name",
        "description",
        "location",
        "state",
        "city",
        "listed_by__email",
        "listed_by__first_name",
        "listed_by__last_name",
    )
    readonly_fields = ("listed_date",)
    inlines = [
        PropertyImageInline,
        PropertyVideoInline,
        AmenitiesInline,
        PropertyDocumentInline,
    ]
    date_hierarchy = "listed_date"
    filter_horizontal = ("amenities",)

    fieldsets = (
        (None, {"fields": ("property_name", "description", "listed_by")}),
        (
            _("Property Details"),
            {
                "fields": (
                    "property_type",
                    "listing_type",
                    "location",
                    "state",
                    "city",
                    "area_sqft",
                    "bedrooms",
                    "bathrooms",
                )
            },
        ),
        (_("Status"), {"fields": ("property_status", "listing_status", "is_verified")}),
        (
            _("Pricing"),
            {
                "fields": (
                    "sale_price",
                    "rent_price",
                    "rent_frequency",
                    "agent_commission",  # Add commission
                    "qaba_fee",  # Add fee
                    "legal_fee",
                    "total_price",  # Add total price
                ),
                "description": "Enter sale price for sales listings, or rent price and frequency for rental listings.",
            },
        ),
        (_("Dates"), {"fields": ("listed_date",), "classes": ("collapse",)}),
    )

    def price_display(self, obj):
        """Display either rent or sale price with commission and fees if available"""
        price_display = "-"

        if obj.listing_type == "RENT" and obj.rent_price:
            frequency = (
                obj.get_rent_frequency_display() if obj.rent_frequency else "Monthly"
            )
            price_display = f"${obj.rent_price:,} / {frequency}"
        elif obj.sale_price:
            price_display = f"${obj.sale_price:,}"

        if obj.total_price:
            price_display += f" (Total: ${obj.total_price:,})"

        return price_display

    price_display.short_description = "Price"

    def get_queryset(self, request):
        return super().get_queryset(request).select_related("listed_by")

    def image_count(self, obj):
        return obj.images.count()

    image_count.short_description = "Images"

    # Admin actions
    actions = [
        "approve_properties",
        "decline_properties",  # Add decline action
        "mark_as_available",
        "mark_as_sold",
        "mark_as_rented",
    ]

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

    @admin.action(description="Approve selected properties")
    def approve_properties(self, request, queryset):
        updated_count = 0
        for property_obj in queryset:
            if property_obj.listing_status != Property.ListingStatus.APPROVED:
                property_obj.listing_status = Property.ListingStatus.APPROVED
                property_obj.save()

                # Create notification for property owner
                Notification.objects.create(
                    user=property_obj.listed_by,
                    title="Property Approved",
                    message=f"Your property '{property_obj.property_name}' has been approved and is now live on the platform.",
                    notification_type="property_approved",
                )

                # Send email notification
                self._send_owner_approval_notification_email(property_obj, "approved")
                updated_count += 1

        self.message_user(request, f"{updated_count} properties were approved.")

    @admin.action(description="Decline selected properties")
    def decline_properties(self, request, queryset):
        updated_count = 0
        for property_obj in queryset:
            if property_obj.listing_status != Property.ListingStatus.DECLINED:
                property_obj.listing_status = Property.ListingStatus.DECLINED
                property_obj.save()

                # Create notification for property owner
                Notification.objects.create(
                    user=property_obj.listed_by,
                    title="Property Declined",
                    message=f"Your property '{property_obj.property_name}' has been declined. Please review and resubmit with necessary changes.",
                    notification_type="property_declined",
                )

                # Send email notification
                self._send_owner_approval_notification_email(property_obj, "declined")
                updated_count += 1

        self.message_user(request, f"{updated_count} properties were declined.")

    def _send_owner_approval_notification_email(self, property_instance, decision):
        """Send email notification to property owner about approval/decline decision"""
        owner = property_instance.listed_by

        if owner.email:
            subject = f"Property Listing {decision.title()}: {property_instance.property_name}"

            # Determine message based on decision
            if decision == "approved":
                message_title = "Congratulations! Your property has been approved"
                message_body = f"Your property '{property_instance.property_name}' is now live on QABA platform."
            else:
                message_title = "Property listing requires attention"
                message_body = f"Your property '{property_instance.property_name}' needs some adjustments before it can go live."

            try:
                send_email(
                    subject=subject,
                    recipients=[owner.email],
                    template_name="owner_property_review_notification",
                    context={
                        "decision": decision.lower(),
                        "decision_title": message_title,
                        "message_body": message_body,
                        "property_name": property_instance.property_name,
                        "location": property_instance.location,
                        "owner_name": owner.get_full_name(),
                    },
                )
            except Exception as e:
                self.message_user(request, f"Error sending email: {e}", level="WARNING")


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


@admin.register(PropertyDocument)
class PropertyDocumentAdmin(admin.ModelAdmin):
    list_display = (
        "property_link",
        "document_type",
        "uploaded_by",
        "is_verified",
        "uploaded_at",
    )
    list_filter = ("document_type", "is_verified", "uploaded_at")
    search_fields = ("property__property_name",)
    readonly_fields = ("file_preview", "uploaded_at")
    actions = ["verify_documents"]

    fieldsets = (
        (None, {"fields": ("property",)}),
        ("Document", {"fields": ("document_type", "file", "file_preview")}),
        ("Status", {"fields": ("is_verified", "uploaded_by", "uploaded_at")}),
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

    def file_preview(self, obj):
        if obj.file:
            file_url = obj.file.url
            if file_url.lower().endswith(("jpg", "jpeg", "png", "gif")):
                return format_html(
                    '<img src="{}" width="200" height="200" style="object-fit: cover;" />',
                    file_url,
                )
            return format_html(
                '<a href="{}" target="_blank">View Document</a>', file_url
            )
        return "No file"

    file_preview.short_description = "Preview"

    @admin.action(description="Verify selected documents")
    def verify_documents(self, request, queryset):
        updated = queryset.update(is_verified=True)
        self.message_user(request, f"{updated} documents were verified.")


@admin.register(PropertyReview)
class PropertyReviewAdmin(admin.ModelAdmin):
    list_display = (
        "property_name",
        "reviewer_name",
        "rating",
        "status",
        "created_at",
        "action_buttons",
    )
    list_filter = ("status", "rating", "created_at", "reviewer__user_type")
    search_fields = (
        "reviewed_property__property_name",  # UPDATED
        "reviewer__email",
        "reviewer__first_name",
        "reviewer__last_name",
        "comment",
    )
    readonly_fields = ("created_at", "approved_by")
    date_hierarchy = "created_at"
    list_per_page = 25

    fieldsets = (
        (
            None,
            {"fields": ("reviewed_property", "reviewer", "rating", "comment")},
        ),
        ("Status", {"fields": ("status", "approved_by")}),
        (
            "Timestamps",
            {"fields": ("created_at",), "classes": ("collapse",)},
        ),
    )

    def property_name(self, obj):
        return obj.reviewed_property.property_name  # UPDATED

    property_name.short_description = "Property"

    def reviewer_name(self, obj):
        return obj.reviewer.get_full_name()

    reviewer_name.short_description = "Reviewer"

    def action_buttons(self, obj):
        if obj.status == PropertyReview.ReviewStatus.PENDING:
            return format_html(
                '<a class="button" href="{}?action=approve&review_id={}" style="background: #28a745; color: white; padding: 5px 10px; margin-right: 5px;" onclick="return confirm(\'Approve this review?\')">Approve</a>'
                '<a class="button" href="{}?action=reject&review_id={}" style="background: #dc3545; color: white; padding: 5px 10px;" onclick="return confirm(\'Reject this review?\')">Reject</a>',
                reverse("admin:properties_propertyreview_changelist"),
                obj.id,
                reverse("admin:properties_propertyreview_changelist"),
                obj.id,
            )
        return f"Status: {obj.get_status_display()}"

    action_buttons.short_description = "Actions"

    def changelist_view(self, request, extra_context=None):
        # Handle approve/reject actions
        if request.GET.get("action") and request.GET.get("review_id"):
            return self._handle_review_action(request)

        return super().changelist_view(request, extra_context)

    def _handle_review_action(self, request):
        action = request.GET.get("action")
        review_id = request.GET.get("review_id")

        try:
            review = PropertyReview.objects.get(id=review_id)

            if action == "approve":
                review.status = PropertyReview.ReviewStatus.APPROVED
                review.approved_by = request.user
                review.approved_at = timezone.now()
                review.save()

                # Create notification for reviewer
                from apps.users.models import Notification

                Notification.objects.create(
                    user=review.reviewer,
                    title="Review Approved",
                    message=f"Your review for '{review.reviewed_property.property_name}' has been approved and is now visible.",  # UPDATED
                    notification_type="review_approved",
                )

                self.message_user(
                    request,
                    f"Review by {review.reviewer.get_full_name()} has been approved.",
                )

            elif action == "reject":
                review.status = PropertyReview.ReviewStatus.REJECTED
                review.save()

                # Create notification for reviewer
                from apps.users.models import Notification

                Notification.objects.create(
                    user=review.reviewer,
                    title="Review Rejected",
                    message=f"Your review for '{review.reviewed_property.property_name}' has been rejected and will not be displayed.",  # UPDATED
                    notification_type="review_rejected",
                )

                self.message_user(
                    request,
                    f"Review by {review.reviewer.get_full_name()} has been rejected.",
                )

        except PropertyReview.DoesNotExist:
            self.message_user(request, "Review not found.", level="ERROR")
        except Exception as e:
            self.message_user(
                request, f"Error processing action: {str(e)}", level="ERROR"
            )

        return HttpResponseRedirect(
            reverse("admin:properties_propertyreview_changelist")
        )

    def get_queryset(self, request):
        return (
            super()
            .get_queryset(request)
            .select_related("reviewed_property", "reviewer")
        )  # UPDATED

    # Bulk actions
    actions = ["approve_reviews", "reject_reviews"]

    @admin.action(description="Approve selected reviews")
    def approve_reviews(self, request, queryset):
        from django.utils import timezone

        updated = 0
        for review in queryset.filter(status=PropertyReview.ReviewStatus.PENDING):
            review.status = PropertyReview.ReviewStatus.APPROVED
            review.approved_by = request.user
            review.approved_at = timezone.now()
            review.save()

            from apps.users.models import Notification

            Notification.objects.create(
                user=review.reviewer,
                title="Review Approved",
                message=f"Your review for '{review.reviewed_property.property_name}' has been approved and is now visible.",  # UPDATED
                notification_type="review_approved",
            )
            updated += 1

        self.message_user(request, f"{updated} reviews were approved.")

    @admin.action(description="Reject selected reviews")
    def reject_reviews(self, request, queryset):
        updated = 0
        for review in queryset.filter(status=PropertyReview.ReviewStatus.PENDING):
            review.status = PropertyReview.ReviewStatus.REJECTED
            review.save()

            from apps.users.models import Notification

            Notification.objects.create(
                user=review.reviewer,
                title="Review Rejected",
                message=f"Your review for '{review.reviewed_property.property_name}' has been rejected and will not be displayed.",  # UPDATED
                notification_type="review_rejected",
            )
            updated += 1

        self.message_user(request, f"{updated} reviews were rejected.")
