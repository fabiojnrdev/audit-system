from rest_framework import serializers
from audit.models import AuditLog

class AuditLogSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()
    content_type = serializers.StringRelatedField()

    class Meta:
        model = AuditLog
        fields = [
            'id',
            'user',
            'content_type',
            'object_id',
            'object_repr',
            'action',
            'changes',
            'ip_address',
            'user_agent',
            'timestamp',
        ]