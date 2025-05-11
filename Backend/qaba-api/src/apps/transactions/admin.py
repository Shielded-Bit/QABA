import csv

from django.contrib import admin
from django.http import HttpResponse

# Register your models here.
from django.utils.html import format_html

from .models import Transaction


class AmountFilter(admin.SimpleListFilter):
    title = "Amount Range"
    parameter_name = "amount_range"

    def lookups(self, request, model_admin):
        return (
            ("0-5000", "Less than 5,000"),
            ("5000-50000", "5,000 to 50,000"),
            ("50000-500000", "50,000 to 500,000"),
            ("500000+", "More than 500,000"),
        )

    def queryset(self, request, queryset):
        if self.value() == "0-5000":
            return queryset.filter(amount__lt=5000)
        if self.value() == "5000-50000":
            return queryset.filter(amount__gte=5000, amount__lt=50000)
        if self.value() == "50000-500000":
            return queryset.filter(amount__gte=50000, amount__lt=500000)
        if self.value() == "500000+":
            return queryset.filter(amount__gte=500000)


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = [
        "reference",
        "user_info",
        "property_info",
        "amount_display",
        "payment_type",
        "status_badge",
        "created_at",
    ]

    list_filter = ["status", "payment_type", AmountFilter, "created_at"]
    search_fields = [
        "reference",
        "tx_ref",
        "flw_ref",
        "user__email",
        "property__property_name",
    ]
    readonly_fields = [
        "id",
        "reference",
        "tx_ref",
        "flw_ref",
        "created_at",
        "updated_at",
    ]
    date_hierarchy = "created_at"

    fieldsets = (
        (
            "Transaction Details",
            {
                "fields": (
                    "id",
                    "reference",
                    "tx_ref",
                    "flw_ref",
                    "status",
                    "description",
                )
            },
        ),
        ("Financial Details", {"fields": ("amount", "currency", "payment_type")}),
        ("Relations", {"fields": ("user", "property")}),
        (
            "Timestamps",
            {"fields": ("created_at", "updated_at"), "classes": ("collapse",)},
        ),
    )

    actions = ["export_as_csv"]

    def user_info(self, obj):
        if obj.user:
            return f"{obj.user.email} ({obj.user.get_user_type_display()})"
        return "-"

    user_info.short_description = "User"

    def property_info(self, obj):
        if obj.property:
            return f"{obj.property.property_name} ({obj.property.get_property_type_display()})"
        return "-"

    property_info.short_description = "Property"

    def amount_display(self, obj):
        return f"{obj.amount} {obj.currency}"

    amount_display.short_description = "Amount"

    def status_badge(self, obj):
        status_colors = {
            Transaction.Status.SUCCESSFUL: "#28a745",  # Green
            Transaction.Status.FAILED: "#dc3545",  # Red
        }
        color = status_colors.get(obj.status, "#6c757d")  # Default gray

        return format_html(
            '<span style="background-color: {}; color: white; padding: 4px 8px; '
            'border-radius: 4px; font-weight: bold;">{}</span>',
            color,
            obj.get_status_display(),
        )

    status_badge.short_description = "Status"

    def export_as_csv(self, request, queryset):
        meta = self.model._meta
        field_names = [field.name for field in meta.fields]

        response = HttpResponse(content_type="text/csv")
        response["Content-Disposition"] = "attachment; filename=transactions.csv"
        writer = csv.writer(response)

        writer.writerow(field_names)
        for obj in queryset:
            writer.writerow([getattr(obj, field) for field in field_names])

        return response

    export_as_csv.short_description = "Export Selected Transactions"

    def has_add_permission(self, request):
        # Transactions should generally be created through the application flow
        return False

    def has_delete_permission(self, request, obj=None):
        # For audit purposes, transactions generally shouldn't be deleted
        return False
