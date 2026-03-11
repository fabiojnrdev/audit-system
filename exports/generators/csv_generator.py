import csv
import hashlib
import io
from audit.models import AuditLog


def generate_csv(queryset) -> tuple[bytes, str]:
    """
    Gera CSV dos logs e retorna (bytes, hash_sha256).
    """
    buffer = io.StringIO()
    writer = csv.writer(buffer)

    writer.writerow([
        'ID', 'Timestamp', 'Usuário', 'Ação',
        'Objeto', 'ID Objeto', 'Tipo', 'IP', 'Alterações'
    ])

    for log in queryset:
        writer.writerow([
            log.id,
            log.timestamp.strftime('%Y-%m-%d %H:%M:%S'),
            str(log.user) if log.user else 'Sistema',
            log.get_action_display(),
            log.object_repr,
            log.object_id,
            str(log.content_type),
            log.ip_address or '',
            str(log.changes),
        ])

    content = buffer.getvalue().encode('utf-8-sig')  # utf-8-sig para Excel
    sha256 = hashlib.sha256(content).hexdigest()
    return content, sha256