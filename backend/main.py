"""
LandslideGuard: AI-Powered Landslide Early Warning & Risk Monitoring System
SIH Problem Statement: 26001 (MDoNER & GSI)
Main FastAPI Application Entrypoint
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from backend.config import ALLOWED_ORIGINS, UPLOAD_DIR
from backend.database.database import engine, Base
from backend.database.seeds import seed_database
from backend.routers import susceptibility, predict, reports, sensors, alerts, weather

# Initialize database schema & seed initial state
Base.metadata.create_all(bind=engine)
try:
    seed_database()
except Exception as e:
    print(f"Warning during seed: {e}")

app = FastAPI(
    title="LandslideGuard Backend API",
    description="AI-Based Early Warning & Landslide Risk Monitoring Platform for North Eastern Region (SIH 26001)",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve uploaded report photos
if os.path.exists(UPLOAD_DIR):
    app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")

# Mount API Routers
app.include_router(susceptibility.router)
app.include_router(predict.router)
app.include_router(reports.router)
app.include_router(sensors.router)
app.include_router(alerts.router)
app.include_router(weather.router)

@app.get("/")
def root():
    return {
        "service": "LandslideGuard AI Platform",
        "problem_statement": "SIH-26001",
        "status": "Operational",
        "version": "1.0.0",
        "docs": "/docs",
        "endpoints": {
            "zones": "/api/zones",
            "predict_lstm": "/api/predict/lstm",
            "crowdsource_reports": "/api/reports",
            "sensors": "/api/sensors",
            "alerts": "/api/alerts/cap"
        }
    }

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "LandslideGuard Backend",
        "ai_models": {
            "susceptibility_engine": "online",
            "temporal_lstm": "online",
            "yolov8_geotech_vision": "online"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="127.0.0.1", port=8000, reload=True)
