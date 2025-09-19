from django.contrib import admin

from .models import Job, JobForm


@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = ("title", "slug", "category", "location", "pay_range", "status")
    search_fields = ("title", "slug", "category", "location")
    list_filter = ("category", "location", "status")
    prepopulated_fields = {"slug": ("title",)}


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
        "linkedin_url",
        "location",
        "referral",
    )
    search_fields = (
        "first_name",
        "last_name",
        "email",
        "degree",
        "linkedin_url",
        "location",
        "referral",
        "job__title",
    )
    list_filter = ("degree", "job", "location")
