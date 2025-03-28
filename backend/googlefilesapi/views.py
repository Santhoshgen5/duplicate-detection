import requests
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from login.models import GoogleToken
from rest_framework.response import Response
from collections import defaultdict

# Google API Credentials
CLIENT_ID = "your client id"
CLIENT_SECRET = "your client secret"
GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"
GOOGLE_DRIVE_API_URL = "https://www.googleapis.com/drive/v3/files"

# Global variable to store files
files = []

def refresh_google_token(user):
    """Refreshes Google OAuth 2.0 access token if expired."""
    try:
        google_token = GoogleToken.objects.get(user=user)
        refresh_token = google_token.refresh_token

        data = {
            "client_id": CLIENT_ID,
            "client_secret": CLIENT_SECRET,
            "refresh_token": refresh_token,
            "grant_type": "refresh_token",
            "scope": "https://www.googleapis.com/auth/drive"
        }
        response = requests.post(GOOGLE_TOKEN_URL, data=data)

        if response.status_code == 200:
            new_token = response.json().get("access_token")
            google_token.access_token = new_token
            google_token.save()
            return new_token
        else:
            print(f"Token refresh failed: {response.status_code} - {response.text}")
            return None
    except GoogleToken.DoesNotExist:
        print("Google token not found for user")
        return None


class GoogleDriveFileListViewe(APIView):
    """Fetches all Google Drive files for authenticated users."""
    permission_classes = [IsAuthenticated]

    def get_drive_files(self, access_token):
        """Fetches Google Drive files, handling pagination."""

        global files  # Use the global files list
        files.clear()  # Clear the list before fetching new files

        next_page_token = None

        while True:
            headers = {
                "Authorization": f"Bearer {access_token}",
                "Accept": "application/json"
            }
            params = {
                "pageSize": 100,
                "fields": "nextPageToken, files(id, name, mimeType, md5Checksum, webViewLink, createdTime, modifiedTime)",
                "supportsAllDrives": "true",
                "includeItemsFromAllDrives": "true"
            }

            if next_page_token:
                params["pageToken"] = next_page_token

            response = requests.get(GOOGLE_DRIVE_API_URL, headers=headers, params=params)

            if response.status_code == 200:
                data = response.json()
                files.extend(data.get("files", []))
                next_page_token = data.get("nextPageToken")

                if not next_page_token:
                    break
            else:
                return None, response

        return files, None

    def get(self, request):
        user = request.user

        try:
            google_token = GoogleToken.objects.get(user=user)
        except GoogleToken.DoesNotExist:
            return Response({"error": "No Google token found for user"}, status=400)

        access_token = google_token.access_token
        files, error_response = self.get_drive_files(access_token)

        if error_response:
            if error_response.status_code == 401:
                print("Google access token expired. Refreshing...")
                new_access_token = refresh_google_token(user)
                if new_access_token:
                    files, error_response = self.get_drive_files(new_access_token)
                else:
                    return Response({"error": "Failed to refresh access token"}, status=401)

        if files:
            return Response({"files": files})
        else:
            return Response({"error": "Failed to fetch files", "details": error_response.json()}, status=error_response.status_code)



class GoogleDriveDuplicateFilesView(APIView):
    """Detects duplicate files by name and content."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        global files

        if not files:
            return Response({"error": "No files found. Please fetch files first."}, status=400)

        # Group files by name and content checksum
        name_dict = defaultdict(list)
        checksum_dict = defaultdict(list)

        for file in files:
            name_key = file["name"].lower()  # Case insensitive filename match
            checksum = file.get("md5Checksum")  # Content hash

            name_dict[name_key].append(file)
            
            # Only add to checksum dict if checksum exists
            if checksum:
                checksum_dict[checksum].append(file)

        # Identify duplicate files
        name_duplicates = {k: v for k, v in name_dict.items() if len(v) > 1}
        content_duplicates = {k: v for k, v in checksum_dict.items() if len(v) > 1}

        # Enhanced alert message
        if name_duplicates and content_duplicates:
            alert = "Duplicate files found by both name and content!"
        elif name_duplicates:
            alert = "Duplicate files found by name!"
        elif content_duplicates:
            alert = "Duplicate files found by content!"
        else:
            alert = "No duplicates detected."

        return Response({
            "duplicates": {
                "name_duplicates": name_duplicates,
                "content_duplicates": content_duplicates
            },
            "alert": alert
        })
