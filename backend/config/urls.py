# File: backend/config/urls.py

from django.urls import path, include
from django.contrib import admin

from django.http import JsonResponse

import requests
import os

# 테스트용 로직
# def react_test(request):
#     return JsonResponse({'message': 'Hello from Django!'})


urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/", include("apiapp.urls")),   # apiapp.urls 연결
]
