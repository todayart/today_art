from django.urls import path
from .views import entries_api, _load_all_entries, calendar_api

urlpatterns = [
    path("", _load_all_entries, name="_load_all_entries"),
    path("entries/", entries_api, name="entries_api"),
    path("calendar/", calendar_api, name="calendar_api"),
]