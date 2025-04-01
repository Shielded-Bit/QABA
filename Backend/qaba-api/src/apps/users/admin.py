from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.html import format_html
from django.utils.translation import gettext_lazy as _

from .models import AgentProfile, ClientProfile, Notification, User


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


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ("user", "truncated_message", "is_read", "created_at")
    list_filter = ("is_read", "created_at")
    search_fields = ("user__email", "user__first_name", "user__last_name", "message")
    raw_id_fields = ("user",)  # Add this to fix the issue
    date_hierarchy = "created_at"

    def truncated_message(self, obj):
        return obj.message[:50] + "..." if len(obj.message) > 50 else obj.message

    truncated_message.short_description = "Message"

    def get_queryset(self, request):
        return super().get_queryset(request).select_related("user")

    actions = ["mark_as_read", "mark_as_unread"]

    @admin.action(description="Mark selected notifications as read")
    def mark_as_read(self, request, queryset):
        queryset.update(is_read=True)
        self.message_user(
            request, f"{queryset.count()} notifications were marked as read."
        )

    @admin.action(description="Mark selected notifications as unread")
    def mark_as_unread(self, request, queryset):
        queryset.update(is_read=False)
        self.message_user(
            request, f"{queryset.count()} notifications were marked as unread."
        )
