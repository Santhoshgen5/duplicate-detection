from google.oauth2 import id_token
import requests
from django.contrib.auth import login, authenticate  
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from django.utils.text import slugify
import requests as http_requests  

from rest_framework_simplejwt.tokens import RefreshToken
from .models import GoogleToken

GOOGLE_CLIENT_ID = "933890705867-blj09m00jt39h4gdud6k86v0ve4lbr2s.apps.googleusercontent.com"


def verify_google_token(id_token):
    
    response = http_requests.get(f"https://oauth2.googleapis.com/tokeninfo?id_token={id_token}")
    if response.status_code != 200:
        return None
    
    return response.json()


def exchange_code_for_token(auth_code):
    """Exchanges authorization code for access and refresh tokens."""
    data = {
        "client_id": GOOGLE_CLIENT_ID,
        "client_secret": "",
        "code": auth_code,
        "grant_type": "authorization_code",
        "redirect_uri": "http://localhost:5173"
    }
    headers = {
        "Content-Type": "application/x-www-form-urlencoded"
    }
    print("echange response : before")
    response = requests.post("https://oauth2.googleapis.com/token", data=data,  headers=headers)
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Error: {response.status_code} - {response.text}")
        return None



class GoogleLoginViewe(APIView):  
    permission_classes = [AllowAny]

    def post(self, request):
        auth_code = request.data.get("auth_code")  # Get Auth Code from Frontend
        if not auth_code:   
            return Response({"error": "Auth code not provided"}, status=400)
        
      
        token_data = exchange_code_for_token(auth_code)
        if not token_data or "error" in token_data:
            return Response({"error": "Invalid auth code"}, status=400)
           
        
        access_token = token_data.get("access_token")
        refresh_token = token_data.get("refresh_token")
        id_token_data = token_data.get("id_token")


    
        # Verify ID token to get user info
        google_info = verify_google_token(id_token_data)
        if not google_info or "error" in google_info:
            
            return Response({"error": "Invalid ID token"}, status=400)
      
        
        email = google_info.get("email")
        name = google_info.get("name")

        if not email:
           
            return Response({"error": "Google authentication failed"}, status=400)

        # Ensure unique username in Django
        
        user, created = User.objects.get_or_create(
            email=email,
            defaults={"username": slugify(email), "first_name": name}
        )

        
        # Authenticate and log in user
        
       
        if user is not None:
            user.backend = 'django.contrib.auth.backends.ModelBackend'
            login(request, user)  

        # Store access token securely
        GoogleToken.objects.update_or_create(
            user=user, 
            defaults={"access_token": access_token, "refresh_token": refresh_token}
        )
       
        # Generate JWT for user session
        refresh = RefreshToken.for_user(user)
        access_token_jwt = str(refresh.access_token)
        
      
        return Response({
            "access_token": access_token_jwt,
            "refresh_token": str(refresh),
            "user": {"email": user.email, "name": user.first_name}
        })


