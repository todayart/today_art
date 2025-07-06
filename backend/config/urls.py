# File: backend/config/urls.py

from django.contrib import admin
from django.urls import path
from django.http import JsonResponse
from django.urls import include
import requests
import os
from dotenv import load_dotenv

# 테스트용 로직
# def react_test(request):
#     return JsonResponse({'message': 'Hello from Django!'})

def react_test(request):
    url = "https://openapi.gg.go.kr/GGCULTUREVENTSTUS"
    load_dotenv()
    api_key = os.getenv("OPEN_API_KEY")
    params = {
        "KEY": api_key,
        "Type": "json",
        "pIndex": 1,
        "pSize": 4
    }
    try:
        response = requests.get(url, params=params)
        message = response.json()
        print(message)  # 디버깅용 출력
    except Exception as e:
        message = {"에러": str(e)}
        print(f"패칭 오류: {e}, message: {message}")
    return JsonResponse(message, safe=False)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('react-test/', react_test),    # React 연동 테스트용 엔드포인트
]
