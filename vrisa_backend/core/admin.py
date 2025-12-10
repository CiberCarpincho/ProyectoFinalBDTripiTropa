from django.contrib import admin
from .models import (
    User, Institute, Colors, Station,
    Device, Alert, Access,
    UserRegisterInstitute, UserRegisterStation, AlertConfiguration
)

# Registrar todos los modelos en el admin
admin.site.register(User)
admin.site.register(Institute)
admin.site.register(Colors)
admin.site.register(Station)
admin.site.register(Device)
admin.site.register(Alert)
admin.site.register(AlertConfiguration)
admin.site.register(Access)
admin.site.register(UserRegisterInstitute)
admin.site.register(UserRegisterStation)