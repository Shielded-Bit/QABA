import logging
import random
import string
from typing import Dict, List, Union

from django.conf import settings
from django.template.loader import render_to_string
from django.utils.html import strip_tags

from apps.users.models import OTP
from core.utils import microsoft_graph_email

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
    """
    if context is None:
        context = {}

    context.update(
        {
            "site_name": (
                settings.SITE_NAME if hasattr(settings, "SITE_NAME") else "Qarba"
            ),
            "frontend_url": settings.FRONTEND_URL,
            "backend_url": (
                settings.BACKEND_URL if hasattr(settings, "BACKEND_URL") else ""
            ),
        }
    )

    if isinstance(recipients, str):
        recipients = [recipients]

    if from_email is None:
        from_email = settings.DEFAULT_FROM_EMAIL

    try:
        if not microsoft_graph_email.is_configured():
            raise RuntimeError(
                "Microsoft Graph email configuration is incomplete. "
                "Ensure MICROSOFT_TENANT_ID, MICROSOFT_CLIENT_ID, MICROSOFT_CLIENT_SECRET, "
                "and MICROSOFT_SENDER_EMAIL are set."
            )

        # Render HTML content
        html_content = render_to_string(f"email/{template_name}.html", context)
        text_content = strip_tags(html_content)

        microsoft_graph_email.send_mail_via_graph(
            subject=subject,
            body_html=html_content,
            body_text=text_content,
            to=recipients,
            from_email=from_email,
            cc=cc,
            bcc=bcc,
            attachments=attachments,
            timeout=getattr(settings, "EMAIL_TIMEOUT", 30),
        )

        logger.info(f"Email sent to {', '.join(recipients)}: {subject}")
        return {"success": True}

    except Exception as e:
        error_message = f"Failed to send email: {str(e)}"
        logger.error(error_message)
        if not fail_silently:
            raise
        return {"success": False, "error": error_message}


def send_verification_email(user):
    """Send verification email to user"""
    otp = "".join(random.choices(string.digits, k=6))
    OTP.objects.create(user=user, otp=otp)

    context = {
        "user": user,
        "otp": otp,
    }

    return send_email(
        subject="Verify your email address",
        recipients=user.email,
        template_name="verification",
        context=context,
    )


def send_password_reset_email(user):
    """Send password reset OTP to user"""
    otp = "".join(random.choices(string.digits, k=6))
    OTP.objects.create(user=user, otp=otp)

    context = {
        "user": user,
        "otp": otp,
    }

    return send_email(
        subject="Reset your password",
        recipients=user.email,
        template_name="password_reset_otp",
        context=context,
    )


def send_welcome_email(user):
    """Send welcome email to user"""
    context = {
        "user": user,
        "login_url": f"{settings.FRONTEND_URL}/login",
    }

    return send_email(
        subject="Welcome to Qarba",
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


def send_contact_form_email(name, email, phone, user_type, subject, message, property_obj=None):
    """
    Send contact form submission to admin users
    """
    try:
        # Get admin emails
        from django.utils import timezone

        # Send only to the default contact email
        admin_emails = [settings.DEFAULT_FROM_EMAIL]

        context = {
            "name": name,
            "email": email,
            "phone": phone,
            "user_type": user_type,
            "subject": subject,
            "message": message,
            "date": timezone.now().strftime("%B %d, %Y %H:%M"),
        }

        # Add property details if available
        if property_obj:
            context["property"] = {
                "id": property_obj.id,
                "property_id": property_obj.property_id,
                "name": property_obj.property_name,
                "location": property_obj.location,
                "state": property_obj.state,
                "city": property_obj.city,
                "property_type": property_obj.get_property_type_display(),
                "listing_type": property_obj.get_listing_type_display(),
                "price": property_obj.sale_price if property_obj.listing_type == "SALE" else property_obj.rent_price,
                "url": f"{settings.FRONTEND_URL}/details/{property_obj.slug}",
            }

        return send_email(
            subject=f"Contact Form: {subject}",
            recipients=admin_emails,
            template_name="contact_form",
            context=context,
        )
    except Exception as e:
        import logging

        logger = logging.getLogger(__name__)
        logger.error(f"Failed to send contact form email: {str(e)}")
        return {"success": False, "error": str(e)}


def send_contact_confirmation_email(email, name):
    """
    Send confirmation email to contact form submitter
    """
    try:
        return send_email(
            subject="We've received your message - Qarba Properties",
            recipients=[email],
            template_name="contact_confirmation",
            context={"name": name},
            fail_silently=True,
        )
    except Exception as e:
        import logging

        logger = logging.getLogger(__name__)
        logger.error(f"Failed to send contact confirmation email: {str(e)}")
        return {"success": True, "error": str(e)}


def send_property_review_notification_email(property_instance, owner, decision):
    """
    Send notification email to property owner about approval/rejection
    """
    subject = f"Property Listing {decision.title()}: {property_instance.property_name}"

    context = {
        "decision": decision.lower(),
        "decision_title": (
            "Congratulations"
            if decision == "APPROVED"
            else "Your property listing has been declined"
        ),
        "property_name": property_instance.property_name,
        "location": property_instance.location,
        "state": getattr(property_instance, "state", ""),
        "city": getattr(property_instance, "city", ""),
        "property_url": f"{settings.FRONTEND_URL}/properties/{property_instance.id}",
        "user": owner,
        "listing_date": property_instance.listed_date.strftime("%B %d, %Y"),
    }

    return send_email(
        subject=subject,
        recipients=owner.email,
        template_name="owner_property_review_notification",
        context=context,
    )


def send_survey_meeting_notification(meeting, recipient_type="client"):
    """
    Send survey meeting notification emails

    Args:
        meeting: PropertySurveyMeeting instance
        recipient_type: "client" or "admin" to determine email content

    Returns:
        dict: {"success": bool, "error": str}
    """
    from django.utils import timezone

    if recipient_type == "client":
        subject = "Property Survey Meeting Scheduled - Qarba Properties"
        recipients = [meeting.user.email]
        template_name = "survey_meeting_client"
    else:
        subject = f"New Property Survey Meeting Request - {meeting.property_address}"
        from apps.users.models import User

        admin_users = User.objects.filter(
            user_type__in=[User.UserType.ADMIN]
        )
        recipients = [user.email for user in admin_users if user.email]

        if meeting.agent_assigned and meeting.agent_assigned.email:
            recipients.append(meeting.agent_assigned.email)

        recipients = recipients.append(settings.DEFAULT_FROM_EMAIL)
        template_name = "survey_meeting_admin"

    scheduled_datetime = timezone.datetime.combine(
        meeting.scheduled_date, meeting.scheduled_time
    )

    context = {
        "meeting": meeting,
        "user": meeting.user,
        "property": meeting.property_object,
        "agent": meeting.agent_assigned,
        "scheduled_datetime": scheduled_datetime,
        "formatted_date": meeting.scheduled_date.strftime("%B %d, %Y"),
        "formatted_time": meeting.scheduled_time.strftime("%I:%M %p"),
        "property_address": meeting.property_address,
        "message": meeting.message,
        "dashboard_url": f"{settings.FRONTEND_URL}/dashboard",
    }

    return send_email(
        subject=subject,
        recipients=recipients,
        template_name=template_name,
        context=context,
    )


def send_survey_meeting_status_update(meeting, old_status, new_status):
    """
    Send email notification when survey meeting status changes
    """
    from django.utils import timezone

    status_messages = {
        "CONFIRMED": "has been confirmed",
        "CANCELLED": "has been cancelled",
        "RESCHEDULED": "has been rescheduled",
        "COMPLETED": "has been completed",
    }

    subject = f"Property Survey Meeting {status_messages.get(new_status, 'Updated')} - Qarba Properties"

    scheduled_datetime = timezone.datetime.combine(
        meeting.scheduled_date, meeting.scheduled_time
    )

    context = {
        "meeting": meeting,
        "user": meeting.user,
        "old_status": old_status,
        "new_status": new_status,
        "status_message": status_messages.get(new_status, "updated"),
        "scheduled_datetime": scheduled_datetime,
        "formatted_date": meeting.scheduled_date.strftime("%B %d, %Y"),
        "formatted_time": meeting.scheduled_time.strftime("%I:%M %p"),
        "property_address": meeting.property_address,
        "agent_assigned": meeting.agent_assigned,
    }

    return send_email(
        subject=subject,
        recipients=[meeting.user.email],
        template_name="survey_meeting_status_update",
        context=context,
    )


def send_offline_payment_notification(transaction):
    """
    Send email notification to user and all admins when an offline payment is made.
    """
    from apps.users.models import User

    property_obj = transaction.property_obj
    user = transaction.user

    # Email to user
    user_context = {
        "user": user,
        "transaction": transaction,
        "property": property_obj,
        "amount": transaction.amount,
        "reference": transaction.reference,
        "tx_ref": transaction.tx_ref,
        "payment_method": transaction.get_payment_method_display(),
        "status": transaction.get_status_display(),
    }
    send_email(
        subject=f"Offline Payment Received for {property_obj.property_name}",
        recipients=user.email,
        template_name="offline_payment_notification",
        context=user_context,
    )

    # Email to admins
    admin_users = User.objects.filter(user_type=User.UserType.ADMIN)
    admin_emails = [admin.email for admin in admin_users if admin.email]
    if admin_emails:
        admin_context = {
            "user": user,
            "transaction": transaction,
            "property": property_obj,
            "amount": transaction.amount,
            "reference": transaction.reference,
            "tx_ref": transaction.tx_ref,
            "payment_method": transaction.get_payment_method_display(),
            "status": transaction.get_status_display(),
        }
        send_email(
            subject=f"New Offline Payment Submitted for {property_obj.property_name}",
            recipients=admin_emails,
            template_name="offline_payment_notification",
            context=admin_context,
        )
