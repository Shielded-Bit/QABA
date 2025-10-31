from django.http import JsonResponse


def health_check(request):
    """Return a simple response for external health probes."""
    return JsonResponse({"status": "ok"})
