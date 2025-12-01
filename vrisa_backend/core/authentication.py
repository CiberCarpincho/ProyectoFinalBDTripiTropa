import jwt
from datetime import datetime, timedelta, timezone

from django.conf import settings
from rest_framework.authentication import BaseAuthentication
from rest_framework import exceptions

from .models import User


def create_jwt_for_user(user):
    """
    Crea un JWT para un usuario de nuestro modelo core.User.
    """
    now = datetime.now(timezone.utc)
    payload = {
        "user_id": user.userID,
        "email": user.email,
        "role": user.role,
        "exp": now + timedelta(hours=1),  # expira en 1 hora
        "iat": now,
    }
    token = jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")
    # En PyJWT >= 2.x esto ya devuelve str
    return token


class JWTAuthentication(BaseAuthentication):
    """
    Autenticación personalizada JWT.
    Lee el header: Authorization: Bearer <token>
    """

    keyword = "Bearer"

    def authenticate(self, request):
        auth_header = request.headers.get("Authorization")

        if not auth_header:
            return None  # No autenticamos, otras clases pueden intentar

        try:
            prefix, token = auth_header.split()
        except ValueError:
            raise exceptions.AuthenticationFailed("Formato de Authorization inválido")

        if prefix != self.keyword:
            return None  # Otro esquema, ignoramos

        try:
            payload = jwt.decode(
                token,
                settings.SECRET_KEY,
                algorithms=["HS256"],
            )
        except jwt.ExpiredSignatureError:
            raise exceptions.AuthenticationFailed("Token expirado")
        except jwt.InvalidTokenError:
            raise exceptions.AuthenticationFailed("Token inválido")

        user_id = payload.get("user_id")
        if user_id is None:
            raise exceptions.AuthenticationFailed("Token sin user_id")

        try:
            user = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            raise exceptions.AuthenticationFailed("Usuario no encontrado")

        # DRF espera que retornemos (user, auth)
        return (user, None)
