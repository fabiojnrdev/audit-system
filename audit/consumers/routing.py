from django.urls import re_path
from audit.consumers.audit_consumer import AuditConsumer

websocket_urlpatterns = [
    re_path(r'ws/audit/$', AuditConsumer.as_asgi()),
]