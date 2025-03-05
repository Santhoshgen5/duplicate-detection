from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class GoogleToken(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    access_token = models.TextField()
    refresh_token = models.TextField(null=True, blank=True)
    expires_in = models.IntegerField(null=True, blank=True)
