import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError

from app.config.settings import settings
from app.database.session import Base, engine
from app.middleware.headers import SecurityHeadersMiddleware
from app.middleware.error_handler import global_exception_handler, validation_exception_handler
from app.routers import auth, users, scam_detector, url_scanner, file_scanner, complaints, chatbot, admin
from app.utils.logger import logger

# Initialize all Database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="AntiHack Cybersecurity Platform API - Phishing Detection, Scam AI, Fraud Reporting & Threat Intelligence",
    docs_url="/docs",
    redoc_url="/redoc",
    contact={"name": "AntiHack Security", "email": "admin@antihack.com"}
)

# CORS Configuration (Must be registered first)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security Headers Middleware
app.add_middleware(SecurityHeadersMiddleware)

# Global Exception Handlers
app.add_exception_handler(Exception, global_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)

# Include All API Routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(users.router, prefix=settings.API_V1_STR)
app.include_router(scam_detector.router, prefix=settings.API_V1_STR)
app.include_router(url_scanner.router, prefix=settings.API_V1_STR)
app.include_router(file_scanner.router, prefix=settings.API_V1_STR)
app.include_router(complaints.router, prefix=settings.API_V1_STR)
app.include_router(chatbot.router, prefix=settings.API_V1_STR)
app.include_router(admin.router, prefix=settings.API_V1_STR)

@app.get("/", tags=["Health Check"])
def health_check():
    return {
        "status": "online",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "security": "active",
        "modules": ["auth", "scam-detector", "url-scanner", "file-scanner", "complaints", "chatbot", "admin"]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
