from django.urls import path

from .views import InitiatePropertyPaymentView, TransactionListView, VerifyPaymentView

urlpatterns = [
    path(
        "initiate-property-payment/",
        InitiatePropertyPaymentView.as_view(),
        name="initiate-property-payment",
    ),
    path(
        "verify-payment/<str:tx_ref>/",
        VerifyPaymentView.as_view(),
        name="verify-payment",
    ),
    path("history/", TransactionListView.as_view(), name="transaction-history"),
]
