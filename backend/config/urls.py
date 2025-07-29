# File: backend/config/urls.py

from django.contrib import admin
from django.urls import path
from django.http import JsonResponse
import requests
import os
from dotenv import load_dotenv
load_dotenv()

# 테스트용 로직
# def react_test(request):
#     return JsonResponse({'message': 'Hello from Django!'})

def fetch_events(pSize):
    url = "https://openapi.gg.go.kr/GGCULTUREVENTSTUS"
    api_key = os.getenv("OPEN_API_KEY")
    params = {
        "KEY": api_key,
        "Type": "json",
        "pIndex": 1,
        "pSize": pSize
    }
    try:
        response = requests.get(url, params=params)
        data = response.json()
        raw_list = data.get("GGCULTUREVENTSTUS", [])
        if len(raw_list) > 1:
            events = raw_list[1].get("row", [])
        else:
            events = []
        clean_events = []
        for event in events:
            clean_event = {
                "TITLE": event.get("TITLE"),
                "IMAGE_URL": event.get("IMAGE_URL"),
                "CATEGORY_NM": event.get("CATEGORY_NM"),
                "BEGIN_DE": event.get("BEGIN_DE"),
                "END_DE": event.get("END_DE"),
                "HOST_INST_NM": event.get("HOST_INST_NM"),
                "HMPG_URL" : event.get("HMPG_URL"),
            }
            clean_events.append(clean_event)
    except Exception as e:
        print(f"패칭 오류: {e}")
        clean_events = {"에러": str(e)}
    return clean_events

def entry(request):
    message = fetch_events(8)
    print(message)  # 디버깅용 출력
    return JsonResponse(message, safe=False)

def infinity_scroll(request):
    message = fetch_events(12)
    print(message)  # 디버깅용 출력
    return JsonResponse(message, safe=False)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/entry/', entry, name='entry'), 
    path('api/infinity_scroll/', infinity_scroll, name='infinity_scroll'),
]
