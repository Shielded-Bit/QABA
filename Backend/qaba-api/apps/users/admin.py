from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.http import HttpResponseRedirect
from django.template.loader import render_to_string
from django.urls import reverse
from django.utils.html import format_html
from django.utils.safestring import mark_safe
from django.utils.translation import gettext_lazy as _

from core.utils.send_email import send_email

from .models import (
    AdminProfile,
    AgentProfile,
    ClientProfile,
    LandlordProfile,
    Notification,
    PropertySurveyMeeting,
    Referral,
    User,
)


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
        if (
            obj
            and obj.user_type == User.UserType.LANDLORD
            and not hasattr(obj, "landlordprofile")
        ):
            return True
        return False


class AdminProfileInline(admin.StackedInline):
    model = AdminProfile
    can_delete = False
    verbose_name_plural = "Admin Profile"
    fk_name = "user"

    def get_queryset(self, request):
        return super().get_queryset(request).select_related("user")

    def has_add_permission(self, request, obj=None):
        if (
            obj
            and obj.user_type == User.UserType.ADMIN
            and not hasattr(obj, "adminprofile")
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
                "fields": ("is_email_verified",)
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
            elif obj.user_type == User.UserType.ADMIN:
                inlines.append(AdminProfileInline)
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
            elif (
                obj.user_type == User.UserType.LANDLORD
                and hasattr(obj, "landlordprofile")
                and obj.landlordprofile.profile_photo
            ):
                return format_html(
                    '<img src="{}" width="50" height="50" style="border-radius:50%;" />',
                    obj.landlordprofile.profile_photo.url,
                )
            elif (
                obj.user_type == User.UserType.ADMIN
                and hasattr(obj, "adminprofile")
                and obj.adminprofile.profile_photo
            ):
                return format_html(
                    '<img src="{}" width="50" height="50" style="border-radius:50%;" />',
                    obj.adminprofile.profile_photo.url,
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


@admin.register(AdminProfile)
class AdminProfileAdmin(AgentProfileAdmin):
    pass


@admin.register(Referral)
class ReferralAdmin(admin.ModelAdmin):
    list_display = ("user", "source", "custom_source", "created_at")
    list_filter = ("source", "created_at")
    search_fields = (
        "user__email",
        "user__first_name",
        "user__last_name",
        "custom_source",
    )
    readonly_fields = ("created_at", "updated_at")
    ordering = ("-created_at",)

    fieldsets = (
        (None, {"fields": ("user", "source", "custom_source")}),
        (_("Timestamps"), {"fields": ("created_at", "updated_at"), "classes": ("collapse",)}),
    )

    def get_queryset(self, request):
        return super().get_queryset(request).select_related("user")


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
        "review_details",
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
            _("Review Details"),
            {
                "fields": ("review_details",),
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
            owner = property_obj.listed_by

            if owner.email:
                subject = (
                    f"Property Listing {decision.title()}: {property_obj.property_name}"
                )

                if decision == "approved":
                    message_title = "Congratulations! Your property has been approved"
                    message_body = f"Your property '{property_obj.property_name}' is now live on QABA platform."
                else:
                    message_title = "Property listing requires attention"
                    message_body = f"Your property '{property_obj.property_name}' needs some adjustments before it can go live."

                send_email(
                    subject=subject,
                    recipients=[owner.email],
                    template_name="owner_property_review_notification",
                    context={
                        "decision": decision.lower(),
                        "decision_title": message_title,
                        "message_body": message_body,
                        "property_name": property_obj.property_name,
                        "location": property_obj.location,
                        "owner_name": owner.get_full_name(),
                    },
                )
        except Exception as e:
            # Log the error but don't break the workflow
            import logging

            logger = logging.getLogger(__name__)
            logger.error(f"Failed to send email notification: {str(e)}")

    def get_queryset(self, request):
        """Show property review and review approval notifications"""
        return (
            super()
            .get_queryset(request)
            .filter(
                notification_type__in=[
                    "property_review_required",
                    "review_approval_required",
                ]
            )
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

    def review_details(self, obj):
        """Display review details for review approval notifications"""
        if obj.notification_type == "review_approval_required" and obj.metadata:
            try:
                review_id = obj.metadata.get("review_id")
                if review_id:
                    from apps.properties.models import PropertyReview

                    review = PropertyReview.objects.get(id=review_id)

                    return format_html(
                        """
                        <div style="border: 1px solid #ddd; padding: 10px; border-radius: 5px;">
                            <h4>{} - {} Stars</h4>
                            <p><strong>Property:</strong> {}</p>
                            <p><strong>Reviewer:</strong> {} ({})</p>
                            <p><strong>Comment:</strong></p>
                            <div style="background: #f8f9fa; padding: 8px; border-radius: 3px;">
                                {}
                            </div>
                            <p><strong>Status:</strong> {}</p>
                        </div>
                        """,
                        review.reviewer.get_full_name(),
                        review.rating,
                        review.property.property_name,
                        review.reviewer.get_full_name(),
                        review.reviewer.email,
                        review.comment,
                        review.get_status_display(),
                    )
            except Exception as e:
                return format_html(
                    '<p style="color: red;">Error loading review details: {}</p>',
                    str(e),
                )
        return "-"

    review_details.short_description = "Review Information"


@admin.register(PropertySurveyMeeting)
class PropertySurveyMeetingAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user_info",
        "property_display",
        "scheduled_datetime",
        "status",
        "agent_display",
        "created_at",
        "is_upcoming_display",
    )
    list_filter = (
        "status",
        "scheduled_date",
        "created_at",
        "user__user_type",
    )
    search_fields = (
        "user__email",
        "user__first_name",
        "user__last_name",
        "property_id",
        "message",
    )
    readonly_fields = (
        "user",
        "created_at",
        "updated_at",
        "is_upcoming_display",
        "contact_info",
        "property_details",
    )
    date_hierarchy = "scheduled_date"

    # Pagination
    list_per_page = 25
    list_max_show_all = 100

    fieldsets = (
        (
            None,
            {
                "fields": (
                    "user",
                    "property_id",
                    "scheduled_date",
                    "scheduled_time",
                    "message",
                )
            },
        ),
        (
            _("Meeting Management"),
            {
                "fields": (
                    "status",
                    "admin_notes",
                ),
                "classes": ("wide",),
            },
        ),
        (
            _("Property Information"),
            {
                "fields": ("property_details",),
                "classes": ("wide",),
            },
        ),
        (
            _("Contact Information"),
            {
                "fields": ("contact_info",),
                "classes": ("wide",),
            },
        ),
        (
            _("Timestamps"),
            {
                "fields": ("created_at", "updated_at", "is_upcoming_display"),
                "classes": ("collapse",),
            },
        ),
    )

    def get_queryset(self, request):
        return super().get_queryset(request).select_related("user")

    def user_info(self, obj):
        """Display user information with contact details"""
        return format_html(
            "<strong>{}</strong><br/>"
            '<small style="color: #666;">{}</small><br/>'
            '<small style="color: #666;">{}</small>',
            obj.user.get_full_name(),
            obj.user.email,
            obj.user.phone_number or "No phone",
        )

    user_info.short_description = "Client"

    def property_display(self, obj):
        """Display property information"""
        if obj.property_object:
            return format_html(
                "<strong>{}</strong><br/>"
                '<small style="color: #666;">{}</small><br/>'
                '<small style="color: #888;">ID: {}</small>',
                obj.property_object.property_name,
                obj.property_object.location,
                obj.property_id,
            )
        return format_html(
            '<span style="color: red;">Property not found</span><br/>'
            "<small>ID: {}</small>",
            obj.property_id,
        )

    property_display.short_description = "Property"

    def agent_display(self, obj):
        """Display assigned agent information"""
        if obj.agent_assigned:
            return format_html(
                '<strong>{}</strong><br/><small style="color: #666;">{}</small>',
                obj.agent_assigned.get_full_name(),
                obj.agent_assigned.email,
            )
        return format_html('<span style="color: #999;">No agent assigned</span>')

    agent_display.short_description = "Agent"

    def scheduled_datetime(self, obj):
        """Display formatted date and time"""
        return format_html(
            "<strong>{}</strong><br/><small>{}</small>",
            obj.scheduled_date.strftime("%B %d, %Y"),
            obj.scheduled_time.strftime("%I:%M %p"),
        )

    scheduled_datetime.short_description = "Scheduled"

    def is_upcoming_display(self, obj):
        """Display if meeting is upcoming or past"""
        if obj.is_upcoming:
            return format_html(
                '<span style="color: green; font-weight: bold;">Upcoming</span>'
            )
        else:
            return format_html('<span style="color: #999;">Past</span>')

    is_upcoming_display.short_description = "Status"

    def property_details(self, obj):
        """Display detailed property information"""
        if obj.property_object:
            return format_html(
                '<div class="form-row">'
                '<div style="background: var(--body-bg, #f8f9fa); padding: 12px; border: 1px solid var(--border-color, #ddd); border-radius: 4px;">'
                '<p style="margin: 0 0 8px 0; color: var(--body-fg, #333);"><strong>Property:</strong> {}</p>'
                '<p style="margin: 0 0 8px 0; color: var(--body-fg, #333);"><strong>Location:</strong> {}</p>'
                '<p style="margin: 0 0 8px 0; color: var(--body-fg, #333);"><strong>Type:</strong> {}</p>'
                '<p style="margin: 0 0 8px 0; color: var(--body-fg, #333);"><strong>Status:</strong> {}</p>'
                '<p style="margin: 0; color: var(--body-fg, #333);"><strong>Listed by:</strong> {} ({})</p>'
                "</div>"
                "</div>",
                obj.property_object.property_name,
                obj.property_object.location,
                obj.property_object.get_property_type_display(),
                obj.property_object.get_listing_status_display(),
                obj.property_object.listed_by.get_full_name(),
                obj.property_object.listed_by.email,
            )
        return format_html(
            '<div class="form-row">'
            '<div style="background: var(--delete-button-bg, #ba2121); color: var(--delete-button-fg, white); padding: 12px; border-radius: 4px; border: 1px solid var(--delete-button-bg, #ba2121);">'
            '<p style="margin: 0; font-weight: bold;"><strong>⚠ Error:</strong> Property with ID {} not found</p>'
            "</div>"
            "</div>",
            obj.property_id,
        )

    property_details.short_description = "Property Details"

    def contact_info(self, obj):
        """Display detailed contact information"""
        return format_html(
            '<div class="form-row">'
            '<div style="background: var(--body-bg, #f8f9fa); padding: 12px; border: 1px solid var(--border-color, #ddd); border-radius: 4px;">'
            '<p style="margin: 0 0 8px 0; color: var(--body-fg, #333);"><strong>Client:</strong> {}</p>'
            '<p style="margin: 0 0 8px 0; color: var(--body-fg, #333);"><strong>Email:</strong> <a href="mailto:{}" style="color: var(--link-fg, #447e9b); text-decoration: none;">{}</a></p>'
            '<p style="margin: 0 0 8px 0; color: var(--body-fg, #333);"><strong>Phone:</strong> {}</p>'
            '<p style="margin: 0; color: var(--body-fg, #333);"><strong>User Type:</strong> {}</p>'
            "</div>"
            "</div>",
            obj.user.get_full_name(),
            obj.user.email,
            obj.user.email,
            obj.user.phone_number or "Not provided",
            obj.user.get_user_type_display(),
        )

    contact_info.short_description = "Contact Details"

    def save_model(self, request, obj, form, change):
        """Send email notifications when status changes"""
        old_status = None
        if change:
            try:
                old_obj = PropertySurveyMeeting.objects.get(pk=obj.pk)
                old_status = old_obj.status
            except PropertySurveyMeeting.DoesNotExist:
                pass

        super().save_model(request, obj, form, change)

        if (
            change
            and old_status != obj.status
            and obj.status
            in [
                PropertySurveyMeeting.Status.CONFIRMED,
                PropertySurveyMeeting.Status.CANCELLED,
            ]
        ):
            try:
                from core.utils.send_email import send_survey_meeting_status_update

                send_survey_meeting_status_update(obj, old_status, obj.status)
            except Exception as e:
                import logging

                logger = logging.getLogger(__name__)
                logger.error(f"Failed to send meeting status update email: {str(e)}")

    actions = ["mark_completed"]

    @admin.action(description="Mark selected meetings as completed")
    def mark_completed(self, request, queryset):
        from django.utils import timezone

        now = timezone.now()

        completed_count = 0
        for meeting in queryset:
            scheduled_datetime = timezone.make_aware(
                timezone.datetime.combine(
                    meeting.scheduled_date, meeting.scheduled_time
                )
            )
            if (
                meeting.status == PropertySurveyMeeting.Status.CONFIRMED
                and scheduled_datetime <= now
            ):
                meeting.status = PropertySurveyMeeting.Status.COMPLETED
                meeting.save()
                completed_count += 1

        self.message_user(
            request, f"{completed_count} meetings were marked as completed."
        )
