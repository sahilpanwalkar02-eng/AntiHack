from fastapi import Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from app.utils.logger import logger

async def global_exception_handler(request: Request, exc: Exception):
    """Catch unhandled application exceptions and log traceback safely."""
    logger.error(f"Unhandled Exception on {request.method} {request.url.path}: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": "Internal Server Error",
            "message": "An unexpected security system error occurred. Please try again later.",
            "status_code": 500
        }
    )

async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Handle request validation errors cleanly."""
    logger.warning(f"Validation Error on {request.method} {request.url.path}: {exc.errors()}")
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "error": "Validation Error",
            "details": exc.errors(),
            "status_code": 422
        }
    )
