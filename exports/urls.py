from django.urls import path
from exports.views import ExportCSVView, ExportPDFView

urlpatterns = [
    path('csv/', ExportCSVView.as_view(), name='export_csv'),
    path('pdf/', ExportPDFView.as_view(), name='export_pdf'),
]