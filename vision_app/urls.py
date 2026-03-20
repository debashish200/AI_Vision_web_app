from django.urls import path
from .views import *

urlpatterns = [
    path('',index),
    path('api/detect/',detect_api),
    path('history/',history)
]
