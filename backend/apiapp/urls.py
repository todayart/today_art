from django.urls import path
from .views import entries_api
from .views import _load_all_entries

urlpatterns = [
    path("", _load_all_entries, name="_load_all_entries"),
    path("entries/", entries_api, name="entries_api"),
]