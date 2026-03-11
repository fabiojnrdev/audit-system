from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from audit.models import AuditLog


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Adiciona dados do usuário na resposta do token."""

    def validate(self, attrs):
        data = super().validate(attrs)
        data['user'] = {
            'id': self.user.id,
            'username': self.user.username,
            'email': self.user.email,
            'is_staff': self.user.is_staff,
        }
        return data


class AuditLogSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()
    content_type = serializers.StringRelatedField()
    action_display = serializers.CharField(source='get_action_display', read_only=True)

    class Meta:
        model = AuditLog
        fields = [
            'id',
            'user',
            'content_type',
            'object_id',
            'object_repr',
            'action',
            'action_display',
            'changes',
            'ip_address',
            'user_agent',
            'timestamp',
        ]