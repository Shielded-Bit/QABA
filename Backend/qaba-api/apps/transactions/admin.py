import csv

from django.contrib import admin
from django.http import HttpResponse

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
        "status_badge",
        "payment_receipt_display",
        "created_at",
    ]

    list_filter = ["status", AmountFilter, "created_at", "payment_method"]
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
        "payment_receipt_display",
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
                    "payment_receipt_display",
                )
            },
        ),
        ("Financial Details", {"fields": ("amount", "currency")}),
        ("Relations", {"fields": ("user", "property_obj")}),
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
        if obj.property_obj:
            return f"{obj.property_obj.property_name} ({obj.property_obj.get_property_type_display()})"
        return "-"

    property_info.short_description = "Property"

    def amount_display(self, obj):
        return f"{obj.amount} {obj.currency}"

    amount_display.short_description = "Amount"

    def status_badge(self, obj):
        status_colors = {
            Transaction.Status.SUCCESSFUL: "#28a745",
            Transaction.Status.FAILED: "#dc3545",
        }
        color = status_colors.get(obj.status, "#6c757d")

        return format_html(
            '<span style="background-color: {}; color: white; padding: 4px 8px; '
            'border-radius: 4px; font-weight: bold;">{}</span>',
            color,
            obj.get_status_display(),
        )

    status_badge.short_description = "Status"

    def payment_receipt_display(self, obj):
        if obj.payment_receipt:
            url = obj.payment_receipt.url
            if url.lower().endswith((".jpg", ".jpeg", ".png")):
                return format_html(
                    '<a href="{}" target="_blank"><img src="{}" style="max-height:80px;"/></a>',
                    url,
                    url,
                )
            return format_html('<a href="{}" target="_blank">View Receipt</a>', url)
        return "-"

    payment_receipt_display.short_description = "Payment Receipt"

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

    def save_model(self, request, obj, form, change):
        if (
            change
            and obj.status == obj.Status.SUCCESSFUL
            and obj.payment_method == obj.PaymentMethod.OFFLINE
        ):
            property_obj = obj.property_obj
            if property_obj:
                if property_obj.listing_type == property_obj.ListingType.SALE:
                    property_obj.property_status = property_obj.PropertyStatus.SOLD
                    property_obj.save()
                elif property_obj.listing_type == property_obj.ListingType.RENT:
                    property_obj.property_status = property_obj.PropertyStatus.RENTED
                    property_obj.save()
        super().save_model(request, obj, form, change)

    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return False
