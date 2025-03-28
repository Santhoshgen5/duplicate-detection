from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
# Create your views here.


class userdata(APIView):
   
    def get(self, request):  # Include `self` as the first argument
        username = request.user.first_name
        picture = request.user.last_name
        return Response({"name": username, "profile":picture}, status=200)
        
        