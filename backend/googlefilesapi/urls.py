from django.urls import path
from .views import GoogleDriveFileListViewe,GoogleDriveDuplicateFilesView

urlpatterns = [
    path("google-drive/files/", GoogleDriveFileListViewe.as_view() ),
    path("google-drive/duplicates/",GoogleDriveDuplicateFilesView.as_view() )
]
