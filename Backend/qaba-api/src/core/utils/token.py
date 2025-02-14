import time

from django.conf import settings
from django.contrib.auth.tokens import PasswordResetTokenGenerator


class EmailVerificationTokenGenerator(PasswordResetTokenGenerator):
    def _make_hash_value(self, user, timestamp):
        # Add timestamp to the hash value
        return f"{user.pk}{timestamp}{user.is_email_verified}"

    def make_token(self, user):
        """
        Generate token with embedded timestamp
        """
        timestamp = int(time.time())
        return f"{timestamp}.{super().make_token(user)}"

    def check_token(self, user, token):
        """
        Check if token is valid and not expired
        """
        try:
            # Split timestamp from token
            timestamp_str, token_value = token.split(".")
            timestamp = int(timestamp_str)

            # Check token validity
            if not super().check_token(user, token_value):
                return False

            # Check expiration
            seconds_diff = time.time() - timestamp
            return seconds_diff <= settings.EMAIL_VERIFICATION_TIMEOUT

        except (ValueError, AttributeError):
            return False


email_verification_token_generator = EmailVerificationTokenGenerator()
