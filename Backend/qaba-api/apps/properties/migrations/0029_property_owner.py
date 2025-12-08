from django.db import migrations, models
from django.db.models import F


def set_owner_for_existing_properties(apps, schema_editor):
    Property = apps.get_model("properties", "Property")
    User = apps.get_model("users", "User")
    agent_landlord_ids = User.objects.filter(
        user_type__in=["AGENT", "LANDLORD"]
    ).values_list("id", flat=True)
    Property.objects.filter(
        owner__isnull=True,
        listed_by__in=list(agent_landlord_ids),
    ).update(owner=F("listed_by"))


class Migration(migrations.Migration):
    dependencies = [
        ("properties", "0028_add_property_id_unique_constraint"),
    ]

    operations = [
        migrations.AddField(
            model_name="property",
            name="owner",
            field=models.ForeignKey(
                blank=True,
                help_text="Actual owner of the property (if different from the lister)",
                limit_choices_to={"user_type__in": ["ADMIN", "AGENT", "LANDLORD"]},
                null=True,
                on_delete=models.SET_NULL,
                related_name="owned_properties",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
        migrations.RunPython(
            set_owner_for_existing_properties,
            migrations.RunPython.noop,
        ),
    ]
