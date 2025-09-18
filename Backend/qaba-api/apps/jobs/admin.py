from django.contrib import admin

from .models import Job, JobForm


@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = ("title", "category", "location", "pay_range", "status")
    search_fields = ("title", "category", "location")
    list_filter = ("category", "location", "status")


@admin.register(JobForm)
class JobFormAdmin(admin.ModelAdmin):
    list_display = (
        "job",
        "first_name",
        "last_name",
        "email",
        "phone_number",
        "year_of_exp",
        "degree",
    )
    search_fields = ("first_name", "last_name", "email", "degree", "job__title")
    list_filter = ("degree", "job")
