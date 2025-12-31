"""
Custom serializer fields for Django REST Framework.

This module provides custom fields that extend DRF's built-in fields
with additional functionality like media compression.
"""

from rest_framework import serializers

from core.utils.media_compression import compress_image, compress_video


class CompressedImageField(serializers.ImageField):
    """
    Custom ImageField that compresses images during validation.

    Compresses uploaded images before they are saved to storage,
    reducing file size while maintaining acceptable quality.

    Args:
        max_width: Maximum width in pixels (default: 1920)
        max_height: Maximum height in pixels (default: 1080)
        quality: Compression quality 1-100 (default: 85)
        output_format: Output format - WEBP, JPEG, PNG (default: WEBP)
        compress: Whether to enable compression (default: True)
    """

    def __init__(self, *args, **kwargs):
        self.max_width = kwargs.pop("max_width", None)
        self.max_height = kwargs.pop("max_height", None)
        self.quality = kwargs.pop("quality", None)
        self.output_format = kwargs.pop("output_format", None)
        self.compress = kwargs.pop("compress", True)
        super().__init__(*args, **kwargs)

    def to_internal_value(self, data):
        file = super().to_internal_value(data)

        if self.compress and file:
            file = compress_image(
                file,
                max_width=self.max_width,
                max_height=self.max_height,
                quality=self.quality,
                output_format=self.output_format,
            )

        return file


class CompressedVideoField(serializers.FileField):
    """
    Custom FileField that compresses videos during validation.

    Compresses uploaded videos before they are saved to storage,
    reducing file size while maintaining acceptable quality.
    Requires FFmpeg to be installed on the server.

    Args:
        max_width: Maximum width in pixels (default: 1280)
        max_height: Maximum height in pixels (default: 720)
        target_bitrate: Video bitrate e.g., "1000k" (default: 1000k)
        audio_bitrate: Audio bitrate e.g., "128k" (default: 128k)
        compress: Whether to enable compression (default: True)
    """

    ALLOWED_VIDEO_TYPES = [
        "video/mp4",
        "video/mpeg",
        "video/quicktime",
        "video/x-msvideo",
        "video/x-ms-wmv",
        "video/webm",
        "video/3gpp",
        "video/x-matroska",
    ]

    def __init__(self, *args, **kwargs):
        self.max_width = kwargs.pop("max_width", None)
        self.max_height = kwargs.pop("max_height", None)
        self.target_bitrate = kwargs.pop("target_bitrate", None)
        self.audio_bitrate = kwargs.pop("audio_bitrate", None)
        self.compress = kwargs.pop("compress", True)
        super().__init__(*args, **kwargs)

    def to_internal_value(self, data):
        file = super().to_internal_value(data)

        content_type = getattr(file, "content_type", "")
        if content_type and not content_type.startswith("video/"):
            raise serializers.ValidationError(
                "Invalid file type. Please upload a video file."
            )

        if self.compress and file:
            file = compress_video(
                file,
                max_width=self.max_width,
                max_height=self.max_height,
                target_bitrate=self.target_bitrate,
                audio_bitrate=self.audio_bitrate,
            )

        return file
