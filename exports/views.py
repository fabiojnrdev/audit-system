from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from audit.models import AuditLog
from exports.generators.csv_generator import generate_csv
from exports.generators.pdf_generator import generate_pdf


class ExportCSVView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        queryset = AuditLog.objects.select_related(
            'user', 'content_type'
        ).order_by('-timestamp')

        # Filtros opcionais via query params
        action = request.query_params.get('action')
        user_id = request.query_params.get('user')
        if action:
            queryset = queryset.filter(action=action)
        if user_id:
            queryset = queryset.filter(user_id=user_id)

        content, sha256 = generate_csv(queryset)

        response = HttpResponse(content, content_type='text/csv; charset=utf-8-sig')
        response['Content-Disposition'] = 'attachment; filename="audit_log.csv"'
        response['X-Content-SHA256'] = sha256
        return response


class ExportPDFView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        queryset = AuditLog.objects.select_related(
            'user', 'content_type'
        ).order_by('-timestamp')

        filters = {}
        action = request.query_params.get('action')
        user_id = request.query_params.get('user')

        if action:
            queryset = queryset.filter(action=action)
            filters['Ação'] = action
        if user_id:
            queryset = queryset.filter(user_id=user_id)
            filters['Usuário ID'] = user_id

        content, sha256 = generate_pdf(queryset, filters)

        response = HttpResponse(content, content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename="audit_log.pdf"'
        response['X-Content-SHA256'] = sha256
        return response