# File: backend/config/urls.py

from django.urls import path, include
from django.contrib import admin
from django.http import HttpResponse

urlpatterns = [
    path('admin/', admin.site.urls),
    # lambda 함수에서 status 파라미터 위치 수정
    path('', lambda request: HttpResponse(
        "<h1>Django is running, can't use Korean!</h1>", 
        content_type="text/html"
    )),  # status는 HttpResponse의 파라미터가 아님
    path('api/', include("apiapp.urls")),
]
