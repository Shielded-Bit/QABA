# Generated by Django 5.1.6 on 2025-03-13 11:49

import cloudinary.models
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='agentprofile',
            name='profile_photo',
            field=cloudinary.models.CloudinaryField(blank=True, help_text='Upload a profile photo', max_length=255, null=True, verbose_name='image'),
        ),
        migrations.AlterField(
            model_name='clientprofile',
            name='profile_photo',
            field=cloudinary.models.CloudinaryField(blank=True, help_text='Upload a profile photo', max_length=255, null=True, verbose_name='image'),
        ),
    ]
