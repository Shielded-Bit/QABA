import os
import uuid

import requests


def initialize_payment(user, amount, currency="NGN", description="", tx_ref=None):
    """Initialize a payment with Flutterwave"""

    # Use environment variables for Flutterwave keys
    flw_secret_key = os.environ.get("FLW_SECRET_KEY")

    if not flw_secret_key:
        return {"success": False, "error": "Flutterwave secret key not configured"}

    # Generate reference if not provided
    if not tx_ref:
        tx_ref = f"QABA-{uuid.uuid4().hex[:10]}"

    url = "https://api.flutterwave.com/v3/payments"

    headers = {
        "Authorization": f"Bearer {flw_secret_key}",
        "Content-Type": "application/json",
    }

    # Prepare callback URL
    redirect_url = os.environ.get(
        "PAYMENT_REDIRECT_URL", "https://yourfrontend.com/payment-callback"
    )

    payload = {
        "tx_ref": tx_ref,
        "amount": str(amount),
        "currency": currency,
        "redirect_url": redirect_url,
        "customer": {
            "email": user.email,
            "name": f"{user.first_name} {user.last_name}",
            "phonenumber": user.phone_number
            if hasattr(user, "phone_number") and user.phone_number
            else "",
        },
        "customizations": {
            "title": "QABA Payment",
            "description": description or "Payment for QABA services",
        },
    }

    try:
        response = requests.post(url, headers=headers, json=payload)
        response_data = response.json()

        if response.status_code == 200 and response_data.get("status") == "success":
            return {
                "success": True,
                "payment_link": response_data.get("data", {}).get("link"),
                "flw_ref": response_data.get("data", {}).get("flw_ref"),
                "tx_ref": tx_ref,
            }

        return {
            "success": False,
            "error": response_data.get("message", "Failed to initialize payment"),
        }

    except Exception as e:
        return {"success": False, "error": str(e)}


def verify_payment(tx_ref):
    """Verify a payment with Flutterwave"""

    flw_secret_key = os.environ.get("FLW_SECRET_KEY")

    if not flw_secret_key:
        return {"success": False, "error": "Flutterwave secret key not configured"}

    url = f"https://api.flutterwave.com/v3/transactions/verify_by_reference?tx_ref={tx_ref}"

    headers = {
        "Authorization": f"Bearer {flw_secret_key}",
        "Content-Type": "application/json",
    }

    try:
        response = requests.get(url, headers=headers)
        response_data = response.json()

        if response.status_code == 200 and response_data.get("status") == "success":
            return {
                "success": True,
                "data": response_data.get("data", {}),
                "status": response_data.get("data", {}).get("status", ""),
            }

        return {
            "success": False,
            "error": response_data.get("message", "Failed to verify payment"),
        }

    except Exception as e:
        return {"success": False, "error": str(e)}
