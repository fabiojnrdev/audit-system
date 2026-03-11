import hashlib
import io
from datetime import datetime
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Table, TableStyle,
    Paragraph, Spacer
)


def generate_pdf(queryset, filters: dict = None) -> tuple[bytes, str]:
    """
    Gera PDF dos logs e retorna (bytes, hash_sha256).
    """
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=1.5 * cm,
        leftMargin=1.5 * cm,
        topMargin=2 * cm,
        bottomMargin=2 * cm,
    )

    styles = getSampleStyleSheet()
    elements = []

    # Título
    title_style = ParagraphStyle(
        'Title',
        parent=styles['Heading1'],
        fontSize=16,
        textColor=colors.HexColor('#1a1a2e'),
        spaceAfter=6,
    )
    elements.append(Paragraph('Relatório de Auditoria', title_style))
    elements.append(Paragraph(
        f'Gerado em: {datetime.now().strftime("%d/%m/%Y %H:%M:%S")}',
        styles['Normal']
    ))
    elements.append(Spacer(1, 0.5 * cm))

    # Filtros aplicados
    if filters:
        filter_text = ' | '.join([f'{k}: {v}' for k, v in filters.items() if v])
        if filter_text:
            elements.append(Paragraph(f'Filtros: {filter_text}', styles['Normal']))
            elements.append(Spacer(1, 0.3 * cm))

    # Tabela
    headers = ['Data/Hora', 'Usuário', 'Ação', 'Objeto', 'IP']
    data = [headers]

    for log in queryset[:500]:  # limitar a 500 registros por PDF
        data.append([
            log.timestamp.strftime('%d/%m/%Y %H:%M'),
            str(log.user) if log.user else 'Sistema',
            log.get_action_display(),
            log.object_repr[:50],
            log.ip_address or '-',
        ])

    table = Table(data, colWidths=[3.5*cm, 3.5*cm, 2.5*cm, 7*cm, 3*cm])
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1a1a2e')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 9),
        ('FONTSIZE', (0, 1), (-1, -1), 8),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f5f5f5')]),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#cccccc')),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('PADDING', (0, 0), (-1, -1), 4),
    ]))

    elements.append(table)
    elements.append(Spacer(1, 0.5 * cm))

    # Rodapé com total
    elements.append(Paragraph(
        f'Total de registros: {queryset.count()}',
        styles['Normal']
    ))

    doc.build(elements)
    content = buffer.getvalue()
    sha256 = hashlib.sha256(content).hexdigest()
    return content, sha256