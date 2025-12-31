"""
Media compression utilities for images and videos.

This module provides functions to compress images and videos before upload,
reducing file sizes while maintaining acceptable quality.
"""

import logging
import os
import sys
import tempfile
from io import BytesIO

from django.conf import settings
from django.core.files.uploadedfile import InMemoryUploadedFile
from PIL import Image

logger = logging.getLogger(__name__)


def get_compression_settings():
    """Get compression settings from Django settings with defaults."""
    defaults = {
        "IMAGE": {
            "ENABLED": True,
            "MAX_WIDTH": 1920,
            "MAX_HEIGHT": 1080,
            "QUALITY": 85,
            "OUTPUT_FORMAT": "WEBP",
        },
        "VIDEO": {
            "ENABLED": True,
            "MAX_WIDTH": 1280,
            "MAX_HEIGHT": 720,
            "TARGET_BITRATE": "1000k",
            "AUDIO_BITRATE": "128k",
        },
    }
    return getattr(settings, "MEDIA_COMPRESSION", defaults)


def compress_image(
    uploaded_file,
    max_width: int | None = None,
    max_height: int | None = None,
    quality: int | None = None,
    output_format: str | None = None,
) -> InMemoryUploadedFile:
    """
    Compress an uploaded image file.

    Args:
        uploaded_file: Django UploadedFile or InMemoryUploadedFile
        max_width: Maximum width in pixels (default from settings)
        max_height: Maximum height in pixels (default from settings)
        quality: Compression quality 1-100 (default from settings)
        output_format: Output format - WEBP, JPEG, PNG (default from settings)

    Returns:
        InMemoryUploadedFile with compressed image
    """
    compression_settings = get_compression_settings()["IMAGE"]

    if not compression_settings.get("ENABLED", True):
        return uploaded_file

    max_width = max_width or compression_settings["MAX_WIDTH"]
    max_height = max_height or compression_settings["MAX_HEIGHT"]
    quality = quality or compression_settings["QUALITY"]
    output_format = output_format or compression_settings["OUTPUT_FORMAT"]

    try:
        img = Image.open(uploaded_file)
        original_format = img.format
        original_size = uploaded_file.size

        if img.mode in ("RGBA", "LA", "P"):
            if output_format.upper() not in ("WEBP", "PNG"):
                background = Image.new("RGB", img.size, (255, 255, 255))
                if img.mode == "P":
                    img = img.convert("RGBA")
                if "A" in img.mode:
                    background.paste(img, mask=img.split()[-1])
                else:
                    background.paste(img)
                img = background
        elif img.mode != "RGB":
            img = img.convert("RGB")

        img.thumbnail((max_width, max_height), Image.Resampling.LANCZOS)

        output_buffer = BytesIO()

        save_kwargs = {"quality": quality, "optimize": True}
        if output_format.upper() == "WEBP":
            save_kwargs["method"] = 4
        elif output_format.upper() == "JPEG":
            save_kwargs["progressive"] = True

        img.save(output_buffer, format=output_format.upper(), **save_kwargs)
        output_buffer.seek(0)

        content_types = {
            "WEBP": "image/webp",
            "JPEG": "image/jpeg",
            "JPG": "image/jpeg",
            "PNG": "image/png",
        }
        extensions = {
            "WEBP": ".webp",
            "JPEG": ".jpg",
            "JPG": ".jpg",
            "PNG": ".png",
        }

        original_name = uploaded_file.name
        base_name = original_name.rsplit(".", 1)[0]
        new_name = f"{base_name}{extensions.get(output_format.upper(), '.webp')}"

        compressed_size = sys.getsizeof(output_buffer.getvalue())
        logger.info(
            f"Image compressed: {original_name} ({original_format}) "
            f"{original_size} -> {compressed_size} bytes "
            f"({img.width}x{img.height})"
        )

        return InMemoryUploadedFile(
            file=output_buffer,
            field_name=None,
            name=new_name,
            content_type=content_types.get(output_format.upper(), "image/webp"),
            size=compressed_size,
            charset=None,
        )

    except Exception as e:
        logger.error(f"Image compression failed: {e}")
        uploaded_file.seek(0)
        return uploaded_file


def compress_video(
    uploaded_file,
    max_width: int | None = None,
    max_height: int | None = None,
    target_bitrate: str | None = None,
    audio_bitrate: str | None = None,
) -> InMemoryUploadedFile:
    """
    Compress an uploaded video file using MoviePy/FFmpeg.

    Args:
        uploaded_file: Django UploadedFile
        max_width: Maximum width in pixels (default from settings)
        max_height: Maximum height in pixels (default from settings)
        target_bitrate: Target video bitrate e.g., "1000k" (default from settings)
        audio_bitrate: Audio bitrate e.g., "128k" (default from settings)

    Returns:
        InMemoryUploadedFile with compressed video
    """
    compression_settings = get_compression_settings()["VIDEO"]

    if not compression_settings.get("ENABLED", True):
        return uploaded_file

    max_width = max_width or compression_settings["MAX_WIDTH"]
    max_height = max_height or compression_settings["MAX_HEIGHT"]
    target_bitrate = target_bitrate or compression_settings["TARGET_BITRATE"]
    audio_bitrate = audio_bitrate or compression_settings["AUDIO_BITRATE"]

    temp_input_path = None
    temp_output_path = None

    try:
        from moviepy.editor import VideoFileClip

        with tempfile.NamedTemporaryFile(
            delete=False, suffix=_get_video_extension(uploaded_file.name)
        ) as temp_input:
            for chunk in uploaded_file.chunks():
                temp_input.write(chunk)
            temp_input_path = temp_input.name

        temp_output_path = tempfile.mktemp(suffix=".mp4")

        clip = VideoFileClip(temp_input_path)
        original_duration = clip.duration
        original_size = os.path.getsize(temp_input_path)

        if clip.w > max_width or clip.h > max_height:
            if clip.w / clip.h > max_width / max_height:
                clip = clip.resize(width=max_width)
            else:
                clip = clip.resize(height=max_height)

        clip.write_videofile(
            temp_output_path,
            codec="libx264",
            audio_codec="aac",
            bitrate=target_bitrate,
            audio_bitrate=audio_bitrate,
            preset="medium",
            threads=4,
            logger=None,
        )
        clip.close()

        with open(temp_output_path, "rb") as f:
            compressed_data = BytesIO(f.read())

        compressed_size = compressed_data.getbuffer().nbytes

        original_name = uploaded_file.name
        base_name = original_name.rsplit(".", 1)[0]
        new_name = f"{base_name}.mp4"

        logger.info(
            f"Video compressed: {original_name} "
            f"{original_size} -> {compressed_size} bytes "
            f"(duration: {original_duration:.1f}s)"
        )

        return InMemoryUploadedFile(
            file=compressed_data,
            field_name=None,
            name=new_name,
            content_type="video/mp4",
            size=compressed_size,
            charset=None,
        )

    except ImportError:
        logger.warning(
            "MoviePy not installed. Video compression skipped. "
            "Install with: pip install moviepy"
        )
        uploaded_file.seek(0)
        return uploaded_file

    except Exception as e:
        logger.error(f"Video compression failed: {e}")
        uploaded_file.seek(0)
        return uploaded_file

    finally:
        if temp_input_path and os.path.exists(temp_input_path):
            os.unlink(temp_input_path)
        if temp_output_path and os.path.exists(temp_output_path):
            os.unlink(temp_output_path)


def _get_video_extension(filename: str) -> str:
    """Extract video extension from filename."""
    if "." in filename:
        return "." + filename.rsplit(".", 1)[-1].lower()
    return ".mp4"
