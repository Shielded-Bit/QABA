import logging
from typing import Dict, List, Union

from django.conf import settings
from django.core.mail import EmailMultiAlternatives, send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags

logger = logging.getLogger(__name__)


def send_email(
    subject: str,
    recipients: Union[str, List[str]],
    template_name: str,
    context: Dict = None,
    from_email: str = None,
    fail_silently: bool = False,
    attachments: List = None,
    cc: List[str] = None,
    bcc: List[str] = None,
) -> Dict:
    """
    Send an email using a template.

    Args:
        subject: Email subject
        recipients: List of recipient email addresses or single email address
        template_name: Name of the template to use (without .html extension)
        context: Dictionary of context variables for the template
        from_email: Sender email address (defaults to settings.DEFAULT_FROM_EMAIL)
        fail_silently: Whether to suppress exceptions
        attachments: List of (filename, content, mimetype) tuples
        cc: List of CC email addresses
        bcc: List of BCC email addresses

    Returns:
        Dict with success status and error message if any
    """
    if context is None:
        context = {}

    # Add common context variables
    context.update(
        {
            "site_name": settings.SITE_NAME
            if hasattr(settings, "SITE_NAME")
            else "QABA",
            "frontend_url": settings.FRONTEND_URL,
            "backend_url": settings.BACKEND_URL
            if hasattr(settings, "BACKEND_URL")
            else "",
        }
    )

    # Normalize recipients to a list
    if isinstance(recipients, str):
        recipients = [recipients]

    # Set default from_email
    if from_email is None:
        from_email = settings.DEFAULT_FROM_EMAIL

    try:
        # Render HTML content
        html_content = render_to_string(f"email/{template_name}.html", context)
        # Create plain text version
        text_content = strip_tags(html_content)

        # For simple emails without CC/BCC/attachments
        if not (cc or bcc or attachments):
            send_mail(
                subject=subject,
                message=text_content,
                from_email=from_email,
                recipient_list=recipients,
                html_message=html_content,
                fail_silently=fail_silently,
            )
        else:
            # For more complex emails with CC/BCC/attachments
            email = EmailMultiAlternatives(
                subject=subject,
                body=text_content,
                from_email=from_email,
                to=recipients,
                cc=cc,
                bcc=bcc,
            )
            email.attach_alternative(html_content, "text/html")

            # Add attachments
            if attachments:
                for attachment in attachments:
                    filename, content, mimetype = attachment
                    email.attach(filename, content, mimetype)

            email.send(fail_silently=fail_silently)

        logger.info(f"Email sent to {', '.join(recipients)}: {subject}")
        return {"success": True}

    except Exception as e:
        error_message = f"Failed to send email: {str(e)}"
        logger.error(error_message)
        if not fail_silently:
            raise
        return {"success": False, "error": error_message}


# Predefined email functions for common use cases
def send_verification_email(user):
    """Send verification email to user"""
    from core.utils.token import email_verification_token_generator

    token = email_verification_token_generator.make_token(user)
    user.email_verification_token = token
    user.save()

    verification_url = f"{settings.FRONTEND_URL}/verify-email?token={token}"
    context = {
        "user": user,
        "verification_url": verification_url,
    }

    return send_email(
        subject="Verify your email address",
        recipients=user.email,
        template_name="verification",
        context=context,
    )


def send_password_reset_email(user):
    """Send password reset email to user"""
    from core.utils.token import email_verification_token_generator

    token = email_verification_token_generator.make_token(user)
    user.password_reset_token = token
    user.save()

    reset_url = f"{settings.FRONTEND_URL}/reset-password?token={token}"
    context = {
        "user": user,
        "reset_url": reset_url,
    }

    return send_email(
        subject="Reset your password",
        recipients=user.email,
        template_name="password_reset",
        context=context,
    )


def send_welcome_email(user):
    """Send welcome email to user"""
    context = {
        "user": user,
        "login_url": f"{settings.FRONTEND_URL}/login",
    }

    return send_email(
        subject="Welcome to QABA",
        recipients=user.email,
        template_name="welcome",
        context=context,
    )


def send_property_notification_email(user, property_obj):
    """Send property notification email to user"""
    context = {
        "user": user,
        "property": property_obj,
        "property_url": f"{settings.FRONTEND_URL}/properties/{property_obj.id}",
    }

    return send_email(
        subject=f"New property listing: {property_obj.property_name}",
        recipients=user.email,
        template_name="property_notification",
        context=context,
    )


def send_contact_form_email(name, email, phone, user_type, subject, message):
    """
    Send contact form submission to admin users

    Args:
        name: Sender's name
        email: Sender's email
        phone: Sender's phone number
        user_type: Type of user (Client, Agent, etc.)
        subject: Message subject
        message: Message content

    Returns:
        dict: {"success": bool, "error": str}
    """
    try:
        # Get admin emails
        from apps.users.models import User
        from django.conf import settings
        from django.core.mail import send_mail
        from django.template.loader import render_to_string
        from django.utils import timezone
        from django.utils.html import strip_tags

        admin_emails = [settings.DEFAULT_FROM_EMAIL]
        try:
            admin_users = User.objects.filter(user_type=User.UserType.ADMIN)
            if admin_users.exists():
                admin_emails = [user.email for user in admin_users if user.email]
        except Exception:
            # Fall back to DEFAULT_FROM_EMAIL if we can't get admin users
            pass

        # Create HTML message
        html_message = render_to_string(
            "email/contact_form.html",
            {
                "name": name,
                "email": email,
                "phone": phone,
                "user_type": user_type,
                "subject": subject,
                "message": message,
                "date": timezone.now().strftime("%B %d, %Y %H:%M"),
            },
        )

        plain_message = strip_tags(html_message)

        send_mail(
            subject=f"Contact Form: {subject}",
            message=plain_message,
            html_message=html_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=admin_emails,
            fail_silently=False,
        )

        return {"success": True}
    except Exception as e:
        import logging

        logger = logging.getLogger(__name__)
        logger.error(f"Failed to send contact form email: {str(e)}")
        return {"success": False, "error": str(e)}


def send_contact_confirmation_email(email, name):
    """
    Send confirmation email to contact form submitter

    Args:
        email: Recipient email
        name: Recipient name

    Returns:
        dict: {"success": bool, "error": str}
    """
    try:
        from django.conf import settings
        from django.core.mail import send_mail
        from django.template.loader import render_to_string
        from django.utils.html import strip_tags

        html_message = render_to_string(
            "email/contact_confirmation.html",
            {
                "name": name,
            },
        )

        plain_message = strip_tags(html_message)

        send_mail(
            subject="We've received your message - QABA Real Estate",
            message=plain_message,
            html_message=html_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
            fail_silently=True,
        )

        return {"success": True}
    except Exception as e:
        import logging

        logger = logging.getLogger(__name__)
        logger.error(f"Failed to send contact confirmation email: {str(e)}")
        return {"success": True, "error": str(e)}
