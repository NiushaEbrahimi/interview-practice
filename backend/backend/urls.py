from django.contrib import admin
from django.urls import path, include
from .view import index_view

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    path('api/auth/', include('authorization.urls')),
    path('',index_view)
]
