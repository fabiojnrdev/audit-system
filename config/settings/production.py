from .base import *
import sentry_sdk

DEBUG = False
MIDDLEWARE = ['whitenoise.middleware.WhiteNoiseMiddleware'] + MIDDLEWARE

STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

sentry_sdk.init(
    dsn=config('SENTRY_DSN', default=''),
)