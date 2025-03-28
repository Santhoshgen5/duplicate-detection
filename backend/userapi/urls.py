from django.urls import path
from .views import userdata


urlpatterns = [
    path("userdetails/", userdata.as_view())
]




