from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    UserViewSet, InstituteViewSet, ColorsViewSet,
    StationViewSet, DeviceViewSet, AlertViewSet,
    AccessViewSet, UserRegisterInstituteViewSet,
    UserRegisterStationViewSet
)

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'institutes', InstituteViewSet)
router.register(r'colors', ColorsViewSet)
router.register(r'stations', StationViewSet)
router.register(r'devices', DeviceViewSet)
router.register(r'alerts', AlertViewSet)
router.register(r'access', AccessViewSet)
router.register(r'user-register-institute', UserRegisterInstituteViewSet)
router.register(r'user-register-station', UserRegisterStationViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
