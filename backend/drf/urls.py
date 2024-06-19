# from django.urls import path, include
# from rest_framework.routers import DefaultRouter
# # DefaultRouter 등록된 viewset에 대한 URL 패턴을 자동으로 생성
# # 
# from .views import fetch_cultural_events

# router = DefaultRouter()
# router.register(r'events', fetch_cultural_events)

# urlpatterns = [
#     path('', include(router.urls)),
# ]


from django.urls import path
from .views import show_external_data_form, external_data

urlpatterns = [
    path('external-data/', external_data, name='external_data'),
    path('', show_external_data_form, name='show_external_data_form')
    path('getData', views.getData, name='getData'),
]