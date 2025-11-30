from django.db import models
from django.contrib.auth.hashers import make_password
from django.contrib.gis.db import models as gis_models



# -------- USER --------
class User(models.Model):
    userID = models.AutoField(primary_key=True)

    firstName = models.CharField(max_length=100)
    fLastName = models.CharField(max_length=100)
    sLastName = models.CharField(max_length=100, blank=True, null=True)

    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20)

    role = models.CharField(max_length=50)

    password = models.CharField(max_length=255)

    def save(self, *args, **kwargs):
        # Si la contraseña viene en texto plano, la encriptamos
        if self.password and not self.password.startswith("pbkdf2_"):
            self.password = make_password(self.password)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.firstName} {self.fLastName}"


# -------- INSTITUTE --------
class Institute(models.Model):
    instituteID = models.AutoField(primary_key=True)

    name = models.CharField(max_length=150)
    address = models.CharField(max_length=200)
    logo = models.ImageField(upload_to='logos/', blank=True, null=True)

    def __str__(self):
        return self.name


# -------- COLORS --------
class Colors(models.Model):
    colorID = models.AutoField(primary_key=True)

    instituteID = models.ForeignKey(Institute, on_delete=models.CASCADE)
    color = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.color} ({self.instituteID.name})"


# -------- STATION (con PostGIS) --------
class Station(models.Model):
    stationID = models.AutoField(primary_key=True)
    instituteID = models.ForeignKey(Institute, on_delete=models.CASCADE)
    name = models.CharField(max_length=150)

    # Coordenadas con PostGIS
    location = gis_models.PointField(
        geography=True,
        srid=4326,
        null=False,
        blank=False
    )

    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name


# -------- DEVICE --------
class Device(models.Model):
    deviceID = models.AutoField(primary_key=True)

    stationID = models.ForeignKey(Station, on_delete=models.CASCADE)

    typeName = models.CharField(max_length=150)
    typeDescription = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.typeName} (Station {self.stationID.stationID})"


# -------- ALERT --------
class Alert(models.Model):
    deviceID = models.ForeignKey(Device, on_delete=models.CASCADE)
    stationID = models.ForeignKey(Station, on_delete=models.CASCADE)

    date = models.DateTimeField()
    pollutantValue = models.FloatField()
    pollutantLevels = models.CharField(max_length=50)

    def __str__(self):
        return f"Alert on {self.stationID.name} ({self.pollutantLevels})"


# -------- RELACIONES M:N --------
class Access(models.Model):
    userID = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)

    def __str__(self):
        return f"Access -> User {self.userID.userID}"


class UserRegisterInstitute(models.Model):
    userID = models.ForeignKey(User, on_delete=models.CASCADE)
    instituteID = models.ForeignKey(Institute, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('userID', 'instituteID')

    def __str__(self):
        return f"User {self.userID.userID} -> Institute {self.instituteID.instituteID}"


class UserRegisterStation(models.Model):
    userID = models.ForeignKey(User, on_delete=models.CASCADE)
    stationID = models.ForeignKey(Station, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('userID', 'stationID')

    def __str__(self):
        return f"User {self.userID.userID} -> Station {self.stationID.stationID}"
