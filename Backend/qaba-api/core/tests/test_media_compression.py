"""
Tests for media compression utilities.
"""

import io

import pytest
from django.core.files.uploadedfile import SimpleUploadedFile
from PIL import Image

from core.utils.media_compression import compress_image, get_compression_settings


class TestGetCompressionSettings:
    """Tests for get_compression_settings function."""

    def test_returns_default_settings(self, settings):
        """Test that default settings are returned when not configured."""
        if hasattr(settings, "MEDIA_COMPRESSION"):
            delattr(settings, "MEDIA_COMPRESSION")

        result = get_compression_settings()

        assert "IMAGE" in result
        assert "VIDEO" in result
        assert result["IMAGE"]["ENABLED"] is True
        assert result["IMAGE"]["MAX_WIDTH"] == 1920
        assert result["IMAGE"]["MAX_HEIGHT"] == 1080
        assert result["IMAGE"]["QUALITY"] == 85
        assert result["IMAGE"]["OUTPUT_FORMAT"] == "WEBP"

    def test_returns_configured_settings(self, settings):
        """Test that configured settings are returned."""
        settings.MEDIA_COMPRESSION = {
            "IMAGE": {
                "ENABLED": False,
                "MAX_WIDTH": 800,
                "MAX_HEIGHT": 600,
                "QUALITY": 70,
                "OUTPUT_FORMAT": "JPEG",
            },
            "VIDEO": {
                "ENABLED": True,
                "MAX_WIDTH": 1280,
                "MAX_HEIGHT": 720,
                "TARGET_BITRATE": "500k",
                "AUDIO_BITRATE": "64k",
            },
        }

        result = get_compression_settings()

        assert result["IMAGE"]["ENABLED"] is False
        assert result["IMAGE"]["MAX_WIDTH"] == 800
        assert result["IMAGE"]["QUALITY"] == 70


class TestCompressImage:
    """Tests for compress_image function."""

    def _create_test_image(
        self, width: int, height: int, format: str = "PNG", mode: str = "RGB"
    ) -> SimpleUploadedFile:
        """Helper to create a test image file."""
        img = Image.new(mode, (width, height), color="red")
        buffer = io.BytesIO()
        img.save(buffer, format=format)
        buffer.seek(0)
        return SimpleUploadedFile(
            f"test.{format.lower()}",
            buffer.read(),
            content_type=f"image/{format.lower()}",
        )

    def test_compress_image_resizes_large_image(self, settings):
        """Test that large images are resized to max dimensions."""
        settings.MEDIA_COMPRESSION = {
            "IMAGE": {
                "ENABLED": True,
                "MAX_WIDTH": 800,
                "MAX_HEIGHT": 600,
                "QUALITY": 85,
                "OUTPUT_FORMAT": "WEBP",
            },
            "VIDEO": {"ENABLED": True},
        }

        uploaded_file = self._create_test_image(2000, 1500)
        result = compress_image(uploaded_file)

        result_img = Image.open(result)
        assert result_img.width <= 800
        assert result_img.height <= 600

    def test_compress_image_maintains_aspect_ratio(self, settings):
        """Test that aspect ratio is maintained during resize."""
        settings.MEDIA_COMPRESSION = {
            "IMAGE": {
                "ENABLED": True,
                "MAX_WIDTH": 400,
                "MAX_HEIGHT": 400,
                "QUALITY": 85,
                "OUTPUT_FORMAT": "WEBP",
            },
            "VIDEO": {"ENABLED": True},
        }

        uploaded_file = self._create_test_image(1000, 500)
        result = compress_image(uploaded_file)

        result_img = Image.open(result)
        original_ratio = 1000 / 500
        result_ratio = result_img.width / result_img.height
        assert abs(original_ratio - result_ratio) < 0.01

    def test_compress_image_converts_format(self, settings):
        """Test that image is converted to specified format."""
        settings.MEDIA_COMPRESSION = {
            "IMAGE": {
                "ENABLED": True,
                "MAX_WIDTH": 1920,
                "MAX_HEIGHT": 1080,
                "QUALITY": 85,
                "OUTPUT_FORMAT": "WEBP",
            },
            "VIDEO": {"ENABLED": True},
        }

        uploaded_file = self._create_test_image(100, 100, format="PNG")
        result = compress_image(uploaded_file)

        assert result.name.endswith(".webp")
        assert result.content_type == "image/webp"

    def test_compress_image_disabled_returns_original(self, settings):
        """Test that compression disabled returns original file."""
        settings.MEDIA_COMPRESSION = {
            "IMAGE": {
                "ENABLED": False,
                "MAX_WIDTH": 100,
                "MAX_HEIGHT": 100,
                "QUALITY": 85,
                "OUTPUT_FORMAT": "WEBP",
            },
            "VIDEO": {"ENABLED": True},
        }

        uploaded_file = self._create_test_image(500, 500)
        result = compress_image(uploaded_file)

        assert result == uploaded_file

    def test_compress_image_handles_rgba(self, settings):
        """Test that RGBA images are handled correctly."""
        settings.MEDIA_COMPRESSION = {
            "IMAGE": {
                "ENABLED": True,
                "MAX_WIDTH": 800,
                "MAX_HEIGHT": 600,
                "QUALITY": 85,
                "OUTPUT_FORMAT": "WEBP",
            },
            "VIDEO": {"ENABLED": True},
        }

        uploaded_file = self._create_test_image(200, 200, format="PNG", mode="RGBA")
        result = compress_image(uploaded_file)

        result_img = Image.open(result)
        assert result_img is not None

    def test_compress_image_custom_parameters(self, settings):
        """Test compression with custom parameters overriding settings."""
        settings.MEDIA_COMPRESSION = {
            "IMAGE": {
                "ENABLED": True,
                "MAX_WIDTH": 1920,
                "MAX_HEIGHT": 1080,
                "QUALITY": 85,
                "OUTPUT_FORMAT": "WEBP",
            },
            "VIDEO": {"ENABLED": True},
        }

        uploaded_file = self._create_test_image(1000, 1000)
        result = compress_image(
            uploaded_file,
            max_width=200,
            max_height=200,
            quality=50,
            output_format="JPEG",
        )

        result_img = Image.open(result)
        assert result_img.width <= 200
        assert result_img.height <= 200
        assert result.name.endswith(".jpg")

    def test_compress_image_small_image_not_upscaled(self, settings):
        """Test that small images are not upscaled."""
        settings.MEDIA_COMPRESSION = {
            "IMAGE": {
                "ENABLED": True,
                "MAX_WIDTH": 1920,
                "MAX_HEIGHT": 1080,
                "QUALITY": 85,
                "OUTPUT_FORMAT": "WEBP",
            },
            "VIDEO": {"ENABLED": True},
        }

        uploaded_file = self._create_test_image(100, 100)
        result = compress_image(uploaded_file)

        result_img = Image.open(result)
        assert result_img.width == 100
        assert result_img.height == 100
