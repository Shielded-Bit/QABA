from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.http import HttpResponseRedirect
from django.template.loader import render_to_string
from django.urls import reverse
from django.utils.html import format_html
from django.utils.safestring import mark_safe
from django.utils.translation import gettext_lazy as _

from .models import AgentProfile, ClientProfile, LandlordProfile, Notification, User


class ClientProfileInline(admin.StackedInline):
    model = ClientProfile
    can_delete = False
    verbose_name_plural = "Client Profile"
    fk_name = "user"

    def get_queryset(self, request):
        return super().get_queryset(request).select_related("user")

    def has_add_permission(self, request, obj=None):
        # Only allow adding profile if user is a CLIENT and doesn't have a profile yet
        if (
            obj
            and obj.user_type == User.UserType.CLIENT
            and not hasattr(obj, "clientprofile")
        ):
            return True
        return False


class AgentProfileInline(admin.StackedInline):
    model = AgentProfile
    can_delete = False
    verbose_name_plural = "Agent Profile"
    fk_name = "user"

    def get_queryset(self, request):
        return super().get_queryset(request).select_related("user")

    def has_add_permission(self, request, obj=None):
        # Only allow adding profile if user is an AGENT and doesn't have a profile yet
        if (
            obj
            and obj.user_type == User.UserType.AGENT
            and not hasattr(obj, "agentprofile")
        ):
            return True
        return False


class LandlordProfileInline(admin.StackedInline):
    model = LandlordProfile
    can_delete = False
    verbose_name_plural = "Landlord Profile"
    fk_name = "user"

    def get_queryset(self, request):
        return super().get_queryset(request).select_related("user")

    def has_add_permission(self, request, obj=None):
        # Only allow adding profile if user is a LANDLORD and doesn't have a profile yet
        if (
            obj
            and obj.user_type == User.UserType.LANDLORD
            and not hasattr(obj, "landlordprofile")
        ):
            return True
        return False


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = (
        "email",
        "first_name",
        "last_name",
        "user_type",
        "phone_number",
        "is_email_verified",
        "is_active",
        "date_joined",
        "profile_photo_display",
    )
    list_filter = ("user_type", "is_email_verified", "is_active", "date_joined")
    search_fields = ("email", "first_name", "last_name")
    readonly_fields = ("date_joined", "last_login")
    ordering = ("-date_joined",)

    fieldsets = (
        (None, {"fields": ("email", "password")}),
        (_("Personal info"), {"fields": ("first_name", "last_name", "phone_number")}),
        (_("User type"), {"fields": ("user_type",)}),
        (
            _("Verification"),
            {
                "fields": (
                    "is_email_verified",
                    "email_verification_token",
                    "password_reset_token",
                )
            },
        ),
        (
            _("Permissions"),
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                ),
            },
        ),
        (_("Important dates"), {"fields": ("last_login", "date_joined")}),
    )

    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": (
                    "email",
                    "first_name",
                    "last_name",
                    "phone_number",
                    "user_type",
                    "password1",
                    "password2",
                ),
            },
        ),
    )

    def get_inlines(self, request, obj=None):
        inlines = []
        if obj:
            if obj.user_type == User.UserType.CLIENT:
                inlines.append(ClientProfileInline)
            elif obj.user_type == User.UserType.AGENT:
                inlines.append(AgentProfileInline)
            elif obj.user_type == User.UserType.LANDLORD:
                inlines.append(LandlordProfileInline)
        return inlines

    def profile_photo_display(self, obj):
        try:
            if (
                obj.user_type == User.UserType.CLIENT
                and hasattr(obj, "clientprofile")
                and obj.clientprofile.profile_photo
            ):
                return format_html(
                    '<img src="{}" width="50" height="50" style="border-radius:50%;" />',
                    obj.clientprofile.profile_photo.url,
                )
            elif (
                obj.user_type == User.UserType.AGENT
                and hasattr(obj, "agentprofile")
                and obj.agentprofile.profile_photo
            ):
                return format_html(
                    '<img src="{}" width="50" height="50" style="border-radius:50%;" />',
                    obj.agentprofile.profile_photo.url,
                )
        except Exception:
            pass
        return format_html('<span style="color:gray;">No photo</span>')

    profile_photo_display.short_description = "Profile Photo"

    def save_model(self, request, obj, form, change):
        # If creating a new user (not change) and no password is set, set an unusable password
        if not change and not obj.password:
            obj.set_unusable_password()
        super().save_model(request, obj, form, change)

    def save_formset(self, request, form, formset, change):
        instances = formset.save(commit=False)
        for instance in instances:
            instance.save()
        formset.save_m2m()

    # Admin actions
    actions = ["verify_email", "activate_users", "deactivate_users"]

    @admin.action(description="Verify selected users email")
    def verify_email(self, request, queryset):
        queryset.update(is_email_verified=True)
        self.message_user(
            request, f"{queryset.count()} users were marked as email verified."
        )

    @admin.action(description="Activate selected users")
    def activate_users(self, request, queryset):
        queryset.update(is_active=True)
        self.message_user(request, f"{queryset.count()} users were activated.")

    @admin.action(description="Deactivate selected users")
    def deactivate_users(self, request, queryset):
        queryset.update(is_active=False)
        self.message_user(request, f"{queryset.count()} users were deactivated.")


@admin.register(ClientProfile)
class ClientProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "address", "country", "city")
    list_filter = ("country", "city")
    search_fields = (
        "user__email",
        "user__first_name",
        "user__last_name",
        "city",
        "country",
    )

    fieldsets = (
        (None, {"fields": ("user",)}),
        (_("Location"), {"fields": ("country", "state", "city", "address")}),
        (_("Profile"), {"fields": ("profile_photo",)}),
    )

    def get_queryset(self, request):
        return super().get_queryset(request).select_related("user")


@admin.register(AgentProfile)
class AgentProfileAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "country",
        "city",
    )
    list_filter = ("country", "city")
    search_fields = (
        "user__email",
        "user__first_name",
        "user__last_name",
        "country",
        "city",
    )

    fieldsets = (
        (None, {"fields": ("user",)}),
        (_("Location"), {"fields": ("country", "state", "city", "address")}),
        (_("Profile"), {"fields": ("profile_photo",)}),
    )

    def get_queryset(self, request):
        return super().get_queryset(request).select_related("user")


@admin.register(LandlordProfile)
class LandlordProfileAdmin(AgentProfileAdmin):
    pass


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "user",
        "notification_type",
        "property_link",
        "created_at",
        "is_read",
    )
    list_filter = (
        "notification_type",
        "is_read",
        "created_at",
        "user__user_type",
    )
    search_fields = (
        "title",
        "message",
        "user__email",
        "user__first_name",
        "user__last_name",
    )
    readonly_fields = (
        "title",
        "message",
        "user",
        "notification_type",
        "metadata",
        "created_at",
        "property_details",
        "action_buttons",
    )
    date_hierarchy = "created_at"

    # Pagination for better performance
    list_per_page = 25
    list_max_show_all = 100

    fieldsets = (
        (
            None,
            {"fields": ("title", "message", "user", "notification_type", "is_read")},
        ),
        (
            _("Property Details"),
            {
                "fields": ("property_details", "action_buttons"),
                "classes": ("wide",),
            },
        ),
        (
            _("Metadata"),
            {
                "fields": ("metadata", "created_at"),
                "classes": ("collapse",),
            },
        ),
    )

    def __init__(self, model, admin_site):
        super().__init__(model, admin_site)

    def _update_sidebar_title(self):
        """Update the sidebar title with unread count"""
        try:
            # Only filter for property review notifications to get accurate count
            unread_count = Notification.objects.filter(
                notification_type="property_review_required", is_read=False
            ).count()
            if unread_count > 0:
                self.model._meta.verbose_name_plural = f"Notifications ({unread_count})"
            else:
                self.model._meta.verbose_name_plural = "Notifications"
        except Exception:
            self.model._meta.verbose_name_plural = "Notifications"

    def changelist_view(self, request, extra_context=None):
        """Handle approve/decline actions and update sidebar title"""
        # Update sidebar title only when the view is accessed, not during init
        self._update_sidebar_title()

        if request.GET.get("action") and request.GET.get("notification_id"):
            return self._handle_property_action(request)

        # Get unread notification count for the page title
        queryset = self.get_queryset(request)
        unread_count = queryset.filter(is_read=False).count()
        total_count = queryset.count()

        # Customize the title with counts
        extra_context = extra_context or {}
        extra_context.update(
            {
                "title": f"Property Review Notifications ({unread_count} pending)",
                "subtitle": f"{unread_count} properties awaiting review"
                if unread_count > 0
                else "No properties pending review",
                "unread_count": unread_count,
                "total_count": total_count,
            }
        )

        return super().changelist_view(request, extra_context)

    def property_link(self, obj):
        """Display property name with link to property admin"""
        if obj.notification_type == "property_review_required" and obj.metadata:
            property_id = obj.metadata.get("property_id")
            property_name = obj.metadata.get("property_name", "Unknown Property")
            if property_id:
                try:
                    url = reverse(
                        "admin:properties_property_change", args=[property_id]
                    )
                    return format_html(
                        '<a href="{}" target="_blank" style="color: #007bff; text-decoration: none;">{}</a>',
                        url,
                        property_name,
                    )
                except Exception:
                    return property_name
        return "-"

    property_link.short_description = "Property"

    def property_details(self, obj):
        """Display detailed property information for review notifications"""
        if obj.notification_type == "property_review_required" and obj.metadata:
            try:
                from apps.properties.models import Property

                property_id = obj.metadata.get("property_id")
                if property_id:
                    property_obj = Property.objects.get(id=property_id)

                    # Get property images
                    images = property_obj.images.all()[:3]  # Show first 3 images

                    # Render the template with context
                    html_content = render_to_string(
                        "admin/property_details.html",
                        {
                            "property": property_obj,
                            "images": images,
                            "price_display": self._get_price_display(property_obj),
                        },
                    )

                    return mark_safe(html_content)

            except Exception as e:
                return format_html(
                    '<div class="error-message">'
                    '<p style="color: #dc3545; background: #f8d7da; padding: 8px; border-radius: 3px; border: 1px solid #f5c6cb;">'
                    "Error loading property details: {}"
                    "</p>"
                    "</div>",
                    str(e),
                )
        return "-"

    property_details.short_description = "Property Information"

    def action_buttons(self, obj):
        """Display approve/decline buttons for property review notifications"""
        if obj.notification_type == "property_review_required" and obj.metadata:
            property_id = obj.metadata.get("property_id")
            if property_id:
                # Render action buttons template
                html_content = render_to_string(
                    "admin/action_buttons.html",
                    {
                        "notification": obj,
                        "approve_url": f"{reverse('admin:users_notification_changelist')}?action=approve&notification_id={obj.id}",
                        "decline_url": f"{reverse('admin:users_notification_changelist')}?action=decline&notification_id={obj.id}",
                        "view_url": reverse(
                            "admin:properties_property_change", args=[property_id]
                        ),
                    },
                )
                return mark_safe(html_content)
        return "-"

    action_buttons.short_description = "Actions"

    def _get_price_display(self, property_obj):
        """Helper method to display price"""
        if property_obj.listing_type == "RENT" and property_obj.rent_price:
            frequency = (
                property_obj.get_rent_frequency_display()
                if property_obj.rent_frequency
                else "Monthly"
            )
            return f"${property_obj.rent_price:,} / {frequency}"
        elif property_obj.sale_price:
            return f"${property_obj.sale_price:,}"
        return "Price not set"

    # def changelist_view(self, request, extra_context=None):
    #     """Handle approve/decline actions from the changelist"""
    #     if request.GET.get("action") and request.GET.get("notification_id"):
    #         return self._handle_property_action(request)
    #     return super().changelist_view(request, extra_context)

    def _handle_property_action(self, request):
        """Handle approve/decline actions"""
        action = request.GET.get("action")
        notification_id = request.GET.get("notification_id")

        try:
            notification = Notification.objects.get(id=notification_id)
            property_id = notification.metadata.get("property_id")

            if property_id:
                from apps.properties.models import Property

                property_obj = Property.objects.get(id=property_id)

                if action == "approve":
                    property_obj.listing_status = Property.ListingStatus.APPROVED
                    property_obj.save()

                    # Create approval notification for property owner
                    Notification.objects.create(
                        user=property_obj.listed_by,
                        title="Property Approved",
                        message=f"Your property '{property_obj.property_name}' has been approved and is now live on the platform.",
                        notification_type="property_approved",
                        is_read=True,
                    )

                    # Send email notification to property owner
                    self._send_approval_email(property_obj, "approved")

                    # Delete the original notification instead of marking as read
                    notification.delete()

                    self.message_user(
                        request,
                        f"Property '{property_obj.property_name}' has been approved successfully.",
                    )

                elif action == "decline":
                    property_obj.listing_status = Property.ListingStatus.DECLINED
                    property_obj.save()

                    # Create decline notification for property owner
                    Notification.objects.create(
                        user=property_obj.listed_by,
                        title="Property Declined",
                        message=f"Your property '{property_obj.property_name}' has been declined. Please review and resubmit with necessary changes.",
                        notification_type="property_declined",
                        is_read=True,
                    )

                    # Send email notification to property owner
                    self._send_approval_email(property_obj, "declined")

                    # Delete the original notification instead of marking as read
                    notification.delete()

                    self.message_user(
                        request,
                        f"Property '{property_obj.property_name}' has been declined.",
                    )

        except Notification.DoesNotExist:
            self.message_user(request, "Notification not found.", level="ERROR")
        except Exception as e:
            self.message_user(
                request, f"Error processing action: {str(e)}", level="ERROR"
            )

        # Redirect back to changelist
        return HttpResponseRedirect(reverse("admin:users_notification_changelist"))

    def _send_approval_email(self, property_obj, decision):
        """Send email notification to property owner about approval/decline decision"""
        try:
            from django.conf import settings
            from django.core.mail import send_mail
            from django.template.loader import render_to_string
            from django.utils.html import strip_tags

            owner = property_obj.listed_by

            if owner.email:
                subject = (
                    f"Property Listing {decision.title()}: {property_obj.property_name}"
                )

                # Determine message based on decision
                if decision == "approved":
                    message_title = "Congratulations! Your property has been approved"
                    message_body = f"Your property '{property_obj.property_name}' is now live on QABA platform."
                else:
                    message_title = "Property listing requires attention"
                    message_body = f"Your property '{property_obj.property_name}' needs some adjustments before it can go live."

                # Render email template
                html_message = render_to_string(
                    "email/owner_property_review_notification.html",
                    {
                        "decision": decision.lower(),
                        "decision_title": message_title,
                        "message_body": message_body,
                        "property_name": property_obj.property_name,
                        "location": property_obj.location,
                        "owner_name": owner.get_full_name(),
                    },
                )
                plain_message = strip_tags(html_message)

                send_mail(
                    subject=subject,
                    message=plain_message,
                    html_message=html_message,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[owner.email],
                    fail_silently=False,
                )
        except Exception as e:
            # Log the error but don't break the workflow
            import logging

            logger = logging.getLogger(__name__)
            logger.error(f"Failed to send email notification: {str(e)}")

    def get_queryset(self, request):
        return (
            super()
            .get_queryset(request)
            .select_related("user")
            .prefetch_related("user__groups")
        )

    def has_add_permission(self, request):
        return False  # Prevent adding notifications manually

    def has_delete_permission(self, request, obj=None):
        return True  # Allow deleting read notifications

    # Admin actions for bulk operations
    actions = ["mark_as_read", "mark_as_unread", "delete_read_notifications"]

    @admin.action(description="Mark selected notifications as read")
    def mark_as_read(self, request, queryset):
        updated = queryset.update(is_read=True)
        self.message_user(request, f"{updated} notifications were marked as read.")

    @admin.action(description="Mark selected notifications as unread")
    def mark_as_unread(self, request, queryset):
        updated = queryset.update(is_read=False)
        self.message_user(request, f"{updated} notifications were marked as unread.")

    @admin.action(description="Delete read notifications")
    def delete_read_notifications(self, request, queryset):
        read_notifications = queryset.filter(is_read=True)
        count = read_notifications.count()
        read_notifications.delete()
        self.message_user(request, f"{count} read notifications were deleted.")
