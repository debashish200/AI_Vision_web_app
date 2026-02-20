from django.urls import path
from .views import *

urlpatterns = [
    path('',index),
    path('detect/',detect),
    path('history/',history)
]
