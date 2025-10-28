"""Utilities for sending email via Microsoft Graph."""
import base64
import logging
from typing import Iterable, List, Optional

import msal
import requests
from django.conf import settings

logger = logging.getLogger(__name__)

_GRAPH_API_ROOT = "https://graph.microsoft.com/v1.0"
_APPLICATION: Optional[msal.ConfidentialClientApplication] = None


def _is_config_ready() -> bool:
    """Return True when required settings for Microsoft Graph are available."""
    required = [
        settings.MICROSOFT_TENANT_ID,
        settings.MICROSOFT_CLIENT_ID,
        settings.MICROSOFT_CLIENT_SECRET,
        settings.MICROSOFT_SENDER_EMAIL,
        settings.MICROSOFT_GRAPH_SCOPE,
    ]
    return all(required)


def is_configured() -> bool:
    """Public helper to determine if Graph email can be used."""
    return _is_config_ready()


def _get_application() -> msal.ConfidentialClientApplication:
    """Create or return a cached ConfidentialClientApplication instance."""
    global _APPLICATION
    if _APPLICATION is None:
        if not _is_config_ready():
            raise ValueError("Microsoft Graph email is not configured correctly.")

        authority = f"https://login.microsoftonline.com/{settings.MICROSOFT_TENANT_ID}"
        _APPLICATION = msal.ConfidentialClientApplication(
            client_id=settings.MICROSOFT_CLIENT_ID,
            client_credential=settings.MICROSOFT_CLIENT_SECRET,
            authority=authority,
        )
    return _APPLICATION


def _acquire_token(scope: str) -> str:
    """Acquire an access token for the configured scope."""
    app = _get_application()
    scopes = [scope]
    token_result = app.acquire_token_silent(scopes=scopes, account=None)

    if not token_result:
        token_result = app.acquire_token_for_client(scopes=scopes)

    if "access_token" not in token_result:
        error = token_result.get("error_description") or token_result.get("error")
        raise RuntimeError(f"Unable to obtain Microsoft Graph token: {error}")

    return token_result["access_token"]


def _convert_recipients(addresses: Iterable[str]) -> List[dict]:
    """Convert email addresses to Graph API recipient objects."""
    valid = [addr for addr in addresses or [] if addr]
    return [
        {
            "emailAddress": {
                "address": addr,
            }
        }
        for addr in valid
    ]


def _convert_attachments(attachments: Iterable) -> List[dict]:
    """Convert in-memory attachments to Graph file attachments."""
    converted: List[dict] = []
    for attachment in attachments or []:
        try:
            filename, content, mimetype = attachment
        except ValueError as exc:  # pragma: no cover - defensive
            raise ValueError("Attachments must be (filename, content, mimetype) tuples") from exc

        if content is None:
            continue

        if isinstance(content, str):
            content = content.encode("utf-8")

        encoded = base64.b64encode(content).decode("ascii")
        converted.append(
            {
                "@odata.type": "#microsoft.graph.fileAttachment",
                "name": filename,
                "contentType": mimetype or "application/octet-stream",
                "contentBytes": encoded,
            }
        )
    return converted


def send_mail_via_graph(
    *,
    subject: str,
    body_html: str,
    body_text: str,
    to: Iterable[str],
    from_email: Optional[str] = None,
    cc: Optional[Iterable[str]] = None,
    bcc: Optional[Iterable[str]] = None,
    attachments: Optional[Iterable] = None,
    save_to_sent_items: bool = False,
    timeout: Optional[int] = None,
) -> None:
    """Send an email using Microsoft Graph."""
    if not _is_config_ready():
        raise RuntimeError("Microsoft Graph email configuration is incomplete.")

    access_token = _acquire_token(settings.MICROSOFT_GRAPH_SCOPE)

    sender = (from_email or settings.MICROSOFT_SENDER_EMAIL).strip()
    if not sender:
        raise RuntimeError("A sender email address is required for Microsoft Graph.")

    message = {
        "subject": subject,
        "body": {
            "contentType": "HTML",
            "content": body_html,
        },
        "toRecipients": _convert_recipients(to),
    }

    if not message["toRecipients"]:
        raise RuntimeError("At least one recipient is required to send email.")

    if cc:
        message["ccRecipients"] = _convert_recipients(cc)

    if bcc:
        message["bccRecipients"] = _convert_recipients(bcc)

    if body_text:
        message["bodyPreview"] = body_text[:900]

    attachments_payload = _convert_attachments(attachments)
    if attachments_payload:
        message["attachments"] = attachments_payload

    request_payload = {
        "message": message,
        "saveToSentItems": save_to_sent_items,
    }

    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json",
    }

    timeout_value = timeout or getattr(settings, "EMAIL_TIMEOUT", 30)
    endpoint = f"{_GRAPH_API_ROOT}/users/{sender}/sendMail"

    response = requests.post(
        endpoint,
        json=request_payload,
        headers=headers,
        timeout=timeout_value,
    )

    if 200 <= response.status_code < 300:
        logger.debug(
            "Microsoft Graph email sent to %s",
            ", ".join(
                recipient["emailAddress"]["address"] for recipient in message["toRecipients"]
            ),
        )
        return

    try:
        detail = response.json()
    except ValueError:
        detail = response.text

    raise RuntimeError(
        "Microsoft Graph sendMail failed with status "
        f"{response.status_code}: {detail}"
    )
