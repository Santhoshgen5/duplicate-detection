import requests
from django.http import JsonResponse, HttpResponse
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from login.models import GoogleToken
from rest_framework.response import Response

def refresh_google_token(user):
    google_token = GoogleToken.objects.get(user=user)
    refresh_token = google_token.refresh_token

    data = {
        "client_id": "933890705867-blj09m00jt39h4gdud6k86v0ve4lbr2s.apps.googleusercontent.com",
        "client_secret": "",
        "refresh_token": refresh_token,
        "grant_type": "refresh_token",
    }
    response = requests.post("https://oauth2.googleapis.com/token", data=data)

    if response.status_code == 200:
        new_token = response.json().get("access_token")
        google_token.access_token = new_token
        google_token.save()
        return new_token
    else:
        print(f"Token refresh failed: {response.status_code} - {response.text}")
        return None

class GoogleDriveFileListViewe(APIView):
    
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        try:
            google_token = GoogleToken.objects.get(user=user)
        except GoogleToken.DoesNotExist:
            return Response({"error": "No Google token found for user"}, status=400)

        access_token = google_token.access_token
        drive_url = "https://www.googleapis.com/drive/v3/files"

        headers = {"Authorization": f"Bearer {access_token}"}
        response = requests.get(drive_url, headers=headers)

        if response.status_code == 401:  # Token expired
            print("Google access token expired. Refreshing...")
            new_access_token = refresh_google_token(user)
            if new_access_token:
                headers["Authorization"] = f"Bearer {new_access_token}"
                response = requests.get(drive_url, headers=headers)
            else:
                return Response({"error": "Failed to refresh access token"}, status=401)

        print(f"Google Drive API Response: {response.status_code} - {response.text}")

        if response.status_code == 200:
            return Response(response.json())  # Returns a list of files
        else:
            return Response({"error": "Failed to fetch files", "details": response.json()}, status=response.status_code)