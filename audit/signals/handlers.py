from django.db.models.signals import post_save, post_delete, pre_save
from django.dispatch import receiver
from django.contrib.contenttypes.models import ContentType
from audit.models import AuditLog

EXCLUDED_MODELS = {'Audition', 'LogEntry', 'Session'}
def get_changes(old_instance, new_instance):
    """Compara duas instâncias e retorna dict com campos alterados."""
    changes = {}
    fields = [f.name for f in new_instance._meta.fields]

    for field in fields:
        old_value = getattr(old_instance, field, None)
        new_value = getattr(new_instance, field, None)

        if old_value != new_value:
            changes[field] = {
                'before': str(old_value) if old_value is not None else None,
                'after': str(new_value) if new_value is not None else None,
            }
    return changes
def create_audit_log(instance, action, changes=None, request= None):
    """Cria o registro de auditoria"""
    content_type = ContentType.objects.get_for_model(instance)
    
    user = None
    ip_address = None
    user_agent = ''
    
    if request:
        user = request.user if request.user.is_authenticated else None
        ip_address = get_client_ip(request)
        user_agent = request.META.get('HTTP_USER_AGENT', '')
        
    AuditLog.objects.create(
        user = user,
        content_type=content_type,
        object_id=str(instance.pk),
        object_repr=str(instance),
        action=action,
        changes=changes or {},
        ip_address=ip_address,
        user_agent=user_agent,
    )
def get_client_ip(request):
    """Extrai o IP real do cliente."""
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        return x_forwarded_for.split(',')[0].strip()
    return request.META.get('REMOTE_ADDR')


# Armazena snapshots antes de salvar para comparar depois
_pre_save_cache = {}
@receiver(pre_save)
def capture_pre_save(sender,instance, **kwargs):
    if sender.__name__ in EXCLUDED_MODELS:
        return
    if not instance.pk:
        return
    try:
        _pre_save_cache[instance.pk] = sender.objects.get(pk=instance.pk)
    except sender.DoesNotExist:
        pass
    
@receiver(post_save)
def handle_post_save(sender, instance, created, **kwargs):
    if sender.__name__ in EXCLUDED_MODELS:
        return

    request = kwargs.get('request')
    if created:
        fields = {f.name: str(getattr(instance, f.name)) for f in instance._meta.fields}
        changes = {k: {'before': None, 'after': v} for k, v in fields.items()}
        create_audit_log(instance, AuditLog.Action.CREATE, changes, request)
    else:
        old_instance = _pre_save_cache.pop(instance.pk, None)
        if old_instance:
            changes = get_changes(old_instance, instance)
            if changes:
                create_audit_log(instance, AuditLog.Action.UPDATE, changes, request)


@receiver(post_delete)
def handle_post_delete(sender, instance, **kwargs):
    if sender.__name__ in EXCLUDED_MODELS:
        return

    request = kwargs.get('request')
    fields = {f.name: str(getattr(instance, f.name)) for f in instance._meta.fields}
    changes = {k: {'before': v, 'after': None} for k, v in fields.items()}
    create_audit_log(instance, AuditLog.Action.DELETE, changes, request)