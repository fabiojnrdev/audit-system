import threading

_request_local = threading.local()


def get_current_request():
    # Retorna o request da thread atual.
    return getattr(_request_local, 'request', None)


class AuditMiddleware:
    """
    Middleware que armazena o request atual em uma thread local,
    permitindo que os signals acessem o usuário e IP sem precisar
    receber o request explicitamente.
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        _request_local.request = request
        try:
            response = self.get_response(request)
        finally:
            _request_local.request = None
        return response