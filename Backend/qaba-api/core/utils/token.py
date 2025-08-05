from django.contrib.auth.tokens import PasswordResetTokenGenerator


class EmailVerificationTokenGenerator(PasswordResetTokenGenerator):
    def _make_hash_value(self, user, timestamp):
        # Add timestamp to the hash value
        return f"{user.pk}{timestamp}{user.is_email_verified}"


email_verification_token_generator = EmailVerificationTokenGenerator()
