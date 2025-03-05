from django.urls import path
from .views import GoogleDriveFileListViewe

urlpatterns = [
    path("google-drive/files/", GoogleDriveFileListViewe.as_view() )
]
