from starlette.middleware.base import BaseHTTPMiddleware
from fastapi import Request

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Adds enterprise HTTP security headers (Helmet equivalent)."""
    async def dispatch(self, request: Request, call_next):
        if request.method == "OPTIONS":
            return await call_next(request)
            
        response = await call_next(request)
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        return response
