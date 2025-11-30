from rest_framework import serializers
from .models import (
    User, Institute, Colors, Station,
    Device, Alert, Access,
    UserRegisterInstitute, UserRegisterStation
)
from django.contrib.auth.hashers import make_password


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
            'userID', 'firstName', 'fLastName', 'sLastName',
            'email', 'phone', 'role', 'password',
        ]

    def create(self, validated_data):
        password = validated_data.pop('password')
        validated_data['password'] = make_password(password)
        return User.objects.create(**validated_data)

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.password = make_password(password)
        instance.save()
        return instance


class InstituteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Institute
        fields = '__all__'


class ColorsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Colors
        fields = '__all__'


class StationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Station
        fields = '__all__'


class DeviceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Device
        fields = '__all__'


class AlertSerializer(serializers.ModelSerializer):
    class Meta:
        model = Alert
        fields = '__all__'


class AccessSerializer(serializers.ModelSerializer):
    class Meta:
        model = Access
        fields = '__all__'


class UserRegisterInstituteSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserRegisterInstitute
        fields = '__all__'


class UserRegisterStationSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserRegisterStation
        fields = '__all__'
