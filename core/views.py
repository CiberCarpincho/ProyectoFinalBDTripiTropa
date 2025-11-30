from rest_framework import viewsets, filters
from rest_framework.permissions import AllowAny, IsAuthenticatedOrReadOnly

from .models import (
    User, Institute, Colors, Station,
    Device, Alert, Access,
    UserRegisterInstitute, UserRegisterStation
)
from .serializers import (
    UserSerializer, InstituteSerializer, ColorsSerializer,
    StationSerializer, DeviceSerializer, AlertSerializer,
    AccessSerializer, UserRegisterInstituteSerializer,
    UserRegisterStationSerializer
)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('userID')
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


class InstituteViewSet(viewsets.ModelViewSet):
    queryset = Institute.objects.all()
    serializer_class = InstituteSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'address']


class ColorsViewSet(viewsets.ModelViewSet):
    queryset = Colors.objects.all()
    serializer_class = ColorsSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class StationViewSet(viewsets.ModelViewSet):
    queryset = Station.objects.all()
    serializer_class = StationSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        qs = super().get_queryset()
        institute_id = self.request.query_params.get('instituteID')
        if institute_id:
            qs = qs.filter(instituteID_id=institute_id)
        return qs


class DeviceViewSet(viewsets.ModelViewSet):
    queryset = Device.objects.all()
    serializer_class = DeviceSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        qs = super().get_queryset()
        station_id = self.request.query_params.get('stationID')
        if station_id:
            qs = qs.filter(stationID_id=station_id)
        return qs


class AlertViewSet(viewsets.ModelViewSet):
    queryset = Alert.objects.all()
    serializer_class = AlertSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        qs = super().get_queryset()
        station_id = self.request.query_params.get('stationID')
        device_id = self.request.query_params.get('deviceID')
        date_from = self.request.query_params.get('from')
        date_to = self.request.query_params.get('to')

        if station_id:
            qs = qs.filter(stationID_id=station_id)
        if device_id:
            qs = qs.filter(deviceID_id=device_id)
        if date_from:
            qs = qs.filter(date__gte=date_from)
        if date_to:
            qs = qs.filter(date__lte=date_to)
        return qs


class AccessViewSet(viewsets.ModelViewSet):
    queryset = Access.objects.all()
    serializer_class = AccessSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class UserRegisterInstituteViewSet(viewsets.ModelViewSet):
    queryset = UserRegisterInstitute.objects.all()
    serializer_class = UserRegisterInstituteSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        qs = super().get_queryset()
        user_id = self.request.query_params.get('userID')
        institute_id = self.request.query_params.get('instituteID')
        if user_id:
            qs = qs.filter(userID_id=user_id)
        if institute_id:
            qs = qs.filter(instituteID_id=institute_id)
        return qs


class UserRegisterStationViewSet(viewsets.ModelViewSet):
    queryset = UserRegisterStation.objects.all()
    serializer_class = UserRegisterStationSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        qs = super().get_queryset()
        user_id = self.request.query_params.get('userID')
        station_id = self.request.query_params.get('stationID')
        if user_id:
            qs = qs.filter(userID_id=user_id)
        if station_id:
            qs = qs.filter(stationID_id=station_id)
        return qs
