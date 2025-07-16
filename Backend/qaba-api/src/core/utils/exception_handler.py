from rest_framework import status
from rest_framework.exceptions import APIException
from rest_framework.views import exception_handler


class APIError(APIException):
    def __init__(self, message, errors=None, status_code=status.HTTP_400_BAD_REQUEST):
        self.status_code = status_code
        self.detail = message
        self.errors = errors if errors is not None else {}


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is not None:
        if isinstance(exc, APIError):
            message = exc.detail
            error_details = exc.errors if exc.errors else response.data
        else:
            message = response.data.get("detail", "An error occurred")
            error_details = response.data

        response.data = {
            "success": False,
            "message": message,
            "data": None,
            "errors": error_details,
        }

    return response
